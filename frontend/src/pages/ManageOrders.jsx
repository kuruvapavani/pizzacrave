import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

const ManageOrders = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const userToken = localStorage.getItem("authToken");

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/users/get-role/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (res.data.role !== "admin") navigate("/");
      } catch (err) {
        navigate("/");
      }
    };
    checkRole();
  }, [id, navigate, userToken]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (orderId) => {
    const confirm = window.confirm("Are you sure you want to delete this order?");
    if (!confirm) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      alert("Order deleted");
      fetchOrders();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEditStatus = (order) => {
    setSelectedOrder(order);
    setNewOrderStatus(order.orderStatus);
    setNewPaymentStatus(order.paymentStatus || "Pending");
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
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
      alert("Order & Payment status updated");
      fetchOrders();
      setShowStatusModal(false);
    } catch (error) {
      console.error("Error updating statuses:", error);
    }
  };

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
                <th className="py-3 px-4 text-left font-normal">Order Status</th>
                <th className="py-3 px-4 text-left font-normal">Payment Status</th>
                <th className="py-3 px-4 text-left font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="py-3 px-4">
                    {order.userId?.username} <br />
                    <span className="text-sm text-gray-500">{order.userId?.email}</span>
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
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Order & Payment Status Update */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl mb-4">Update Order</h2>

            <label className="block mb-2 text-sm font-medium">Order Status</label>
            <select
              value={newOrderStatus}
              onChange={(e) => setNewOrderStatus(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            >
              {["Placed", "Preparing", "Ready to Deliver", "Out for Delivery", "Delivered", "Cancelled"].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <label className="block mb-2 text-sm font-medium">Payment Status</label>
            <select
              value={newPaymentStatus}
              onChange={(e) => setNewPaymentStatus(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            >
              {["Pending", "Paid", "Failed"].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="bg-hero text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManageOrders;
