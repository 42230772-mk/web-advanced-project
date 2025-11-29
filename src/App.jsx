import React, { useState } from "react";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [currentRole, setCurrentRole] = useState(null);

  // Handles logging out from any dashboard
  const handleLogout = () => {
    setCurrentRole(null);
  };

  // Handles login from Login component
  const handleLogin = (role) => {
    if (role === "student" || role === "instructor" || role === "admin") {
      setCurrentRole(role);
    } else {
      alert("Invalid role");
    }
  };

  return (
    <>
      {/* Show login if no role selected */}
      {!currentRole && <Login onLogin={handleLogin} />}

      {/* Render dashboards based on role */}
      {currentRole === "student" && <StudentDashboard onLogout={handleLogout} />}
      {currentRole === "instructor" && <InstructorDashboard onLogout={handleLogout} />}
      {currentRole === "admin" && <AdminDashboard onLogout={handleLogout} />}
    </>
  );
}
