import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE_URL } from '../../Api'
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const PurchaseForm = () => {
  const [formData, setFormData] = useState({
    purchaseDate: "",
    companyName: "",
    address: "",
    lensType: "",
    lensCompanyName: "",
    lensProductName: "",
    dia: "",
    lensDetails: [{ sph: "", cyl: "", pair: "", purchasePrice: "" }],
    salesPrice: "",
    extraDetails: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLensChange = (index, event) => {
    const values = [...formData.lensDetails];
    values[index][event.target.name] = event.target.value;
    setFormData({ ...formData, lensDetails: values });
  };

  const addLensDetail = () => {
    setFormData({
      ...formData,
      lensDetails: [...formData.lensDetails, { sph: "", cyl: "", pair: "", purchasePrice: "" }],
    });
  };

  const removeLensDetail = (index) => {
    const values = [...formData.lensDetails];
    values.splice(index, 1);
    setFormData({ ...formData, lensDetails: values });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send data to the API using Axios
    axios.post(`${API_BASE_URL}/lenses`, formData)
      .then(response => {
        // Handle success response
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Form submitted successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(error => {
        // Handle error response
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "There was an error submitting the form.",
        });
      });
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gray-50 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Purchase Form</h2>

        {/* Supplier Information Section */}
        <div className="p-4 rounded-lg bg-white shadow-md space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Supplier Information</h3>
          <div className="space-y-4">
            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Lens Information Section */}
        <div className="p-4 rounded-lg bg-white shadow-md space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Lens Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lens Type</label>
              <select
                name="lensType"
                value={formData.lensType}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select lens type</option>
                <option value="mineral">Mineral Lens</option>
                <option value="plastic">Plastic Lens</option>
                <option value="polycarbonate">Polycarbonate Lens</option>
                <option value="trivex">Trivex Lens</option>
                <option value="organic">Organic Lens</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lens Company Name</label>
              <input
                type="text"
                name="lensCompanyName"
                value={formData.lensCompanyName}
                onChange={handleChange}
                placeholder="Enter lens company name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lens Product Name</label>
              <input
                type="text"
                name="lensProductName"
                value={formData.lensProductName}
                onChange={handleChange}
                placeholder="Enter lens product name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DIA</label>
              <input
                type="text"
                name="dia"
                value={formData.dia}
                onChange={handleChange}
                placeholder="Enter DIA"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* SPH, CYL, PAIR Section */}
        <div className="p-4 rounded-lg bg-white shadow-md space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Lens Details</h3>
          {formData.lensDetails.map((lens, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4 mb-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sph</label>
                  <input
                    type="text"
                    name="sph"
                    value={lens.sph}
                    onChange={(e) => handleLensChange(index, e)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cyl</label>
                  <input
                    type="text"
                    name="cyl"
                    value={lens.cyl}
                    onChange={(e) => handleLensChange(index, e)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pair</label>
                  <input
                    type="text"
                    name="pair"
                    value={lens.pair}
                    onChange={(e) => handleLensChange(index, e)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                  <input
                    type="text"
                    name="purchasePrice"
                    value={lens.purchasePrice}
                    onChange={(e) => handleLensChange(index, e)}
                    placeholder="Enter purchase price"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sales Price</label>
                  <input
                    type="text"
                    name="salesPrice"
                    value={lens.salesPrice || ""}
                    onChange={(e) => handleLensChange(index, e)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeLensDetail(index)}
                className="text-red-600 hover:underline"
              >
                Remove Lens Detail
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLensDetail}
            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
          >
            Add Lens Detail
          </button>

          {/* Calculate Quantity and Total Purchase Price */}
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-gray-700">Summary</h4>
            <p className="text-sm text-gray-600">
              Quantity of Lens Details: {formData.lensDetails.length}
            </p>
            <p className="text-sm text-gray-600">
              Total Purchase Price: ₹{formData.lensDetails.reduce((total, lens) => {
                const price = parseFloat(lens.purchasePrice) || 0; // Convert to number, default to 0
                return total + price;
              }, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Extra Details Section */}
        <div className="p-4 rounded-lg bg-white shadow-md">
          <label className="block text-sm font-medium text-gray-700 mb-1">Extra Details</label>
          <textarea
            name="extraDetails"
            value={formData.extraDetails}
            onChange={handleChange}
            placeholder="Enter any additional details or notes"
            rows="3"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center"
        >
          <span>Submit</span>
        </button>
      </form>
      <Footer />
    </>
  );
};

export default PurchaseForm;