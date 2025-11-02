import React from "react";
import { Routes, Route } from "react-router-dom";

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

// ✅ Import ProtectedRoute wrapper
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Public route - Login */}
      <Route path="/" element={<LoginPage />} />

      {/* Protected routes */}
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

      <Route
        path="/personal-wellness"
        element={
          <ProtectedRoute>
            <PersonalWellnessForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/feedback"
        element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        }
      />

      {/* Fallback route for unknown paths */}
      <Route
        path="*"
        element={
          <h2 style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
            404 - Page Not Found
          </h2>
        }
      />
    </Routes>
  );
}

export default App;
