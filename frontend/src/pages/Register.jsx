import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginPizza from "../assets/image.png";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Leapfrog } from 'ldrs/react';
import 'ldrs/react/Leapfrog.css';
import { toast } from 'sonner';

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/users/register`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      toast.success(response.data.message || "Please check your email to verify");
      localStorage.setItem("unverifiedEmail", formData.email);
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center h-screen bg-gray-50">
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm"
        >
          <h1 className="text-4xl text-center text-hero mb-6">Sign Up</h1>

          {loading ? (
            <div className="flex justify-center items-center h-24">
              <Leapfrog
                size="40"
                speed="2.5"
                color="#FFA527"
              />
            </div>
          ) : (
            <>
              {/* Username */}
              <div className="mb-4">
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  autoComplete="off"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border-2 border-hero rounded-md focus:outline-none focus:ring-2 focus:ring-hero px-4 py-2 placeholder-gray-350 text-gray-600 text-sm"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Enter email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-2 border-hero rounded-md focus:outline-none focus:ring-2 focus:ring-hero px-4 py-2 placeholder-gray-350 text-gray-600 text-sm"
                />
              </div>

              {/* Password */}
              <div className="mb-4 flex items-center border-2 border-hero rounded-md focus-within:ring-2 focus-within:ring-hero">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 placeholder-gray-400 text-sm text-gray-600 border-none outline-none"
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  className="text-gray-600 cursor-pointer px-2"
                  onClick={togglePasswordVisibility}
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-4 flex items-center border-2 border-hero rounded-md focus-within:ring-2 focus-within:ring-hero">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword1 ? "text" : "password"}
                  autoComplete="off"
                  placeholder="Enter Password Again"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 placeholder-gray-400 text-sm text-gray-600 border-none outline-none"
                />
                <FontAwesomeIcon
                  icon={showPassword1 ? faEye : faEyeSlash}
                  className="text-gray-600 cursor-pointer px-2"
                  onClick={togglePasswordVisibility1}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-hero hover:bg-hero-opacity-75 text-white rounded-md py-2 transition duration-300 ease-in-out"
                disabled={loading}
              >
                Sign Up
              </button>
            </>
          )}

          {/* Login Link */}
          <div className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>

      {/* Side Image */}
      <img
        src={loginPizza}
        alt="Delicious Pizza"
        className="h-screen w-1/2 object-cover hidden md:block"
      />
    </div>
  );
};

export default Register;
