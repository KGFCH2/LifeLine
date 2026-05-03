import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Shield, Stethoscope, LayoutDashboard, User, Menu, X, Phone, LogIn, Sun, Moon, HelpCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import LoginModal from './LoginModal.jsx'
import { motion, AnimatePresence } from 'framer-motion'

export default function TopNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Scroll listener for floating effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    if (pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 350)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  const isActive = (path) => pathname === path

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled 
          ? `${isDark ? 'bg-slate-900/90 border-[#C8102E]/20 shadow-lg' : 'bg-white/90 border-gray-100 shadow-sm'} backdrop-blur-xl py-2` 
          : `${isDark ? 'bg-slate-950 border-white/5' : 'bg-white border-black/5'} py-2.5`
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-10' : 'h-12'}`}>

          {/* Logo */}
          <Link
            to="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-[#C8102E] rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
              <Shield size={15} className="text-white" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className={`font-extrabold text-[15px] tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>LifeLine</span>
              <span className="font-black text-[15px] text-[#C8102E]">+</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { path: '/', label: 'Home', Icon: Home },
              { path: '/emergency', label: 'Emergency', Icon: Shield },
              ...(user ? [
                { path: '/doctors', label: 'Doctors', Icon: Stethoscope },
                { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
              ] : []),
            ].map(({ path, label, Icon }) => (
              <Link
                key={path}
                to={path}
                className={`relative group flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold transition-all drop-shadow-md ${
                  isActive(path)
                    ? 'text-[#C8102E]'
                    : (isDark ? 'text-white hover:text-red-400' : 'text-black hover:text-[#C8102E]')
                }`}
              >
                {isActive(path) && (
                  <motion.span layoutId="nav-active" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#C8102E] rounded-full" />
                )}
                <Icon size={13} className="transition-transform group-hover:scale-110" />
                {label}
              </Link>
            ))}

            {/* Divider */}
            {pathname === '/' && (
              <span className={`w-px h-4 mx-1 ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`} />
            )}

            {/* Anchor scroll links — home only */}
            {pathname === '/' && (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold transition-all drop-shadow-sm ${isDark ? 'text-white hover:text-red-400' : 'text-black hover:text-[#C8102E]'}`}
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold transition-all drop-shadow-sm ${isDark ? 'text-white hover:text-red-400' : 'text-black hover:text-[#C8102E]'}`}
                >
                  Contact
                </button>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-indigo-600" />}
            </button>

            {/* Emergency pill — always visible on desktop */}
            <Link
              to="/emergency"
              className="hidden sm:flex items-center gap-1.5 bg-[#C8102E] hover:bg-[#a50d26] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg transition-all duration-200 shadow-sm"
            >
              <Shield size={13} />
              SOS
            </Link>

            {/* User avatar or Login */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 py-1">
                  {user.photo ? (
                    <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-lg object-cover ring-2 ring-[#C8102E]/20 transition-all" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 bg-[#C8102E] rounded-lg flex items-center justify-center text-[12px] font-black text-white transition-transform">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className={`text-[11px] font-bold hidden lg:block ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    {user.name?.split(' ')[0]}
                  </span>
                </button>
                
                {/* Profile Dropdown */}
                <div className={`absolute right-0 top-full mt-1 w-48 rounded-2xl border p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-xl ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
                }`}>
                  {[
                    { to: '/profile', icon: User, label: 'My Profile' },
                    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                    { to: '/doctors', icon: Stethoscope, label: 'Find Doctors' },
                    { to: '/faqs', icon: HelpCircle, label: 'Help & FAQs' },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-[#C8102E]'
                      }`}
                    >
                      <item.icon size={14} />
                      {item.label}
                    </Link>
                  ))}
                  <div className={`my-1 border-t ${isDark ? 'border-slate-800' : 'border-gray-50'}`} />
                  <button
                    onClick={() => {
                      logout()
                      navigate('/')
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isDark ? 'text-red-400 hover:bg-red-900/10' : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <LogIn size={14} className="rotate-180" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowLogin(true)}
                className={`flex items-center gap-1.5 text-[11px] font-bold px-3.5 py-1.5 rounded-lg border transition-all duration-200 active:scale-95 shadow-sm ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <LogIn size={13} />
                Login
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-all ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t ${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-gray-100'}`}>
          <nav className="px-4 py-3 space-y-1">
            {[
              { path: '/', label: 'Home', Icon: Home },
              { path: '/emergency', label: 'Emergency', Icon: Shield },
              ...(user ? [
                { path: '/doctors', label: 'Doctors', Icon: Stethoscope },
                { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
                { path: '/profile', label: 'Profile', Icon: User },
              ] : []),
            ].map(({ path, label, Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(path)
                    ? 'text-[#C8102E] bg-red-50 dark:bg-red-900/20'
                    : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50')
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <div className="pt-1 border-t border-gray-100">
              <button onClick={() => scrollToSection('features')} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
                Features
              </button>
              <button onClick={() => scrollToSection('contact')} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
                <Phone size={16} />
                Contact
              </button>
            </div>
          </nav>
        </div>
      )}
      
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  )
}
