import { useState, useRef, useEffect } from 'react'
import { ChevronDown, HelpCircle, MessageCircle, Zap, Ambulance, Shield, CreditCard, MapPin, Wifi, Smartphone, Globe, Plus, Stethoscope, Siren, Clock, Award } from 'lucide-react'

const faqs = [
  { icon: Zap, q: 'What is LifeLine+?', a: 'LifeLine+ is a real-time emergency response platform for India. It connects users with ambulances, hospitals, doctors, and police using live GPS tracking, AI-powered routing, and instant communication — all in one app.' },
  { icon: Clock, q: 'How fast can an ambulance reach me?', a: 'Average response time is under 5 minutes in urban areas. The app calculates live ETA based on real-time traffic data from Google Maps and distance from your location. You see the exact arrival time before booking.' },
  { icon: Shield, q: 'What if no ambulance is available nearby?', a: 'If no ambulance is within range, the app offers Civilian Mode. Gemini AI verifies your emergency request using your vehicle number, purpose, and contact. If approved, your personal vehicle gets temporary emergency status for 6 hours with police alerts along your route.' },
  { icon: CreditCard, q: 'Is the LifeLine+ service free?', a: 'Emergency discovery, route planning, and AI chat assistance are completely free. Ambulance bookings and doctor appointments may involve charges set by the individual provider. We never charge for basic emergency coordination.' },
  { icon: Siren, q: 'How does Civilian Mode work step-by-step?', a: '1) Tap "No ambulance nearby? Use Civilian Mode" 2) Enter your vehicle registration number, emergency purpose, and contact 3) Gemini AI evaluates in ~3 seconds 4) If approved, a temporary emergency vehicle ID is issued 5) Police stations along your route are auto-alerted 6) Your live GPS broadcasts every 5 seconds for safety tracking.' },
  { icon: Shield, q: 'Are my location and personal data secure?', a: 'Absolutely. We use TLS 1.3 encryption for all API calls, location data is purged 24 hours after emergency resolution, and we comply with India\'s Digital Personal Data Protection Act, 2023. Location is only shared during active emergencies with authorized responders.' },
  { icon: Stethoscope, q: 'Can I book a doctor appointment through the app?', a: 'Yes. Use the Doctors tab to search nearby doctors and clinics by specialty (Cardiology, Emergency, Pediatrics, Orthopedics). View real-time availability, select a time slot, and confirm your booking. You also get the doctor\'s phone number for direct contact.' },
  { icon: Wifi, q: 'Does LifeLine+ work without internet?', a: 'The Progressive Web App (PWA) caches key assets and emergency contact numbers. Cached map tiles and saved hospital data work offline. However, live ambulance tracking, AI chat, and real-time route updates require an internet connection.' },
  { icon: Ambulance, q: 'How does the ambulance demo animation work?', a: 'When you book an ambulance, the map shows a live demo of the ambulance driving from its current location to your pickup spot. A colored path appears between the two points, and the ambulance marker smoothly animates along the route with a real-time countdown timer showing arrival time.' },
  { icon: MapPin, q: 'What is the 3D ambulance marker on the map?', a: 'Unlike flat pins, LifeLine+ uses a custom 3D-style ambulance SVG marker with depth, shadows, and a subtle floating animation. This makes it easy to spot the ambulance on the map at a glance — inspired by Uber, Rapido, and Flipkart Minutes live tracking.' },
  { icon: Globe, q: 'Can I use LifeLine+ in any city in India?', a: 'Yes. LifeLine+ works anywhere Google Maps covers in India. The backend discovers real hospitals, police stations, doctors, and pharmacies through the Google Places API. Urban areas have the highest accuracy due to denser map data.' },
  { icon: Smartphone, q: 'How do I add LifeLine+ to my phone home screen?', a: 'On Android Chrome: Tap the menu (3 dots) → "Add to Home screen". On iOS Safari: Tap the Share button → "Add to Home Screen". This installs the PWA for faster access, offline fallback, and a native app-like experience.' },
]

import FAQAccordion from '../components/FAQAccordion.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function FAQs() {
  const [open, setOpen] = useState(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-500 ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <div className={`p-8 pb-16 rounded-b-[3rem] transition-all duration-500 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#C8102E] to-[#A50D26] text-white ${
        isDark ? 'border-b border-white/10' : ''
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        
        <h1 className="text-4xl font-black flex items-center gap-4 animate-in slide-in-from-left duration-500">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-red-500/20 text-red-500' : 'bg-white/20 text-white'}`}>
            <HelpCircle size={28} />
          </div>
          Frequently Asked Questions
        </h1>
        <p className={`text-sm mt-4 font-bold max-w-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-red-100'}`}>
          Find answers to common questions about India's most advanced emergency response platform.
        </p>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {/* Quick support banner with enhanced hover */}
        <div className={`border rounded-2xl p-5 flex items-start gap-4 mb-4 transition-all duration-300 group cursor-default ${
          isDark 
            ? 'bg-slate-800 border-slate-700 hover:border-slate-600 shadow-xl' 
            : 'bg-blue-50/50 border-blue-100 hover:border-blue-200 shadow-sm'
        }`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-105 ${
            isDark ? 'bg-slate-700 text-blue-400 border border-slate-600' : 'bg-blue-500 text-white'
          }`}>
            <MessageCircle size={24} />
          </div>
          <div className="flex-1">
            <p className={`text-base font-black transition-colors ${isDark ? 'text-white' : 'text-gray-900 group-hover:text-blue-600'}`}>Still have questions?</p>
            <p className={`text-sm mt-1 leading-relaxed font-bold ${isDark ? 'text-slate-200' : 'text-gray-600'}`}>
              Our team is ready to help you 24/7. Reach out via the Contact page or email{' '}
              <a 
                href="mailto:support@lifelineplus.in" 
                className={`font-black underline transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                support@lifelineplus.in
              </a>
            </p>
          </div>
        </div>

        {faqs.map((item, i) => (
          <FAQAccordion
            key={i}
            item={item}
            index={i}
            isOpen={open === i}
            onToggle={setOpen}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  )
}
