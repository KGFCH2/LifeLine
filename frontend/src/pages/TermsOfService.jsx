import { FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TermsOfService() {
  window.scrollTo(0, 0)

  const sections = [
    {
      title: 'Acceptance of Terms',
      text: 'By accessing or using LifeLine+, you agree to be bound by these Terms. If you disagree with any part, you may not use the service. These terms apply to all users, including visitors, registered users, and emergency responders.'
    },
    {
      title: 'Service Description',
      text: 'LifeLine+ provides location-based emergency discovery, ambulance booking, doctor appointment scheduling, and AI-assisted civilian emergency verification. We do not provide medical services directly. All medical care is delivered by third-party hospitals, doctors, and ambulance operators.'
    },
    {
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
      title: 'Limitation of Liability',
      text: 'LifeLine+ is a technology platform connecting users with emergency services. We are not liable for delays caused by traffic, weather, third-party provider unavailability, or GPS inaccuracies. Response times shown are estimates, not guarantees. Always call 108 or 100 for critical emergencies if the app is unavailable.'
    },
    {
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
      title: 'Payment & Billing',
      text: 'Basic discovery and emergency routing are free. Ambulance bookings and doctor appointments may involve charges set by the service provider. LifeLine+ does not process payments directly; transactions occur between user and provider. We may introduce premium features with clear pricing in the future.'
    },
    {
      title: 'Termination',
      text: 'We may suspend or terminate accounts for misuse, false emergency reports, or violation of these terms. Users may delete their account at any time from the Profile page. Upon termination, emergency session data is retained for 30 days for legal compliance then deleted.'
    },
  ]

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-5 pb-10 rounded-b-3xl">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText size={24} /> Terms of Service
        </h1>
        <p className="text-red-100 text-sm mt-1">Rules for using LifeLine+ safely and responsibly</p>
      </div>

      <div className="px-4 mt-4 space-y-4">
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-xl p-4">
          <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong className="text-amber-700 dark:text-amber-400">Important:</strong> LifeLine+ is a technology platform, not a medical or law enforcement agency. 
            In life-threatening situations, always dial <strong>108</strong> (Ambulance) or <strong>100</strong> (Police) directly.
          </p>
        </div>

        {sections.map((section, i) => (
          <div key={i} className="card">
            <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
              <Scale size={14} className="text-red-500" />
              {section.title}
            </h2>
            {section.text && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{section.text}</p>
            )}
            {section.items && (
              <ul className="space-y-2 mt-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center pt-2">
          Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  )
}
