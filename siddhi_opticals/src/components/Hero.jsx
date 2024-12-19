import React from "react";
import New_order from "../assets/icons/New_order.svg";
import All_orders from "../assets/icons/All_orders.svg";
import Pending_order from "../assets/icons/Pending_order.svg";
import Pending_payment from "../assets/icons/Pending_payment.svg";
import Stock from "../assets/icons/Stock.svg";
import Find from "../assets/icons/Find.svg";
import Visitbook from "../assets/icons/Visitbook.svg";
import Order_lens from "../assets/icons/Order_lens.svg";
import Data_Management from "../assets/icons/Data_Management.svg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <>
      <div className="bg-bg md:p-12 flex flex-col items-center">
        <p className="text-center md:mb-8 text-text-primary md:text-2xl font-semibold text-xl my-10 md:my-0">
          A Complete Retail Optical Shop Management Software
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-5/6 px-4">
          {/* Each card */}
          <Link to={"/new-order"}>
            <div className="flex flex-col items-center justify-center bg-card p-6 h-44 rounded-xl shadow-md hover:scale-105 transition-transform">
              <img src={New_order} alt="New Order" className="h-16 w-16 mb-4" />
              <span className="text-xl font-medium text-black capitalize">
                New Order
              </span>
            </div>
          </Link>

          <Link to="/recentorders">
            <div className="flex flex-col items-center justify-center bg-pink-300 p-6 h-44 rounded-xl shadow-md hover:scale-105 transition-transform">
              <img
                src={All_orders}
                alt="Pending Order"
                className="h-16 w-16 mb-4"
              />
              <span className="text-xl font-medium text-black">All Orders</span>
            </div>
          </Link>

          <Link to="/pending-orders">
            <div className="flex flex-col items-center justify-center bg-yellow-300 p-6 h-44 rounded-xl shadow-md hover:scale-105 transition-transform">
              <img
                src={Pending_order}
                alt="Pending Order"
                className="h-16 w-16 mb-4"
              />
              <span className="text-xl font-medium text-black">
                Pending Orders
              </span>
            </div>
          </Link>

          <Link to="/pending-payment">
            <div className="flex flex-col items-center justify-center bg-yellow-500 p-6 h-44 rounded-xl shadow-md hover:scale-105 transition-transform">
              <img
                src={Pending_payment}
                alt="Pending Payment"
                className="h-16 w-16 mb-4"
              />
              <span className="text-xl font-medium text-black">
                Pending Payments
              </span>
            </div>
          </Link>

          <Link to="/frames">
            <div className="flex flex-col items-center justify-center bg-blue-500 p-6 h-44 rounded-xl shadow-md hover:scale-105 transition-transform">
              <img src={Stock} alt="Stock" className="h-16 w-16 mb-4" />
              <span className="text-xl font-medium text-black">Stocks</span>
            </div>
          </Link>

          <Link to="/find">
            <div className="flex flex-col items-center justify-center bg-red-500 p-6 h-44 rounded-xl shadow-md hover:scale-105 transition-transform">
              <img src={Find} alt="Find/Reports" className="h-16 w-16 mb-4" />
              <span className="text-xl font-medium text-black">
                Find / Reports
              </span>
            </div>
          </Link>

          <Link to="/visitbook">
            <div className="flex flex-col items-center justify-center bg-green-500 p-6 h-44 rounded-xl shadow-md hover:scale-105 transition-transform">
              <img src={Visitbook} alt="Visitbook" className="h-16 w-16 mb-4" />
              <span className="text-xl font-medium text-black">Visitbook</span>
            </div>
          </Link>

          <Link to="/order-lens">
            <div className="flex flex-col items-center justify-center bg-purple-500 p-6 h-44 rounded-xl shadow-md hover:scale-105 transition-transform">
              <img
                src={Order_lens}
                alt="Order Lens"
                className="h-16 w-16 mb-4"
              />
              <span className="text-xl font-medium text-black">
                Order Lense
              </span>
            </div>
          </Link>

          <Link to="/data-management">
            <div className="flex flex-col items-center justify-center bg-pink-500 p-6 h-44 rounded-xl shadow-md hover:scale-105 transition-transform">
              <img
                src={Data_Management}
                alt="Data Management"
                className="h-16 w-16 mb-4"
              />
              <span className="text-xl font-medium text-black">
                Data Management
              </span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Hero;
