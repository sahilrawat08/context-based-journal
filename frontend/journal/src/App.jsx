import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route 
            path="/" 
            element={<Navigate to="/login" />} 
          />
          {/* TODO: Add dashboard route when authenticated */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <div>Dashboard (Coming Soon)</div> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
