"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [referenceCode, setReferenceCode] = useState(""); // State for reference code
  const [amount, setAmount] = useState(250); // Initial amount in INR
  const [isCodeValid, setIsCodeValid] = useState(false); // State to track if the code is valid

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User is not logged in.");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/gio-profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserProfile(response.data.user);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      }
    };

    fetchUserProfile();
  }, []);

  // Apply reference code with API validation
  const applyReferenceCode = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/admin/validate-reference-code`,
        { referenceCode }
      );

      if (response.data.success) {
        setIsCodeValid(true);
        setAmount(100); // Apply discount
        toast.success(
          "Reference code applied successfully! 60% discount applied."
        );
      } else {
        setIsCodeValid(false);
        toast.error("Invalid reference code. Please try again.");
      }
    } catch (error) {
      console.error("Error validating reference code:", error);
      setIsCodeValid(false);
      toast.error("Failed to validate reference code. Please try again.");
    }
  };

  // Handle payment
  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/payment/create-order`,
        { amount }
      );

      const { orderId, currency } = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency,
        name: "Global Innovator Olympiad",
        description: "Secure Payment",
        order_id: orderId,
        handler: async function () {
          toast.success("Payment Successful!");
          try {
            const token = localStorage.getItem("token");
            await axios.patch(
              `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/update-payment-status`,
              { paymentStatus: "paid_but_not_attempted" },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            router.push("/gio-event/paid-instructions"); // Redirect to Instructions
          } catch (error) {
            console.error("Error updating payment status:", error);
            toast.error("Failed to update payment status. Please try again.");
          }
        },
        prefill: {
          name: userProfile.name,
          email: userProfile.email,
          contact: userProfile.contact || "9999999999",
        },
        theme: { color: "#2563eb" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <p className="text-red-500 text-center">Error: {error}</p>;
  }

  if (!userProfile) {
    return <p className="text-center text-gray-500">Loading user details...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E3F2FD] to-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        <div className="flex justify-center mb-8">
          <img
            src="/GIOLOGO.png"
            alt="Global Innovator Olympiad Logo"
            className="h-20"
          />
        </div>

        <h1 className="text-3xl font-extrabold text-center text-[#2563eb] mb-6 tracking-wide">
          Global Innovator Olympiad
        </h1>

        <p className="text-center text-gray-500 mb-8 leading-relaxed">
          Secure your spot for the test! Your payment is secure and protected.
          We use advanced encryption and data safety measures to ensure your
          privacy.
        </p>

        <div className="flex flex-col mb-6">
          <label className="text-gray-700 font-medium mb-2">
            Reference Code:
          </label>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">
              Apply reference code to get{" "}
              <span className="font-semibold">60% off</span>!
            </p>
            <div className="flex">
              <input
                type="text"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-md p-2 focus:ring focus:ring-blue-200"
                placeholder="Enter reference code"
              />
              <button
                onClick={applyReferenceCode}
                className="bg-[#2563eb] text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border border-gray-200 rounded-md p-5 bg-gray-50 shadow-sm mb-6">
          <span className="text-gray-700 text-lg font-medium">
            Amount (INR):
          </span>
          <span className="text-2xl font-bold text-[#2563eb]">
            ₹{amount}.00
          </span>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 rounded-full bg-[#2563eb] text-white font-bold text-xl shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:ring focus:ring-blue-200 focus:ring-offset-2 ${
            loading ? "bg-gray-400 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : `Pay ₹${amount} Now`}
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          By proceeding, you agree to our{" "}
          <a
            href="/terms-conditions"
            className="text-[#2563eb] underline hover:text-blue-600"
          >
            Terms & Conditions
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
