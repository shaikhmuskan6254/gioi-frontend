import React from "react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-10">
      <div className="max-w-4xl w-full bg-[#F9FAFB] p-8 rounded-lg shadow-md">
        {/* Header */}
        <h2 className="text-center text-3xl font-extrabold text-[#2563EB] mb-6">
          📚 GIO Mock Test Instructions
        </h2>

        {/* Exam Overview */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-[#2563EB] mb-4">
            1. 🖍 Exam Overview
          </h3>
          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>
              The mock test consists of 25 questions designed to help you
              prepare for the Global Innovation Olympiad (GIO).
            </li>
            <li>
              This test is free of charge and is intended for practice purposes
              only.
            </li>
            <li>
              Each question is formatted as a multiple-choice question (MCQ)
              with four options to choose from.
            </li>
          </ul>
        </div>

        {/* Exam Rules */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-[#2563EB] mb-4">
            2. ⚖️ Exam Rules
          </h3>
          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
            <li>
              <strong>Marking Scheme:</strong> +4 marks for correct answers, -1
              mark for incorrect answers. ❗
            </li>
            <li>
              <strong>⏰ Time Limit:</strong> You will have 45 seconds per
              question to complete your responses.
            </li>
            <li>
              <strong>📊 Score Tracking:</strong> Your highest score will be
              recorded and compared to your previous attempts.
            </li>
          </ul>
        </div>

        {/* Window Restrictions */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-[#2563EB] mb-4">
            3. 🚫 Window Restrictions
          </h3>
          <p className="text-lg text-gray-700">
            While this is a practice test, we encourage you to simulate the exam
            environment. Try to stay focused and avoid navigating away from the
            test screen.
          </p>
        </div>

        {/* Monitoring */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-[#2563EB] mb-4">
            4. 👀 Monitoring
          </h3>
          <p className="text-lg text-gray-700">
            Ensure that you are in a distraction-free environment to mimic the
            real testing conditions and maintain focus throughout the test.
          </p>
        </div>

        {/* Additional Notes */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-[#2563EB] mb-4">
            5. 🌐 Additional Notes
          </h3>
          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-2">
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
            <span className="bg-[#2563EB] text-white px-6 py-3 rounded-md shadow-md text-lg font-semibold hover:bg-[#1D4ED8] transition duration-300">
              Start Mock Test
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
