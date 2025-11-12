// backend/controllers/cartController.js
const CartItem = require("../models/Cart");
const Product = require("../models/Product");

// ✅ Get user cart
exports.getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user: req.user._id }).populate("product");
    res.json(cartItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching cart" });
  }
};

// ✅ Add or update cart item
exports.addOrUpdateCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    if (!productId) return res.status(400).json({ message: "Missing productId" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // find existing item
    let cartItem = await CartItem.findOne({ user: req.user._id, product: productId });

    if (cartItem) {
      cartItem.quantity += qty || 1;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        user: req.user._id,
        product: productId,
        quantity: qty || 1,
      });
    }

    res.json(await cartItem.populate("product"));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error adding to cart" });
  }
};

// ✅ Update quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { qty } = req.body;
    const cartItem = await CartItem.findById(req.params.id);

    if (!cartItem || cartItem.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Item not found" });
    }

    cartItem.quantity = qty;
    await cartItem.save();
    res.json(await cartItem.populate("product"));
  } catch (err) {
    res.status(500).json({ message: "Server error updating cart" });
  }
};

// ✅ Remove item
exports.removeCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.findById(req.params.id);
    if (!cartItem || cartItem.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Item not found" });
    }

    await cartItem.deleteOne();
    res.json({ message: "Removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Server error removing cart item" });
  }
};
