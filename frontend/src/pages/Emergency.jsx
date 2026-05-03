import { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import MapView from '../components/MapView.jsx'
import LoginModal from '../components/LoginModal.jsx'
import Footer from '../components/Footer.jsx'
import { useSocket } from '../hooks/useSocket.js'
import {
  Ambulance, Phone, MapPin, Clock, Navigation, AlertTriangle, ChevronLeft,
  Shield, Car, X, CheckCircle, Siren, Route, User, Activity, MessageSquare,
  Timer, ArrowRight, Loader2, Building2, Pill, Stethoscope, Sparkles, Send, Bot,
  RefreshCw, Mic
} from 'lucide-react'
import { useEmergency } from '../context/EmergencyContext.jsx'

const BACKEND_URL = import.meta.env.DEV ? 'http://localhost:5000' : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000')

const lucideSvg = (inner, size, stroke) => (
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`
)

const LUCIDE = {
  mapPinBlue: lucideSvg('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', 12, '#2563eb'),
  mapPinRed: lucideSvg('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', 18, '#C8102E'),
  phoneGreen: lucideSvg('<path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h4.09a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9.03 9.91a16 16 0 0 0 6 6l1.27-1.42a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/>', 14, '#059669'),
  clockOrange: lucideSvg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', 12, '#c2410c'),
  starAmber: lucideSvg('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', 12, '#d97706'),
}

const buildHospitalInfoHtml = ({ name, address, phone, rating, openNow, distText, etaText, isDark }) => {
  const safeName = name || 'Hospital'
  const safeAddress = address || ''
  const canCall = phone && phone !== 'N/A'
  const ratingNum = Number(rating)
  const ratingText = Number.isFinite(ratingNum) ? ratingNum.toFixed(1) : null
  const openText = openNow === true ? 'Open now' : openNow === false ? 'Closed' : null
  const openBg = openNow === true ? (isDark ? '#064e3b' : '#ecfdf3') : (isDark ? '#7f1d1d' : '#fef2f2')
  const openFg = openNow === true ? (isDark ? '#6ee7b7' : '#059669') : (isDark ? '#fca5a5' : '#dc2626')
  const cardBg = isDark ? '#1e293b' : '#ffffff'
  const cardBorder = isDark ? '#334155' : '#e5e7eb'
  const textTitle = isDark ? '#f8fafc' : '#111827'
  const textSub = isDark ? '#94a3b8' : '#6b7280'

  return `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:220px;">
      <div style="background:${cardBg};border:1px solid ${cardBorder};border-radius:14px;box-shadow:0 10px 25px rgba(0,0,0,0.2);overflow:hidden;">
        <div style="height:3px;background:linear-gradient(90deg,#C8102E,#ef4444);"></div>
        <div style="padding:10px;">
          <div style="display:flex;align-items:flex-start;gap:8px;">
            <div style="width:32px;height:32px;border-radius:10px;background:#fee2e2;border:1px solid #fecaca;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${LUCIDE.mapPinRed}
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:12px;font-weight:700;color:${textTitle};line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${safeName}</div>
              <div style="font-size:9px;color:${textSub};line-height:1.3;margin-top:1px;">${safeAddress}</div>
            </div>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;">
            ${distText ? `<span style="display:inline-flex;align-items:center;gap:3px;padding:3px 5px;border-radius:6px;background:${isDark ? '#1e3a8a' : '#eff6ff'};color:${isDark ? '#93c5fd' : '#1d4ed8'};font-size:9px;font-weight:600;">${distText}</span>` : ''}
            ${ratingText ? `<span style="display:inline-flex;align-items:center;gap:3px;padding:3px 5px;border-radius:6px;background:${isDark ? '#78350f' : '#fef3c7'};color:${isDark ? '#fcd34d' : '#92400e'};font-size:9px;font-weight:600;">★ ${ratingText}</span>` : ''}
            ${openText ? `<span style="display:inline-flex;align-items:center;gap:3px;padding:3px 5px;border-radius:6px;background:${openBg};color:${openFg};font-size:9px;font-weight:600;">${openText}</span>` : ''}
          </div>
        </div>
      </div>
    </div>
  `
}

// ── LifeLine+ Chatbot Component ───────────────────────────────────────────
function LifeLineChatbot({ isDark, chatMessages, onSendMessage, loading }) {
  const scrollRef = useRef(null)
  const [input, setInput] = useState('')

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [chatMessages])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {chatMessages.map((m, i) => (
          <div key={i} className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
              m.role === 'user' 
                ? (isDark ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-700') 
                : 'bg-[#C8102E] text-white'
            }`}>
              {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
              m.role === 'user' 
                ? 'bg-[#C8102E] text-white rounded-tr-none' 
                : (isDark ? 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none' : 'bg-gray-100 text-gray-800 rounded-tl-none')
            }`}>
              <div className="markdown-content">
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className={`px-4 py-3 rounded-2xl flex items-center gap-2 ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>
      
      <div className={`p-3 border-t transition-colors ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-gray-100 bg-white'}`}>
        <div className="relative flex items-center gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (onSendMessage(input), setInput(''))}
            placeholder="Ask AI anything about this emergency..."
            className={`flex-1 pl-4 pr-12 py-3 rounded-xl text-sm outline-none transition-all ${
              isDark ? 'bg-slate-800 text-white border-slate-700 focus:border-[#C8102E]' : 'bg-gray-50 border-gray-200 focus:border-[#C8102E]'
            }`}
          />
          <button 
            onClick={() => { onSendMessage(input); setInput(''); }}
            disabled={loading || !input.trim()}
            className="absolute right-1.5 w-9 h-9 bg-[#C8102E] text-white rounded-lg flex items-center justify-center hover:bg-[#a50d26] transition-all disabled:opacity-50 active:scale-90"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2 font-medium italic">
          Powered by Gemini & Groq 1.5 Flash
        </p>
      </div>
    </div>
  )
}

