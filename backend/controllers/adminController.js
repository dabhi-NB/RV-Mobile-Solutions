const User = require("../models/user");
const Product = require("../models/product");

// ✅ Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@example.com" && password === "admin123") {
    res.json({ message: "Admin login successful" });
  } else {
    res.status(401).json({ message: "Invalid admin credentials" });
  }
};

// ✅ Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ✅ Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// ✅ Add Product
const addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Error adding product" });
  }
};

// ✅ Update Product
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Product updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating product" });
  }
};

// ✅ Delete Product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

module.exports = {
  adminLogin,
  getAllUsers,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
