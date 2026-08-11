export const normalizeRoles = (roles) => {
  const values = Array.isArray(roles) ? roles : [roles];

  return values
    .filter((role) => typeof role === "string")
    .map((role) => role.trim().toLowerCase())
    .filter(Boolean);
};

export const dashboardForRoles = (roles) => {
  const normalizedRoles = normalizeRoles(roles);

  if (normalizedRoles.includes("admin")) return "/admin/dashboard";
  if (normalizedRoles.includes("consultant")) return "/consultant/dashboard";
  if (normalizedRoles.includes("user")) return "/user/dashboard";

  return null;
};

export const readStoredUser = () => {
  try {
    const value = localStorage.getItem("user");
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};