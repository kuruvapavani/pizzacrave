import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import MyCartPizzaCard from "../components/MyCartPizzaCard";
import axios from "axios";
import { Leapfrog } from "ldrs/react";
import "ldrs/react/Leapfrog.css";

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    subTotal: 0,
    gstCharges: 0,
    deliveryCharges: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const placeOrder = () => {
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
      setCartSummary({
        subTotal: res.data.subTotal || 0,
        gstCharges: res.data.gstCharges || 0,
        deliveryCharges: res.data.deliveryCharges || 0,
        totalAmount: res.data.totalAmount || 0,
      });
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
          <Leapfrog size="60" speed="2.5" color="#FFA527" />
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

      <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-12">
        {/* Cart Items - Left */}
        <div className="flex-1">
          {cartItems.length === 0 ? (
            <div className="text-center text-lg text-gray-500">
              Your cart is empty. Start adding some delicious pizzas!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {cartItems.map((item) => (
                <MyCartPizzaCard
                  key={item._id}
                  _id={item._id}
                  pizzaId={item.pizzaId}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  category={item.category}
                  initialQuantity={item.quantity}
                  initialVariant={item.variant}
                  refreshCart={fetchCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary Box - Right */}
        {cartItems.length > 0 && (
          <div className="w-full lg:w-[350px] bg-white shadow-xl rounded-xl p-6 text-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-center text-hero">
              Order Summary
            </h2>
            <div className="space-y-3 text-lg">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{cartSummary.subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span>₹{cartSummary.gstCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>₹{cartSummary.deliveryCharges.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-xl">
                <span>Total:</span>
                <span>₹{cartSummary.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="mt-6 w-full bg-hero text-white py-2 rounded-xl hover:opacity-90"
              onClick={placeOrder}
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyCart;
