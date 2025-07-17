import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Leapfrog } from "ldrs/react";
import "ldrs/react/Leapfrog.css";
import { toast } from 'sonner';

const ManageOrders = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const userToken = localStorage.getItem("authToken");

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");

  const [initialLoading, setInitialLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const checkRoleAndFetchOrders = async () => {
      setInitialLoading(true);
      try {
        const roleRes = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/users/get-role/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (roleRes.data.role !== "admin") {
          navigate("/");
          toast.error("You are not authorized to view this page.");
          return;
        }

        const ordersRes = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setOrders(ordersRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load orders. Please try again.");
        navigate("/");
      } finally {
        setInitialLoading(false);
      }
    };

    if (id && userToken) {
      checkRoleAndFetchOrders();
    } else {
      navigate("/login");
      toast.error("Please log in to access this page.");
    }
  }, [id, navigate, userToken]);

  const handleDelete = async (orderId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirm) return;

    setUpdateLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      toast.success("Order deleted successfully!");
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete order.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleEditStatus = (order) => {
    setSelectedOrder(order);
    setNewOrderStatus(order.orderStatus);
    setNewPaymentStatus(order.paymentStatus || "Pending");
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    setUpdateLoading(true);
    try {
      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/orders/status/${selectedOrder._id}`,
        { orderStatus: newOrderStatus },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/orders/payment/${selectedOrder._id}`,
        { paymentStatus: newPaymentStatus },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      toast.success("Order & Payment status updated successfully!");
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setOrders(res.data);
      setShowStatusModal(false);
    } catch (error) {
      console.error("Error updating statuses:", error);
      toast.error("Failed to update order status.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Leapfrog size="60" speed="2.5" color="#FFA527" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-3xl text-hero mb-6">Manage Orders</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-xl shadow">
            <thead className="bg-hero text-white">
              <tr>
                <th className="py-3 px-4 text-left font-normal">User</th>
                <th className="py-3 px-4 text-left font-normal">Items</th>
                <th className="py-3 px-4 text-left font-normal">Address</th>
                <th className="py-3 px-4 text-left font-normal">Total</th>
                <th className="py-3 px-4 text-left font-normal">
                  Order Status
                </th>
                <th className="py-3 px-4 text-left font-normal">
                  Payment Status
                </th>
                <th className="py-3 px-4 text-left font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="py-3 px-4">
                      {order.userId?.username} <br />
                      <span className="text-sm text-gray-500">
                        {order.userId?.email}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {order.items.map((item, idx) => (
                        <div key={idx}>
                          {item.name} x {item.quantity} (₹{item.price})
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4">{order.address}</td>
                    <td className="py-3 px-4">₹{order.totalAmount}</td>
                    <td className="py-3 px-4">{order.orderStatus}</td>
                    <td className="py-3 px-4">{order.paymentStatus}</td>
                    <td className="py-3 px-4 space-x-3">
                      <button
                        onClick={() => handleEditStatus(order)}
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        disabled={updateLoading}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        disabled={updateLoading}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl mb-4">Update Order</h2>

            <label className="block mb-2 text-sm font-medium">
              Order Status
            </label>
            <select
              value={newOrderStatus}
              onChange={(e) => setNewOrderStatus(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
              disabled={updateLoading}
            >
              {[
                "Placed",
                "Preparing",
                "Ready to Deliver",
                "Out for Delivery",
                "Delivered",
                "Cancelled",
              ].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <label className="block mb-2 text-sm font-medium">
              Payment Status
            </label>
            <select
              value={newPaymentStatus}
              onChange={(e) => setNewPaymentStatus(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
              disabled={updateLoading}
            >
              {["Pending", "Paid", "Failed"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border rounded"
                disabled={updateLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="bg-hero text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <Leapfrog size="20" speed="2.5" color="#FFFFFF" />
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManageOrders;
