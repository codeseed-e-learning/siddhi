import React, { useEffect, useState } from "react";
import companyName, { companyPhone, companyAddress } from "../../Details";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf"; // Import jsPDF

const Bill = () => {

  const [orderData, setOrderData] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    // Check if order data exists in localStorage
    const savedOrder = localStorage.getItem("currentOrder");
    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder);
      setOrderData(parsedOrder);

      // Use a unique key for each order
      const orderKey = `invoice_${parsedOrder.id || parsedOrder.firstname}_${parsedOrder.lastname}`;

      // Check if an invoice number already exists for this order
      const savedInvoiceNumber = localStorage.getItem(orderKey);

      if (savedInvoiceNumber) {
        setInvoiceNumber(savedInvoiceNumber);
      } else {
        // If no invoice number exists, generate a new one
        const currentYear = new Date().getFullYear();

        // Retrieve the last used invoice number from localStorage
        let lastNumber = localStorage.getItem("lastInvoiceNumber") || 0;
        lastNumber = parseInt(lastNumber) + 1;

        // Save the new last number in localStorage
        localStorage.setItem("lastInvoiceNumber", lastNumber);

        // Format the new invoice number
        const formattedNumber = lastNumber.toString().padStart(4, "0");
        const newInvoiceNumber = `#INV-<span class="math-inline">\{currentYear\}</span>{formattedNumber}`;

        // Set the new invoice number
        setInvoiceNumber(newInvoiceNumber);

        // Save the new invoice number for this specific order
        localStorage.setItem(orderKey, newInvoiceNumber);
      }
    }
  }, []);

  if (!orderData) return <div>Loading...</div>;

  const downloadInvoice = async () => {
    const invoiceContent = document.getElementById("invoiceContent");

    try {
      const canvas = await html2canvas(invoiceContent, { scale: 3 });
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const aspectRatio = imgWidth / imgHeight;

      const pageWidth = 210; // A4 page width in millimeters
      const pageHeight = 297; // A4 page height in millimeters
      const margin = 10; // Padding in millimeters

      let pdfWidth = pageWidth - margin * 2;
      let pdfHeight = pdfWidth / aspectRatio;

      if (pdfHeight > pageHeight - margin * 2) {
        pdfHeight = pageHeight - margin * 2;
        pdfWidth = pdfHeight * aspectRatio;
      }

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [pageWidth, pageHeight], // Use array for better compatibility
      });

      doc.addImage(imgData, "PNG", margin, margin, pdfWidth, pdfHeight);
      doc.save(`invoice-${invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating invoice PDF:", error);
      // Handle the error gracefully, e.g., display an error message to the user
    }
  };





  return (
    <div>
      <Navbar />
      <div className="bg-gray-50 min-h-screen flex justify-center p-6">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl">
          {/* Company Header */}
          <div id="invoiceContent">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                सिद्धी ऑप्टिकल्स
              </h1>
              <p className="text-gray-600">{companyAddress}</p>
              <p className="text-gray-600">{companyPhone}</p>
            </div>

            {/* Invoice Info */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-600">Prepared for:</h2>
                <p className="text-gray-600">
                  {orderData.firstname} {orderData.lastname}
                </p>
                <p className="text-gray-600">{orderData.address}</p>
                <p className="text-gray-600">{orderData.mobile}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Invoice Number: {invoiceNumber}</p>
                <p className="text-gray-600">
                  Date: {orderData.order_taken_date}
                </p>
              </div>
            </div>

            {/* Total Bill Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-600 text-white">
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2">Product</td>
                    <td className="p-2 text-right">₹{orderData.totalBill}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td className="p-2 font-bold ">Total Amount:</td>
                    <td className="p-2 text-right font-bold">
                      ₹{orderData.totalBill}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Terms & Conditions */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Terms & Conditions
              </h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>
                  The above will be delivered upon payment via cash or deposit.
                </li>
                <li>
                  This amount cannot be refunded once payment has been made.
                </li>
              </ul>
            </div>
          </div>

          {/* Buttons */}
          <div className="text-center mt-6 space-x-4">
            <button
              onClick={downloadInvoice}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Download Invoice
            </button>
            <Link
              to="/"
              className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Bill;
