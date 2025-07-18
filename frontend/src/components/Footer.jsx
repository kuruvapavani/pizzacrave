import React from "react";
import footerImage from "../assets/footer.png";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-hero text-white py-12 mt-32 w-full flex flex-col gap-10 md:flex-row justify-between px-6 md:px-24">
      {/* Logo Section */}
      <div className="flex flex-col items-center md:items-start">
        <img
          src={footerImage}
          alt="Footer Logo"
          className="h-36 md:h-48 w-auto object-contain"
        />
        <p className="text-sm mt-2 text-center md:text-left">
          © {new Date().getFullYear()} PizzaCrave. All rights reserved.
        </p>
      </div>

      {/* Quick Links */}
      <div className="flex flex-col gap-2 text-center md:text-left">
        <h3 className="font-bold text-lg">Quick Links</h3>
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/my-cart">My Cart</Link>
        <Link to="/my-orders">Order History</Link>
      </div>

      {/* Contact Info & Socials */}
      <div className="flex flex-col gap-2 text-center md:text-left">
        <h3 className="font-bold text-lg">Get in Touch</h3>
        <div className="flex items-center gap-2 justify-center md:justify-start">
          <FaEnvelope />
          <a href="mailto:pavanikuruva2109@gmail.com" className="hover:underline">
            pavanikuruva2109@gmail.com
          </a>
        </div>
        <div className="flex items-center gap-2 justify-center md:justify-start">
          <FaPhone />
          <span>+91 0000000000</span>
        </div>

        <div className="flex gap-4 mt-2 justify-center md:justify-start">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="hover:text-yellow-400 transition-colors" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="hover:text-yellow-400 transition-colors" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="hover:text-yellow-400 transition-colors" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
