import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { authUser, logout } = useAuth();
  const isAdmin = authUser?.role === "admin";

  const getStyle = ({ isActive }) => (isActive ? styles.activeBtn : styles.btn);

  return (
    <nav style={styles.nav}>
      <h3 style={styles.logo}>STAFFMS</h3>

      <div className="nav-links">
        {isAdmin && (
          <NavLink to="/dashboard" style={getStyle}>
             Dashboard
          </NavLink>
        )}

        {isAdmin && (
           <NavLink to="/access-control" style={getStyle}>
            Access Control
            </NavLink>)}

        {isAdmin && (
          <NavLink to="/add" style={getStyle}>
            ➕ Add Staff
          </NavLink>
        )}

        <NavLink to="/list" style={getStyle}>
           Staff List
        </NavLink>

        <NavLink to="/tasks" style={getStyle}>
           Tasks
        </NavLink>

        <button onClick={logout} style={styles.logoutBtn}>
           Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "65px",
    background: "#040d2b",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
  },
  logo: {
    margin: 0,
    fontSize: "22px",
    letterSpacing: "2px",
    fontWeight: "bold"
  },
  btn: {
    padding: "8px 16px",
    marginLeft: "12px",
    cursor: "pointer",
    borderRadius: "6px",
    border: "none",
    background: "transparent",
    color: "#cbd5e1",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease"
  },
  activeBtn: {
    padding: "8px 16px",
    marginLeft: "12px",
    cursor: "pointer",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
  },
  logoutBtn: {
    padding: "8px 16px",
    marginLeft: "20px",
    cursor: "pointer",
    borderRadius: "6px",
    border: "none",
    background: "#ef4444",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    transition: "background 0.3s"
  }
};

export default Navbar;


// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import "./Navbar.css"; 

// function Navbar() {
//   const { authUser, logout } = useAuth();
//   const [isOpen, setIsOpen] = useState(false); 
//   const isAdmin = authUser?.role === "admin";

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   return (
//     <>
//       {/* 1. TOP HEADER (Contains 3 lines and Logo) */}
//       <header className="top-header">
//         <div className="header-left">
//           <button className="menu-toggle" onClick={toggleSidebar}>
//             {isOpen ? "✕" : "☰"} 
//           </button>
//           <h3 className="logo">STAFFMS</h3>
//         </div>
//         <div className="header-right">
//           <span className="user-badge">{authUser?.role}</span>
//         </div>
//       </header>

//       {/* 2. SIDEBAR NAV */}
//       <nav className={`side-nav ${isOpen ? "open" : ""}`}>
//         <div className="nav-links">
//           {isAdmin && (
//             <NavLink to="/dashboard" className="nav-item" onClick={toggleSidebar}>
//                Dashboard
//             </NavLink>
//           )}

//           {isAdmin && (
//             <NavLink to="/access-control" className="nav-item" onClick={toggleSidebar}>
//                Access Control
//             </NavLink>
//           )}

//           {isAdmin && (
//             <NavLink to="/add" className="nav-item" onClick={toggleSidebar}>
//               ➕ Add Staff
//             </NavLink>
//           )}

//           <NavLink to="/list" className="nav-item" onClick={toggleSidebar}>
//              Staff List
//           </NavLink>

//           <NavLink to="/tasks" className="nav-item" onClick={toggleSidebar}>
//              Tasks
//           </NavLink>

//           <button onClick={logout} className="logout-btn">
//              Logout
//           </button>
//         </div>
//       </nav>

//       {/* 3. OVERLAY (Click outside to close) */}
//       {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
//     </>
//   );
// }

// export default Navbar;



