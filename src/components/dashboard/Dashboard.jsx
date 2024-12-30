"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FiMenu } from "react-icons/fi"; // Hamburger Icon
import { IoMdClose } from "react-icons/io"; // Close Icon
import DashboardSection from "./DashboardSection";
import StudentsSection from "./StudentsSection";
import BulkSection from "./BulkSection";
import VerifyCertificate from "./VerifyCertificate";
import { Import } from "lucide-react";
import StudentMarksSection from "./StudentMarksSection"; 

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [userData, setUserData] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStandard, setSelectedStandard] = useState("");
  const [searchName, setSearchName] = useState("");
  const [practiceTestCounts, setPracticeTestCounts] = useState({
    totalPracticeTests: 0,
    finalPracticeTests: 0,
  });
  const [totalMockTests, setTotalMockTests] = useState(0); // Total mock tests (practice)
  const [totalLiveTests, setTotalLiveTests] = useState(0); // Total live tests (final)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const studentsPerPage = 10;

  const handleFileUpload = async () => {
    // Your existing file upload logic
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("schoolToken");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          router.push("/auth");
          return;
        }

        // Fetch representative and practice test data
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/school/representative`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const representative = userResponse.data.representative;
        setUserData(representative);

        // Extract practice test counts
        const { practiceTestCounts } = userResponse.data;
        setPracticeTestCounts({
          totalPracticeTests: practiceTestCounts.totalPracticeTests || 0,
          finalPracticeTests: practiceTestCounts.finalPracticeTests || 0,
        });

        // Fetch students data
        const studentsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/school/fetch-users`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              schoolName: representative.schoolName,
              standard: selectedStandard || "",
            },
          }
        );

        // Set students data
        const fetchedStudents = Array.isArray(studentsResponse.data.users)
          ? studentsResponse.data.users
          : [];

        // Map the `mock` rankings to `practice` and `live` to `final practice`
        const updatedStudents = fetchedStudents.map((student) => ({
          ...student,
          rankings: {
            practice: student.ranks.mock, // Map `mock` to `practice`
            final: student.ranks.live, // Map `live` to `final practice`
          },
        }));

        setStudents(updatedStudents);
        setFilteredStudents(updatedStudents);

        // Fetch test counts for all students
        const testCountsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/get-all-students-test-counts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (testCountsResponse.status === 200) {
          const { mock, live } = testCountsResponse.data;

          setTotalMockTests(mock);

          // Set total practice tests (mock)
          setTotalLiveTests(live); // Set total final tests (live)
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [router, selectedStandard]);

  const handleLogout = () => {
    localStorage.removeItem("schoolToken");
    router.push("/");
  };

  const handleNextPage = () => {
    if (currentPage * studentsPerPage < filteredStudents.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSelectStandard = (std) => {
    setSelectedStandard(std);
  };

  const handleTabClick = (tab) => {
    if (tab === "home") {
      router.push("/");
    } else {
      setActiveTab(tab);
      setIsMobileMenuOpen(false); // Close the mobile menu when a tab is clicked
    }
  };

  return (
    <>
      <div className="w-full h-screen">
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
              <h1 className=" text-lg md:text-2xl font-bold">
                Global Innovator Olympiad
              </h1>
              <h1 className=" text-lg md:text-2xl font-bold text-[#2563EB]">
                Dashboard
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
          <div className="hidden md:flex items-center gap-5">
            <h4
              className={`px-3 py-1 font-bold transition-colors duration-300 cursor-pointer text-sm ${
                activeTab === "home"
                  ? "border-b-2 border-[#2563EB] text-[#2563EB]"
                  : ""
              }`}
              onClick={() => handleTabClick("home")}
            >
              Home
            </h4>
            <h4
              className={`px-3 py-1 font-bold transition-colors duration-300 cursor-pointer text-sm ${
                activeTab === "profile"
                  ? "border-b-2 border-[#2563EB] text-[#2563EB]"
                  : ""
              }`}
              onClick={() => handleTabClick("profile")}
            >
              Profile Overview
            </h4>
            <h4
              className={`px-3 py-1 font-bold transition-colors duration-300 cursor-pointer text-sm ${
                activeTab === "students"
                  ? "border-b-2 border-[#2563EB] text-[#2563EB]"
                  : ""
              }`}
              onClick={() => handleTabClick("students")}
            >
              Enrolled Students
            </h4>
            <h4
      className={`px-3 py-1 font-bold transition-colors duration-300 cursor-pointer text-sm ${
        activeTab === "studentMarks"
          ? "border-b-2 border-[#2563EB] text-[#2563EB]"
          : ""
      }`}
      onClick={() => handleTabClick("studentMarks")}
    >
      Student Marks
    </h4>
            <h4
              className={`px-3 py-1 font-bold transition-colors duration-300 cursor-pointer text-sm ${
                activeTab === "bulkUpload"
                  ? "border-b-2 border-[#2563EB] text-[#2563EB]"
                  : ""
              }`}
              onClick={() => handleTabClick("bulkUpload")}
            >
              Batch Enrollment
            </h4>
            <h4
              className={`px-3 py-1 font-bold transition-colors duration-300 cursor-pointer text-sm ${
                activeTab === "verifyCertificate"
                  ? "border-b-2 border-[#2563EB] text-[#2563EB]"
                  : ""
              }`}
              onClick={() => handleTabClick("verifyCertificate")}
            >
              Verify Certificate
            </h4>
            <button
              className="px-3 py-1 bg-red-600 text-white rounded-2xl font-bold text-sm"
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
                className={`px-4 py-2 font-bold cursor-pointer ${
                  activeTab === "home"
                    ? "border-b-2 border-[#2563EB] text-[#2563EB]"
                    : ""
                }`}
                onClick={() => handleTabClick("home")}
              >
                Home
              </li>
              <li
                className={`px-4 py-2 font-bold cursor-pointer ${
                  activeTab === "profile"
                    ? "border-b-2 border-[#2563EB] text-[#2563EB]"
                    : ""
                }`}
                onClick={() => handleTabClick("profile")}
              >
                Profile
              </li>
              <li
                className={`px-4 py-2 font-bold cursor-pointer ${
                  activeTab === "students"
                    ? "border-b-2 border-[#2563EB] text-[#2563EB]"
                    : ""
                }`}
                onClick={() => handleTabClick("students")}
              >
                Students
              </li>
              <li
                className={`px-4 py-2 font-bold cursor-pointer ${
                  activeTab === "bulkUpload"
                    ? "border-b-2 border-[#2563EB] text-[#2563EB]"
                    : ""
                }`}
                onClick={() => handleTabClick("bulkUpload")}
              >
                Bulk Upload
              </li>
              <li
        className={`px-4 py-2 font-bold cursor-pointer ${
          activeTab === "studentMarks"
            ? "border-b-2 border-[#2563EB] text-[#2563EB]"
            : ""
        }`}
        onClick={() => handleTabClick("studentMarks")}
      >
        Student Marks
      </li>
              <li
                className={`px-4 py-2 font-bold cursor-pointer ${
                  activeTab === "verifyCertificate"
                    ? "border-b-2 border-[#2563EB] text-[#2563EB]"
                    : ""
                }`}
                onClick={() => handleTabClick("verifyCertificate")}
              >
                Verify Certificate
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
        {activeTab === "verifyCertificate" && <VerifyCertificate />}
        {activeTab === "profile" && (
          <DashboardSection
            userData={userData}
            students={students}
            practiceTestCounts={practiceTestCounts}
          />
        )}
        {activeTab === "students" && (
          <StudentsSection
            students={filteredStudents}
            setSearchName={setSearchName}
            searchName={searchName}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            studentsPerPage={studentsPerPage}
            practiceTestCounts={practiceTestCounts}
            schoolName={userData?.schoolName} // Pass schoolName here
            principalName={userData?.principalName} // Pass principalName here
          />
        )}
        {activeTab === "studentMarks" && (
  <StudentMarksSection schoolName={userData?.schoolName} />
)}
        {activeTab === "bulkUpload" && <BulkSection />}
      </div>
    </>
  );
};

export default Dashboard;
