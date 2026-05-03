import { useAuth } from '../context/AuthContext.jsx'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // Redirect to home page with state to trigger login modal
    return <Navigate to="/" state={{ from: location, showLogin: true }} replace />
  }

  return children
}
