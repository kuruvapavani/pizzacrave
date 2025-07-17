import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Leapfrog } from 'ldrs/react';
import 'ldrs/react/Leapfrog.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchOrders = async () => {
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
        `${process.env.REACT_APP_BASE_URL}/api/orders/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setOrders(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
      setError("Failed to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("id");
    const userToken = localStorage.getItem("authToken");

    if (!userId || !userToken) {
      navigate("/login");
      return;
    }

    const confirmStripeAndFetchOrders = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      if (sessionId) {
        setLoading(true);
        try {
          await axios.post(
            `${process.env.REACT_APP_BASE_URL}/api/payment/confirm-stripe`,
            { sessionId },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          window.history.replaceState({}, document.title, "/my-orders");
        } catch (error) {
          console.error("Stripe order confirmation failed:", error);
          setError("Failed to confirm your recent payment. Please check your orders.");
        }
      }
      
      fetchOrders();
    };

    confirmStripeAndFetchOrders();
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
      {orders.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 text-sm sm:text-base md:text-lg bg-hero text-white mx-2 sm:mx-6 my-4 sm:my-6 py-2 rounded-md text-center sm:text-left px-4">
            <div>Date</div>
            <div>Pizza Name</div>
            <div>Total Price</div>
            <div>Order Status</div>
            <div>Payment Status</div>
            <div>More Details</div>
          </div>
          {orders.map((order) => (
            <div
              key={order._id}
              className="grid grid-cols-1 sm:grid-cols-6 gap-2 text-sm sm:text-base md:text-lg mx-2 sm:mx-6 border-2 border-hero py-2 rounded-md items-center text-center sm:text-left my-4 px-4"
            >
              <div>{formatDate(order.createdAt)}</div>
              <div>
                {order.pizzaNames && order.pizzaNames.length > 15
                  ? order.pizzaNames.slice(0, 15) + "..."
                  : order.pizzaNames || "No Pizza Info"}
              </div>
              <div>${order.totalAmount}</div>
              <div>{order.orderStatus}</div>
              <div>{order.paymentStatus}</div>
              <Link to={`/my-orders/${order._id}`}>
                <button className="w-full sm:w-auto px-4 py-1 rounded-md bg-hero text-white hover:bg-hero-dark">
                  View
                </button>
              </Link>
            </div>
          ))}
        </>
      ) : (
        <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
          No orders yet! Start by ordering some delicious pizza.
        </div>
      )}
    </Layout>
  );
};

export default MyOrders;