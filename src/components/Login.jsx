import { useState } from "react";
import API from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

function Login({ onLoginSuccess, goToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      const payload = { Username: username, Password: password };
      const response = await API.post("/auth/login", payload);

      login(response.data);
      setError("");

      onLoginSuccess(response.data);

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="form-page">
      <div className="form">
        <h2 style={{ color: "#1e3a8a", marginBottom: "20px" }}>Login</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "10px" }}>{error}</p>}

        <button className="add-btn" style={{ width: "100%" }} onClick={handleLogin}>
          Login to System
        </button>

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#64748b" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#2563eb", cursor: "pointer", fontWeight: "bold" }}
            onClick={goToRegister}
          >
            Create one here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;


