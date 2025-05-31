import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { faCartPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const isLoggedIn = localStorage.getItem("userToken");

const Navbar = () => {
  return (
    <nav className="navbar bg-white shadow-lg px-6 flex justify-between items-center w-full">
      <div>
        <Link to="/">
          <img src={Logo} alt="Logo" className="md:h-20 h-16 w-auto cursor-pointer pt-2" />
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Cart Icon */}
        <div className="relative cursor-pointer">
          <Link to="/my-cart" aria-label="Shopping Cart">
            <FontAwesomeIcon
              icon={faCartPlus}
              className="text-hero hover:text-hero-dark text-xl transition-all duration-300 ease-in-out"
            />
          </Link>
        </div>

        {/* Conditional Rendering */}
        {!isLoggedIn ? (
          // Login Button if not logged in
          <Link to="/login">
            <button
              className="bg-hero text-white md:px-6 md:py-2 px-4 py-1 text-sm md:text-base rounded-md 
              hover:bg-opacity-90 transition-all duration-300 ease-in-out"
              aria-label="Login"
            >
              Login
            </button>
          </Link>
        ) : (
          // Profile Icon if logged in
          <Link to="/profile">
            <FontAwesomeIcon
              icon={faUser}
              className="text-hero hover:text-hero-dark text-xl cursor-pointer transition-all duration-300 ease-in-out"
              aria-label="Profile"
            />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
