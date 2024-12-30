import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  IoIosSearch,
  IoIosFunnel,
  IoMdCheckmarkCircle,
  IoMdCloseCircle,
} from "react-icons/io";

const StudentsSection = ({
  students,
  searchName,
  setSearchName,
  currentPage,
  setCurrentPage,
  schoolName, // Receiving schoolName prop
  principalName, // Receiving principalName prop
}) => {
  const [filteredStudents, setFilteredStudents] = useState([]); // Holds the filtered data
  const renderRanking = (rank) => (rank !== undefined ? rank : "N/A");
  const studentsPerPage = 6; // Display 6 students per page

  const [showSearch, setShowSearch] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null); // Track the active filter
  const [selectedStandard, setSelectedStandard] = useState("All");
  const [selectedCountFilter, setSelectedCountFilter] = useState("All");
  const [countSortOrder, setCountSortOrder] = useState("All"); // Added state for sorting
  const [selectedPracticeFilter, setSelectedPracticeFilter] = useState({
    sort: "All",
    rankType: "All",
  });
  const [selectedFinalFilter, setSelectedFinalFilter] = useState({
    sort: "All",
    rankType: "All",
  });

  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState("All");
  const [showPassword, setShowPassword] = useState(false); // State for showing password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for showing confirm password

  const toggleSearchBar = () => setShowSearch(!showSearch);

  const toggleFilterDropdown = (filter) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const handleCountFilterSelect = (filter) => {
    setSelectedCountFilter(filter);
    setActiveFilter(null);
  };

  const handleSortOrderSelect = (order) => {
    setCountSortOrder(order);
    setActiveFilter(null);
  };

  const handlePracticeFilterSelect = (filterType, value) => {
    setSelectedPracticeFilter((prev) => ({ ...prev, [filterType]: value }));
    setActiveFilter(null);
  };

  const handleFinalFilterSelect = (filterType, value) => {
    setSelectedFinalFilter((prev) => ({ ...prev, [filterType]: value }));
    setActiveFilter(null);
  };

  const handlePaymentFilterSelect = (status) => {
    setSelectedPaymentFilter(status);
    setActiveFilter(null);
  };

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
  };
  const handleStandardFilterSelect = (standard) => {
    // Remove non-digit characters (e.g., 'th') from selected standard
    const normalizedStandard = standard.replace(/[^0-9]/g, "");
    setSelectedStandard(normalizedStandard === "" ? "All" : normalizedStandard);
    setActiveFilter(null);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); // Track selected student
  const [editStudentData, setEditStudentData] = useState({}); // Track editable student data

  // Open Modal with Selected Student's Data
  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setEditStudentData({ ...student }); // Clone student data for editing
    setIsModalOpen(true);
  };

  // Close Modal
  const closeStudentModal = () => {
    setSelectedStudent(null);
    setEditStudentData({});
    setIsModalOpen(false);
  };
  //  Handle Delete Student
  const handleDeleteStudent = async () => {
    try {
      const schoolToken = localStorage.getItem("schoolToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/update-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${schoolToken}`,
          },
          body: JSON.stringify({
            uid: selectedStudent.uid,
            deleteAccount: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student account.");
      }

      alert("Student account deleted successfully!");
      closeStudentModal();

      // Refresh the student list
      setFilteredStudents((prev) =>
        prev.filter((student) => student.uid !== selectedStudent.uid)
      );
    } catch (error) {
      console.error("Error deleting student account:", error.message);
      alert("Failed to delete student account. Please try again.");
    }
  };

  // Handle Update Student
  const handleUpdateStudent = async () => {
    try {
      const schoolToken = localStorage.getItem("schoolToken"); // Get the schoolToken from localStorage
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/update-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${schoolToken}`, // Add the token from localStorage
          },
          body: JSON.stringify(editStudentData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update student details.");
      }

      alert("Student details updated successfully!");
      closeStudentModal(); // Close modal after successful update
    } catch (error) {
      console.error("Error updating student:", error.message);
      alert("Failed to update student details. Please try again.");
    }
  };
  useEffect(() => {
    let result = [...students];

    if (searchName.trim()) {
      result = result.filter((student) =>
        student.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (selectedStandard !== "All") {
      result = result.filter(
        (student) => String(student.standard) === String(selectedStandard)
      );
    }

    if (selectedCountFilter === "Practice Test") {
      result = result.filter((student) => student.marks?.mock);
    } else if (selectedCountFilter === "Final Practice Test") {
      result = result.filter((student) => student.marks?.live);
    }

    // Payment Filter Logic
    if (selectedPaymentFilter !== "All") {
      if (selectedPaymentFilter === "Paid") {
        result = result.filter(
          (student) =>
            student.paymentStatus === "Paid" ||
            student.paymentStatus === "paid_but_not_attempted"
        );
      } else if (selectedPaymentFilter === "Unpaid") {
        result = result.filter((student) => student.paymentStatus === "unpaid");
      }
    }

    if (countSortOrder === "Low to High") {
      result.sort((a, b) => {
        const aTestCount =
          selectedCountFilter === "Practice Test"
            ? Object.keys(a.marks?.mock || {}).length
            : Object.keys(a.marks?.live || {}).length;
        const bTestCount =
          selectedCountFilter === "Practice Test"
            ? Object.keys(b.marks?.mock || {}).length
            : Object.keys(b.marks?.live || {}).length;
        return aTestCount - bTestCount;
      });
    } else if (countSortOrder === "High to Low") {
      result.sort((a, b) => {
        const aTestCount =
          selectedCountFilter === "Practice Test"
            ? Object.keys(a.marks?.mock || {}).length
            : Object.keys(a.marks?.live || {}).length;
        const bTestCount =
          selectedCountFilter === "Practice Test"
            ? Object.keys(b.marks?.mock || {}).length
            : Object.keys(b.marks?.live || {}).length;
        return bTestCount - aTestCount;
      });
    }

    setFilteredStudents(result);
    setCurrentPage(1);
  }, [
    students,
    searchName,
    selectedStandard,
    selectedCountFilter,
    selectedPaymentFilter, // Payment Filter Dependency
    countSortOrder,
    setCurrentPage,
  ]);

  const toggleRankFilter = (filterType, rankType) => {
    if (filterType === "practice") {
      setSelectedPracticeFilter((prev) => ({
        ...prev,
        rankType,
      }));
    } else if (filterType === "final") {
      setSelectedFinalFilter((prev) => ({
        ...prev,
        rankType,
      }));
    }
  };

  const startIndex = (currentPage - 1) * studentsPerPage;
  const displayedStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  const getTestCountsForStudent = (student) => {
    const mockTestsCount = student.marks?.mock
      ? Object.keys(student.marks.mock).length
      : 0;
    const liveTestsCount = student.marks?.live
      ? Object.keys(student.marks.live).length
      : 0;

    return { mockTestsCount, liveTestsCount };
  };
  return (
    <section className="DashboardHero w-full h-auto pt-5 bg-gray-50">
      <div className="w-[90%] max-w-6xl mx-auto bg-white rounded-2xl shadow-lg">
        <div className="w-full h-full flex items-center px-6 py-5 justify-between border-b">
          <h1 className="text-3xl font-bold text-blue-600">
            📚 GIO - Olympiad Tracker
          </h1>
          {schoolName && principalName && (
            <div className="flex flex-col items-end text-right">
              <span className="text-gray-700 font-bold text-base">
                {schoolName}
              </span>
              <span className="text-gray-500 text-sm">{principalName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-[90%] max-w-6xl mx-auto mt-5 bg-white rounded-2xl shadow-lg">
        <div className="w-full px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 text-gray-700 font-semibold text-sm border-b pb-3">
            {/* Name Filter */}
            <div className="flex items-center">
              <span>Name</span>
              <IoIosSearch
                className="text-gray-500 text-xl ml-2 cursor-pointer hover:text-blue-500 transition"
                onClick={toggleSearchBar}
              />
            </div>

            {/* Standard Filter */}
            <div className="relative">
              <span>Standard</span>
              <IoIosFunnel
                className="text-gray-500 text-xl ml-2 cursor-pointer hover:text-blue-500 transition"
                onClick={() => toggleFilterDropdown("standard")}
              />
              {activeFilter === "standard" && (
                <div className="absolute top-8 bg-white shadow-md rounded-lg p-3 w-40 border border-gray-300 z-10">
                  {/* Heading for Standard Filter */}
                  <div className="mb-2 font-semibold text-gray-700 border-b pb-1">
                    Select Standard
                  </div>

                  {/* All Standards Option */}
                  <div
                    className={`p-2 hover:bg-blue-50 cursor-pointer flex items-center ${
                      selectedStandard === "All" ? "font-bold" : ""
                    }`}
                    onClick={() => handleStandardFilterSelect("All")}
                  >
                    <IoMdCheckmarkCircle
                      className={`inline-block mr-2 ${
                        selectedStandard === "All"
                          ? "text-blue-500"
                          : "text-black"
                      }`}
                    />
                    All
                  </div>

                  {/* Individual Standards Options */}
                  {[5, 6, 7, 8, 9, 10].map((standard) => (
                    <div
                      key={standard}
                      className={`p-2 hover:bg-blue-50 cursor-pointer flex items-center ${
                        selectedStandard === String(standard) ? "font-bold" : ""
                      }`}
                      onClick={() =>
                        handleStandardFilterSelect(`${standard}th`)
                      }
                    >
                      <IoMdCheckmarkCircle
                        className={`inline-block mr-2 ${
                          selectedStandard === String(standard)
                            ? "text-blue-500"
                            : "text-black"
                        }`}
                      />
                      {standard}th
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Count Filter */}
            <div className="relative">
              <span>Count</span>
              <IoIosFunnel
                className="text-gray-500 text-xl ml-2 cursor-pointer hover:text-blue-500 transition"
                onClick={() => toggleFilterDropdown("count")}
              />
              {activeFilter === "count" && (
                <div className="absolute top-8 bg-white shadow-md rounded-lg p-3 w-56 border border-gray-300 z-10">
                  {/* Heading for Test Count Filters */}
                  <div className="mb-2 font-semibold text-gray-700 border-b pb-1">
                    Test Filters
                  </div>

                  {/* All Counts */}
                  <div
                    className={`p-2 hover:bg-blue-50 cursor-pointer flex items-center ${
                      selectedCountFilter === "All" ? "font-bold" : ""
                    }`}
                    onClick={() => handleCountFilterSelect("All")}
                  >
                    <IoMdCheckmarkCircle
                      className={`inline-block mr-2 ${
                        selectedCountFilter === "All"
                          ? "text-blue-500"
                          : "text-black"
                      }`}
                    />
                    All Counts
                  </div>

                  {/* Practice Tests */}
                  <div
                    className={`p-2 hover:bg-blue-50 cursor-pointer flex items-center ${
                      selectedCountFilter === "Practice Test" ? "font-bold" : ""
                    }`}
                    onClick={() => handleCountFilterSelect("Practice Test")}
                  >
                    <IoMdCheckmarkCircle
                      className={`inline-block mr-2 ${
                        selectedCountFilter === "Practice Test"
                          ? "text-blue-500"
                          : "text-black"
                      }`}
                    />
                    Practice Tests
                  </div>

                  {/* Final Tests */}
                  <div
                    className={`p-2 hover:bg-blue-50 cursor-pointer flex items-center ${
                      selectedCountFilter === "Final Practice Test"
                        ? "font-bold"
                        : ""
                    }`}
                    onClick={() =>
                      handleCountFilterSelect("Final Practice Test")
                    }
                  >
                    <IoMdCheckmarkCircle
                      className={`inline-block mr-2 ${
                        selectedCountFilter === "Final Practice Test"
                          ? "text-blue-500"
                          : "text-black"
                      }`}
                    />
                    Final Tests
                  </div>

                  {/* Heading for Sorting Options */}
                  <div className="mt-3 mb-2 font-semibold text-gray-700 border-b pb-1">
                    Sort Options
                  </div>

                  {/* Low to High */}
                  <div
                    className={`p-2 hover:bg-blue-50 cursor-pointer flex items-center ${
                      countSortOrder === "Low to High" ? "font-bold" : ""
                    }`}
                    onClick={() => handleSortOrderSelect("Low to High")}
                  >
                    <IoMdCheckmarkCircle
                      className={`inline-block mr-2 ${
                        countSortOrder === "Low to High"
                          ? "text-blue-500"
                          : "text-black"
                      }`}
                    />
                    Low to High
                  </div>

                  {/* High to Low */}
                  <div
                    className={`p-2 hover:bg-blue-50 cursor-pointer flex items-center ${
                      countSortOrder === "High to Low" ? "font-bold" : ""
                    }`}
                    onClick={() => handleSortOrderSelect("High to Low")}
                  >
                    <IoMdCheckmarkCircle
                      className={`inline-block mr-2 ${
                        countSortOrder === "High to Low"
                          ? "text-blue-500"
                          : "text-black"
                      }`}
                    />
                    High to Low
                  </div>
                </div>
              )}
            </div>

            {/* Practice Rankings */}
            <div>
              <span>Practice Rankings</span>
            </div>

            {/* Final Rankings */}
            <div>
              <span>Final Rankings</span>
            </div>

            {/* Payment Status Filter */}
            <div className="relative">
              <span>Payment Status</span>
              <IoIosFunnel
                className="text-gray-500 text-xl ml-2 cursor-pointer hover:text-blue-500 transition"
                onClick={() => toggleFilterDropdown("payment")}
              />
              {activeFilter === "payment" && (
                <div className="absolute top-8 bg-white shadow-md rounded-lg p-3 w-56 border border-gray-300 z-10">
                  {/* Heading for Payment Filters */}
                  <div className="mb-2 font-semibold text-gray-700 border-b pb-1">
                    Payment Status
                  </div>

                  {/* All Payments */}
                  <div
                    className={`p-2 hover:bg-blue-50 cursor-pointer flex items-center ${
                      selectedPaymentFilter === "All" ? "font-bold" : ""
                    }`}
                    onClick={() => handlePaymentFilterSelect("All")}
                  >
                    <IoMdCheckmarkCircle
                      className={`inline-block mr-2 ${
                        selectedPaymentFilter === "All"
                          ? "text-blue-500"
                          : "text-black"
                      }`}
                    />
                    All
                  </div>

                  {/* Paid */}
                  <div
                    className={`p-2 hover:bg-blue-50 cursor-pointer flex items-center ${
                      selectedPaymentFilter === "Paid" ? "font-bold" : ""
                    }`}
                    onClick={() => handlePaymentFilterSelect("Paid")}
                  >
                    <IoMdCheckmarkCircle
                      className={`inline-block mr-2 ${
                        selectedPaymentFilter === "Paid"
                          ? "text-blue-500"
                          : "text-black"
                      }`}
                    />
                    Paid
                  </div>

                  {/* Unpaid */}
                  <div
                    className={`p-2 hover:bg-blue-50 cursor-pointer flex items-center ${
                      selectedPaymentFilter === "Unpaid" ? "font-bold" : ""
                    }`}
                    onClick={() => handlePaymentFilterSelect("Unpaid")}
                  >
                    <IoMdCheckmarkCircle
                      className={`inline-block mr-2 ${
                        selectedPaymentFilter === "Unpaid"
                          ? "text-blue-500"
                          : "text-black"
                      }`}
                    />
                    Unpaid
                  </div>
                </div>
              )}
            </div>

            {/* Credential ID */}
            <div>
              <span>Credential ID</span>
            </div>
          </div>

          {/* Search Box */}
          {showSearch && (
            <div className="mt-4">
              <input
                type="text"
                value={searchName}
                onChange={handleSearchChange}
                placeholder="🔍 Search students..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Students Data */}
          {displayedStudents.map((student, index) => {
            const { mockTestsCount, liveTestsCount } =
              getTestCountsForStudent(student);

            const displayMockCount =
              selectedCountFilter === "Practice Test"
                ? mockTestsCount
                : selectedCountFilter === "Final Practice Test"
                ? 0
                : mockTestsCount;
            const displayLiveCount =
              selectedCountFilter === "Final Practice Test"
                ? liveTestsCount
                : selectedCountFilter === "Practice Test"
                ? 0
                : liveTestsCount;

            return (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-7 gap-4 text-gray-800 text-sm py-3 border-b last:border-none relative ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <span>{student.name}</span>
                <span>{student.standard}</span>
                <span>
                  • Practice Tests: {displayMockCount}
                  <br />• Final Tests: {displayLiveCount}
                </span>
                <span>
                  {(selectedCountFilter === "Practice Test" ||
                    selectedCountFilter === "All") && (
                    <>
                      • Global:{" "}
                      {student.rankings?.practice?.global?.rank || "N/A"}
                      <br />• Country:{" "}
                      {student.rankings?.practice?.country?.rank || "N/A"}
                      <br />• State:{" "}
                      {student.rankings?.practice?.state?.rank || "N/A"}
                    </>
                  )}
                </span>
                <span>
                  {(selectedCountFilter === "Final Practice Test" ||
                    selectedCountFilter === "All") && (
                    <>
                      • Global: {student.rankings?.final?.global?.rank || "N/A"}
                      <br />• Country:{" "}
                      {student.rankings?.final?.country?.rank || "N/A"}
                      <br />• State:{" "}
                      {student.rankings?.final?.state?.rank || "N/A"}
                    </>
                  )}
                </span>
                <span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      student.paymentStatus === "Unpaid"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {student.paymentStatus}
                  </span>
                </span>
                <span>
                  {student.certificateCodes ? (
                    <div className="flex flex-col gap-1">
                      • {student.certificateCodes.code || "N/A"}
                    </div>
                  ) : (
                    "N/A"
                  )}
                </span>
                <span className="absolute right-0 top-[40%]">
                  <BsThreeDotsVertical
                    className="cursor-pointer"
                    onClick={() => openStudentModal(student)} // Open modal on click
                  />
                </span>
              </div>
            );
          })}
          {/* Modal for Student Details */}
          {isModalOpen && selectedStudent && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
              <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg relative overflow-auto max-h-screen">
                <h2 className="text-xl font-bold text-blue-600 mb-4">
                  Edit Student Details
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateStudent(); // Update student handler
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Render Required Fields */}
                    {[
                      "uid",
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
                      "paymentStatus",
                    ].map((key) => (
                      <div key={key}>
                        <label className="block text-gray-700 font-semibold mb-1">
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).replace(/([A-Z])/g, " $1")}
                        </label>
                        <input
                          type="text"
                          value={editStudentData[key] || ""}
                          onChange={(e) =>
                            setEditStudentData({
                              ...editStudentData,
                              [key]: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded-md"
                          disabled={key === "uid" || key === "paymentStatus"} // Disable editing for UID and Payment Status
                        />
                      </div>
                    ))}
                    {/* Password Field */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={editStudentData.password || ""}
                          onChange={(e) =>
                            setEditStudentData({
                              ...editStudentData,
                              password: e.target.value,
                            })
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
                          value={editStudentData.confirmPassword || ""}
                          onChange={(e) =>
                            setEditStudentData({
                              ...editStudentData,
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
                      {editStudentData.password !==
                        editStudentData.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          Passwords do not match.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 gap-4">
                    <button
                      type="button"
                      onClick={handleDeleteStudent}
                      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                    >
                      Delete Account
                    </button>
                    <button
                      type="button"
                      onClick={closeStudentModal}
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

          {/* Pagination */}
          {filteredStudents.length > studentsPerPage && (
            <div className="flex justify-between mt-5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={
                  currentPage * studentsPerPage >= filteredStudents.length
                }
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StudentsSection;
