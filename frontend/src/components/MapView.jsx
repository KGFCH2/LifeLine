import { useEffect, useRef, useState } from 'react'
import { Compass, ZoomIn, ZoomOut, Layers, Navigation } from 'lucide-react'
import { loadGoogleMaps } from '../lib/googleMaps.js'

// ── SVG marker icons ───────────────────────────────────────────────────────
function makePin(fillColor, strokeColor, label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">
    <filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25"/></filter>
    <path d="M20 2C10.06 2 2 10.06 2 20c0 13 18 30 18 30s18-17 18-30C38 10.06 29.94 2 20 2z" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2" filter="url(#s)"/>
    <text x="20" y="25" text-anchor="middle" font-size="12" font-weight="bold" fill="white" font-family="sans-serif">${label}</text>
  </svg>`
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(40, 52),
    anchor: new window.google.maps.Point(20, 50),
  }
}

function getUserDotIcon() {
  // Pulsing blue dot for "You are here"
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="22" fill="#3b82f6" fill-opacity="0.15"/>
    <circle cx="24" cy="24" r="14" fill="#3b82f6" stroke="white" stroke-width="3"/>
    <circle cx="24" cy="24" r="5" fill="white"/>
  </svg>`
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 20),
  }
}

function getHospitalPinIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="56" viewBox="0 0 44 56">
    <filter id="sh"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.3"/></filter>
    <path d="M22 2C10.4 2 1 11.4 1 23c0 14.4 21 31 21 31s21-16.6 21-31C43 11.4 33.6 2 22 2z" fill="#C8102E" filter="url(#sh)"/>
    <circle cx="22" cy="22" r="14" fill="white" opacity="0.95"/>
    <rect x="18" y="14" width="8" height="16" rx="2" fill="#C8102E"/>
    <rect x="14" y="18" width="16" height="8" rx="2" fill="#C8102E"/>
  </svg>`
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(44, 56),
    anchor: new window.google.maps.Point(22, 54),
  }
}

function getPolicePinIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="56" viewBox="0 0 44 56">
    <filter id="sp"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.3"/></filter>
    <path d="M22 2C10.4 2 1 11.4 1 23c0 14.4 21 31 21 31s21-16.6 21-31C43 11.4 33.6 2 22 2z" fill="#1e3a8a" filter="url(#sp)"/>
    <circle cx="22" cy="22" r="14" fill="white" opacity="0.95"/>
    <path d="M22 14l-6 2.5v4.5c0 3.7 2.6 7.1 6 8 3.4-.9 6-4.3 6-8v-4.5l-6-2.5z" fill="#1e3a8a"/>
    <path d="M22 17l4 1.5v3c0 2.5-1.7 4.7-4 5.5-2.3-.8-4-3-4-5.5v-3l4-1.5z" fill="#3b82f6"/>
  </svg>`
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(44, 56),
    anchor: new window.google.maps.Point(22, 54),
  }
}

function getPharmacyPinIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="56" viewBox="0 0 44 56">
    <filter id="sph"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.3"/></filter>
    <path d="M22 2C10.4 2 1 11.4 1 23c0 14.4 21 31 21 31s21-16.6 21-31C43 11.4 33.6 2 22 2z" fill="#059669" filter="url(#sph)"/>
    <circle cx="22" cy="22" r="14" fill="white" opacity="0.95"/>
    <path d="M18 16h8l2 6-6 12-6-12 2-6z" fill="#059669" opacity="0.2"/>
    <rect x="16" y="18" width="12" height="6" rx="3" fill="#059669" transform="rotate(-45 22 21)"/>
    <rect x="16" y="18" width="12" height="6" rx="3" fill="#10b981" transform="rotate(-45 22 21)" opacity="0.5"/>
    <circle cx="19" cy="24" r="3" fill="#059669"/>
    <circle cx="25" cy="18" r="3" fill="#10b981"/>
  </svg>`
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(44, 56),
    anchor: new window.google.maps.Point(22, 54),
  }
}

function getDoctorPinIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="56" viewBox="0 0 44 56">
    <filter id="sd"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.3"/></filter>
    <path d="M22 2C10.4 2 1 11.4 1 23c0 14.4 21 31 21 31s21-16.6 21-31C43 11.4 33.6 2 22 2z" fill="#7c3aed" filter="url(#sd)"/>
    <circle cx="22" cy="22" r="14" fill="white" opacity="0.95"/>
    <circle cx="22" cy="18" r="4" fill="#7c3aed"/>
    <path d="M16 26c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="#7c3aed"/>
    <path d="M19 19h6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(44, 56),
    anchor: new window.google.maps.Point(22, 54),
  }
}

function getAmbulanceIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
    <filter id="amb"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.25"/></filter>
    <rect x="4" y="12" width="44" height="28" rx="6" fill="#fff" stroke="#e5e7eb" stroke-width="1.5" filter="url(#amb)"/>
    <rect x="4" y="10" width="44" height="6" rx="3" fill="#3b82f6" opacity="0.9"/>
    <rect x="6" y="10" width="10" height="6" fill="#60a5fa" opacity="0.8"/>
    <rect x="32" y="10" width="10" height="6" fill="#ef4444" opacity="0.8"/>
    <rect x="18" y="22" width="16" height="4" rx="1" fill="#C8102E"/>
    <rect x="24" y="18" width="4" height="12" rx="1" fill="#C8102E"/>
    <circle cx="12" cy="42" r="5" fill="#1f2937"/>
    <circle cx="40" cy="42" r="5" fill="#1f2937"/>
    <circle cx="12" cy="42" r="2.5" fill="#4b5563"/>
    <circle cx="40" cy="42" r="2.5" fill="#4b5563"/>
    <rect x="40" y="20" width="8" height="12" rx="2" fill="#87ceeb" opacity="0.8"/>
  </svg>`
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(52, 52),
    anchor: new window.google.maps.Point(26, 48),
  }
}

// ── Light-mode clean map style ─────────────────────────────────────────────
const LIGHT_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f8f9fa' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e8eaed' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#dadce0' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c8e6f5' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.medical', stylers: [{ visibility: 'on' }] },
  { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#eef1ea' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#374151' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
]

// Dark-mode premium map style
const DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#1e293b' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#020617' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.medical', stylers: [{ visibility: 'on' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f172a' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#334155' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#020617' }] }
]

