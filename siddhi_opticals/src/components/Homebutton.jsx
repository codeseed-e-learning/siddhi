import React from "react";
import { useNavigate } from "react-router-dom";

function HomeButton() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end items-center mb-3">
      <button
        onClick={() => navigate("/dashboard")}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300"
      >
        Go to Home
      </button>
    </div>
  );
}

export default HomeButton;
