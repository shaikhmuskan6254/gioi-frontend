import React from "react";
import Link from "next/link";
import { motion } from "framer-motion"; // Properly import motion from framer-motion

const Instructions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E3F2FD] to-white flex items-center justify-center px-6 py-10">
      <div className="max-w-4xl w-full bg-white p-10 rounded-lg shadow-lg relative">
        {/* Decorative Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] rounded-full blur-3xl z-0"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] rounded-full blur-3xl z-0"
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <h2 className="text-center text-4xl font-bold text-[#2563EB] mb-8">
            📚 GIO Mock Test Instructions
          </h2>

          {/* Exam Overview */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-[#2563EB] mb-4 flex items-center gap-2">
              1. 🖍 Exam Overview
            </h3>
            <ul className="list-disc pl-6 text-lg text-gray-600 space-y-3">
              <li>
                The mock test consists of{" "}
                <span className="font-semibold">25 questions</span> designed to
                help you prepare for the Global Innovation Olympiad (GIO).
              </li>
              <li>
                This test is{" "}
                <span className="font-semibold">free of charge</span> and is
                intended for practice purposes only.
              </li>
              <li>
                Each question is formatted as a{" "}
                <span className="font-semibold">
                  multiple-choice question (MCQ)
                </span>{" "}
                with four options to choose from.
              </li>
            </ul>
          </div>

          {/* Exam Rules */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-[#2563EB] mb-4 flex items-center gap-2">
              2. ⚖️ Exam Rules
            </h3>
            <ul className="list-disc pl-6 text-lg text-gray-600 space-y-3">
              <li>
                <strong>Marking Scheme:</strong> +4 marks for correct answers,
                -1 mark for incorrect answers. ❗
              </li>
              <li>
                <strong>⏰ Time Limit:</strong> You will have{" "}
                <span className="font-semibold">45 seconds</span> per question
                to complete your responses.
              </li>
              <li>
                <strong>📊 Score Tracking:</strong> Your highest score will be
                recorded and compared to your previous attempts.
              </li>
            </ul>
          </div>

          {/* Window Restrictions */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-[#2563EB] mb-4 flex items-center gap-2">
              3. 🚫 Window Restrictions
            </h3>
            <p className="text-lg text-gray-600">
              While this is a practice test, we encourage you to simulate the
              exam environment. Try to stay focused and avoid navigating away
              from the test screen.
            </p>
          </div>

          {/* Monitoring */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-[#2563EB] mb-4 flex items-center gap-2">
              4. 👀 Monitoring
            </h3>
            <p className="text-lg text-gray-600">
              Ensure that you are in a distraction-free environment to mimic the
              real testing conditions and maintain focus throughout the test.
            </p>
          </div>

          {/* Additional Notes */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-[#2563EB] mb-4 flex items-center gap-2">
              5. 🌐 Additional Notes
            </h3>
            <ul className="list-disc pl-6 text-lg text-gray-600 space-y-3">
              <li>Ensure you have a stable internet connection.</li>
              <li>Use a desktop or laptop for the best experience.</li>
              <li>
                We recommend disabling pop-up blockers to avoid interruptions
                during the test.
              </li>
            </ul>
          </div>

          {/* Start Mock Test Button */}
          <div className="text-center">
            <Link href="/gio-event/quiz">
              <span className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-8 py-4 rounded-full shadow-md hover:scale-105 transition-transform duration-300 inline-block text-lg font-semibold">
                Start Mock Test
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
