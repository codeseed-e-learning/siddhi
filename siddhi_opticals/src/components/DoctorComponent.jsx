import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HomeButton from "../components/Homebutton";
import { API_BASE_URL } from "../Api";
import axios from "axios";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Add New Doctor</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  );
};

const AddDoctorForm = ({ onSubmit, onClose, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    phone: "",
    email: "",
    clinic_name: "",
    clinic_address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });

  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleLocalSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleLocalChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Qualification</label>
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleLocalChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleLocalChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleLocalChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Clinic Name</label>
          <input
            type="text"
            name="clinic_name"
            value={formData.clinic_name}
            onChange={handleLocalChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Clinic Address</label>
          <input
            type="text"
            name="clinic_address"
            value={formData.clinic_address}
            onChange={handleLocalChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleLocalChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleLocalChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleLocalChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleLocalChange}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>
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
          Add Doctor
        </button>
      </div>
    </form>
  );
};

const DoctorComponent = ({ showButton = true, showNavbar = true }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [doctorsPerPage] = useState(10); // Adjust based on your design
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    qualification: "",
    phone: "",
    email: "",
    clinic_name: "",
    clinic_address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/doctors`);

        setDoctors(response.data || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch doctors");
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [currentPage, doctorsPerPage]);

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/doctors`, formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.data) {
        setDoctors((prevDoctors) => [response.data, ...prevDoctors]);
        setIsAddModalOpen(false);

        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Doctor has been added successfully.",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate(0);
        });
      }
    } catch (error) {
      console.error("Error details:", error.response?.data);

      // Get validation errors from the response
      const validationErrors = error.response?.data?.errors;
      let errorMessage =
        "Failed to add doctor. Please check the form and try again.";

      // If we have specific validation errors, format them
      if (validationErrors) {
        errorMessage = Object.values(validationErrors).flat().join("\n");
      }

      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: errorMessage,
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setIsViewModalOpen(true);
  };

  const handleDelete = (doctor) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete Dr. ${doctor.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/doctors/${doctor.id}`);
          return true;
        } catch (error) {
          Swal.showValidationMessage(
            `Delete failed: ${
              error.response?.data?.message || "Something went wrong"
            }`
          );
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        // Update local state
        setDoctors(doctors.filter((d) => d.id !== doctor.id));

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `Dr. ${doctor.name} has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate(0);
        });
      }
    });
  };

  const handleEdit = async (formData) => {
    try {
      console.log("Submitting form data:", formData);

      const response = await axios.put(`${API_BASE_URL}/doctors`, formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Response from server:", response.data);

      if (response.data) {
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor.id === selectedDoctor.id ? response.data : doctor
          )
        );

        setIsEditMode(false);

        alert("Doctor updated successfully!");
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      alert("Failed to update doctor. Please try again.");
    }
  };

  const handleEditClick = (doctor) => {
    setEditFormData({
      id: doctor.id,
      name: doctor.name || "",
      qualification: doctor.qualification || "",
      phone: doctor.phone || "",
      email: doctor.email || "",
      clinic_name: doctor.clinic_name || "",
      clinic_address: doctor.clinic_address || "",
      city: doctor.city || "",
      state: doctor.state || "",
      pincode: doctor.pincode || "",
      notes: doctor.notes || "",
    });
    setIsEditModalOpen(true);
    setIsViewModalOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE_URL}/doctors/${editFormData.id}`,
        editFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        setDoctors(
          doctors.map((doctor) =>
            doctor.id === editFormData.id
              ? { ...doctor, ...editFormData }
              : doctor
          )
        );

        setIsEditModalOpen(false);
        setEditFormData({
          name: "",
          qualification: "",
          phone: "",
          email: "",
          clinic_name: "",
          clinic_address: "",
          city: "",
          state: "",
          pincode: "",
          notes: "",
        });

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Doctor information has been updated successfully.",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate(0);
        });
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update doctor information. Please try again.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {showNavbar && <Navbar />}
      <div className="container mx-auto py-4 px-5">
        {showButton && <HomeButton />}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">All Doctors</h1>

          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add New Doctor
            </button>
            <input
              type="search"
              placeholder="Search doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>

        {doctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="hidden sm:block">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Qualification</th>
                    <th className="px-4 py-2 border">Phone</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Clinic Name</th>
                    <th className="px-4 py-2 border">City</th>
                    <th className="px-4 py-2 border">State</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border">{doctor.id}</td>
                      <td className="px-4 py-2 border">{doctor.name}</td>
                      <td className="px-4 py-2 border">
                        {doctor.qualification}
                      </td>
                      <td className="px-4 py-2 border">{doctor.phone}</td>
                      <td className="px-4 py-2 border">{doctor.email}</td>
                      <td className="px-4 py-2 border">{doctor.clinic_name}</td>
                      <td className="px-4 py-2 border">{doctor.city}</td>
                      <td className="px-4 py-2 border">{doctor.state}</td>
                      <td className="px-4 py-2 border">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleView(doctor)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(doctor)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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

            <div className="block sm:hidden">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white border rounded-lg p-4 mb-4 shadow-sm"
                >
                  <div className="font-bold text-lg mb-2">{doctor.name}</div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">ID:</span> {doctor.id}
                    </p>
                    <p>
                      <span className="font-semibold">Qualification:</span>{" "}
                      {doctor.qualification}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {doctor.phone}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {doctor.email}
                    </p>
                    <p>
                      <span className="font-semibold">Clinic Name:</span>{" "}
                      {doctor.clinic_name}
                    </p>
                    <p>
                      <span className="font-semibold">City:</span> {doctor.city}
                    </p>
                    <p>
                      <span className="font-semibold">State:</span>{" "}
                      {doctor.state}
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleView(doctor)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(doctor)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <p>
            Showing {Math.min(10, filteredDoctors.length)} of{" "}
            {filteredDoctors.length} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  (prev + 1) * doctorsPerPage <= totalDoctors ? prev + 1 : prev
                )
              }
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>

        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <AddDoctorForm
            onSubmit={handleSubmit}
            onClose={() => setIsAddModalOpen(false)}
          />
        </Modal>

        {isViewModalOpen && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Doctor Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Name:</p>
                  <p>{selectedDoctor.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Qualification:</p>
                  <p>{selectedDoctor.qualification}</p>
                </div>
                <div>
                  <p className="font-semibold">Phone:</p>
                  <p>{selectedDoctor.phone}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{selectedDoctor.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Clinic Name:</p>
                  <p>{selectedDoctor.clinic_name}</p>
                </div>
                <div>
                  <p className="font-semibold">Clinic Address:</p>
                  <p>{selectedDoctor.clinic_address}</p>
                </div>
                <div>
                  <p className="font-semibold">City:</p>
                  <p>{selectedDoctor.city}</p>
                </div>
                <div>
                  <p className="font-semibold">State:</p>
                  <p>{selectedDoctor.state}</p>
                </div>
                <div>
                  <p className="font-semibold">Pincode:</p>
                  <p>{selectedDoctor.pincode}</p>
                </div>
                <div>
                  <p className="font-semibold">Created At:</p>
                  <p>
                    {new Date(selectedDoctor.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Updated At:</p>
                  <p>
                    {new Date(selectedDoctor.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Notes:</p>
                  <p>{selectedDoctor.notes}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => handleEditClick(selectedDoctor)}
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

        {isEditModalOpen && editFormData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Doctor</h2>
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
                      Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          name: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Qualification
                    </label>
                    <input
                      type="text"
                      value={editFormData.qualification}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          qualification: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          phone: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          email: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Clinic Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.clinic_name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          clinic_name: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      value={editFormData.city}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          city: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      type="text"
                      value={editFormData.state}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          state: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={editFormData.pincode}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          pincode: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Clinic Address
                    </label>
                    <textarea
                      value={editFormData.clinic_address}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          clinic_address: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      value={editFormData.notes}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          notes: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows="3"
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
      </div>
    </>
  );
};

export default DoctorComponent;
