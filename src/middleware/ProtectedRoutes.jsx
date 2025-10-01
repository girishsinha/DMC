import { useUser } from "@/context/userContext";
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useUser().user;
  if (!user.status) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
