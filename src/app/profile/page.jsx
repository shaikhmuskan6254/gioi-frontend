"use client";

import { ImProfile } from "react-icons/im";
import { Country } from "country-state-city";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { MdSd } from "react-icons/md";
import ReactCountryFlag from "react-country-flag";
import Navbar from "@/components/layouts/navbar/navbar";
import Footer from "@/components/layouts/footer/footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  FaAdjust,
  FaCannabis,
  FaPhoneAlt,
  FaWhatsapp,
  FaMedal,
  FaEdit,
  FaSignOutAlt,
  FaEye,
  FaEyeSlash,
  FaRegCopy,
  FaPlayCircle,
} from "react-icons/fa";
import { BiSolidUserAccount } from "react-icons/bi";
import { FaSchoolCircleCheck } from "react-icons/fa6";
import Link from "next/link";
import Notifications from "@/components/notification/Notifications";
import Cursor from "@/components/cursor/Cursor";

const getCountryCode = (countryName) => {
  const country = Country.getAllCountries().find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  );
  return country ? country.isoCode : null;
};

const Profile = () => {
  const [data, setData] = useState(null);
  const [rankings, setRankings] = useState({
    mock: {
      global: { rank: "TBD", category: "Give Mock Test for Rankings" },
      country: { rank: "TBD", category: "Give Mock Test for Rankings" },
      state: { rank: "TBD", category: "Give Mock Test for Rankings" },
    },
    live: {
      global: { rank: "TBD", category: "Participate in Live Test" },
      country: { rank: "TBD", category: "Participate in Live Test" },
      state: { rank: "TBD", category: "Participate in Live Test" },
    },
  });

  // Basic state variables
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [testCounts, setTestCounts] = useState({ mock: 0, live: 0 });
  const [certificateCodes, setCertificateCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // States for Mock and Live subject marks
  const [showMockMarks, setShowMockMarks] = useState(false);
  const [mockSubjectMarks, setMockSubjectMarks] = useState({});
  const [mockMessage, setMockMessage] = useState("");
  const [isMockLoading, setIsMockLoading] = useState(false);

  const [showLiveMarks, setShowLiveMarks] = useState(false);
  const [liveSubjectMarks, setLiveSubjectMarks] = useState({});
  const [liveMessage, setLiveMessage] = useState("");
  const [isLiveLoading, setIsLiveLoading] = useState(false);

  const [editData, setEditData] = useState({});
  const router = useRouter();

  // -----------------------------
  // 1. Fetch Profile and Additional Data
  // -----------------------------
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/gio-profile");
          return;
        }

        // Fetch user profile
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/gio-profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(userResponse.data.user);

        // Ensure certificateCodes is always an array
        const fetchedCertificateCodes =
          userResponse.data.user?.certificateCodes?.code;
        if (Array.isArray(fetchedCertificateCodes)) {
          setCertificateCodes(fetchedCertificateCodes);
        } else if (fetchedCertificateCodes) {
          setCertificateCodes([fetchedCertificateCodes]);
        } else {
          setCertificateCodes([]);
        }

        // Fetch rankings and test counts in parallel
        await fetchAdditionalData(token);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch user profile.");
        router.push("/gio-profile");
      } finally {
        setLoading(false);
      }
    };

    const fetchAdditionalData = async (token) => {
      try {
        const [mockRankingsRes, liveRankingsRes, testCountsRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/get-rank?type=mock`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/get-rank?type=live`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/get-test-counts`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        // Update rankings
        setRankings({
          mock: mockRankingsRes.data.rankings || rankings.mock,
          live: liveRankingsRes.data.rankings || rankings.live,
        });

        // Update test counts
        setTestCounts(testCountsRes.data || { mock: 0, live: 0 });
      } catch (err) {
        console.error("Error fetching additional data:", err);
        toast.error("Failed to fetch additional data.");
      }
    };

    fetchUserProfile();
  }, [router]);

  // -----------------------------
  // 2. Fetch Subject Marks (Mock/Live)
  // -----------------------------
// Fetch Mock Subject Marks
const fetchMockSubjectMarks = async () => {
  setMockMessage("");
  setIsMockLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not logged in.");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/get-user-subject-marks`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Correctly passing headers
        },
      }
    );

    console.log("Mock Subject Marks Response:", response.data);

    const subjectMarksData = response.data.subjectMarks || {};
    const mockMarks = subjectMarksData.mock || {};

    console.log("Mock Marks Data:", mockMarks);

    if (Object.keys(mockMarks).length === 0) {
      setMockMessage("No mock test subject marks found.");
    } else {
      setMockSubjectMarks(mockMarks);

      // Build performance message
      let performanceMessage = "";
      Object.keys(mockMarks).forEach((subject) => {
        const marks = mockMarks[subject].score;
        const total = mockMarks[subject].total;
        if (marks / total >= 0.8) {
          performanceMessage += `You are great in ${subject.replace('_', ' ')} (Mock Test). `;
        } else if (marks / total >= 0.5) {
          performanceMessage += `You're doing well in ${subject.replace('_', ' ')} (Mock Test), but there's room for improvement. `;
        } else {
          performanceMessage += `You need to improve in ${subject.replace('_', ' ')} (Mock Test). `;
        }
      });

      setMockMessage(performanceMessage);
    }
  } catch (error) {
    console.error("Error fetching mock subject marks:", error.message);
    setMockMessage("Error fetching mock subject marks.");
  } finally {
    setIsMockLoading(false);
  }
};

