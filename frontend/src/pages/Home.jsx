import React, { useEffect, useState } from "react";
import axios from "axios";
import PizzaCard from "../components/PizzaCard";

const Home = () => {
  const [pizzaData, setPizzaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/getpizzas`);
        setPizzaData(res.data);
      } catch (err) {
        console.error("Error fetching pizzas:", err);
        setError("Failed to load pizzas. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading pizzas...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {pizzaData.length > 0 ? (
        pizzaData.map((pizza) => (
          <PizzaCard key={pizza._id} pizza={pizza} />
        ))
      ) : (
        <div className="text-center col-span-full">
          No pizzas found for this category
        </div>
      )}
    </div>
  );
};

export default Home;
