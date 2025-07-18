import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import MyOrderPizzaCard from "../components/MyOrderPizzaCard";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Leapfrog } from "ldrs/react";
import "ldrs/react/Leapfrog.css";
import { toast } from "sonner";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if(!token){
      toast.error("Please login to view order details");
      navigate('/login');
    }
    if (!id) {
      setLoading(false);
      setError("No order ID provided.");
      return;
    }

    const fetchOrderDetails = async () => {
      const userToken = localStorage.getItem("authToken");

      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/orders/details/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError(
          "Failed to load order details. Please try again or check if the order exists."
        );
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  return (
    <Layout>
      <div className="text-4xl md:text-5xl text-hero text-center py-6">
        Order Details
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          {" "}
          {/* Adjust height as needed */}
          <Leapfrog size="60" speed="2.5" color="#FFA527" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-96 text-red-500 text-lg text-center px-4">
          {error}
        </div>
      ) : !order ? (
        <div className="flex justify-center items-center h-96 text-lg text-gray-500 text-center px-4">
          No order details found.
        </div>
      ) : order.items.length === 0 ? (
        <div className="flex justify-center items-center h-96 text-lg text-gray-500 text-center px-4">
          This order has no items.
        </div>
      ) : (
        <>
          {/* Pizza Items */}
          <div className="px-4 md:px-20 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {order.items.map((item) => (
              <MyOrderPizzaCard
                key={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
                category={item.category}
                quantity={item.quantity}
                variant={item.variant}
              />
            ))}
          </div>

          {/* Order Summary at the Bottom */}
          <div className="mx-4 md:mx-20 my-8 border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Order Summary
            </h2>
            <div className="space-y-3 text-gray-700 text-base">
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium">Address:</span>
                <span>{order.address}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium">GST (5%):</span>
                <span>₹{order.gstCharges.toFixed(2)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium">Delivery Fee:</span>
                <span>₹{order.deliveryCharges.toFixed(2)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between border-t pt-3 font-semibold text-lg">
                <span>Total (Final Amount):</span>
                <span>₹{order.finalAmount.toFixed(2)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium">Payment Status:</span>
                <span
                  className={
                    order.paymentStatus === "Pending"
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-medium">Order Status:</span>
                <span>{order.orderStatus}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default OrderDetails;
