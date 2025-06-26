import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import HomePage from "./HomePage";
import BookList from "./BookList";
import MyBorrowedBooks from "./MyBorrowedBooks";
import AdminDashboard from "./admin/AdminDashboard";
import AdminBookManager from "./admin/AdminBookManager";
import AdminUserManager from "./admin/AdminUserManager";
import AdminBorrowHistory from "./admin/AdminBorrowHistory";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  const handleLogin = (newToken, newUsername, newRole) => {
    setToken(newToken);
    setUsername(newUsername);
    setRole(newRole);
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
    localStorage.setItem("role", newRole);
  };

  const handleLogout = () => {
    setToken("");
    setUsername("");
    setRole("");
    localStorage.clear();
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Trang đăng nhập và điều hướng theo role */}
          <Route
            path="/"
            element={
              !token ? (
                <AuthForm onLogin={handleLogin} />
              ) : role === "ADMIN" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/home" />
              )
            }
          />

          {/* Trang chủ người dùng */}
          <Route
            path="/home"
            element={
              token && role === "USER" ? (
                <HomePage
                  token={token}
                  username={username}
                  role={role}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Danh sách sách */}
          <Route
            path="/books"
            element={token && role === "USER" ? <BookList token={token} /> : <Navigate to="/" />}
          />

          {/* Trang mượn sách cá nhân */}
          <Route
            path="/my-borrows"
            element={token && role === "USER" ? <MyBorrowedBooks token={token} /> : <Navigate to="/" />}
          />

          {/* ------------------- ADMIN ROUTES ------------------- */}
          <Route
            path="/admin"
            element={
              token && role === "ADMIN" ? (
                <AdminDashboard token={token} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/books"
            element={
              token && role === "ADMIN" ? (
                <AdminBookManager token={token} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/users"
            element={
              token && role === "ADMIN" ? (
                <AdminUserManager token={token} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/history"
            element={
              token && role === "ADMIN" ? (
                <AdminBorrowHistory token={token} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
