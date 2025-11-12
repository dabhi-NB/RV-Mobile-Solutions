// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const orderCtrl = require("../controllers/orderController");

router.post("/", protect, orderCtrl.createOrder);
router.get("/myorders", protect, orderCtrl.getMyOrders);
router.put("/:id/cancel", protect, orderCtrl.cancelOrder);

module.exports = router;
