import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import AdminSubscribers from './pages/AdminSubscribers';
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import AdminEmail from './pages/AdminEmail';
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import AdminWeeklyReport from "./pages/AdminWeeklyReport";
import Riddles from "./pages/Riddles";
import Categories from "./pages/Categories";
import Achievements from "./pages/Achievements";
import ReadAndTest from "./pages/ReadAndTest";
import AdminEmailTemplates from "./pages/AdminEmailTemplates";
import AdminSendMessage from "./pages/AdminSendMessage"; // ✅ NEW
import ReadAndTestResults from "./pages/ReadAndTestResults";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Donate from "./pages/Donate";
import TestGroq from "./pages/TestGroq";
import CookieConsent from "./components/Common/CookieConsent";
import { supabase } from "./services/supabase";

//  Admin imports
import AdminProvider from "./context/AdminContext";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedAdminRoute from "./components/Admin/ProtectedAdminRoute";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AdminProvider>
        <div className="min-h-screen bg-[#0f0f1a]">
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/callback" element={<AdminLogin />} /> {/* ✅ Moved outside Layout */}

            {/* ✅ Admin routes (protected) */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/email-templates" 
              element={
                <ProtectedAdminRoute>
                  <AdminEmailTemplates />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/email" 
              element={
                <ProtectedAdminRoute>
                  <AdminEmail />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/subscribers" 
              element={
                <ProtectedAdminRoute>
                  <AdminSubscribers />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/weekly-report" 
              element={
                <ProtectedAdminRoute>
                  <AdminWeeklyReport />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/send-message"  // ✅ NEW ROUTE
              element={
                <ProtectedAdminRoute>
                  <AdminSendMessage />
                </ProtectedAdminRoute>
              } 
            />

            {/* Main Layout routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="*" element={<NotFound />} />
              <Route path="donate" element={<Donate />} />
              <Route path="categories" element={<Categories />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="riddles" element={<Riddles />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="read-and-test" element={<ReadAndTest />} />
              <Route
                path="read-and-test-results"
                element={<ReadAndTestResults />}
              />
              <Route path="privacy" element={<Privacy />} />
              <Route path="about" element={<About />} />
              <Route path="terms" element={<Terms />} />

              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="quiz"
                element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="results"
                element={
                  <ProtectedRoute>
                    <Results />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
          <CookieConsent />
        </div>
      </AdminProvider>
    </Router>
  );
}

export default App;