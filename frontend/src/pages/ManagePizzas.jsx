import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Leapfrog } from 'ldrs/react';
import 'ldrs/react/Leapfrog.css';

const ManagePizzas = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const [pizzas, setPizzas] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: {
      small: "",
      medium: "",
      large: "",
    },
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const checkRoleAndFetchPizzas = async () => {
      setInitialLoading(true);
      try {
        const roleRes = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/users/get-role/${id}`
        );
        if (roleRes.data.role !== "admin") {
          navigate("/");
          return;
        }

        const pizzasRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/pizzas`);
        setPizzas(pizzasRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        navigate("/");
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      checkRoleAndFetchPizzas();
    } else {
      navigate("/login");
    }
  }, [id, navigate]);

  const fetchPizzas = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/pizzas`);
      setPizzas(res.data);
    } catch (error) {
      console.error("Failed to fetch pizzas:", error);
    }
  };

  const handleEditClick = (pizza) => {
    setSelectedPizza(pizza);
    setFormData({
      name: pizza.name,
      image: pizza.image,
      price: pizza.price,
    });
    setShowEditModal(true);
  };

  const handleUpdatePizza = async () => {
    setActionLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/pizzas/${selectedPizza._id}`,
        {
          ...formData,
          variants: ["small", "medium", "large"],
        }
      );
      alert("Pizza updated");
      fetchPizzas();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating pizza:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePizza = async (pizzaId) => {
    const confirm = window.confirm("Are you sure you want to delete this pizza?");
    if (!confirm) return;
    setActionLoading(true);
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/pizzas/${pizzaId}`);
      alert("Pizza deleted");
      fetchPizzas();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedPizza(null);
    setFormData({
      name: "",
      image: "",
      price: { small: "", medium: "", large: "" },
    });
    setShowAddModal(true);
  };

  const handleAddPizza = async () => {
    setActionLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/pizzas`, {
        ...formData,
        variants: ["small", "medium", "large"],
      });
      alert("Pizza added");
      fetchPizzas();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding pizza:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (initialLoading) {
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

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl text-hero">Manage Pizzas</h2>
          <button
            onClick={handleAddClick}
            className="bg-hero text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
            disabled={actionLoading}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Pizza
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-xl shadow">
            <thead className="bg-hero text-white">
              <tr>
                <th className="py-3 px-4 text-left font-normal">Image</th>
                <th className="py-3 px-4 text-left font-normal">Name</th>
                <th className="py-3 px-4 text-left font-normal">Variants</th>
                <th className="py-3 px-4 text-left font-normal">Prices</th>
                <th className="py-3 px-4 text-left font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pizzas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">No pizzas found.</td>
                </tr>
              ) : (
                pizzas.map((pizza) => (
                  <tr key={pizza._id} className="border-t">
                    <td className="py-3 px-4">
                      <img
                        src={pizza.image}
                        alt={pizza.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="py-3 px-4">{pizza.name}</td>
                    <td className="py-3 px-4">small, medium, large</td>
                    <td className="py-3 px-4">
                      Small: ₹{pizza.price.small} <br />
                      Medium: ₹{pizza.price.medium} <br />
                      Large: ₹{pizza.price.large}
                    </td>
                    <td className="py-3 px-4 space-x-4">
                      <button
                        onClick={() => handleEditClick(pizza)}
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        disabled={actionLoading}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        onClick={() => handleDeletePizza(pizza._id)}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        disabled={actionLoading}
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

      {(showEditModal || showAddModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl mb-4">
              {showEditModal ? "Edit Pizza" : "Add Pizza"}
            </h2>

            <input
              type="text"
              placeholder="Pizza Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3"
              disabled={actionLoading}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3"
              disabled={actionLoading}
            />
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                placeholder="Small ₹"
                value={formData.price.small}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: { ...formData.price, small: e.target.value },
                  })
                }
                className="w-full border px-3 py-2 rounded"
                disabled={actionLoading}
              />
              <input
                type="number"
                placeholder="Medium ₹"
                value={formData.price.medium}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: { ...formData.price, medium: e.target.value },
                  })
                }
                className="w-full border px-3 py-2 rounded"
                disabled={actionLoading}
              />
              <input
                type="number"
                placeholder="Large ₹"
                value={formData.price.large}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: { ...formData.price, large: e.target.value },
                  })
                }
                className="w-full border px-3 py-2 rounded"
                disabled={actionLoading}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setShowAddModal(false);
                }}
                className="px-4 py-2 border rounded"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={showEditModal ? handleUpdatePizza : handleAddPizza}
                className="bg-hero text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Leapfrog
                    size="20"
                    speed="2.5"
                    color="#FFFFFF"
                  />
                ) : (
                  showEditModal ? "Update" : "Add"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManagePizzas;
