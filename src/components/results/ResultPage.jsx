"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

const Results = () => {
  const router = useRouter();
  const [score, setScore] = useState(null);
  const [total, setTotal] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [progress, setProgress] = useState(0);
  const [quizType, setQuizType] = useState(null);

  useEffect(() => {
    // Retrieve both quiz results from localStorage
    const mockQuizResult = JSON.parse(
      localStorage.getItem("quizResult") || "{}"
    );
    const paidQuizResult = JSON.parse(
      localStorage.getItem("paidQuizResult") || "{}"
    );

    // Get timestamps
    const mockTimestamp = mockQuizResult.timestamp || 0;
    const paidTimestamp = paidQuizResult.timestamp || 0;

    // Determine the latest test based on the timestamp
    const latestQuiz =
      mockTimestamp > paidTimestamp ? mockQuizResult : paidQuizResult;

    if (!latestQuiz || !latestQuiz.type) {
      return; // No quiz data found
    }

    setQuizType(latestQuiz.type);
    setScore(latestQuiz.score || 0);
    setTotal(latestQuiz.total || 0);
    setQuestions(latestQuiz.questions || []);
    setSelectedAnswers(latestQuiz.selectedAnswers || []);

    // Simulate progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < latestQuiz.score) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const downloadPDF = () => {
    const organization = "Global Innovator Olympiad";
    const motivationalTagline =
      (score / total) * 100 >= 90
        ? "Outstanding Performance! Keep up the fantastic work!"
        : (score / total) * 100 >= 75
        ? "Great Job! You're on the path to success!"
        : (score / total) * 100 >= 50
        ? "Good Effort! Keep pushing for greatness!"
        : "Don't give up! Every step is a step forward.";
  
    const doc = new jsPDF();
  
    const firstPageImg = new Image();
    firstPageImg.src = "/resultpage.jpg"; // First page background
  
    const secondPageImg = new Image();
    secondPageImg.src = "/resultsndpage.jpg"; // Second page background
  
    firstPageImg.onload = () => {
      // First Page
      doc.addImage(firstPageImg, "JPEG", 0, 0, 210, 297);
  
      // Add Score and Motivational Tagline
      doc.setFontSize(26);
      doc.setTextColor(0, 51, 102);
      doc.setFont("helvetica", "bold");
      doc.text(`Your Score: ${score} / ${total}`, 105, 130, { align: "center" });
  
      doc.setFontSize(18);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Percentage: ${((score / total) * 100).toFixed(2)}%`,
        105,
        145,
        { align: "center" }
      );
  
      doc.setFontSize(16);
      doc.setTextColor(0, 102, 0);
      doc.setFont("times", "italic");
      doc.text(motivationalTagline, 105, 165, { align: "center" });
  
      // Add "Question Analysis" Title Below
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Question Analysis", 105, 190, { align: "center" });
  
      let yPosition = 200; // Start of Question Analysis
  
      const addNewPage = () => {
        doc.addPage();
        doc.addImage(secondPageImg, "JPEG", 0, 0, 210, 297);
        yPosition = 30; // Reset position for new page
      };
  
      // Load Second Page Background and Start Plotting Content
      secondPageImg.onload = () => {
        questions.forEach((question, index) => {
          // Check if content exceeds page height
          if (yPosition > 270) addNewPage();
  
          // Question
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
          doc.text(`Q${index + 1}: ${question.question}`, 20, yPosition);
          yPosition += 10;
  
          // Correct Answer
          doc.setTextColor(34, 139, 34); // Green
          doc.text(`Correct Answer: ${question.answer}`, 30, yPosition);
          yPosition += 10;
  
          // User Answer
          const userAnswer = selectedAnswers[index] || "Not Answered";
          const isCorrect = userAnswer === question.answer;
          doc.setTextColor(
            isCorrect ? 34 : 220,
            isCorrect ? 139 : 20,
            isCorrect ? 34 : 60
          ); // Green for correct, Red for incorrect
          doc.text(`Your Answer: ${userAnswer}`, 30, yPosition);
          yPosition += 15; // Extra spacing
        });
  
        // Save the PDF
        doc.save("quiz-results.pdf");
      };
  
      secondPageImg.onerror = () => {
        console.error("Error loading the second page background image.");
      };
    };
  
    firstPageImg.onerror = () => {
      console.error("Error loading the first page background image.");
    };
  };
  

  if (score === null || total === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading results...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E3F2FD] to-white flex flex-col items-center py-10 px-6 ">
      {/* Progress Section */}
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-[#2563EB] mb-8">
          {quizType === "mock" ? "Mock Test Results" : "Paid Test Results"}
        </h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center text-gray-700 mb-4">
            Score: <span className="text-[#2563EB]">{progress}%</span>
          </h2>
          <div className="relative w-full bg-gray-300 rounded-lg h-8 overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${(progress / total) * 100}%` }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300"
            ></motion.div>
          </div>
          <p className="mt-6 text-center text-gray-600">
            You scored <span className="font-semibold">{score}</span> out of{" "}
            <span className="font-semibold">{total}</span>
          </p>
        </div>
      </div>

      {/* Question Analysis */}
      <div className="w-full max-w-4xl mt-10 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-[#2563EB] mb-6 text-center">
          Question Analysis
        </h2>
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div
              key={index}
              className="p-6 rounded-lg shadow-md bg-gradient-to-r from-white via-[#F3F4F6] to-[#E3F2FD]"
            >
              <h3 className="font-semibold text-gray-800 mb-3">
                Q{index + 1}. {question.question}
              </h3>
              <div className="mt-2 flex flex-col space-y-2">
                <p
                  className={`p-3 rounded-md font-medium ${
                    selectedAnswers[index] === question.answer
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <span className="font-semibold">Your Answer:</span>{" "}
                  {selectedAnswers[index] || (
                    <span className="text-gray-500 italic">Not Answered</span>
                  )}
                </p>
                <p className="p-3 rounded-md bg-blue-100 text-blue-600">
                  <span className="font-semibold">Correct Answer:</span>{" "}
                  {question.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download PDF Button */}
      <button
        onClick={downloadPDF}
        className="px-6 py-3 bg-[#4CAF50] text-white rounded-lg shadow mt-8 hover:bg-[#45A049] transition transform hover:scale-105"
      >
        Download Results as PDF
      </button>

      {/* Action Buttons */}
      <div className="flex space-x-6 mt-10">
        <button
          onClick={() =>
            quizType === "mock"
              ? router.push("/gio-event/quiz")
              : router.push("/gio-event/paid-quiz")
          }
          className="px-6 py-3 bg-[#2563EB] text-white rounded-lg shadow hover:bg-[#1D4ED8] transition transform hover:scale-105"
        >
          Try Again
        </button>
        <button
          onClick={() => router.push("/profile")}
          className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition transform hover:scale-105"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default Results;
