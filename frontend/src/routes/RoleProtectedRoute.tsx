import { Navigate, Outlet } from "react-router-dom";

import { useAuth, type UserRole } from "../state/AuthContext";

type RoleProtectedRouteProps = {
  allowedRoles: UserRole[];
};

export function RoleProtectedRoute({ allowedRoles }: RoleProtectedRouteProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
}
