import { Heart, Shield, Zap, Globe, Users, Award, ChevronRight } from 'lucide-react'

export default function About() {
  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-5 pb-10 rounded-b-3xl">
        <h1 className="text-2xl font-bold">About LifeLine+</h1>
        <p className="text-red-100 text-sm mt-1">Building India&apos;s fastest emergency response network</p>
      </div>

      <div className="px-4 -mt-6">
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            LifeLine+ is a real-time emergency response and crisis coordination platform designed specifically for India.
            We combine live GPS tracking, AI-powered verification, and smart routing to connect patients with ambulances,
            hospitals, doctors, and police — faster than ever before.
          </p>
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-3">Our Mission</h2>
        <div className="space-y-3">
          {[
            { icon: Zap, title: 'Speed', desc: 'Under 5-minute average ambulance response time' },
            { icon: Shield, title: 'Safety', desc: 'AI-verified civilian emergency mode with police alerts' },
            { icon: Globe, title: 'Coverage', desc: 'Nationwide network of hospitals, doctors, and police' },
            { icon: Users, title: 'Community', desc: 'Citizen-driven emergency assistance when ambulances are scarce' }
          ].map((item, i) => (
            <div key={i} className="card flex gap-4 items-start">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center shrink-0">
                <item.icon size={22} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-3">The Team</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Atanu Saha', role: 'Team Lead & Strategy' },
            { name: 'Babin Bid', role: 'Tech & Architecture' },
            { name: 'Rohit Kumar Adak', role: 'Backend & APIs' },
            { name: 'Sagnik Bachhar', role: 'Frontend & UX' }
          ].map((member, i) => (
            <div key={i} className="card text-center">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto flex items-center justify-center text-lg font-bold text-red-600">
                {member.name.charAt(0)}
              </div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white mt-2">{member.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
