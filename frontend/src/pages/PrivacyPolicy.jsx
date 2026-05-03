import { useState } from 'react'
import { Shield, Lock, Eye, Database, Trash2, Mail, Fingerprint, Server, Key, FileCheck, Send, Clock, Loader2 } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'

export default function PrivacyPolicy() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [loading, setLoading] = useState(false)

  const handleContact = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      window.location.href = "mailto:privacy@lifelineplus.in"
    }, 1500)
  }

  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      items: [
        { icon: Fingerprint, text: 'Real-time GPS location during active emergency sessions' },
        { icon: Key, text: 'Vehicle registration number (Civilian Mode only)' },
        { icon: Send, text: 'Contact phone number for emergency coordination' },
        { icon: Shield, text: 'Firebase authentication ID and display name' },
        { icon: Server, text: 'Device type and browser version for compatibility' },
      ]
    },
    {
      icon: Lock,
      title: 'How We Protect Your Data',
      items: [
        { icon: Lock, text: 'End-to-end encryption for location sharing during emergencies' },
        { icon: Shield, text: 'All API communication uses TLS 1.3 over HTTPS' },
        { icon: Trash2, text: 'Location data is purged 24 hours after emergency resolution' },
        { icon: Key, text: 'Firebase Admin SDK with service-account-only access' },
        { icon: Eye, text: 'No third-party ad trackers or analytics cookies' },
      ]
    },
    {
      icon: Database,
      title: 'Data Storage & Retention',
      items: [
        { icon: Clock, text: 'Emergency session data: retained for 24 hours then auto-deleted' },
        { icon: FileCheck, text: 'Doctor appointment records: retained until account deletion' },
        { icon: Database, text: 'User profile data: stored until you request deletion' },
        { icon: Eye, text: 'Aggregated analytics: anonymized and kept for 90 days' },
        { icon: Server, text: 'All data stored in Firebase Firestore (GCP Mumbai region)' },
      ]
    },
    {
      icon: Trash2,
      title: 'Your Rights & Deletion',
      items: [
        { icon: FileCheck, text: 'Right to access: export all your data from Profile settings' },
        { icon: Trash2, text: 'Right to deletion: request full account purge within 7 days' },
        { icon: Key, text: 'Right to rectification: update vehicle/contact info anytime' },
        { icon: Lock, text: 'Right to restriction: pause location sharing in Profile' },
        { icon: Mail, text: 'Complaints: email us at privacy@lifelineplus.in' },
      ]
    },
  ]

  return (
    <div className={`pb-24 transition-colors duration-300 ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <div className={`p-10 pb-16 rounded-b-[3rem] shadow-xl bg-gradient-to-br from-[#C8102E] to-[#a50d26] text-white ${isDark ? 'border-b border-white/10' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black flex items-center gap-3 text-white">
            <Shield size={36} className="animate-pulse" /> Privacy Policy
          </h1>
          <p className="text-lg mt-2 text-red-100">How we handle your data with care</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-12 space-y-6">
        <div className={`text-sm leading-relaxed rounded-2xl p-6 border-l-4 border-[#C8102E] shadow-sm ${isDark ? 'bg-slate-900/50 text-slate-400 border-slate-800' : 'bg-white text-gray-600 border-gray-100'}`}>
          <p className="flex items-start gap-3">
            <Lock size={20} className="text-[#C8102E] shrink-0 mt-0.5" />
            LifeLine+ is committed to protecting your privacy. This policy explains what data we collect, 
            how we use it, and your rights under the Digital Personal Data Protection Act, 2023 (India).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, i) => (
            <div 
              key={i} 
              className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${isDark ? 'bg-slate-800 text-red-500 shadow-lg' : 'bg-red-50 text-[#C8102E]'}`}>
                  <section.icon size={24} />
                </div>
                <h2 className={`font-black text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, j) => (
                  <li 
                    key={j} 
                    className={`flex items-start gap-3 text-sm transition-colors p-2 rounded-xl ${isDark ? 'text-slate-400 hover:bg-slate-800/50' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <item.icon size={16} className="text-red-400 shrink-0 mt-0.5 group-hover:text-[#C8102E] transition-colors" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`card p-10 border-t-4 border-[#3b82f6] ${isDark ? 'bg-slate-900' : 'bg-blue-50/50'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
              <div className="w-16 h-16 bg-blue-500 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-500/30 transition-transform hover:scale-105 shrink-0">
                <Mail size={32} className="text-white" />
              </div>
              <div>
                <h3 className={`font-black text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Still have questions?</h3>
                <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Our privacy team is here to help.</p>
              </div>
            </div>
            
            <button 
              onClick={handleContact}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-4 px-10 rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-500/20 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Opening Mail...
                </>
              ) : (
                <>
                  <Mail size={18} />
                  Contact Us
                </>
              )}
            </button>
          </div>
        </div>

        <div className="text-center pt-12">
          <Shield size={32} className="mx-auto text-gray-400/30 mb-4" />
          <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
