import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { authUser, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (role && authUser.role !== role) {
    return <div className="access-denied"><h2>Access Denied! Admins Only.</h2></div>;
  }

  return children;
}
export default ProtectedRoute;

