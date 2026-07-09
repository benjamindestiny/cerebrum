import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  LayoutDashboard,
  Trophy,
  Puzzle,
  Menu,
  X,
  FolderTree,
  BookOpen,
  LogIn,
  LogOut,
  UserCircle,
  Home,
  Moon,
  Sun,
} from "lucide-react";
import { supabase } from "../../services/supabase";
import { useTheme } from "../../hooks/useTheme";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/auth");
  };

  // Navigation for visitors (not logged in) - includes Home
  const visitorNavLinks = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/categories", icon: FolderTree, label: "Categories" },
    { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { path: "/riddles", icon: Puzzle, label: "Riddles" },
    { path: "/read-and-test", icon: BookOpen, label: "Read & Test" },
  ];

  // Navigation for logged-in users - NO HOME
  const userNavLinks = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/categories", icon: FolderTree, label: "Categories" },
    { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { path: "/riddles", icon: Puzzle, label: "Riddles" },
    { path: "/achievements", icon: Trophy, label: "Achievements" },
    { path: "/read-and-test", icon: BookOpen, label: "Read & Test" },
  ];

  const navLinks = user ? userNavLinks : visitorNavLinks;

  if (loading) {
    return (
      <header className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="app-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-[#a78bfa]" />
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] bg-clip-text text-transparent">
                Cerebrum
              </span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)]">
      <div className="app-container">
        <div className="flex items-center justify-between gap-3 h-16">
          {/* Logo - goes to Dashboard if logged in, otherwise Home */}
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex min-w-0 items-center gap-2 group shrink-0"
          >
            <motion.div
              whileHover={{ rotate: -10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Brain className="w-8 h-8 text-[#a78bfa]" />
            </motion.div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] bg-clip-text text-transparent">
              Cerebrum
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 flex-wrap justify-end">
            {navLinks.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(path)
                    ? "bg-[#7c3aed]/20 text-[#a78bfa] font-medium"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/90 px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span>{isDark ? "Light" : "Dark"}</span>
            </button>
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <UserCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-300 max-w-[100px] truncate">
                    {user.email?.split("@")[0]}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-gray-400 hover:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm font-medium flex items-center gap-2 shadow-lg shadow-[#7c3aed]/25"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-400" />
            ) : (
              <Menu className="w-6 h-6 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-[#1a1a2e]">
          <div className="app-container py-4">
            <nav className="flex flex-col gap-2">
              {navLinks.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(path)
                      ? "bg-[#7c3aed]/20 text-[#a78bfa] font-medium"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}

              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/90 px-4 py-3 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="font-medium">
                  {isDark ? "Light mode" : "Dark mode"}
                </span>
              </button>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <UserCircle className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-medium">Sign In</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
