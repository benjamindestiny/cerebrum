import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Riddles from "./pages/Riddles";
import Categories from "./pages/Categories";
import Achievements from "./pages/Achievements";
import ReadAndTest from "./pages/ReadAndTest";
import ReadAndTestResults from "./pages/ReadAndTestResults";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Donate from "./pages/Donate";
import TestGroq from "./pages/TestGroq";
import CookieConsent from "./components/Common/CookieConsent";
import { supabase } from "./services/supabase";

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
      <div className="min-h-screen bg-[#0f0f1a]">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="donate" element={<Donate />} />
            <Route path="categories" element={<Categories />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="riddles" element={<Riddles />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="test-groq" element={<TestGroq />} />
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
              path="achievements"
              element={
                <ProtectedRoute>
                  <Achievements />
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
    </Router>
  );
}

export default App;