export default function Emergency() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const isDark = theme === 'dark'

  const { 
    phase, setPhase, activeAmbulance, setActiveAmbulance, 
    nearestHospital, setNearestHospital, activeRoute, setActiveRoute, 
    demoProgress, setDemoProgress, demoAmbulancePos, setDemoAmbulancePos, 
    demoCountdown, setDemoCountdown, demoMode, setDemoMode, 
    resetEmergency, startLeg1Animation, startLeg2Animation, 
    showArrivalNotification, setShowArrivalNotification, 
    setDemoPath, demoPath, logActivity,
    chatMessages, setChatMessages
  } = useEmergency()
  const [destination, setDestination] = useState(nearestHospital?.location || null)

  // ── Location state — only update marker, not used for hospital search ──
  const [userLocation, setUserLocation] = useState(null)         // live dot on map
  const [locationAccuracy, setLocationAccuracy] = useState(null)
  const [locationError, setLocationError] = useState(null)

  // ── Stable GPS ref — locked once we have a good fix, used by all fetches ──
  const stableGpsRef = useRef(null)   // { lat, lng } — never changes after first fix
  const [nearbyHospitals, setNearbyHospitals] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(false)
  const [ambulances, setAmbulances] = useState([])
  const [requestStatus, setRequestStatus] = useState(null)
  const [tracking, setTracking] = useState(null)
  const [civilianForm, setCivilianForm] = useState({ vehicleNumber: '', purpose: '', contact: '' })
  const [civilianResult, setCivilianResult] = useState(null)
  const [show3D, setShow3D] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedAmbulance, setSelectedAmbulance] = useState(null)
  const [userAvatar, setUserAvatar] = useState(null)
  const [selectedHospitalIdx, setSelectedHospitalIdx] = useState(-1)
  const [activeServiceType, setActiveServiceType] = useState('hospital')
  const [aiContextData, setAiContextData] = useState([])
  const hasFetchedAiContext = useRef(false)
  const watchIdRef = useRef(null)
  const mainContentRef = useRef(null)

  const scrollToTop = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  const fetchAllServicesForAI = async (coords) => {
    if (!window.google?.maps?.places) return
    try {
      const types = ['hospital', 'police', 'pharmacy']
      const service = new window.google.maps.places.PlacesService(document.createElement('div'))
      
      const allResults = await Promise.all(types.map(type => 
        new Promise((resolve) => {
          service.nearbySearch({
            location: new window.google.maps.LatLng(coords.lat, coords.lng),
            radius: 5000, // 5km search for AI
            type: type
          }, (res, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && res) {
              resolve(res.slice(0, 3).map(p => ({ 
                name: p.name, 
                address: p.vicinity, 
                category: type,
                rating: p.rating 
              })))
            } else {
              resolve([])
            }
          })
        })
      ))
      setAiContextData(allResults.flat())
    } catch (e) {
      console.warn('AI context pre-fetch failed:', e)
    }
  }

  useEffect(() => {
    if (stableGpsRef.current && !hasFetchedAiContext.current) {
      hasFetchedAiContext.current = true
      fetchAllServicesForAI(stableGpsRef.current)
    }
  }, [stableGpsRef.current])
  const { emit, on } = useSocket(user?.id)

  const fetchNearbyServices = async (coords, type = activeServiceType) => {
    setPhase('fetching_hospital')
    setLoading(true)
    try {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        throw new Error('Google Maps not loaded')
      }
      
      const results = await new Promise((resolve, reject) => {
        try {
          const service = new window.google.maps.places.PlacesService(document.createElement('div'))
          
          // Map internal types to Google Places types
          let googleType = type
          if (type === 'police') googleType = 'police'
          if (type === 'doctor') googleType = 'doctor'
          if (type === 'pharmacy') googleType = 'pharmacy'
          if (type === 'hospital') googleType = 'hospital'

          service.nearbySearch({
            location: new window.google.maps.LatLng(coords.lat, coords.lng),
            rankBy: window.google.maps.places.RankBy.DISTANCE,
            type: googleType
          }, (res, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && res) {
              resolve(res)
            } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              resolve([])
            } else {
              reject(new Error(`Places Service status: ${status}`))
            }
          })
        } catch (e) {
          reject(e)
        }
      })

      if (results.length === 0) {
        setNearbyHospitals([])
        setNearestHospital(null)
        setDestination(null)
        setPhase('init')
        setLoading(false)
        return
      }

      // Show up to 30 results for comprehensive coverage
      const topResults = results.slice(0, 30)
      const topWithDetails = topResults.map(h => {
        const loc = { lat: h.geometry.location.lat(), lng: h.geometry.location.lng() }
        const distMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
          new window.google.maps.LatLng(coords.lat, coords.lng),
          h.geometry.location
        )
        return {
          id: h.place_id,
          name: h.name,
          address: h.vicinity,
          rating: h.rating || 0,
          openNow: h.opening_hours?.open_now,
          location: loc,
          distance: distMeters / 1000,
          phone: 'N/A'
        }
      }).sort((a, b) => {
        // Prioritize rating as requested, fallback to distance
        if (b.rating !== a.rating) return b.rating - a.rating;
        return a.distance - b.distance;
      })

      setNearbyHospitals(topWithDetails)
      // USER REQUEST: Do not select by default. Map stays clean until user selects.
      setNearestHospital(null)
      setDestination(null)
      setSelectedHospitalIdx(-1)
      setActiveRoute(null)
      setDemoMode(false)
      setDemoAmbulancePos(null)
      setRoutes([])
      setPhase('init')
    } catch (err) {
      console.error('Service fetch error:', err)
      const mockServices = [
        {
          id: 'mock-1',
          name: type === 'police' ? 'Central Police Station' : type === 'pharmacy' ? 'City Pharmacy' : type === 'doctor' ? 'Dr. Sharma Clinic' : 'City General Hospital (Demo)',
          address: '123 Main St, City Center',
          distance: 1.5,
          rating: 4.8,
          openNow: true,
          location: { lat: coords.lat + 0.015, lng: coords.lng + 0.015 },
          phone: '108'
        },
        {
          id: 'mock-2',
          name: type === 'police' ? 'Traffic Police Outpost' : type === 'pharmacy' ? 'Wellness Meds' : type === 'doctor' ? 'CarePoint Clinic' : 'LifeCare Multi-Specialty',
          address: '45 Second Blvd',
          distance: 3.2,
          rating: 4.5,
          openNow: true,
          location: { lat: coords.lat - 0.02, lng: coords.lng + 0.01 },
          phone: '112'
        }
      ]
      setNearbyHospitals(mockServices.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return a.distance - b.distance;
      }))
      // USER REQUEST: Do not select by default in mock/fallback too.
      setNearestHospital(null)
      setDestination(null)
      setSelectedHospitalIdx(-1)
      setActiveRoute(null)
      setDemoMode(false)
      setDemoAmbulancePos(null)
      setRoutes([])
      setPhase('init')
    }
    setLoading(false)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GPS: one-shot + watch. Lock stableGpsRef on first fix, then fetch hospital.
  // Watch only updates the blue "you are here" dot.
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) { setShowLogin(true); return }

    const onFirstFix = (pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      setUserLocation(coords)
      setLocationAccuracy(Math.round(pos.coords.accuracy))
      setLocationError(null)

      // Lock the stable ref — only used for API calls, never changes
      if (!stableGpsRef.current) {
        stableGpsRef.current = coords
        // Trigger service fetch now that we have real GPS
        fetchNearbyServices(coords)
      }
    }

    const onError = () => {
      if (!stableGpsRef.current) setUserLocation(null)
      setLocationAccuracy(null)
      setLocationError('Location access denied. Please enable location services to continue.')
      setPhase('init')
    }

    // One-shot for immediate first fix
    navigator.geolocation.getCurrentPosition(onFirstFix, onError, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0
    })

    // Watch only updates the dot — stableGpsRef stays locked
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationAccuracy(Math.round(pos.coords.accuracy))
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000 }
    )

    return () => {
      if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current)
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─────────────────────────────────────────────────────────────────────────
  // Force a fresh GPS fix and restart hospital fetch
  // ─────────────────────────────────────────────────────────────────────────
  const refreshLocation = () => {
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLocation(coords)
        setLocationAccuracy(Math.round(pos.coords.accuracy))
        setLocationError(null)
        stableGpsRef.current = coords
        setNearestHospital(null)
        setDestination(null)
        setRoutes([])
        setActiveRoute(null)
        fetchNearbyServices(coords)
      },
      () => {
        setLocationAccuracy(null)
        setLocationError('Location access denied. Please enable location services to continue.')
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    )
  }



  // ─────────────────────────────────────────────────────────────────────────
  // Select a hospital from the nearby list (updates destination + nearest)
  // ─────────────────────────────────────────────────────────────────────────
  const handleHospitalSelect = (h, idx) => {
    if (selectedHospitalIdx === idx) return // Avoid re-calculating if already selected
    
    setSelectedHospitalIdx(idx)
    const dist = h.distance != null ? `${h.distance.toFixed(1)} km` : null
    setNearestHospital({
      name: h.name || 'Hospital',
      address: h.address || '',
      distance: dist,
      rating: h.rating,
      openNow: h.openNow,
      location: h.location,
      placeId: h.id,
      phone: h.phone
    })
    setDestination(h.location)
    setRoutes([])
    setActiveRoute(null)
    setPhase('route_calc')
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Manual refetch (user taps "Change")
  // ─────────────────────────────────────────────────────────────────────────
  const retryHospitalFetch = () => {
    if (!stableGpsRef.current) return
    setNearestHospital(null)
    setNearbyHospitals([])
    setDestination(null)
    setRoutes([])
    setActiveRoute(null)
    fetchNearbyServices(stableGpsRef.current)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Socket events
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!on) return
    const off1 = on('ambulance_assigned', data => { 
      setRequestStatus({ ...data, status: 'accepted' }); 
      setTracking(data.ambulance); 
      if (!demoMode) setPhase('tracking') 
    })
    const off2 = on('ambulance_not_found', data => { 
      setRequestStatus({ ...data, status: 'no_ambulance' }); 
      if (!demoMode) setPhase('civilian_prompt') 
    })
    const off3 = on('location_update', data => { setTracking(prev => prev ? { ...prev, location: data.location } : null) })
    const off4 = on('ambulance_arrived', data => { setRequestStatus(prev => prev ? { ...prev, status: 'arrived', ...data } : prev) })
    return () => { off1(); off2(); off3(); off4() }
  }, [on, demoMode])

  // ─────────────────────────────────────────────────────────────────────────
  // Fetch routes — uses stableGpsRef, not live location
  // ─────────────────────────────────────────────────────────────────────────
  const fetchRoutes = useCallback(async () => {
    const origin = stableGpsRef.current
    if (!origin || !destination) return
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/routes/emergency?originLat=${origin.lat}&originLng=${origin.lng}&destLat=${destination.lat}&destLng=${destination.lng}`)
      if (!res.ok) throw new Error('Route fetch failed')
      const data = await res.json()
      setRoutes(data.routes || [])
      setActiveRoute(data.fastestRoute || data.routes?.[0] || null)
    } catch (e) {
      const mockRoutes = [
        { id: 'route-1', distance: '4.2 km', duration: '12 min', trafficStatus: 'moderate', fastest: true, steps: [] },
        { id: 'route-2', distance: '5.1 km', duration: '16 min', trafficStatus: 'heavy', fastest: false, steps: [] }
      ]
      setRoutes(mockRoutes)
      setActiveRoute(mockRoutes[0])
    }
    setLoading(false)
  }, [destination])

  useEffect(() => {
    if (phase === 'route_calc' && destination) fetchRoutes()
  }, [phase, destination, fetchRoutes])

  // ─────────────────────────────────────────────────────────────────────────
  // Fetch ambulances
  // ─────────────────────────────────────────────────────────────────────────
  const fetchAmbulances = useCallback(async () => {
    const origin = stableGpsRef.current
    if (!origin) return
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/ambulance-request/nearby?lat=${origin.lat}&lng=${origin.lng}`)
      if (!res.ok) throw new Error('Ambulance fetch failed')
      const data = await res.json()
      setAmbulances(data.ambulances || [])
      setPhase('ambulance_list')
    } catch (e) { 
      console.warn('Ambulance fetch failed, using mocks')
      const mockAmbs = [
        { 
          id: 'amb-1', 
          type: 'Basic Life Support', 
          vehicleNumber: 'WB01-1234', 
          eta: 4, 
          location: { lat: origin.lat + 0.008, lng: origin.lng + 0.008 },
          driver: { name: 'Rajesh Kumar' }
        },
        { 
          id: 'amb-2', 
          type: 'Advanced Cardiac Care', 
          vehicleNumber: 'WB02-5678', 
          eta: 7, 
          location: { lat: origin.lat - 0.012, lng: origin.lng - 0.005 },
          driver: { name: 'Suresh Das' }
        }
      ]
      setAmbulances(mockAmbs)
      setPhase('ambulance_list')
    }
    setLoading(false)
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // Book ambulance
  // ─────────────────────────────────────────────────────────────────────────
  const bookAmbulance = async (ambulance) => {
    const origin = stableGpsRef.current
    if (!origin) return
    setLoading(true)
    setSelectedAmbulance(ambulance)
    try {
      scrollToTop()
      const res = await fetch(`${BACKEND_URL}/api/ambulance-request/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          pickupLat: origin.lat, pickupLng: origin.lng,
          destinationLat: destination?.lat, destinationLng: destination?.lng,
          preferredAmbulanceId: ambulance?.id,
          emergencyType: 'medical',
          patientName: user.name,
          contact: user.phone || civilianForm.contact,
          notes: ''
        })
      })
      if (!res.ok) throw new Error('Booking failed')
      const data = await res.json()
      if (data.requestId) emit('join_request', data.requestId)
      setRequestStatus({ ...data, status: 'searching' })
      setPhase('searching')
      logActivity(user.id, 'ambulance', `Ambulance booked to ${nearestHospital?.name}`, 'active')
      if (ambulance?.location) startDemoAnimation(ambulance.location, origin)
    } catch (e) { 
      setRequestStatus({ requestId: 'REQ-' + Math.floor(1000 + Math.random() * 9000), status: 'searching', eta: ambulance?.eta || 5, ambulance: ambulance })
      setPhase('searching')
      logActivity(user.id, 'ambulance', `Ambulance booked (Demo Mode) to ${nearestHospital?.name}`, 'active')
      if (ambulance?.location) startDemoAnimation(ambulance.location, origin)
    }
    setLoading(false)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Trip Workflow (Leg 2: User -> Hospital)
  // ─────────────────────────────────────────────────────────────────────────
  const startHospitalTrip = async () => {
    const origin = stableGpsRef.current || userLocation
    const currentDest = destination || nearestHospital?.location
    if (!currentDest || !origin) return
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/routes/emergency?originLat=${origin.lat}&originLng=${origin.lng}&destLat=${currentDest.lat}&destLng=${currentDest.lng}`)
      const data = await res.json()
      if (data.routes?.length) {
        const best = data.routes[0]
        setActiveRoute(best)
        const rawPath = best.steps.map(s => s.end_location)
        startLeg2Animation(interpolatePath(rawPath, 100)) // Ensure 100 steps for trip
      } else {
        throw new Error('No routes found')
      }
    } catch (e) {
      console.warn('Trip leg 2 fetch failed, using mock path:', e)
      const steps = 100
      const path = Array.from({ length: steps + 1 }, (_, i) => ({
        lat: origin.lat + (currentDest.lat - origin.lat) * (i / steps),
        lng: origin.lng + (currentDest.lng - origin.lng) * (i / steps),
      }))
      startLeg2Animation(path)
    }
    setLoading(false)
  }

  const interpolatePath = (path, minPoints) => {
    if (path.length >= minPoints) return path;
    const interpolated = [];
    const factor = Math.ceil(minPoints / path.length);
    for (let i = 0; i < path.length - 1; i++) {
      const start = path[i];
      const end = path[i + 1];
      interpolated.push(start);
      for (let j = 1; j < factor; j++) {
        interpolated.push({
          lat: start.lat + (end.lat - start.lat) * (j / factor),
          lng: start.lng + (end.lng - start.lng) * (j / factor)
        });
      }
    }
    interpolated.push(path[path.length - 1]);
    return interpolated;
  };

  const startDemoAnimation = async (ambulanceLoc, userLoc) => {
    setUserAvatar({ position: userLoc, name: user?.name || 'You' })
    try {
      // Leg 1: Ambulance Location -> User Location (Real road route)
      const res = await fetch(`${BACKEND_URL}/api/routes/emergency?originLat=${ambulanceLoc.lat}&originLng=${ambulanceLoc.lng}&destLat=${userLoc.lat}&destLng=${userLoc.lng}`)
      const data = await res.json()
      if (data.routes?.length) {
        const best = data.routes[0]
        const rawPath = best.steps.map(s => s.end_location)
        startLeg1Animation(interpolatePath(rawPath, 80)) // Ensure 80 steps for arrival
      } else {
        throw new Error('No route for Leg 1')
      }
    } catch (e) {
      console.warn('Leg 1 real route failed, using jittered path:', e)
      const steps = 80
      const path = Array.from({ length: steps + 1 }, (_, i) => ({
        lat: ambulanceLoc.lat + (userLoc.lat - ambulanceLoc.lat) * (i / steps) + (Math.sin(i/2) * 0.0001),
        lng: ambulanceLoc.lng + (userLoc.lng - ambulanceLoc.lng) * (i / steps) + (Math.cos(i/2) * 0.0001),
      }))
      startLeg1Animation(path)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Civilian verify
  // ─────────────────────────────────────────────────────────────────────────
  const verifyCivilian = async () => {
    const origin = stableGpsRef.current
    setLoading(true)
    scrollToTop()
    try {
      const res = await fetch(`${BACKEND_URL}/api/verify/civilian`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...civilianForm, location: origin, destination })
      })
      const data = await res.json()
      setCivilianResult(data)
      if (data.verified) {
        setPhase('civilian_active')
        logActivity(user.id, 'civilian', 'Civilian Mode activated', 'active')
        await fetch(`${BACKEND_URL}/api/police/alert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehicleId: data.tempVehicleId, vehicleType: 'civilian_emergency',
            route: activeRoute?.steps || [], eta: activeRoute?.duration,
            location: origin, requestType: 'civilian_emergency', contact: civilianForm.contact
          })
        })
      }
    } catch (e) { setCivilianResult({ verified: false, message: 'Verification failed' }) }
    setLoading(false)
  }

  useEffect(() => {
    if (phase !== 'civilian_active' || !civilianResult?.tempVehicleId) return
    emit('join_civilian', civilianResult.tempVehicleId)
    const publishLocation = () => {
      navigator.geolocation.getCurrentPosition(pos => {
        emit('track_civilian', { vehicleId: civilianResult.tempVehicleId, lat: pos.coords.latitude, lng: pos.coords.longitude, route: activeRoute?.steps || [] })
      })
    }
    publishLocation()
    const iv = setInterval(publishLocation, 5000)
    return () => clearInterval(iv)
  }, [phase, civilianResult?.tempVehicleId, activeRoute, emit])

  const sendMessage = async () => {
    if (!inputMsg.trim()) return
    const txt = inputMsg.trim()
    setMessages(prev => [...prev, { role: 'user', text: txt }])
    setInputMsg('')
    try {
      const res = await fetch(`${BACKEND_URL}/api/verify/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: txt, 
          context: { 
            phase, 
            location: stableGpsRef.current, 
            destination,
            nearbyServices: nearbyHospitals,
            activeRoute: activeRoute
          } 
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data?.text || 'Stay calm. Help is on the way.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Unable to connect. Please call 108.' }])
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Build map markers — all hospitals shown, selected one bounces
  // ─────────────────────────────────────────────────────────────────────────
  const mapMarkers = []
  if (userLocation) mapMarkers.push({ position: userLocation, title: 'Your Location', type: 'user' })
  
  if (nearbyHospitals.length > 0) {
    nearbyHospitals.forEach((h, idx) => {
      // USER REQUEST: Only show on map if selected
      if (h.location && idx === selectedHospitalIdx) {
        const distString = h.distance != null ? `${h.distance.toFixed(1)} km` : null
        const isSelected = true
        const roughEta = h.distance != null ? Math.ceil(h.distance / 30 * 60) : null
        const eta = isSelected && activeRoute ? activeRoute.duration : (roughEta ? `~${roughEta} min` : null)
        mapMarkers.push({
          position: h.location,
          title: h.name || 'Facility',
          type: activeServiceType === 'hospital' ? 'hospital' : (activeServiceType === 'police' ? 'police' : (activeServiceType === 'pharmacy' ? 'pharmacy' : 'doctor')),
          bounce: isSelected,
          hospitalIdx: idx,
          info: buildHospitalInfoHtml({
            name: h.name,
            address: h.address,
            phone: h.phone,
            rating: h.rating,
            openNow: h.openNow,
            distText: distString,
            etaText: eta,
            isDark,
          })
        })
      }
    })
  } else if (nearestHospital?.location) {
    // This part handles the case where we might have a nearestHospital but no nearbyHospitals list (rare with current logic)
    mapMarkers.push({
      position: nearestHospital.location,
      title: nearestHospital.name || 'Hospital',
      type: 'hospital',
      bounce: true,
      info: buildHospitalInfoHtml({
        name: nearestHospital.name,
        address: nearestHospital.address,
        phone: nearestHospital.phone,
        rating: nearestHospital.rating,
        openNow: nearestHospital.openNow,
        distText: nearestHospital.distance || null,
        etaText: activeRoute?.duration || null,
        isDark,
      })
    })
  }
  if (tracking?.location && !demoMode) mapMarkers.push({ position: tracking.location, title: 'Ambulance', type: 'ambulance' })

  const routePoly = activeRoute ? [activeRoute] : routes

  // Map center: only use a real user location
  const mapCenter = userLocation || stableGpsRef.current

  if (!user) return showLogin ? <LoginModal onClose={() => navigate('/')} /> : null

  return (
    <>
    <div className={`flex flex-col min-h-screen lg:h-screen lg:overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className={`sticky top-0 z-10 flex items-center gap-3 px-4 py-3.5 border-b shadow-sm shrink-0 transition-colors ${isDark ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-gray-100'}`}>
        <button onClick={() => navigate('/')} className={`flex items-center justify-center transition-all w-9 h-9 rounded-xl active:scale-95 shrink-0 ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-[#C8102E] tracking-widest uppercase mb-0.5 truncate">
             {phase === 'tracking' ? 'Live Tracking' : phase === 'civilian_active' ? 'Civilian Mode' : 'Emergency Assistance'}
          </p>
          <h1 className={`font-bold text-lg flex items-center gap-1.5 leading-none truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Siren size={18} className="text-[#C8102E] shrink-0" />
            LifeLine+ SOS
          </h1>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
           {locationAccuracy && (
            <div className={`text-right border-r pr-2.5 hidden sm:block ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
              <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Accuracy</p>
              <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>±{locationAccuracy}m</p>
            </div>
          )}
          <button onClick={refreshLocation} title="Refresh GPS" className="w-9 h-9 bg-red-50 hover:bg-red-100 text-[#C8102E] rounded-xl flex items-center justify-center transition-all active:scale-95">
             <Navigation size={16} />
          </button>
        </div>
      </div>

      {locationError && (
        <div className="mx-4 mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex items-center gap-2 text-xs text-amber-700 shrink-0">
          <AlertTriangle size={14} className="shrink-0" />
          {locationError}
        </div>
      )}

      {/* ── Main Content Split ─────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 w-full max-w-7xl mx-auto overflow-hidden lg:flex-row">
        
        {/* LEFT HALF: Map */}
        <div className={`flex flex-col w-full h-[40vh] lg:h-full lg:w-1/2 p-4 shrink-0 relative transition-colors ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
          <div className={`flex-1 overflow-hidden border shadow-md rounded-2xl relative transition-colors ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
            {mapCenter ? (
              <MapView
                center={mapCenter}
                markers={mapMarkers}
                routes={routePoly}
                activeRoute={activeRoute}
                userLocation={userLocation}
                height="100%"
                traffic={true}
                show3D={show3D}
                onToggle3D={() => setShow3D(v => !v)}
                onMapClick={undefined}
                onHospitalSelect={(idx) => nearbyHospitals[idx] && handleHospitalSelect(nearbyHospitals[idx], idx)}
                onRefreshLocation={refreshLocation}
                zoom={14}
                demoMode={demoMode}
                demoPath={demoPath}
                demoAmbulancePos={demoAmbulancePos}
                demoProgress={demoProgress}
                userAvatar={userAvatar}
                isDark={isDark}
              />
            ) : (
              <div className={`h-full flex flex-col items-center justify-center text-center px-6 transition-colors ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                <AlertTriangle size={20} className="mb-2 text-amber-500" />
                <p className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>Location not available</p>
                <p className="mt-1 text-xs text-gray-500">Enable location services to load nearby factors.</p>
              </div>
            )}
            
            <div className="mt-auto pt-8">
              <Footer />
            </div>
          </div>
        </div>

        {/* RIGHT HALF: Content & Categories */}
        <div className={`flex flex-col w-full h-[60vh] lg:h-full lg:w-1/2 lg:border-l overflow-hidden transition-colors ${isDark ? 'bg-[#0f172a] border-slate-700' : 'bg-white border-gray-100'}`}>
          
          {/* CATEGORY TABS */}
          <div className={`flex gap-2 px-4 pt-4 pb-3 overflow-x-auto border-b shrink-0 no-scrollbar transition-colors ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
            {[
              { id: 'hospital', label: 'Hospitals', icon: Building2 },
              { id: 'police', label: 'Police', icon: Shield },
              { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
              { id: 'doctor', label: 'Doctors', icon: Stethoscope },
              { id: 'ai', label: 'LifeLine+ Chatbot', icon: Sparkles }
            ].map(cat => {
              const Icon = cat.icon;
              const isActive = activeServiceType === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveServiceType(cat.id);
                    setSelectedHospitalIdx(-1);
                    setNearestHospital(null);
                    setDestination(null);
                    setActiveRoute(null);
                    setRoutes([]);
                    // Don't clear nearbyHospitals, keep it as context for AI
                    if (cat.id !== 'ai' && stableGpsRef.current) {
                      fetchNearbyServices(stableGpsRef.current, cat.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-[#C8102E] text-white shadow-md' 
                      : (isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                  }`}
                >
                  <Icon size={14} /> {cat.label}
                </button>
              )
            })}
          </div>

          <div 
            ref={mainContentRef}
            className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-4 pb-24"
          >
            
            {/* AI Assistant Panel */}
            {activeServiceType === 'ai' && (
              <div className="h-full -mt-4 -mx-4 overflow-hidden">
                <LifeLineChatbot 
                  isDark={isDark} 
                  userLocation={stableGpsRef.current} 
                  nearbyServices={aiContextData}
                  selectedHospital={nearestHospital}
                  activeRoute={activeRoute}
                  activeServiceType="Emergency Hub"
                />
              </div>
            )}

            {/* Map click hint */}
            {phase === 'init' && activeServiceType !== 'ai' && !nearestHospital && !nearbyHospitals.length && !stableGpsRef.current && (
              <p className="text-xs text-center text-gray-400">Detecting your location...</p>
            )}

            {/* Fetching state */}
            {phase === 'fetching_hospital' && (
              <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                <div className="relative mb-6">
                  <div className={`w-16 h-16 border-4 rounded-full ${isDark ? 'border-[#C8102E]/10' : 'border-[#C8102E]/10'}`} />
                  <div className="absolute inset-0 w-16 h-16 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity size={24} className="text-[#C8102E]" />
                  </div>
                </div>
                <h3 className={`font-bold text-lg mb-1 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Locating nearby {activeServiceType}s...</h3>
                <p className="text-sm text-gray-500">Using your GPS coordinates</p>
              </div>
            )}

            {/* ── PERSISTENT TRIP STATUS ─────────────────────────────────── */}
            {['searching', 'tracking', 'arrived', 'trip_active', 'civilian_active', 'completed'].includes(phase) && (
              <div className="mb-6 animate-in slide-in-from-top duration-500">
                {/* Searching / Tracking Phase */}
                {(phase === 'searching' || phase === 'tracking') && (
                  <div className={`p-6 text-center rounded-3xl border animate-pulse ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-lg'}`}>
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="absolute inset-0 border-4 border-[#C8102E]/10 rounded-full" />
                      <div className="absolute inset-0 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Ambulance size={28} className="text-[#C8102E]" />
                      </div>
                    </div>
                    <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {phase === 'tracking' ? 'Live Tracking Active' : (demoMode ? 'Ambulance En Route' : 'Searching for Help...')}
                    </h2>
                    {demoMode && (
                      <div className={`mt-4 p-4 rounded-xl border ${isDark ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live ETA</span>
                          <span className="text-sm font-black text-emerald-500">{Math.floor(demoCountdown / 60)}:{String(demoCountdown % 60).padStart(2, '0')}</span>
                        </div>
                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-emerald-100'}`}>
                          <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${demoProgress * 100}%` }} />
                        </div>
                      </div>
                    )}
                    <button 
                      onClick={() => { if(confirm('Cancel booking?')) resetEmergency(true); }}
                      className="mt-4 text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}

                {/* Arrived Phase */}
                {phase === 'arrived' && (
                  <div className={`p-6 border rounded-3xl animate-in zoom-in duration-500 ${isDark ? 'bg-emerald-900/20 border-emerald-500/30 shadow-2xl' : 'bg-emerald-50 border-emerald-200 shadow-xl'}`}>
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-bounce">
                        <Ambulance size={32} />
                      </div>
                      <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Ambulance is here!</h2>
                      <p className={`text-xs font-medium mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Please confirm your medical destination.</p>
                    </div>

                    {nearestHospital && (
                      <div className={`mb-6 p-4 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-emerald-500/20' : 'bg-white border-emerald-100'}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-[#C8102E]">
                            <Hospital size={16} />
                          </div>
                          <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{nearestHospital.name}</p>
                        </div>
                        <p className="text-[11px] text-gray-500 ml-11">{nearestHospital.address}</p>
                      </div>
                    )}

                    <button 
                      onClick={startHospitalTrip}
                      className="w-full bg-[#C8102E] hover:bg-[#a50d26] text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg text-sm transition-all active:scale-95"
                    >
                      <CheckCircle size={18} /> Confirm Pickup & Start Trip
                    </button>
                    <button 
                      onClick={() => { if(confirm('Cancel booking?')) resetEmergency(true); }}
                      className="w-full mt-3 text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors py-2 text-center"
                    >
                      Cancel Request
                    </button>
                  </div>
                )}

                {/* Trip Active (Leg 2) */}
                {phase === 'trip_active' && (
                  <div className={`p-5 border rounded-2xl transition-all ${isDark ? 'bg-blue-900/10 border-blue-500/30' : 'bg-blue-50 border-blue-200 shadow-md'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <Loader2 size={20} className="text-[#C8102E] animate-spin" />
                      <h2 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>En Route to {nearestHospital?.name}</h2>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-gray-400">
                        <span>Progress</span>
                        <span>{Math.round(demoProgress * 100)}%</span>
                      </div>
                    <div className="mt-4 flex gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                        <div className="h-full bg-[#C8102E] transition-all duration-1000" style={{ width: `${demoProgress * 100}%` }} />
                      </div>
                      <button 
                        onClick={() => { if(confirm('Cancel trip?')) resetEmergency(true); }}
                        className="shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

                {/* Trip Completed */}
                {phase === 'completed' && (
                  <div className={`p-6 border rounded-3xl text-center shadow-xl animate-in fade-in duration-700 ${isDark ? 'bg-slate-900 border-emerald-500/30' : 'bg-white border-emerald-100'}`}>
                    <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <CheckCircle size={28} />
                    </div>
                    <h2 className={`text-lg font-black mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Drop-off Successful!</h2>
                    <p className={`text-xs font-medium leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      Patient has successfully permitted to the hospital. <br/>
                      <span className="text-emerald-500 font-bold">Happy Life, Healthy Living.</span>
                    </p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all active:scale-95 text-xs"
                    >
                      Finish Session
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── CIVILIAN PROMPT (No ambulance found) ──────────────────── */}
            {phase === 'civilian_prompt' && (
              <div className={`p-6 border rounded-3xl shadow-xl animate-in fade-in duration-500 text-center ${isDark ? 'bg-slate-900 border-red-500/20' : 'bg-white border-red-100'}`}>
                <div className="w-16 h-16 bg-red-50 text-[#C8102E] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <AlertTriangle size={32} />
                </div>
                <h2 className={`text-lg font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No Ambulance Found</h2>
                <p className={`text-xs font-medium leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  We couldn't locate any ambulances nearby at this moment. You can activate **Civilian Mode** to use your own vehicle with priority route alerts.
                </p>
                <div className="space-y-3">
                  <button 
                    onClick={() => { setPhase('civilian_direct'); scrollToTop(); }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                  >
                    <Car size={20} /> Start Civilian Mode
                  </button>
                  <button 
                    onClick={() => setPhase('init')}
                    className={`w-full py-3 text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Back to Search
                  </button>
                </div>
              </div>
            )}

            {/* ── CIVILIAN MODE DIRECT FORM ─────────────────────────────── */}
            {phase === 'civilian_direct' && (
              <div className={`p-6 border rounded-3xl shadow-xl animate-in slide-in-from-bottom duration-500 ${isDark ? 'bg-slate-900 border-amber-500/20' : 'bg-white border-amber-100'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <Car size={24} />
                  </div>
                  <div>
                    <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Civilian Mode</h2>
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Self-Drive Emergency</p>
                  </div>
                  <button onClick={() => setPhase('init')} className="ml-auto p-2 text-gray-400 hover:text-red-500">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Vehicle Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. WB 02 AB 1234"
                      value={civilianForm.vehicleNumber}
                      onChange={(e) => setCivilianForm({...civilianForm, vehicleNumber: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-bold border transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-500' : 'bg-gray-50 border-gray-100 focus:border-amber-500'}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Purpose / Emergency</label>
                    <textarea 
                      placeholder="e.g. Transporting heart patient to City Hospital"
                      value={civilianForm.purpose}
                      onChange={(e) => setCivilianForm({...civilianForm, purpose: e.target.value})}
                      rows={2}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium border transition-all resize-none ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-500' : 'bg-gray-50 border-gray-100 focus:border-amber-500'}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Emergency Contact</label>
                    <input 
                      type="tel" 
                      placeholder="Mobile number"
                      value={civilianForm.contact}
                      onChange={(e) => setCivilianForm({...civilianForm, contact: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-bold border transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-500' : 'bg-gray-50 border-gray-100 focus:border-amber-500'}`}
                    />
                  </div>

                  <button 
                    onClick={verifyCivilian}
                    disabled={loading || !civilianForm.vehicleNumber || !civilianForm.purpose}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />}
                    {loading ? 'AI Verification in Progress...' : 'Verify & Activate Civilian Mode'}
                  </button>

                  <p className="text-[10px] text-center text-gray-400 font-medium">
                    Our Gemini AI will verify your emergency and alert nearby police stations.
                  </p>
                </div>
              </div>
            )}

            {/* ── CIVILIAN MODE ACTIVE / RESULT ────────────────────────── */}
            {phase === 'civilian_active' && civilianResult && (
              <div className={`p-6 border rounded-3xl shadow-xl animate-in zoom-in duration-500 ${isDark ? 'bg-slate-900 border-emerald-500/20' : 'bg-white border-emerald-100'}`}>
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg mb-4 ${civilianResult.verified ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {civilianResult.verified ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
                  </div>
                  <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {civilianResult.verified ? 'Civilian Mode Active' : 'Verification Denied'}
                  </h2>
                  <p className={`text-xs font-bold mt-1 ${civilianResult.verified ? 'text-emerald-500' : 'text-red-500'}`}>
                    {civilianResult.verified ? 'AI Verified Emergency' : 'Standard Traffic Laws Apply'}
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                   <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200/10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Risk Level</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                        civilianResult.aiResult?.riskLevel === 'high' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>{civilianResult.aiResult?.riskLevel || 'Normal'}</span>
                   </div>
                   <p className={`text-xs font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                     {civilianResult.aiResult?.reason || civilianResult.message}
                   </p>
                </div>

                {civilianResult.verified && (
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                      <Shield size={16} className="text-blue-500" />
                      <span className="text-[10px] font-bold text-blue-700">Nearby Police Stations Notified</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <Navigation size={16} className="text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-700">Real-time Route Priority Enabled</span>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => resetEmergency()}
                  className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl transition-all active:scale-95 text-sm"
                >
                  End Civilian Session
                </button>
              </div>
            )}

            {/* Nearby List + Actions */}
            {activeServiceType !== 'ai' && nearbyHospitals.length > 0 && !['searching', 'tracking', 'arrived', 'trip_active', 'civilian_active', 'completed'].includes(phase) && phase !== 'fetching_hospital' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{activeServiceType}s Nearby</p>
                  <button onClick={() => {
                    if (stableGpsRef.current) fetchNearbyServices(stableGpsRef.current, activeServiceType);
                  }} className="text-[10px] text-[#C8102E] font-semibold hover:underline">Refresh</button>
                </div>

                {nearbyHospitals.map((h, idx) => {
                  const isSelected = idx === selectedHospitalIdx;
                  const dist = h.distance != null ? h.distance.toFixed(1) : null;
                  const roughEta = h.distance != null ? Math.ceil(h.distance / 30 * 60) : null;
                  const eta = isSelected && activeRoute ? activeRoute.duration : (roughEta ? `~${roughEta} min` : null);
                  return (
                    <div
                      key={h.id || idx}
                      onClick={() => handleHospitalSelect(h, idx)}
                      className={`group flex items-center gap-3 px-3.5 py-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected 
                          ? (isDark ? 'bg-slate-800 border-[#C8102E] shadow-lg ring-1 ring-[#C8102E]/20' : 'bg-red-50 border-[#C8102E]/30 shadow-md ring-1 ring-[#C8102E]/10') 
                          : (isDark ? 'bg-slate-900/40 border-slate-700 hover:border-slate-500' : 'bg-white border-gray-100 hover:bg-gray-50 shadow-sm')
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110 group-hover:rotate-6 ${
                        isSelected ? 'bg-[#C8102E] text-white shadow-md' : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-400')
                      }`}>
                        {activeServiceType === 'hospital' ? <Building2 size={18} /> : activeServiceType === 'police' ? <Shield size={18} /> : activeServiceType === 'pharmacy' ? <Pill size={18} /> : <Stethoscope size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-sm leading-tight transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>{h.name}</h3>
                        <p className={`text-[10px] truncate mb-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{h.address}</p>
                        <div className="flex items-center gap-2.5">
                          {dist && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><MapPin size={8} /> {dist} km</span>}
                          {h.rating && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600'}`}><Timer size={8} /> {h.rating}★</span>}
                          {h.openNow === true && <span className="text-[9px] font-bold text-emerald-500">● Open</span>}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {eta && <p className={`text-[10px] font-bold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{eta}</p>}
                      </div>
                    </div>
                  )
                })}


                {/* Actions */}
                {nearestHospital && activeServiceType === 'hospital' && (phase === 'init' || phase === 'route_calc') && (
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={fetchAmbulances}
                      disabled={!stableGpsRef.current || loading}
                      className="w-full bg-[#C8102E] hover:bg-[#a50d26] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 text-base shadow-lg transition-all"
                    >
                      {loading ? <Loader2 size={22} className="animate-spin" /> : <Ambulance size={22} />}
                      {loading ? 'Finding ambulances...' : 'Find Nearby Ambulances'}
                    </button>
                    <button onClick={() => { setPhase('civilian_direct'); scrollToTop(); }}
                      className="flex items-center justify-center w-full gap-2 py-3 text-sm font-semibold text-gray-600 transition-all bg-white border border-gray-200 shadow-sm rounded-2xl hover:bg-amber-50">
                      <Car size={16} /> Self-Drive / Civilian Mode
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* No items found */}
            {!nearbyHospitals.length && phase === 'init' && stableGpsRef.current && (
              <div className="py-8 text-center bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-500 font-semibold mb-2">No {activeServiceType}s found nearby.</p>
                {activeServiceType === 'hospital' && (
                  <button onClick={fetchAmbulances} className="w-full max-w-[200px] mx-auto bg-[#C8102E] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95">
                    <Ambulance size={18} /> Find Ambulances
                  </button>
                )}
              </div>
            )}

            {/* Route Selection */}
            {phase === 'route_calc' && routes.length > 0 && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h2 className="flex items-center gap-2 mb-3 font-bold text-gray-900">
                  <Route size={18} className="text-blue-500" /> Emergency Routes
                </h2>
                <div className="space-y-2">
                  {routes.map(route => (
                    <button
                      key={route.id}
                      onClick={() => setActiveRoute(route)}
                      className={`w-full bg-white rounded-2xl border text-left flex items-center gap-3 p-4 transition-all shadow-sm ${activeRoute?.id === route.id ? 'border-[#C8102E] ring-1 ring-[#C8102E]/20' : 'border-gray-100'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${route.fastest ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        <Navigation size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{route.distance} · {route.duration}</p>
                        <p className="text-xs text-gray-400">{route.trafficStatus === 'heavy' ? 'Heavy traffic' : 'Clear route'}</p>
                      </div>
                      {route.fastest && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Fastest</span>}
                    </button>
                  ))}
                </div>
                {activeServiceType === 'hospital' && (
                  <button
                    onClick={fetchAmbulances}
                    className="w-full mt-4 bg-[#C8102E] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Ambulance size={20} /> Book Ambulance on This Route
                  </button>
                )}
              </div>
            )}

            {/* Ambulance List */}
            {phase === 'ambulance_list' && (
              <div className={`pb-24 transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
                {nearestHospital && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-3.5 mb-4 flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#C8102E] rounded-xl flex items-center justify-center shrink-0">
                      <Building2 size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-[#C8102E] tracking-widest uppercase mb-0.5">Destination</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{nearestHospital.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={11} className="text-[#C8102E]" />
                        <span className="text-[11px] font-semibold text-gray-700">{activeRoute ? activeRoute.duration : nearestHospital.distance} to arrival</span>
                      </div>
                    </div>
                  </div>
                )}
                <h2 className="flex items-center gap-2 mb-3 text-base font-bold text-gray-900">
                  <Ambulance size={18} className="text-[#C8102E]" /> Nearby Ambulances
                </h2>
                <div className="space-y-3">
                  {ambulances.map(amb => (
                    <div key={amb.id} className="flex items-center gap-3 p-3.5 bg-white border border-gray-100 shadow-sm rounded-2xl">
                      <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-xl shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-sm">
                        <Ambulance size={22} className="text-[#C8102E] transition-transform group-hover:scale-110" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{amb.type}</p>
                        <p className="text-xs text-gray-400">{amb.vehicleNumber} · {amb.driver?.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600"><Clock size={11} /> {amb.eta}m ETA</span>
                        </div>
                      </div>
                      <button onClick={() => bookAmbulance(amb)} className="bg-[#C8102E] text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95 shadow-sm">
                        Book
                      </button>
                    </div>
                  ))}
                  {ambulances.length === 0 && (
                    <div className="py-10 text-center bg-white border border-gray-100 rounded-2xl">
                      <p className="text-sm text-gray-400">No ambulances available nearby</p>
                      <button onClick={() => { setPhase('civilian_direct'); scrollToTop(); }} className="mt-3 text-[#C8102E] text-sm font-semibold hover:underline">
                        Try Civilian Mode
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
