// LifeLine+ Home Page - Production Build
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useGeolocation } from '../hooks/useGeolocation.js'
import LoginModal from '../components/LoginModal.jsx'
import HeroSlider from '../components/HeroSlider.jsx'
import {
  Ambulance, Shield, Stethoscope, MapPin, Clock,
  Phone, Mail, Send, CheckCircle, ChevronRight, Zap,
  Navigation, Brain, Heart, ArrowRight, Star, Activity,
  Calendar, Building2, Flame, AlertTriangle
} from 'lucide-react'

const TOP_DOCTORS = [
  { id: 1, name: 'Dr. Priya Sharma', specialty: 'Cardiologist', hospital: 'Apollo Hospital', experience: '14 yrs', rating: 4.9, fee: '₹800', initial: 'PS', available: true },
  { id: 2, name: 'Dr. Arjun Banerjee', specialty: 'Emergency Medicine', hospital: 'AMRI Hospitals', experience: '11 yrs', rating: 4.8, fee: '₹650', initial: 'AB', available: true },
  { id: 3, name: 'Dr. Meera Gupta', specialty: 'General Physician', hospital: 'Fortis Hospital', experience: '9 yrs', rating: 4.7, fee: '₹500', initial: 'MG', available: true },
  { id: 4, name: 'Dr. Rohit Sen', specialty: 'Orthopedic', hospital: 'SSKM Hospital', experience: '16 yrs', rating: 4.8, fee: '₹900', initial: 'RS', available: false },
]

