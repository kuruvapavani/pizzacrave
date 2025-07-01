const express = require('express');
const cors = require('cors');

const app = express();
const pizzaRoutes = require("./routes/pizzaRoute");

// Middlewares
app.use(cors(
  {
    origin: process.env.FRONTEND_URL,
  }
));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Server Running Successfully');
});
app.use('/api',pizzaRoutes)

module.exports = app;
