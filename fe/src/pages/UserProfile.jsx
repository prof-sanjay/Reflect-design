import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profile/me`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setProfile(res.data.user);
      } catch (err) {
        console.error("User profile load error:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <p><b>Username:</b> {profile.username}</p>
      <p><b>Email:</b> {profile.email || "Not added"}</p>
      <p><b>Role:</b> {profile.role}</p>
    </div>
  );
};

export default UserProfile;
