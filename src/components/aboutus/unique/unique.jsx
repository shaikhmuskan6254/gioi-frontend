import React from "react";
import {
  FaBrain,
  FaGlobe,
  FaChartLine,
  FaFileAlt,
  FaAward,
  FaLaptop,
  FaRecycle,
  FaMedal,
  FaUsers,
  FaTrophy,
  FaUser,
  FaRocket,
  FaLightbulb,
  FaBookOpen,
} from "react-icons/fa";

const cardData = [
  {
    title: "AI-Powered Learning",
    content:
      "AI-powered learning enhances education with personalized and adaptive experiences.",
    color: "text-green-500",
    icon: <FaBrain className="text-5xl text-green-500 mb-6 animate-bounce" />,
  },
  {
    title: "Global Participation",
    content:
      "Over 40 lakh students from 10+ countries participate, fostering diversity and competition.",
    color: "text-blue-500",
    icon: <FaGlobe className="text-5xl text-blue-500 mb-6 animate-bounce" />,
  },
  {
    title: "Focus on Skill Development",
    content:
      "We build skills in critical thinking, time management, and creative problem-solving.",
    color: "text-green-500",
    icon: <FaChartLine className="text-5xl text-green-500 mb-6 animate-bounce" />,
  },
  {
    title: "Free Mock Tests",
    content: "Unlimited mock tests for better preparation!",
    color: "text-blue-500",
    icon: <FaFileAlt className="text-5xl text-blue-500 mb-6 animate-bounce" />,
  },
  {
    title: "10 Lakhs+ Practice Questions",
    content: "Ensuring students are well prepared for any challenge.",
    color: "text-green-500",
    icon: <FaAward className="text-5xl text-green-500 mb-6 animate-bounce" />,
  },
  {
    title: "Proven Success Record",
    content: "5.17 Lakhs students participated overall in 2024.",
    color: "text-blue-500",
    icon: <FaMedal className="text-5xl text-blue-500 mb-6 animate-bounce" />,
  },
  {
    title: "Online Flexibility",
    content: "Allowing students to participate from anywhere.",
    color: "text-green-500",
    icon: <FaLaptop className="text-5xl text-green-500 mb-6 animate-bounce" />,
  },
  {
    title: "Motivational Awards",
    content: "Special recognition for students who show remarkable improvement.",
    color: "text-blue-500",
    icon: <FaMedal className="text-5xl text-blue-500 mb-6 animate-bounce" />,
  },
  {
    title: "Sustainable Learning",
    content:
      "Fully digital exam system that reduces paper usage, promoting an eco-friendly approach.",
    color: "text-green-500",
    icon: <FaRecycle className="text-5xl text-green-500 mb-6 animate-bounce" />,
  },
  {
    title: "Instant Global Ranking",
    content: "See your performance worldwide in real-time.",
    color: "text-blue-500",
    icon: <FaTrophy className="text-5xl text-blue-500 mb-6 animate-bounce" />,
  },
  {
    title: "Unique Student Profile",
    content:
      "Every student gets a personalized profile to showcase their achievements and progress.",
    color: "text-green-500",
    icon: <FaUser className="text-5xl text-green-500 mb-6 animate-bounce" />,
  },
  {
    title: "Open to All Boards",
    content: "Students from any board can join and compete.",
    color: "text-blue-500",
    icon: <FaUsers className="text-5xl text-blue-500 mb-6 animate-bounce" />,
  },
  // New cards
  {
    title: "Unmatched Global Reach",
    content: "Inspires millions of people.",
    color: "text-green-500",
    icon: <FaRocket className="text-5xl text-green-500 mb-6 animate-bounce" />,
  },
  {
    title: "Empowering Young Minds",
    content: "Shaping future excellence.",
    color: "text-blue-500",
    icon: <FaLightbulb className="text-5xl text-blue-500 mb-6 animate-bounce" />,
  },
  {
    title: "Free Subject Booklets",
    content: "Knowledge at no cost.",
    color: "text-green-500",
    icon: <FaBookOpen className="text-5xl text-green-500 mb-6 animate-bounce" />,
  },
];

const Unique = () => {
  return (
    <div className="p-8 md:p-16 bg-white text-center">
      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12">
        The <span className="text-blue-600">Difference</span> We Make
      </h2>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-between p-8 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl animate-fadeIn"
          >
            {card.icon}
            <h3
              className={`text-2xl font-bold mb-4 text-center ${card.color}`}
            >
              {card.title}
            </h3>
            <p className="text-lg text-gray-700 text-center">{card.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Unique;