export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { location: geoLoc } = useGeolocation()
  const [showLogin, setShowLogin] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)
  const [contactError, setContactError] = useState('')

  useEffect(() => {
    if (location.state?.showLogin) {
      setShowLogin(true)
      // Clear state after reading it
      window.history.replaceState({}, document.title)
    }
  }, [location])

  const handleEmergency = () => {
    if (!user) setShowLogin(true)
    else navigate('/emergency')
  }

  const handleDoctors = () => {
    if (!user) setShowLogin(true)
    else navigate('/doctors')
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactLoading(true)
    setContactError('')

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
      const accountName = user?.name || user?.displayName || ''
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          ...(accountName ? { accountName } : {})
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setSent(true)
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => { setSent(false) }, 3000)
    } catch (err) {
      setContactError(err.message || 'Failed to send message')
    } finally {
      setContactLoading(false)
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0f172a]' : 'bg-white'}`}>
      <HeroSlider onEmergency={handleEmergency} onDoctors={handleDoctors} />

      {/* ─── QUICK STATS ─────────────────────────────────────────────────── */}
      <section className={`py-12 border-b ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-gray-50 border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Avg Response', value: '4.8 min', icon: Clock, color: 'text-red-500' },
            { label: 'Active Fleet', value: '1,240+', icon: Ambulance, color: 'text-blue-500' },
            { label: 'Partner Hospitals', value: '450+', icon: Building2, color: 'text-emerald-500' },
            { label: 'Lives Saved', value: '85k+', icon: Activity, color: 'text-[#C8102E]' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${isDark ? 'bg-slate-900 shadow-xl' : 'bg-white shadow-sm'}`}>
                <stat.icon size={22} className={stat.color} />
              </div>
              <div>
                <p className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SERVICES ────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] mb-4 block">OUR ECOSYSTEM</span>
              <h2 className={`text-4xl sm:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Advanced Emergency <br /> Response Infrastructure
              </h2>
            </div>
            <button 
              onClick={() => navigate('/doctors')}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#C8102E] hover:gap-4 transition-all"
            >
              Explore Services <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'AI Ambulance Dispatch', 
                desc: 'Smart routing and predictive allocation ensure the nearest ambulance reaches you in record time.',
                icon: Navigation,
                color: 'bg-blue-500'
              },
              { 
                title: 'Civilian Mode', 
                desc: 'When every second counts and no ambulance is near, Gemini AI authorizes personal vehicles for emergency transit.',
                icon: Brain,
                color: 'bg-amber-500'
              },
              { 
                title: 'Doctor Appointments', 
                desc: 'Instantly connect with top specialists and hospitals for priority care and follow-ups.',
                icon: Stethoscope,
                color: 'bg-[#C8102E]'
              }
            ].map((s, idx) => (
              <div 
                key={idx} 
                className={`p-10 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 group ${
                  isDark ? 'bg-slate-900 border-slate-800 hover:border-[#C8102E]/40' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/40'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center text-white shadow-2xl shadow-inherit mb-8 group-hover:scale-105 transition-transform`}>
                  <s.icon size={28} />
                </div>
                <h3 className={`text-2xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.title}</h3>
                <p className={`text-base leading-relaxed font-medium mb-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{s.desc}</p>
                <div className={`w-10 h-1 bg-gray-100 dark:bg-slate-800 rounded-full group-hover:w-20 group-hover:bg-[#C8102E] transition-all`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DOCTORS PREVIEW ─────────────────────────────────────────────── */}
      <section className={`py-24 px-4 transition-colors ${isDark ? 'bg-slate-950/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Specialists Nearby</h2>
            <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Book instant consultations with verified medical experts</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOP_DOCTORS.map((doc) => (
              <div key={doc.id} className={`rounded-[2rem] border p-6 transition-all group ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-gray-100 hover:shadow-xl'
              }`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#C8102E] rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg shadow-red-500/20">
                    {doc.initial}
                  </div>
                  <div>
                    <h4 className={`font-black text-base leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{doc.name}</h4>
                    <p className="text-[11px] font-bold text-[#C8102E] uppercase tracking-wider">{doc.specialty}</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-400">Hospital</span>
                    <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>{doc.hospital}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-400">Rating</span>
                    <span className="text-amber-500 flex items-center gap-1"><Star size={12} fill="currentColor" /> {doc.rating}</span>
                  </div>
                </div>
                <button 
                  onClick={handleDoctors}
                  className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-50 text-gray-900 hover:bg-[#C8102E] hover:text-white'
                  }`}
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT / MISSION ────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-[#C8102E]">
            <Heart size={40} fill="currentColor" />
          </div>
          <h2 className={`text-4xl sm:text-6xl font-black mb-8 tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Saving lives is in <br /> our DNA.
          </h2>
          <p className={`text-xl leading-relaxed font-medium mb-12 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            LifeLine+ isn't just an app. It's a digital shield for millions of families in India. 
            By merging AI with real-world emergency fleets, we are cutting response times 
            down to the absolute minimum.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { name: 'Babin Bid', role: 'Team Lead & Full Stack Developer', initials: 'BB', portfolio: 'https://babin-portfolio.vercel.app/' },
              { name: 'Atanu Saha', role: 'Frontend Developer & Tester', initials: 'AS', portfolio: null },
              { name: 'Rohit Kumar Adak', role: 'Idea, Architect & Backend Dev', initials: 'RK', portfolio: 'https://rohitadak.dev'},
              { name: 'Sagnik Bachhar', role: 'Researcher', initials: 'SB', portfolio: null },
            ].map((m) => (
              <div key={m.name} className={`flex flex-col items-center text-center p-6 rounded-[2rem] border transition-all duration-300 group ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-[#C8102E]/30 shadow-xl' : 'bg-white border-gray-100 hover:border-[#C8102E]/20 hover:shadow-lg'
              }`}>
                {m.portfolio ? (
                  <a href={m.portfolio} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-2xl bg-[#C8102E] flex items-center justify-center text-white font-black text-xl mb-4 shadow-xl shadow-[#C8102E]/20 group-hover:scale-105 transition-transform">
                    {m.initials}
                  </a>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#C8102E] flex items-center justify-center text-white font-black text-xl mb-4 shadow-xl shadow-[#C8102E]/20 group-hover:scale-105 transition-transform">
                    {m.initials}
                  </div>
                )}
                <p className={`text-base font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{m.name}</p>
                <p className="text-xs text-gray-400 mt-2 font-medium leading-tight group-hover:text-[#C8102E] transition-colors">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className={`py-24 px-4 transition-colors ${isDark ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] mb-4">CONTACT US</span>
            <h2 className={`text-4xl sm:text-5xl font-black mb-6 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>We are here 24/7</h2>
            <p className={`max-w-xl text-lg ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              For emergencies, feedback, partnerships, or technical support — reach us anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="space-y-6">
              <h3 className={`font-black text-xl mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Get in touch</h3>
              {[
                { icon: Phone, label: 'Emergency Helpline', value: '108 / 112 — Toll Free', href: 'tel:108', bg: 'bg-red-50', darkBg: 'bg-red-900/10', color: 'text-[#C8102E]' },
                { icon: Mail, label: 'Email Support', value: 'support@lifelineplus.in', href: 'mailto:support@lifelineplus.in', bg: 'bg-blue-50', darkBg: 'bg-blue-900/10', color: 'text-blue-600' },
                { icon: MapPin, label: 'Headquarters', value: 'Kolkata, West Bengal, India', href: null, bg: 'bg-gray-50', darkBg: 'bg-slate-800', color: 'text-gray-600' },
              ].map((c) => {
                const Icon = c.icon
                const inner = (
                  <div className={`flex items-center gap-5 p-5 rounded-[1.5rem] border transition-all group ${
                    isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-gray-50 border-gray-100 hover:shadow-md'
                  }`}>
                    <div className={`w-12 h-12 ${isDark ? c.darkBg : c.bg} rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                      <Icon size={20} className={c.color} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{c.label}</p>
                      <p className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>{c.value}</p>
                    </div>
                  </div>
                )
                return c.href ? <a key={c.label} href={c.href} className="block">{inner}</a> : <div key={c.label}>{inner}</div>
              })}
            </div>

            <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-gray-50 border-gray-100'}`}>
              <h3 className={`font-black text-xl mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Send a message</h3>
              {sent ? (
                <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                    <CheckCircle size={40} />
                  </div>
                  <h4 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Message Sent!</h4>
                  <p className="text-sm text-gray-400 font-medium">We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <input className={`w-full px-5 py-4 rounded-xl border outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-[#C8102E]' : 'bg-white border-gray-200 focus:border-[#C8102E]'}`} placeholder="Your Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
                  <input className={`w-full px-5 py-4 rounded-xl border outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-[#C8102E]' : 'bg-white border-gray-200 focus:border-[#C8102E]'}`} type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required />
                  <textarea className={`w-full px-5 py-4 rounded-xl border outline-none transition-all min-h-[120px] resize-none ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-[#C8102E]' : 'bg-white border-gray-200 focus:border-[#C8102E]'}`} placeholder="Your message..." value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} required />
                  {contactError && <p className="text-xs text-red-500 font-bold">{contactError}</p>}
                  <button type="submit" disabled={contactLoading} className="w-full bg-[#C8102E] hover:bg-[#a50d26] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-red-500/20 transition-all mt-4 disabled:opacity-50">
                    <Send size={18} />
                    {contactLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── NATIONAL HELPLINES ─────────────────────────────────────────── */}
      <section className={`py-16 px-4 border-t ${isDark ? 'bg-slate-950/30 border-slate-800' : 'bg-red-50/30 border-red-100'}`}>
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="mb-10">
            <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>National Emergency Helplines</h2>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest max-w-lg mx-auto">Available 24/7 across India for immediate assistance</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
            {[
              { label: 'Ambulance', number: '108', color: 'text-red-600', icon: Ambulance, bg: 'bg-red-500/10' },
              { label: 'Police', number: '100', color: 'text-blue-600', icon: Shield, bg: 'bg-blue-500/10' },
              { label: 'Fire', number: '101', color: 'text-orange-600', icon: Flame, bg: 'bg-orange-500/10' },
              { label: 'Emergency', number: '112', color: 'text-[#C8102E]', icon: AlertTriangle, bg: 'bg-red-600/10' },
            ].map((h) => {
              const Icon = h.icon;
              return (
                <a 
                  key={h.label} 
                  href={`tel:${h.number}`} 
                  className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all hover:scale-105 active:scale-95 group ${
                    isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl' : 'bg-white border-gray-100 shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className={`w-12 h-12 ${h.bg} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                    <Icon size={24} className={h.color} />
                  </div>
                  <span className={`text-2xl font-black ${h.color}`}>{h.number}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">{h.label}</span>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <div className="pb-12" />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}
