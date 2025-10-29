import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import "./Feedback.css";

const Feedback = () => {
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleCommentsChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
    setComments(text);
    setWordCount(words.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comments) {
      alert("Please select a rating and write your comments!");
      return;
    }

    const words = comments.trim().split(/\s+/);
    if (words.length > 100) {
      alert("Your feedback exceeds 100 words. Please shorten it.");
      return;
    }

    console.log("Feedback submitted:", { rating, comments });
    alert("Thank you for your valuable feedback!");
    setRating("");
    setComments("");
    setWordCount(0);
  };

  return (
    <div className="feedback-page">
      <Navbar />

      <div className="feedback-container">
        <h2 className="feedback-title">💬 Share Your Feedback</h2>
        <p className="feedback-subtitle">
          Tell us how your journaling experience has been.
        </p>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <label>Rate your experience</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="">Select rating</option>
            <option value="5">🌟🌟🌟🌟🌟 Excellent</option>
            <option value="4">🌟🌟🌟🌟 Good</option>
            <option value="3">🌟🌟🌟 Average</option>
            <option value="2">🌟🌟 Poor</option>
            <option value="1">🌟 Very Poor</option>
          </select>

          <label>Your Comments</label>
          <textarea
            value={comments}
            onChange={handleCommentsChange}
            placeholder="Write your feedback here (max 50 words)..."
          />

          <p
            className={`word-count ${
              wordCount > 100 ? "limit-exceeded" : ""
            }`}
          >
            {wordCount}/50 words
          </p>

          <button
            type="submit"
            className="submit-btn"
            disabled={wordCount > 50}
          >
            🚀 Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
