// src/components/dashboard/StudentMarksSection.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
  IoIosSearch,
  IoIosFunnel,
  IoMdCheckmarkCircle,
  IoMdCloseCircle,
} from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa"; // Import FaSpinner
import debounce from "lodash.debounce";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const StudentMarksSection = ({ schoolName }) => {
  // State Variables
  const [subjectMarks, setSubjectMarks] = useState([]); // Raw data from API
  const [filteredMarks, setFilteredMarks] = useState([]); // Filtered and flattened data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Filters
  const [searchName, setSearchName] = useState(""); // Search by student name
  const [selectedStandard, setSelectedStandard] = useState("All"); // Filter by standard
  const [selectedTestType, setSelectedTestType] = useState("All"); // Filter by test type (Live Test/Mock Test)
  const [selectedSubject, setSelectedSubject] = useState("All"); // Filter by subject
  const [sortOption, setSortOption] = useState("Descending"); // Sort by marks

  // Dropdown State
  const [activeFilter, setActiveFilter] = useState(null); // Track which filter dropdown is active

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const marksPerPage = 10; // Marks per page

  // Debounced Search Handler to improve performance
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchName(value);
      }, 300),
    []
  );

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Fetch subject marks from the backend API
  useEffect(() => {
    const fetchSubjectMarks = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching subject marks for:", schoolName);
        console.log(
          "API URL:",
          `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/school/subject-marks`
        );

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/school/subject-marks`,
          {
            params: {
              schoolName,
            },
          }
        );

        setSubjectMarks(response.data.subjectMarks);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching subject marks:", err.message);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch subject marks."
        );
        toast.error(
          err.response?.data?.message || "Failed to fetch subject marks."
        );
        setLoading(false);
      }
    };

    if (schoolName) {
      fetchSubjectMarks();
    }
  }, [schoolName]);

  // Helper function to format test types
  const formatTestType = (type) => {
    // Map 'final' to 'Live Test' and 'practice' to 'Mock Test'
    if (type.toLowerCase() === "final") return "Live Test";
    if (type.toLowerCase() === "practice") return "Mock Test";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Flatten the nested subjectMarks data for easier manipulation
  const flattenMarksData = (data) => {
    const flattened = [];

    ["mock", "live"].forEach((testType) => {
      if (data[testType]) {
        Object.keys(data[testType]).forEach((standard) => {
          if (data[testType][standard]) {
            Object.keys(data[testType][standard]).forEach((subject) => {
              if (data[testType][standard][subject]) {
                data[testType][standard][subject].forEach((student) => {
                  flattened.push({
                    testType: formatTestType(testType), // Capitalize and map test type
                    standard,
                    subject,
                    studentName: student.studentName,
                    marks: student.marks,
                  });
                });
              }
            });
          }
        });
      }
    });

    return flattened;
  };

  // Apply Filters and Sorting
  useEffect(() => {
    if (!subjectMarks) return;

    let marksArray = flattenMarksData(subjectMarks);

    // Apply Search Filter
    if (searchName.trim() !== "") {
      marksArray = marksArray.filter((mark) =>
        mark.studentName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Apply Standard Filter
    if (selectedStandard !== "All") {
      marksArray = marksArray.filter(
        (mark) => String(mark.standard) === String(selectedStandard)
      );
    }

    // Apply Test Type Filter
    if (selectedTestType !== "All") {
      marksArray = marksArray.filter((mark) => mark.testType === selectedTestType);
    }

    // Apply Subject Filter
    if (selectedSubject !== "All") {
      marksArray = marksArray.filter((mark) => mark.subject === selectedSubject);
    }

    // Apply Sorting
    if (sortOption === "Ascending") {
      marksArray.sort((a, b) => a.marks - b.marks);
    } else if (sortOption === "Descending") {
      marksArray.sort((a, b) => b.marks - a.marks);
    }

    setFilteredMarks(marksArray);
    setCurrentPage(1); // Reset to first page on filter change
  }, [
    subjectMarks,
    searchName,
    selectedStandard,
    selectedTestType,
    selectedSubject,
    sortOption,
  ]);

  // Get Unique Standards and Subjects for Filters
  const uniqueStandards = useMemo(() => {
    if (!subjectMarks) return [];
    const standardsSet = new Set();
    ["mock", "live"].forEach((testType) => {
      if (subjectMarks[testType]) {
        Object.keys(subjectMarks[testType]).forEach((standard) => {
          standardsSet.add(standard);
        });
      }
    });
    return Array.from(standardsSet).sort((a, b) => a - b);
  }, [subjectMarks]);

  const uniqueSubjects = useMemo(() => {
    if (!subjectMarks) return [];
    const subjectsSet = new Set();
    ["mock", "live"].forEach((testType) => {
      if (subjectMarks[testType]) {
        Object.keys(subjectMarks[testType]).forEach((standard) => {
          if (subjectMarks[testType][standard]) {
            Object.keys(subjectMarks[testType][standard]).forEach((subject) => {
              subjectsSet.add(subject);
            });
          }
        });
      }
    });
    return Array.from(subjectsSet).sort();
  }, [subjectMarks]);

  // Pagination Logic
  const indexOfLastMark = currentPage * marksPerPage;
  const indexOfFirstMark = indexOfLastMark - marksPerPage;
  const currentMarks = filteredMarks.slice(indexOfFirstMark, indexOfLastMark);
  const totalPages = Math.ceil(filteredMarks.length / marksPerPage);

  // Toggle Filter Dropdowns
  const toggleFilterDropdown = (filter) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  // Handle Sorting Option Selection
  const handleSortOptionSelect = (option) => {
    setSortOption(option);
    setActiveFilter(null);
  };

  return (
    <section className="w-full h-auto py-5 bg-gray-100">
      <div className="w-[90%] max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">📊 Student Marks</h2>
          {/* Optional: Add a button for future features like adding new marks */}
        </div>

        {/* Filters Grid */}
        <div className="grid md:ml-8 grid-cols-1 md:grid-cols-6 gap-4 text-gray-700 font-semibold text-sm border-b pb-3 relative">
          {/* Name Filter */}
          <div className="flex items-center relative">
            <span>Name</span>
            <IoIosSearch
              className="text-gray-500 text-xl ml-2 cursor-pointer hover:text-blue-500 transition"
              onClick={() => toggleFilterDropdown("name")}
            />
            {activeFilter === "name" && (
              <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                <input
                  type="text"
                  placeholder="🔍 Search by name..."
                  value={searchName}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <IoMdCloseCircle
                  className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                  onClick={() => setActiveFilter(null)}
                />
              </div>
            )}
          </div>

          {/* Standard Filter */}
          <div className="relative md:ml-12">
            <span>Standard</span>
            <IoIosFunnel
              className="text-gray-500 text-xl ml-2 cursor-pointer hover:text-blue-500 transition"
              onClick={() => toggleFilterDropdown("standard")}
            />
            {activeFilter === "standard" && (
              <div className="absolute z-10 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                {/* All Standards Option */}
                <div
                  onClick={() => {
                    setSelectedStandard("All");
                    setActiveFilter(null);
                  }}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    selectedStandard === "All" ? "bg-gray-200" : ""
                  }`}
                >
                  <IoMdCheckmarkCircle
                    className={`inline-block mr-2 ${
                      selectedStandard === "All" ? "text-blue-500" : "text-black"
                    }`}
                  />
                  All
                </div>
                {uniqueStandards.map((standard) => (
                  <div
                    key={standard}
                    onClick={() => {
                      setSelectedStandard(standard);
                      setActiveFilter(null);
                    }}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      selectedStandard === standard ? "bg-gray-200" : ""
                    }`}
                  >
                    <IoMdCheckmarkCircle
                      className={`inline-block mr-2 ${
                        selectedStandard === standard ? "text-blue-500" : "text-black"
                      }`}
                    />
                    {standard}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test Type Filter */}
          <div className="relative">
            <span>Test Type</span>
            <IoIosFunnel
              className="text-gray-500 text-xl ml-2 cursor-pointer hover:text-blue-500 transition"
              onClick={() => toggleFilterDropdown("testType")}
            />
            {activeFilter === "testType" && (
              <div className="absolute z-10 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                {/* All Test Types Option */}
                <div
                  onClick={() => {
                    setSelectedTestType("All");
                    setActiveFilter(null);
                  }}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    selectedTestType === "All" ? "bg-gray-200" : ""
                  }`}
                >
                  <IoMdCheckmarkCircle
                    className={`inline-block mr-2 ${
                      selectedTestType === "All" ? "text-blue-500" : "text-black"
                    }`}
                  />
                  All
                </div>
                {/* Live Test */}
                <div
                  onClick={() => {
                    setSelectedTestType("Live Test");
                    setActiveFilter(null);
                  }}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    selectedTestType === "Live Test" ? "bg-gray-200" : ""
                  }`}
                >
                  <IoMdCheckmarkCircle
                    className={`inline-block mr-2 ${
                      selectedTestType === "Live Test" ? "text-blue-500" : "text-black"
                    }`}
                  />
                  Live Test
                </div>
                {/* Mock Test */}
                <div
                  onClick={() => {
                    setSelectedTestType("Mock Test");
                    setActiveFilter(null);
                  }}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    selectedTestType === "Mock Test" ? "bg-gray-200" : ""
                  }`}
                >
                  <IoMdCheckmarkCircle
                    className={`inline-block mr-2 ${
                      selectedTestType === "Mock Test" ? "text-blue-500" : "text-black"
                    }`}
                  />
                  Mock Test
                </div>
              </div>
            )}
          </div>

          {/* Subject Filter */}
          <div className="relative">
            <span>Subject</span>
            <IoIosFunnel
              className="text-gray-500 text-xl ml-2 cursor-pointer hover:text-blue-500 transition"
              onClick={() => toggleFilterDropdown("subject")}
            />
            {activeFilter === "subject" && (
              <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg overflow-auto max-h-60">
                {/* All Subjects Option */}
                <div
                  onClick={() => {
                    setSelectedSubject("All");
                    setActiveFilter(null);
                  }}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    selectedSubject === "All" ? "bg-gray-200" : ""
                  }`}
                >
                  <IoMdCheckmarkCircle
                    className={`inline-block mr-2 ${
                      selectedSubject === "All" ? "text-blue-500" : "text-black"
                    }`}
                  />
                  All
                </div>
                {uniqueSubjects.map((subject) => (
                  <div
                    key={subject}
                    onClick={() => {
                      setSelectedSubject(subject);
                      setActiveFilter(null);
                    }}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      selectedSubject === subject ? "bg-gray-200" : ""
                    }`}
                  >
                    <IoMdCheckmarkCircle
                      className={`inline-block mr-2 ${
                        selectedSubject === subject ? "text-blue-500" : "text-black"
                      }`}
                    />
                    {subject}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Marks (Sort By) Filter */}
          <div className="relative md:ml-48">
            <span>Marks</span>
            <IoIosFunnel
              className="text-gray-500 text-xl ml-2 cursor-pointer hover:text-blue-500 transition"
              onClick={() => toggleFilterDropdown("sort")}
            />
            {activeFilter === "sort" && (
              <div className="absolute z-10 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                {/* Ascending Sort Option */}
                <div
                  onClick={() => handleSortOptionSelect("Ascending")}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    sortOption === "Ascending" ? "bg-gray-200" : ""
                  }`}
                >
                  <IoMdCheckmarkCircle
                    className={`inline-block mr-2 ${
                      sortOption === "Ascending" ? "text-blue-500" : "text-black"
                    }`}
                  />
                  Ascending
                </div>
                {/* Descending Sort Option */}
                <div
                  onClick={() => handleSortOptionSelect("Descending")}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    sortOption === "Descending" ? "bg-gray-200" : ""
                  }`}
                >
                  <IoMdCheckmarkCircle
                    className={`inline-block mr-2 ${
                      sortOption === "Descending" ? "text-blue-500" : "text-black"
                    }`}
                  />
                  Descending
                </div>
              </div>
            )}
          </div>

          {/* Actions Placeholder */}
          {/* <div>
            <span>Actions</span>
          </div> */}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center my-10">
            <FaSpinner className="animate-spin text-3xl text-blue-500" />
            <span className="ml-2 text-blue-500">Loading subject marks...</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-center my-10">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Marks Table */}
        {!loading && !error && filteredMarks.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              {/* <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Student Name</th>
                  <th className="py-2 px-4 border-b">Standard</th>
                  <th className="py-2 px-4 border-b">Test Type</th>
                  <th className="py-2 px-4 border-b">Subject</th>
                  <th className="py-2 px-4 border-b">Marks</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead> */}
              <tbody>
                {currentMarks.length === 0 ? (
                  <tr>
                    <td className="py-2 px-4 border-b text-center" colSpan="6">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  currentMarks.map((mark, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-100 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="py-2 px-4 border-b">{mark.studentName}</td>
                      <td className="py-2 px-4 border-b">{mark.standard}</td>
                      <td className="py-2 px-4 border-b">{mark.testType}</td>
                      <td className="py-2 px-4 border-b">{mark.subject}</td>
                      <td className="py-2 px-4 border-b">{mark.marks}</td>
                      {/* <td className="py-2 px-4 border-b text-center">
                        <BsThreeDotsVertical className="cursor-pointer text-gray-600 hover:text-blue-500 transition" />
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* No Data Available */}
        {!loading && !error && filteredMarks.length === 0 && (
          <div className="text-gray-500 text-center my-10">
            <p>No subject marks available.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && filteredMarks.length > marksPerPage && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// Define PropTypes for type checking
StudentMarksSection.propTypes = {
  schoolName: PropTypes.string.isRequired,
};

export default StudentMarksSection;
