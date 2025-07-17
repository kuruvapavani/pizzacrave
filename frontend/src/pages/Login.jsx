import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import loginPizza from "../assets/image.png";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Leapfrog } from "ldrs/react";
import "ldrs/react/Leapfrog.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(()=>{
    const getToken = localStorage.getItem("authToken");
      if(getToken){
        navigate('/');
      }
  },[navigate])
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/users/login`,
        { email, password }
      );

      const { _id, token,username } = response.data;

      // Store token and user info
      localStorage.setItem("authToken", token);
      localStorage.setItem("username", username);
      localStorage.setItem("id", _id);

      navigate("/");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center h-screen bg-gray-50">
      {/* Image Section */}
      <img
        src={loginPizza}
        alt="Delicious Pizza"
        className="h-screen w-1/2 object-cover hidden md:block"
      />

      {/* Login Form Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
          <h1 className="text-4xl text-center text-hero mb-6">Sign In</h1>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}

          {/* Conditional rendering of the spinner */}
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <Leapfrog size="40" speed="2.5" color="#FFA527" />
            </div>
          ) : (
            <form onSubmit={handleLogin}>
              {/* Email Input */}
              <div className="mb-4">
                <input
                  id="email"
                  type="text"
                  placeholder="Enter email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-hero rounded-md focus:outline-none focus:ring-2 focus:ring-hero px-4 py-2 placeholder-gray-350 text-gray-600 text-sm"
                />
              </div>

              {/* Password Input */}
              <div className="mb-4 flex items-center border-2 border-hero rounded-md focus-within:ring-2 focus-within:ring-hero">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 placeholder-gray-400 text-sm text-gray-600 border-none outline-none"
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  className="text-gray-600 cursor-pointer px-2"
                  onClick={togglePasswordVisibility}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-hero hover:bg-hero-opacity-75 text-white rounded-md py-2 transition duration-300 ease-in-out"
                disabled={loading} // Disable button while loading
              >
                Sign In
              </button>
            </form>
          )}

          <div className="text-right mt-2 text-sm text-gray-600">
            <Link to="/forgot-password">Forgot Password ? </Link>
          </div>

          {/* Sign Up Redirect */}
          <div className="text-center mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
