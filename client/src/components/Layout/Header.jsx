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
  Award,
  Coffee,
  MessageCircle,
  Zap,
} from "lucide-react";
import { supabase } from "../../services/supabase";
import { useTheme } from "../../context/ThemeContext";

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
    const { data: { user } } = await supabase.auth.getUser();
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

  const visitorNavLinks = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/categories", icon: FolderTree, label: "Categories" },
    { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { path: "/riddles", icon: Puzzle, label: "Riddles" },
    { path: "/read-and-test", icon: BookOpen, label: "Read & Test" },
    { path: "/testimonials", icon: MessageCircle, label: "Testimonials" },
  ];

  const userNavLinks = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/categories", icon: FolderTree, label: "Categories" },
    { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { path: "/riddles", icon: Puzzle, label: "Riddles" },
    { path: "/lunch-break", icon: Coffee, label: "Lunch Break" },
    { path: "/achievements", icon: Award, label: "Achievements" },
    { path: "/read-and-test", icon: BookOpen, label: "Read & Test" },
    { path: "/testimonials", icon: MessageCircle, label: "Testimonials" },
  ];

  const navLinks = user ? userNavLinks : visitorNavLinks;

  if (loading) {
    return (
      <header className="border-b" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* ✅ Direct Logo */}
            <div className="flex items-center gap-2">
              <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-[#2A1535]" />
              <span className="text-lg sm:text-xl font-bold text-[#2A1535] hidden xs:block">Cerebrum</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* ✅ Direct Logo with Link */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
            <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-[#2A1535]" />
            <span className="text-lg sm:text-xl font-bold text-[#2A1535] hidden xs:block">Cerebrum</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.slice(0, 7).map(({ path, icon: Icon, label }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg transition-all duration-300
                    ${active 
                      ? "text-blue-400 bg-blue-500/10" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="group relative flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    Profile
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="group relative flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    Sign Out
                  </span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t max-h-[80vh] overflow-y-auto" style={{ borderColor: 'var(--border)' }}>
          <div className="px-3 py-3">
            <nav className="space-y-1">
              {navLinks.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-base
                    ${isActive(path)
                      ? "text-blue-400 font-medium bg-blue-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
              <div className="border-t my-2" style={{ borderColor: 'var(--border)' }} />
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full text-base"
              >
                {isDark ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
                <span className="font-medium">{isDark ? "Light mode" : "Dark mode"}</span>
              </button>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-base"
                  >
                    <UserCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors w-full text-base"
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors text-base"
                >
                  <LogIn className="w-5 h-5 flex-shrink-0" />
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
