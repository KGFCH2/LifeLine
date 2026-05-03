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
    if (!saved || saved === 'undefined') return null;
    try { return JSON.parse(saved); } catch { return null; }
  });
  const [nearestHospital, setNearestHospital] = useState(() => {
    const saved = localStorage.getItem('ll_hospital');
    if (!saved || saved === 'undefined') return null;
    try { return JSON.parse(saved); } catch { return null; }
  });
  const [activeRoute, setActiveRoute] = useState(() => {
    const saved = localStorage.getItem('ll_route');
    if (!saved || saved === 'undefined') return null;
    try { return JSON.parse(saved); } catch { return null; }
  });
  const [demoAmbulancePos, setDemoAmbulancePos] = useState(() => {
    const saved = localStorage.getItem('ll_pos');
    if (!saved || saved === 'undefined') return null;
    try { return JSON.parse(saved); } catch { return null; }
  });
  const [demoPath, setDemoPath] = useState(() => {
    const saved = localStorage.getItem('ll_path');
    if (!saved || saved === 'undefined') return [];
    try { return JSON.parse(saved); } catch { return []; }
  });
  const [demoProgress, setDemoProgress] = useState(() => Number(localStorage.getItem('ll_progress')) || 0);
  const [demoCountdown, setDemoCountdown] = useState(() => Number(localStorage.getItem('ll_countdown')) || 120);
  const [demoMode, setDemoMode] = useState(() => localStorage.getItem('ll_demo_mode') === 'true');
  const [selectedHospitalIdx, setSelectedHospitalIdx] = useState(-1);
  const [showArrivalNotification, setShowArrivalNotification] = useState(false);
  const [arrivalType, setArrivalType] = useState('user'); // 'user' or 'hospital'
  const [stepCounter, setStepCounter] = useState(() => Number(localStorage.getItem('ll_step')) || 0);
  const [showCancelNotification, setShowCancelNotification] = useState(false);
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('ll_chat');
    if (!saved || saved === 'undefined') return [{ role: 'ai', text: 'How can I assist with your medical emergency today?' }];
    try { return JSON.parse(saved); } catch { return [{ role: 'ai', text: 'How can I assist with your medical emergency today?' }]; }
  });
  
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
    localStorage.setItem('ll_chat', JSON.stringify(chatMessages));
  }, [phase, activeAmbulance, nearestHospital, activeRoute, demoAmbulancePos, demoPath, demoProgress, demoCountdown, demoMode, stepCounter, chatMessages]);

  // Global background simulation loop
  useEffect(() => {
    if (demoMode && demoPath.length > 0) {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
      
      demoIntervalRef.current = setInterval(() => {
        let currentStep = 0;
        setStepCounter(prev => {
          currentStep = prev + 1;
          return currentStep;
        });

        if (currentStep >= demoPath.length) {
          clearInterval(demoIntervalRef.current);
          handleArrival();
          return;
        }

        const pos = demoPath[currentStep];
        setDemoAmbulancePos(pos);
        setDemoProgress(currentStep / (demoPath.length - 1));
        
        if (['searching', 'tracking', 'trip_active'].includes(phase)) {
          setDemoCountdown(demoPath.length - 1 - currentStep);
        }
      }, 1000);
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
      
      // Log activity
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        logActivity(u.id || u.uid, 'ambulance', `Emergency trip to ${nearestHospital?.name || 'Hospital'} completed`, 'completed');
      }
    }
    setStepCounter(0);
  };

  const startLeg1Animation = (path) => {
    setDemoPath(path);
    setDemoAmbulancePos(path[0]);
    setDemoProgress(0);
    setDemoCountdown(path.length - 1);
    setStepCounter(0);
    setDemoMode(true);
    setPhase('searching');
  };

  const startLeg2Animation = (path) => {
    setDemoPath(path);
    setDemoAmbulancePos(path[0]);
    setDemoProgress(0);
    setDemoCountdown(path.length - 1);
    setStepCounter(0);
    setDemoMode(true);
    setPhase('trip_active');
  };

  const isEmergencyActive = ['searching', 'tracking', 'arrived', 'trip_active', 'civilian_active', 'completed'].includes(phase);

  const resetEmergency = (isUserCancel = false) => {
    if (isUserCancel && ['searching', 'trip_active', 'arrived'].includes(phase)) {
      setShowCancelNotification(true);
      setTimeout(() => setShowCancelNotification(false), 5000);
    }

    if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    setPhase('init');
    setActiveAmbulance(null);
    setNearestHospital(null);
    setActiveRoute(null);
    setDemoAmbulancePos(null);
    setDemoPath([]);
    setDemoProgress(0);
    setDemoCountdown(120);
    setDemoMode(false);
    setStepCounter(0);
    setSelectedHospitalIdx(-1);
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
    localStorage.removeItem('ll_chat');
  };

  const value = {
    phase, setPhase,
    activeAmbulance, setActiveAmbulance,
    nearestHospital, setNearestHospital,
    activeRoute, setActiveRoute,
    demoAmbulancePos, setDemoAmbulancePos,
    demoPath: demoPath.slice(stepCounter), setDemoPath,
    demoProgress, setDemoProgress,
    demoCountdown, setDemoCountdown,
    demoMode, setDemoMode,
    selectedHospitalIdx, setSelectedHospitalIdx,
    chatMessages, setChatMessages,
    showArrivalNotification, setShowArrivalNotification,
    arrivalType, setArrivalType,
    resetEmergency,
    isEmergencyActive,
    startLeg1Animation,
    startLeg2Animation,
    showCancelNotification, setShowCancelNotification,
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
