import React, { useState, useEffect } from "react";
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

  const [prompts, setPrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    dob: "",
  });

  // Load Profile + Prompts from DB
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name || "",
            alias: data.alias || "",
            phone: data.phone || "",
            gender: data.gender || "",
            dob: data.dob || "",
            starSign: data.starSign || "",
          });
          setPrompts(data.prompts || []);
        }
      } catch (err) {
        console.log("Profile fetch error", err);
      }
    };

    fetchProfile();
  }, []);

  // --------------------- Prompt Actions ----------------------

  const handleAddPrompt = () => {
    if (!newPrompt.trim()) return;
    setPrompts([...prompts, newPrompt.trim()]);
    setNewPrompt("");
  };

  const handleEditPrompt = (index) => {
    setEditIndex(index);
    setEditText(prompts[index]);
  };

  const handleSaveEdit = (index) => {
    const updated = [...prompts];
    updated[index] = editText.trim();
    setPrompts(updated);
    setEditIndex(null);
    setEditText("");
  };

  const handleDeletePrompt = (index) => {
    setPrompts(prompts.filter((_, i) => i !== index));
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditText("");
  };

  // ------------------------ Validation ------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const regex = /^[A-Za-z ]{2,}$/;
      setErrors((prev) => ({
        ...prev,
        name: regex.test(value) ? "" : "Enter a valid name",
      }));
    }

    if (name === "phone") {
      const regex = /^[0-9]{10}$/;
      setErrors((prev) => ({
        ...prev,
        phone:
          value.length === 0 || regex.test(value)
            ? ""
            : "Phone must be 10 digits",
      }));
    }

    if (name === "dob") {
      const today = new Date();
      const min = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
      const max = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
      const selected = new Date(value);

      setErrors((prev) => ({
        ...prev,
        dob:
          selected < min || selected > max
            ? "DOB must be between 5 and 120 years ago"
            : "",
      }));
    }

    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // ------------------------ Save Profile ------------------------

  const handleSave = async (e) => {
    e.preventDefault();

    if (errors.name || errors.phone || errors.dob) {
      alert("Fix errors before saving");
      return;
    }

    if (!profile.name || !profile.phone || !profile.gender || !profile.dob) {
      alert("Fill all required fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...profile,
          prompts: prompts,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Profile saved successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.log("Save error", err);
      alert("Server error");
    }
  };

  // DOB min/max
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
            <input type="text" name="name" value={profile.name} onChange={handleChange} required />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* Alias */}
          <div className="form-group">
            <label>Alias</label>
            <input type="text" name="alias" value={profile.alias} onChange={handleChange} />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={profile.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* DOB */}
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dob" value={profile.dob} onChange={handleChange} min={minDate} max={maxDate} required />
            {errors.dob && <p className="error-text">{errors.dob}</p>}
          </div>

          {/* Star Sign */}
          <div className="form-group">
            <label>Star Sign</label>
            <select name="starSign" value={profile.starSign} onChange={handleChange}>
              <option value="">Select Star Sign</option>
              {["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="save-btn">Save Profile</button>
        </form>

        {/* Prompts Section */}
        <div className="prompts-section">
          <h2 className="prompts-title">My Journal Prompts</h2>

          <div className="prompt-input">
            <input type="text" placeholder="Add prompt..." value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} />
            <button onClick={handleAddPrompt}>Add</button>
          </div>

          <ul className="prompt-list">
            {prompts.map((prompt, index) => (
              <li key={index} className="prompt-item">
                {editIndex === index ? (
                  <>
                    <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                    <button onClick={() => handleSaveEdit(index)}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span>{prompt}</span>
                    <div className="prompt-actions">
                      <button onClick={() => handleEditPrompt(index)}>✏️</button>
                      <button onClick={() => handleDeletePrompt(index)}>🗑️</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Profile;
