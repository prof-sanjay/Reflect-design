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

  // ⭐ NOW STORED AS A MAP (hash table)
  const [reflections, setReflections] = useState({});
  const [token] = useState(localStorage.getItem("token") || "");

  // Mood Color Mapping
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

  // Handle date selection
  const handleDateSelect = (dateKey) => {
    setSelectedDate(dateKey);
  };

  /* ==========================================================
     LOAD REFLECTIONS ON MOUNT → Convert to MAP
  ========================================================== */
  useEffect(() => {
    const storedPrompts = JSON.parse(localStorage.getItem("journalPrompts")) || [];
    setPrompts(storedPrompts);

    const loadReflections = async () => {
      try {
        const data = await fetchReflections(token);

        // Convert array → map { "2025-02-10": {content, mood} }
        const reflectionMap = {};
        const moodMap = {};

        data.forEach((entry) => {
          const dateKey = entry.date.split("T")[0];

          reflectionMap[dateKey] = {
            content: entry.content || "",
            mood: entry.mood || "neutral",
            media: entry.media || [],
          };

          moodMap[dateKey] = entry.mood?.toLowerCase() || "neutral";
        });

        setReflections(reflectionMap);
        setMoodData(moodMap);

        console.log("Reflections Loaded:", reflectionMap);
      } catch (err) {
        console.error("Failed to load reflections:", err);
      }
    };

    loadReflections();
  }, [token]);

  /* ==========================================================
     WHEN SELECTED DATE CHANGES → Load its reflection instantly
  ========================================================== */
  useEffect(() => {
    if (!selectedDate) return;

    const entry = reflections[selectedDate];

    if (entry) {
      setReflectionContent(entry.content);
      setCurrentMood(entry.mood);
      setUploadedMedia(entry.media || []);
    } else {
      setReflectionContent("");
      setCurrentMood("neutral");
      setUploadedMedia([]);
    }
  }, [selectedDate, reflections]);

  /* ==========================================================
     SAVE / UPDATE REFLECTION
  ========================================================== */
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

      console.log("Saved reflection:", response);

      // Instantly update UI (no refresh required)
      setReflections((prev) => ({
        ...prev,
        [selectedDate]: {
          content,
          mood,
          media: prev[selectedDate]?.media || [],
        },
      }));

      setMoodData((prev) => ({
        ...prev,
        [selectedDate]: mood.toLowerCase(),
      }));

      setCurrentMood(mood.toLowerCase());

      alert("Reflection saved!");
    } catch (err) {
      console.error("Failed to save reflection:", err);
      alert("Failed to save reflection.");
    }
  };

  /* ==========================================================
     MEDIA UPLOAD
  ========================================================== */
  const handleFileChange = async (e) => {
    if (!selectedDate) {
      alert("Select a date before uploading media!");
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

      // Sync with reflections map
      setReflections((prev) => ({
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          media: response.files,
        },
      }));

      alert("Media uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="my-reflections">
        <div className="reflections-layout">

          {/* Calendar Section */}
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
                  <li>No prompts available.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Reflection Editor */}
          <div className="reflection-editor-section">
            <ReflectionEditor
              key={selectedDate}
              selectedDate={selectedDate}
              mediaFiles={uploadedMedia}
              onSave={handleSaveReflection}
              currentMood={currentMood}
              reflectionContent={reflectionContent}
              setReflectionContent={setReflectionContent}
              setCurrentMood={setCurrentMood}
            />

            {/* Media Upload Section */}
            <div className="media-upload">
              <h3>Attach Media</h3>
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleFileChange}
              />

              {/* Selected Media Preview */}
              <div className="media-preview">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="preview-item">
                    {file.type.startsWith("image/") && (
                      <img src={URL.createObjectURL(file)} width="120" />
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

              {/* Uploaded Media */}
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
                          <img src={`http://localhost:5000${file.path}`} width="120" />
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
