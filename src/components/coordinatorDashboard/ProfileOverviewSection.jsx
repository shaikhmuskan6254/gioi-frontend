"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import debounce from "lodash.debounce"; // Make sure you have this installed

const ProfileOverviewSection = ({ userData, onUpdateDetails }) => {
  // State for Bank Details
  const [bankDetails, setBankDetails] = useState({
    ifsc: userData.ifsc || "",
    accountNumber: userData.accountNumber || "",
    bankName: userData.bankName || "",
    branch: userData.branch || "",
    accountHolderName: userData.accountHolderName || "", // New field
  });

  // State for UPI Details
  const [upiDetails, setUpiDetails] = useState({
    upiId: userData.upiId || "",
  });

  // State for Loading Indicators
  const [loading, setLoading] = useState({
    ifsc: false,
    submit: false,
  });

  // Helper function to validate IFSC code format
  const isValidIFSC = (ifsc) => {
    const regex = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/;
    return regex.test(ifsc);
  };

  // Helper function to validate UPI ID format
  const isValidUPI = (upi) => {
    const regex = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;
    return regex.test(upi);
  };

  // Handle IFSC Code Change with Debounce
  const handleIfscChange = (e) => {
    const value = e.target.value.toUpperCase();
    setBankDetails((prev) => ({
      ...prev,
      ifsc: value,
      bankName: "",
      branch: "",
    }));
    debouncedFetchBankDetails(value);
  };

  // Debounced Fetch Function
  const debouncedFetchBankDetails = debounce(async (ifsc) => {
    if (ifsc.length !== 11 || !isValidIFSC(ifsc)) {
      toast.error("Please enter a valid IFSC code.");
      return;
    }

    setLoading((prev) => ({ ...prev, ifsc: true }));

    try {
      const response = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);
      const { BANK, BRANCH } = response.data;

      toast.success("Bank details fetched successfully!");

      setBankDetails((prev) => ({
        ...prev,
        bankName: BANK,
        branch: BRANCH,
      }));
    } catch (error) {
      console.error("Error fetching bank details:", error);
      toast.error("Invalid IFSC code or unable to fetch bank details.");
      setBankDetails((prev) => ({
        ...prev,
        bankName: "",
        branch: "",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, ifsc: false }));
    }
  }, 500); // Adjust the debounce delay as needed

  // Handle Bank Details Change
  const handleBankChange = (e) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  // Handle UPI Details Change
  const handleUpiChange = (e) => {
    setUpiDetails({ ...upiDetails, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { ifsc, accountNumber, accountHolderName } = bankDetails;
    const { upiId } = upiDetails;

    // Basic Validation
    if ((!ifsc || !accountNumber || !accountHolderName) && !upiId) {
      toast.error("Please provide IFSC, Account Number & Account Holder Name or a UPI ID.");
      return;
    }

    if (ifsc && !isValidIFSC(ifsc)) {
      toast.error("Please enter a valid IFSC code.");
      return;
    }

    if (upiId && !isValidUPI(upiId)) {
      toast.error("Please enter a valid UPI ID.");
      return;
    }

    setLoading((prev) => ({ ...prev, submit: true }));

    try {
      const token = localStorage.getItem("coordinatorToken"); // Ensure you store the token upon login

      const payload = {
        ifsc,
        accountNumber,
        accountHolderName,
        upiId,
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/coordinator/update-profile`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);
      onUpdateDetails(response.data.data);
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data?.error || error.message
      );
      toast.error(error.response?.data?.error || "Failed to update profile.");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchBankDetails.cancel();
    };
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Profile Overview</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bank Details Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Bank Details</h3>
          <div className="space-y-4">
            {/* IFSC Code */}
            <div>
              <label className="block text-gray-700">
                IFSC Code
                <span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                name="ifsc"
                value={bankDetails.ifsc}
                onChange={handleIfscChange}
                maxLength={11}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter IFSC Code"
                required
              />
              {loading.ifsc && (
                <p className="text-sm text-blue-500 mt-1">
                  Fetching bank details...
                </p>
              )}
            </div>

            {/* Display Bank Name and Branch */}
            {bankDetails.bankName && bankDetails.branch && (
              <div className="space-y-2">
                <p>
                  <strong>Bank Name:</strong> {bankDetails.bankName}
                </p>
                <p>
                  <strong>Branch:</strong> {bankDetails.branch}
                </p>
              </div>
            )}

            {/* Account Holder Name */}
            <div>
              <label className="block text-gray-700">
                Account Holder Name<span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                name="accountHolderName"
                value={bankDetails.accountHolderName}
                onChange={handleBankChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter Account Holder Name"
                required
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-gray-700">
                Account Number<span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                name="accountNumber"
                value={bankDetails.accountNumber}
                onChange={handleBankChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter Account Number"
                required
              />
            </div>
          </div>
        </div>

        {/* UPI Details Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">UPI Details</h3>
          <div className="space-y-4">
            {/* UPI ID */}
            <div>
              <label className="block text-gray-700">
                UPI ID<span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                name="upiId"
                value={upiDetails.upiId}
                onChange={handleUpiChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter UPI ID (e.g., user@bank)"
                required
              />
              {upiDetails.upiId && !isValidUPI(upiDetails.upiId) && (
                <p className="text-sm text-red-500 mt-1">
                  Invalid UPI ID format.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
            disabled={loading.submit}
          >
            {loading.submit ? "Updating..." : "Save Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileOverviewSection;
