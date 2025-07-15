const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

const placeOrderLogic = async (userId, address, status = "Placed") => {
  if (!address) {
    throw new Error("Address is required");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const sanitize = (name) => name.replace(/[^a-zA-Z0-9 ,]/g, "").trim();
  const pizzaNames = cart.items
    .map((item) => sanitize(item.name))
    .filter((name) => name.length > 0)
    .join(", ");

  const totalAmount = cart.items.reduce((sum, item) => sum + item.price, 0);

  const newOrder = new Order({
  userId,
  items: cart.items,
  address,
  totalAmount,
  pizzaNames,
  orderStatus: "Placed",
  paymentStatus: status,
});


  await newOrder.save();

  cart.items = [];
  await cart.save();

  return newOrder;
};

module.exports = { placeOrderLogic };
