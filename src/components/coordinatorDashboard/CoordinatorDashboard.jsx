"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FiMenu } from "react-icons/fi"; // Hamburger Icon
import { IoMdClose } from "react-icons/io"; // Close Icon

// Import the separate components you created
import CoordinatorDashboardSection from "./CoordinatorDashboardSection";
import StudentsSection from "./StudentSection";
import BulkSection from "./BulkSection";
import ProfileOverviewSection from "./ProfileOverviewSection"; // Import ProfileOverviewSection

const CoordinatorDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [file, setFile] = useState(null);
  const [bulkUploadResult, setBulkUploadResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [practiceTestCounts, setPracticeTestCounts] = useState({
    totalPracticeTests: 0,
    finalPracticeTests: 0,
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("coordinatorToken");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          router.push("/coordinator");
          return;
        }

        // Log the API hostname for debugging
        console.log("API Hostname:", process.env.NEXT_PUBLIC_API_HOSTNAME);

        // Fetch partner profile
        const profileRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/coordinator/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(profileRes.data.data);

        // Fetch students
        const studentsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/coordinator/students`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Check if students data exists
        if (studentsRes.data && studentsRes.data.students) {
          const fetchedStudents = Object.values(studentsRes.data.students);
          setStudents(fetchedStudents);
          setFilteredStudents(fetchedStudents);
        } else {
          // If no students are found, set students to an empty array
          setStudents([]);
          setFilteredStudents([]);
        }

        setError(null);
      } catch (err) {
        if (err.response) {
          // Server responded with a status other than 2xx
          console.error(
            "Error fetching data:",
            err.response.status,
            err.response.data
          );
          if (err.response.status === 404) {
            // Assuming 404 occurs when there are no students
            console.warn("No students found for this coordinator.");
            setStudents([]);
            setFilteredStudents([]);
          } else if (err.response.status === 401) {
            setError("Unauthorized. Please log in again.");
            router.push("/coordinator/login");
          } else {
            setError("An unexpected error occurred.");
          }
        } else if (err.request) {
          // Request was made but no response received
          console.error("No response received:", err.request);
          setError("No response from server. Please try again later.");
        } else {
          // Something else caused the error
          console.error("Error setting up request:", err.message);
          setError("Failed to set up request.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("coordinatorToken");
    router.push("/coordinator");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    setBulkUploadResult(null);
    if (tab !== "profile") {
      setShowProfileForm(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBulkUpload = async () => {
    try {
      const token = localStorage.getItem("coordinatorToken");
      if (!token) return;

      if (!file) {
        alert("Please select a file first.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/coordinator/bulk-upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setBulkUploadResult(res.data);

      // Refetch the students after bulk upload
      const studentsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/coordinator/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedStudents = studentsRes.data.students
        ? Object.values(studentsRes.data.students)
        : [];
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
    } catch (err) {
      console.error("Bulk upload error:", err.message);
      setBulkUploadResult({ error: "Failed to upload students." });
    }
  };

  useEffect(() => {
    const filtered = students.filter((student) =>
      student.name?.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchName, students]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-screen flex flex-col">
        {/* Navbar */}
        <nav className="w-full flex items-center justify-between px-5 md:px-10 py-4 bg-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 overflow-hidden rounded-full shadow-lg">
              <img
                src="GIOLOGO.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold">
                Global Innovator Olympiad
              </h1>
              <h1 className="text-lg md:text-2xl font-bold text-[#2563EB]">
                Partner Program:{" "}
                {userData && userData.name ? userData.name : "Loading..."}
              </h1>
            </div>
          </div>
          {/* Hamburger Menu for Mobile */}
          <div className="block md:hidden">
            {isMobileMenuOpen ? (
              <IoMdClose
                onClick={toggleMobileMenu}
                className="text-black text-3xl cursor-pointer"
              />
            ) : (
              <FiMenu
                onClick={toggleMobileMenu}
                className="text-black text-3xl cursor-pointer"
              />
            )}
          </div>
          {/* Full Navbar for Desktop */}
          <div className="hidden md:flex items-center gap-10">
            <h4
              className={`px-5 py-2 rounded-2xl font-bold transition-colors duration-300 cursor-pointer ${
                activeTab === "profile" ? "bg-[#2563EB] text-white" : ""
              }`}
              onClick={() => handleTabClick("profile")}
            >
              Profile Overview
            </h4>
            <h4
              className={`px-5 py-2 rounded-2xl font-bold transition-colors duration-300 cursor-pointer ${
                activeTab === "students" ? "bg-[#2563EB] text-white" : ""
              }`}
              onClick={() => handleTabClick("students")}
            >
              Enrolled Students
            </h4>
            <h4
              className={`px-5 py-2 rounded-2xl font-bold transition-colors duration-300 cursor-pointer ${
                activeTab === "bulkUpload" ? "bg-[#2563EB] text-white" : ""
              }`}
              onClick={() => handleTabClick("bulkUpload")}
            >
              Batch Enrollment
            </h4>
            <button
              className="px-5 py-2 bg-red-600 text-white rounded-2xl font-bold"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-[15%] left-0 w-full bg-white shadow-lg z-10 p-5 md:hidden">
            <ul className="space-y-4">
              <li
                className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${
                  activeTab === "profile" ? "bg-[#2563EB] text-white" : ""
                }`}
                onClick={() => handleTabClick("profile")}
              >
                Profile Overview
              </li>
              <li
                className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${
                  activeTab === "students" ? "bg-[#2563EB] text-white" : ""
                }`}
                onClick={() => handleTabClick("students")}
              >
                Enrolled Students
              </li>
              <li
                className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${
                  activeTab === "bulkUpload" ? "bg-[#2563EB] text-white" : ""
                }`}
                onClick={() => handleTabClick("bulkUpload")}
              >
                Batch Enrollment
              </li>
              <li>
                <button
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-bold"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* Render Section Based on Active Tab */}
        <div className="flex-grow overflow-auto">
          {activeTab === "profile" &&
            (!showProfileForm ? (
              <CoordinatorDashboardSection
                userData={userData}
                students={students}
                practiceTestCounts={practiceTestCounts}
                onAddPaymentDetails={() => setShowProfileForm(true)} // Show form on button click
              />
            ) : (
              <ProfileOverviewSection
                userData={userData}
                onUpdateDetails={(updated) => {
                  setUserData({ ...userData, ...updated });
                  setShowProfileForm(false);
                }}
              />
            ))}
          {activeTab === "students" && (
            <StudentsSection
              students={filteredStudents}
              searchName={searchName}
              setSearchName={setSearchName}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
          {activeTab === "bulkUpload" && (
            <BulkSection
              bulkUploadResult={bulkUploadResult}
              onFileChange={handleFileChange}
              onUpload={handleBulkUpload}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CoordinatorDashboard;
