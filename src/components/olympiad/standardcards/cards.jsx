// import { useState } from "react";
// import { motion } from "framer-motion";
// import { FaBookOpen } from "react-icons/fa";

// const standardsData = [
//   {
//     title: "Standard 5",
//     pdfLink: "/pdf/5.pdf",
//     roman: "V",
//     icon: <FaBookOpen />,
//   },
//   {
//     title: "Standard 6",
//     pdfLink: "/pdf/6.pdf",
//     roman: "VI",
//     icon: <FaBookOpen />,
//   },
//   {
//     title: "Standard 7",
//     pdfLink: "/pdf/7.pdf",
//     roman: "VII",
//     icon: <FaBookOpen />,
//   },
//   {
//     title: "Standard 8",
//     pdfLink: "/pdf/8.pdf",
//     roman: "VIII",
//     icon: <FaBookOpen />,
//   },
//   {
//     title: "Standard 9",
//     pdfLink: "/pdf/9.pdf",
//     roman: "IX",
//     icon: <FaBookOpen />,
//   },
//   {
//     title: "Standard 10",
//     pdfLink: "/pdf/10.pdf",
//     roman: "X",
//     icon: <FaBookOpen />,
//   },
// ];

// const Cards = () => {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [selectedStandard, setSelectedStandard] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     number: "",
//     role: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async () => {
//     const { name, email, number, role } = formData;

//     if (!name || !email || !number || !role) {
//       alert("Please fill all the fields before submitting.");
//       return;
//     }

//     const selectedPdf = standardsData.find(
//       (standard) => standard.title === selectedStandard
//     )?.pdfLink;

//     // Backend POST request
//     try {
//       await fetch("https://your-backend-url/api/submit", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...formData, standard: selectedStandard }),
//       });
//     } catch (error) {
//       console.error("Error submitting form data:", error);
//       alert("Error submitting your data. Please try again.");
//       return;
//     }

//     // Open PDF after successful submission
//     if (selectedPdf) {
//       window.open(selectedPdf, "_blank");
//     }

//     // Close modal and reset form
//     setIsPopupOpen(false);
//     setFormData({ name: "", email: "", number: "", role: "" });
//   };

//   const closeModal = () => {
//     setIsPopupOpen(false);
//     setFormData({ name: "", email: "", number: "", role: "" });
//   };

//   return (
//     <div className="p-8">
//       {/* Title */}
//       <h1 className="text-4xl font-bold text-center text-black mb-4">
//         Syllabus & <span className="text-blue-600">Preparation</span>
//       </h1>
//       <p className="text-lg text-center text-gray-700 mt-4 mb-8">
//         We provide a detailed syllabus for each subject to help students prepare
//         effectively. Our resources include
//       </p>

//       {/* Cards Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {standardsData.map((standard, index) => {
//           const isBlue = index % 2 === 0; // Blue for even indices, white for odd
//           return (
//             <div
//               key={index}
//               className={`flex flex-col items-center justify-center h-48 w-full rounded-xl cursor-pointer transition duration-300 transform hover:-translate-y-3 hover:scale-105 shadow-lg hover:shadow-2xl ${
//                 isBlue
//                   ? "bg-blue-500 text-white hover:bg-blue-600"
//                   : "bg-white text-blue-500 hover:bg-gray-100"
//               }`}
//               onClick={() => {
//                 setSelectedStandard(standard.title);
//                 setIsPopupOpen(true);
//               }}
//             >
//               {/* Icon */}
//               <div
//                 className={`text-5xl mb-4 animate-pulse ${
//                   isBlue ? "text-white" : "text-blue-500"
//                 }`}
//               >
//                 {standard.icon}
//               </div>

//               {/* Roman Number Icon */}
//               <div
//                 className={`text-3xl font-bold mb-2 ${
//                   isBlue ? "text-white" : "text-blue-500"
//                 }`}
//               >
//                 {standard.roman}
//               </div>

