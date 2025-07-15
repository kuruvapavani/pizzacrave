const express = require("express");
const router = express.Router();
const authenticateUser = require("../config/auth");

const {
  createStripeSession,
  confirmStripePayment,
} = require("../controllers/paymentController");

router.post("/create-stripe-session", authenticateUser, createStripeSession);
router.post("/confirm-stripe", confirmStripePayment);

module.exports = router;
