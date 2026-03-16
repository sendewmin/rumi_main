import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import Dashboard from "./auth/Dashboard";

import "./App.css";

import ListingPage from "./room_listing/listing_page";
import LoginPage from "./components/LoginPage";
import TenantSignup from "./components/TenantSignup";
import LandlordSignup from "./components/LandlordSignup";
import LandlordPage from "./user_roles/page/land_lord";

import Hero from "./components/Hero";
import CategoryCarousel from "./components/CategoryCarousel";
import PlaceScroller from "./components/PlaceScroller";
import Home_statement from "./components/Home_statement";

import "./App.css";
import Homepage from "./components/Homepage";

function HomePage() {
  return (
    <div className="App">
      <Homepage />
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 80 }}>Loading...</p>;

  return (
    <Routes>
      {/* Root */}
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />

      {/* Auth routes — redirect to /dashboard if already logged in */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/signup/tenant"
        element={user ? <Navigate to="/dashboard" replace /> : <TenantSignup />}
      />
      <Route
        path="/signup/landlord"
        element={
          user ? <Navigate to="/dashboard" replace /> : <LandlordSignup />
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/landlord"
        element={user ? <LandlordPage /> : <Navigate to="/login" replace />}
      />

      {/* Public routes */}
      <Route path="/home" element={<HomePage />} />

      {/* Fallback */}
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
