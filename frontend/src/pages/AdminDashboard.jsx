import React, { useEffect } from 'react';
import Layout from "../components/Layout";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem('id');

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/users/get-role/${id}`);
        if (res.data.role !== "admin") {
          navigate("/");
        }
      } catch (err) {
        console.error("Failed to fetch role:", err);
        navigate("/");
      }
    };

    checkRole();
  }, [id, navigate]);

  return (
    <Layout>
      <div className="flex flex-col items-center mt-10 px-4">
        <h2 className="text-3xl text-hero mb-6">Admin Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
          <button
            onClick={() => navigate("/admin/pizzas")}
            className="bg-hero hover:opacity-90 text-white py-3 rounded-xl text-lg"
          >
            Manage Pizzas
          </button>

          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-hero hover:opacity-90 text-white py-3 rounded-xl text-lg"
          >
            Manage Orders
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
