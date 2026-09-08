import { Loader2 } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function AuthLoading() {
  return (
    <div className="grid min-h-svh place-items-center">
      <Loader2 className="size-8 animate-spin text-md-primary" />
    </div>
  );
}

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoading />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoading />;
  if (user) return <Navigate to="/app" replace />;
  return <Outlet />;
}
