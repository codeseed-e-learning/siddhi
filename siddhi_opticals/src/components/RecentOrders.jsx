import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HomeButton from "../components/HomeButton";
import { API_BASE_URL } from "../Api";
import axios from "axios";
import "tailwindcss/tailwind.css"; // Assuming Tailwind CSS is set up
import Swal from "sweetalert2";
import Footer from "./Footer";
const RecentOrders = ({ showButton = true, showNavbar = true }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders/allOrders`);
        setOrders(response.data.orders);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.payment_status || "Pending");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateOrderStatus = async () => {
    try {
      await axios.post(`${API_BASE_URL}/orders/updateStatus`, {
        order_id: selectedOrder.order_id,
        payment_status: newStatus,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === selectedOrder.order_id
            ? { ...order, payment_status: newStatus }
            : order
        )
      );
      closeModal();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      "Order ID", "Customer Name", "Mobile", "Address", "Age", "Gender",
      "Doctor Name", "Hospital", "Doctor City", "Shop Name", "Optician City",
      "Order Details", "Total Bill", "Payment Status", "Order Taken Date",
      "Estimate Completion Date", "Paid Amount", "Remaining Payment", "Medicine Prescription", "Created At", "Updated At", "Completion Status",
      "Right Eye Sph (D)", "Right Eye Cyl (D)", "Right Eye Axis", "Right Eye Add", "Left Eye Sph (D)", "Left Eye Cyl (D)", "Left Eye Axis", "Left Eye Add",
      "Right Eye Sph (N)", "Right Eye Cyl (N)", "Right Eye Axis (N)", "Left Eye Sph (N)", "Left Eye Cyl (N)", "Left Eye Axis (N)",
      "Right Eye Sph (CL)", "Right Eye Cyl (CL)", "Right Eye Axis (CL)", "Left Eye Sph (CL)", "Left Eye Cyl (CL)", "Left Eye Axis (CL)"
    ];
    csvRows.push(headers.join(','));

    orders.forEach(order => {
      const row = [
        order.order_id,
        `${order.firstname} ${order.lastname}`,
        order.mobile,
        order.address,
        order.age,
        order.gender,
        order.doctor_name || "-",
        order.hospital || "-",
        order.doctor_city || "-",
        order.shop_name || "-",
        order.optician_city || "-",
        order.order_details || "-",
        order.total_bill || "-",
        order.payment_status || "Pending",
        order.order_taken_date,
        order.estimate_completion_date,
        order.paid_amount || "-",
        order.remaining_payment || "-",
        order.medicine_prescription || "-",
        order.created_at,
        order.updated_at,
        order.completion_status,
        order.right_sph_D || "-",
        order.right_cyl_D || "-",
        order.right_axis || "-",
        order.right_sph_add || "-",
        order.left_sph_D || "-",
        order.left_cyl_D || "-",
        order.left_axis || "-",
        order.left_sph_add || "-",
        order.right_sph_N || "-",
        order.right_cyl_N || "-",
        order.right_axis_N || "-",
        order.left_sph_N || "-",
        order.left_cyl_N || "-",
        order.left_axis_N || "-",
        order.right_sph_cl || "-",
        order.right_cyl_cl || "-",
        order.right_axis_cl || "-",
        order.left_sph_cl || "-",
        order.left_cyl_cl || "-",
        order.left_axis_cl || "-"
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'orders.csv');
    a.click();
  };
  const handleDelete = (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/orders/${orderId}`);
          setOrders(orders.filter((order) => order.order_id !== orderId));
          Swal.fire("Deleted!", "The order has been deleted.", "success");
        } catch (err) {
          Swal.fire("Error!", "Failed to delete the order.", "error");
        }
      }
    });
  };
  const formatDate = (dateString) => {
    // Create a new Date object from the input string
    const date = new Date(dateString);

    // Extract the day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
    const year = date.getFullYear(); // Get full year

    // Return the formatted date
    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold text-lg">{error}</p>
      </div>
    );
  }
  const calculateRemainingDays = (completionDate) => {
    const today = new Date(); // Get the current date
    const completion = new Date(completionDate); // Convert the completion date string to a Date object
    const timeDiff = completion - today; // Calculate the difference in milliseconds
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return daysRemaining >= 0 ? daysRemaining : 0; // Return days remaining or 0 if the date has passed
};

  return (
    <>
      {showNavbar && <Navbar />}
      <div className="container mx-auto ">
        {showButton && <HomeButton />}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">All Orders</h1>
        <button
          onClick={exportToCSV}
          className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md">
          Export to CSV
        </button>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          <>


            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="table-auto min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sr</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Taken Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days to complete order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor City</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shop Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Optician City</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Bill</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Taken Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estimate Completion Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remaining Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase" colSpan={2}>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order, index) => (
                    <tr
                      key={order.order_id}
                      className={`hover:bg-gray-50 ${order.payment_status === "paid" ? "bg-green-300" : order.completion_status ? "bg-yellow-300" : "bg-gray-100"}`}

                    >
                      <td className="px-6 py-4 text-sm text-black">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-black">{formatDate(order.order_taken_date)}</td>
                      <td className="px-6 py-4 text-sm text-black">{formatDate(order.estimate_completion_date)}</td>
                      <td className="px-6 py-4 text-sm text-black">{calculateRemainingDays(order.estimate_completion_date)} days</td>
                      <td className="px-6 py-4 text-sm text-black">{order.order_id}</td>
                      <td className="px-6 py-4 text-sm text-black">{`${order.firstname} ${order.lastname}`}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.mobile}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.address}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.age}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.gender}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.doctor_name || "-"}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.hospital || "-"}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.doctor_city || "-"}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.shop_name || "-"}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.optician_city || "-"}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.total_bill || "-"}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.payment_status || "Pending"}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.order_taken_date}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.estimate_completion_date}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.paid_amount || "-"}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.remaining_payment || "-"}</td>
                      <td className="px-6 py-4 text-sm text-black">{order.created_at}</td>
                      <td className="px-6 py-4 text-sm text-black">
                        <button
                          onClick={() => openModal(order)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                          Update
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                          onClick={() => handleDelete(order.order_id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
            <Footer />
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <h2 className="text-2xl font-semibold mb-4">Update Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedOrder &&
                Object.keys(selectedOrder).map((key) => (
                  <div key={key} className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/_/g, " ")}
                    </label>
                    {key === "payment_status" || key === "completion_status" ? (
                      <select
                        value={selectedOrder[key]}
                        onChange={(e) =>
                          setSelectedOrder({ ...selectedOrder, [key]: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-md mt-1"
                      >
                        {key === "payment_status" && (
                          <>
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Cancelled">Cancelled</option>
                          </>
                        )}
                        {key === "completion_status" && (
                          <>
                            <option value="Incomplete">Incomplete</option>
                            <option value="Complete">Complete</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={selectedOrder[key] || ""}
                        onChange={(e) =>
                          setSelectedOrder({ ...selectedOrder, [key]: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-md mt-1"
                      />
                    )}
                  </div>
                ))}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md">
                Cancel
              </button>
              <button
                onClick={updateOrderStatus}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                Save Changes
              </button>
            </div>
          </div>

        </div>
      )}


    </>
  );
};

export default RecentOrders;
