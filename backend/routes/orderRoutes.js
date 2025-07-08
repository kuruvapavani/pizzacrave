const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getUserOrders,
  placeOrder,
  updatePaymentStatus,
  updateOrderStatus,
  deleteOrder,
  getOrderDetails
} = require("../controllers/orderController");

const authenticateUser = require("../config/auth");
const authorizeAdmin = require("../config/adminAuth");

router.use(authenticateUser);
router.post("/", placeOrder);
router.get("/:userId", getUserOrders);
router.get("/", authorizeAdmin, getAllOrders);
router.patch("/payment/:orderId", authorizeAdmin, updatePaymentStatus);
router.patch("/status/:orderId", authorizeAdmin, updateOrderStatus);
router.delete("/:orderId", authorizeAdmin, deleteOrder);
router.get("/details/:orderId",getOrderDetails);
module.exports = router;
