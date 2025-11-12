const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const twilio = require("twilio");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const auth = require("../middleware/auth"); // your auth middleware

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
// Get single order
router.get("/:orderId", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Create Razorpay order
router.post("/create-order", auth, async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    const order = await razorpay.orders.create({
      amount: Math.round(amount), // paise
      currency: currency || "INR",
      receipt: receipt || `order_${Date.now()}`,
    });
    res.json(order);
  } catch (err) {
    console.error("Razorpay order error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Verify payment & create order
router.post("/verify", auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      email,
      orderDetails,
    } = req.body;

    // Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid signature" });
    }

    // Create order in DB
    const newOrder = new Order({
      userId: req.user?.id || req.user?._id,
      orderId: orderId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      email: email,
      items: orderDetails.items || [],
      address: orderDetails.address || {},
      subtotal: orderDetails.subtotal || 0,
      shipping: orderDetails.shipping || 0,
      tax: orderDetails.tax || 0,
      total: orderDetails.total || 0,
      paymentMethod: "online",
      paymentStatus: "completed",
      status: "confirmed",
      createdAt: new Date(),
    });

    await newOrder.save();

    // Clear user's cart
    await Cart.deleteMany({ userId: req.user?.id || req.user?._id });

    // Send SMS + WhatsApp to admin
    const adminPhone = process.env.ADMIN_PHONE;
    const itemsList = (orderDetails.items || [])
      .map((i) => `${i.name} (Qty: ${i.quantity})`)
      .join(", ");

    const message = `🎯 New Order Received!\n\nOrder ID: ${orderId}\nCustomer: ${orderDetails.address?.fullname || "N/A"}\nPhone: ${orderDetails.address?.phone || "N/A"}\n\nItems: ${itemsList}\n\nTotal: ₹${orderDetails.total}\nPayment: Online (Completed)\n\nAddress: ${orderDetails.address?.addressLine}, ${orderDetails.address?.city}`;

    // Send SMS
    try {
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE,
        to: adminPhone,
      });
      console.log("SMS sent to admin");
    } catch (sms_err) {
      console.warn("SMS failed:", sms_err.message);
    }

    // Send WhatsApp (requires Twilio WhatsApp Business Account)
    try {
      await twilioClient.messages.create({
        body: message,
        from: `whatsapp:${process.env.TWILIO_PHONE}`,
        to: `whatsapp:${adminPhone}`,
      });
      console.log("WhatsApp sent to admin");
    } catch (wa_err) {
      console.warn("WhatsApp failed:", wa_err.message);
    }

    res.json({
      success: true,
      message: "Payment verified and order created",
      orderId: newOrder._id,
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;