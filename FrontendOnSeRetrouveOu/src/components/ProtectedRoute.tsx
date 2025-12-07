import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { getToken } = useAuth();
  const isAuthenticated = !!getToken();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
