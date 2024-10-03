// src/components/ForgotPassword.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const user = useSelector(store => store.auth.user)
  const router = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:8080/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to send reset link.");
        return;
      }

      setMessage("Reset link sent! Check your email.");
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  useEffect(()=> {
    if(user?.token){
        router('/dashboard')
    }
  }, [])

  return (
    <div className="flex items-center h-[90vh] justify-center bg-gray-100 dark:bg-gray-900 ">
      <div className="px-8 py-6 mt-4 text-left bg-white dark:bg-gray-800 shadow-lg rounded-lg w-96">
        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Forgot Password
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="text"
                placeholder="Enter your email"
                id="email"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button
                type="submit"
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
              >
                Send Reset Link
              </button>
              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </form>
        {message && (
          <div className="mt-4 p-4 text-green-700 border border-green-300 rounded bg-green-100 dark:bg-green-800 dark:text-green-200">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 text-red-700 border border-red-300 rounded bg-red-100 dark:bg-red-800 dark:text-red-200">
            <strong>Error</strong>: {error}
          </div>
        )}
      </div>
    </div>
  );
}
