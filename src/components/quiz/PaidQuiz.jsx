"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { liveQuestionDistributions } from "@/utils/QuestionDis2"; 
// Or wherever your live distribution is stored

// We do the same subjectMapping approach
const subjectMapping = {
  english: "English",
  mathematics: "Mathematics",
  Mental_ability: "Mental_ability",
  science: "Science",
  social_science: "Social_Science",
};

const PaidQuiz = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPaused, setIsPaused] = useState(false);
  const [warning, setWarning] = useState(false);
  const [subjectMarks, setSubjectMarks] = useState(null);

  // 1) Next question
  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(45);
    } else {
      handleSubmit();
    }
  }, [currentQuestion, questions.length]);

  // 2) Fullscreen + warnings
  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.error("Failed to enter full-screen:", err);
      });
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setWarning(true);
        setIsPaused(true);
        handleNext();
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setWarning(true);
        setIsPaused(true);
        handleNext();
      }
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleNext]);

  // 3) Payment Status + Profile
  useEffect(() => {
    const validateUserAccess = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/gio-event/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/gio-profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch user profile.");

        const data = await response.json();
        const { paymentStatus, testCompleted } = data.user;
        if (paymentStatus !== "paid_but_not_attempted") {
          router.push("/payment");
        } else if (testCompleted) {
          router.push("/gio-event/results");
        } else {
          setUserProfile(data.user);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
        router.push("/gio-event/login");
      }
    };
    validateUserAccess();
  }, [router]);

  // 4) Build questions from live distribution
  useEffect(() => {
    if (!userProfile) return;

    const fetchQuestions = async () => {
      try {
        const standard = userProfile.standard; // e.g. "10th"
        const distributionObj = liveQuestionDistributions[standard];
        if (!distributionObj) {
          throw new Error(`No distribution found for standard: ${standard}`);
        }

        const distribution = distributionObj.subjects; 
        const allQuestions = [];
        const totalQuestions = 100;
        let remaining = totalQuestions;

        for (const [subject, percentage] of Object.entries(distribution)) {
          const subjectCount = Math.floor((percentage / 100) * totalQuestions);
          const fetchUrl = `/questions/${standard}/${standard}_${subject}.json`;
          const res = await fetch(fetchUrl);
          if (!res.ok) {
            console.warn(`Failed to fetch questions for ${subject}`);
            continue;
          }
          const subQs = await res.json();
          // Map subject => capitalized for backend
          const capitalizedSub = subjectMapping[subject] || subject;
          const subQsWithSubject = subQs.map((q) => ({
            ...q,
            subject: capitalizedSub,
          }));

          const picked = subQsWithSubject
            .sort(() => 0.5 - Math.random())
            .slice(0, subjectCount);
          allQuestions.push(...picked);
          remaining -= subjectCount;
        }

        if (remaining > 0 && allQuestions.length > 0) {
          const extra = allQuestions
            .sort(() => 0.5 - Math.random())
            .slice(0, remaining);
          allQuestions.push(...extra);
        }

        const finalSet = allQuestions.sort(() => 0.5 - Math.random());
        setQuestions(finalSet);
        setSelectedAnswers(Array(finalSet.length).fill(null));
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchQuestions();
  }, [userProfile]);

  // 5) Timer
  useEffect(() => {
    if (timeLeft > 0 && !isPaused) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNext();
    }
  }, [timeLeft, isPaused, handleNext]);

  // 6) handleAnswer
  const handleAnswer = (ans) => {
    const updated = [...selectedAnswers];
    updated[currentQuestion] = ans;
    setSelectedAnswers(updated);
  };

  // A quick subject scoring function if you want local display
  const calculateSubjectMarks = (questions, selectedAnswers) => {
    const subjectScores = {
      English: 0,
      Mathematics: 0,
      Mental_ability: 0,
      Science: 0,
      Social_Science: 0,
    };
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        subjectScores[q.subject] = (subjectScores[q.subject] || 0) + 4;
      } else if (selectedAnswers[idx]) {
        subjectScores[q.subject] = (subjectScores[q.subject] || 0) - 1;
        if (subjectScores[q.subject] < 0) subjectScores[q.subject] = 0;
      }
    });
    return subjectScores;
  };

  // 7) handleSubmit => store + call backend
  const handleSubmit = async () => {
    // local calculation
    const subMarks = calculateSubjectMarks(questions, selectedAnswers);
    const totalScore = Object.values(subMarks).reduce((a, b) => a + b, 0);
    const maxTotal = questions.length * 4;
    const percentageScore = ((totalScore / maxTotal) * 100).toFixed(2);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found, please login.");

      // local store
      const liveQuizResult = {
        score: totalScore,
        total: maxTotal,
        percentage: percentageScore,
        subjectScores: subMarks,
        type: "live",
        timestamp: Date.now(),
      };
      localStorage.setItem("paidQuizResult", JSON.stringify(liveQuizResult));

      // update payment => 'unpaid'
      const payResp = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/update-payment-status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentStatus: "unpaid" }),
        }
      );
      if (!payResp.ok) {
        const eResp = await payResp.json();
        throw new Error(`Failed to update payment status: ${JSON.stringify(eResp)}`);
      }

      // call save-quiz-marks
      const saveResp = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/save-quiz-marks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score: totalScore,
            total: maxTotal,
            type: "live",
            questions,
            selectedAnswers,
          }),
        }
      );
      if (!saveResp.ok) {
        const eData = await saveResp.json();
        throw new Error(`Failed to save live quiz marks: ${JSON.stringify(eData)}`);
      }
      const saved = await saveResp.json();
      console.log("Live Quiz Results Saved =>", saved);

      if (saved.certificateCode) {
        alert(`Congrats! Certificate Code: ${saved.certificateCode}`);
      }

      setSubjectMarks(subMarks);
      router.push(`/gio-event/results`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // 8) Render
  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }
  if (!userProfile) {
    return <p>Loading profile...</p>;
  }
  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8 px-4">
      {warning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-500">Warning!</h2>
            <p className="text-gray-700 mb-4">
              Please return to the quiz to continue.
            </p>
            <button
              onClick={() => {
                setWarning(false);
                setIsPaused(false);
                enterFullScreen();
              }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Continue Quiz
            </button>
          </div>
        </div>
      )}

      {/* Quiz Header */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-md shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <Image
              src="/GIOLOGO.png"
              alt="QUIZ LOGO"
              width={48}
              height={48}
              className="h-12 w-12 mr-4"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2563EB]">
                GLOBAL INNOVATOR OLYMPIAD (Live)
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Innovator: {userProfile?.name || "User"}
              </p>
              {userProfile?.schoolName && (
                <p className="text-sm text-gray-600 mt-1">
                  School: {userProfile.schoolName}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-[#FF2D55] font-semibold text-xl">
              {timeLeft}s
            </span>
          </div>
        </div>
        <motion.div className="relative w-full h-4 mt-4 rounded-full bg-gray-300 overflow-hidden shadow-md">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: `${(timeLeft / 45) * 100}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300"
          />
        </motion.div>
      </div>

      {/* Current Question */}
      <div className="w-full max-w-4xl mt-6 bg-white p-6 rounded-md shadow-md">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <p className="mt-4 text-gray-700">
            {questions[currentQuestion].question}
          </p>
          <ul className="mt-6 space-y-4">
            {questions[currentQuestion].options.map((option, i) => (
              <li
                key={i}
                onClick={() => handleAnswer(option)}
                className={`p-4 rounded-md border cursor-pointer transition-colors duration-200 ${
                  selectedAnswers[currentQuestion] === option
                    ? "bg-[#2563EB] text-white"
                    : "bg-white hover:bg-[#D6E9FF] hover:text-[#2563EB]"
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Next
          </button>
          {currentQuestion === questions.length - 1 && (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-md bg-[#FF2D55] hover:bg-[#E11D48] text-white"
            >
              Submit
            </button>
          )}
        </div>
      </div>

      {/* Example: Display subject-wise if you want */}
      {subjectMarks && (
        <div className="w-full max-w-4xl mt-6 bg-white p-6 rounded-md shadow-md">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Your Subject-wise Marks (Local Calc)
          </h3>
          <ul className="space-y-2">
            {Object.entries(subjectMarks).map(([sub, val]) => (
              <li key={sub} className="flex justify-between items-center">
                <span className="text-gray-700">{sub}:</span>
                <span className="font-semibold">{val}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PaidQuiz;
