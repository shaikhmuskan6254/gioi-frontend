"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

const PaidInstructions = () => {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState("unpaid");


  useEffect(() => {
    const fetchPaymentStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/gio-profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { paymentStatus, testCompleted } = response.data.user;
        if (testCompleted) {
          // If test is already completed, redirect to payment for the next attempt
          setPaymentStatus("unpaid");
        } else {
          setPaymentStatus(paymentStatus || "unpaid");
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
        router.push("/login");
      }
    };

    fetchPaymentStatus();
  }, [router]);

  const handlePayNow = () => {
    router.push("/payment");
  };

  const handleStartQuiz = () => {
    router.push("/gio-event/paid-quiz");
  };


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
            🏆 GIO Paid Test Instructions
          </h2>

          {/* Exam Overview */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-[#2563EB] mb-4 flex items-center gap-2">
              1. 🖍 Exam Overview
            </h3>
            <ul className="list-disc pl-6 text-lg text-gray-600 space-y-3">
              <li>
                The paid test consists of{" "}
                <span className="font-semibold">100 questions</span> designed to
                evaluate your skills for the Global Innovation Olympiad (GIO).
              </li>
              <li>
                The test fee is <span className="font-semibold">₹250</span> per
                attempt.
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
                <span className="font-semibold">45 seconds</span> per question.
              </li>
              <li>
                <strong>📊 Scoring:</strong> Your highest score will be
                considered for ranking.
              </li>
              <li>
                <strong>🏅 Top Performers:</strong> The top 1% of participants
                will be awarded.
              </li>
            </ul>
          </div>

          {/* Window Restrictions */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-[#2563EB] mb-4 flex items-center gap-2">
              3. 🚫 Window Restrictions
            </h3>
            <ul className="list-disc pl-6 text-lg text-gray-600 space-y-3">
              <li>
                Switching windows during the test will lead to warnings and
                possible disqualification.
              </li>
              <li>
                Stay focused and avoid minimizing or navigating away from the
                test screen.
              </li>
            </ul>
          </div>

          {/* Monitoring */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-[#2563EB] mb-4 flex items-center gap-2">
              4. 👀 Monitoring
            </h3>
            <p className="text-lg text-gray-600">
              The test is monitored to ensure fairness. Ensure a
              distraction-free environment to maintain focus.
            </p>
          </div>

          {/* Certification */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-[#2563EB] mb-4 flex items-center gap-2">
              5. 🏅 Certification
            </h3>
            <p className="text-lg text-gray-600">
              All qualified participants will receive verified certificates and
              medals.
            </p>
          </div>

          {/* Additional Notes */}
          <div className="mb-10">
            <h3 className="text-2xl font-semibold text-[#2563EB] mb-4 flex items-center gap-2">
              6. 🌐 Additional Notes
            </h3>
            <ul className="list-disc pl-6 text-lg text-gray-600 space-y-3">
              <li>Ensure you have a stable internet connection.</li>
              <li>Use a laptop or desktop for the best experience.</li>
              <li>
                We recommend disabling pop-up blockers to avoid interruptions
                during the test.
              </li>
            </ul>
          </div>

          <div className="text-center mt-10">
            {paymentStatus === "unpaid" && (
              <button
                onClick={handlePayNow}
                className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-8 py-4 rounded-full shadow-md hover:scale-105 transition-transform duration-300 text-lg font-semibold"
              >
                Pay Now
              </button>
            )}

            {paymentStatus === "paid_but_not_attempted" && (
              <>
                <button
                  onClick={handleStartQuiz}
                  className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-4 rounded-full shadow-md hover:scale-105 transition-transform duration-300 text-lg font-semibold mr-5 mb-4 sm:mb-0"
                >
                  Start Paid Quiz
                </button>
                <button
                  onClick={() => router.push("/profile")}
                  className="bg-gradient-to-r from-gray-300 to-gray-500 text-white px-8 py-4 rounded-full shadow-md hover:scale-105 transition-transform duration-300 text-lg font-semibold"
                >
                  Start Quiz Later
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaidInstructions;
