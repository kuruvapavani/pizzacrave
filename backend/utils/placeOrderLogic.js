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

  const totalAmount = cart.subTotal;
  const gstCharges = cart.gstCharges;
  const deliveryCharges = cart.deliveryCharges;

  const finalAmount = cart.totalAmount;

  const newOrder = new Order({
    userId,
    items: cart.items,
    address,
    pizzaNames,
    totalAmount,
    gstCharges,
    deliveryCharges,
    finalAmount,
    orderStatus: "Placed",
    paymentStatus: status,
  });

  await newOrder.save();

  cart.items = [];
  await cart.save();

  return newOrder;
};

module.exports = { placeOrderLogic };
