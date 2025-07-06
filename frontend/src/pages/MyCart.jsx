import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import MyCartPizzaCard from "../components/MyCartPizzaCard";
import axios from "axios";

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const placeOrder = async (params) => {
    try {
      navigate("/checkout");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCart = async () => {
    const userId = localStorage.getItem("id");
    const userToken = localStorage.getItem("authToken");

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
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("id");
    const userToken = localStorage.getItem("authToken");

    if (!userId || !userToken) {
      navigate("/login");
      return;
    }

    fetchCart();
  }, [navigate]);

  return (
    <Layout>
      <div className="text-5xl text-hero flex justify-center py-6 my-6">
        My Cart
      </div>
      <div className="flex justify-center">
        {cartItems.length === 0 ? (
          <div className="text-center text-lg text-gray-500">
            Your cart is empty.
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
      <div className="flex justify-center mt-8">
        <button
          className="bg-hero text-white px-4 py-2 rounded rounded-xl"
          onClick={placeOrder}
        >
          Place Order
        </button>
      </div>
    </Layout>
  );
};

export default MyCart;
