import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const EmergencyContext = createContext();

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) throw new Error('useEmergency must be used within an EmergencyProvider');
  return context;
};

export const EmergencyProvider = ({ children }) => {
  const [phase, setPhase] = useState(() => localStorage.getItem('ll_phase') || 'init');
  const [activeAmbulance, setActiveAmbulance] = useState(() => {
    const saved = localStorage.getItem('ll_ambulance');
    return saved ? JSON.parse(saved) : null;
  });
  const [nearestHospital, setNearestHospital] = useState(() => {
    const saved = localStorage.getItem('ll_hospital');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeRoute, setActiveRoute] = useState(() => {
    const saved = localStorage.getItem('ll_route');
    return saved ? JSON.parse(saved) : null;
  });
  const [demoAmbulancePos, setDemoAmbulancePos] = useState(() => {
    const saved = localStorage.getItem('ll_pos');
    return saved ? JSON.parse(saved) : null;
  });
  const [demoPath, setDemoPath] = useState(() => {
    const saved = localStorage.getItem('ll_path');
    return saved ? JSON.parse(saved) : [];
  });
  const [demoProgress, setDemoProgress] = useState(() => Number(localStorage.getItem('ll_progress')) || 0);
  const [demoCountdown, setDemoCountdown] = useState(() => Number(localStorage.getItem('ll_countdown')) || 60);
  const [demoMode, setDemoMode] = useState(() => localStorage.getItem('ll_demo_mode') === 'true');
  const [showArrivalNotification, setShowArrivalNotification] = useState(false);
  const [arrivalType, setArrivalType] = useState('user'); // 'user' or 'hospital'
  const [stepCounter, setStepCounter] = useState(() => Number(localStorage.getItem('ll_step')) || 0);
  
  const demoIntervalRef = useRef(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('ll_phase', phase);
    localStorage.setItem('ll_ambulance', JSON.stringify(activeAmbulance));
    localStorage.setItem('ll_hospital', JSON.stringify(nearestHospital));
    localStorage.setItem('ll_route', JSON.stringify(activeRoute));
    localStorage.setItem('ll_pos', JSON.stringify(demoAmbulancePos));
    localStorage.setItem('ll_path', JSON.stringify(demoPath));
    localStorage.setItem('ll_progress', demoProgress.toString());
    localStorage.setItem('ll_countdown', demoCountdown.toString());
    localStorage.setItem('ll_demo_mode', demoMode.toString());
    localStorage.setItem('ll_step', stepCounter.toString());
  }, [phase, activeAmbulance, nearestHospital, activeRoute, demoAmbulancePos, demoPath, demoProgress, demoCountdown, demoMode, stepCounter]);

  // Global background simulation loop
  useEffect(() => {
    if (demoMode && demoPath.length > 0) {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
      
      demoIntervalRef.current = setInterval(() => {
        setStepCounter(prev => {
          const next = prev + 1;
          if (next >= demoPath.length) {
            clearInterval(demoIntervalRef.current);
            handleArrival();
            return prev;
          }
          
          const pos = demoPath[next];
          setDemoAmbulancePos(pos);
          setDemoProgress(next / (demoPath.length - 1));
          
          if (phase === 'searching') {
            setDemoCountdown(demoPath.length - 1 - next);
          } else if (phase === 'trip_active') {
            setDemoCountdown(Math.ceil(((demoPath.length - 1 - next) / (demoPath.length - 1)) * 120));
          }
          
          return next;
        });
      }, phase === 'trip_active' ? 800 : 1000);
    } else {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    }

    return () => { if (demoIntervalRef.current) clearInterval(demoIntervalRef.current); };
  }, [demoMode, demoPath.length, phase]);

  const handleArrival = () => {
    if (phase === 'searching') {
      setPhase('arrived');
      setDemoMode(false);
      setArrivalType('user');
      setShowArrivalNotification(true);
      setTimeout(() => setShowArrivalNotification(false), 10000);
    } else if (phase === 'trip_active') {
      setPhase('completed');
      setDemoMode(false);
      setArrivalType('hospital');
      setShowArrivalNotification(true);
      setTimeout(() => setShowArrivalNotification(false), 10000);
    }
    setStepCounter(0);
  };

  const startLeg1Animation = (path) => {
    setDemoPath(path);
    setDemoAmbulancePos(path[0]);
    setDemoProgress(0);
    setDemoCountdown(path.length); // Assuming 1 step per second
    setStepCounter(0);
    setDemoMode(true);
    setPhase('searching');
  };

  const startLeg2Animation = (path) => {
    setDemoPath(path);
    setDemoAmbulancePos(path[0]);
    setDemoProgress(0);
    setDemoCountdown(120);
    setStepCounter(0);
    setDemoMode(true);
    setPhase('trip_active');
  };

  const resetEmergency = () => {
    if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    setPhase('init');
    setActiveAmbulance(null);
    setNearestHospital(null);
    setActiveRoute(null);
    setDemoAmbulancePos(null);
    setDemoPath([]);
    setDemoProgress(0);
    setDemoCountdown(60);
    setDemoMode(false);
    setStepCounter(0);
    setShowArrivalNotification(false);
    
    // Clear localStorage
    localStorage.removeItem('ll_phase');
    localStorage.removeItem('ll_ambulance');
    localStorage.removeItem('ll_hospital');
    localStorage.removeItem('ll_route');
    localStorage.removeItem('ll_pos');
    localStorage.removeItem('ll_path');
    localStorage.removeItem('ll_progress');
    localStorage.removeItem('ll_countdown');
    localStorage.removeItem('ll_demo_mode');
    localStorage.removeItem('ll_step');
  };

  const value = {
    phase, setPhase,
    activeAmbulance, setActiveAmbulance,
    nearestHospital, setNearestHospital,
    activeRoute, setActiveRoute,
    demoAmbulancePos, setDemoAmbulancePos,
    demoPath, setDemoPath,
    demoProgress, setDemoProgress,
    demoCountdown, setDemoCountdown,
    demoMode, setDemoMode,
    showArrivalNotification, setShowArrivalNotification,
    arrivalType, setArrivalType,
    resetEmergency,
    startLeg1Animation,
    startLeg2Animation,
    logActivity: async (userId, type, title, status = 'completed') => {
      if (!userId) return;
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        await fetch(`${BACKEND_URL}/api/dashboard/activity`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, type, title, status })
        });
      } catch (e) {
        console.warn('Failed to log activity:', e);
      }
    }
  };

  return <EmergencyContext.Provider value={value}>{children}</EmergencyContext.Provider>;
};
