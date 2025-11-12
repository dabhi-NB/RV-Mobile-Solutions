// backend/routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); // your middleware
const cartCtrl = require("../controllers/cartController");

router.get("/", protect, cartCtrl.getCart);
router.post("/", protect, cartCtrl.addOrUpdateCart);
router.put("/:id", protect, cartCtrl.updateCartItem);
router.delete("/:id", protect, cartCtrl.removeCartItem);

module.exports = router;
