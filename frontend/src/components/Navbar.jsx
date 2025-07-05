import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { faCartPlus, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check auth on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // or selectively remove auth items
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar bg-white shadow-lg px-6 flex justify-between items-center w-full">
      {/* Logo */}
      <div>
        <Link to="/">
          <img
            src={Logo}
            alt="Logo"
            className="md:h-20 h-16 w-auto cursor-pointer pt-2"
          />
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Cart Icon */}
        <Link to="/my-cart" aria-label="Shopping Cart">
          <FontAwesomeIcon
            icon={faCartPlus}
            className="text-hero hover:text-hero-dark text-xl transition-all duration-300 ease-in-out"
          />
        </Link>

        {/* Auth Buttons */}
        {!isLoggedIn ? (
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
          <div className="flex items-center space-x-4">
            {/* Profile Icon */}
            <Link to="/profile" aria-label="Profile">
              <FontAwesomeIcon
                icon={faUser}
                className="text-hero hover:text-hero-dark text-xl cursor-pointer transition-all duration-300 ease-in-out"
              />
            </Link>

            {/* Logout Icon */}
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="text-hero hover:text-hero-dark text-xl transition-all duration-300 ease-in-out"
              title="Logout"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
