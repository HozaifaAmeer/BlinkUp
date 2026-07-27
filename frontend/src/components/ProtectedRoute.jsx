import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const isAuthenticated = Boolean(token && user && token !== "null" && token !== "undefined");

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to perform this action.");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
