import React, { useState, useEffect } from "react";
import Calendar from "./Calendar.jsx";
import Navbar from "./Navbar.jsx";
import ReflectionEditor from "./ReflectionEditor.jsx";
import "./MyReflections.css";
import { uploadMedia } from "../utils/api.js";

const MyReflections = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [moodData, setMoodData] = useState({
    "2025-10-01": "happy",
    "2025-10-05": "sad",
    "2025-10-08": "calm",
    "2025-10-15": "excited",
    "2025-10-20": "anxious",
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadedMedia, setUploadedMedia] = useState([]); // ✅ For backend previews

  const handleDateSelect = (dateKey) => setSelectedDate(dateKey);

  useEffect(() => {
    const storedPrompts = JSON.parse(localStorage.getItem("journalPrompts")) || [];
    setPrompts(storedPrompts);
  }, []);

  // 📤 Handle media upload
  const handleFileChange = async (e) => {
    if (!selectedDate) {
      alert("Please select a date before uploading media!");
      return;
    }

    const files = Array.from(e.target.files);
    setMediaFiles(files);

    const formData = new FormData();
    files.forEach((file) => formData.append("media", file));
    formData.append("date", selectedDate);

    try {
      const response = await uploadMedia(formData);
      setUploadedMedia(response.files || []);
      alert("✅ Media uploaded successfully!");
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Failed to upload media. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="my-reflections">
        <div className="reflections-layout">
          {/* 🗓 Left — Calendar + Prompts */}
          <div className="calendar-section">
            <Calendar
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              moodData={moodData}
            />

            <div className="prompts-section">
              <h2 className="prompts-heading">Prompts</h2>
              <ul className="prompts-list">
                {prompts.length > 0 ? (
                  prompts.map((prompt, index) => (
                    <li key={index} className="prompt-item">
                      - {prompt}
                    </li>
                  ))
                ) : (
                  <li className="prompt-item">
                    No prompts available. Add some in your profile!
                  </li>
                )}
              </ul>
              <p className="goals-text">Did you check your goals?</p>
            </div>
          </div>

          {/* ✍️ Right — Reflection Editor + Media Upload */}
          <div className="reflection-editor-section">
            <ReflectionEditor selectedDate={selectedDate} mediaFiles={uploadedMedia} />

            {/* 📸 Media Upload Section */}
            <div className="media-upload">
              <h3>Attach Media</h3>
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleFileChange}
              />

              {/* 🖼 Preview before upload */}
              <div className="media-preview">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="preview-item">
                    {file.type.startsWith("image/") && (
                      <img src={URL.createObjectURL(file)} alt="preview" width="120" />
                    )}
                    {file.type.startsWith("video/") && (
                      <video src={URL.createObjectURL(file)} width="180" controls />
                    )}
                    {file.type.startsWith("audio/") && (
                      <audio src={URL.createObjectURL(file)} controls />
                    )}
                  </div>
                ))}
              </div>

              {/* ✅ Uploaded media preview from backend */}
              {uploadedMedia.length > 0 && (
                <div className="uploaded-media">
                  <h4>Uploaded Media</h4>
                  <div className="uploaded-grid">
                    {uploadedMedia.map((file, index) => (
                      <div key={index}>
                        {file.path.endsWith(".mp4") ? (
                          <video src={`http://localhost:5000${file.path}`} width="180" controls />
                        ) : file.path.endsWith(".mp3") ? (
                          <audio src={`http://localhost:5000${file.path}`} controls />
                        ) : (
                          <img src={`http://localhost:5000${file.path}`} alt={file.originalname} width="120" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyReflections;
