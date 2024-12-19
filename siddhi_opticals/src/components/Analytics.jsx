import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import styles for the calendar
import axios from "axios";
import { API_BASE_URL } from '../Api';
import { Link } from "react-router-dom";

const Analytics = () => {
    // State to manage the selected date
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalCollection, setTotalCollection] = useState(0); // For today's collection
    const [pendingCollection, setPendingCollection] = useState(0); // For pending cash
    const [monthlyCollection, setMonthlyCollection] = useState(0); // For monthly collection

    // Handle dropdown for predefined date ranges
    const handleMonthSelection = (range) => {
        const today = new Date();
        switch (range) {
            case 'thisMonth':
                setSelectedDate(new Date(today.getFullYear(), today.getMonth(), 1));
                break;
            case 'lastMonth':
                setSelectedDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));
                break;
            case 'last8Months':
                setSelectedDate(new Date(today.getFullYear(), today.getMonth() - 8, 1));
                break;
            default:
                break;
        }
    };

    // Function to fetch today's collection
    const fetchTodayCollection = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/bill`); // Adjust URL
            setTotalCollection(response.data.today_collection || 0); // Set total collection
            console.log(JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching today's collection:", error);
        }
    };

    // Function to fetch pending and monthly collections (example API endpoints)
    const fetchAdditionalAnalytics = async () => {
        try {
            const pendingResponse = await axios.get(`${API_BASE_URL}/bill`);
            setPendingCollection(pendingResponse.data.pending_today || 0);

            const monthlyResponse = await axios.get(`${API_BASE_URL}/analytics/month`);
            setMonthlyCollection(monthlyResponse.data.total_collection || 0);
        } catch (error) {
            console.error("Error fetching additional analytics:", error);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchTodayCollection();
        fetchAdditionalAnalytics();
    }, []);

    return (
        <div className="md:px-36 p-6 bg-gradient-to-br from-gray-100 to-blue-50 ">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>

                {/* Dropdown for Month Selection */}
                <div className="flex flex-col">
                    <select
                        onChange={(e) => handleMonthSelection(e.target.value)}
                        className="mb-4 border border-gray-300 rounded-lg p-2 shadow-md focus:ring focus:ring-blue-300"
                    >
                        <option value="">Select Month</option>
                        <option value="thisMonth">This Month</option>
                        <option value="lastMonth">Last Month</option>
                        <option value="last8Months">Previous 8 Months</option>
                    </select>
                </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
                {/* Card: Total Cash Collection Today */}
                <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-green-500">
                    <h2 className="text-lg font-semibold text-gray-700">
                        Total Cash Collection (Today)
                    </h2>
                    <p className="mt-4 text-3xl font-bold text-green-500">₹{totalCollection}</p>
                </div>

                {/* Card: Total Pending Cash Collection */}
                <Link to={'/pending-orders'}>
                    <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-red-500">
                        <h2 className="text-md font-semibold text-gray-700">
                            Total Pending Cash Collection
                        </h2>
                        <p className="mt-4 text-3xl font-bold text-red-500">₹{pendingCollection}</p>
                    </div>
                </Link>

                {/* Card: Monthly Collection */}
                <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500">
                    <h2 className="text-lg font-semibold text-gray-700">Monthly Collection</h2>
                    <p className="mt-4 text-3xl font-bold text-blue-500">₹{monthlyCollection}</p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
