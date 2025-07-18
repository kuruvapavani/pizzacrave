const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/cartModel");
const { placeOrderLogic } = require("../utils/placeOrderLogic");

const createStripeSession = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user.id;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.totalAmount;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Pizza Order",
            },
            unit_amount: totalAmount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/my-orders?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        userId,
        address,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    res.status(500).json({ message: error.message || "Failed to create session" });
  }
};

const confirmStripePayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const userId = session.metadata.userId;
    const address = session.metadata.address;

    const newOrder = await placeOrderLogic(userId, address, "Paid");

    res.status(201).json({
      message: "Order placed via Stripe",
      order: newOrder,
    });
  } catch (error) {
    console.error("Stripe Confirm Error:", error);
    res.status(500).json({ message: error.message || "Something went wrong while confirming payment" });
  }
};

module.exports = {
  createStripeSession,
  confirmStripePayment,
};
