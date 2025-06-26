import React, { useState } from "react";

function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:8080/api/auth/login"
      : "http://localhost:8080/api/auth/register";

    const body = {
      username,
      password,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Login or registration failed!");
      }

      if (isLogin) {
        const data = await res.json();
        if (data.token && data.username && data.role) {
          onLogin(data.token, data.username, data.role);
        } else {
          throw new Error("Invalid login response.");
        }
      } else {
        alert("Registration successful! Please log in.");
        toggleMode();
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <p style={{ marginTop: "10px" }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={toggleMode}
          style={{ color: "blue", background: "none", border: "none", cursor: "pointer" }}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}

export default AuthForm;
