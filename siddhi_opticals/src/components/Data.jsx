import React, { useState, useEffect } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import { API_BASE_URL } from '../Api';
import Navbar from './Navbar';
import Footer from './Footer';

const Data = () => {
  const [orderDetails, setOrderDetails] = useState({
    pendingAmount: 0,
    paidAmount: 0,
    totalAmount: 0,
  });

  const [dailySales, setDailySales] = useState([]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/allOrders`);
      let allOrders = response.data.orders;

      let totalAmount = 0;
      let paidAmount = 0;
      let pendingAmount = 0;
      let sales = new Array(30).fill(0); // Assuming a 30-day month

      allOrders.forEach((order) => {
        totalAmount += parseFloat(order.total_bill || 0);
        paidAmount += parseFloat(order.paid_amount || 0);
        pendingAmount += parseFloat(order.remaining_payment || 0);

        // Assume "order_taken_date" is in "YYYY-MM-DD" format
        const day = new Date(order.order_taken_date).getDate();
        sales[day - 1] += parseFloat(order.total_bill || 0);
      });

      setOrderDetails({
        totalAmount: totalAmount.toFixed(2),
        paidAmount: paidAmount.toFixed(2),
        pendingAmount: pendingAmount.toFixed(2),
      });
      setDailySales(sales);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  return (
    <>
    <Navbar/>
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Doughnut chart for pending and paid amount */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Pending vs Paid (Last Month)</h2>
        {/* decrease size of the don */}
        <Doughnut
          data={{
            labels: ['Pending', 'Paid'],
            datasets: [
              {
                label: 'Amount',
                data: [orderDetails.pendingAmount, orderDetails.paidAmount],
                backgroundColor: ['#BA0021', '#006A4E'],
                hoverBackgroundColor: ['#BA0021', '#006A4E'],
              },
            ],
          }}
        />
      </div>

      {/* Line chart for daily sales data */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Sales (This Month)</h2>
        <Line
          data={{
            labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
            datasets: [
              {
                label: 'Sales',
                data: dailySales,
                fill: false,
                borderColor: '#4CAF50',
                tension: 0.1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          }}
        />
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Data;
