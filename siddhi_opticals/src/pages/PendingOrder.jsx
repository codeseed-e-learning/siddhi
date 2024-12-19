import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../Api.js";
import axios from "axios";
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
// import { FaSpinner } from 'react-icons/fa';

const PendingOrder = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch API
  const fetchApi = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/pending`);
      setPendingOrders(response.data.orders); // Assuming 'orders' is the key in the response
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pending orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        {loading ? (
          <div className="flex justify-center items-center text-lg text-gray-700">
            <FaSpinner className="animate-spin mr-2 text-blue-500" />
            Loading...
          </div>
        ) : pendingOrders.length > 0 ? (
          <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold text-center mb-6 ">Pending Orders</h1>
            <div className="overflow-x-auto">
              <table className="w-full border text-black table-auto text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border ">Order ID</th>
                    <th className="px-6 py-3 border ">Customer Name</th>
                    <th className="px-6 py-3 border ">Doctor Name</th>
                    <th className="px-6 py-3 border ">Hospital</th>
                    <th className="px-6 py-3 border ">Total Bill</th>
                    <th className="px-6 py-3 border ">Order Date</th>
                    <th className="px-6 py-3 border ">Customer Address</th>
                    <th className="px-6 py-3 border ">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-50">
                  {pendingOrders.map((order) => (
                    <tr key={order.order_id} className="text-center border-t hover:bg-gray-100">
                      <td className="px-6 py-4 border">{order.order_id}</td>
                      <td className="px-6 py-4 border">{order.firstname && order.lastname ? `${order.firstname} ${order.lastname}` : "N/A"}</td>
                      <td className="px-6 py-4 border">{order.doctor_name || "N/A"}</td>
                      <td className="px-6 py-4 border">{order.hospital || "N/A"}</td>
                      <td className="px-6 py-4 border">₹{order.total_bill || 0}</td>
                      <td className="px-6 py-4 border">{order.order_taken_date}</td>
                      <td className="px-6 py-4 border">{order.address || "N/A"}</td>
                      <td className="px-6 py-4 border">
                        <span className={`px-2 py-1 rounded-full text-white text-sm ${order.payment_status === "Paid" ? "bg-green-500" : "bg-red-500"}`}>
                          {order.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        ) : (
          <div className="text-lg text-gray-700 text-center">No pending orders found.</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PendingOrder;
