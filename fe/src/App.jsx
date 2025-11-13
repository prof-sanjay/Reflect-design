import React from "react";
import { Routes, Route } from "react-router-dom";

// 🔓 Public Page
import LoginPage from "./components/LoginPage.jsx";

// 🔐 Protected Pages
import HomePage from "./components/HomePage.jsx";
import MyReflections from "./components/MyReflections.jsx";
import NewReflection from "./components/NewReflection.jsx";
import ReportFilter from "./components/ReportFilter.jsx";
import PersonalWellnessForm from "./components/PersonalWellnessForm.jsx";
import MentalInsights from "./components/MentalInsights.jsx";

import TodoList from "./components/TodoList.jsx";
import Goals from "./components/Goals.jsx";
import Feedback from "./components/Feedback.jsx";
import Profile from "./components/Profile.jsx";
import Settings from "./components/Settings.jsx";

// 🔒 Route Protection Wrapper
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* ================================
          PUBLIC ROUTES 
      ================================= */}
      <Route path="/" element={<LoginPage />} />

      {/* ================================
          PROTECTED ROUTES 
      ================================= */}

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-reflections"
        element={
          <ProtectedRoute>
            <MyReflections />
          </ProtectedRoute>
        }
      />

      <Route
        path="/new-reflection"
        element={
          <ProtectedRoute>
            <NewReflection />
          </ProtectedRoute>
        }
      />

      <Route
        path="/viewreport"
        element={
          <ProtectedRoute>
            <ReportFilter />
          </ProtectedRoute>
        }
      />

      {/* ⭐ Mental Health Visualization Dashboard */}
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <MentalInsights />
          </ProtectedRoute>
        }
      />

      {/* Productivity */}
      <Route
        path="/to-do-list"
        element={
          <ProtectedRoute>
            <TodoList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        }
      />

      {/* User Settings */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Wellness */}
      <Route
        path="/personal-wellness"
        element={
          <ProtectedRoute>
            <PersonalWellnessForm />
          </ProtectedRoute>
        }
      />

      {/* Feedback */}
      <Route
        path="/feedback"
        element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        }
      />

      {/* ================================
          404 NOT FOUND PAGE
      ================================= */}
      <Route
        path="*"
        element={
          <h2
            style={{
              textAlign: "center",
              marginTop: "2rem",
              color: "red",
              fontWeight: "bold",
            }}
          >
            404 - Page Not Found
          </h2>
        }
      />
    </Routes>
  );
}

export default App;
