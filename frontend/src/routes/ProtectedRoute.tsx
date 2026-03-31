import { Navigate, Outlet, useLocation } from "react-router-dom";

import { LoadingState } from "../components/ui/LoadingState";
import { useAuth } from "../state/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}
