const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  items: [
    {
      pizzaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pizza",
        required: true,
      },
      name: String,
      image: String,
      variant: String,
      category: String,
      quantity: Number,
      price: Number,
    },
  ],
  address: {
    type: String,
    required: true,
  },
  pizzaNames: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  gstCharges: {
    type: Number,
    required: true,
  },
  deliveryCharges: {
    type: Number,
    required: true,
  },
  finalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  orderStatus: {
    type: String,
    enum: [
      "Placed",
      "Preparing",
      "Ready to Deliver",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ],
    default: "Placed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
