// backend/controllers/orderController.js
const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
  try {
    const { items, totalPrice, paymentMethod, shippingAddress } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: "Cart empty" });

    const order = new Order({
      user: req.user._id,
      orderItems: items,
      totalPrice,
      paymentMethod,
      shippingAddress,
    });
    const created = await order.save();

    // clear cart
    await Cart.deleteMany({ user: req.user._id });

    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error placing order" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findOne({ _id: id, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.isDelivered) return res.status(400).json({ message: "Cannot cancel delivered order" });
    order.status = "Cancelled";
    await order.save();
    res.json({ message: "Order cancelled" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error cancelling order" });
  }
};
