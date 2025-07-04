const express = require("express");
const {
  getPizzas,
  getPizza,
  createPizza,
  updatePizza,
  deletePizza,
} = require("../controllers/pizzaController");

const router = express.Router();

router.route("/").get(getPizzas).post(createPizza);
router.route("/:id").get(getPizza).put(updatePizza).delete(deletePizza);

module.exports = router;