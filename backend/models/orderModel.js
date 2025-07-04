const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
        },
        variant: {
          type: String,
          required: true,
          enum: ["small", "medium", "large"],
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["placed", "preparing", "delivered", "cancelled"],
      default: "placed",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("orders", orderSchema);
module.exports = Order;
