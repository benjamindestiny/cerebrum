import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PublicDashboard from "./PublicDashboard";

const Home = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen  text-white border-[#2A2A4A]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin  text-white border-[#2A2A4A]"></div>
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
