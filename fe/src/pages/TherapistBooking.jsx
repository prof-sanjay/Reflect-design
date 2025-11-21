// fe/src/pages/TherapistBooking.jsx
import React, { useState, useEffect } from "react";
import apiClient from "../utils/api"; // Use the centralized API client
import "../styles/TherapistBooking.css";

const TherapistBooking = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [therapists, setTherapists] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterRating, setFilterRating] = useState(0);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    notes: "",
  });
  const [reviewData, setReviewData] = useState({
    rating: 5,
    review: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTherapists();
    if (activeTab === "bookings") {
      loadMyBookings();
    }
  }, [activeTab]);

  const loadTherapists = async () => {
    try {
      const response = await apiClient.get("/api/therapist/list");
      setTherapists(response.data);
    } catch (error) {
      console.error("Failed to load therapists:", error);
    }
  };

  const loadMyBookings = async () => {
    try {
      const response = await apiClient.get("/api/bookings/my-bookings");
      setMyBookings(response.data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post(
        "/api/bookings",
        {
          therapistId: selectedTherapist._id,
          date: bookingData.date,
          time: bookingData.time,
          notes: bookingData.notes,
        }
      );

      alert("Appointment booked successfully!");
      setShowBookingModal(false);
      setBookingData({ date: "", time: "", notes: "" });
      loadMyBookings();
    } catch (error) {
      console.error("Failed to book appointment:", error);
      alert(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post(
        `/api/therapist/${selectedTherapist._id}/review`,
        reviewData
      );

      alert("Review submitted successfully!");
      setShowReviewModal(false);
      setReviewData({ rating: 5, review: "" });
      loadTherapists();
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort therapists
  const filteredTherapists = therapists
    .filter((therapist) => {
      const matchesSearch =
        therapist.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        therapist.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        therapist.address?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRating = therapist.averageRating >= filterRating;
      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return (b.averageRating || 0) - (a.averageRating || 0);
      } else if (sortBy === "price-low") {
        return (a.pricePerSession || 0) - (b.pricePerSession || 0);
      } else if (sortBy === "price-high") {
        return (b.pricePerSession || 0) - (a.pricePerSession || 0);
      }
      return 0;
    });

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "star filled" : "star"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="therapist-booking-page">
      <div className="booking-container">
        <h1>🧑‍⚕️ Find Your Therapist</h1>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "browse" ? "active" : ""}`}
            onClick={() => setActiveTab("browse")}
          >
            Browse Therapists
          </button>
          <button
            className={`tab ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            My Bookings
          </button>
        </div>

        {/* Browse Therapists Tab */}
        {activeTab === "browse" && (
          <>
            {/* Search and Filters */}
            <div className="filters-section">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search by name, specialization, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-controls">
                <div className="filter-group">
                  <label>Sort By:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="rating">Highest Rating</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Minimum Rating:</label>
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(Number(e.target.value))}
                  >
                    <option value="0">All Ratings</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Therapist List */}
            <div className="therapist-grid">
              {filteredTherapists.length === 0 ? (
                <div className="no-results">
                  <p>No therapists found matching your criteria.</p>
                </div>
              ) : (
                filteredTherapists.map((therapist) => (
                  <div key={therapist._id} className="therapist-card">
                    <div className="therapist-header">
                      <div className="therapist-avatar">
                        {therapist.username?.charAt(0).toUpperCase() || "T"}
                      </div>
                      <div className="therapist-info">
                        <h3>{therapist.username || "Therapist"}</h3>
                        <p className="specialization">
                          {therapist.specialization || "General Counseling"}
                        </p>
                        <div className="rating-display">
                          {renderStars(Math.round(therapist.averageRating || 0))}
                          <span className="rating-text">
                            {(therapist.averageRating || 0).toFixed(1)} ({therapist.totalReviews || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="therapist-details">
                      <p className="bio">{therapist.bio || "Experienced therapist dedicated to helping you achieve mental wellness."}</p>
                      
                      <div className="detail-item">
                        <span className="icon">📍</span>
                        <span>{therapist.address || "Location not specified"}</span>
                      </div>

                      <div className="detail-item">
                        <span className="icon">💰</span>
                        <span className="price">${therapist.pricePerSession || 50}/session</span>
                      </div>

                      <div className="detail-item">
                        <span className="icon">📅</span>
                        <span>{therapist.availability || "Available on request"}</span>
                      </div>
                    </div>

                    <div className="therapist-actions">
                      <button
                        className="btn-book"
                        onClick={() => {
                          setSelectedTherapist(therapist);
                          setShowBookingModal(true);
                        }}
                      >
                        Book Appointment
                      </button>
                      <button
                        className="btn-review"
                        onClick={() => {
                          setSelectedTherapist(therapist);
                          setShowReviewModal(true);
                        }}
                      >
                        Write Review
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* My Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bookings-list">
            {myBookings.length === 0 ? (
              <div className="no-bookings">
                <p>You don't have any bookings yet.</p>
              </div>
            ) : (
              myBookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-info">
                    <h3>{booking.therapist?.username || "Therapist"}</h3>
                    <p>📅 {new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                    <p>📝 {booking.notes || "No notes"}</p>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status || "pending"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Book Appointment with {selectedTherapist?.username}</h2>
            <form onSubmit={handleBookAppointment}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, date: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={bookingData.time}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, time: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, notes: e.target.value })
                  }
                  placeholder="Anything you'd like the therapist to know..."
                  rows="3"
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Booking..." : "Confirm Booking"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowBookingModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Review {selectedTherapist?.username}</h2>
            <form onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label>Rating</label>
                <div className="star-rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star-input ${star <= reviewData.rating ? "filled" : ""}`}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={reviewData.review}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, review: e.target.value })
                  }
                  placeholder="Share your experience..."
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowReviewModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistBooking;
