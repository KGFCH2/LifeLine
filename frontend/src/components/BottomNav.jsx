import { Link, useLocation } from 'react-router-dom'
import { Home, Shield, Stethoscope, LayoutDashboard, User } from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/emergency', icon: Shield, label: 'Emergency', accent: true },
  { path: '/doctors', icon: Stethoscope, label: 'Doctors' },
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/profile', icon: User, label: 'Profile' }
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 z-40 safe-bottom">
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
        {navItems.map(item => {
          const active = pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                active
                  ? item.accent
                    ? 'text-red-600'
                    : 'text-red-600'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${active && !item.accent ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium ${active ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
