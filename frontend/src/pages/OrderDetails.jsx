import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import MyOrderPizzaCard from "../components/MyOrderPizzaCard";
import axios from "axios";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
  if (!id) return;

  const fetchOrderDetails = async () => {
    const userToken = localStorage.getItem("authToken");

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
    } catch (error) {
      console.error("Failed to fetch order:", error);
    }
  };

  fetchOrderDetails();
}, [id]);

  return (
    <Layout>
      <div className="text-4xl md:text-5xl text-hero text-center py-6">
        Order Details
      </div>

      {!order ? (
        <div className="text-center text-lg text-gray-500">Loading...</div>
      ) : order.items.length === 0 ? (
        <div className="text-center text-lg text-gray-500">No Order Found</div>
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
                <span className="font-medium">Total Amount:</span>
                <span>₹{order.totalAmount}</span>
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
