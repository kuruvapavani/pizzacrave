import React, { useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data.display_name) {
            setAddress(data.display_name);
          } else {
            alert("Could not fetch address.");
          }
        } catch (err) {
          console.error("Reverse Geocoding Error:", err);
          alert("Failed to fetch address from location.");
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
        alert("Failed to get your location.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address.trim()) return;
    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (paymentMethod === "cod") {
        // COD logic
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/orders`,
          { address, paymentMethod: "cod" },
          config
        );
        navigate("/my-orders");
      } else {
        // Stripe logic
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/payment/create-stripe-session`,
          { address },
          config
        );

        if (res.data.url) {
          window.location.href = res.data.url;
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-5">
        <h1 className="text-3xl text-hero text-center my-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <textarea
            className="w-full p-3 border rounded border-hero border-2 focus:border-hero"
            placeholder="Enter your delivery address"
            rows={4}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleGetLocation}
              className="mb-2 px-4 py-2 bg-hero text-white rounded"
            >
              Use Current Location
            </button>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="online"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              Pay Now (Online with Stripe)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-hero text-white px-4 py-2 rounded  disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>

          <p className="text-sm mt-2 bg-yellow-100 text-yellow-800 border border-yellow-300 p-2 rounded">
            ⚠️ Payments are simulated using <strong>Stripe Test Mode</strong>.
            Use test cards only.
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
