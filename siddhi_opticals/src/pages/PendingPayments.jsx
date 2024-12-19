import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'
import { API_BASE_URL } from '../Api'

const PendingPayments = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingPayment = async () => {
    try {
      const pendingPayment = await axios.get(`${API_BASE_URL}/analytics/pending-payment-uses`);
      setPendingPayments(pendingPayment.data.pending_orders);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch pending payments");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPendingPayment();
  }, [])

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

  return (
    <div>
      <Navbar/>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending Payments</h1>
        {pendingPayments.length === 0 ? (
          <p className="text-gray-600">No pending payments found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="table-auto min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">First Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Bill</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remaining Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingPayments.map(payment => (
                  <tr key={payment.order_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{payment.order_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{payment.firstname}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{payment.lastname}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{payment.mobile}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{payment.address}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">₹{payment.total_bill}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">₹{payment.paid_amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">₹{payment.remaining_payment}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(payment.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(payment.updated_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  )
}

export default PendingPayments