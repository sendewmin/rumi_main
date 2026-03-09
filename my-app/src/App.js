import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import AuthPage from "./auth/AuthPage";
import Dashboard from "./auth/Dashboard";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 80 }}>Loading...</p>;

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
