import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useGeolocation } from '../hooks/useGeolocation.js'
import { useEmergency } from '../context/EmergencyContext.jsx'
import LoginModal from '../components/LoginModal.jsx'
import { Stethoscope, Star, Phone, Calendar, X, CheckCircle, MapPin, Clock, Search, Loader2, Crosshair, RefreshCw } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const specialties = ['All', 'Cardiologist', 'Orthopedic', 'General Physician', 'Pediatrician', 'Neurologist', 'Emergency Medicine']

const SPECIALTY_COLORS = {
  'Cardiologist': { bg: 'bg-red-50', darkBg: 'bg-red-900/10', text: 'text-[#C8102E]', darkText: 'text-red-400', dot: 'bg-[#C8102E]' },
  'Orthopedic': { bg: 'bg-blue-50', darkBg: 'bg-blue-900/10', text: 'text-blue-700', darkText: 'text-blue-400', dot: 'bg-blue-600' },
  'General Physician': { bg: 'bg-emerald-50', darkBg: 'bg-emerald-900/10', text: 'text-emerald-700', darkText: 'text-emerald-400', dot: 'bg-emerald-600' },
  'Pediatrician': { bg: 'bg-violet-50', darkBg: 'bg-violet-900/10', text: 'text-violet-700', darkText: 'text-violet-400', dot: 'bg-violet-600' },
  'Neurologist': { bg: 'bg-amber-50', darkBg: 'bg-amber-900/10', text: 'text-amber-700', darkText: 'text-amber-400', dot: 'bg-amber-600' },
  'Emergency Medicine': { bg: 'bg-red-50', darkBg: 'bg-red-900/10', text: 'text-red-700', darkText: 'text-red-400', dot: 'bg-red-600' },
}

const AVATAR_COLORS = [
  'bg-[#C8102E]', 'bg-blue-600', 'bg-emerald-600',
  'bg-violet-600', 'bg-amber-600', 'bg-rose-700',
]