//               {/* Standard Title */}
//               <p
//                 className={`text-lg font-semibold text-center ${
//                   isBlue ? "text-white" : "text-blue-500"
//                 }`}
//               >
//                 {standard.title}
//               </p>
//             </div>
//           );
//         })}
//       </div>

//       {/* Popup Modal */}
//       {isPopupOpen && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.8 }}
//           className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//         >
//           <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl flex">
//             {/* Left Side Image */}
//             <div className="w-1/2 bg-blue-100 rounded-l-xl flex items-center justify-center">
//               <img
//                 src="/homeabout.png"
//                 alt="Form Illustration"
//                 className="w-3/4 h-auto rounded-lg"
//               />
//             </div>

//             {/* Right Side Form */}
//             <div className="w-1/2 p-6">
//               <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
//                 Enter Your Details
//               </h2>
//               <form className="space-y-4">
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   placeholder="Name"
//                   className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Email"
//                   className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="text"
//                   name="number"
//                   value={formData.number}
//                   onChange={handleInputChange}
//                   placeholder="Phone Number"
//                   className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select Role</option>
//                   <option value="Teacher">Teacher</option>
//                   <option value="Student">Student</option>
//                   <option value="Parent">Parent</option>
//                 </select>
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
//                 >
//                   Submit
//                 </button>
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="w-full bg-gray-300 text-gray-700 p-3 rounded-md hover:bg-gray-400 transition"
//                 >
//                   Close
//                 </button>
//               </form>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default Cards;

import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";

const standardsData = [
  {
    title: "Standard 5",
    pdfLink: "/pdf/5.pdf",
    roman: "V",
    icon: <FaBookOpen />,
  },
  {
    title: "Standard 6",
    pdfLink: "/pdf/6.pdf",
    roman: "VI",
    icon: <FaBookOpen />,
  },
  {
    title: "Standard 7",
    pdfLink: "/pdf/7.pdf",
    roman: "VII",
    icon: <FaBookOpen />,
  },
  {
    title: "Standard 8",
    pdfLink: "/pdf/8.pdf",
    roman: "VIII",
    icon: <FaBookOpen />,
  },
  {
    title: "Standard 9",
    pdfLink: "/pdf/9.pdf",
    roman: "IX",
    icon: <FaBookOpen />,
  },
  {
    title: "Standard 10",
    pdfLink: "/pdf/10.pdf",
    roman: "X",
    icon: <FaBookOpen />,
  },
];

const Cards = () => {
  return (
    <div className="p-8">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-black mb-4">
        Syllabus & <span className="text-blue-600">Preparation</span>
      </h1>
      <p className="text-lg text-center text-gray-700 mt-4 mb-8">
        We provide a detailed syllabus for each subject to help students prepare
        effectively. Our resources include
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {standardsData.map((standard, index) => {
          const isBlue = index % 2 === 0; // Blue for even indices, white for odd
          return (
            <div
              key={index}
              className={`flex flex-col items-center justify-center h-48 w-full rounded-xl cursor-pointer transition duration-300 transform hover:-translate-y-3 hover:scale-105 shadow-lg hover:shadow-2xl ${
                isBlue
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-white text-blue-500 hover:bg-gray-100"
              }`}
              onClick={() => {
                window.open(standard.pdfLink, "_blank");
              }}
            >
              {/* Icon */}
              <div
                className={`text-5xl mb-4 animate-pulse ${
                  isBlue ? "text-white" : "text-blue-500"
                }`}
              >
                {standard.icon}
              </div>

              {/* Roman Number Icon */}
              <div
                className={`text-3xl font-bold mb-2 ${
                  isBlue ? "text-white" : "text-blue-500"
                }`}
              >
                {standard.roman}
              </div>

              {/* Standard Title */}
              <p
                className={`text-lg font-semibold text-center ${
                  isBlue ? "text-white" : "text-blue-500"
                }`}
              >
                {standard.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cards;

