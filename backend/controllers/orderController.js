const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const { placeOrderLogic } = require("../utils/placeOrderLogic");
// GET all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orderItems = await Order.find({})
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    if (!orderItems || orderItems.length === 0) {
      return res.status(404).json({ message: "Orders not found" });
    }

    return res.status(200).json(orderItems);
  } catch (error) {
    console.error("Get All Orders error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// GET orders for a specific user
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const userOrders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({ message: "User orders not found" });
    }

    return res.status(200).json(userOrders);
  } catch (error) {
    console.error("Get User Orders error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// POST - place an order
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address } = req.body;

    const newOrder = await placeOrderLogic(userId, address, "Pending");

    res.status(201).json({
      message: "Order placed successfully from cart",
      order: newOrder,
    });
  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ message: error.message || "Something went wrong while placing the order" });
  }
};

// PATCH - update payment status (admin only)
const updatePaymentStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { paymentStatus } = req.body;

    if (!["Pending", "Paid", "Failed"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Payment status updated", order: updatedOrder });
  } catch (error) {
    console.error("Update Payment Status Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// PATCH - update order delivery status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { orderStatus } = req.body;

    const validStatuses = [
      "Placed",
      "Preparing",
      "Ready to Deliver",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// DELETE - delete an order (admin only)
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const orderDetails = await Order.findById(orderId);

    if (!orderDetails) {
      return res.status(404).json({ message: "Order Not Found" });
    }

    return res.status(200).json(orderDetails);
  } catch (error) {
    console.error("Error fetching Order Details:", error);
    res.status(500).json({ message: "Something went Wrong" });
  }
};


module.exports = {
  getAllOrders,
  getUserOrders,
  placeOrder,
  updatePaymentStatus,
  updateOrderStatus,
  deleteOrder,
  getOrderDetails
};
