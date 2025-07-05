const express = require("express");
const {
  addToCart,
  getCartByUserId,
  removeFromCart,
  clearCart,
  updateCartItem,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userid", getCartByUserId);
router.delete("/remove", removeFromCart);
router.delete("/clear/:userid", clearCart);
router.put("/update", updateCartItem);

module.exports = router;
