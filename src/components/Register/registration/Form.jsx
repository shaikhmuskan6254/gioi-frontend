"use client";

import { useState } from "react";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "", // New field for confirming password
    country: "",
    state: "",
    city: "",
    PhoneNumber: "",
    teacherPhoneNumber: "",
    whatsappNumber: "",
    sameAsPhone: false,
    standard: "",
    schoolName: "",
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false); // Toggle between login and registration
  const [passwordError, setPasswordError] = useState(""); // To store password validation error
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "sameAsPhone") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
        whatsappNumber: checked ? prevData.PhoneNumber : "",
      }));
      return;
    }

    if (name === "country") {
      const selectedCountry = Country.getAllCountries().find(
        (country) => country.isoCode === value
      );
      setStates(State.getStatesOfCountry(selectedCountry?.isoCode || ""));
      setFormData({
        ...formData,
        country: selectedCountry ? selectedCountry.name : "", // Save full name in formData
        countryCode: value, // Save the isoCode for dropdown selection
        state: "",
        city: "",
      });
      setCities([]);
      return;
    }

    if (name === "state") {
      const selectedState = states.find((state) => state.isoCode === value);
      setCities(
        City.getCitiesOfState(
          Country.getAllCountries().find((c) => c.name === formData.country)
            ?.isoCode || "",
          selectedState?.isoCode || ""
        )
      );
      setFormData({
        ...formData,
        state: selectedState ? selectedState.name : "", // Save full name in formData
        stateCode: value, // Save the isoCode for dropdown selection
        city: "",
      });
      return;
    }

    if (name === "city") {
      const selectedCity = cities.find((city) => city.name === value);
      setFormData({
        ...formData,
        city: selectedCity ? selectedCity.name : "", // Save full name in formData
      });
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // Validate username and password for login
      if (!formData.username || !formData.password) {
        toast.error("username and password are required for login.");
        return;
      }
    } else {
      // Validate registration-specific fields
      if (formData.password !== formData.confirmPassword) {
        setPasswordError("Passwords do not match.");
        toast.error("Passwords do not match.");
        return;
      }
      setPasswordError("");
    }

    setLoading(true);

    try {
      const url = isLogin
        ? `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/login`
        : `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/register`;

      const response = await axios.post(url, formData);

      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);

      toast.success(`${isLogin ? "Login" : "Registration"} successful!`);

      // Redirect to profile after successful login/registration
      window.location.href = "/profile";
    } catch (error) {
      // Error handling for login or registration
      console.error(`${isLogin ? "Login" : "Registration"} failed:`, error);

      if (error.response && error.response.data.message) {
        // Show error message returned by backend
        toast.error(error.response.data.message);
      } else {
        // Show generic error message
        toast.error(
          `${isLogin ? "Login" : "Registration"} failed. Please try again.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl p-6 sm:p-8 lg:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-[#2563EB] text-transparent bg-clip-text mb-6 drop-shadow-xl">
          {isLogin
            ? "🌟 Rediscover Innovation - GIO Login 🌟"
            : "🌈 Step Into Innovation - GIO Registration 🌈"}
        </h1>
        <p className="text-center text-gray-700 mb-6 text-lg italic leading-relaxed">
          {isLogin
            ? "✨ Access your gateway to global brilliance. Log in to GIO and keep innovating! ✨"
            : "🌟 Unleash your potential and join the global stage of innovation. Register now for the GIO and make your mark! 🌟"}
        </p>

        {/* Video Link for Registration */}
        {!isLogin && (
          <div className="text-center mb-6">
            <a
              href="https://www.youtube.com/watch?v=CKCYNEJmjK4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline font-semibold"
            >
              📹 Watch a step-by-step guide to registration
            </a>
          </div>
        )}

        <div className="text-center mb-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-500 hover:underline"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* username */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>

          {/* Password */}
          <div className="col-span-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={passwordVisibility.password ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("password")}
              className="absolute right-3 top-10 text-gray-600 focus:outline-none"
            >
              {passwordVisibility.password ? "👁️" : "🙈"}
            </button>
          </div>

          {/* Confirm Password */}
          {!isLogin && (
            <div className="col-span-1 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type={passwordVisibility.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-3 top-10 text-gray-600 focus:outline-none"
              >
                {passwordVisibility.confirmPassword ? "👁️" : "🙈"}
              </button>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
          )}
          {/* Registration fields */}
          {!isLogin && (
            <>
              {/* Name */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                  <span className="text-xs ml-1 font-semibold text-blue-600">
                    (as it appears on the certificate)
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border uppercase border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              {/* WhatsApp Number */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                  disabled={formData.sameAsPhone}
                />
              </div>

              {/* Same as Phone Number */}
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  name="sameAsPhone"
                  checked={formData.sameAsPhone}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Same as Phone Number
                </label>
              </div>
              {/* Country */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.countryCode || ""} // Use isoCode for the selected value
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  {Country.getAllCountries().map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                >
                  <option value="" disabled>
                    Select State
                  </option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name} {/* Save full state name */}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                >
                  <option value="" disabled>
                    Select City
                  </option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name} {/* Save full city name */}
                    </option>
                  ))}
                </select>
              </div>

              {/* Teacher Phone Number */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher Phone Number
                </label>
                <input
                  type="text"
                  name="teacherPhoneNumber"
                  value={formData.teacherPhoneNumber}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              {/* Standard */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Standard
                </label>
                <select
                  name="standard"
                  value={formData.standard}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                >
                  <option value="" disabled>
                    Select Standard
                  </option>
                  {["5th", "6th", "7th", "8th", "9th", "10th"].map((std) => (
                    <option key={std} value={std}>
                      {std}
                    </option>
                  ))}
                </select>
              </div>

              {/* School Name */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md border uppercase border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="col-span-full">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-sm shadow-md transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {loading ? "Submitting..." : isLogin ? "Login" : "Register"}
            </button>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {/* {forgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
              Forgot Password
            </h2>
            <form onSubmit={handleForgotPassword}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your username
              </label>
              <input
                type="username"
                value={resetusername}
                onChange={(e) => setResetusername(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
              <button
                type="submit"
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <button
              onClick={() => setForgotPassword(false)}
              className="w-full mt-4 text-center text-blue-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Form;
