import React from "react";
import companyName from "../Details";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-black py-10 border-t-2">
      <div className="container mx-auto px-6 md:grid grid-cols-12 gap-4">
        {/* Column 1: Navigation Links */}
        <div className="col-span-3">
          <h2 className="text-lg font-bold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link to={"/all-orders"} className="hover:text-blue-300">All Orders</Link>
            </li>
            <li>
              <Link to={"/doctors"} className="hover:text-blue-300">Doctors</Link>
            </li>
           
          </ul>
        </div>

        {/* Column 2: Contact Information */}
        <div className="col-span-3">
          <h2 className="text-lg font-bold mb-4">Contact Us</h2>
          <ul className="space-y-2">
            <li>
              <span className="font-semibold">Email:</span> amit.kasabe25@gmail.com
            </li>
            <li>
              <span className="font-semibold">Phone:</span> 8830231066
            </li>
            <li>
              <span className="font-semibold">Address:</span> Sant Peth , sangola chowk , pandharpur
            </li>
          </ul>
        </div>

        {/* Column 3: Social Media Links */}
        <div className="col-span-3">
          <h2 className="text-lg font-bold mb-4">Follow Us</h2>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300"
            >
              <i className="fab fa-facebook-f text-lg"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300"
            >
              <i className="fab fa-twitter text-lg"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300"
            >
              <i className="fab fa-linkedin-in text-lg"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300"
            >
              <i className="fab fa-instagram text-lg"></i>
            </a>
          </div>
        </div>

        {/* Column 4: Newsletter Subscription */}
        <div className="col-span-3">
          <h2 className="text-lg font-bold mb-4">Subscribe to Newsletter</h2>
          <form>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded bg-white text-black mb-4"
            />
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-400 mt-10 pt-6 text-center">
        <h1 className="text-xl font-bold mb-2">{companyName}</h1>
        <p className="text-sm">
          © {new Date().getFullYear()} Your Company Name. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
