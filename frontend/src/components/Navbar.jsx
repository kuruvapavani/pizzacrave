import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { faCartPlus, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'sonner';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  return (
    <nav className="navbar bg-white shadow-lg px-6 flex justify-between items-center w-full fixed">
      <div>
        <Link to="/">
          <img
            src={Logo}
            alt="Logo"
            className="md:h-20 h-16 w-auto cursor-pointer pt-2"
          />
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        <Link to="/my-cart" aria-label="Shopping Cart">
          <FontAwesomeIcon
            icon={faCartPlus}
            className="text-hero hover:text-hero-dark text-xl transition-all duration-300 ease-in-out"
          />
        </Link>

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
            <Link to="/my-profile" aria-label="Profile">
              <FontAwesomeIcon
                icon={faUser}
                className="text-hero hover:text-hero-dark text-xl cursor-pointer transition-all duration-300 ease-in-out"
              />
            </Link>

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
