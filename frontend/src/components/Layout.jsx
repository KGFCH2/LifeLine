import { Outlet, useLocation } from 'react-router-dom'
import TopNav from './TopNav.jsx'
import SOSButton from './SOSButton.jsx'
import Footer from './Footer.jsx'
import GlobalTrackingBar from './GlobalTrackingBar.jsx'
import { useEffect } from 'react'
import { Ambulance, CheckCircle, X } from 'lucide-react'
import { useEmergency } from '../context/EmergencyContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Layout() {
  const location = useLocation()
  const { theme } = useTheme()
  const { 
    showArrivalNotification, setShowArrivalNotification, arrivalType,
    showCancelNotification, setShowCancelNotification 
  } = useEmergency()
  const isDark = theme === 'dark'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  const hideSOS = ['/emergency'].includes(location.pathname)

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <TopNav />
      <main className="flex-1 pt-14">
        <Outlet />
      </main>
      <Footer />
      <GlobalTrackingBar />
      {!hideSOS && <SOSButton />}

      {/* Global Arrival Notification */}
      {showArrivalNotification && (
        <div className="fixed z-[200] top-20 left-4 right-4 max-w-md mx-auto animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-4 p-4 text-white shadow-2xl bg-emerald-500 rounded-[2rem] border border-white/20 backdrop-blur-md">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-2xl shrink-0 shadow-lg">
              <Ambulance size={22} className="text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="flex items-center gap-2 font-black text-sm uppercase tracking-wider">
                {arrivalType === 'user' ? 'Ambulance Arrived!' : 'Hospital Reached!'} <CheckCircle size={16} />
              </h3>
              <p className="text-[11px] font-medium text-emerald-50 opacity-90 truncate">
                {arrivalType === 'user' 
                  ? 'Your ambulance has reached your location' 
                  : 'You have safely reached the medical facility'}
              </p>
            </div>
            <button 
              onClick={() => setShowArrivalNotification(false)} 
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-inner"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Global Cancellation Notification */}
      {showCancelNotification && (
        <div className="fixed z-[200] top-20 left-4 right-4 max-w-md mx-auto animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-4 p-4 text-white shadow-2xl bg-red-500 rounded-[2rem] border border-white/20 backdrop-blur-md">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-2xl shrink-0 shadow-lg">
              <X size={22} className="text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="flex items-center gap-2 font-black text-sm uppercase tracking-wider">
                Booking Cancelled <X size={16} />
              </h3>
              <p className="text-[11px] font-medium text-red-50 opacity-90 truncate">
                Your ambulance request has been cancelled successfully.
              </p>
            </div>
            <button 
              onClick={() => setShowCancelNotification(false)} 
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-600 hover:bg-red-700 transition-colors shadow-inner"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
