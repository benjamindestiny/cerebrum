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
            <div className="flex items-center gap-2">
              <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
              <span className="text-lg sm:text-xl font-bold text-white hidden xs:block">Cerebrum</span>
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
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 shrink-0">
            <motion.div whileHover={{ rotate: -10, scale: 1.1 }} transition={{ type: "spring", stiffness: 400 }}>
              <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
            </motion.div>
            <span className="text-lg sm:text-xl font-bold text-white hidden xs:block">Cerebrum</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto max-w-[60%] scrollbar-hide">
            {navLinks.slice(0, 6).map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 text-sm whitespace-nowrap
                  ${isActive(path)
                    ? "text-blue-400 font-medium bg-blue-500/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
              </Link>
            ))}
            {navLinks.length > 6 && (
              <Link
                to="/more"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 text-sm whitespace-nowrap"
              >
                More...
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
                >
                  <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm max-w-[80px] truncate">
                    {user.email?.split("@")[0]}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hidden sm:flex p-2 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <Link
                  to="/profile"
                  className="sm:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <UserCircle className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Clean and Scrolling */}
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
                  <span className="font-medium truncate">{label}</span>
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
