import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
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
    { label: 'Total Requests', value: stats.totalRequests, icon: Ambulance, color: 'text-[#C8102E]', bg: 'bg-red-50' },
    { label: 'Avg Response', value: stats.avgResponseTime, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Ambulances', value: stats.activeAmbulances, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Police Alerts', value: stats.policeAlerts, icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  const activityIcon = (type) => {
    const map = { ambulance: Ambulance, civilian: Shield, police: AlertTriangle, booking: Calendar }
    return map[type] || Activity
  }

  const activityColors = {
    ambulance: { bg: 'bg-red-50', color: 'text-[#C8102E]' },
    civilian: { bg: 'bg-amber-50', color: 'text-amber-600' },
    police: { bg: 'bg-blue-50', color: 'text-blue-600' },
    booking: { bg: 'bg-emerald-50', color: 'text-emerald-600' },
  }

  const statusColors = {
    active: 'bg-emerald-50 text-emerald-700',
    completed: 'bg-gray-100 text-gray-500',
    confirmed: 'bg-blue-50 text-blue-700',
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Page Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-medium text-[#C8102E] mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>OVERVIEW</p>
            <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-2 mt-1.5">
              {isLive ? (
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live · Updates every 30s
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <WifiOff size={10} />
                  Offline · Showing cached data
                </span>
              )}
              {lastUpdated && (
                <span className="text-[10px] text-gray-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  · {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {statCards.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <Icon size={17} className={s.color} />
                  </div>
                  <span className="text-xs text-gray-400 font-medium leading-tight">{s.label}</span>
                </div>
                {loading ? (
                  <div className="h-7 w-16 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                )}
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => navigate('/emergency')}
            className="bg-[#C8102E] hover:bg-[#a50d26] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all active:scale-95 shadow-md shadow-[#C8102E]/15"
          >
            <Ambulance size={18} />
            Emergency
          </button>
          <button
            onClick={() => navigate('/doctors')}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all active:scale-95 shadow-sm"
          >
            <Users size={18} />
            Find Doctors
          </button>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              Recent Activity
            </h2>
            {isLive && (
              <span className="text-[10px] font-semibold text-[#C8102E] bg-red-50 px-2 py-0.5 rounded-full" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                LIVE
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse mb-2" />
                    <div className="h-2.5 bg-gray-50 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {recentActivity.map(item => {
                const Icon = activityIcon(item.type)
                const aColor = activityColors[item.type] || { bg: 'bg-gray-50', color: 'text-gray-500' }
                return (
                  <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex items-center gap-3 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 ${aColor.bg} rounded-xl flex items-center justify-center shrink-0`}>
                      <Icon size={17} className={aColor.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${statusColors[item.status] || 'bg-gray-100 text-gray-500'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {item.status}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Help banner */}
        <div className="mt-6 bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
            <Phone size={17} className="text-[#C8102E]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">Need help?</p>
            <p className="text-xs text-gray-400">Call 108 for ambulance, 112 for national emergency</p>
          </div>
          <a href="tel:108" className="text-xs font-bold text-[#C8102E] hover:underline flex items-center gap-1">
            Call <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </div>
  )
}
