const express = require("express");
const {
  addToCart,
  getCartByUserId,
  removeFromCart,
  clearCart,
  updateCartItem,
} = require("../controllers/cartController");

const authenticateUser = require("../config/auth");

const router = express.Router();

router.post("/add", authenticateUser, addToCart);
router.get("/:userid", authenticateUser, getCartByUserId);
router.delete("/remove", authenticateUser, removeFromCart);
router.delete("/clear/:userid", authenticateUser, clearCart);
router.put("/update", authenticateUser, updateCartItem);

module.exports = router;
