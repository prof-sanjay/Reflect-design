// fe/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Signup';
import Dashboard from './pages/HabitTracker';
import Analytics from './pages/Analytics';
import WellnessForm from './pages/WellnessForm';
import Reflection from './pages/ReflectionPage';

import UserProfile from './pages/UserProfile';
import TherapistProfile from './pages/TherapistProfile';
import AdminDashboard from './pages/AdminDashboard';
import TherapistBooking from './pages/TherapistBooking';

import ImprovedGoals from './components/ImprovedGoals';
import Feedback from './components/Feedback';
import Settings from './components/Settings';

import './styles/App.css';

function App() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="App" data-theme={theme}>
          
          {/* Navbar */}
          <Navbar 
            onFeedbackClick={() => setShowFeedback(true)} 
            onSettingsClick={() => setShowSettings(true)}
          />

          {/* Feedback Modal */}
          {showFeedback && <Feedback onClose={() => setShowFeedback(false)} />}

          {/* Settings Modal */}
          {showSettings && (
            <Settings 
              onClose={() => setShowSettings(false)} 
              theme={theme} 
              setTheme={setTheme} 
            />
          )}

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/habits" element={<Dashboard />} />

            <Route path="/goals" element={<ImprovedGoals />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/wellness" element={<WellnessForm />} />
            <Route path="/reflection" element={<Reflection />} />
            <Route path="/therapist-booking" element={<TherapistBooking />} />

            {/* USER & THERAPIST PROFILES */}
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/therapist/profile" element={<TherapistProfile />} />

            {/* ADMIN */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
