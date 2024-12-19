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

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
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

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/doctors`
        );
        setDoctors(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch doctors");
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setIsViewModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/add-doctor`,
        newDoctor
      );
      setDoctors([...doctors, response.data]);
      setIsAddModalOpen(false);
      setNewDoctor({
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
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  const AddDoctorForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name  
          </label>
          <input
            type="text"
            name="name"
            value={newDoctor.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Qualification
          </label>
          <input
            type="text"
            name="qualification"
            value={newDoctor.qualification}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={newDoctor.phone}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={newDoctor.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Clinic Name
          </label>
          <input
            type="text"
            name="clinic_name"
            value={newDoctor.clinic_name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Clinic Address
          </label>
          <input
            type="text"
            name="clinic_address"
            value={newDoctor.clinic_address}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            name="city"
            value={newDoctor.city}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            name="state"
            value={newDoctor.state}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pincode
          </label>
          <input
            type="text"
            name="pincode"
            value={newDoctor.pincode}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            name="notes"
            value={newDoctor.notes}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows="2"
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={() => setIsAddModalOpen(false)}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading doctors...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">All Doctors</h1>
          <div className="flex justify-end items-center gap-4 mt-4">
            <input
              type="search"
              placeholder="Search doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add New Doctor
            </button>
          </div>
        </div>

        {doctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          <div className="overflow-x-auto">
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
                    <td className="px-4 py-2 border">{doctor.qualification}</td>
                    <td className="px-4 py-2 border">{doctor.phone}</td>
                    <td className="px-4 py-2 border">{doctor.email}</td>
                    <td className="px-4 py-2 border">{doctor.clinic_name}</td>
                    <td className="px-4 py-2 border">{doctor.city}</td>
                    <td className="px-4 py-2 border">{doctor.state}</td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleView(doctor)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <p>
            Showing {Math.min(10, filteredDoctors.length)} of{" "}
            {filteredDoctors.length} results
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

        {/* View Doctor Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Doctor Details"
        >
          {selectedDoctor && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">Name:</label>
                <p>{selectedDoctor.name}</p>
              </div>
              <div>
                <label className="font-semibold">Qualification:</label>
                <p>{selectedDoctor.qualification}</p>
              </div>
              <div>
                <label className="font-semibold">Phone:</label>
                <p>{selectedDoctor.phone}</p>
              </div>
              <div>
                <label className="font-semibold">Email:</label>
                <p>{selectedDoctor.email}</p>
              </div>
              <div>
                <label className="font-semibold">Clinic Name:</label>
                <p>{selectedDoctor.clinic_name}</p>
              </div>
              <div>
                <label className="font-semibold">Clinic Address:</label>
                <p>{selectedDoctor.clinic_address}</p>
              </div>
              <div>
                <label className="font-semibold">City:</label>
                <p>{selectedDoctor.city}</p>
              </div>
              <div>
                <label className="font-semibold">State:</label>
                <p>{selectedDoctor.state}</p>
              </div>
              <div>
                <label className="font-semibold">Pincode:</label>
                <p>{selectedDoctor.pincode}</p>
              </div>
              <div>
                <label className="font-semibold">Notes:</label>
                <p>{selectedDoctor.notes}</p>
              </div>
            </div>
          )}
        </Modal>

        {/* Add Doctor Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Doctor"
        >
          <AddDoctorForm />
        </Modal>
      </div>
    </>
  );
};

export default DoctorsPage;
