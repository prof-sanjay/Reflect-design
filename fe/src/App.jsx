import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LoginPage from "./components/LoginPage.jsx";
import HomePage from "./components/HomePage.jsx";
import MyReflections from "./components/MyReflections.jsx";

function App() {
  return (
    <>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/my-reflections" element={<MyReflections />} />

        {/* Optional: redirect root ("/") to home or login */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
