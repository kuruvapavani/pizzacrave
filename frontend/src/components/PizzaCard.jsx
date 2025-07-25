import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Leapfrog } from 'ldrs/react';
import 'ldrs/react/Leapfrog.css';
import { toast } from 'sonner';

const PizzaCard = ({ pizza }) => {
  const [quantity, setQuantity] = useState(1);
  const [variants, setVariants] = useState("small");
  const [imageLoading, setImageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addToCart = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const userToken = localStorage.getItem("authToken");
      const userId = localStorage.getItem("id");

      if (!userToken || !userId) {
        navigate('/login');
        toast.error("Please log in to add items to your cart.");
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          userid: userId,
          pizzaid: pizza._id,
          variant: variants,
          quantity: Number(quantity),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Item added to cart!");
      } else {
        toast.error(data.message || "Failed to add item.");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white shadow-lg rounded-lg p-4 w-68 mx-auto hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-center mb-4 h-52">
        {imageLoading && (
          <div className="flex items-center justify-center h-full">
            <Leapfrog size="40" speed="2.5" color="#FFA527" />
          </div>
        )}
        <img
          src={pizza.image}
          alt={pizza.name}
          className={`h-full w-auto object-cover rounded-md ${imageLoading ? 'hidden' : 'block'}`}
          onLoad={() => setImageLoading(false)}
        />
      </div>
      <div className="text-lg text-center mb-2">{pizza.name}</div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-700 font-medium">
          Price: ₹{pizza.price[variants] * quantity}/-
        </div>
        <div className="text-gray-700 font-medium bg-hero text-white px-2 py-1 rounded">
          {pizza.category ? pizza.category.charAt(0).toUpperCase() + pizza.category.slice(1) : 'N/A'}
        </div>
      </div>
      <div className="flex justify-between items-center space-x-4">
        <select
          className="border border-gray-300 rounded-md px-2 py-1"
          value={variants}
          onChange={(e) => setVariants(e.target.value)}
        >
          {pizza.variants?.map((size, index) => (
            <option key={index} value={size.toLowerCase()}>
              {size}
            </option>
          ))}
        </select>
        <div className="flex items-center space-x-2">
          <label htmlFor="quantity" className="text-sm text-gray-600">
            Qnt:
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center bg-gray-100"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={addToCart}
          disabled={loading}
          className="bg-hero text-white px-10 py-2 rounded-md flex items-center gap-2 hover:bg-opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <Leapfrog size="20" speed="2.5" color="white" />
          ) : (
            <>
              Add to Cart <FontAwesomeIcon icon={faCartPlus} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PizzaCard;
