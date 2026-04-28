import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import LoginModal from '../components/LoginModal.jsx'
import {
  Activity, Ambulance, Calendar, Shield, Clock, MapPin,
  TrendingUp, Users, Phone, ChevronRight, AlertTriangle
} from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

export default function Dashboard() {
  const { user } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeAmbulances: 0,
    avgResponseTime: '0m',
    policeAlerts: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) { setShowLogin(true); return }
    
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch stats from backend
        const statsRes = await fetch(`${BACKEND_URL}/api/dashboard/stats?userId=${user.id}`)
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(prev => ({
            totalRequests: statsData.totalRequests ?? 12,
            activeAmbulances: statsData.activeAmbulances ?? 8,
            avgResponseTime: statsData.avgResponseTime ?? '4m 30s',
            policeAlerts: statsData.policeAlerts ?? 3
          }))
        }
        
        // Fetch recent activity
        const activityRes = await fetch(`${BACKEND_URL}/api/dashboard/activity?userId=${user.id}`)
        if (activityRes.ok) {
          const activityData = await activityRes.json()
          setRecentActivity(activityData.activities || [
            { id: 1, type: 'ambulance', title: 'Ambulance AMB-1002 assigned', time: '2 min ago', status: 'active' },
            { id: 2, type: 'civilian', title: 'Civilian mode activated', time: '15 min ago', status: 'completed' },
            { id: 3, type: 'police', title: 'Police alert sent to City PS', time: '1 hour ago', status: 'completed' },
            { id: 4, type: 'booking', title: 'Dr. Sharma appointment confirmed', time: '3 hours ago', status: 'confirmed' },
          ])
        }
      } catch (err) {
        setError('Failed to load dashboard data')
        // Use fallback data
        setStats({
          totalRequests: 12,
          activeAmbulances: 8,
          avgResponseTime: '4m 30s',
          policeAlerts: 3
        })
        setRecentActivity([
          { id: 1, type: 'ambulance', title: 'Ambulance AMB-1002 assigned', time: '2 min ago', status: 'active' },
          { id: 2, type: 'civilian', title: 'Civilian mode activated', time: '15 min ago', status: 'completed' },
          { id: 3, type: 'police', title: 'Police alert sent to City PS', time: '1 hour ago', status: 'completed' },
          { id: 4, type: 'booking', title: 'Dr. Sharma appointment confirmed', time: '3 hours ago', status: 'confirmed' },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  if (!user) return showLogin ? <LoginModal onClose={() => setShowLogin(false)} /> : null

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-5 pb-8 rounded-b-3xl">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity size={24} /> Dashboard
        </h1>
        <p className="text-red-100 text-sm mt-1">Real-time emergency response overview</p>
      </div>

      <div className="px-4 -mt-6 grid grid-cols-2 gap-3">
        <div className="card bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <Ambulance size={18} className="text-red-600" />
            </div>
            <span className="text-xs text-gray-500">Requests</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRequests}</p>
        </div>
        <div className="card bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp size={18} className="text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Response</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgResponseTime}</p>
        </div>
        <div className="card bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Users size={18} className="text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Active Ambulances</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeAmbulances}</p>
        </div>
        <div className="card bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
              <Shield size={18} className="text-amber-600" />
            </div>
            <span className="text-xs text-gray-500">Police Alerts</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.policeAlerts}</p>
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Clock size={18} className="text-gray-500" /> Recent Activity
        </h2>
        <div className="space-y-2">
          {recentActivity.map(item => (
            <div key={item.id} className="card flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                item.type === 'ambulance' ? 'bg-red-50 text-red-600' :
                item.type === 'civilian' ? 'bg-amber-50 text-amber-600' :
                item.type === 'police' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
              }`}>
                {item.type === 'ambulance' ? <Ambulance size={18} /> :
                 item.type === 'civilian' ? <Shield size={18} /> :
                 item.type === 'police' ? <AlertTriangle size={18} /> : <Calendar size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                item.status === 'active' ? 'bg-green-100 text-green-700' :
                item.status === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'
              }`}>
                {item.status}
              </span>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
