import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  Brain,
  Trophy,
  Users,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Puzzle,
  BookOpen,
  BarChart3,
  Award,
  Home,
  FolderTree,
} from "lucide-react";

const Layout = () => {
  const { currentUser, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  // ✅ FIX: Navigation items with Achievements for logged-in users
  const navItems = currentUser
    ? [
        {
          path: "/dashboard",
          label: "Dashboard",
          icon: <BarChart3 className="w-4 h-4" />,
        },
        {
          path: "/categories",
          label: "Categories",
          icon: <FolderTree className="w-4 h-4" />,
        },
        {
          path: "/leaderboard",
          label: "Leaderboard",
          icon: <Trophy className="w-4 h-4" />,
        },
        {
          path: "/riddles",
          label: "Riddles",
          icon: <Puzzle className="w-4 h-4" />,
        },
        {
          path: "/read-and-test",
          label: "Read & Test",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          path: "/achievements",
          label: "Achievements",
          icon: <Award className="w-4 h-4" />,
        },
      ]
    : [
        { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
        {
          path: "/categories",
          label: "Categories",
          icon: <FolderTree className="w-4 h-4" />,
        },
        {
          path: "/leaderboard",
          label: "Leaderboard",
          icon: <Trophy className="w-4 h-4" />,
        },
        {
          path: "/riddles",
          label: "Riddles",
          icon: <Puzzle className="w-4 h-4" />,
        },
        {
          path: "/read-and-test",
          label: "Read & Test",
          icon: <BookOpen className="w-4 h-4" />,
        },
      ];

  const authNavItems = [
    { path: "/profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--app-bg)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link
              to={currentUser ? "/dashboard" : "/"}
              className="flex items-center gap-2 shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span
                className="font-bold text-lg hidden sm:block"
                style={{ color: "var(--text)" }}
              >
                Cerebrum
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-3 py-1.5 rounded-lg transition-all text-sm flex items-center gap-1.5 whitespace-nowrap"
                  style={{
                    color: "var(--muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "var(--text)";
                    e.target.style.backgroundColor = "var(--accent-soft)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "var(--muted)";
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              {currentUser &&
                authNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="px-3 py-1.5 rounded-lg transition-all text-sm flex items-center gap-1.5 whitespace-nowrap"
                    style={{
                      color: "var(--muted)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "var(--text)";
                      e.target.style.backgroundColor = "var(--accent-soft)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "var(--muted)";
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
            </nav>

            {/* Right side - Theme Toggle + Auth */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-colors"
                style={{ color: "var(--muted)" }}
                onMouseEnter={(e) => (e.target.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--muted)")}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Auth Buttons */}
              {currentUser ? (
                <button
                  onClick={handleSignOut}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm"
                  style={{
                    color: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "rgba(239, 68, 68, 0.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "rgba(239, 68, 68, 0.1)")
                  }
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm text-white"
                  style={{ backgroundColor: "var(--accent)" }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#6d28d9")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "var(--accent)")
                  }
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg transition-colors"
                style={{ color: "var(--muted)" }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden"
            style={{
              backgroundColor: "var(--surface)",
              borderTop: "1px solid var(--border)",
            }}
          >
            <div className="px-3 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm"
                  style={{ color: "var(--muted)" }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "var(--text)";
                    e.target.style.backgroundColor = "var(--accent-soft)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "var(--muted)";
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              {currentUser &&
                authNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm"
                    style={{ color: "var(--muted)" }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "var(--text)";
                      e.target.style.backgroundColor = "var(--accent-soft)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "var(--muted)";
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              <div
                className="border-t pt-2 mt-2"
                style={{ borderColor: "var(--border)" }}
              >
                {currentUser ? (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm w-full"
                    style={{ color: "#ef4444" }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor =
                        "rgba(239, 68, 68, 0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm"
                    style={{ color: "var(--accent)" }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "var(--accent-soft)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 min-h-[calc(100vh-120px)]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" style={{ color: "var(--accent)" }} />
              <span className="text-sm" style={{ color: "var(--muted)" }}>
                Cerebrum &copy; 2024
              </span>
            </div>
            <div
              className="flex items-center gap-4 text-xs"
              style={{ color: "var(--muted-strong)" }}
            >
              <Link
                to="/about"
                className="hover:underline transition-colors"
                style={{ color: "var(--muted)" }}
              >
                About
              </Link>
              <Link
                to="/privacy"
                className="hover:underline transition-colors"
                style={{ color: "var(--muted)" }}
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:underline transition-colors"
                style={{ color: "var(--muted)" }}
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
