import { useState, useEffect } from "react";
import API from "../api/axiosInstance";

function StaffForm({ editStaff, setEditStaff, goToList, refreshData }) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const [appUserId, setAppUserId] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    const fetchDropdownUsers = async () => {
      try {
        const res = await API.get("/auth/users-list");
        setAvailableUsers(res.data);
      } catch (err) { console.error("Dropdown load error", err); }
    };
    fetchDropdownUsers();

    if (editStaff) {
      setName(editStaff.name);
      setDepartment(editStaff.department);
      setRole(editStaff.role);
      setSalary(editStaff.salary);
      setAppUserId(editStaff.appUserId || "");
    }
  }, [editStaff]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const staffObj = {
      name,
      department,
      role,
      salary: Number(salary),
      appUserId: appUserId ? Number(appUserId) : null
    };

    try {
      if (editStaff) {
        await API.put(`/staff/${editStaff.id}`, { ...staffObj, id: editStaff.id });
        setEditStaff(null);
      } else {
        await API.post("/staff", staffObj);
      }
      if (refreshData) refreshData();
      goToList();
    } catch (err) {
      alert("Error saving data. Backend validation failed.");
    }
  };

  return (
    <div className="form-page">
      <form onSubmit={handleSubmit} className="form">
        <h3>{editStaff ? "Edit Staff" : "Add Staff"}</h3>
        <input required placeholder="Staff Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input required placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
        <input required placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        <input required type="number" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />

        <div className="form-group">
          <label>Link Login Account</label>
          <select value={appUserId} onChange={(e) => setAppUserId(e.target.value)}>
            <option value="">Account Holder Name</option>
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit">Save Staff</button>
          <button type="button" onClick={goToList}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default StaffForm;