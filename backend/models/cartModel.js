const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: [
      {
        pizzaId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "pizzas",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        variant: {
          type: String,
          enum: ["small", "medium", "large"],
          required: true,
        },
        category: {
          type: String,
          enum: ["veg", "non-veg"],
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    subTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    gstCharges: {
      type: Number,
      required: true,
      default: 0,
    },
    deliveryCharges: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("carts", cartSchema);
module.exports = Cart;
