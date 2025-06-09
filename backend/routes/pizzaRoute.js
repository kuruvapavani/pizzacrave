const express = require('express');
const router = express.Router();
const Pizza = require('../models/pizzaModel');

router.get("/getpizzas",async (req,res)=>{
  try {
    const pizzas =await Pizza.find({});
    res.status(200).json(pizzas);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
})

module.exports = router;