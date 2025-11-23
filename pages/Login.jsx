import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Map passwords to roles
    if (password === "student123") onLogin("student");
    else if (password === "instructor123") onLogin("instructor");
    else if (password === "admin123") onLogin("admin");
    else alert("Wrong password");
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "80px auto",
        padding: 20,
        background: "#fff",
        borderRadius: 12,
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Login</h2>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #e6eef8",
          marginTop: 12,
        }}
      />
      <button
        onClick={handleLogin}
        style={{
          marginTop: 16,
          padding: "8px 12px",
          borderRadius: 8,
          border: "none",
          background: "#0b69ff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Login
      </button>
      <p style={{ marginTop: 12, color: "#475569" }}>
        Demo passwords: student123 | instructor123 | admin123
      </p>
    </div>
  );
}
