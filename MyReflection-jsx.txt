import React, { useState, useEffect } from "react";
import Calendar from "./Calendar.jsx";
import Navbar from "./Navbar.jsx";
import ReflectionEditor from "./ReflectionEditor.jsx";
import "./MyReflections.css";
import { uploadMedia, fetchReflections, updateReflection } from "../utils/api.js";

const MyReflections = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [moodData, setMoodData] = useState({});
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [reflectionContent, setReflectionContent] = useState("");
  const [currentMood, setCurrentMood] = useState("neutral");
  const [reflections, setReflections] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // 🟩 Mood color mapping
  const getMoodColor = (mood) => {
    const moodColors = {
      happy: "#4ade80",
      sad: "#60a5fa",
      angry: "#f87171",
      anxious: "#fbbf24",
      calm: "#a78bfa",
      excited: "#fb923c",
      neutral: "#94a3b8",
    };
    return moodColors[mood?.toLowerCase()] || "#cbd5e1";
  };

  // 🗓 Handle date selection — also triggers reflection reload
  const handleDateSelect = (dateKey) => {
    setSelectedDate(dateKey);
  };

  // 🧠 Load reflection when selectedDate changes
  useEffect(() => {
    if (!selectedDate || reflections.length === 0) return;

    const reflection = reflections.find(
      (r) => r.date.split("T")[0] === selectedDate
    );

    if (reflection) {
      console.log(`🟢 Loading reflection for ${selectedDate}:`, reflection);
      setReflectionContent(reflection.content || "");
      setCurrentMood(reflection.mood || "neutral");
    } else {
      console.log(`⚪ No reflection found for ${selectedDate}`);
      setReflectionContent("");
      setCurrentMood("neutral");
    }
  }, [selectedDate, reflections]);

  // 🔄 Load prompts & reflections on mount
  useEffect(() => {
    const storedPrompts = JSON.parse(localStorage.getItem("journalPrompts")) || [];
    setPrompts(storedPrompts);

    const loadReflections = async () => {
      try {
        const data = await fetchReflections(token);
        console.log("✅ Fetched reflections:", data);

        setReflections(data);

        // ✅ Map moods to date format YYYY-MM-DD
        const moodMap = {};
        data.forEach((entry) => {
          if (entry.date && entry.mood) {
            const formattedDate = entry.date.split("T")[0];
            moodMap[formattedDate] = entry.mood.toLowerCase();
          }
        });

        console.log("🎨 Processed mood map:", moodMap);
        setMoodData(moodMap);
      } catch (err) {
        console.error("❌ Failed to load reflections:", err);
      }
    };

    loadReflections();
  }, [token]);

  // 📤 Media upload handler
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

  // 💾 Save or update reflection
  const handleSaveReflection = async (content, mood) => {
    if (!selectedDate) {
      alert("Please select a date first!");
      return;
    }

    try {
      const response = await updateReflection({
        date: selectedDate,
        content,
        mood,
      });

      console.log("✅ Reflection saved:", response);

      // Update frontend state instantly
      setReflections((prev) => {
        const exists = prev.find((r) => r.date.split("T")[0] === selectedDate);
        if (exists) {
          return prev.map((r) =>
            r.date.split("T")[0] === selectedDate ? { ...r, content, mood } : r
          );
        }
        return [...prev, { date: selectedDate, content, mood }];
      });

      // Update mood color on calendar
      setMoodData((prev) => ({
        ...prev,
        [selectedDate]: mood.toLowerCase(),
      }));

      setCurrentMood(mood.toLowerCase());
      alert("✅ Reflection & mood saved!");
    } catch (err) {
      console.error("❌ Failed to save reflection:", err);
      alert("Failed to save reflection.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="my-reflections">
        <div className="reflections-layout">
          {/* 🗓 Calendar & Prompts */}
          <div className="calendar-section">
            <Calendar
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              moodData={moodData}
              getMoodColor={getMoodColor}
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

          {/* ✍️ Reflection Editor + Media Upload */}
          <div className="reflection-editor-section">
            <ReflectionEditor
              key={selectedDate} // ✅ forces re-render on date change
              selectedDate={selectedDate}
              mediaFiles={uploadedMedia}
              onSave={handleSaveReflection}
              currentMood={currentMood}
              reflectionContent={reflectionContent}
              setReflectionContent={setReflectionContent}
              setCurrentMood={setCurrentMood}
            />

            <div className="media-upload">
              <h3>Attach Media</h3>
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleFileChange}
              />

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

              {uploadedMedia.length > 0 && (
                <div className="uploaded-media">
                  <h4>Uploaded Media</h4>
                  <div className="uploaded-grid">
                    {uploadedMedia.map((file, index) => (
                      <div key={index}>
                        {file.path.endsWith(".mp4") ? (
                          <video
                            src={`http://localhost:5000${file.path}`}
                            width="180"
                            controls
                          />
                        ) : file.path.endsWith(".mp3") ? (
                          <audio src={`http://localhost:5000${file.path}`} controls />
                        ) : (
                          <img
                            src={`http://localhost:5000${file.path}`}
                            alt={file.originalname}
                            width="120"
                          />
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
