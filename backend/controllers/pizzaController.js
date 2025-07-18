const Pizza = require("../models/pizzaModel");

// @desc    Get all pizzas
// @route   GET /api/pizzas
// @access  Public
const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({});
    res.status(200).json(pizzas);
  } catch (error) {
    console.error("Error fetching pizzas:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// @desc    Get single pizza by ID
// @route   GET /api/pizzas/:id
// @access  Public
const getPizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ msg: "Pizza not found" });
    res.status(200).json(pizza);
  } catch (error) {
    console.error("Error fetching pizza:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// @desc    Create a new pizza
// @route   POST /api/pizzas
// @access  Private/Admin (optional)
const createPizza = async (req, res) => {
  const { name, image, price, variants, type } = req.body;

  try {
    const newPizza = new Pizza({
      name,
      image,
      price,
      variants,
      category,
    });

    const savedPizza = await newPizza.save();
    res.status(201).json(savedPizza);
  } catch (error) {
    console.error("Error creating pizza:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// @desc    Update an existing pizza
// @route   PUT /api/pizzas/:id
// @access  Private/Admin (optional)
const updatePizza = async (req, res) => {
  try {
    const updatedPizza = await Pizza.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          image: req.body.image,
          price: req.body.price,
          variants: req.body.variants,
          category: req.body.category,
        },
      },
      { new: true }
    );

    if (!updatedPizza) return res.status(404).json({ msg: "Pizza not found" });

    res.status(200).json(updatedPizza);
  } catch (error) {
    console.error("Error updating pizza:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// @desc    Delete a pizza
// @route   DELETE /api/pizzas/:id
// @access  Private/Admin (optional)
const deletePizza = async (req, res) => {
  try {
    const deleted = await Pizza.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Pizza not found" });

    res.status(200).json({ msg: "Pizza deleted successfully" });
  } catch (error) {
    console.error("Error deleting pizza:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  getPizzas,
  getPizza,
  createPizza,
  updatePizza,
  deletePizza,
};