// Fetch Live Subject Marks
const fetchLiveSubjectMarks = async () => {
  setLiveMessage("");
  setIsLiveLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not logged in.");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/get-user-subject-marks`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Correctly passing headers
        },
      }
    );

    console.log("Live Subject Marks Response:", response.data);

    const subjectMarksData = response.data.subjectMarks || {};
    const liveMarks = subjectMarksData.live || {};

    console.log("Live Marks Data:", liveMarks);

    if (Object.keys(liveMarks).length === 0) {
      setLiveMessage("No live test subject marks found.");
    } else {
      setLiveSubjectMarks(liveMarks);

      // Build performance message
      let performanceMessage = "";
      Object.keys(liveMarks).forEach((subject) => {
        const marks = liveMarks[subject].score;
        const total = liveMarks[subject].total;
        if (marks / total >= 0.8) {
          performanceMessage += `You are great in ${subject.replace('_', ' ')} (Live Test). `;
        } else if (marks / total >= 0.5) {
          performanceMessage += `You're doing well in ${subject.replace('_', ' ')} (Live Test), but there's room for improvement. `;
        } else {
          performanceMessage += `You need to improve in ${subject.replace('_', ' ')} (Live Test). `;
        }
      });

      setLiveMessage(performanceMessage);
    }
  } catch (error) {
    console.error("Error fetching live subject marks:", error.message);
    setLiveMessage("Error fetching live subject marks.");
  } finally {
    setIsLiveLoading(false);
  }
};

  // -----------------------------
  // 3. Handle Profile Editing
  // -----------------------------
  const openEditModal = () => {
    setEditData({
      uid: data.uid,
      name: data.name,
      username: data.username,
      PhoneNumber: data.PhoneNumber,
      teacherPhoneNumber: data.teacherPhoneNumber,
      whatsappNumber: data.whatsappNumber,
      standard: data.standard,
      schoolName: data.schoolName,
      country: data.country,
      state: data.state,
      city: data.city,
      password: "",
      confirmPassword: "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to be logged in to update your profile.");
        return;
      }

      if (!validateForm()) {
        toast.error("Please fix the errors in the form.");
        return;
      }

      const requestBody = {
        uid: editData.uid,
        ...editData,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/update-profile`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedData = response.data;
      setData(updatedData.user);
      setIsEditModalOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      toast.error("There was an error updating your profile. Please try again.");
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!editData.name) errors.push("Name is required.");
    if (!/^[0-9]{10}$/.test(editData.PhoneNumber))
      errors.push("Enter a valid 10-digit phone number.");
    if (!editData.password) errors.push("Password is required.");
    if (editData.password !== editData.confirmPassword)
      errors.push("Passwords do not match.");
    if (!editData.standard) errors.push("Standard is required.");

    if (errors.length > 0) {
      console.log("Validation Errors:", errors);
      return false;
    }
    return true;
  };

  // -----------------------------
  // 4. Render Functions / Helpers
  // -----------------------------
  const renderRanking = (title, ranking) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h4 className="text-lg font-semibold text-[#2563EB]">{title}</h4>
      {ranking && ranking.rank !== "TBD" ? (
        <div className="flex items-center gap-3 mt-4">
          <FaMedal
            className={`text-3xl ${ranking.category === "Gold"
                ? "text-yellow-500"
                : ranking.category === "Silver"
                  ? "text-gray-400"
                  : ranking.category === "Bronze"
                    ? "text-orange-400"
                    : "text-gray-500"
              }`}
          />
          <div>
            <p className="text-gray-700">
              <strong>Rank:</strong> {ranking.rank}
            </p>
            <p className="text-gray-700">
              <strong>Category:</strong> {ranking.category}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 mt-2">{ranking.category}</p>
      )}
    </div>
  );

  // -----------------------------
  // 5. Rendering the Profile UI
  // -----------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-blue-500 font-semibold text-lg animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <Cursor />
      <Navbar />
      <div className="container mx-auto mt-8 px-6">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-[#2563EB] py-6 px-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Global Innovator Olympiad
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-lg mt-2 font-bold flex items-center uppercase">
                    {data.name}
                    {data.country && (
                      <span className="hidden md:inline">
                        <ReactCountryFlag
                          countryCode={getCountryCode(data.country)}
                          svg
                          style={{
                            width: "1.5em",
                            height: "1.5em",
                            marginLeft: "0.5em",
                          }}
                          title={data.country}
                        />
                      </span>
                    )}
                  </p>
                </div>
                <p className="text-lg mt-2">Student</p>
              </div>
              {/* Header Buttons */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Edit Button */}
                    <button
                      onClick={openEditModal}
                      className="bg-yellow-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 flex items-center justify-center w-full sm:w-auto"
                    >
                      <FaEdit className="mr-2 text-lg" />
                      <span className="font-semibold">Edit</span>
                    </button>

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        router.push("/gio-profile");
                      }}
                      className="bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center w-full sm:w-auto"
                    >
                      <FaSignOutAlt className="mr-2 text-lg" />
                      <span className="font-semibold">Logout</span>
                    </button>

                    {/* Watch Overview Button */}
                    <a
                      href="https://www.youtube.com/watch?v=OM7GglxMnJM"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-900 transition duration-300 flex items-center justify-center w-full sm:w-auto"
                    >
                      <FaPlayCircle className="mr-2 text-lg" />
                      <span className="font-semibold">Watch Overview</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
              <div className="bg-white rounded-lg w-full max-w-2xl p-4 sm:p-6 shadow-lg relative overflow-auto max-h-screen">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4">
                  Edit Profile
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateProfile();
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      "name",
                      "username",
                      "PhoneNumber",
                      "teacherPhoneNumber",
                      "whatsappNumber",
                      "standard",
                      "schoolName",
                      "country",
                      "state",
                      "city",
                    ].map((field) => (
                      <div key={field}>
                        <label className="block text-gray-700 font-semibold mb-1">
                          {field
                            .charAt(0)
                            .toUpperCase()
                            .concat(field.slice(1).replace(/([A-Z])/g, " $1"))}
                        </label>
                        <input
                          type="text"
                          value={editData[field] || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              [field]: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Password Field */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={editData.password || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, password: e.target.value })
                        }
                        className="w-full p-2 border rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-gray-800"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={editData.confirmPassword || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-gray-800"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 gap-4">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {data.country && (
                    <div className="flex items-center gap-3">
                      <ReactCountryFlag
                        countryCode={getCountryCode(data.country)}
                        svg
                        style={{ width: "1.5em", height: "1.5em" }}
                        title={data.country}
                      />
                      <span className="text-sm text-gray-600">
                        {data.country}
                      </span>
                    </div>
                  )}
                  {data.PhoneNumber && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{
                            background: "linear-gradient(135deg, #2563EB, #2563EB)",
                          }}
                        >
                          <FaPhoneAlt className="text-white text-sm" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {data.PhoneNumber}
                        </span>
                      </div>
                    </div>
                  )}
                  {data.whatsappNumber && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{
                            background: "linear-gradient(135deg, #25D366, #128C7E)",
                          }}
                        >
                          <FaWhatsapp className="text-white" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {data.whatsappNumber}
                        </span>
                      </div>
                    </div>
                  )}
                  {data.teacherPhoneNumber && (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, #2563EB, #2563EB)",
                        }}
                      >
                        <BiSolidUserAccount className="text-white text-sm" />
                      </div>
                      <span className="text-sm text-gray-600">
                        Teacher: {data.teacherPhoneNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <ImProfile className="w-5 h-5 text-[#2563EB]" />
                    <span className="text-sm text-gray-600">{data.username}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaSchoolCircleCheck className="w-5 h-5 text-[#2563EB]" />
                    <span className="text-sm text-gray-600 uppercase">
                      {data.schoolName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MdSd className="w-5 h-5 text-[#2563EB]" />
                    <span className="text-sm text-gray-600">
                      Standard: {data.standard}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaAdjust className="w-5 h-5 text-[#2563EB]" />
                    <span className="text-sm text-gray-600">
                      State: {data.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCannabis className="w-5 h-5 text-[#2563EB]" />
                    <span className="text-sm text-gray-600">
                      City: {data.city}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Codes */}
            <div className="text-sm text-gray-600 mt-4 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md shadow-md transition-transform transform hover:scale-105">
              <span className="font-semibold text-blue-600">
                ✨ Final Test Certificate Credential ID:
              </span>
              {certificateCodes && certificateCodes.length > 0 ? (
                <div className="text-gray-800 text-sm mt-2 flex items-center gap-2 relative">
                  <span>Your Certificate Credential ID:</span>
                  <span className="font-semibold">
                    {certificateCodes.join(", ")}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        certificateCodes.join(", ")
                      );
                      setTooltipVisible(true);
                      setTimeout(() => setTooltipVisible(false), 2000);
                    }}
                    className="text-blue-600 hover:text-blue-800 flex items-center relative"
                    title="Copy to clipboard"
                  >
                    <FaRegCopy className="ml-2" size={18} />
                  </button>
                  {/* Tooltip */}
                  {tooltipVisible && (
                    <span className="absolute right-0 bg-blue-600 text-white text-xs py-1 px-2 rounded-md shadow-lg">
                      Copied!
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-sm mt-2">
                  No Certificate Credential ID available yet.
                </div>
              )}
            </div>

            {/* Toggle Buttons for Subject Marks */}
            <div className="mt-8 flex justify-center space-x-6">
              <button
                onClick={() => {
                  if (!showMockMarks && Object.keys(mockSubjectMarks).length === 0) {
                    fetchMockSubjectMarks();
                  }
                  setShowMockMarks(!showMockMarks);
                }}
                className={`px-6 py-2 rounded-lg ${showMockMarks
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                  }`}
              >
                {showMockMarks ? "Hide Mock Test Marks" : "Show Mock Test Marks"}
              </button>

              <button
                onClick={() => {
                  if (!showLiveMarks && Object.keys(liveSubjectMarks).length === 0) {
                    fetchLiveSubjectMarks();
                  }
                  setShowLiveMarks(!showLiveMarks);
                }}
                className={`px-6 py-2 rounded-lg ${showLiveMarks
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                  }`}
              >
                {showLiveMarks ? "Hide Live Test Marks" : "Show Live Test Marks"}
              </button>
            </div>

            {/* Subject Marks Section */}
            <div className="subject-marks-section mt-8">
              {/* Mock Test Marks */}
              {showMockMarks && (
                <div className="subject-list mt-6">
                  <h3 className="text-xl font-bold text-[#2563EB]">
                    Mock Test - Subject-Wise Marks
                  </h3>
                  {isMockLoading ? (
                    <p className="text-center text-gray-600">
                      Loading mock test marks...
                    </p>
                  ) : (
                    <>
                      {mockMessage && (
                        <div className="performance-message mt-4">
                          <p
                            className={`text-lg font-semibold ${mockMessage.includes("great")
                                ? "text-green-600"
                                : mockMessage.includes("improve")
                                  ? "text-red-600"
                                  : "text-yellow-600"
                              }`}
                          >
                            {mockMessage}
                          </p>
                        </div>
                      )}

                      {Object.keys(mockSubjectMarks).length > 0 ? (
                        <ul className="space-y-4 mt-4">
                          {Object.keys(mockSubjectMarks).map((subject) => {
                            const marks = mockSubjectMarks[subject].score;
                            const total = mockSubjectMarks[subject].total;
                            let message = "";

                            if (marks / total >= 0.8) {
                              message = "You are doing great!";
                            } else if (marks / total >= 0.5) {
                              message =
                                "You're doing well, but there's room for improvement.";
                            } else {
                              message = "You need to improve in this subject.";
                            }

                            return (
                              <li
                                key={subject}
                                className="bg-gray-50 p-4 rounded-lg shadow-md"
                              >
                                <div className="flex justify-between items-center">
                                  <h4 className="text-lg font-medium">
                                    {subject.replace('_', ' ')}
                                  </h4>
                                  <span className="text-xl font-semibold text-[#2563EB]">
                                    {marks} / {total}
                                  </span>
                                </div>
                                <p
                                  className={`mt-2 text-sm font-medium ${marks / total >= 0.8
                                      ? "text-green-500"
                                      : marks / total >= 0.5
                                        ? "text-yellow-500"
                                        : "text-red-500"
                                    }`}
                                >
                                  {message}
                                </p>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-gray-600 mt-4">
                          No mock test subject marks available.
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Live Test Marks */}
              {showLiveMarks && (
                <div className="subject-list mt-6">
                  <h3 className="text-xl font-bold text-[#2563EB]">
                    Live Test - Subject-Wise Marks
                  </h3>
                  {isLiveLoading ? (
                    <p className="text-center text-gray-600">
                      Loading live test marks...
                    </p>
                  ) : (
                    <>
                      {liveMessage && (
                        <div className="performance-message mt-4">
                          <p
                            className={`text-lg font-semibold ${liveMessage.includes("great")
                                ? "text-green-600"
                                : liveMessage.includes("improve")
                                  ? "text-red-600"
                                  : "text-yellow-600"
                              }`}
                          >
                            {liveMessage}
                          </p>
                        </div>
                      )}

                      {Object.keys(liveSubjectMarks).length > 0 ? (
                        <ul className="space-y-4 mt-4">
                          {Object.keys(liveSubjectMarks).map((subject) => {
                            const marks = liveSubjectMarks[subject].score;
                            const total = liveSubjectMarks[subject].total;
                            let message = "";

                            if (marks / total >= 0.8) {
                              message = "You are doing great!";
                            } else if (marks / total >= 0.5) {
                              message =
                                "You're doing well, but there's room for improvement.";
                            } else {
                              message = "You need to improve in this subject.";
                            }

                            return (
                              <li
                                key={subject}
                                className="bg-gray-50 p-4 rounded-lg shadow-md"
                              >
                                <div className="flex justify-between items-center">
                                  <h4 className="text-lg font-medium">
                                    {subject.replace('_', ' ')}
                                  </h4>
                                  <span className="text-xl font-semibold text-[#2563EB]">
                                    {marks} / {total}
                                  </span>
                                </div>
                                <p
                                  className={`mt-2 text-sm font-medium ${marks / total >= 0.8
                                      ? "text-green-500"
                                      : marks / total >= 0.5
                                        ? "text-yellow-500"
                                        : "text-red-500"
                                    }`}
                                >
                                  {message}
                                </p>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-gray-600 mt-4">
                          No live test subject marks available.
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Test Counts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {/* Mock Test Count */}
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 duration-300">
                <h4 className="text-xl font-bold flex items-center gap-2">
                  🎯 Practice Test Count
                </h4>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex flex-col items-center">
                    <span className="text-7xl">📘</span>
                    <p className="mt-2 text-sm font-medium">Learn &amp; Practice</p>
                  </div>
                  <p className="text-5xl font-extrabold">{testCounts.mock}</p>
                </div>
                <p className="text-sm mt-4 italic">
                  "The more you practice, the better you'll shine!"
                </p>
              </div>

              {/* Live Test Count */}
              <div className="bg-gradient-to-r from-red-400 to-red-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 duration-300">
                <h4 className="text-xl font-bold flex items-center gap-2">
                  🚀 Final Test Count
                </h4>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex flex-col items-center">
                    <span className="text-7xl">🌍</span>
                    <p className="mt-2 text-sm font-medium">Compete Globally</p>
                  </div>
                  <p className="text-5xl font-extrabold">{testCounts.live}</p>
                </div>
                <p className="text-sm mt-4 italic">
                  "Take on the world and showcase your talent!"
                </p>
              </div>
            </div>

            {/* Rankings Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {/* Mock Test Rankings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Practice Test Rankings
                </h3>
                <div className="space-y-4">
                  {renderRanking("Global Practice Ranking", rankings.mock.global)}
                  {renderRanking("Country Practice Ranking", rankings.mock.country)}
                  {renderRanking("State Practice Ranking", rankings.mock.state)}
                </div>
              </div>

              {/* Live Test Rankings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Final Test Rankings
                </h3>
                <div className="space-y-4">
                  {renderRanking("Global Final Ranking", rankings.live.global)}
                  {renderRanking("Country Final Ranking", rankings.live.country)}
                  {renderRanking("State Final Ranking", rankings.live.state)}
                </div>
              </div>
            </div>

            {/* Test Section (Practice & Final) */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Tests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold text-[#2563EB]">
                    Practice Test
                  </h4>
                  <p className="text-gray-600 mt-2">
                    Sharpen your skills with practice tests for live exam success!
                  </p>
                  <Link href="/gio-event/instructions">
                    <button className="bg-[#2563EB] text-white py-2 px-4 mt-4 rounded-md hover:bg-blue-600">
                      Start Practice Test
                    </button>
                  </Link>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold text-[#FF4D61]">
                    Final Test
                  </h4>
                  <p className="text-gray-600 mt-2">
                    Join the Final Test to rank globally and earn your certificate!
                  </p>
                  <Link href="/gio-event/paid-instructions">
                    <button className="bg-[#FF4D61] text-white py-2 px-4 mt-4 rounded-md hover:bg-red-500">
                      Start Final Test
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Section */}
          <Notifications />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Profile;
