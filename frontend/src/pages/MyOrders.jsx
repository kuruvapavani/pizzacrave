import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchOrders = async () => {
    const userId = localStorage.getItem("id");
    const userToken = localStorage.getItem("authToken");
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
    } catch (error) {
      console.error("Error fetching orders", error);
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
        // Optional: Remove session_id from URL after confirming
        window.history.replaceState({}, document.title, "/my-orders");
      } catch (error) {
        console.error("Stripe order confirmation failed:", error);
      }
    }

    fetchOrders();
  };

  confirmStripeAndFetchOrders();
}, [navigate]);


  return (
    <Layout>
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 text-sm sm:text-base md:text-lg bg-hero text-white mx-2 sm:mx-6 my-4 sm:my-6 py-2 rounded-md text-center sm:text-left px-4">
        <div>Date</div>
        <div>Pizza Name</div>
        <div>Total Price</div>
        <div>Order Status</div>
        <div>Payment Status</div>
        <div>More Details</div>
      </div>

      {loading ? (
        <div className="text-center mt-6">Loading...</div>
      ) : orders.length > 0 ? (
        orders.map((order) => (
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
        ))
      ) : (
        <div className="text-center mt-6 text-gray-500">No orders found</div>
      )}
    </Layout>
  );
};

export default MyOrders;
