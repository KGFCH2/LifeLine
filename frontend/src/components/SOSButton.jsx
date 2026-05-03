import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Mic, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SOSButton() {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [listening, setListening] = useState(false)

  const goEmergency = () => {
    setShowMenu(false)
    navigate('/emergency')
  }

  const voiceTrigger = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported on this browser.')
      return
    }
    setListening(true)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase()
      if (transcript.includes('help') || transcript.includes('emergency') || transcript.includes('sos') || transcript.includes('bachao')) {
        goEmergency()
      } else {
        alert(`Heard: "${transcript}". Say "help" or "emergency" to trigger SOS.`)
      }
      setListening(false)
    }

    recognition.onerror = () => {
      setListening(false)
    }

    recognition.onend = () => setListening(false)
    recognition.start()
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowMenu(!showMenu)}
        className="fixed bottom-6 right-6 z-[40] w-16 h-16 sm:w-20 sm:h-20 bg-[#C8102E] text-white rounded-full shadow-[0_10px_40px_rgba(200,16,46,0.6)] flex items-center justify-center border-4 border-white transition-colors overflow-hidden group"
        aria-label="SOS Emergency"
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-white rounded-full"
        />
        {showMenu ? <X size={32} className="relative z-10" /> : <AlertTriangle size={32} className="relative z-10" />}
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="fixed bottom-24 sm:bottom-32 right-6 z-[40] flex flex-col gap-3 items-end"
          >
            <button
              onClick={goEmergency}
              className="bg-[#C8102E] text-white px-8 py-4 rounded-2xl shadow-2xl font-bold text-base hover:bg-[#a50d26] transition-all active:scale-95 whitespace-nowrap border border-white/20"
            >
              Emergency Mode
            </button>
            <button
              onClick={voiceTrigger}
              className={`${listening ? 'bg-emerald-600' : 'bg-slate-900'} text-white px-8 py-4 rounded-2xl shadow-2xl font-bold text-base hover:opacity-90 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap border border-white/10`}
            >
              <Mic size={20} />
              {listening ? 'Listening...' : 'Voice SOS'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
