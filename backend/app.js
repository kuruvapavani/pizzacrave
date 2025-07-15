const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const pizzaRoutes = require("./routes/pizzaRoute");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require('./routes/paymentRoutes');
// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server Running Successfully");
});
app.use("/api/pizzas", pizzaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders",orderRoutes);
app.use('/api/payment', paymentRoutes);

module.exports = app;
