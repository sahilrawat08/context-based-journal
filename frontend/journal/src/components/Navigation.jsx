import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"

const Navigation = ({ onLogout }) => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/journal", label: "New Entry", icon: "✍️" },
    { path: "/analytics", label: "Analytics", icon: "📊" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ]

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="text-2xl">🧠</div>
            <span className="text-xl font-serif font-black text-foreground">MindJournal</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="flex items-center space-x-2"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onLogout} className="bg-transparent">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex-1">
              <Button
                variant={isActive(item.path) ? "default" : "ghost"}
                className="w-full flex flex-col items-center space-y-1 py-2 h-auto"
                size="sm"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
