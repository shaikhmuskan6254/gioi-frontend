"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
// ✅ Import your mock distributions (with keys like "5th", "6th"...).
import { mockQuestionDistributions } from "@/utils/QuestionDistribution";

// A helper to map your distribution's lowercased keys to the backend’s capitalized subjects
const subjectMapping = {
  english: "English",
  mathematics: "Mathematics",
  Mental_ability: "Mental_ability",
  science: "Science",
  social_science: "Social_Science",
};

const Quiz = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPaused, setIsPaused] = useState(false);
  const [warning, setWarning] = useState(false);

  // --------------------------------------------------------------------------------
  // 1. handleNext => move to next question or submit
  // --------------------------------------------------------------------------------
  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(45); // Reset timer for each new question
    } else {
      handleSubmit(); // last question => submit
    }
  }, [currentQuestion, questions.length]);

  // --------------------------------------------------------------------------------
  // 2. Fullscreen + Window Switching Detection
  // --------------------------------------------------------------------------------
  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.error("Failed to enter full-screen mode:", err);
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

  // --------------------------------------------------------------------------------
  // 3. Fetch user profile + Build Questions from Mock Distribution
  // --------------------------------------------------------------------------------
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not logged in.");
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

        if (!response.ok) {
          throw new Error("Failed to fetch user profile.");
        }

        const data = await response.json();
        setUserProfile(data.user);

        // Example: userProfile.standard => "9th"
        const standard = data.user.standard;
        if (!standard) {
          throw new Error("No standard found in user profile.");
        }

        // 1) find distribution for that standard
        const distribution = mockQuestionDistributions[standard]?.subjects;
        if (!distribution) {
          throw new Error(`No question distribution found for standard: ${standard}`);
        }

        // 2) fetch the correct # of questions for each subject
        const allQuestions = [];
        for (const [subject, count] of Object.entries(distribution)) {
          const fetchUrl = `/questions/${standard}/${standard}_${subject}.json`;
          const res = await fetch(fetchUrl);
          if (!res.ok) {
            console.warn(`Failed to fetch questions for subject: ${subject}`);
            continue;
          }
          const subjectQuestions = await res.json();

          // Map the subject to capitalized for backend
          const capitalizedSub = subjectMapping[subject] || subject; // fallback if missing

          const questionsWithSub = subjectQuestions.map((q) => ({
            ...q,
            subject: capitalizedSub, 
          }));

          // pick 'count' random ones
          const selected = questionsWithSub
            .sort(() => 0.5 - Math.random())
            .slice(0, count);

          allQuestions.push(...selected);
        }

        // 3) shuffle entire question list
        const finalQuestions = allQuestions.sort(() => 0.5 - Math.random());
        setQuestions(finalQuestions);
        setSelectedAnswers(Array(finalQuestions.length).fill(null));
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchUserProfile();
  }, []);

  // --------------------------------------------------------------------------------
  // 4. Timer logic
  // --------------------------------------------------------------------------------
  useEffect(() => {
    if (timeLeft > 0 && !isPaused) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNext();
    }
  }, [timeLeft, isPaused, handleNext]);

  // --------------------------------------------------------------------------------
  // 5. handleAnswer => store user’s chosen answer
  // --------------------------------------------------------------------------------
  const handleAnswer = (answer) => {
    const updated = [...selectedAnswers];
    updated[currentQuestion] = answer;
    setSelectedAnswers(updated);
  };

  // --------------------------------------------------------------------------------
  // 6. handleSubmit => compute overall + send to backend
  // --------------------------------------------------------------------------------
  const handleSubmit = async () => {
    // Quick overall score for user feedback (optional)
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        score += 4;
      } else if (selectedAnswers[idx]) {
        score -= 1;
      }
    });
    if (score < 0) score = 0;

    const total = questions.length * 4;
    const percentage = ((score / total) * 100).toFixed(0);

    // Build payload
    const resultData = {
      score,
      total,
      percentage,
      questions,         // Must have subject: "English" etc. now
      selectedAnswers,
      type: "mock",
      timestamp: Date.now(),
    };

    localStorage.setItem("quizResult", JSON.stringify(resultData));

    // Attempt to save to backend
    await saveMockResults(score, total);

    // Then redirect or do whatever
    router.push("/gio-event/results");
  };

  // Send to backend
  const saveMockResults = async (score, total) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token in localStorage; user not logged in.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/gio/save-quiz-marks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            score,
            total,
            type: "mock",
            questions,         // same array with capitalized .subject
            selectedAnswers,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save mock test results.");
      }
    } catch (err) {
      console.error("Error saving mock test results:", err);
    }
  };

  // --------------------------------------------------------------------------------
  // 7. Render
  // --------------------------------------------------------------------------------
  if (error) {
    return <p>Error: {error}</p>;
  }
  if (!userProfile) {
    return <p>Loading profile...</p>;
  }
  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8 px-4">
      {/* Warning Modal */}
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
                GLOBAL INNOVATOR OLYMPIAD (Mock)
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
          <div className="flex items-center mt-2 sm:mt-0">
            <span className="text-2xl text-[#FF2D55] font-semibold">
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
    </div>
  );
};

export default Quiz;