export default function MapView({
  center,           
  markers = [],     
  routes = [],
  activeRoute = null,
  traffic = false,
  height = '100%',
  onMapClick,
  userLocation,     
  zoom = 15,
  show3D = false,
  onToggle3D,
  demoMode = false,
  demoPath = [],
  demoAmbulancePos = null,
  demoProgress = 0,
  userAvatar = null,
  onRefreshLocation,
  onHospitalSelect,
  isDark = false,
}) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)         
  const initializedRef = useRef(false)  
  const markersRef = useRef([])
  const userMarkerRef = useRef(null)
  const routeLinesRef = useRef([])
  const trafficLayerRef = useRef(null)
  const demoPathRef = useRef(null)
  const demoMarkerRef = useRef(null)
  const avatarMarkerRef = useRef(null)
  const infoWindowsRef = useRef([])     
  const autoOpenTimeoutRef = useRef(null)

  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState('')

  // ── INIT — runs once ────────────────────────────────────────────────────
  useEffect(() => {
    if (initializedRef.current || !containerRef.current) return
    let cancelled = false

    loadGoogleMaps()
      .then(() => {
        if (cancelled || !containerRef.current || initializedRef.current) return
        initializedRef.current = true

        const initialCenter = center || { lat: 22.5726, lng: 88.3639 }

        const map = new window.google.maps.Map(containerRef.current, {
          center: initialCenter,
          zoom,
          mapTypeId: 'roadmap',
          styles: isDark ? DARK_STYLE : LIGHT_STYLE,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: false,
          gestureHandling: 'greedy',
          clickableIcons: false,
        })

        mapRef.current = map
        setMapLoaded(true)

        if (onMapClick) {
          map.addListener('click', (e) => {
            onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() })
          })
        }
      })
      .catch(err => {
        if (!cancelled) setMapError(err.message || 'Unable to load Google Maps')
      })

    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Theme update ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return
    if (!show3D) {
      mapRef.current.setOptions({ styles: isDark ? DARK_STYLE : LIGHT_STYLE })
    }
  }, [isDark, show3D])

  // ── Stable centering ──────────────────────────────────────────────────
  const prevCenterRef = useRef(null)
  useEffect(() => {
    if (!mapRef.current || !center || demoMode) return
    const prev = prevCenterRef.current
    const changed = !prev || Math.abs(prev.lat - center.lat) > 0.0001 || Math.abs(prev.lng - center.lng) > 0.0001
    if (!changed) return
    prevCenterRef.current = center
    if (!mapLoaded) return
    mapRef.current.panTo(center)
  }, [center, mapLoaded, demoMode])

  // ── Traffic layer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return
    if (!trafficLayerRef.current) trafficLayerRef.current = new window.google.maps.TrafficLayer()
    trafficLayerRef.current.setMap(traffic ? mapRef.current : null)
  }, [traffic, mapLoaded])

  // ── 3D / style toggle ───────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.setOptions({
      mapTypeId: show3D ? 'satellite' : 'roadmap',
      tilt: show3D ? 45 : 0,
      styles: show3D ? [] : (isDark ? DARK_STYLE : LIGHT_STYLE),
    })
  }, [show3D, isDark])

  // ── Markers ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return

    markersRef.current.forEach(m => m.setMap(null))
    infoWindowsRef.current.forEach(w => w.close())
    markersRef.current = []
    infoWindowsRef.current = []

    if (userMarkerRef.current) { userMarkerRef.current.setMap(null); userMarkerRef.current = null }

    if (userLocation) {
      userMarkerRef.current = new window.google.maps.Marker({
        position: userLocation, map: mapRef.current, title: 'Your Location',
        icon: getUserDotIcon(), zIndex: 100,
      })
    }

    const hospitalMarkers = []
    markers.forEach(marker => {
      if (!marker?.position?.lat) return
      let icon
      switch (marker.type) {
        case 'hospital': icon = getHospitalPinIcon(); break
        case 'police': icon = getPolicePinIcon(); break
        case 'pharmacy': icon = getPharmacyPinIcon(); break
        case 'doctor': icon = getDoctorPinIcon(); break
        case 'ambulance': icon = getAmbulanceIcon(); break
        default: return
      }

      const m = new window.google.maps.Marker({
        position: marker.position, map: mapRef.current, title: marker.title || '',
        icon, zIndex: marker.type === 'hospital' ? 200 : 150,
        animation: marker.bounce ? window.google.maps.Animation.BOUNCE : null,
      })

      if (marker.info) {
        const iw = new window.google.maps.InfoWindow({ content: marker.info, maxWidth: 240 })
        m.addListener('click', () => {
          infoWindowsRef.current.forEach(w => w.close())
          iw.open(mapRef.current, m)
          if (marker.type === 'hospital' && onHospitalSelect) onHospitalSelect(marker.hospitalIdx)
        })
        infoWindowsRef.current.push(iw)
      }
      markersRef.current.push(m)
      if (marker.type === 'hospital') hospitalMarkers.push(marker.position)
    })

    // Strict bounds fit — only if not animating
    if (userLocation && hospitalMarkers.length > 0 && !demoMode && !demoAmbulancePos) {
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend(userLocation)
      hospitalMarkers.forEach(p => bounds.extend(p))
      mapRef.current.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 })
    }
  }, [markers, userLocation, mapLoaded, demoMode, demoAmbulancePos])

  // ── Routes ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return
    routeLinesRef.current.forEach(r => r.setMap(null))
    routeLinesRef.current = []

    const allRoutes = activeRoute ? [activeRoute, ...routes.filter(r => r.id !== activeRoute.id)] : routes
    allRoutes.forEach((route) => {
      let path
      try {
        if (route.polyline) path = window.google.maps.geometry.encoding.decodePath(route.polyline)
        else if (route.path) path = route.path
        else return
      } catch { return }

      const isActive = route.id === activeRoute?.id
      const line = new window.google.maps.Polyline({
        path, map: mapRef.current,
        strokeColor: isActive ? '#C8102E' : (route.fastest ? '#16a34a' : '#9ca3af'),
        strokeOpacity: isActive ? 1 : 0.4,
        strokeWeight: isActive ? 5 : 3,
        zIndex: isActive ? 10 : 5,
      })
      routeLinesRef.current.push(line)
    })

    if (activeRoute && !demoMode) {
      try {
        const bounds = new window.google.maps.LatLngBounds()
        const path = activeRoute.polyline ? window.google.maps.geometry.encoding.decodePath(activeRoute.polyline) : activeRoute.path
        path.forEach(p => bounds.extend(p))
        mapRef.current.fitBounds(bounds, { top: 80, right: 80, bottom: 80, left: 80 })
      } catch {}
    }
  }, [routes, activeRoute, mapLoaded, demoMode])

  // ── Demo animation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return
    if (!demoMode) {
      if (demoPathRef.current) demoPathRef.current.setMap(null)
      if (demoMarkerRef.current) demoMarkerRef.current.setMap(null)
      return
    }
    if (demoPath.length > 1) {
      if (!demoPathRef.current) {
        demoPathRef.current = new window.google.maps.Polyline({
          path: demoPath, map: mapRef.current, strokeColor: '#16a34a', strokeWeight: 5, zIndex: 20
        })
      } else { demoPathRef.current.setPath(demoPath) }
    }
    if (demoAmbulancePos) {
      if (!demoMarkerRef.current) {
        demoMarkerRef.current = new window.google.maps.Marker({
          position: demoAmbulancePos, map: mapRef.current, icon: getAmbulanceIcon(), zIndex: 500
        })
      } else { demoMarkerRef.current.setPosition(demoAmbulancePos) }
    }
  }, [demoMode, demoPath, demoAmbulancePos, mapLoaded])

  // ── Controls ────────────────────────────────────────────────────────────
  const handleRecenter = () => {
    if (onRefreshLocation) onRefreshLocation()
    if (mapRef.current && userLocation) {
      mapRef.current.panTo(userLocation)
      mapRef.current.setZoom(16)
    }
  }
  const handleZoom = (delta) => {
    if (mapRef.current) mapRef.current.setZoom(mapRef.current.getZoom() + delta)
  }

  const btnClass = `w-10 h-10 rounded-xl shadow-lg flex items-center justify-center transition-all active:scale-90 border ${
    isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
  }`

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <div ref={containerRef} className="w-full h-full" />

      {!mapLoaded && (
        <div className={`absolute inset-0 flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
          <div className="flex flex-col items-center gap-4">
            {mapError ? (
              <p className="max-w-xs text-center text-sm font-bold text-red-500">{mapError}</p>
            ) : (
              <>
                <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
                <p className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Loading LifeLine Maps...</p>
              </>
            )}
          </div>
        </div>
      )}

      {mapLoaded && (
        <>
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <button onClick={handleRecenter} className={btnClass}><Compass size={18} /></button>
            <button onClick={() => handleZoom(1)} className={btnClass}><ZoomIn size={18} /></button>
            <button onClick={() => handleZoom(-1)} className={btnClass}><ZoomOut size={18} /></button>
          </div>

          {onToggle3D && (
            <button onClick={onToggle3D} className={`absolute top-4 right-4 px-4 py-2 rounded-xl shadow-lg font-black text-[10px] uppercase tracking-widest border transition-all ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-gray-100 text-gray-600'
            }`}>
              <div className="flex items-center gap-2"><Layers size={14} /> {show3D ? '2D View' : '3D View'}</div>
            </button>
          )}

          {traffic && (
            <div className={`absolute bottom-4 left-4 px-3 py-2 rounded-xl shadow-sm border backdrop-blur-md flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
              isDark ? 'bg-slate-900/80 border-slate-700 text-slate-400' : 'bg-white/80 border-gray-100 text-gray-500'
            }`}>
              <Navigation size={12} className="text-emerald-500 animate-pulse" /> Live Traffic
            </div>
          )}
        </>
      )}
    </div>
  )
}
