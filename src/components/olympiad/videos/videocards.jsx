// "use client";
// import React from "react";
// import { FaBook } from "react-icons/fa"; // Importing preparation icon

// const pdfData = [
//   { title: "Standard 5", pdfLink: "/pdf/standard-5.pdf" },
//   { title: "Standard 6", pdfLink: "/pdf/standard-6.pdf" },
//   { title: "Standard 7", pdfLink: "/pdf/standard-7.pdf" },
//   { title: "Standard 8", pdfLink: "/pdf/standard-8.pdf" },
//   { title: "Standard 9", pdfLink: "/pdf/standard-9.pdf" },
//   { title: "Standard 10", pdfLink: "/pdf/standard-10.pdf" },
// ];

// const VideoCards = () => {
//   return (
//     <div className="p-8">
//       {/* Title */}
//       <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
//         Preparation For <span className="text-blue-600">GIO</span>
//       </h2>

//       {/* Cards Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {pdfData.map((pdf, index) => (
//           <a
//             key={index}
//             href={pdf.pdfLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-green-500 text-white rounded-lg shadow-lg transition-transform transform hover:rotate-3 hover:scale-105 hover:shadow-2xl"
//           >
//             {/* Preparation Icon */}
//             <FaBook className="text-6xl mb-4 animate-spin-slow" />
//             <h3 className="text-xl font-bold">{pdf.title}</h3>
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VideoCards;
