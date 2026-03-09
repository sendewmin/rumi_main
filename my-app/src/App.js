import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./auth/AuthPage";
import Dashboard from "./auth/Dashboard";
import { useAuth } from "./auth/AuthContext";

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

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
