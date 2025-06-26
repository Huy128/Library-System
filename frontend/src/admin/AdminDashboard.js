import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard({ token, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard-container">
      <h2>👑 Admin Dashboard</h2>

      <div style={{ marginTop: "1.5rem" }}>
        <button
          onClick={() => navigate("/admin/books")}
          className="admin-dashboard-button"
        >
          📚 Manage Books
        </button>

        <button
          onClick={() => navigate("/admin/users")}
          className="admin-dashboard-button"
        >
          👤 Manage Users
        </button>

        <button
          onClick={() => navigate("/admin/history")}
          className="admin-dashboard-button"
        >
          🕓 Borrow History
        </button>
      </div>

      <button onClick={onLogout} className="admin-dashboard-button logout">
        🚪 Logout
      </button>
    </div>
  );
}

export default AdminDashboard;
