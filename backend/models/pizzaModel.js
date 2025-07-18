const mongoose = require("mongoose");

const pizzaSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      small: { type: Number, required: true },
      medium: { type: Number, required: true },
      large: { type: Number, required: true },
    },
    variants: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const pizzaModel = mongoose.model("pizzas", pizzaSchema);

module.exports = pizzaModel;
