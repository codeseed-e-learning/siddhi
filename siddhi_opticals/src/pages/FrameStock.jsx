import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure this is imported
import axios from "axios";
import Navbar from "../components/Navbar";
import HomeButton from "../components/Homebutton";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../Api";

const FrameStock = () => {
  const navigate = useNavigate(); // Call useNavigate to get the navigate function
  const [formData, setFormData] = useState({
    purchaseDate: "",
    supplierName: "",
    address: "",
    stocks: [
      {
        frameType: "",
        modelName: "",
        modelCode: "",
        modelColor: "",
        modelSize: "",
        quantity: "1",
        purchasePrice: "",
        salesPrice: "",
      },
    ],
  });

  const handleChange = (e, stockIndex) => {
    const { name, value } = e.target;
    if (stockIndex !== undefined) {
      const newStocks = [...formData.stocks];
      newStocks[stockIndex] = {
        ...newStocks[stockIndex],
        [name]: value,
      };
      setFormData({ ...formData, stocks: newStocks });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addNewStock = () => {
    setFormData({
      ...formData,
      stocks: [
        ...formData.stocks,
        {
          frameType: "",
          modelName: "",
          modelCode: "",
          modelColor: "",
          modelSize: "",
          quantity: "1",
          purchasePrice: "",
          salesPrice: "",
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the data to match Laravel's expectations
      const formattedStocks = formData.stocks.map((stock) => ({
        purchase_date: formData.purchaseDate,
        supplier_company_name: formData.supplierName,
        supplier_address: formData.address,
        frame_type: stock.frameType,
        model_name: stock.modelName,
        model_code: stock.modelCode,
        model_color: stock.modelColor,
        model_size: stock.modelSize,
        quantity: parseInt(stock.quantity),
        purchase_price: parseFloat(stock.purchasePrice),
        sales_price: parseFloat(stock.salesPrice),
      }));

      console.log("Formatted data being sent:", formattedStocks);

      // Send each stock as a separate request
      const responses = await Promise.all(
        formattedStocks.map((stockData) =>
          axios.post(`${API_BASE_URL}/stocks`, stockData, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
        )
      );

      console.log("Server responses:", responses);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Frame Stock has been added successfully",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // Navigate to the frames page after the alert is closed
        navigate("/frames"); // Change this to your actual frames page route
      });

      // Reset form
      setFormData({
        purchaseDate: "",
        supplierName: "",
        address: "",
        stocks: [
          {
            frameType: "",
            modelName: "",
            modelCode: "",
            modelColor: "",
            modelSize: "",
            quantity: "1",
            purchasePrice: "",
            salesPrice: "",
          },
        ],
      });
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        data: error.response?.data,
        status: error.response?.status,
      });

      // Show error message with validation errors if any
      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit stock. Please check the form and try again.";

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: errorMessage,
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-full w-full p-6 bg-gray-50 rounded-lg shadow-lg md:p-12">
        <HomeButton />
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Frame Stock
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Supplier Information Section */}
          <div className="p-4 rounded-lg bg-white shadow-md space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Supplier Information
            </h3>
            <div className="space-y-4">
              {/* Purchase Date on top */}
              <div className="text-right">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Supplier Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier Company Name
                  </label>
                  <input
                    type="text"
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={(e) => handleChange(e)}
                    placeholder="Enter supplier name"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={(e) => handleChange(e)}
                    placeholder="Enter address"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stock Details Section */}
          <div className="p-4 rounded-lg bg-white shadow-md space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Stock Details
              </h3>
              <button
                type="button"
                onClick={addNewStock}
                className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
              >
                +
              </button>
            </div>

            {formData.stocks.map((stock, index) => (
              <div key={index} className="p-6 border rounded-lg space-y-4 mb-4">
                <div className="text-xl text-gray-400 mb-4">{index + 1}</div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frame Type
                    </label>
                    <select
                      name="frameType"
                      value={stock.frameType}
                      onChange={(e) => handleChange(e, index)}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select frame type</option>
                      <option value="piece-rimless">3-PIECE RIMLESS</option>
                      <option value="half-rimless/supra">
                        HALF RIMLESS/SUPRA
                      </option>
                      <option value="full-metal">FULL METAL</option>
                      <option value="full-shell/plastic">
                        FULL SHELL/PLASTIC
                      </option>
                      <option value="goggles">GOGGLES</option>
                    </select>
                  </div>

                  {[
                    {
                      name: "modelName",
                      label: "Model Name",
                      placeholder: "Enter model name",
                    },
                    {
                      name: "modelCode",
                      label: "Model Code",
                      placeholder: "Enter model code",
                    },
                    {
                      name: "modelColor",
                      label: "Model Color",
                      placeholder: "Enter color",
                    },
                    {
                      name: "modelSize",
                      label: "Model Size",
                      placeholder: "Enter size",
                    },
                    {
                      name: "quantity",
                      label: "Quantity",
                      type: "number",
                      placeholder: "Enter quantity",
                    },
                    {
                      name: "purchasePrice",
                      label: "Purchase Price",
                      type: "number",
                      placeholder: "Enter price",
                    },
                    {
                      name: "salesPrice",
                      label: "Sales Price",
                      type: "number",
                      placeholder: "Enter price",
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={stock[field.name]}
                        onChange={(e) => handleChange(e, index)}
                        placeholder={field.placeholder}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Extra Details
            </label>
            <textarea
              name="extraDetails"
              value={formData.extraDetails || ""}
              onChange={handleChange}
              placeholder="Enter any additional details or notes"
              rows="3"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Footer */}
          <div className="p-4 rounded-lg bg-white shadow-md">
            <div className="flex justify-between text-lg font-medium text-gray-900">
              <span>Quantity: {formData.stocks.length}</span>
              <span>
                Total: ₹
                {formData.stocks.reduce(
                  (acc, stock) => acc + (Number(stock.purchasePrice) || 0),
                  0
                )}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center"
          >
            <span>Submit Stock</span>
          </button>
        </form>
      </div>
    </>
  );
};

export default FrameStock;
