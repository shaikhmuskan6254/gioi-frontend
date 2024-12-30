import { useState, useEffect, useRef } from 'react';
import StarRating from '../rating/StarRating';

const ReviewPopup = ({ isVisible, onClose }) => {
  const [rating, setRating] = useState(5); // Default to 5 stars
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null);

  // Prevent closing the popup by clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        // Do nothing to prevent closing
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        // Do nothing to prevent closing
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setError(null);

    if (rating >= 4) {
      // Redirect to Google Review page
      window.open(
        'https://g.page/r/CT3KgmMruLDAEAE/review', // Your direct review link
        '_blank'
      );
      onClose();
      // Set flag to prevent re-showing
      localStorage.setItem('hasLeftGoogleReview', 'true');
      setIsSubmitting(false);
    } else if (rating < 4) {
      // Store internal feedback in localStorage
      try {
        const feedback = {
          rating,
          comment: comment || '',
          timestamp: new Date().toISOString(),
        };

        // Retrieve existing feedback or initialize
        const existingFeedback = JSON.parse(localStorage.getItem('internalFeedback')) || [];
        existingFeedback.push(feedback);
        localStorage.setItem('internalFeedback', JSON.stringify(existingFeedback));

        onClose();
        localStorage.setItem('hasSubmittedFeedback', 'true');
      } catch (err) {
        console.error('Error storing feedback:', err);
        setError('Failed to submit feedback. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={popupRef}
        className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg"
        role="document"
      >
        <h2 id="review-popup-title" className="text-xl font-semibold text-center mb-4">
          How Was Your Experience?
        </h2>
        <StarRating rating={rating} setRating={setRating} />
        {rating < 4 && (
          <textarea
            className="w-full mt-4 p-2 border border-gray-300 rounded-md resize-none"
            placeholder="Please let us know how we can improve..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            aria-label="Feedback comment"
          />
        )}
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        <button
          onClick={handleSubmit}
          className={`w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors ${
            isSubmitting || !rating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting || !rating} // Disable if no rating
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        {/* Cancel button is intentionally omitted */}
      </div>
    </div>
  );
};

export default ReviewPopup;
