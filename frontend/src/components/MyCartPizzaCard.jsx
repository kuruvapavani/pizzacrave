import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from 'sonner';
import { Leapfrog } from 'ldrs/react';
import 'ldrs/react/Leapfrog.css';

const MyCartPizzaCard = ({
  _id,
  pizzaId,
  name = "Pizza Name",
  price = 299,
  image,
  initialQuantity = 1,
  initialVariant = "small",
  refreshCart,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [variant, setVariant] = useState(initialVariant.toLowerCase());
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const userId = localStorage.getItem("id");
  const userToken = localStorage.getItem("authToken");

  const updateCart = async (newQuantity, newVariant) => {
    try {
      setLoading(true);
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/cart/update`,
        {
          userid: userId,
          oldPizzaId: pizzaId,
          oldVariant: variant,
          newPizzaId: pizzaId,
          newVariant: newVariant,
          newQuantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setQuantity(newQuantity);
      setVariant(newVariant);
      toast.success("Cart item updated!");
      await refreshCart();
    } catch (error) {
      console.error("Error updating cart item:", error);
      toast.error("Failed to update item.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (type) => {
    const newQuantity =
      type === "increase" ? quantity + 1 : quantity > 1 ? quantity - 1 : 1;
    await updateCart(newQuantity, variant);
  };

  const handleVariantChange = async (event) => {
    const newVariant = event.target.value;
    await updateCart(quantity, newVariant);
  };

  const handleRemove = async () => {
    try {
      setLoading(true);
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/cart/remove`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        data: {
          userid: userId,
          pizzaid: pizzaId,
          variant: variant,
        },
      });
      toast.success("Item removed from cart.");
      await refreshCart();
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast.error("Failed to remove item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col border-4 border-hero rounded-3xl max-w-96 p-6 bg-white shadow-lg relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center rounded-3xl text-lg font-bold text-hero z-10">
          Updating...
        </div>
      )}
      <div className="flex justify-between">
        <div className="flex flex-col justify-center gap-2">
          <div className="text-xl text-gray-800">{name}</div>
          <div className="flex items-center gap-2">
            <label className="font-medium">Variant:</label>
            <select
              value={variant}
              onChange={handleVariantChange}
              className="border-2 border-hero focus:outline-none rounded-lg px-2 py-1 text-gray-700"
            >
              {["small", "medium", "large"].map((v) => (
                <option key={v} value={v}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-medium">Quantity:</label>
            <button
              onClick={() => handleQuantityChange("decrease")}
              className="px-2 py-1 rounded-lg bg-hero text-white"
            >
              -
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange("increase")}
              className="px-2 py-1 rounded-lg bg-hero text-white"
            >
              +
            </button>
          </div>
        </div>
        <div className="relative h-24 w-24 md:h-32 md:w-32 flex items-center justify-center">
          {imageLoading && (
            <Leapfrog
              size="40"
              speed="2.5"
              color="#FFA527"
            />
          )}
          <img
            src={image}
            alt={name}
            className={`h-full w-full rounded-3xl object-cover ml-4 ${imageLoading ? 'hidden' : 'block'}`}
            onLoad={() => setImageLoading(false)}
          />
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-lg font-medium text-gray-700">Price: ₹{price}</div>
        <FontAwesomeIcon
          icon={faTrashCan}
          className="text-hero text-2xl cursor-pointer hover:text-red-600"
          onClick={handleRemove}
        />
      </div>
    </div>
  );
};

export default MyCartPizzaCard;
