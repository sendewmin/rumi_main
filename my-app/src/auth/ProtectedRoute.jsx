import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/login" />;

  // Optional role-based access
  if (allowedRoles && !allowedRoles.includes(profile?.role))
    return <Navigate to="/unauthorized" />;

  return children;
}
