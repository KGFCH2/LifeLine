import { BookOpen, Code, Zap, Server, MapPin, Shield, Smartphone, Globe } from 'lucide-react'

export default function Documentation() {
  window.scrollTo(0, 0)

  const sections = [
    {
      icon: Globe,
      title: 'Getting Started',
      steps: [
        'Open http://localhost:5173 in a modern browser (Chrome, Edge, Safari)',
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
    <div className="pb-24">
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-5 pb-10 rounded-b-3xl">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen size={24} /> Documentation
        </h1>
        <p className="text-red-100 text-sm mt-1">How to use, integrate, and extend LifeLine+</p>
      </div>

      <div className="px-4 mt-4 space-y-4">
        <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-xl p-4">
          <Zap size={20} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong className="text-green-700 dark:text-green-400">Quick Tip:</strong> For the best experience, 
            enable high-accuracy GPS and keep the app open during active emergencies for real-time tracking.
          </p>
        </div>

        {sections.map((section, i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                <section.icon size={16} />
              </div>
              <h2 className="font-bold text-gray-900 dark:text-white text-sm">{section.title}</h2>
            </div>
            <ol className="space-y-2">
              {section.steps.map((step, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {j + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}

        <div className="card">
          <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
            <Code size={14} className="text-red-500" />
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">React 18 + Vite</div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">Tailwind CSS</div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">Node.js + Express</div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">Socket.io</div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">Google Maps JS API</div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">Gemini 1.5 Flash</div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">Firebase Auth + Admin</div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">Vite PWA Plugin</div>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center pt-2">
          See ARCHITECTURE.md, CORE_LOGIC.md, and INSTRUCTIONS.md in the project root for deep-dive docs.
        </p>
      </div>
    </div>
  )
}
