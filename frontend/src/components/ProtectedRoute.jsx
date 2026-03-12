import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole, isPublic }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (isPublic && token) {
    if (role === "organizer") {
      return <Navigate to="/my-events" replace />;
    }
    return <Navigate to="/events" replace />;
  }

  if (!token && !isPublic) {
    return <Navigate to="/login" replace />;
  }

  if (!isPublic && allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;