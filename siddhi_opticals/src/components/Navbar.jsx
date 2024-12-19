import React, { useState, useEffect, useRef } from "react";
import New_order from "../assets/icons/New_order.svg";
import Pending_order from "../assets/icons/Pending_order.svg";
import Pending_payment from "../assets/icons/Pending_payment.svg";
import Stock from "../assets/icons/Stock.svg";
import Find from "../assets/icons/Find.svg";
import Visitbook from "../assets/icons/Visitbook.svg";
import Order_lens from "../assets/icons/Order_lens.svg";
import Data_Management from "../assets/icons/Data_Management.svg";
import Settings from "../assets/icons/Settings.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();
  const [showSettings, setShowSettings] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const settingsDropdownRef = useRef(null);
  const navigate = useNavigate();
  const [mobileStock, setMobileStock] = useState(false);
  const [mobileNewStock, setMobileNewStock] = useState(false);
  const [mobileEditStock, setMobileEditStock] = useState(false);
  const [mobileLens, setMobileLens] = useState(false);
  const stockDropdownRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showStockDropdown, setShowStockDropdown] = useState(false);
  const [showNewStock, setShowNewStock] = useState(false);
  const [showEditStock, setShowEditStock] = useState(false);
  const [showLensMenu, setShowLensMenu] = useState(false);
  const [showMobileSettings, setShowMobileSettings] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingsDropdownRef.current &&
        !settingsDropdownRef.current.contains(event.target)
      ) {
        setShowSettings(false);
      }
      if (
        stockDropdownRef.current &&
        !stockDropdownRef.current.contains(event.target)
      ) {
        setMobileStock(false);
        setMobileNewStock(false);
        setMobileEditStock(false);
        setMobileLens(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setShowSettings(false);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
    setShowStockDropdown(false);
    setShowNewStock(false);
    setShowEditStock(false);
    setShowLensMenu(false);
    setShowMobileSettings(false);
  };

  return (
    <nav className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 bg-white shadow-lg sticky top-0 z-50">
      {/* Logo and Hamburger */}
      <div className="flex justify-between items-center w-full md:w-auto py-4">
        <div className="text-xl font-bold text-gray-800">
          <Link to={"/dashboard"} className="hover:text-gray-600">
            <img
              src="/logo.jpeg"
              alt="Siddhi Opticals Logo"
              className="h-8 w-24"
            />
          </Link>
        </div>
        {isAuthenticated && (
          <div className="ml-2">
            <p> {user.name} </p>{" "}
          </div>
        )}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-700 z-50"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16m-7 6h7"
              }
            />
          </svg>
        </button>
      </div>
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-4">
        <Link
          to={"/new-order"}
          className="flex flex-col items-center p-2 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <img
            src={New_order}
            alt="New Order"
            className="h-6 w-6 mb-1"
            style={{ filter: "brightness(0)" }}
          />
          <span className="text-xs">New Order</span>
        </Link>

        <Link
          to={"/pending-orders"}
          className="flex flex-col items-center p-2 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <img
            src={Pending_order}
            alt="Pending Orders"
            className="h-6 w-6 mb-1"
            style={{ filter: "brightness(0)" }}
          />
          <span className="text-xs">Pending Orders</span>
        </Link>

        <Link
          to={"/pending-payment"}
          className="flex flex-col items-center p-2 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <img
            src={Pending_payment}
            alt="Pending Payment"
            className="h-6 w-6 mb-1"
            style={{ filter: "brightness(0)" }}
          />
          <span className="text-xs">Pending Payment</span>
        </Link>

        {/* Desktop Stock Dropdown */}
        <div
          className="relative"
          ref={stockDropdownRef}
          onMouseEnter={() => setMobileStock(true)}
          onMouseLeave={() => {
            setMobileStock(false);
            setMobileNewStock(false);
            setMobileEditStock(false);
            setMobileLens(false);
          }}
        >
          <button className="flex flex-col items-center p-2 rounded-lg text-gray-700 hover:bg-gray-50">
            <img
              src={Stock}
              alt="Stock"
              className="h-6 w-6 mb-1"
              style={{ filter: "brightness(0)" }}
            />
            <span className="text-xs">Stock</span>
          </button>

          {/* Add this invisible bridge */}
          <div className="absolute w-full h-2 bg-transparent" />

          {mobileStock && (
            <div className="absolute left-0 mt-1 w-36 bg-white rounded-md shadow-lg">
              <div className="py-1">
                <div
                  onMouseEnter={() => {
                    setMobileNewStock(true);
                    setMobileEditStock(false);
                  }}
                >
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none">
                    New Stock
                  </button>
                  {mobileNewStock && (
                    <div
                      className="absolute left-[140px] -top-[1px] w-36 bg-white rounded-md shadow-lg"
                      onMouseEnter={() => setMobileNewStock(true)}
                    >
                      <button
                        onClick={() => navigate("/framestock")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none"
                      >
                        Frame
                      </button>
                      <button
                        onMouseEnter={() => setMobileLens(true)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none flex justify-between items-center"
                      >
                        Lens
                        <span>▶</span>
                      </button>

                      {mobileLens && (
                        <div
                          className="absolute left-[140px] top-8 w-36 bg-white rounded-md shadow-lg"
                          onMouseEnter={() => setMobileLens(true)}
                        >
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                            Single Vision
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                            Bifocal
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                            Contact Lens
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                            Progressive
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div
                  onMouseEnter={() => {
                    setMobileEditStock(true);
                    setMobileNewStock(false);
                    setMobileLens(false);
                  }}
                  onMouseLeave={() => {
                    setTimeout(() => {
                      if (
                        !stockDropdownRef.current?.contains(
                          document.activeElement
                        )
                      ) {
                        setMobileEditStock(false);
                      }
                    }, 100);
                  }}
                >
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none">
                    Edit/View Stock
                  </button>
                  {mobileEditStock && (
                    <div
                      className="absolute left-36 top-12 w-36 bg-white rounded-md shadow-lg ml-2"
                      onMouseLeave={() => setMobileEditStock(false)}
                    >
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none">
                        Frame Stock
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none">
                        Lens Stock
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <Link
          to={"/find"}
          className="flex flex-col items-center p-2 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <img
            src={Find}
            alt="Find"
            className="h-6 w-6 mb-1"
            style={{ filter: "brightness(0)" }}
          />
          <span className="text-xs">Find</span>
        </Link>

        <Link
          to={"/visitbook"}
          className="flex flex-col items-center p-2 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <img
            src={Visitbook}
            alt="Visitbook"
            className="h-6 w-6 mb-1"
            style={{ filter: "brightness(0)" }}
          />
          <span className="text-xs">Visitbook</span>
        </Link>

        <Link
          to={"/order-lens"}
          className="flex flex-col items-center p-2 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <img
            src={Order_lens}
            alt="Order Lens"
            className="h-6 w-6 mb-1"
            style={{ filter: "brightness(0)" }}
          />
          <span className="text-xs">Order Lens</span>
        </Link>

        <Link
          to={"/data-management"}
          className="flex flex-col items-center p-2 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <img
            src={Data_Management}
            alt="Data Management"
            className="h-6 w-6 mb-1"
            style={{ filter: "brightness(0)" }}
          />
          <span className="text-xs">Data Management</span>
        </Link>

        {/* Settings Dropdown */}
        <div
          className="relative"
          ref={settingsDropdownRef}
          onMouseEnter={() => {
            setShowSettings(true);
            // Reset other dropdowns
            setMobileStock(false);
            setMobileNewStock(false);
            setMobileEditStock(false);
            setMobileLens(false);
          }}
          onMouseLeave={() => {
            setShowSettings(false);
          }}
        >
          <button className="flex flex-col items-center p-2 rounded-lg text-gray-700 hover:bg-gray-50">
            <img
              src={Settings}
              alt="Settings"
              className="h-6 w-6 mb-1"
              style={{ filter: "brightness(0)" }}
            />
            <span className="text-xs">Settings</span>
          </button>

          {/* Add this invisible bridge */}
          <div className="absolute w-full h-2 bg-transparent" />

          {showSettings && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg">
              <div className="py-1">
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full">
                  <div className="flex items-center gap-2">
                    <img
                      src={Settings}
                      alt="Settings"
                      className="h-4 w-4"
                      style={{ filter: "brightness(0)" }}
                    />
                    Settings
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-semibold">Logout</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Menu - Slide from right */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } z-40`}
      >
        <div className="mt-5 ml-5">
          {isAuthenticated && <p> {user.name} </p>}
        </div>

        <div className="flex flex-col h-full pt-5 pb-6 overflow-y-auto">
          <div className="flex-1 px-4 space-y-2">
            <Link
              to={"/new-order"}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={handleMobileMenuClose}
            >
              <img
                src={New_order}
                alt="New Order"
                className="h-5 w-5"
                style={{ filter: "brightness(0)" }}
              />
              <span className="ml-3 text-sm">New Order</span>
            </Link>

            <Link
              to={"/pending-orders"}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={handleMobileMenuClose}
            >
              <img
                src={Pending_order}
                alt="Pending Orders"
                className="h-5 w-5"
                style={{ filter: "brightness(0)" }}
              />
              <span className="ml-3 text-sm">Pending Orders</span>
            </Link>

            <Link
              to={"/pending-payment"}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={handleMobileMenuClose}
            >
              <img
                src={Pending_payment}
                alt="Pending Payment"
                className="h-5 w-5"
                style={{ filter: "brightness(0)" }}
              />
              <span className="ml-3 text-sm">Pending Payment</span>
            </Link>

            {/* Stock Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStockDropdown(!showStockDropdown)}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <img
                  src={Stock}
                  alt="Stock"
                  className="h-5 w-5"
                  style={{ filter: "brightness(0)" }}
                />
                <span className="ml-3 text-sm">Stock</span>
                <svg
                  className={`ml-auto h-5 w-5 transform transition-transform duration-200 ${showStockDropdown ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showStockDropdown && (
                <div className="pl-8 mt-2 space-y-2">
                  <button
                    onClick={() => setShowNewStock(!showNewStock)}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <span className="text-sm">New Stock</span>
                    <svg
                      className={`ml-auto h-4 w-4 transform transition-transform duration-200 ${showNewStock ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showNewStock && (
                    <div className="pl-4 mt-2 space-y-2">
                      <button
                        onClick={() => {
                          navigate("/framestock");
                          handleMobileMenuClose();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Frame
                      </button>

                      <div>
                        <button
                          onClick={() => setShowLensMenu(!showLensMenu)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          <span>Lens</span>
                          <svg
                            className={`ml-auto h-4 w-4 transform transition-transform duration-200 ${showLensMenu ? "rotate-180" : ""
                              }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {showLensMenu && (
                          <div className="pl-4 mt-2 space-y-2">
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                              onClick={handleMobileMenuClose}
                            >
                              Single Vision
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                              onClick={handleMobileMenuClose}
                            >
                              Bifocal
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                              onClick={handleMobileMenuClose}
                            >
                              Progressive
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                              onClick={handleMobileMenuClose}
                            >
                              Contact Lens
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setShowEditStock(!showEditStock)}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <span className="text-sm">Edit/View Stock</span>
                    <svg
                      className={`ml-auto h-4 w-4 transform transition-transform duration-200 ${showEditStock ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showEditStock && (
                    <div className="pl-4 mt-2 space-y-2">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        onClick={handleMobileMenuClose}
                      >
                        Frame Stock
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        onClick={handleMobileMenuClose}
                      >
                        Lens Stock
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              to={"/find"}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={handleMobileMenuClose}
            >
              <img
                src={Find}
                alt="Find"
                className="h-5 w-5"
                style={{ filter: "brightness(0)" }}
              />
              <span className="ml-3 text-sm">Find</span>
            </Link>

            <Link
              to={"/visitbook"}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={handleMobileMenuClose}
            >
              <img
                src={Visitbook}
                alt="Visitbook"
                className="h-5 w-5"
                style={{ filter: "brightness(0)" }}
              />
              <span className="ml-3 text-sm">Visitbook</span>
            </Link>

            <Link
              to={"/order-lens"}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={handleMobileMenuClose}
            >
              <img
                src={Order_lens}
                alt="Order Lens"
                className="h-5 w-5"
                style={{ filter: "brightness(0)" }}
              />
              <span className="ml-3 text-sm">Order Lens</span>
            </Link>

            <Link
              to={"/data-management"}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={handleMobileMenuClose}
            >
              <img
                src={Data_Management}
                alt="Data Management"
                className="h-5 w-5"
                style={{ filter: "brightness(0)" }}
              />
              <span className="ml-3 text-sm">Data Management</span>
            </Link>

            {/* Settings in Mobile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMobileSettings(!showMobileSettings)}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <img
                  src={Settings}
                  alt="Settings"
                  className="h-5 w-5"
                  style={{ filter: "brightness(0)" }}
                />
                <span className="ml-3 text-sm">Settings</span>
                <svg
                  className={`ml-auto h-5 w-5 transform transition-transform duration-200 ${showMobileSettings ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showMobileSettings && (
                <div className="pl-8 mt-2 space-y-2">
                  <div className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    <img
                      src={Settings}
                      alt="Settings"
                      className="h-4 w-4"
                      style={{ filter: "brightness(0)" }}
                    />
                    <span className="ml-3 text-sm">Settings</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      handleMobileMenuClose();
                    }}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="ml-3 text-sm font-semibold">Logout</span>
                  </button>
                </div>
              )}
              <div className="pl-8 mt-2 space-y-2">
                {isAuthenticated ? (
                  <div>
                    <button
                      className=" bg-blue-700 hover:bg-blue-800 text-white p-3 rounded"
                      onClick={() =>
                        logout({
                          logoutParams: { returnTo: window.location.origin },
                        })
                      }
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      className="p-3 bg-blue-700 hover:bg-blue-800 text-white  rounded"
                      onClick={() => loginWithRedirect()}
                    >
                      Log In
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={handleMobileMenuClose}
        />
      )}
    </nav>
  );
};

export default Navbar;
