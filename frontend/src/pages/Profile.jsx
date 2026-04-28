import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import LoginModal from '../components/LoginModal.jsx'
import {
  User, Mail, Phone, MapPin, Shield, Bell, LogOut,
  ChevronRight, Edit3, Heart, FileText, HelpCircle, Check, X
} from 'lucide-react'

export default function Profile() {
  const { user, logout, updateProfile } = useAuth()
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
    <div className="min-h-screen bg-gray-50 pb-24" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-medium text-[#C8102E] mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>ACCOUNT</p>
          <h1 className="text-2xl font-extrabold text-gray-900">Profile</h1>
        </div>

        {/* Avatar + Identity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#C8102E] rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-md shadow-[#C8102E]/15 shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-900 text-lg leading-tight truncate">{user.name}</h2>
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
              {user.phone && (
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Phone size={10} /> {user.phone}
                </p>
              )}
            </div>
            <button
              onClick={startEdit}
              className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#C8102E] bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-all"
            >
              <Edit3 size={12} />
              Edit
            </button>
          </div>

          {/* Inline edit form */}
          {editing && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Name</label>
                <input
                  className="input-field text-sm"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Phone</label>
                <input
                  className="input-field text-sm"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 ..."
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm transition-all"
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#C8102E] hover:bg-[#a50d26] text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm"
                >
                  <Check size={14} /> Save
                </button>
              </div>
            </div>
          )}

          {saved && (
            <div className="mt-3 flex items-center gap-2 text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 text-xs font-medium">
              <Check size={13} /> Profile updated successfully
            </div>
          )}
        </div>

        {/* Info chips */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Account Type', value: user.provider === 'google' ? 'Google' : 'Email', icon: User },
            { label: 'Status', value: 'Active', icon: Shield },
            { label: 'Member Since', value: 'Apr 2025', icon: Bell },
          ].map((chip) => {
            const Icon = chip.icon
            return (
              <div key={chip.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
                <Icon size={14} className="mx-auto text-gray-300 mb-1" />
                <p className="text-xs font-bold text-gray-900">{chip.value}</p>
                <p className="text-[9px] text-gray-400 mt-0.5">{chip.label}</p>
              </div>
            )
          })}
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors ${i < menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                <item.icon size={16} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
              <ChevronRight size={15} className="text-gray-300 shrink-0" />
            </button>
          ))}
        </div>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-600 hover:text-[#C8102E] font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-sm"
        >
          <LogOut size={16} />
          Sign Out
        </button>

        <p className="text-center text-[11px] text-gray-300 mt-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          LifeLine+ · v1.0.0
        </p>
      </div>
    </div>
  )
}
