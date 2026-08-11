import React from "react";
import { Navigate } from "react-router-dom";
import {
  dashboardForRoles,
  normalizeRoles,
  readStoredUser,
} from "../auth/roles";

const RoleRoute = ({ allowedRoles, children }) => {
  const user = readStoredUser();
  const token = localStorage.getItem("token");
  const userRoles = normalizeRoles(user?.roles ?? user?.role);
  const normalizedAllowedRoles = normalizeRoles(allowedRoles);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!userRoles.some((role) => normalizedAllowedRoles.includes(role))) {
    const destination = dashboardForRoles(userRoles);
    return <Navigate to={destination || "/login"} replace />;
  }

  return children;
};

export default RoleRoute;