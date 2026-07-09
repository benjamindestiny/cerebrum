import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PublicDashboard from "./PublicDashboard";

const Home = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is logged in, go to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, show the public dashboard
  return <PublicDashboard />;
};

export default Home;
