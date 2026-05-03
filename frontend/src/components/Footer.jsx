import { Link } from 'react-router-dom'
import { Shield, FileText, BookOpen, HelpCircle, Heart, Phone, Mail, MapPin, Github } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Footer() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`transition-colors duration-300 border-t ${isDark ? 'bg-slate-950 border-slate-900' : 'bg-white border-gray-100'} mt-8`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 group">
              <div className="w-10 h-10 bg-[#C8102E] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#C8102E]/25">
                <Heart size={20} className="text-white fill-white" />
              </div>
              <div>
                <span className={`text-lg font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>LifeLine<span className="text-[#C8102E]">+</span></span>
                <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Every second counts</p>
              </div>
            </Link>
            <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              Real-time emergency response platform for India. Connecting you with hospitals, ambulances, and emergency services instantly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-semibold text-sm mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/emergency', label: 'Emergency' },
                { to: '/doctors', label: 'Doctors' },
                { to: '/dashboard', label: 'Dashboard' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`group flex items-center gap-2 text-xs transition-colors duration-200 ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-[#C8102E]'
                    }`}
                  >
                    <span className={`w-1 h-1 rounded-full transition-all duration-200 ${
                      isDark ? 'bg-slate-700 group-hover:bg-white group-hover:w-2' : 'bg-gray-300 group-hover:bg-[#C8102E] group-hover:w-2'
                    }`} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={`font-semibold text-sm mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Legal</h4>
            <ul className="space-y-2">
              {[
                { to: '/privacy', icon: Shield, label: 'Privacy Policy' },
                { to: '/terms', icon: FileText, label: 'Terms of Service' },
                { to: '/faqs', icon: HelpCircle, label: 'FAQs' },
                { to: '/docs', icon: BookOpen, label: 'Documentation' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`group flex items-center gap-2 text-xs transition-colors duration-200 ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-[#C8102E]'
                    }`}
                  >
                    <link.icon size={11} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`font-semibold text-sm mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@lifelineplus.in" className={`group flex items-center gap-2 text-xs transition-colors duration-200 ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-[#C8102E]'
                }`}>
                  <Mail size={11} className="group-hover:scale-110 transition-transform" />
                  support@lifelineplus.in
                </a>
              </li>
              <li className={`flex items-start gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <MapPin size={11} className="shrink-0 mt-0.5" />
                <span>Kolkata, WB, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`border-t pt-6 ${isDark ? 'border-slate-900' : 'border-gray-100'}`}>
          <p className={`text-[11px] text-center sm:text-left ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
            © {currentYear} LifeLine+ Team. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
