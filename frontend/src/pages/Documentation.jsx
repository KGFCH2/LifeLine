import { BookOpen, Code, Zap, Server, MapPin, Shield, Smartphone, Globe, ChevronRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Documentation() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const sections = [
    {
      icon: Globe,
      title: 'Getting Started',
      steps: [
        'Open the platform in a modern browser (Chrome, Edge, Safari)',
        'Allow location access when prompted — this powers all nearby discovery',
        'Sign in with Google or use the email fallback for full features',
        'Tap the Emergency button or explore Hospitals, Police, Doctors tabs',
      ]
    },
    {
      icon: MapPin,
      title: 'Emergency Flow',
      steps: [
        'Tap "EMERGENCY — Get Help Now" from the Home screen',
        'The app auto-detects your location and nearest hospital',
        'View multiple route options with live traffic and ETA',
        'Tap "Find Nearby Ambulances" to see available vehicles',
        'Select an ambulance and confirm booking — driver gets notified',
        'Track the ambulance in real-time as it drives to your location',
      ]
    },
    {
      icon: Shield,
      title: 'Civilian Mode',
      steps: [
        'If no ambulance is nearby, the app offers Civilian Mode',
        'Enter your vehicle number, emergency purpose, and contact',
        'Gemini AI verifies the request (takes ~3 seconds)',
        'If approved, your vehicle gets temporary emergency status',
        'Police stations along your route are auto-alerted',
        'Your location is broadcast every 5 seconds for safety',
      ]
    },
    {
      icon: Server,
      title: 'API Reference (Backend)',
      steps: [
        'GET /api/health — Check server, Firebase, Maps, Gemini status',
        'GET /api/nearest-services?lat=&lng=&type= — Google Places search',
        'GET /api/routes/emergency?originLat=&originLng=&destLat=&destLng= — Directions',
        'GET /api/ambulance-request/nearby — List available ambulances',
        'POST /api/ambulance-request/request — Book ambulance',
        'POST /api/verify/civilian — Gemini AI verification',
        'POST /api/police/alert — Broadcast police alert',
      ]
    },
    {
      icon: Smartphone,
      title: 'PWA & Offline',
      steps: [
        'Add to Home Screen on Android/iOS for app-like experience',
        'Key assets are cached for offline fallback',
        'Emergency contact numbers and cached map tiles work offline',
        'Live tracking requires internet connection',
        'Background sync queues requests when connection returns',
      ]
    },
    {
      icon: Code,
      title: 'Environment Variables',
      steps: [
        'VITE_GOOGLE_MAPS_API_KEY — Required for Maps, Places, Directions',
        'VITE_GEMINI_API_KEY — Required for AI verification and chat',
        'VITE_FIREBASE_* — Required for Google Authentication',
        'VITE_BACKEND_URL — Point to backend (default: http://localhost:5000)',
        'GOOGLE_MAPS_API_KEY — Same key for backend server-side calls',
      ]
    },
  ]

  return (
    <div className={`pb-24 transition-colors duration-300 ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <div className={`p-10 pb-16 rounded-b-[3rem] shadow-xl bg-gradient-to-br from-violet-600 to-indigo-800 text-white ${isDark ? 'border-b border-white/10' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black flex items-center gap-3 text-white">
            <BookOpen size={36} /> Documentation
          </h1>
          <p className="text-lg mt-2 text-violet-100 font-medium">How to use, integrate, and extend LifeLine+</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-12 space-y-6">
        <div className={`flex items-start gap-4 rounded-2xl p-6 border transition-colors shadow-sm ${isDark ? 'bg-emerald-900/10 border-emerald-900/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
          <Zap size={24} className="shrink-0 mt-0.5 animate-pulse" />
          <p className="text-sm leading-relaxed">
            <strong className="font-black">Quick Tip:</strong> For the best experience, 
            enable high-accuracy GPS and keep the app open during active emergencies for real-time tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, i) => (
            <div key={i} className="card group hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                  <section.icon size={24} />
                </div>
                <h2 className={`font-black text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm group/li">
                    <span className={`w-6 h-6 rounded-lg font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isDark ? 'bg-slate-800 text-slate-400 group-hover/li:text-indigo-400' : 'bg-gray-100 text-gray-500 group-hover/li:text-indigo-600'}`}>
                      {j + 1}
                    </span>
                    <span className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="card p-8">
          <h2 className={`font-black text-xl mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Code size={24} className="text-indigo-500" />
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {[
              { name: 'React 18 + Vite', slug: 'react' },
              { name: 'Tailwind CSS', slug: 'tailwindcss' },
              { name: 'Node.js + Express', slug: 'nodedotjs' },
              { name: 'Socket.io', slug: 'socketdotio' },
              { name: 'Google Maps JS', slug: 'googlemaps' },
              { name: 'Gemini 1.5 Flash', slug: 'google' },
              { name: 'Firebase Auth', slug: 'firebase' },
              { name: 'Vite PWA Plugin', slug: 'pwa' }
            ].map(tech => (
              <div key={tech.name} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all hover:scale-105 group ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-white shadow-sm border border-gray-100 text-gray-700'}`}>
                <img 
                  src={`https://cdn.simpleicons.org/${tech.slug}`} 
                  className="w-5 h-5 object-contain grayscale transition-all duration-300 group-hover:grayscale-0" 
                  alt={tech.name} 
                />
                {tech.name}
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-2xl border text-center transition-colors ${isDark ? 'bg-slate-900/50 border-slate-800 text-slate-500' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
          <p className="text-xs font-medium">
            See{' '}
            <a href="https://github.com/KGFCH2/LifeLine/blob/main/ARCHITECTURE.md" target="_blank" rel="noopener noreferrer" className="text-[#C8102E] font-bold hover:underline">ARCHITECTURE.md</a>,{' '}
            <a href="https://github.com/KGFCH2/LifeLine/blob/main/CORE_LOGIC.md" target="_blank" rel="noopener noreferrer" className="text-[#C8102E] font-bold hover:underline">CORE_LOGIC.md</a>, and{' '}
            <a href="https://github.com/KGFCH2/LifeLine/blob/main/INSTRUCTIONS.md" target="_blank" rel="noopener noreferrer" className="text-[#C8102E] font-bold hover:underline">INSTRUCTIONS.md</a>{' '}
            in the project root for deep-dive docs.
          </p>
        </div>
      </div>
    </div>
  )
}
