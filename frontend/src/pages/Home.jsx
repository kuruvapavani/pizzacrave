import React, { useEffect, useState } from "react";
import axios from "axios";
import PizzaCard from "../components/PizzaCard";
import Layout from "../components/Layout";
import { Leapfrog } from 'ldrs/react';
import 'ldrs/react/Leapfrog.css';
import { toast } from 'sonner';

const Home = () => {
  const [pizzaData, setPizzaData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/pizzas`);
        setPizzaData(res.data);
        setFilteredData(res.data);
      } catch (err) {
        console.error("Error fetching pizzas:", err);
        const errorMessage = "Failed to load pizzas. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  useEffect(() => {
    let result = [...pizzaData];

    // Apply search filter
    if (searchQuery.trim() !== "") {
      result = result.filter(pizza =>
        pizza.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply Veg/Non-Veg filter
    if (filterType !== "All") {
      result = result.filter(pizza => pizza.category === filterType);
    }

    setFilteredData(result);
  }, [searchQuery, filterType, pizzaData]);

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
      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search pizza..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-hero border-2 outline-none rounded-lg px-4 py-2 w-full sm:w-1/2"
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border bg-hero text-white rounded-lg px-4 py-2 w-full sm:w-48 outline-none"
          >
            <option value="All">All</option>
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
          </select>
        </div>

        {/* Pizza Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredData.length > 0 ? (
            filteredData.map((pizza) => (
              <PizzaCard key={pizza._id} pizza={pizza} />
            ))
          ) : (
            <div className="text-center col-span-full text-gray-600 text-lg">
              No pizzas found.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
