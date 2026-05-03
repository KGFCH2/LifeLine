import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useNavigate } from 'react-router-dom'
import LoginModal from '../components/LoginModal.jsx'
import {
  User, Mail, Phone, MapPin, Shield, Bell, LogOut,
  ChevronRight, Edit3, Heart, FileText, HelpCircle, Check, X
} from 'lucide-react'

export default function Profile() {
  const { user, logout, updateProfile } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '' })
  const [saved, setSaved] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) return showLogin ? <LoginModal onClose={() => setShowLogin(false)} /> : null

  const startEdit = () => {
    setForm({ name: user.name || '', phone: user.phone || '' })
    setEditing(true)
  }

  const saveEdit = () => {
    updateProfile({ name: form.name, phone: form.phone })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const menuItems = [
    { icon: Heart, label: 'Emergency Contacts', sub: 'Manage your ICE contacts', action: () => navigate('/emergency') },
    { icon: FileText, label: 'Medical Records', sub: 'View appointment history', action: () => navigate('/doctors') },
    { icon: Bell, label: 'Notifications', sub: 'Activity and alerts', action: () => navigate('/dashboard') },
    { icon: Shield, label: 'Privacy & Security', sub: 'Data and permissions', action: () => navigate('/privacy') },
    { icon: HelpCircle, label: 'Help & Support', sub: 'FAQs and documentation', action: () => navigate('/faqs') },
  ]

  const initials = user.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-24 ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <div className="max-w-xl mx-auto px-4 py-12 pt-24">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-black text-[#C8102E] uppercase tracking-[0.2em] mb-2">ACCOUNT</p>
          <h1 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile</h1>
        </div>

        {/* Avatar + Identity */}
        <div className={`rounded-[2rem] border p-8 transition-all ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'} mb-6`}>
          <div className="flex items-center gap-6">
            <div className="relative group">
              {user.photo ? (
                <img 
                  src={user.photo} 
                  alt={user.name} 
                  className="w-20 h-20 rounded-2xl object-cover shadow-xl ring-4 ring-[#C8102E]/20"
                />
              ) : (
                <div className="w-20 h-20 bg-[#C8102E] rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-red-500/20 shrink-0">
                  {initials}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-xl border-4 border-white dark:border-slate-900 flex items-center justify-center">
                <Shield size={12} fill="white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className={`font-black text-2xl tracking-tight truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</h2>
              <p className="text-sm font-medium text-gray-400 truncate">{user.email}</p>
              {user.phone && (
                <p className="text-xs font-bold text-[#C8102E] mt-2 flex items-center gap-1.5 uppercase tracking-widest">
                  <Phone size={12} /> {user.phone}
                </p>
              )}
            </div>
            
            <button
              onClick={startEdit}
              className={`shrink-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all active:scale-95 ${
                isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-red-50 text-[#C8102E] hover:bg-red-100'
              }`}
            >
              <Edit3 size={14} />
              Edit
            </button>
          </div>

          {/* Inline edit form */}
          {editing && (
            <div className={`mt-8 pt-8 border-t space-y-5 ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Full Name</label>
                <input
                  className={`w-full px-5 py-4 rounded-xl border outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-[#C8102E]' : 'bg-gray-50 border-gray-100 focus:border-[#C8102E]'}`}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value.replace(/[^a-zA-Z\s]/g, '') }))}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Phone Number</label>
                <input
                  className={`w-full px-5 py-4 rounded-xl border outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-[#C8102E]' : 'bg-gray-50 border-gray-100 focus:border-[#C8102E]'}`}
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/[^0-9]/g, '') }))}
                  placeholder="+91 ..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditing(false)}
                  className={`flex-1 flex items-center justify-center gap-2 font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all ${
                    isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <X size={16} /> Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#C8102E] hover:bg-[#a50d26] text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-500/20"
                >
                  <Check size={16} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {saved && (
            <div className="mt-4 flex items-center gap-3 text-emerald-500 bg-emerald-500/10 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest">
              <Check size={14} /> Profile updated successfully
            </div>
          )}
        </div>

        {/* Info chips */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'PROVIDER', value: user.provider === 'google' ? 'Google' : 'Email', icon: User },
            { label: 'STATUS', value: 'Active', icon: Shield },
            { label: 'LEVEL', value: 'Silver', icon: Bell },
          ].map((chip) => {
            const Icon = chip.icon
            return (
              <div key={chip.label} className={`group rounded-2xl border p-5 text-center transition-all hover:scale-[1.02] ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                <Icon size={18} className="mx-auto text-[#C8102E] mb-2 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />
                <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{chip.value}</p>
                <p className="text-[9px] text-gray-400 font-bold tracking-widest mt-1 uppercase">{chip.label}</p>
              </div>
            )
          })}
        </div>

        {/* Menu */}
        <div className={`rounded-[2rem] border overflow-hidden transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'} mb-6`}>
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className={`group w-full flex items-center gap-4 px-6 py-5 text-left transition-all ${
                isDark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'
              } ${i < menuItems.length - 1 ? (isDark ? 'border-b border-slate-800' : 'border-b border-gray-50') : ''}`}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <item.icon size={18} className="text-[#C8102E] transition-transform group-hover:scale-110" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                <p className="text-xs text-gray-400 font-medium">{item.sub}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 shrink-0" />
            </button>
          ))}
        </div>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center justify-center gap-3 font-black py-5 rounded-[1.5rem] text-sm uppercase tracking-widest transition-all duration-300 border ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-red-500/50 hover:text-red-500' : 'bg-white border-gray-200 text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-[#C8102E]'
          }`}
        >
          <LogOut size={18} />
          Sign Out
        </button>

        <p className="text-center text-[10px] font-bold text-gray-500 mt-10 uppercase tracking-[0.3em]">
          LifeLine+ · Version 1.0.0
        </p>
      </div>
    </div>
  )
}
