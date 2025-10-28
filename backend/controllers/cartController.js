const Cart = require("../models/cartModel");
const Pizza = require("../models/pizzaModel");

const GST_RATE = 0.05; // 5% GST
const DELIVERY_CHARGE = 50;

// Helper function to calculate totals
function calculateCartTotals(cart) {
  const subTotal = cart.items.reduce((acc, item) => acc + item.price, 0);
  const gstCharges = parseFloat((subTotal * GST_RATE).toFixed(2));
  const deliveryCharges = subTotal > 0 ? DELIVERY_CHARGE : 0;
  const totalAmount = parseFloat(
    (subTotal + gstCharges + deliveryCharges).toFixed(2)
  );

  cart.subTotal = subTotal;
  cart.gstCharges = gstCharges;
  cart.deliveryCharges = deliveryCharges;
  cart.totalAmount = totalAmount;
}

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { userid, pizzaid, variant, quantity } = req.body;

    const pizza = await Pizza.findById(pizzaid);
    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }

    const price = pizza.price[variant];
    const totalPrice = quantity * price;

    const newItem = {
      pizzaId: pizzaid,
      name: pizza.name,
      image: pizza.image,
      variant,
      category: pizza.category,
      quantity,
      price: totalPrice,
    };

    let cart = await Cart.findOne({ userId: userid });

    if (cart) {
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.pizzaId.toString() === pizzaid && item.variant === variant
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].price += totalPrice;
      } else {
        cart.items.push(newItem);
      }

      calculateCartTotals(cart);
      await cart.save();
    } else {
      cart = new Cart({
        userId: userid,
        items: [newItem],
      });

      calculateCartTotals(cart);
      await cart.save();
    }

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get user's cart
const getCartByUserId = async (req, res) => {
  try {
    const { userid } = req.params;
    const cart = await Cart.findOne({ userId: userid });

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { userid, pizzaid, variant } = req.body;

    const cart = await Cart.findOne({ userId: userid });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.pizzaId.toString() !== pizzaid || item.variant !== variant
    );

    calculateCartTotals(cart);
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const { userid } = req.params;

    const cart = await Cart.findOne({ userId: userid });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    calculateCartTotals(cart);
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Update cart item (variant or quantity or pizza itself)
const updateCartItem = async (req, res) => {
  try {
    const {
      userid,
      oldPizzaId,
      oldVariant,
      newPizzaId,
      newVariant,
      newQuantity,
    } = req.body;

    const cart = await Cart.findOne({ userId: userid });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.pizzaId.toString() === oldPizzaId && item.variant === oldVariant
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const newPizza = await Pizza.findById(newPizzaId);
    if (!newPizza) {
      return res.status(404).json({ message: "New pizza not found" });
    }

    const newPricePerUnit = newPizza.price[newVariant];
    const newTotalPrice = newPricePerUnit * newQuantity;
    const isChangingVariantOrPizza =
      oldPizzaId !== newPizzaId || oldVariant !== newVariant;

    if (isChangingVariantOrPizza) {
      const existingNewItemIndex = cart.items.findIndex(
        (item, index) =>
          index !== itemIndex &&
          item.pizzaId.toString() === newPizzaId &&
          item.variant === newVariant
      );

      if (existingNewItemIndex !== -1) {
        const existingItem = cart.items[existingNewItemIndex];
        const updatedQuantity = existingItem.quantity + newQuantity;
        const updatedTotalPrice = newPricePerUnit * updatedQuantity;
        existingItem.quantity = updatedQuantity;
        existingItem.price = updatedTotalPrice;
        cart.items.splice(itemIndex, 1);
        calculateCartTotals(cart);
        await cart.save();
        return res.status(200).json({
          message:
            "Cart item merged (variant change), quantity increased in existing item.",
          cart,
        });
      }
    }
    cart.items[itemIndex] = {
      pizzaId: newPizzaId,
      name: newPizza.name,
      image: newPizza.image,
      variant: newVariant,
      category: newPizza.category,
      quantity: newQuantity,
      price: newTotalPrice,
    };

    calculateCartTotals(cart);
    await cart.save();
    res.status(200).json({ message: "Cart item updated", cart });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  addToCart,
  getCartByUserId,
  removeFromCart,
  clearCart,
  updateCartItem,
};
