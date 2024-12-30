"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [principalName, setPrincipalName] = useState("");

  const router = useRouter();

  const togglePasswordVisibility = (field) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.error("Please fill in both email and password.");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/school/login`,
        {
          email,
          password,
        }
      );

      if (response.data.token) {
        localStorage.setItem("schoolToken", response.data.token);
        toast.success("Login successful!");
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        toast.error(response.data.message || "Invalid credentials.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (
        !schoolName ||
        !email ||
        !password ||
        !confirmPassword ||
        !principalName
      ) {
        toast.error("Please fill in all fields.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/school/register`,
        {
          schoolName,
          principalName,
          email,
          password,
          confirmPassword,
        }
      );

      if (response.data.token) {
        localStorage.setItem("schoolToken", response.data.token);
        toast.success("Signup successful!");
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        toast.error(response.data.message || "Signup failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-500 p-3 rounded-full">
            <div className="p-1 rounded-full bg-white">
              <Image
                src="/GIOLOGO.png"
                alt="Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === "login"
              ? "Take Charge"
              : "Activate Your School Dashboard"}
          </h1>
          <p className="text-gray-600">
            {activeTab === "login"
              ? "Sign in to continue where you left off."
              : "Sign up to manage your school data effortlessly."}
          </p>
        </div>

        {/* Add YouTube Video Link */}
        {activeTab === "login" && (
          <div className="w-full flex items-center justify-center mb-5">
            <a
              href="https://www.youtube.com/watch?v=8dpts2MzKg4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 font-semibold hover:underline"
            >
              📹 Watch how it&apos;s done
            </a>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`px-4 py-2 font-semibold rounded-l-lg transition ${
              activeTab === "login"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`px-4 py-2 font-semibold rounded-r-lg transition ${
              activeTab === "signup"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Signup
          </button>
        </div>

        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type={passwordVisible.password ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute bottom-[15%] right-3 text-gray-600"
              >
                {passwordVisible.password ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>
        )}

        {activeTab === "signup" && (
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">School Name</label>
              <input
                type="text"
                placeholder="Enter your school name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Principal Name</label>
              <input
                type="text"
                placeholder="Enter the principal's name"
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type={passwordVisible.password ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute bottom-[15%] right-3 text-gray-600"
              >
                {passwordVisible.password ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type={passwordVisible.confirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute bottom-[15%] right-3 text-gray-600"
              >
                {passwordVisible.confirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Signup
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
