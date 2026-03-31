import { Navigate, Outlet, useLocation } from "react-router-dom";

import { LoadingState } from "../components/ui/LoadingState";
import { useAuth } from "../state/AuthContext";
import type { UserRole } from "../types/auth";

type RoleProtectedRouteProps = {
  allowedRoles: UserRole[];
};

export function RoleProtectedRoute({ allowedRoles }: RoleProtectedRouteProps) {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState label="Checking your permissions..." />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate replace state={{ from: location }} to="/" />;
  }

  return <Outlet />;
}
