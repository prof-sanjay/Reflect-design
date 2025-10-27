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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("reflectProfile", JSON.stringify(profile));
    alert("Profile saved successfully!");
  };

  return (
    <>
    <Navbar/>
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
            type="number"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
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
            required
          />
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
