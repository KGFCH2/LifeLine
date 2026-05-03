import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Ambulance, Clock, Navigation, ArrowRight, X } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function GlobalTrackingBar() {
  const { phase, demoCountdown, demoProgress, activeAmbulance, nearestHospital, resetEmergency } = useEmergency();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  const isActive = ['searching', 'arrived', 'trip_active'].includes(phase);
  
  if (!isActive) return null;

  const getStatusText = () => {
    if (phase === 'searching') return 'Ambulance is on the way';
    if (phase === 'arrived') return 'Ambulance arrived at your location';
    if (phase === 'trip_active') return `Heading to ${nearestHospital?.name || 'Hospital'}`;
    return '';
  };

  const getEtaText = () => {
    if (phase === 'arrived') return 'ARRIVED';
    const mins = Math.floor(demoCountdown / 60);
    const secs = String(demoCountdown % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Hide on Emergency page to avoid double UI
  if (location.pathname === '/emergency') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-4 right-4 z-[100] max-w-lg mx-auto"
      >
        <div 
          onClick={() => navigate('/emergency')}
          className={`group cursor-pointer relative overflow-hidden p-4 rounded-[2rem] border backdrop-blur-xl shadow-2xl transition-all active:scale-[0.98] ${
            isDark 
              ? 'bg-slate-900/80 border-[#C8102E]/30 shadow-[#C8102E]/10' 
              : 'bg-white/90 border-[#C8102E]/20 shadow-xl'
          }`}
        >
          {/* Edge Glow */}
          <div className="absolute inset-0 rounded-[2rem] border border-[#C8102E]/20 pointer-events-none group-hover:border-[#C8102E]/40 transition-colors" />
          
          <div className="flex items-center gap-4">
            {/* Animated Icon Container */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${
              isDark ? 'bg-[#C8102E]/20 text-[#C8102E]' : 'bg-red-50 text-[#C8102E]'
            }`}>
              <Ambulance size={24} className={phase === 'trip_active' || phase === 'searching' ? 'animate-pulse' : 'transition-transform group-hover:scale-110'} />
            </div>

            {/* Info Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-red-400' : 'text-[#C8102E]'}`}>
                  {phase === 'searching' ? 'Dispatch Tracking' : 'Trip In Progress'}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    isDark ? 'bg-slate-800 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  }`}>
                    <Clock size={10} className="inline mr-1 mb-0.5" /> {getEtaText()}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); if(confirm('Cancel this ambulance request?')) resetEmergency(true); }}
                    className="p-1 hover:bg-red-500/10 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                    title="Cancel Ambulance"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <h3 className={`text-sm font-black truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {getStatusText()}
              </h3>
              
              {/* Progress Bar */}
              <div className="mt-2.5 w-full h-1.5 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-800/50">
                <motion.div 
                  className="h-full bg-[#C8102E] shadow-[0_0_10px_rgba(200,16,46,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(phase === 'searching' ? (1 - demoCountdown/demoPath.length) : (demoProgress || 0)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Action Arrow */}
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-hover:bg-[#C8102E] group-hover:text-white ${
              isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-400'
            }`}>
              <Navigation size={18} />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
