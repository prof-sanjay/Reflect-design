import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LoginPage from "./components/LoginPage.jsx";
import HomePage from "./components/HomePage.jsx";
import MyReflections from "./components/MyReflections.jsx";
import Profile from "./components/Profile.jsx";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login"; // hide navbar on login page

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/my-reflections" element={<MyReflections />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
