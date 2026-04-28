import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <AlertTriangle size={64} className="text-red-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Page not found. Let&apos;s get you back to safety.</p>
      <button onClick={() => navigate('/')} className="btn-primary flex items-center gap-2">
        <Home size={18} /> Go Home
      </button>
    </div>
  )
}
