import { FileText, Scale, AlertTriangle, CheckCircle, HandHeart, MapPin, ShieldCheck, CreditCard, Ban, Gavel, ScrollText } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'

export default function TermsOfService() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const sections = [
    {
      icon: HandHeart,
      title: 'Acceptance of Terms',
      text: 'By accessing or using LifeLine+, you agree to be bound by these Terms. If you disagree with any part, you may not use the service. These terms apply to all users, including visitors, registered users, and emergency responders.'
    },
    {
      icon: MapPin,
      title: 'Service Description',
      text: 'LifeLine+ provides location-based emergency discovery, ambulance booking, doctor appointment scheduling, and AI-assisted civilian emergency verification. We do not provide medical services directly. All medical care is delivered by third-party hospitals, doctors, and ambulance operators.'
    },
    {
      icon: ScrollText,
      title: 'User Responsibilities',
      items: [
        'Provide accurate location data for emergency response',
        'Submit truthful information in Civilian Mode verification',
        'Do not misuse emergency services for non-emergency purposes',
        'Keep your account credentials secure and confidential',
        'Comply with all applicable traffic and emergency vehicle laws',
      ]
    },
    {
      icon: ShieldCheck,
      title: 'Limitation of Liability',
      text: 'LifeLine+ is a technology platform connecting users with emergency services. We are not liable for delays caused by traffic, weather, third-party provider unavailability, or GPS inaccuracies. Response times shown are estimates, not guarantees. Always call 108 or 100 for critical emergencies if the app is unavailable.'
    },
    {
      icon: Gavel,
      title: 'Civilian Mode Terms',
      items: [
        'Temporary emergency status is valid for 6 hours only',
        'Misuse may result in permanent account ban and legal action',
        'Police alerts are sent automatically; false alerts are a criminal offense under IPC',
        'Vehicle must have valid insurance and registration',
        'User assumes full liability while operating under civilian emergency status',
      ]
    },
    {
      icon: CreditCard,
      title: 'Payment & Billing',
      text: 'Basic discovery and emergency routing are free. Ambulance bookings and doctor appointments may involve charges set by the service provider. LifeLine+ does not process payments directly; transactions occur between user and provider. We may introduce premium features with clear pricing in the future.'
    },
    {
      icon: Ban,
      title: 'Termination',
      text: 'We may suspend or terminate accounts for misuse, false emergency reports, or violation of these terms. Users may delete their account at any time from the Profile page. Upon termination, emergency session data is retained for 30 days for legal compliance then deleted.'
    },
  ]

  return (
    <div className={`pb-24 transition-colors duration-300 ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <div className={`p-10 pb-16 rounded-b-[3rem] shadow-xl bg-gradient-to-br from-[#C8102E] to-[#a50d26] text-white ${isDark ? 'border-b border-white/10' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black flex items-center gap-3 text-white">
            <FileText size={36} className="animate-pulse" /> Terms of Service
          </h1>
          <p className="text-lg mt-2 text-red-100">Rules for using LifeLine+ safely and responsibly</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-12 space-y-6">
        <div className={`flex items-start gap-4 rounded-2xl p-6 border transition-colors shadow-sm ${isDark ? 'bg-amber-900/10 border-amber-900/20 text-amber-400' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
          <AlertTriangle size={24} className="shrink-0 mt-0.5 animate-bounce" />
          <p className="text-sm leading-relaxed">
            <strong className="font-black">Important:</strong> LifeLine+ is a technology platform, not a medical or law enforcement agency. 
            In life-threatening situations, always dial <strong className="font-black text-red-500">108</strong> (Ambulance) or <strong className="font-black text-blue-500">100</strong> (Police) directly.
          </p>
        </div>

        {sections.map((section, i) => (
          <div 
            key={i} 
            className="card group hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${isDark ? 'bg-slate-800 text-red-500 shadow-lg' : 'bg-red-50 text-[#C8102E]'}`}>
                <section.icon size={24} />
              </div>
              <h2 className={`font-black text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{section.title}</h2>
            </div>
            
            {section.text && (
              <p className={`text-sm leading-relaxed pl-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{section.text}</p>
            )}
            
            {section.items && (
              <ul className="space-y-3 mt-4 pl-2">
                {section.items.map((item, j) => (
                  <li 
                    key={j} 
                    className="flex items-start gap-3 text-sm group/li"
                  >
                    <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5 group-hover/li:scale-110 transition-transform" />
                    <span className={`transition-colors ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-gray-600 hover:text-gray-900'}`}>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="text-center pt-12">
          <Scale size={32} className="mx-auto text-gray-400/30 mb-4" />
          <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
