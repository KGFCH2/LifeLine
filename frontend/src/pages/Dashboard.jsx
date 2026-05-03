import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import LoginModal from '../components/LoginModal.jsx'
import { useNavigate } from 'react-router-dom'
import {
  Activity, Ambulance, Calendar, Shield, Clock, MapPin,
  TrendingUp, Users, Phone, ChevronRight, AlertTriangle,
  Wifi, WifiOff, RefreshCw, ArrowRight
} from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
const POLL_INTERVAL = 30000 // 30s real-time refresh

const FALLBACK_STATS = {
  totalRequests: 12,
  activeAmbulances: 8,
  avgResponseTime: '4m 30s',
  policeAlerts: 3,
}

const FALLBACK_ACTIVITY = [
  { id: 1, type: 'ambulance', title: 'Ambulance AMB-1002 assigned', time: '2 min ago', status: 'active' },
  { id: 2, type: 'civilian', title: 'Civilian mode activated', time: '15 min ago', status: 'completed' },
  { id: 3, type: 'police', title: 'Police alert sent to City PS', time: '1 hour ago', status: 'completed' },
  { id: 4, type: 'booking', title: 'Dr. Sharma appointment confirmed', time: '3 hours ago', status: 'confirmed' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [stats, setStats] = useState(FALLBACK_STATS)
  const [recentActivity, setRecentActivity] = useState(FALLBACK_ACTIVITY)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const intervalRef = useRef(null)

  const fetchData = async (silent = false) => {
    if (!user) return
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const [statsRes, activityRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/dashboard/stats?userId=${user.id}`),
        fetch(`${BACKEND_URL}/api/dashboard/activity?userId=${user.id}`),
      ])
      if (statsRes.ok) {
        const d = await statsRes.json()
        setStats({
          totalRequests: d.totalRequests ?? FALLBACK_STATS.totalRequests,
          activeAmbulances: d.activeAmbulances ?? FALLBACK_STATS.activeAmbulances,
          avgResponseTime: d.avgResponseTime ?? FALLBACK_STATS.avgResponseTime,
          policeAlerts: d.policeAlerts ?? FALLBACK_STATS.policeAlerts,
        })
      }
      if (activityRes.ok) {
        const d = await activityRes.json()
        if (d.activities?.length) setRecentActivity(d.activities)
      }
      setIsLive(true)
    } catch {
      setIsLive(false)
    } finally {
      setLoading(false)
      setRefreshing(false)
      setLastUpdated(new Date())
    }
  }

  useEffect(() => {
    if (!user) { setShowLogin(true); return }
    fetchData()
    intervalRef.current = setInterval(() => fetchData(true), POLL_INTERVAL)
    return () => clearInterval(intervalRef.current)
  }, [user])

  if (!user) return showLogin ? <LoginModal onClose={() => setShowLogin(false)} /> : null

  const statCards = [
    { label: 'Total Requests', value: stats.totalRequests, icon: Ambulance, color: 'text-[#C8102E]', bg: 'bg-red-50', darkBg: 'bg-red-900/10' },
    { label: 'Avg Response', value: stats.avgResponseTime, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50', darkBg: 'bg-emerald-900/10' },
    { label: 'Active Ambulances', value: stats.activeAmbulances, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', darkBg: 'bg-blue-900/10' },
    { label: 'Police Alerts', value: stats.policeAlerts, icon: Shield, color: 'text-amber-500', bg: 'bg-amber-50', darkBg: 'bg-amber-900/10' },
  ]

  const activityIcon = (type) => {
    const map = { ambulance: Ambulance, civilian: Shield, police: AlertTriangle, booking: Calendar }
    return map[type] || Activity
  }

  const activityColors = {
    ambulance: { bg: 'bg-red-50', darkBg: 'bg-red-900/10', color: 'text-[#C8102E]' },
    civilian: { bg: 'bg-amber-50', darkBg: 'bg-amber-900/10', color: 'text-amber-500' },
    police: { bg: 'bg-blue-50', darkBg: 'bg-blue-900/10', color: 'text-blue-500' },
    booking: { bg: 'bg-emerald-50', darkBg: 'bg-emerald-900/10', color: 'text-emerald-500' },
  }

  const statusColors = {
    active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    completed: 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400',
    confirmed: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-24 ${isDark ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto px-4 py-12 pt-24">

        {/* Page Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-xs font-black text-[#C8102E] uppercase tracking-[0.2em] mb-2">OVERVIEW</p>
            <h1 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
            <div className="flex items-center gap-3 mt-3">
              {isLive ? (
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live · Auto-updating
                </span>
              ) : (
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <WifiOff size={12} />
                  Offline · Cached
                </span>
              )}
              {lastUpdated && (
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  · Last: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-2xl border transition-all active:scale-95 disabled:opacity-50 ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {statCards.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className={`rounded-[2rem] border p-6 transition-all ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 ${isDark ? s.darkBg : s.bg} rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                    <Icon size={20} className={`${s.color} transition-transform group-hover:scale-110`} />
                  </div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-tight">{s.label}</span>
                </div>
                {loading ? (
                  <div className={`h-8 w-16 rounded-lg animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
                ) : (
                  <p className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.value}</p>
                )}
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button
            onClick={() => navigate('/emergency')}
            className="bg-[#C8102E] hover:bg-[#a50d26] text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 text-sm transition-all active:scale-95 shadow-2xl shadow-red-500/20"
          >
            <Ambulance size={20} />
            Emergency
          </button>
          <button
            onClick={() => navigate('/doctors')}
            className={`font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 text-sm transition-all active:scale-95 border ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <Users size={20} />
            Find Doctors
          </button>
        </div>

        {/* Recent Activity */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-xl font-black flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Clock size={20} className="text-[#C8102E]" />
              Recent Activity
            </h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`rounded-2xl border p-5 flex items-center gap-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
                  <div className={`w-12 h-12 rounded-2xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 rounded-lg w-3/4 animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
                    <div className={`h-3 rounded-lg w-1/2 animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map(item => {
                  const Icon = activityIcon(item.type)
                  const aColor = activityColors[item.type] || { bg: 'bg-gray-50', darkBg: 'bg-slate-800', color: 'text-gray-500' }
                  return (
                    <div key={item.id} className={`rounded-2xl border p-5 flex items-center gap-4 transition-all hover:scale-[1.01] ${
                      isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
                    }`}>
                      <div className={`w-12 h-12 ${isDark ? aColor.darkBg : aColor.bg} rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-sm`}>
                        <Icon size={20} className={`${aColor.color} transition-transform group-hover:scale-110`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-base font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">{item.time}</p>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shrink-0 ${statusColors[item.status] || 'bg-gray-100 text-gray-500'}`}>
                        {item.status}
                      </span>
                    </div>
                  )
                })
              ) : (
                <div className={`rounded-3xl border border-dashed p-10 text-center ${isDark ? 'border-slate-800 bg-slate-900/20' : 'border-gray-200 bg-gray-50/50'}`}>
                   <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                     <Activity size={24} className="text-gray-400" />
                   </div>
                   <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>No recent activity found.</p>
                   <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Start by exploring nearby hospitals or specialists.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Help banner */}
        <div className={`rounded-3xl border p-6 flex items-center gap-5 transition-all ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'
        }`}>
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center shrink-0">
            <Phone size={24} className="text-[#C8102E]" />
          </div>
          <div className="flex-1">
            <p className={`text-base font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Need emergency help?</p>
            <p className="text-xs text-gray-400 font-medium mt-1">Call 108 for ambulance or 112 for national emergency</p>
          </div>
          <a href="tel:108" className="bg-[#C8102E] text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#a50d26] transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-red-500/20">
            Call <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  )
 }
