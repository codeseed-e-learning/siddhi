import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../Api";
import HomeButton from "./Homebutton";
import * as XLSX from "xlsx";

const Customers = ({ showButton = true, showNavbar = true }) => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  // Add Customer Form Component
  const AddCustomerForm = ({ onSubmit, onClose, initialData = null }) => {
    const [formData, setFormData] = useState({
      firstname: "",
      lastname: "",
      age: "",
      gender: "",
      mobile: "",
      address: "",
    });

    useEffect(() => {
      if (initialData) setFormData(initialData);
    }, [initialData]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["firstname", "lastname", "age", "gender", "mobile", "address"].map(
            (field) => (
              <div key={field}>
                <label className="block mb-1 capitalize">{field}</label>
                <input
                  type={field === "age" ? "number" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            )
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {initialData ? "Update Customer" : "Add Customer"}
          </button>
        </div>
      </form>
    );
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/all-customer`);
        setCustomers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch customers");
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/customers/${customerToDelete.id}`);
      setCustomers(
        customers.filter((customer) => customer.id !== customerToDelete.id)
      );
      setIsDeleteModalOpen(false);

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Customer has been deleted successfully.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate(0); // Refresh page after delete
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete customer",
      });
    }
  };
  const handleAddCustomer = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/customers`, formData);
      setCustomers((prev) => [response.data, ...prev]);
      setIsAddModalOpen(false);
      Swal.fire("Success!", "Customer added successfully.", "success");
    } catch {
      Swal.fire("Error!", "Failed to add customer.", "error");
    }
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (customer) => {
    setEditFormData({
      firstname: customer.firstname,
      lastname: customer.lastname,
      age: customer.age,
      gender: customer.gender,
      address: customer.address,
      mobile: customer.mobile,
    });
    setIsEditModalOpen(true);
    setIsViewModalOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE_URL}/customers/${selectedCustomer.id}`,
        editFormData
      );

      setCustomers(
        customers.map((customer) =>
          customer.id === selectedCustomer.id
            ? { ...customer, ...editFormData }
            : customer
        )
      );

      setIsEditModalOpen(false);
      setEditFormData(null);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Customer has been updated successfully.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate(0); // Refresh page after update
      });
    } catch (error) {
      console.error("Error updating customer:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update customer",
      });
    }
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(customers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(workbook, "customers.xlsx");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Log the parsed data to check its structure
      console.log("Parsed Data:", jsonData);

      // Send the parsed data to the API
      try {
        const response = await axios.post(`${API_BASE_URL}/customers`, jsonData);
        console.log("API Response:", response.data); // Log the response
        
        Swal.fire("Success!", "Customers added successfully.", "success");
        fetchCustomers(); // Refresh the customer list after upload
      } catch (error) {
        console.error("Error uploading customers:", error.response ? error.response.data : error);
        Swal.fire("Error!", "Failed to add customers: " + (error.response ? error.response.data.message : "Unknown error"), "error");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  if (error) {
    return <p>{error}</p>;
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="container mx-auto p-4 bg-bg">
        {showButton && <HomeButton />}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
            All Customers
          </h1>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* File Upload */}
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
            />

            {/* Export to Excel Button */}
            <button
              onClick={exportToCSV}
              className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Export to Excel
            </button>

            {/* Add New Customer Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add New Customer
            </button>

            {/* Add Customer Modal */}
            {isAddModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add New Customer</h2>
                    <button
                      onClick={() => setIsAddModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <AddCustomerForm
                    onSubmit={handleAddCustomer}
                    onClose={() => setIsAddModalOpen(false)}
                  />
                </div>
              </div>
            )}

            {/* Search Input */}
            <input
              type="search"
              placeholder="Search customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">First Name</th>
                  <th className="px-4 py-2 border">Last Name</th>
                  <th className="px-4 py-2 border">Age</th>
                  <th className="px-4 py-2 border">Gender</th>
                  <th className="px-4 py-2 border">Address</th>
                  <th className="px-4 py-2 border">Mobile</th>
                  <th className="px-4 py-2 border">Created At</th>
                  <th className="px-4 py-2 border">Updated At</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border">{customer.id}</td>
                    <td className="px-4 py-2 border">{customer.firstname}</td>
                    <td className="px-4 py-2 border">{customer.lastname}</td>
                    <td className="px-4 py-2 border">{customer.age}</td>
                    <td className="px-4 py-2 border">{customer.gender}</td>
                    <td className="px-4 py-2 border">{customer.address}</td>
                    <td className="px-4 py-2 border">{customer.mobile}</td>
                    <td className="px-4 py-2 border">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date(customer.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(customer)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(customer)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isViewModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Customer Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">First Name:</p>
                <p>{selectedCustomer.firstname}</p>
              </div>
              <div>
                <p className="font-semibold">Last Name:</p>
                <p>{selectedCustomer.lastname}</p>
              </div>
              <div>
                <p className="font-semibold">Age:</p>
                <p>{selectedCustomer.age}</p>
              </div>
              <div>
                <p className="font-semibold">Gender:</p>
                <p>{selectedCustomer.gender}</p>
              </div>
              <div>
                <p className="font-semibold">Address:</p>
                <p>{selectedCustomer.address}</p>
              </div>
              <div>
                <p className="font-semibold">Mobile:</p>
                <p>{selectedCustomer.mobile}</p>
              </div>
              <div>
                <p className="font-semibold">Created At:</p>
                <p>
                  {new Date(selectedCustomer.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="font-semibold">Updated At:</p>
                <p>
                  {new Date(selectedCustomer.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => handleEditClick(selectedCustomer)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && customerToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Confirm Delete
              </h2>
              <p className="mt-2 text-gray-600">
                Are you sure you want to delete customer "
                {customerToDelete.firstname} {customerToDelete.lastname}"?
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Customer</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.firstname}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        firstname: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.lastname}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        lastname: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    value={editFormData.age}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, age: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    value={editFormData.gender}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        gender: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    value={editFormData.address}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        address: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile
                  </label>
                  <input
                    type="text"
                    value={editFormData.mobile}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        mobile: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Customers;
