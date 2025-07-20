import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);

  // Check if the route requires admin access (e.g., /reports, /genres, /staff)
  const location = window.location.pathname;
  const requiresAdmin = ["/reports", "/genres", "/staff"].some((path) =>
    location.includes(path)
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiresAdmin && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;
