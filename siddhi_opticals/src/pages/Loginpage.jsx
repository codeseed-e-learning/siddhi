import React from "react";

const LoginPage = () => {
  const validateForm = (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    let isValid = true;

    // Validation logic in one line each ternary operator
    document.getElementById("usernameError").textContent = username
      ? ""
      : ((isValid = false), "Username is required");

    document.getElementById("passwordError").textContent = password
      ? ""
      : ((isValid = false), "Password is required");

    isValid && alert("Login Successful");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg">
      <div className="w-1/2  p-14 space-y-6 shadow-2xl rounded-lg hover:scale-105 transition transform ">
        <h2 className="text-3xl font-bold text-center text-text-primary">
          Siddhi Optical
        </h2>
        <p className="text-sm text-text-primary text-center mb-8">
          Sign in to access your account
        </p>

        <form onSubmit={validateForm} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-text-primary"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full mt-2 p-3 border rounded-lg  "
              placeholder="Username"
            />
            <p id="usernameError" className="mt-1 text-sm text-red-500"></p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-primary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full mt-2 p-3 border rounded-lg "
              placeholder="••••••••"
            />
            <p id="passwordError" className="mt-1 text-sm text-red-500"></p>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-button text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transform "
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          &copy; 2024 Siddhi Optical. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
