import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HomeButton from "../components/Homebutton";
import { API_BASE_URL } from "../Api";
import axios from "axios";

const AllOrders = ({ showButton = true, showNavbar = true }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/all-orders`);
        setOrders(response.data.orders); // Assuming the Laravel API returns `orders` key
        setLoading(false);
        console.log(response.data);

      } catch (err) {
        setError("Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Update the order status in the backend
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/orders/${orderId}`, {
        status: newStatus,
      });

      // Update the status locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Handle loading state
  if (loading) {
    return <p>Loading orders...</p>;
  }

  // Handle error state
  if (error) {
    return <p>{error}</p>;
  }

  // Render orders table
  return (
    <>
      {showNavbar && <Navbar />}
      <div className="container mx-auto p-4 bg-gray-100">
        {showButton && <HomeButton />}
        <h1 className="text-2xl font-bold mb-4">All Orders</h1>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Order ID</th>
                  <th className="px-4 py-2 border">Customer Name</th>
                  <th className="px-4 py-2 border">Mobile</th>
                  <th className="px-4 py-2 border">Address</th>
                  <th className="px-4 py-2 border">Age</th>
                  <th className="px-4 py-2 border">Gender</th>
                  <th className="px-4 py-2 border">Doctor Name</th>
                  <th className="px-4 py-2 border">Hospital</th>
                  <th className="px-4 py-2 border">Doctor City</th>
                  <th className="px-4 py-2 border">Shop Name</th>
                  <th className="px-4 py-2 border">Optician City</th>
                  <th className="px-4 py-2 border">Order Taken Date</th>
                  <th className="px-4 py-2 border">Estimate Completion Date</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border">{order.order_id}</td>
                    <td className="px-4 py-2 border">
                      {order.firstname} {order.lastname}
                    </td>
                    <td className="px-4 py-2 border">{order.mobile}</td>
                    <td className="px-4 py-2 border">{order.address}</td>
                    <td className="px-4 py-2 border">{order.age}</td>
                    <td className="px-4 py-2 border">{order.gender}</td>
                    <td className="px-4 py-2 border">{order.doctor_name}</td>
                    <td className="px-4 py-2 border">{order.hospital}</td>
                    <td className="px-4 py-2 border">{order.doctor_city}</td>
                    <td className="px-4 py-2 border">{order.shop_name}</td>
                    <td className="px-4 py-2 border">{order.optician_city}</td>
                    <td className="px-4 py-2 border">
                      {order.order_taken_date}
                    </td>
                    <td className="px-4 py-2 border">
                      {order.estimate_completion_date}
                    </td>
                    <td className="px-4 py-2 border">
                      {order.status || "Pending"}
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        className="border border-gray-300 rounded px-2 py-1"
                        value={order.status || "Pending"}
                        onChange={(e) =>
                          updateOrderStatus(order.order_id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AllOrders;
