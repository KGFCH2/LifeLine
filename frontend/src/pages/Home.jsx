import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useGeolocation } from '../hooks/useGeolocation.js'
import LoginModal from '../components/LoginModal.jsx'
import HeroSlider from '../components/HeroSlider.jsx'
import {
  Ambulance, Shield, Stethoscope, MapPin, Clock,
  Phone, Mail, Send, CheckCircle, ChevronRight, Zap,
  Navigation, Brain, Heart, ArrowRight, Star, Activity,
  Calendar, Building2
} from 'lucide-react'

const TOP_DOCTORS = [
  { id: 1, name: 'Dr. Priya Sharma', specialty: 'Cardiologist', hospital: 'Apollo Hospital', experience: '14 yrs', rating: 4.9, fee: '₹800', initial: 'PS', available: true },
  { id: 2, name: 'Dr. Arjun Banerjee', specialty: 'Emergency Medicine', hospital: 'AMRI Hospitals', experience: '11 yrs', rating: 4.8, fee: '₹650', initial: 'AB', available: true },
  { id: 3, name: 'Dr. Meera Gupta', specialty: 'General Physician', hospital: 'Fortis Hospital', experience: '9 yrs', rating: 4.7, fee: '₹500', initial: 'MG', available: true },
  { id: 4, name: 'Dr. Rohit Sen', specialty: 'Orthopedic', hospital: 'SSKM Hospital', experience: '16 yrs', rating: 4.8, fee: '₹900', initial: 'RS', available: false },
]

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { location: geoLocation, loading: geoLoading } = useGeolocation()
  const [showLogin, setShowLogin] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleEmergency = () => {
    if (!user) setShowLogin(true)
    else navigate('/emergency')
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setForm({ name: '', email: '', message: '' })
    }, 3000)
  }

  const features = [
    { icon: MapPin, title: 'Smart Discovery', desc: 'Instant GPS-based discovery of hospitals, ambulances, and emergency services near you.', iconColor: 'text-[#C8102E]', bg: 'bg-red-50', darkBg: 'bg-red-900/10' },
    { icon: Navigation, title: 'Live Tracking', desc: 'Real-time ambulance tracking with traffic-aware routing and ETA via Socket.io.', iconColor: 'text-blue-600', bg: 'bg-blue-50', darkBg: 'bg-blue-900/10' },
    { icon: Brain, title: 'AI Verification', desc: 'Gemini AI validates civilian emergency requests instantly — vehicle, purpose, contact.', iconColor: 'text-violet-600', bg: 'bg-violet-50', darkBg: 'bg-violet-900/10' },
    { icon: Stethoscope, title: 'Doctor Booking', desc: 'Discover nearby doctors, filter by specialty, check available slots and confirm.', iconColor: 'text-emerald-600', bg: 'bg-emerald-50', darkBg: 'bg-emerald-900/10' },
    { icon: Shield, title: 'Police Coordination', desc: 'Auto-detect police stations along route and broadcast live alerts instantly.', iconColor: 'text-blue-600', bg: 'bg-blue-50', darkBg: 'bg-blue-900/10' },
    { icon: Zap, title: 'Instant Response', desc: 'A 5-minute acceptance window with automatic fallback — you are never alone.', iconColor: 'text-amber-600', bg: 'bg-amber-50', darkBg: 'bg-amber-900/10' },
  ]

  const steps = [
    { num: '01', title: 'Request Help', desc: 'Tap "Book Emergency", allow location, and we find the nearest available ambulance.', icon: Ambulance },
    { num: '02', title: 'Live Tracking', desc: 'Watch your ambulance move on the map with real-time ETA and alternate route suggestions.', icon: Activity },
    { num: '03', title: 'Help Arrives', desc: 'Police alerted along route. Nearest hospital pre-selected. Every second is optimized.', icon: Heart },
  ]

  const helplines = [
    { label: 'Ambulance', number: '108', iconBg: 'bg-[#C8102E]', cardBg: 'bg-red-50', darkCardBg: 'bg-red-900/10', border: 'border-red-100', darkBorder: 'border-red-900/20' },
    { label: 'Emergency', number: '112', iconBg: 'bg-orange-500', cardBg: 'bg-orange-50', darkCardBg: 'bg-orange-900/10', border: 'border-orange-100', darkBorder: 'border-orange-900/20' },
    { label: 'Police', number: '100', iconBg: 'bg-blue-600', cardBg: 'bg-blue-50', darkCardBg: 'bg-blue-900/10', border: 'border-blue-100', darkBorder: 'border-blue-900/20' },
    { label: 'Fire', number: '101', iconBg: 'bg-amber-500', cardBg: 'bg-amber-50', darkCardBg: 'bg-amber-900/10', border: 'border-amber-100', darkBorder: 'border-amber-900/20' },
  ]

  return (
    <div className={`overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-[#0f172a]' : 'bg-white'}`}>

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <HeroSlider handleEmergency={handleEmergency} />

      {/* ─── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className={`py-24 px-4 transition-colors ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] mb-4">FEATURES</span>
            <h2 className={`text-4xl sm:text-5xl font-black mb-6 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Everything you need in a crisis</h2>
            <p className={`max-w-xl text-lg ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              LifeLine+ combines real-time data, AI, and live coordination so you always get the fastest possible help.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className={`rounded-3xl p-8 border transition-all duration-300 group ${
                  isDark ? 'bg-slate-900 border-slate-800 hover:border-[#C8102E]/30 shadow-xl' : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1'
                }`}>
                  <div className={`w-14 h-14 ${isDark ? f.darkBg : f.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className={f.iconColor} />
                  </div>
                  <h3 className={`font-bold text-xl mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
                  <p className={`text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className={`py-24 px-4 transition-colors ${isDark ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E] mb-3">HOW IT WORKS</span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Help in 3 simple steps</h2>
            <p className={`max-w-md text-base ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              From tap to arrival — we handle everything so you can focus on what matters most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className={`hidden md:block absolute top-14 left-[18%] right-[18%] h-px border-t border-dashed ${isDark ? 'border-slate-700' : 'border-gray-200'}`} />
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.num} className="flex flex-col items-center text-center group">
                  <div className="relative mb-8">
                    <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center transition-all duration-500 group-hover:rotate-[10deg] ${isDark ? 'bg-slate-900 border border-slate-800 shadow-xl' : 'bg-white border border-gray-100 shadow-sm'}`}>
                      <div className="w-16 h-16 bg-[#C8102E] rounded-2xl flex items-center justify-center shadow-xl shadow-[#C8102E]/30 transition-transform group-hover:scale-110">
                        <Icon size={30} className="text-white" />
                      </div>
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#C8102E] text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-[#0f172a]">
                      <span className="text-xs font-black">{step.num}</span>
                    </div>
                  </div>
                  <h3 className={`font-bold mb-3 text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                  <p className={`text-base leading-relaxed max-w-[220px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{step.desc}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-20 text-center">
            <button
              onClick={handleEmergency}
              className="inline-flex items-center gap-3 bg-[#C8102E] hover:bg-[#a50d26] text-white font-black px-10 py-5 rounded-2xl shadow-2xl shadow-red-500/30 transition-all duration-300 hover:scale-105 active:scale-95 text-lg"
            >
              <Ambulance size={22} />
              Try It Now
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── TOP DOCTORS ─────────────────────────────────────────────────── */}
      <section className={`py-24 px-4 transition-colors ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] mb-4 block">TOP DOCTORS</span>
              <h2 className={`text-4xl sm:text-5xl font-black mb-4 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Trusted specialists, nearby</h2>
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                Book an appointment with a verified specialist in minutes.
              </p>
            </div>
            <button 
              onClick={() => navigate('/doctors')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all mx-auto md:mx-0 ${
                isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-gray-900 border border-gray-100 hover:bg-gray-50 shadow-sm'
              }`}
            >
              View all doctors <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOP_DOCTORS.map((doc) => (
              <div 
                key={doc.id}
                className={`group rounded-[2rem] p-6 border transition-all duration-500 ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800 hover:border-[#C8102E]/30 shadow-2xl' 
                    : 'bg-white border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2'
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${
                    isDark ? 'bg-slate-800 text-white border border-slate-700' : 'bg-red-50 text-[#C8102E]'
                  }`}>
                    {doc.initial}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    doc.available 
                      ? (isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600')
                      : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-gray-100 text-gray-400')
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${doc.available ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                    {doc.available ? 'Available Today' : 'Unavailable'}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className={`font-black text-lg leading-tight mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{doc.name}</h3>
                  <p className="text-sm font-bold text-[#C8102E] mb-3">{doc.specialty}</p>
                  
                  <div className={`space-y-1.5 text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    <p className="flex items-center gap-2">
                      <Building2 size={12} className="shrink-0" /> {doc.hospital} · {doc.experience}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100/10">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star size={14} fill="currentColor" /> {doc.rating}
                      </div>
                      <div className={`font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {doc.fee}
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/doctors')}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                    isDark 
                      ? 'bg-slate-800 text-white hover:bg-[#C8102E] hover:shadow-[0_10px_20px_rgba(200,16,46,0.2)]' 
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-900 hover:text-white shadow-sm'
                  }`}
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EMERGENCY HELPLINES ──────────────────────────────────────────── */}
      <section className={`py-16 px-4 transition-colors border-y ${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-gray-100'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-12 h-12 bg-[#C8102E] rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-[#C8102E]/20">
              <Phone size={22} className="text-white" />
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>India Emergency Helplines</h2>
            <p className="text-xs text-gray-400 font-medium">Tap to call — always free, always available</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {helplines.map((h) => (
              <a
                key={h.number}
                href={`tel:${h.number}`}
                className={`border rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group ${
                  isDark ? `${h.darkCardBg} ${h.darkBorder}` : `${h.cardBg} ${h.border}`
                }`}
              >
                <div className={`w-10 h-10 ${h.iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
                  <Phone size={17} className="text-white" />
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{h.number}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{h.label}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEAM ─────────────────────────────────────────────────────────── */}
      <section className={`py-24 px-4 transition-colors ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8102E] mb-4">THE TEAM</span>
            <h2 className={`text-4xl sm:text-5xl font-black mb-6 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Built with purpose</h2>
            <p className={`max-w-xl text-lg ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              We are the <strong>LifeLine+</strong> team — dedicated to rapid emergency response across India.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { name: 'Babin Bid', role: 'Team Lead & Architecture', initials: 'BB' },
              { name: 'Atanu Saha', role: 'Frontend Developer', initials: 'AS' },
              { name: 'Rohit Kumar Adak', role: 'Idea & Backend Dev', initials: 'RK' },
              { name: 'Sagnik Bachhar', role: 'Research & Developer', initials: 'SB' },
            ].map((m) => (
              <div key={m.name} className={`flex flex-col items-center text-center p-6 rounded-[2rem] border transition-all duration-300 group ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-[#C8102E]/30 shadow-xl' : 'bg-white border-gray-100 hover:border-[#C8102E]/20 hover:shadow-lg'
              }`}>
                <div className="w-16 h-16 rounded-2xl bg-[#C8102E] flex items-center justify-center text-white font-black text-xl mb-4 shadow-xl shadow-[#C8102E]/20 group-hover:scale-110 transition-transform">
                  {m.initials}
                </div>
                <p className={`text-base font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{m.name}</p>
                <p className="text-xs text-gray-400 mt-2 font-medium leading-tight">{m.role}</p>
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
                  <div className={`flex items-center gap-5 p-5 rounded-[1.5rem] border transition-all ${
                    isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-gray-50 border-gray-100 hover:shadow-md'
                  }`}>
                    <div className={`w-12 h-12 ${isDark ? c.darkBg : c.bg} rounded-2xl flex items-center justify-center shrink-0`}>
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
                  <button type="submit" className="w-full bg-[#C8102E] hover:bg-[#a50d26] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-red-500/20 transition-all active:scale-95 mt-4">
                    <Send size={18} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="pb-12" />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}
