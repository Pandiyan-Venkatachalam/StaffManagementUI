import { useState } from "react";
import API from "../api/axiosInstance";

function Register({ goToLogin }) {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Role, setRole] = useState("");

  const handleRegister = async () => {
    if (!Username || !Password || !Role) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const payload = {
        Username: Username,
        Password: Password,
        Role: Role 
      };

      console.log("Sending Payload:", payload);
      const response = await API.post("/auth/register", payload);

      if (response.status === 200 || response.status === 201) {
        alert("Registered successfully! Please login now.");
        goToLogin();
      }
    } catch (err) {
      console.error("Registration Error:", err);
      const errorMsg = err.response?.data?.message || "Registration failed. Username might be taken.";
      alert(errorMsg);
    }
  };

  return (
    <div className="form-page">
      <div className="form">
        <h3 style={{ color: "#1e3a8a", marginBottom: "20px" }}>Create Account</h3>
        <input
          placeholder="Username"
          value={Username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={Role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User (Staff)</option>
        </select>
        <button className="add-btn" style={{ width: "100%", marginTop: "10px" }} onClick={handleRegister}>
          Register Account
        </button>
        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          Already have an account?{" "}
          <span style={{ color: "#2563eb", cursor: "pointer", fontWeight: "bold" }} onClick={goToLogin}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;