export default function Doctors() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { logActivity } = useEmergency()
  const isDark = theme === 'dark'
  const { location: geoLocation, loading: geoLoading, accuracy, accuracyColor, refreshLocation } = useGeolocation()
  const [showLogin, setShowLogin] = useState(false)
  const [doctors, setDoctors] = useState([])
  const [specialty, setSpecialty] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [patientForm, setPatientForm] = useState({ name: '', contact: '', reason: '' })
  const [searchQuery, setSearchQuery] = useState('')

  const stableLocationRef = useRef(null)
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    if (geoLocation && !stableLocationRef.current) {
      stableLocationRef.current = geoLocation
    }
  }, [geoLocation])

  const location = stableLocationRef.current

  useEffect(() => {
    if (!user) { setShowLogin(true); return }
  }, [user])

  const fetchDoctors = useCallback(async () => {
    if (!location) return
    setLoading(true)
    try {
      const url = `${BACKEND_URL}/api/booking/doctors?lat=${location.lat}&lng=${location.lng}${specialty ? `&specialty=${encodeURIComponent(specialty)}` : ''}&available=true`
      const res = await fetch(url)
      const data = await res.json()
      setDoctors(data.doctors || [])
    } catch (e) {}
    setLoading(false)
  }, [location, specialty])

  useEffect(() => {
    if (location && !hasFetchedRef.current) {
      hasFetchedRef.current = true
      fetchDoctors()
    }
  }, [location, fetchDoctors])

  useEffect(() => {
    if (location && hasFetchedRef.current) {
      fetchDoctors()
    }
  }, [specialty, fetchDoctors])

  const fetchSlots = async (doctorId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/booking/slots/${doctorId}?date=${new Date().toISOString().split('T')[0]}`)
      const data = await res.json()
      setSlots(data.slots || [])
    } catch (e) {}
  }

  const bookAppointment = async () => {
    if (!selectedDoctor || !selectedSlot) return
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/booking/appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          slot: selectedSlot,
          date: new Date().toISOString().split('T')[0],
          patientName: patientForm.name || user.name,
          contact: patientForm.contact || user.phone || '',
          reason: patientForm.reason
        })
      })
      const data = await res.json()
      if (data.status === 'confirmed') {
        setBookingSuccess(true)
        logActivity(user.id, 'booking', `Appointment with ${selectedDoctor.name} confirmed`, 'confirmed')
        setTimeout(() => {
          setBookingSuccess(false); setSelectedDoctor(null); setSelectedSlot(null)
          setPatientForm({ name: '', contact: '', reason: '' })
        }, 3000)
      }
    } catch (e) {}
    setLoading(false)
  }

  const filteredDoctors = doctors.filter(d =>
    !searchQuery ||
    d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user) return showLogin ? <LoginModal onClose={() => setShowLogin(false)} /> : null

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>

      {/* Page Header */}
      <div className={`transition-colors border-b pt-20 pb-8 px-4 sm:px-8 ${isDark ? 'bg-slate-900 border-slate-800 shadow-lg' : 'bg-white border-gray-100'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-black text-[#C8102E] uppercase tracking-[0.2em] mb-2">SPECIALISTS</p>
              <h1 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Find a Doctor</h1>
              <p className={`text-sm font-medium mt-2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>Book appointments with verified specialists near you</p>
            </div>
            <Stethoscope size={40} className={`${isDark ? 'text-slate-800' : 'text-gray-100'}`} />
          </div>

          {/* Search */}
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#C8102E]" />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 text-base rounded-[1.2rem] border outline-none transition-all ${
                isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-[#C8102E]' : 'bg-gray-50 border-gray-200 focus:border-[#C8102E]'
              }`}
            />
          </div>

          {/* Location indicator */}
          <div className={`flex items-center gap-3 mt-5 rounded-2xl px-4 py-3 border ${isDark ? 'bg-slate-800/50 border-slate-800' : 'bg-gray-50 border-gray-100'}`}>
            <Crosshair size={16} className={`${geoLoading ? 'animate-spin' : ''} ${accuracyColor}`} />
            <span className={`text-xs font-bold flex-1 ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>
              {geoLoading ? 'Getting accurate location...' : location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'Detecting location...'}
            </span>
            {!geoLoading && accuracy && (
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${isDark ? 'bg-slate-900 text-slate-300' : 'bg-white shadow-sm'} ${accuracyColor}`}>
                ±{Math.round(accuracy)}m
              </span>
            )}
            <button 
              onClick={() => {
                stableLocationRef.current = null
                hasFetchedRef.current = false
                refreshLocation()
              }}
              className={`p-2 rounded-xl transition-all active:scale-95 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}
            >
              <RefreshCw size={14} className="text-[#C8102E]" />
            </button>
          </div>
        </div>
      </div>

      {/* Specialty filter pills */}
      <div className={`border-b px-4 sm:px-8 py-4 sticky top-14 z-20 transition-colors backdrop-blur-md ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-100'}`}>
        <div className="max-w-4xl mx-auto flex gap-3 overflow-x-auto no-scrollbar">
          {specialties.map(s => {
            const active = (s === 'All' && !specialty) || specialty === s
            return (
              <button
                key={s}
                onClick={() => setSpecialty(s === 'All' ? '' : s)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap uppercase tracking-widest transition-all active:scale-95 ${
                  active
                    ? 'bg-[#C8102E] text-white shadow-lg shadow-red-500/20'
                    : (isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="px-4 sm:px-8 pt-8 max-w-4xl mx-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={32} className="animate-spin text-[#C8102E]" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Finding specialists near you...</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredDoctors.map((doc, idx) => {
              const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length]
              const specStyle = SPECIALTY_COLORS[doc.specialty] || { bg: 'bg-gray-100', darkBg: 'bg-slate-800', text: 'text-gray-600', darkText: 'text-slate-400', dot: 'bg-gray-400' }
              const initials = doc.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'DR'

              return (
                <div
                  key={doc.id}
                  className={`rounded-[2rem] border transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98] ${
                    isDark ? 'bg-slate-900 border-slate-800 hover:border-[#C8102E]/30 shadow-xl' : 'bg-white border-gray-100 shadow-sm hover:shadow-lg'
                  }`}
                >
                  <div className="p-6 flex items-start gap-5">
                    {/* Avatar */}
                    <div className={`w-16 h-16 rounded-2xl ${avatarColor} flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg`}>
                      {initials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className={`font-black text-base leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{doc.name}</h3>
                          <div className={`inline-flex items-center gap-2 mt-1 px-3 py-1 rounded-lg ${isDark ? specStyle.darkBg : specStyle.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${specStyle.dot}`} />
                            <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? specStyle.darkText : specStyle.text}`}>{doc.specialty}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-400 mt-2 font-medium">{doc.hospital}</p>

                      <div className="flex items-center gap-4 mt-4">
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md ${isDark ? 'bg-slate-800' : 'bg-amber-50'}`}>
                          <Star size={12} fill="#f59e0b" className="text-amber-400" />
                          <span className={`text-xs font-black ${isDark ? 'text-amber-400' : 'text-gray-700'}`}>{doc.rating}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <Clock size={11} />
                          {doc.experience}
                        </div>
                        {doc.distance && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <MapPin size={11} />
                            {typeof doc.distance === 'number' ? `${doc.distance.toFixed(1)}km` : doc.distance}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 pb-6 pt-2 flex gap-3">
                    {doc.phone && (
                      <a
                        href={`tel:${doc.phone}`}
                        className={`flex-1 flex items-center justify-center gap-2 font-black py-3.5 rounded-[1.2rem] text-xs transition-all active:scale-95 ${
                          isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Phone size={15} /> Call
                      </a>
                    )}
                    <button
                      onClick={() => { setSelectedDoctor(doc); fetchSlots(doc.id) }}
                      className="flex-[2] flex items-center justify-center gap-2 bg-[#C8102E] hover:bg-[#a50d26] text-white font-black py-3.5 rounded-[1.2rem] text-xs transition-all active:scale-95 shadow-xl shadow-red-500/15"
                    >
                      <Calendar size={15} /> Book Appointment
                    </button>
                  </div>
                </div>
              )
            })}

            {filteredDoctors.length === 0 && !loading && (
              <div className={`col-span-1 sm:col-span-2 text-center py-20 rounded-[2.5rem] border transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Stethoscope size={36} className="text-gray-300" />
                </div>
                <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>No doctors found</p>
                <p className="text-gray-400 text-sm mt-2 font-medium">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className={`w-full sm:w-[460px] rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto border animate-in slide-in-from-bottom-10 duration-500 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
          }`}>
            {bookingSuccess ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20">
                  <CheckCircle size={40} />
                </div>
                <h2 className={`font-black text-2xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Confirmed!</h2>
                <p className="text-sm font-medium text-gray-400">Appointment booked successfully. We'll see you then!</p>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className={`font-black text-2xl tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Book Appointment</h2>
                    <p className={`text-xs font-bold mt-1 uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                      {selectedDoctor.name} · {selectedDoctor.specialty}
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedDoctor(null); setSelectedSlot(null) }}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Slot picker */}
                <div className="mb-8">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Available Slots</p>
                  {slots.length === 0 ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 size={24} className="animate-spin text-[#C8102E]" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-3">
                      {slots.map(s => (
                        <button
                          key={s.time}
                          onClick={() => s.available && setSelectedSlot(s.time)}
                          disabled={!s.available}
                          className={`py-3 rounded-xl text-xs font-black transition-all ${
                            selectedSlot === s.time
                              ? 'bg-[#C8102E] text-white shadow-xl shadow-red-500/20 scale-105'
                              : s.available
                              ? (isDark ? 'bg-slate-800 text-slate-300 hover:border-[#C8102E]/50 border border-slate-700' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-[#C8102E]/30')
                              : (isDark ? 'bg-slate-800/40 text-slate-700 line-through' : 'bg-gray-50 text-gray-300 line-through cursor-not-allowed')
                          }`}
                        >
                          {s.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Patient details */}
                <div className="space-y-4 mb-8">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient Details</p>
                  <input className={`w-full px-5 py-4 rounded-xl border outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-[#C8102E]' : 'bg-gray-50 border-gray-100 focus:border-[#C8102E]'}`} placeholder="Patient Name" value={patientForm.name} onChange={e => setPatientForm(f => ({ ...f, name: e.target.value }))} />
                  <input className={`w-full px-5 py-4 rounded-xl border outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-[#C8102E]' : 'bg-gray-50 border-gray-100 focus:border-[#C8102E]'}`} placeholder="Contact Number" value={patientForm.contact} onChange={e => setPatientForm(f => ({ ...f, contact: e.target.value }))} />
                  <textarea className={`w-full px-5 py-4 rounded-xl border outline-none transition-all min-h-[100px] resize-none ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-[#C8102E]' : 'bg-gray-50 border-gray-100 focus:border-[#C8102E]'}`} placeholder="Reason for visit" value={patientForm.reason} onChange={e => setPatientForm(f => ({ ...f, reason: e.target.value }))} />
                </div>

                <button
                  onClick={bookAppointment}
                  disabled={!selectedSlot || loading}
                  className="w-full bg-[#C8102E] hover:bg-[#a50d26] disabled:opacity-50 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-red-500/20 text-base"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Calendar size={20} />}
                  {loading ? 'Booking...' : selectedSlot ? `Confirm at ${selectedSlot}` : 'Select a slot'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
