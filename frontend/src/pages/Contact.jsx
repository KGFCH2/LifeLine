import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useEmergency } from '../context/EmergencyContext.jsx'

export default function Contact() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { logActivity } = useEmergency()
  const isDark = theme === 'dark'
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
      const accountName = user?.name || ''
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          ...(accountName ? { accountName } : {})
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to send message')

      setSent(true)
      logActivity(user?.id, 'booking', 'Support message sent', 'completed')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setSent(false), 3000)
    } catch (err) {
      setError(err.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <div className={`pt-24 pb-16 px-6 text-center ${isDark ? 'bg-slate-900 border-b border-slate-800' : 'bg-gradient-to-br from-[#C8102E] to-[#a50d26] text-white'} rounded-b-[3rem] shadow-xl`}>
        <h1 className="text-4xl font-black mb-3">Contact Us</h1>
        <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-red-100'}`}>We are here 24/7 for emergencies and feedback</p>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8 grid grid-cols-1 gap-4">
        {[
          { href: "tel:108", icon: Phone, color: "text-red-600", bg: "bg-red-50", darkBg: "bg-red-900/10", title: "Emergency Helpline", desc: "108 / 112 - Toll Free" },
          { icon: Mail, color: "text-blue-600", bg: "bg-blue-50", darkBg: "bg-blue-900/10", title: "Email Support", desc: "support@lifeline.plus" },
          { icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50", darkBg: "bg-emerald-900/10", title: "Headquarters", desc: "Kolkata, West Bengal, India" }
        ].map((item, idx) => {
          const Icon = item.icon
          const content = (
            <div className={`p-5 rounded-2xl border flex items-center gap-4 transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className={`w-12 h-12 ${isDark ? item.darkBg : item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={20} className={item.color} />
              </div>
              <div>
                <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
                <p className="text-xs text-gray-500 font-bold">{item.desc}</p>
              </div>
            </div>
          )
          return item.href ? <a key={idx} href={item.href}>{content}</a> : <div key={idx}>{content}</div>
        })}
      </div>

      <div className="max-w-lg mx-auto px-4 mt-10">
        <h2 className={`font-black text-xl mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Send a Message</h2>
        {sent ? (
          <div className={`p-10 rounded-[2rem] border text-center transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Message Sent!</h3>
            <p className="text-sm text-gray-500 font-medium">We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={`p-8 rounded-[2rem] border space-y-4 transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
            <input className={`w-full px-5 py-4 rounded-xl border outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-[#C8102E]' : 'bg-gray-50 border-gray-100 focus:border-[#C8102E]'}`} placeholder="Your Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <input className={`w-full px-5 py-4 rounded-xl border outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-[#C8102E]' : 'bg-gray-50 border-gray-100 focus:border-[#C8102E]'}`} placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            <textarea className={`w-full px-5 py-4 rounded-xl border outline-none transition-all min-h-[140px] resize-none ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-[#C8102E]' : 'bg-gray-50 border-gray-100 focus:border-[#C8102E]'}`} placeholder="Your message..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-[#C8102E] hover:bg-[#a50d26] disabled:opacity-50 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-red-500/20 transition-all">
              <Send size={18} /> {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
