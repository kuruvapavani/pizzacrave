import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Leapfrog } from 'ldrs/react';
import 'ldrs/react/Leapfrog.css';
import { toast } from 'sonner';

const Checkout = () => {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const checkCartAndSetLoading = async () => {
      if (!userId || !token) {
        navigate("/login");
        toast.error("Please log in to proceed to checkout.");
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/cart/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.data.items || res.data.items.length === 0) {
          setMessage("Your cart is empty. Please add items before checking out.");
          toast.error("Your cart is empty. Redirecting to cart.");
          setTimeout(() => navigate("/my-cart"), 2000);
        }
      } catch (err) {
        console.error("Error checking cart:", err);
        setMessage("Failed to load cart. Please try again.");
        toast.error("Failed to load your cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    checkCartAndSetLoading();
  }, [userId, token, navigate]);

  const handleGetLocation = () => {
    setMessage("");
    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported by your browser. Please enter address manually.");
      toast.error("Geolocation not supported by your browser.");
      return;
    }

    setLoading(true);

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
            setMessage("Location fetched successfully!");
            toast.success("Location fetched successfully!");
          } else {
            setMessage("Could not fetch address from your location.");
            toast.error("Could not fetch address from your location.");
          }
        } catch (err) {
          console.error("Reverse Geocoding Error:", err);
          setMessage("Failed to fetch address from location. Please try again or enter manually.");
          toast.error("Failed to fetch address from location.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
        setLoading(false);
        let errorMessage = "Failed to get your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location access denied. Please enable location services in your browser settings.";
          toast.error("Location access denied.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information is unavailable.";
          toast.error("Location information is unavailable.");
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "The request to get user location timed out.";
          toast.error("Location request timed out.");
        }
        setMessage(errorMessage + " Please enter address manually.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!address.trim()) {
      setMessage("Please enter a delivery address.");
      toast.error("Please enter a delivery address.");
      return;
    }

    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (paymentMethod === "cod") {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/orders`,
          { address, paymentMethod: "cod" },
          config
        );
        setMessage("Order placed successfully (Cash on Delivery)!");
        toast.success("Order placed successfully!");
        setTimeout(() => navigate("/my-orders"), 1500);
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/payment/create-stripe-session`,
          { address },
          config
        );

        if (res.data.url) {
          window.location.href = res.data.url;
        } else {
          setMessage("Failed to initiate online payment. Please try again.");
          toast.error("Failed to initiate online payment.");
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred during order placement. Please try again.");
      toast.error("An error occurred during order placement.");
    } finally {
      if (paymentMethod === "cod" || (paymentMethod === "online" && !window.location.href.includes('stripe.com'))) {
          setLoading(false);
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-5">
        <h1 className="text-3xl text-hero text-center my-6">Checkout</h1>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Leapfrog
              size="60"
              speed="2.5"
              color="#FFA527"
            />
          </div>
        ) : (
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
                disabled={loading}
                className="mb-2 px-4 py-2 bg-hero text-white rounded disabled:opacity-50"
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
                  disabled={loading}
                />
                Cash on Delivery
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                  disabled={loading}
                />
                Pay Now (Online with Stripe)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !address.trim()}
              className="bg-hero text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>

            <p className="text-sm mt-2 bg-yellow-100 text-yellow-800 border border-yellow-300 p-2 rounded">
              ⚠️ Payments are simulated using <strong>Stripe Test Mode</strong>.
              Use test cards only.
            </p>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default Checkout;