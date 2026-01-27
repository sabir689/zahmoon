import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isAdmin) {
    // If not admin, send them to the login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;