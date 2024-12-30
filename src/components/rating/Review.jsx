// pages/review.js
import { useState, useEffect } from "react";
import ReviewPopup from "../ReviewPopup/ReviewPopup";

const ReviewPage = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleActionCompletion = () => {
    // Logic after a significant user action (e.g., completing a test)
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  useEffect(() => {
    // Check if the user has already left a review or submitted feedback
    const hasLeftGoogleReview = localStorage.getItem("hasLeftGoogleReview");
    const hasSubmittedFeedback = localStorage.getItem("hasSubmittedFeedback");

    if (!hasLeftGoogleReview && !hasSubmittedFeedback) {
      // Trigger the popup after a short delay to enhance UX
      const timer = setTimeout(() => setIsPopupVisible(true), 1000); // 1-second delay
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Review Page</h1>
      <button
        onClick={handleActionCompletion}
        className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
      >
        Complete Action
      </button>

      <ReviewPopup isVisible={isPopupVisible} onClose={handleClosePopup} />
    </div>
  );
};

export default ReviewPage;
