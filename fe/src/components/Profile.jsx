import React, { useState } from "react";
import "./Profile.css";
import Navbar from "./Navbar.jsx";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    alias: "",
    phone: "",
    gender: "",
    dob: "",
    starSign: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    dob: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate name (only letters and spaces, min 2 letters)
    if (name === "name") {
      const nameRegex = /^[A-Za-z ]{2,}$/;
      if (!nameRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          name: "Name should contain only letters and spaces (min 2 characters).",
        }));
      } else {
        setErrors((prev) => ({ ...prev, name: "" }));
      }
    }

    // Validate phone (only 10 digits)
    if (name === "phone") {
      const phoneRegex = /^[0-9]{0,10}$/;
      if (!/^[0-9]*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone number should contain only digits.",
        }));
      } else if (value.length > 10) {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone number cannot exceed 10 digits.",
        }));
      } else if (value.length < 10 && value.length > 0) {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone number must be exactly 10 digits.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
    }

    // Validate date of birth (between 5 and 120 years ago)
    if (name === "dob") {
      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 120,
        today.getMonth(),
        today.getDate()
      );
      const maxDate = new Date(
        today.getFullYear() - 5,
        today.getMonth(),
        today.getDate()
      );
      const selectedDate = new Date(value);

      if (selectedDate < minDate || selectedDate > maxDate) {
        setErrors((prev) => ({
          ...prev,
          dob: "Date of Birth must be between 5 and 120 years ago.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, dob: "" }));
      }
    }

    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Final validation before saving
    if (errors.name || errors.phone || errors.dob) {
      alert("Please fix validation errors before saving.");
      return;
    }

    if (
      !profile.name ||
      !profile.phone ||
      !profile.gender ||
      !profile.dob
    ) {
      alert("Please fill all required fields.");
      return;
    }

    localStorage.setItem("reflectProfile", JSON.stringify(profile));
    alert("Profile saved successfully!");
  };

  // For DOB input restriction (min & max date)
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];
  const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h1 className="profile-title">My Profile</h1>

        <form className="profile-form" onSubmit={handleSave}>
          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* Alias */}
          <div className="form-group">
            <label>Alias</label>
            <input
              type="text"
              name="alias"
              value={profile.alias}
              onChange={handleChange}
              placeholder="Enter your alias"
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* DOB */}
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={profile.dob}
              onChange={handleChange}
              min={minDate}
              max={maxDate}
              required
            />
            {errors.dob && <p className="error-text">{errors.dob}</p>}
          </div>

          {/* Star Sign */}
          <div className="form-group">
            <label>Star Sign</label>
            <select
              name="starSign"
              value={profile.starSign}
              onChange={handleChange}
            >
              <option value="">Select Star Sign</option>
              <option value="Aries">Aries</option>
              <option value="Taurus">Taurus</option>
              <option value="Gemini">Gemini</option>
              <option value="Cancer">Cancer</option>
              <option value="Leo">Leo</option>
              <option value="Virgo">Virgo</option>
              <option value="Libra">Libra</option>
              <option value="Scorpio">Scorpio</option>
              <option value="Sagittarius">Sagittarius</option>
              <option value="Capricorn">Capricorn</option>
              <option value="Aquarius">Aquarius</option>
              <option value="Pisces">Pisces</option>
            </select>
          </div>

          {/* Save Button */}
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};

export default Profile;
