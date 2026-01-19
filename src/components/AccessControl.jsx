// import { useState, useEffect } from "react";
// import API from "../api/axiosInstance";
// import "./AccessControl.css";

// function AccessControl() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadUsers = async () => {
//     try {
//       setLoading(true);
//       // Backend: Left Join query results
//       const res = await API.get("/auth/access-list");
//       setUsers(res.data);
//     } catch (err) {
//       console.error("Error loading users:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadUsers(); }, []);

//   const handleToggleStatus = async (userId, currentStatus) => {
//     if (userId === 0) {
//       alert("No account linked to this user. Please link an account in the Staff Form.");
//       return;
//     }

//     try {
//       const newStatus = !currentStatus;
//       await API.patch(`/auth/toggle-status/${userId}`, JSON.stringify(newStatus), {
//         headers: { 'Content-Type': 'application/json' }
//       });

//       setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: newStatus } : u));
//     } catch (err) {
//       alert("Failed to update access.");
//     }
//   };

//   if (loading) return <div className="loading">Syncing Staff Records...</div>;

//   return (
//     <div className="access-container">
//       <h3>System Access Control</h3>
//       <table className="access-table">
//         <thead>
//           <tr>
//             <th>Staff Name</th>
//             <th>Login Username</th>
//             <th>Status</th>
//             <th>Switch</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user, index) => (
//             <tr key={index}>
//               <td>{user.staffName}</td>
//               <td>{user.userName}</td>
//               <td>
//                 <span className={user.hasAccount ? (user.isActive ? "status-on" : "status-off") : "status"}>
//                   {user.hasAccount ? (user.isActive ? "Authorized" : "Blocked") : "No Account"}
//                 </span>
//               </td>
//               <td>
//                 <label className="access-switch">
//                   <input
//                     type="checkbox"
//                     disabled={!user.hasAccount}
//                     checked={user.isActive || false}
//                     onChange={() => handleToggleStatus(user.id, user.isActive || false)}
//                   />
//                   <span className={`access-slider ${!user.hasAccount ? "disabled" : ""}`}></span>
//                 </label>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default AccessControl;

import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import "./AccessControl.css";

function AccessControl() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/auth/access-list");
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    if (!userId || userId === 0) {
      alert("No account linked. Please link an account in the Staff Form.");
      return;
    }

    try {
      const newStatus = !currentStatus;
      await API.patch(`/auth/toggle-status/${userId}`, JSON.stringify(newStatus), {
        headers: { 'Content-Type': 'application/json' }
      });

      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: newStatus } : u));
    } catch (err) {
      alert("Failed to update access.");
    }
  };

  if (loading) return <div className="loading-spinner"><span>Syncing Records...</span></div>;

  return (
    <div className="access-container">
      <div className="access-header">
        <h2>Admin Access Control</h2>
        <p>Manage staff login permissions and account status</p>
      </div>

      <div className="table-wrapper">
        <table className="access-table">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Username</th>
              <th>Status</th>
              <th className="text-center">Access Switch</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id || user.staffName} className={!user.hasAccount ? "row-no-account" : ""}>
                <td>
                  <div className="staff-info">
                    <span className="staff-avatar">{user.staffName.charAt(0)}</span>
                    <span className="staff-name">{user.staffName}</span>
                  </div>
                </td>
                <td><code className="user-code">{user.userName || "—"}</code></td>
                <td>
                  <span className={`badge ${!user.hasAccount ? "badge-null" : (user.isActive ? "badge-active" : "badge-blocked")}`}>
                    {user.hasAccount ? (user.isActive ? "Authorized" : "Blocked") : "No Account"}
                  </span>
                </td>
                <td className="text-center">
                  <label className="access-switch">
                    <input
                      type="checkbox"
                      disabled={!user.hasAccount}
                      checked={!!user.isActive}
                      onChange={() => handleToggleStatus(user.id, user.isActive)}
                    />
                    <span className="access-slider"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AccessControl;