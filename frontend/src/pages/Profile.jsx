import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import LoginModal from '../components/LoginModal.jsx'
import {
  User, Mail, Phone, MapPin, Shield, Bell, Moon, LogOut,
  ChevronRight, Edit3, Heart, FileText, HelpCircle
} from 'lucide-react'

export default function Profile() {
  const { user, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '' })

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) return showLogin ? <LoginModal onClose={() => setShowLogin(false)} /> : null

  const startEdit = () => {
    setForm({ name: user.name || '', phone: user.phone || '', address: '' })
    setEditing(true)
  }

  const saveEdit = () => {
    updateProfile({ name: form.name, phone: form.phone })
    setEditing(false)
  }

  const menuItems = [
    { icon: Heart, label: 'Emergency Contacts', action: () => navigate('/emergency') },
    { icon: FileText, label: 'Medical Records', action: () => navigate('/doctors') },
    { icon: Bell, label: 'Notifications', action: () => navigate('/dashboard') },
    { icon: Shield, label: 'Privacy & Security', action: () => navigate('/privacy') },
    { icon: HelpCircle, label: 'Help & Support', action: () => navigate('/faqs') },
  ]

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-5 pb-12 rounded-b-3xl">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-red-100 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="px-4 -mt-8">
        <div className="card text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-red-600">
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h2 className="font-bold text-lg text-gray-900 dark:text-white mt-3">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <button onClick={startEdit} className="mt-3 inline-flex items-center gap-1 text-xs text-red-600 font-medium hover:underline">
            <Edit3 size={12} /> Edit Profile
          </button>
        </div>
      </div>

      {editing && (
        <div className="px-4 mt-4">
          <div className="card space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Name</label>
              <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Phone</label>
              <input className="input-field" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={saveEdit} className="btn-primary flex-1">Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 mt-4">
        <div className="space-y-2">
          {menuItems.map((item, i) => (
            <button key={i} onClick={item.action} className="w-full card flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left">
              <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300">
                <item.icon size={18} />
              </div>
              <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{item.label}</span>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          ))}
        </div>

        <button onClick={handleLogout} className="w-full mt-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  )
}
