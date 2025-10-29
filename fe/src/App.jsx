import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./components/LoginPage.jsx";
import HomePage from "./components/HomePage.jsx";
import MyReflections from "./components/MyReflections.jsx";
import ReportFilter from "./components/ReportFilter.jsx"
import Profile from "./components/Profile.jsx";
import NewReflection from "./components/NewReflection.jsx";
import Settings from "./components/Settings.jsx";
import TodoList from "./components/TodoList.jsx";
import Goals from "./components/Goals.jsx";
import Feedback from "./components/Feedback.jsx";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login"; // hide navbar on login page

  return (
    <>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/my-reflections" element={<MyReflections />} />
        <Route path="/viewreport" element={<ReportFilter/>}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/new-reflection" element={<NewReflection />} />
        <Route path="/to-do-list" element={<TodoList/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/goals" element={<Goals/>}/>
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </>
  );
}

export default App;
