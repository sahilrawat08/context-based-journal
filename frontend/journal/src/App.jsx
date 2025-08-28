import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Dashboard from "./components/Dashboard"
import JournalEntry from "./components/JournalEntry"
import Analytics from "./components/Analytics"
import Settings from "./components/Settings"
import Navigation from "./components/Navigation"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {user && <Navigation onLogout={logout} />}
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={login} />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register onLogin={login} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/journal" element={user ? <JournalEntry user={user} /> : <Navigate to="/login" />} />
          <Route path="/analytics" element={user ? <Analytics user={user} /> : <Navigate to="/login" />} />
          <Route
            path="/settings"
            element={user ? <Settings user={user} onLogout={logout} /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
