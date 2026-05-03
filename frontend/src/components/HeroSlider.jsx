import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Ambulance, Stethoscope, ArrowRight, Crosshair, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '../hooks/useGeolocation.js';

const slides = [
  {
    image: '/images/ambulance_hero.png',
    title: 'Emergency Response in Seconds',
    subtitle: 'Connecting You to Life-Saving Services Instantly'
  },
  {
    image: '/images/hospital_hero.png',
    title: 'Top Tier Hospitals',
    subtitle: 'Immediate Access to the Best Medical Facilities'
  },
  {
    image: '/images/emergency_hero.png',
    title: 'Critical Care On Demand',
    subtitle: 'Paramedics Dispatched at the Push of a Button'
  },
  {
    image: '/images/rescue_hero.png',
    title: 'Rapid Rescue Operations',
    subtitle: 'Aerial and Ground Support For Unprecedented Speed'
  },
  {
    image: '/images/medical_hero.png',
    title: 'Expert Medical Assistance',
    subtitle: 'Professional Doctors Ready to Save Lives'
  }
];

export default function HeroSlider({ onEmergency, onDoctors }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { location: geoLocation, loading: geoLoading, accuracy, accuracyColor, refreshLocation } = useGeolocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000); // 4 seconds interval
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Background Slider */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence initial={false}>
          <motion.img
            key={currentIndex}
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/90 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 lg:py-0">
        <div className="order-2 lg:order-1 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-full px-4 py-1.5 mb-10 mt-4">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs font-semibold text-white">
              India Emergency Response Network
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-extrabold text-white leading-[1.05] mb-5">
                <span className="block text-4xl sm:text-5xl lg:text-6xl font-cambria">{slides[currentIndex].title}</span>
              </h1>
              <p className="text-gray-200 text-lg sm:text-xl max-w-lg mb-8 leading-relaxed font-comic">
                {slides[currentIndex].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10 w-full sm:w-auto">
            <button
              onClick={onEmergency}
              className="flex items-center justify-center gap-2.5 bg-[#C8102E] hover:bg-[#a50d26] text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-[#C8102E]/20 transition-all duration-200 text-base"
            >
              <Ambulance size={20} />
              Book Emergency
              <ArrowRight size={16} className="opacity-80" />
            </button>
            <button
              onClick={onDoctors}
              className="flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold px-8 py-4 rounded-xl border border-white/30 shadow-sm transition-all duration-200 text-base"
            >
              <Stethoscope size={18} />
              Find Doctors
            </button>
          </div>

          {/* Trust stats */}
          <div className="flex items-center gap-6 pt-4 border-t border-white/20 w-full">
            {[
              { value: '< 5 min', label: 'Response Time' },
              { value: '500+', label: 'Ambulances' },
              { value: '24/7', label: 'Available' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-xl font-extrabold text-white">{s.value}</span>
                <span className="text-xs text-gray-300 font-comic">{s.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>


      {/* Dots */}
      <div className="absolute z-30 bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === idx ? 'w-8 h-2 bg-[#C8102E]' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
