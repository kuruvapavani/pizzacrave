import React, { useState } from "react";
import axios from "axios";
import { Leapfrog } from 'ldrs/react';
import 'ldrs/react/Leapfrog.css';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/users/forgot-password`, {
        email,
      });
      toast.success(response.data.message);
      setEmail("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-hero">Forgot Password</h2>

        <div>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-hero border-2 rounded-xl py-2 px-6 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="py-2 px-6 bg-hero text-white rounded-xl mt-6 hover:bg-opacity-90 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <Leapfrog
                size="20" 
                speed="2.5"
                color="#FFFFFF"
              />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;