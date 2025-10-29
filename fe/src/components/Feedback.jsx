import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import "./Feedback.css";

const Feedback = () => {
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comments) {
      alert("Please select a rating and write your comments!");
      return;
    }

    console.log("Feedback submitted:", { rating, comments });
    alert("Thank you for your valuable feedback!");
    setRating("");
    setComments("");
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
            onChange={(e) => setComments(e.target.value)}
            placeholder="Write your feedback here..."
          />

          <button type="submit" className="submit-btn">
            🚀 Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
