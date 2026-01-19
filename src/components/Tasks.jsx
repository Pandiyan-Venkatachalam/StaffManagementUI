import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import "./Tasks.css";

function Tasks({ currentUser }) {
  const [tasks, setTasks] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", assignedTo: "", deadline: "" });

  const isAdmin = currentUser?.role === "admin";

  const loadAll = async () => {
    try {
      const [tRes, sRes] = await Promise.all([
        API.get(`/task/${currentUser.username}/${currentUser.role}`),
        API.get("/staff")
      ]);
      setTasks(tRes.data);
      setStaffs(sRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignedTo) return alert("Please fill all fields");

    await API.post("/task", { ...newTask, status: "Pending" });
    setNewTask({ title: "", assignedTo: "", deadline: "" });
    loadAll();
  };

  const updateStatus = async (id, status) => {
    await API.patch(`/task/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
    loadAll();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`/task/${id}`);
        loadAll();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h3>Task Management</h3>
      </div>

      {isAdmin && (
        <div className="task-form-card">
          <h4>Assign New Task</h4>
          <form onSubmit={handleAddTask} className="task-form-grid">
            <div className="input-group">
              <label>Task Title</label>
              <input
                placeholder="Assign "
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Assign To</label>
              <select value={newTask.assignedTo} onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}>
                <option value="">Select Staff</option>
                {staffs.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Deadline</label>
              <input type="date" value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} />
            </div>
            <button type="submit" className="assign-btn">Assign</button>
          </form>
        </div>
      )}

      <div className="task-list-grid">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div key={task.id} className={`task-card ${task.status === "Pending" ? "status-pending" :
                task.status === "In Progress" ? "status-inprogress" : "status-completed"
              }`}>
              <div className="task-card-header">
                <h5>{task.title}</h5>
                <span className="status-badge">{task.status}</span>
              </div>

              <div className="task-details">
                <p> <strong>Assigned to:</strong> {task.assignedTo}</p>
                {task.deadline && <p> <strong>Deadline:</strong> {task.deadline}</p>}
              </div>

              <div className="task-footer">
                <label>Update Status</label>
                <select
                  className="status-selector"
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <div className="no-tasks">No tasks found for your account.</div>
        )}
      </div>
    </div>
  );
}

export default Tasks;


