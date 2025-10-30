import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// ✅ Import all pages/components
import LoginPage from "./components/LoginPage.jsx";
import HomePage from "./components/HomePage.jsx";
import MyReflections from "./components/MyReflections.jsx";
import ReportFilter from "./components/ReportFilter.jsx";
import Profile from "./components/Profile.jsx";
import NewReflection from "./components/NewReflection.jsx";
import Settings from "./components/Settings.jsx";
import TodoList from "./components/TodoList.jsx";
import Goals from "./components/Goals.jsx";
import Feedback from "./components/Feedback.jsx";
import PersonalWellnessForm from "./components/PersonalWellnessForm.jsx";

function App() {
  const location = useLocation();

  // ✅ Hide navbar on login page (optional usage later)
  const hideNavbar = location.pathname === "/" || location.pathname === "/login";

  return (
    <>
      <Routes>
        {/* 🔐 Authentication */}
        <Route path="/" element={<LoginPage />} />

        {/* 🏠 Main App Pages */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/my-reflections" element={<MyReflections />} />
        <Route path="/new-reflection" element={<NewReflection />} />
        <Route path="/viewreport" element={<ReportFilter />} />

        {/* 🧠 Productivity & Goals */}
        <Route path="/to-do-list" element={<TodoList />} />
        <Route path="/goals" element={<Goals />} />

        {/* 🧍 Profile & Settings */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* 🧘 Wellness & Feedback */}
        <Route path="/personal-wellness" element={<PersonalWellnessForm />} />
        <Route path="/feedback" element={<Feedback />} />

        {/* 🧩 Test route (for debugging) */}
        <Route
          path="/test"
          element={<h1 style={{ color: "black" }}>✅ Routing Works!</h1>}
        />

        {/* 🚫 Catch-all route (optional for 404s) */}
        <Route
          path="*"
          element={<h2 style={{ color: "red", textAlign: "center" }}>404 - Page Not Found</h2>}
        />
      </Routes>
    </>
  );
}

export default App;
