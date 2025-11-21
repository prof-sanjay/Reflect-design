import React, { useState } from 'react';
import '../styles/Feedback.css';

const Feedback = ({ onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('Feedback submitted:', feedback);
    setSubmitted(true);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setFeedback('');
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="feedback-overlay">
      <div className="feedback-modal">
        <div className="feedback-header">
          <h2>Send Feedback</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        {submitted ? (
          <div className="success-message">
            Thank you for your feedback! We'll review it shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label htmlFor="feedback">Your Feedback:</label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think, report issues, or suggest improvements..."
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Send Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;