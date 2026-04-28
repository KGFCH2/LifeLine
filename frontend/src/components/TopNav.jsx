import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Shield, Stethoscope, LayoutDashboard, User, Menu, X, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const publicNavItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/emergency', icon: Shield, label: 'Emergency' },
  { path: '/doctors', icon: Stethoscope, label: 'Doctors' }
]

const privateNavItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/profile', icon: User, label: 'Profile' }
]

export default function TopNav({ dark, toggleDark }) {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-bold text-base text-gray-900 dark:text-white hidden sm:block">LifeLine+</span>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center gap-0.5">
            {publicNavItems.map(item => {
              const active = pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            {user && privateNavItems.map(item => {
              const active = pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right Side - User & Dark Mode */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              style={{ '--glow-color': dark ? 'rgba(251, 191, 36, 0.4)' : 'rgba(139, 92, 246, 0.4)' }}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 toggle-glow ${
                dark 
                  ? 'bg-amber-100/50 text-amber-600 border border-amber-200/50' 
                  : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
              }`}
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={16} className="animate-in fade-in zoom-in duration-300" /> : <Moon size={16} className="animate-in fade-in zoom-in duration-300" />}
            </button>

            {/* User Avatar */}
            {user && (
              <Link to="/profile" className="flex items-center gap-2 ml-1">
                <div className="w-7 h-7 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-[10px] font-bold text-red-600">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 hidden lg:block">
                  {user.name?.split(' ')[0]}
                </span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <nav className="px-4 py-3 space-y-1">
            {publicNavItems.map(item => {
              const active = pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            {user && privateNavItems.map(item => {
              const active = pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
