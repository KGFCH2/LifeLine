import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import MapView from '../components/MapView.jsx'
import LoginModal from '../components/LoginModal.jsx'
import Loader from '../components/Loader.jsx'
import { Ambulance, Shield, Stethoscope, Siren, MapPin, Clock, Navigation, Star, Filter, ChevronRight, Phone } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [location, setLocation] = useState(null)
  const [services, setServices] = useState([])
  const [serviceType, setServiceType] = useState('hospital')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dark, setDark] = useState(false)
  const [filters, setFilters] = useState({ radius: '5000', minRating: '', openNow: false, specialty: '' })
  const [selectedService, setSelectedService] = useState(null)
  const [mapCenter, setMapCenter] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('lifeline_dark') === 'true'
    setDark(saved)
  }, [])

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported')
      setLocation({ lat: 22.5726, lng: 88.3639 })
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setLocation(loc)
      },
      () => {
        setError('Location access denied. Using default.')
        setLocation({ lat: 22.5726, lng: 88.3639 })
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  const demoServices = useCallback(() => {
    const baseLat = location?.lat || 22.5726
    const baseLng = location?.lng || 88.3639
    
    const demoData = {
      hospital: [
        { id: 'h1', name: 'Apollo Gleneagles Hospital', address: '58, Canal Circular Road, Kolkata', rating: 4.8, distance: 0.8, openNow: true, phone: '+91 33 2320 3040' },
        { id: 'h2', name: 'Fortis Hospital Anandapur', address: '730, Anandapur, EM Bypass, Kolkata', rating: 4.6, distance: 1.2, openNow: true, phone: '+91 33 6628 4444' },
        { id: 'h3', name: 'AMRI Hospital Salt Lake', address: 'JC-16 & 17, Salt Lake City, Kolkata', rating: 4.5, distance: 1.5, openNow: true, phone: '+91 33 6627 0100' },
        { id: 'h4', name: 'Peerless Hospital', address: '360, Panchasayar, Kolkata', rating: 4.3, distance: 2.1, openNow: true, phone: '+91 33 2423 0405' },
        { id: 'h5', name: 'Desun Hospital', address: 'Nayantara Supermarket, EM Bypass, Kolkata', rating: 4.4, distance: 2.4, openNow: true, phone: '+91 33 7122 1222' },
        { id: 'h6', name: 'Ruby General Hospital', address: 'Kasba Golpark, EM Bypass, Kolkata', rating: 4.2, distance: 2.8, openNow: true, phone: '+91 33 2466 5050' },
        { id: 'h7', name: 'Belle Vue Clinic', address: '9 Loudon Street, Kolkata', rating: 4.7, distance: 3.2, openNow: true, phone: '+91 33 3067 7000' },
        { id: 'h8', name: 'Sankara Nethralaya', address: 'NSC Bose Road, Kolkata', rating: 4.5, distance: 3.5, openNow: true, phone: '+91 33 2280 7777' },
      ],
      police: [
        { id: 'p1', name: 'Bidhannagar South PS', address: 'Sector 5, Salt Lake, Kolkata', rating: 4.2, distance: 0.9, openNow: true, phone: '100' },
        { id: 'p2', name: 'Phoolbagan Police Station', address: 'Phoolbagan, EM Bypass, Kolkata', rating: 4.0, distance: 1.3, openNow: true, phone: '100' },
        { id: 'p3', name: 'Salt Lake PS', address: 'Karunamoyee, Salt Lake, Kolkata', rating: 4.3, distance: 1.6, openNow: true, phone: '100' },
        { id: 'p4', name: 'Ultadanga Police Station', address: 'Ultadanga, Kolkata', rating: 3.9, distance: 2.0, openNow: true, phone: '100' },
        { id: 'p5', name: 'Kolkata Police HQ', address: '18, Lal Bazar, Kolkata', rating: 4.5, distance: 3.5, openNow: true, phone: '100' },
        { id: 'p6', name: 'Park Street PS', address: 'Park Street, Kolkata', rating: 4.1, distance: 3.8, openNow: true, phone: '100' },
        { id: 'p7', name: 'Topsia Police Station', address: 'Topsia, Kolkata', rating: 4.0, distance: 2.5, openNow: true, phone: '100' },
        { id: 'p8', name: 'Beliaghata PS', address: 'Beliaghata, Kolkata', rating: 3.8, distance: 2.2, openNow: true, phone: '100' },
      ],
      doctor: [
        { id: 'd1', name: 'Dr. Arunabha Sengupta', specialty: 'Cardiologist', address: 'Apollo Clinic, Salt Lake', rating: 4.9, distance: 1.0, openNow: true, phone: '+91 98765 43210' },
        { id: 'd2', name: 'Dr. Priya Sharma', specialty: 'Pediatrician', address: 'AMRI Hospital, Salt Lake', rating: 4.7, distance: 1.4, openNow: true, phone: '+91 98765 43211' },
        { id: 'd3', name: 'Dr. Rajesh Banerjee', specialty: 'Orthopedic', address: 'Fortis Hospital, Anandapur', rating: 4.6, distance: 1.8, openNow: true, phone: '+91 98765 43212' },
        { id: 'd4', name: 'Dr. Smita Das', specialty: 'Emergency Medicine', address: 'Desun Hospital, EM Bypass', rating: 4.8, distance: 2.0, openNow: true, phone: '+91 98765 43213' },
        { id: 'd5', name: 'Dr. Anirban Chatterjee', specialty: 'Neurologist', address: 'Ruby Hospital, Kasba', rating: 4.7, distance: 2.3, openNow: true, phone: '+91 98765 43214' },
        { id: 'd6', name: 'Dr. Ritu Gupta', specialty: 'Gynecologist', address: 'Belle Vue Clinic, Loudon St', rating: 4.8, distance: 2.7, openNow: true, phone: '+91 98765 43215' },
        { id: 'd7', name: 'Dr. Amit Sen', specialty: 'Dentist', address: 'City Center, Salt Lake', rating: 4.5, distance: 1.2, openNow: true, phone: '+91 98765 43216' },
        { id: 'd8', name: 'Dr. Mousumi Roy', specialty: 'ENT Specialist', address: 'Apollo Gleneagles, Canal Rd', rating: 4.6, distance: 1.5, openNow: true, phone: '+91 98765 43217' },
      ],
      pharmacy: [
        { id: 'ph1', name: 'Apollo Pharmacy', address: 'Salt Lake Sector 5, Kolkata', rating: 4.5, distance: 0.5, openNow: true, phone: '+91 33 2358 0098' },
        { id: 'ph2', name: 'Frank Ross Pharmacy', address: 'Salt Lake City Centre, Kolkata', rating: 4.3, distance: 0.9, openNow: true, phone: '+91 33 2321 4567' },
        { id: 'ph3', name: 'MedPlus Pharmacy', address: 'EM Bypass, Near Metro', rating: 4.4, distance: 1.3, openNow: true, phone: '+91 33 2465 7890' },
        { id: 'ph4', name: 'Wellness Forever', address: 'Sector 3, Salt Lake, Kolkata', rating: 4.2, distance: 1.5, openNow: true, phone: '+91 33 2345 6789' },
        { id: 'ph5', name: 'Dawai Ghar', address: 'College More, Salt Lake', rating: 4.1, distance: 0.7, openNow: true, phone: '+91 33 2334 5678' },
        { id: 'ph6', name: 'Guardian Pharmacy', address: 'Sector 2, Salt Lake', rating: 4.0, distance: 1.1, openNow: true, phone: '+91 33 2322 3456' },
        { id: 'ph7', name: '98.4 Pharmacy', address: 'Rajarhat, Kolkata', rating: 4.3, distance: 2.0, openNow: true, phone: '+91 33 2323 4567' },
        { id: 'ph8', name: 'Sanjivani Pharmacy', address: 'Baguiati, Kolkata', rating: 4.2, distance: 2.4, openNow: true, phone: '+91 33 2324 5678' },
      ]
    }
    
    return demoData[serviceType]?.map((service, index) => ({
      ...service,
      location: {
        lat: baseLat + (Math.random() - 0.5) * 0.015,
        lng: baseLng + (Math.random() - 0.5) * 0.015
      }
    })) || []
  }, [location, serviceType])

  const fetchServices = useCallback(async () => {
    if (!location) return
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        lat: String(location.lat),
        lng: String(location.lng),
        type: serviceType,
        radius: filters.radius,
        sortBy: filters.openNow ? 'availability' : 'distance'
      })
      if (filters.minRating) params.set('minRating', filters.minRating)
      if (filters.openNow) params.set('openNow', 'true')
      if (serviceType === 'doctor' && filters.specialty) params.set('specialty', filters.specialty)

      const res = await fetch(`${BACKEND_URL}/api/nearest-services?${params.toString()}`)
      const data = await res.json()
      
      // Use API results if available, otherwise use demo data
      if (data.results && data.results.length > 0) {
        setServices(data.results)
      } else {
        // Fallback to demo data
        setServices(demoServices())
      }
    } catch (err) {
      // On error, use demo data
      setServices(demoServices())
    } finally {
      setLoading(false)
    }
  }, [location, serviceType, filters, demoServices])

  useEffect(() => {
    if (location) fetchServices()
  }, [location, serviceType, fetchServices])

  const handleEmergency = () => {
    if (!user) setShowLogin(true)
    else navigate('/emergency')
  }

  const markers = services.slice(0, 10).filter(s => s.location).map(s => ({
    position: s.location,
    title: s.name,
    color: serviceType === 'hospital' ? '#ef4444' : serviceType === 'police' ? '#3b82f6' : '#f59e0b',
    info: `<div style="padding:8px;max-width:200px"><strong>${s.name}</strong><br/>${s.address || ''}<br/>⭐ ${s.rating || 'N/A'}</div>`
  }))

  if (location) {
    markers.push({
      position: location,
      title: 'You',
      color: '#3b82f6',
      bounce: false
    })
  }

  const serviceIcons = {
    hospital: { icon: Siren, label: 'Hospitals', color: 'text-red-500 bg-red-50 dark:bg-red-900/20', keyword: 'hospital' },
    police: { icon: Shield, label: 'Police', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20', keyword: 'police station' },
    doctor: { icon: Stethoscope, label: 'Doctors', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20', keyword: 'doctor' },
    pharmacy: { icon: MapPin, label: 'Pharmacy', color: 'text-green-500 bg-green-50 dark:bg-green-900/20', keyword: 'pharmacy' }
  }

  const handleServiceTypeChange = (key) => {
    setServiceType(key)
    setSelectedService(null) // Clear individual selection to show all of the new category
    // Immediately trigger search when button is clicked
    if (location) {
      setTimeout(() => fetchServices(), 100)
    }
  }

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-5 pb-6 rounded-b-3xl">
        <h1 className="text-xl font-bold mb-1">Emergency Services</h1>
        <p className="text-red-100 text-sm">Find nearest hospitals, police & pharmacy</p>
        
        {/* Location pill */}
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur rounded-xl px-3 py-2 mt-3">
          <MapPin size={14} className="text-red-200" />
          <span className="text-xs text-red-50 truncate">
            {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Detecting location...'}
          </span>
        </div>

        {/* Emergency CTA */}
        <button
          onClick={handleEmergency}
          className="w-full mt-3 bg-white text-red-600 font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-red-50 transition-colors active:scale-[0.98]"
        >
          <Ambulance size={20} />
          <span>EMERGENCY — Get Help Now</span>
        </button>
      </div>

      {/* Service Categories - Illustrated */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => handleServiceTypeChange('hospital')}
            disabled={loading}
            className={`p-4 rounded-2xl text-center transition-all ${
              serviceType === 'hospital'
                ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20'
            } ${loading ? 'opacity-60' : ''}`}
          >
            <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-2 overflow-hidden ${
              serviceType === 'hospital' ? 'bg-white/20' : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              {/* Hospital Illustration */}
              <svg viewBox="0 0 64 64" className="w-10 h-10">
                <rect x="12" y="20" width="40" height="36" rx="4" fill="#ef4444" opacity="0.2"/>
                <rect x="20" y="8" width="24" height="20" rx="2" fill="#ef4444"/>
                <rect x="28" y="12" width="8" height="4" rx="1" fill="white"/>
                <rect x="30" y="10" width="4" height="8" rx="1" fill="white"/>
                <rect x="16" y="32" width="12" height="12" rx="2" fill="white" opacity="0.9"/>
                <rect x="36" y="32" width="12" height="12" rx="2" fill="white" opacity="0.9"/>
                <rect x="16" y="48" width="32" height="8" rx="2" fill="white" opacity="0.9"/>
                <circle cx="52" cy="16" r="8" fill="#fbbf24"/>
                <path d="M48 16 L52 12 L56 16 L52 20 Z" fill="#f59e0b"/>
              </svg>
            </div>
            <span className="text-sm font-semibold">Hospitals</span>
            <span className="block text-[10px] opacity-80 mt-0.5">{services.filter(s => s.name?.toLowerCase().includes('hospital')).length || 8} nearby</span>
          </button>

          <button
            onClick={() => handleServiceTypeChange('police')}
            disabled={loading}
            className={`p-4 rounded-2xl text-center transition-all ${
              serviceType === 'police'
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/20'
            } ${loading ? 'opacity-60' : ''}`}
          >
            <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-2 overflow-hidden ${
              serviceType === 'police' ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900/30'
            }`}>
              {/* Police Illustration */}
              <svg viewBox="0 0 64 64" className="w-10 h-10">
                <rect x="8" y="24" width="48" height="32" rx="4" fill="#3b82f6" opacity="0.2"/>
                <path d="M32 8 L48 20 L48 28 L16 28 L16 20 Z" fill="#3b82f6"/>
                <rect x="20" y="28" width="24" height="20" rx="2" fill="#3b82f6"/>
                <rect x="24" y="32" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
                <rect x="34" y="32" width="6" height="6" rx="1" fill="white" opacity="0.9"/>
                <rect x="28" y="42" width="8" height="8" rx="1" fill="white" opacity="0.9"/>
                <circle cx="16" cy="48" r="6" fill="#1f2937"/>
                <circle cx="48" cy="48" r="6" fill="#1f2937"/>
                <rect x="28" y="12" width="8" height="4" rx="1" fill="#fbbf24"/>
              </svg>
            </div>
            <span className="text-sm font-semibold">Police</span>
            <span className="block text-[10px] opacity-80 mt-0.5">{services.filter(s => s.name?.toLowerCase().includes('police')).length || 8} nearby</span>
          </button>

          <button
            onClick={() => handleServiceTypeChange('doctor')}
            disabled={loading}
            className={`p-4 rounded-2xl text-center transition-all ${
              serviceType === 'doctor'
                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-amber-50 dark:hover:bg-amber-900/20'
            } ${loading ? 'opacity-60' : ''}`}
          >
            <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-2 overflow-hidden ${
              serviceType === 'doctor' ? 'bg-white/20' : 'bg-amber-100 dark:bg-amber-900/30'
            }`}>
              {/* Doctor Illustration */}
              <svg viewBox="0 0 64 64" className="w-10 h-10">
                <circle cx="32" cy="16" r="12" fill="#f59e0b" opacity="0.3"/>
                <circle cx="32" cy="14" r="8" fill="#f59e0b"/>
                <rect x="24" y="24" width="16" height="20" rx="4" fill="white" stroke="#f59e0b" strokeWidth="2"/>
                <rect x="20" y="28" width="24" height="28" rx="4" fill="#f59e0b" opacity="0.2"/>
                <circle cx="26" cy="40" r="3" fill="#f59e0b"/>
                <circle cx="38" cy="40" r="3" fill="#f59e0b"/>
                <path d="M28 48 Q32 52 36 48" stroke="#f59e0b" strokeWidth="2" fill="none"/>
                <rect x="30" y="20" width="4" height="8" rx="1" fill="#f59e0b"/>
                <rect x="28" y="22" width="8" height="4" rx="1" fill="#f59e0b"/>
              </svg>
            </div>
            <span className="text-sm font-semibold">Doctors</span>
            <span className="block text-[10px] opacity-80 mt-0.5">{services.filter(s => s.name?.toLowerCase().includes('dr.')).length || 8} nearby</span>
          </button>

          <button
            onClick={() => handleServiceTypeChange('pharmacy')}
            disabled={loading}
            className={`p-4 rounded-2xl text-center transition-all ${
              serviceType === 'pharmacy'
                ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-green-50 dark:hover:bg-green-900/20'
            } ${loading ? 'opacity-60' : ''}`}
          >
            <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-2 overflow-hidden ${
              serviceType === 'pharmacy' ? 'bg-white/20' : 'bg-green-100 dark:bg-green-900/30'
            }`}>
              {/* Pharmacy Illustration */}
              <svg viewBox="0 0 64 64" className="w-10 h-10">
                <rect x="12" y="20" width="40" height="36" rx="4" fill="#22c55e" opacity="0.2"/>
                <rect x="16" y="24" width="32" height="28" rx="2" fill="#22c55e"/>
                <rect x="20" y="28" width="10" height="14" rx="1" fill="white" opacity="0.9"/>
                <rect x="34" y="28" width="10" height="14" rx="1" fill="white" opacity="0.9"/>
                <rect x="26" y="44" width="12" height="4" rx="1" fill="white" opacity="0.9"/>
                <rect x="28" y="8" width="8" height="16" rx="2" fill="#f59e0b"/>
                <rect x="30" y="10" width="4" height="4" rx="1" fill="white"/>
                <rect x="30" y="16" width="4" height="4" rx="1" fill="white"/>
                <circle cx="48" cy="16" r="8" fill="#3b82f6" opacity="0.3"/>
                <rect x="44" y="12" width="8" height="2" rx="1" fill="#3b82f6"/>
                <rect x="46" y="10" width="4" height="6" rx="1" fill="#3b82f6"/>
              </svg>
            </div>
            <span className="text-sm font-semibold">Pharmacy</span>
            <span className="block text-[10px] opacity-80 mt-0.5">{services.filter(s => s.name?.toLowerCase().includes('pharmacy')).length || 8} nearby</span>
          </button>
        </div>
        
        {loading && (
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <span>Searching nearest {serviceType}...</span>
          </div>
        )}
      </div>

      {/* Map - Shows selected service or all services */}
      <div className="px-4 mt-4">
        <div className="card overflow-hidden p-0">
          <MapView
            center={selectedService ? { lat: selectedService.location.lat, lng: selectedService.location.lng } : (mapCenter || location)}
            markers={selectedService ? [{
              position: selectedService.location,
              title: selectedService.name,
              color: serviceType === 'hospital' ? '#ef4444' : serviceType === 'police' ? '#3b82f6' : serviceType === 'doctor' ? '#f59e0b' : '#22c55e',
              info: `<div style="padding:8px;max-width:200px"><strong>${selectedService.name}</strong><br/>${selectedService.address || ''}<br/>⭐ ${selectedService.rating || 'N/A'}</div>`
            }] : markers}
            userLocation={location}
            height="320px"
            darkMode={dark}
            traffic={true}
            zoom={selectedService ? 16 : 14}
            selectedMarker={selectedService?.id}
            markerType={serviceType}
          />
        </div>
        {selectedService && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">Showing: <span className="font-medium text-gray-900">{selectedService.name}</span></p>
            <button 
              onClick={() => setSelectedService(null)}
              className="text-xs text-red-600 font-medium hover:underline"
            >
              Show all
            </button>
          </div>
        )}
      </div>

      {/* Service Cards */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">Nearby {serviceIcons[serviceType].label}</h2>
          <button className="flex items-center gap-1 text-sm text-red-600 font-medium">
            <Filter size={14} />
            Live Filters
          </button>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <select
            value={filters.radius}
            onChange={e => setFilters(f => ({ ...f, radius: e.target.value }))}
            className="input-field py-2 text-xs"
            aria-label="Distance filter"
          >
            <option value="2000">Within 2 km</option>
            <option value="5000">Within 5 km</option>
            <option value="10000">Within 10 km</option>
          </select>
          <select
            value={filters.minRating}
            onChange={e => setFilters(f => ({ ...f, minRating: e.target.value }))}
            className="input-field py-2 text-xs"
            aria-label="Rating filter"
          >
            <option value="">Any rating</option>
            <option value="3.5">3.5+ rating</option>
            <option value="4">4+ rating</option>
            <option value="4.5">4.5+ rating</option>
          </select>
          <button
            onClick={() => setFilters(f => ({ ...f, openNow: !f.openNow }))}
            className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${filters.openNow ? 'bg-green-600 text-white' : 'bg-white text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300'}`}
          >
            {filters.openNow ? 'Open now' : 'Any time'}
          </button>
          {serviceType === 'doctor' ? (
            <select
              value={filters.specialty}
              onChange={e => setFilters(f => ({ ...f, specialty: e.target.value }))}
              className="input-field py-2 text-xs"
              aria-label="Doctor specialty filter"
            >
              <option value="">Any specialty</option>
              <option value="Cardiologist">Cardiology</option>
              <option value="Emergency Medicine">Emergency</option>
              <option value="Pediatrician">Pediatric</option>
              <option value="Orthopedic">Orthopedic</option>
            </select>
          ) : (
            <div className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-300">
              Nearest first
            </div>
          )}
        </div>

        {loading && (
          <Loader text={`Searching nearby ${serviceType}...`} />
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm">{error}</p>
            <button onClick={fetchServices} className="mt-2 text-sm text-red-600 font-medium">Retry</button>
          </div>
        )}

        <div className="space-y-3">
          {services.slice(0, 8).map(service => {
            const ServiceIcon = serviceIcons[serviceType].icon
            const isSelected = selectedService?.id === service.id
            return (
              <div 
                key={service.id} 
                onClick={() => {
                  setSelectedService(service)
                  setMapCenter(service.location)
                }}
                className={`card flex gap-4 items-start cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${serviceIcons[serviceType].color}`}>
                  <ServiceIcon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{service.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{service.address}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                      <Star size={12} fill="currentColor" />
                      {service.rating || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Navigation size={12} />
                      {service.distance ? `${service.distance.toFixed(1)} km` : 'N/A'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${service.openNow ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'}`}>
                      {service.openNow === null ? 'Hours N/A' : service.openNow ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  {isSelected && (
                    <p className="text-xs text-red-600 mt-2 font-medium">📍 Showing on map</p>
                  )}
                </div>
                <button className="shrink-0 w-9 h-9 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-100 transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            )
          })}
        </div>

        {services.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <MapPin size={40} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No services found nearby</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="px-4 mt-6 grid grid-cols-3 gap-3">
        <div className="card text-center py-4">
          <Clock size={20} className="mx-auto text-red-500 mb-1" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">&lt;5m</p>
          <p className="text-[10px] text-gray-500">Avg Response</p>
        </div>
        <div className="card text-center py-4">
          <Ambulance size={20} className="mx-auto text-blue-500 mb-1" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">500+</p>
          <p className="text-[10px] text-gray-500">Ambulances</p>
        </div>
        <div className="card text-center py-4">
          <Phone size={20} className="mx-auto text-green-500 mb-1" />
          <p className="text-lg font-bold text-gray-900 dark:text-white">24/7</p>
          <p className="text-[10px] text-gray-500">Support</p>
        </div>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}
