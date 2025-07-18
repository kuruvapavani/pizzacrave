import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const AboutPage = () => {
  return (
    <Layout>
      <div className="min-h-screen text-gray-800 px-6 py-16 md:px-24 flex flex-col justify-center items-center text-center">
        {/* Hero Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          Welcome to <span className="text-hero">PizzaCrave</span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl text-lg md:text-xl mb-10 leading-relaxed">
          PizzaCrave is your go-to destination for delicious, freshly baked
          pizzas delivered right to your doorstep. From classic flavors to
          gourmet creations, we’ve built this platform to make pizza ordering
          simple, fast, and fun. Whether you're craving a Margherita or
          something spicy, we’ve got you covered.
        </p>

        {/* Portfolio Link */}
        <Link
          to="https://kuruva-pavani.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-hero hover:bg-yellow-500 text-white font-semibold py-3 px-6 rounded-full transition duration-300"
        >
          Check Out My Portfolio
        </Link>
      </div>
    </Layout>
  );
};

export default AboutPage;
