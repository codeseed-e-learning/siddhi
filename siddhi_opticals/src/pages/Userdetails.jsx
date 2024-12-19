import React, { useState } from "react";
import * as XLSX from "xlsx";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../Api";
import axios from "axios";


const Userdetails = () => {
  const [data, setData] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetData = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
      );
      setData(sheetData);
      console.log(sheetData);
      
      await axios.post(`${API_BASE_URL}/push-user-details` , sheetData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8">
        <div className="bg-white shadow-lg rounded-lg p-6 w-11/12 max-w-md text-center">
          {/* Label for Upload Button */}
          <label
            htmlFor="file-upload"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition-all duration-200"
          >
            Upload Excel File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleUpload}
            className="hidden"
          />

          {/* Show JSON Data */}
          {data ? (
            <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-inner max-h-96 overflow-y-auto text-left">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Uploaded Data:</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="mt-4 text-gray-500 text-sm">
              No file uploaded yet. Please upload an Excel file.
            </p>
          )}
        </div>
      </div>
    </>

  );
};

export default Userdetails;
