// ✅ Media upload function (your existing one)

import axios from "axios";

export const getReflectionByDate = (date) => {
  return axios.get(`/api/reflections/${date}`);
};

export const saveReflection = (data) => {
  return axios.post("/api/reflections", data);
};


export const uploadMedia = async (formData) => {
  try {
    const res = await fetch("http://localhost:5000/api/media/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    return await res.json();
  } catch (error) {
    console.error("Error uploading media:", error);
    throw error;
  }
};

// ✅ Fetch moods from backend (NEW)
export const fetchMoods = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/moods");
    if (!res.ok) throw new Error("Failed to fetch moods");
    return await res.json();
  } catch (error) {
    console.error("Error fetching moods:", error);
    throw error;
  }
};

// ✅ Save or update a mood (optional helper)
export const saveMood = async (date, mood) => {
  try {
    const res = await fetch("http://localhost:5000/api/moods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, mood }),
    });

    if (!res.ok) throw new Error("Failed to save mood");
    return await res.json();
  } catch (error) {
    console.error("Error saving mood:", error);
    throw error;
  }
};

export const fetchReflections = async (token) => {
  try {
    const res = await fetch("http://localhost:5000/api/reflections", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch reflections");
    return await res.json();
  } catch (error) {
    console.error("Error fetching reflections:", error);
    throw error;
  }
};

export const updateReflection = async (data) => {
  try {
    const res = await fetch("http://localhost:5000/api/reflections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // add token if needed
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save reflection");
    return await res.json();
  } catch (error) {
    console.error("Error saving reflection:", error);
    throw error;
  }
};