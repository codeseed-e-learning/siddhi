import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../Api";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white w-full max-w-4xl mx-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const AllCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/all-customer`
        );
        setCustomers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch customers");
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`${API_BASE_URL}${id}`);
        setCustomers(customers.filter((customer) => customer.id !== id));
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const ViewCustomerDetails = ({ customer }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">First Name</p>
          <p>{customer.firstname}</p>
        </div>
        <div>
          <p className="font-semibold">Last Name</p>
          <p>{customer.lastname}</p>
        </div>
        <div>
          <p className="font-semibold">Age</p>
          <p>{customer.age}</p>
        </div>
        <div>
          <p className="font-semibold">Gender</p>
          <p>{customer.gender}</p>
        </div>
        <div>
          <p className="font-semibold">Mobile</p>
          <p>{customer.mobile}</p>
        </div>
        <div>
          <p className="font-semibold">Address</p>
          <p>{customer.address}</p>
        </div>
        <div>
          <p className="font-semibold">Created At</p>
          <p>{new Date(customer.created_at).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-semibold">Updated At</p>
          <p>{new Date(customer.updated_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );

  const DeleteConfirmation = ({ customer }) => (
    <div className="space-y-4">
      <p className="text-lg">
        Are you sure you want to delete customer: {customer.firstname}{" "}
        {customer.lastname}?
      </p>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setIsDeleteModalOpen(false)}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => handleDelete(customer.id)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );

  if (loading) {
    return <p>Loading customers...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">All Customers</h1>
          <div className="relative">
            <input
              type="search"
              placeholder="Search customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>

        {customers.length === 0 ? (
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
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setIsViewModalOpen(true);
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setIsDeleteModalOpen(true);
                          }}
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

        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <p>
            Showing {Math.min(10, filteredCustomers.length)} of{" "}
            {filteredCustomers.length} results
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>

        {/* View Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Customer Details"
        >
          {selectedCustomer && (
            <ViewCustomerDetails customer={selectedCustomer} />
          )}
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Delete"
        >
          {selectedCustomer && (
            <DeleteConfirmation customer={selectedCustomer} />
          )}
        </Modal>
      </div>
    </>
  );
};

export default AllCustomer;
