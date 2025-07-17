import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import MyCartPizzaCard from "../components/MyCartPizzaCard";
import axios from "axios";
import { Leapfrog } from 'ldrs/react';
import 'ldrs/react/Leapfrog.css';

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const placeOrder = async () => {
    navigate("/checkout");
  };

  const fetchCart = async () => {
    const userId = localStorage.getItem("id");
    const userToken = localStorage.getItem("authToken");

    if (!userId || !userToken) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/cart/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError("Failed to load your cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Leapfrog
            size="60"
            speed="2.5"
            color="#FFA527"
          />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen text-red-500 text-lg">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-5xl text-hero flex justify-center py-6 my-6">
        My Cart
      </div>
      <div className="flex justify-center">
        {cartItems.length === 0 ? (
          <div className="text-center text-lg text-gray-500">
            Your cart is empty. Start adding some delicious pizzas!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {cartItems.map((item) => (
              <MyCartPizzaCard
                key={item._id}
                _id={item._id}
                pizzaId={item.pizzaId}
                name={item.name}
                price={item.price}
                image={item.image}
                initialQuantity={item.quantity}
                initialVariant={item.variant}
                refreshCart={fetchCart}
              />
            ))}
          </div>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            className="bg-hero text-white px-4 py-2 rounded rounded-xl"
            onClick={placeOrder}
          >
            Place Order
          </button>
        </div>
      )}
    </Layout>
  );
};

export default MyCart;
