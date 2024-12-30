"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaCaretDown } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state for Register/Login
  const [userRole, setUserRole] = useState(null); // User role state: "student" or "school"
  const pathname = usePathname();

  // Check user role on component mount
  useEffect(() => {
    const studentToken = localStorage.getItem("token");
    const schoolToken = localStorage.getItem("schoolToken");

    if (studentToken) {
      setUserRole("student"); // User is logged in as a student
    } else if (schoolToken) {
      setUserRole("school"); // User is logged in as a school
    } else {
      setUserRole(null); // No user is logged in
    }
  }, []);

  // Function to toggle the mobile menu
  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Function to toggle the dropdown
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("schoolToken");
    setUserRole(null); // Clear the role
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Our Story", href: "/aboutus" },
    { name: "Olympiad", href: "/olympiad" },
    { name: "Verify Certificate", href: "/verifycertificate" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="w-full px-6 lg:px-10 flex justify-between items-center h-[15vh]">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/GIOLOGO.png"
              alt="Logo"
              width={80}
              height={80}
              className="mr-3"
            />
            <h1 className="text-4xl lg:text-5xl font-extrabold text-blue-600 font-serif">
              GIO
            </h1>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xl font-semibold ${
                pathname === link.href
                  ? "text-blue-600 animate-bounce border-b-2 border-blue-600"
                  : "text-gray-800"
              } hover:text-blue-600 hover:scale-105 transition duration-300`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Buttons */}
        <div className="hidden lg:block">
          {userRole === "student" ? (
            <Link
              href="/profile"
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-lg rounded-full hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              Profile
            </Link>
          ) : userRole === "school" ? (
            <Link
              href="/dashboard"
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-lg rounded-full hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              Dashboard
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg rounded-full hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                Register/Login <FaCaretDown className="ml-2" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-14 right-0 w-52 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl shadow-2xl py-3 z-50">
                  <Link
                    href="/gio-profile"
                    onClick={toggleDropdown}
                    className="block px-5 py-3 text-lg font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:shadow-lg transition-all duration-300 rounded-md mx-2"
                  >
                    Students
                  </Link>
                  <Link
                    href="/schools"
                    onClick={toggleDropdown}
                    className="block px-5 py-3 text-lg font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:shadow-lg transition-all duration-300 rounded-md mx-2 mt-2"
                  >
                    Schools
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hamburger Menu */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-gray-800">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-md">
          <div className="flex flex-col items-center p-4 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMenu}
                className={`text-xl font-semibold ${
                  pathname === link.href
                    ? "text-blue-600 animate-bounce border-b-2 border-blue-600"
                    : "text-gray-800"
                } hover:text-blue-600 hover:scale-105 transition duration-300`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Buttons */}
            {userRole === "student" ? (
              <Link
                href="/profile"
                onClick={toggleMenu}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-lg rounded-full hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                Profile
              </Link>
            ) : userRole === "school" ? (
              <Link
                href="/dashboard"
                onClick={toggleMenu}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-lg rounded-full hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                Dashboard
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg rounded-full hover:scale-105 transition-transform duration-300 shadow-lg"
                >
                  Register/Login <FaCaretDown className="ml-2" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-14 left-0 w-52 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl shadow-2xl py-3 z-50">
                    <Link
                      href="/gio-profile"
                      onClick={toggleMenu}
                      className="block px-5 py-3 text-lg font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:shadow-lg transition-all duration-300 rounded-md mx-2"
                    >
                      Students
                    </Link>
                    <Link
                      href="/schools"
                      onClick={toggleMenu}
                      className="block px-5 py-3 text-lg font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:shadow-lg transition-all duration-300 rounded-md mx-2 mt-2"
                    >
                      Schools
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
