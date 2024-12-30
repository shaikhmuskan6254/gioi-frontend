"use client";
import Image from "next/image";
import {
  FaTimes,
  FaUser,
  FaPhone,
  FaRegCommentDots,
  FaPaperPlane,
} from "react-icons/fa";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaInstagram,
  FaPhoneAlt,
} from "react-icons/fa";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Footer = () => {
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    // Replace with your backend API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/request-callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      toast.success("Request sent successfully!");
      setShowPopup(false);
      setFormData({ name: "", mobile: "", message: "" });
    } else {
      toast.error("Failed to send the request. Please try again.");
    }
  };

  return (
    <>
      {/* Sticky WhatsApp Button */}
      <ToastContainer position="top-right" autoClose={3000} />
      <a
        href="https://wa.me/919594402916"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 bg-green-500 border-2 border-white text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-300 md:p-5 hover:text-black hover:scale-110"
        title="Chat with us on WhatsApp"
        style={{ fontSize: "2.5rem" }}
      >
        <FaWhatsapp />
      </a>

      {/* Sticky Call Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="fixed bottom-[18%] right-4 z-50 border-2 border-white bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 md:p-5 hover:scale-110"
        title="Request a Callback"
        style={{ fontSize: "2.5rem" }}
      >
        <FaPhoneAlt />
      </button>

      {/* Callback Form Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-70 backdrop-blur-lg">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-11/12 md:w-1/3 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition duration-300"
            >
              <FaTimes size={20} />
            </button>

            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="flex justify-center items-center mb-2">
                <FaPhone className="text-blue-500" size={40} />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800">
                Request a Callback
              </h2>
              <p className="text-gray-500 text-sm">
                We’ll get back to you as soon as possible!
              </p>
            </div>

            {/* Form Section */}
            <div className="space-y-5">
              <div className="flex items-center border border-gray-300 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                <FaUser className="text-gray-500 mr-3" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full outline-none text-gray-700"
                />
              </div>

              <div className="flex items-center border border-gray-300 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                <FaPhone className="text-gray-500 mr-3" />
                <input
                  type="text"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full outline-none text-gray-700"
                />
              </div>

              <div className="flex items-start border border-gray-300 rounded-lg p-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                <FaRegCommentDots className="text-gray-500 mr-3 mt-1" />
                <textarea
                  name="message"
                  placeholder="What would you like to discuss?"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full outline-none text-gray-700 resize-none h-20"
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 flex items-center text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 flex items-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md"
              >
                <FaPaperPlane className="mr-2" />
                Request Callback
              </button>
            </div>
          </div>
        </div>
      )}
      <footer className="bg-blue-500 text-white p-8 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start space-y-8 md:space-y-0 md:space-x-8">
          {/* Contact Section */}
          <div className="w-full md:w-1/4 flex flex-col items-center md:items-start text-center md:text-left">
            <Image
              src="/GIOLOGO.png" // Replace with the actual path to your logo image
              alt="Global Innovator Olympiad Logo"
              width={100}
              height={100}
              className="mb-4"
            />
            <h3 className="text-lg font-bold mb-2">Contact Us</h3>
            <p>Call: +91 959 440 2916</p>
            <p>Email: globalinnovatorolympiad@gmail.com</p>
            <p className="text-center md:text-left">
              Head-Office, BKC, Mumbai, India, 400070
            </p>
          </div>

          {/* Navigation Links */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h3 className="text-lg font-bold mb-2">Explore</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/aboutus" className="hover:underline">
                  Our Story
                </a>
              </li>
              <li>
                <a href="/olympiad" className="hover:underline">
                  Olympiad
                </a>
              </li>
              <li>
                <a href="/coordinator" className="hover:underline">
                  Partner Program
                </a>
              </li>
            </ul>
          </div>

          {/* Category Links */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h3 className="text-lg font-bold mb-2">Category</h3>
            <ul className="space-y-2">
              <li>
                <a href="/olympiad" className="hover:underline">
                  Olympiad Details
                </a>
              </li>
              <li>
                <a href="/olympiad" className="hover:underline">
                  Syllabus and Preparation
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Icons
          <div className="w-full md:w-1/4 flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold mb-2">Follow Us</h3>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com/profile.php?id=61568632543622"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-2 rounded transition duration-300 transform hover:text-black hover:scale-110 shadow-lg"
              >
                <FaFacebookF className="text-blue-500" />
              </a>
              <a
                href="https://www.linkedin.com/company/global-innovator-olympiad"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-2 rounded transition duration-300 transform hover:text-black hover:scale-110 shadow-lg"
              >
                <FaLinkedinIn className="text-blue-500" />
              </a>
              <a
                href="https://www.instagram.com/globalinnovatorolympiad/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-2 rounded transition duration-300 transform hover:text-black hover:scale-110 shadow-lg"
              >
                <FaInstagram className="text-pink-500" />
              </a>
            </div>
          </div> */}
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-4">
          <div className="flex flex-col items-center space-y-2 text-sm">
            <div className="flex space-x-4">
              <a href="/aboutus" className="hover:underline">
                Our Story
              </a>
              <a href="/refund-policy" className="hover:underline">
                Refund Policy
              </a>
              <a href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </a>
              <a href="/terms-conditions" className="hover:underline">
                Terms & Conditions
              </a>
            </div>
            <p>
              © 2011-2024 GIO All Rights Reserved.
              <a
                href="https://nexcorealliance.com/"
                target="_blank"
                className="font-extrabold uppercase"
              >
                Nexcore Alliance LLP
              </a>
            </p>
            <span>Global Innovator Olympiad</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
