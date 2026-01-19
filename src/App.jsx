import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Tasks from "./components/Tasks";
import StaffForm from "./components/StaffForm";
import StaffList from "./components/StaffList";
import AccessControl from "./components/AccessControl";
import { useAuth } from "./context/AuthContext";
import API from "./api/axiosInstance";
import { exportToJSON } from "./utils/fileHelpers";
import "./App.css";

function App() {
  const { authUser, isLoggedIn, login } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [staffs, setStaffs] = useState([]);
  const [editStaff, setEditStaff] = useState(null);

  const loadAllData = async () => {
    if (!isLoggedIn) return;
    try {
      const res = await API.get("/staff");
      setStaffs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Staff load error:", err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && authUser) {
      const role = (authUser.role || authUser.Role)?.toLowerCase();
      if (window.location.pathname === "/" || window.location.pathname === "/login") {
        if (role === "admin") navigate("/dashboard");
        else navigate("/tasks");
      }
    }
  }, [isLoggedIn, authUser, navigate]);

  useEffect(() => {
    console.log("Current Logged In User Data:", authUser);
  }, [authUser]);

  const filteredStaffs = staffs.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Delete staff?")) {
      try {
        await API.delete(`/staff/${id}`);
        loadAllData();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/register" element={<Register goToLogin={() => navigate("/login")} />} />
        <Route path="*" element={
          <Login
            onLoginSuccess={(userData) => {

              login(userData);
              console.log("Login Success, Context Updated.");
            }}
            goToRegister={() => navigate("/register")}
          />
        } />
      </Routes>
    );
  }

return (
    <div className="container">
      <Navbar />
      <div style={{ marginTop: "40px" }}>
        <Routes>
          {/* Main List View */}
          <Route path="/list" element={
            <>
              <div className="table-top">
                <div className="search-wrapper">
                  <input
                    type="text"
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {(authUser?.role?.toLowerCase() === "admin" || authUser?.Role?.toLowerCase() === "admin") && (
                  <div className="action-buttons" style={{ display: 'flex', gap: '10px' }}>
                    <button className="export-btn" onClick={() => exportToJSON(staffs)}>Export</button>
                    <button className="print-btn-grey" onClick={() => window.print()}>Print</button>
                    <button className="add-btn" onClick={() => { setEditStaff(null); navigate("/add"); }}>
                      ➕ Add Staff
                    </button>
                  </div>
                )}
              </div>
              <StaffList
                staffs={filteredStaffs}
                onDelete={handleDelete}
                setEditStaff={(s) => { setEditStaff(s); navigate("/add"); }}
              />
            </>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute role="admin">
              <Dashboard staffs={staffs} />
            </ProtectedRoute>
          } />

          <Route path="/add" element={
            <ProtectedRoute role="admin">
              <StaffForm
                editStaff={editStaff}
                setEditStaff={setEditStaff}
                refreshData={loadAllData}
                goToList={() => navigate("/list")}
              />
            </ProtectedRoute>
          } />

          {/* 2. Added Access Control Route (Admin Only) */}
          <Route path="/access-control" element={
            <ProtectedRoute role="admin">
              <AccessControl />
            </ProtectedRoute>
          } />

          <Route path="/tasks" element={<Tasks currentUser={authUser} />} />

          <Route path="*" element={<Navigate to="/list" />} />
        </Routes>
      </div>

      <div className="print-only-report">
        <h2 className="print-header">Complete Staff List</h2>
        <table className="print-table">
          <thead>
            <tr>
              <th>#</th><th>Name</th><th>Department</th><th>Role</th><th>Salary</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((s, index) => (
              <tr key={s.id}>
                <td>{index + 1}</td>
                <td>{s.name}</td>
                <td>{s.department}</td>
                <td>{s.role}</td>
                <td>₹{Number(s.salary).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Total Records: {staffs.length} | Generated on: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default App;
