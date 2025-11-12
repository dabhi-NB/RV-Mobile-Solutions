const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  orderId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  email: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  address: {
    fullname: String,
    phone: String,
    addressLine: String,
    city: String,
    postalCode: String,
  },
  subtotal: Number,
  shipping: Number,
  tax: Number,
  discount: Number,
  total: Number,
  paymentMethod: { type: String, enum: ["cod", "online"], default: "cod" },
  paymentStatus: { type: String, default: "pending" }, // pending, completed, failed
  status: { type: String, default: "pending" }, // pending, confirmed, shipped, delivered, cancelled
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);