import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import HomeButton from "../components/Homebutton";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../Api";

const Frames = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stocks`);
      console.log("API Response:", response.data);
      setStocks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stocks:", error);
      setError("Failed to fetch stocks");
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch stocks data",
      });
    }
  };

  const handleDelete = (stock) => {
    setStockToDelete(stock);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      console.log("Attempting to delete stock:", stockToDelete.id);

      const response = await axios.delete(
        `${API_BASE_URL}/stocks/${stockToDelete.id}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setStocks(stocks.filter((stock) => stock.id !== stockToDelete.id));
        setIsDeleteModalOpen(false);
        setStockToDelete(null);

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Stock has been deleted successfully.",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate(0);
        });
      }
    } catch (error) {
      console.error("Delete request error:", error);
      console.error("Error response:", error.response?.data);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to delete stock",
      });
    }
  };

  const handleView = (stock) => {
    setSelectedStock(stock);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (stock) => {
    console.log("Original stock data:", stock);

    const formattedDate = stock.purchase_date.split(" ")[0];

    const initialFormData = {
      purchase_date: formattedDate,
      supplier_company_name: stock.supplier_company_name || "",
      supplier_address: stock.supplier_address || "",
      frame_type: stock.frame_type || "",
      model_name: stock.model_name || "",
      model_code: stock.model_code || "",
      model_color: stock.model_color || "",
      model_size: stock.model_size || "",
      quantity: stock.quantity || 0,
      purchase_price: stock.purchase_price || 0,
      sales_price: stock.sales_price || 0,
    };

    console.log("Initial form data:", initialFormData);

    setEditFormData(initialFormData);
    setSelectedStock(stock);
    setIsEditModalOpen(true);
    setIsViewModalOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Edit form data before formatting:", editFormData);

      const formattedData = {
        purchase_date: editFormData.purchase_date,
        supplier_company_name: editFormData.supplier_company_name,
        supplier_address: editFormData.supplier_address,
        frame_type: editFormData.frame_type,
        model_name: editFormData.model_name,
        model_code: editFormData.model_code,
        model_color: editFormData.model_color,
        model_size: editFormData.model_size,
        quantity: parseInt(editFormData.quantity),
        purchase_price: parseFloat(editFormData.purchase_price),
        sales_price: parseFloat(editFormData.sales_price),
      };

      console.log("Formatted data before API call:", formattedData);

      const response = await axios.put(
        `${API_BASE_URL}/stocks/${selectedStock.id}`,
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        setStocks(
          stocks.map((stock) =>
            stock.id === selectedStock.id
              ? { ...stock, ...formattedData }
              : stock
          )
        );

        setIsEditModalOpen(false);
        setEditFormData(null);

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Stock has been updated successfully.",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate(0);
        });
      }
    } catch (error) {
      console.error("Error updating stock:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }

      const errorMessage =
        error.response?.data?.message || "Failed to update stock";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  const filteredStocks =
    stocks?.filter((stock) => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        stock?.supplier_company_name?.toLowerCase().includes(searchLower) ||
        stock?.frame_type?.toLowerCase().includes(searchLower) ||
        stock?.model_name?.toLowerCase().includes(searchLower) ||
        stock?.model_code?.toLowerCase().includes(searchLower)
      );
    }) || [];

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-10">
        <HomeButton />
        {/* Header with search */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">All Stocks</h1>
          <div className="relative">
            <input
              type="search"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : filteredStocks.length === 0 ? (
          <p>No stocks found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Purchase Date</th>
                  <th className="px-4 py-2 border">Supplier Name</th>
                  <th className="px-4 py-2 border">Frame Type</th>
                  <th className="px-4 py-2 border">Model Name</th>
                  <th className="px-4 py-2 border">Model Code</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Purchase Price</th>
                  <th className="px-4 py-2 border">Sales Price</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock) => (
                  <tr key={stock.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border">{stock.id}</td>
                    <td className="px-4 py-2 border">{stock.purchase_date}</td>
                    <td className="px-4 py-2 border">
                      {stock.supplier_company_name}
                    </td>
                    <td className="px-4 py-2 border">{stock.frame_type}</td>
                    <td className="px-4 py-2 border">{stock.model_name}</td>
                    <td className="px-4 py-2 border">{stock.model_code}</td>
                    <td className="px-4 py-2 border">{stock.quantity}</td>
                    <td className="px-4 py-2 border">
                      ₹{stock.purchase_price}
                    </td>
                    <td className="px-4 py-2 border">₹{stock.sales_price}</td>
                    <td className="px-4 py-2 border">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(stock)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(stock)}
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

      {/* View Modal */}
      {isViewModalOpen && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Stock Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Purchase Date:</p>
                <p>{selectedStock.purchase_date}</p>
              </div>
              <div>
                <p className="font-semibold">Supplier Name:</p>
                <p>{selectedStock.supplier_company_name}</p>
              </div>
              <div>
                <p className="font-semibold">Address:</p>
                <p>{selectedStock.supplier_address}</p>
              </div>
              <div>
                <p className="font-semibold">Frame Type:</p>
                <p>{selectedStock.frame_type}</p>
              </div>
              <div>
                <p className="font-semibold">Model Name:</p>
                <p>{selectedStock.model_name}</p>
              </div>
              <div>
                <p className="font-semibold">Model Code:</p>
                <p>{selectedStock.model_code}</p>
              </div>
              <div>
                <p className="font-semibold">Model Size:</p>
                <p>{selectedStock.model_size}</p>
              </div>
              <div>
                <p className="font-semibold">Quantity:</p>
                <p>{selectedStock.quantity}</p>
              </div>
              <div>
                <p className="font-semibold">Purchase Price:</p>
                <p>₹{selectedStock.purchase_price}</p>
              </div>
              <div>
                <p className="font-semibold">Sales Price:</p>
                <p>₹{selectedStock.sales_price}</p>
              </div>
              <div>
                <p className="font-semibold">Model Color:</p>
                <p>{selectedStock.model_color}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => handleEditClick(selectedStock)}
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

      {/* Delete Modal */}
      {isDeleteModalOpen && stockToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Confirm Delete
              </h2>
              <p className="mt-2 text-gray-600">
                Are you sure you want to delete stock from "
                {stockToDelete.supplier_company_name}"?
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

      {/* Edit Modal */}
      {isEditModalOpen && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Stock</h2>
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
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={editFormData.purchase_date?.split(" ")[0]}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        purchase_date: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.supplier_company_name}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        supplier_company_name: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Frame Type
                  </label>
                  <input
                    type="text"
                    value={editFormData.frame_type}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        frame_type: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Model Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.model_name}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        model_name: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Model Code
                  </label>
                  <input
                    type="text"
                    value={editFormData.model_code}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        model_code: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Model Color
                  </label>
                  <input
                    type="text"
                    value={editFormData.model_color}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        model_color: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Model Size
                  </label>
                  <input
                    type="text"
                    value={editFormData.model_size}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        model_size: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={editFormData.quantity}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        quantity: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    value={editFormData.purchase_price}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        purchase_price: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sales Price
                  </label>
                  <input
                    type="number"
                    value={editFormData.sales_price}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        sales_price: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Supplier Address
                  </label>
                  <textarea
                    value={editFormData.supplier_address}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        supplier_address: e.target.value,
                      })
                    }
                    rows="3"
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

export default Frames;
