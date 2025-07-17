import React, { useEffect, useState } from "react";
import axios from "axios";
import PizzaCard from "../components/PizzaCard";
import Layout from "../components/Layout";
import { Leapfrog } from 'ldrs/react';
import 'ldrs/react/Leapfrog.css';
import { toast } from 'sonner';

const Home = () => {
  const [pizzaData, setPizzaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/pizzas`);
        setPizzaData(res.data);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {pizzaData.length > 0 ? (
          pizzaData.map((pizza) => (
            <PizzaCard key={pizza._id} pizza={pizza} />
          ))
        ) : (
          <div className="text-center col-span-full text-gray-600 text-lg">
            No pizzas found for this category.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;