const express = require("express");
const router = express.Router();
const {
  adminLogin,
  getAllUsers,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/adminController");

// ✅ Admin login route
router.post("/login", adminLogin);

// ✅ Get all users
router.get("/users", getAllUsers);

// ✅ Get all products
router.get("/products", getAllProducts);

// ✅ Add new product
router.post("/products", addProduct);

// ✅ Update product
router.put("/products/:id", updateProduct);

// ✅ Delete product
router.delete("/products/:id", deleteProduct);

module.exports = router;
