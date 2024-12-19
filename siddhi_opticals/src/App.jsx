import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NewOrder from "./pages/NewOrder";
import PendingOrder from "./pages/PendingOrder";
import PendingPayments from "./pages/PendingPayments";
import Bill from "./pages/bill/Bill";
import FrameStock from "./pages/FrameStock";
import Visitbook from "./pages/Visitbook";
import FindReports from "./pages/FindReports";
import Orderlens from "./pages/Orderlens";
import DataManagement from "./pages/DataManagement";
import Userdetails from "./pages/Userdetails";
import AllOrders from "./pages/AllOrders";
import AllCustomers from "./pages/AllCustomer";
import DoctorsPage from "./pages/Doctorspage";
import DoctorComponent from "./components/DoctorComponent";
import Customers from "./components/Customers";
import RecentOrders from "./components/RecentOrders";
import Frames from "./pages/Frames";
import CustomersPage from "./pages/CustomersPage";
import SingleVision from "./pages/lens/SingleVision";
import Data from "./components/Data";
import EyeDescription from "./pages/EyeDescription";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/data" element={<Data />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<h1>Product</h1>} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/new-order" element={<NewOrder />} />
        <Route path="/pending-orders" element={<PendingOrder />} />
        <Route path="/pending-payment" element={<PendingPayments />} />
        <Route path="/bill" element={<Bill />} />
        <Route path="/framestock" element={<FrameStock />} />
        <Route path="/visitbook" element={<Visitbook />} />
        <Route path="/find" element={<FindReports />} />
        <Route path="/order-lens" element={<Orderlens />} />
        <Route path="/data-management" element={<DataManagement />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/userdetails" element={<Userdetails />} />
        <Route path="/all-orders" element={<AllOrders />} />
        <Route path="/all-customer" element={<AllCustomers />} />
        <Route path="/doctorspage" element={<DoctorsPage />} />
        <Route path="/doctors" element={<DoctorComponent />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/recentorders" element={<RecentOrders />} />
        <Route path="/frames" element={<Frames />} />
        <Route path="/stocks/lens/single-vision" element={<SingleVision />} />
        <Route path="/eye" element={<EyeDescription />} />
      </Routes>
    </div>
  );
};

export default App;
