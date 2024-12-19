import React from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import RecentOrders from "../components/RecentOrders";
import Customers from "../components/Customers";
import DoctorComponent from "../components/DoctorComponent";
import Analytics from "../components/Analytics";

const Home = () => {
  const handleCardClick = () => {
    // Define card click functionality here if needed
    console.log("Card clicked");
  };

  return (
    <>
      <Navbar />
      <Analytics />
      <Hero />
      <div className="container px-5">
        <div onClick={handleCardClick} className="cursor-pointer">
          <RecentOrders showButton={false} showNavbar={false} />
        </div>
        <div onClick={handleCardClick} className="cursor-pointer">
          <Customers showButton={false} showNavbar={false} />
        </div>
        <div onClick={handleCardClick} className="cursor-pointer">
          <DoctorComponent showButton={false} showNavbar={false} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
