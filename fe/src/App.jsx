import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LoginPage from "./components/LoginPage.jsx";
import HomePage from "./components/HomePage.jsx";
import MyReflections from "./components/MyReflections.jsx";
import Profile from "./components/Profile.jsx";
import NewReflection from "./components/NewReflection.jsx";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login"; // hide navbar on login page

  return (
    <>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/my-reflections" element={<MyReflections />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home/newreflection" element={<NewReflection />} />
      </Routes>
    </>
  );
}

export default App;
