import React from "react";
import footerImage from "../assets/footer.png";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-hero text-white py-12 mt-32 w-full flex flex-col md:flex-row justify-between items-center px-6 md:px-24">
      <div className="mb-6 md:mb-0">
        <img
          src={footerImage}
          alt="Footer Logo"
          className="h-36 md:h-48 w-auto object-contain"
        />
      </div>
      <div className="flex flex-col md:items-start items-center gap-4 text-lg md:text-xl">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/my-cart">My Cart</Link>
        <Link to="/help">Help</Link>
      </div>
    </footer>
  );
};

export default Footer;
