import { useState, useRef, useEffect } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export default function FAQAccordion({ item, index, isOpen, onToggle, isDark }) {
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [])

  const IconComponent = item.icon || HelpCircle

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300 group ${
      isOpen 
        ? (isDark ? 'bg-slate-900 border-[#C8102E]/40 shadow-2xl' : 'bg-white border-[#C8102E]/30 shadow-lg shadow-[#C8102E]/5') 
        : (isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-gray-100 hover:shadow-md')
    }`}>
      <button
        onClick={() => onToggle(isOpen ? null : index)}
        className="w-full flex items-center justify-between text-left p-4"
      >
        <div className="flex items-center gap-4">
          <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen 
              ? 'bg-[#C8102E] text-white shadow-lg shadow-red-500/20' 
              : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-gray-100 text-gray-400')
          }`}>
            <IconComponent size={20} />
          </div>
          <span className={`text-sm font-black transition-colors duration-200 ${
            isOpen 
              ? (isDark ? 'text-white' : 'text-gray-900') 
              : (isDark ? 'text-slate-300 group-hover:text-white' : 'text-gray-700 group-hover:text-[#C8102E]')
          }`}>
            {item.q}
          </span>
        </div>
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500/10 text-[#C8102E] rotate-180' 
            : (isDark ? 'bg-slate-800 text-slate-600' : 'bg-gray-50 text-gray-400')
        }`}>
          <ChevronDown size={18} />
        </div>
      </button>
      <div
        className="transition-all duration-300 ease-out overflow-hidden"
        style={{ maxHeight: isOpen ? height : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div ref={contentRef} className="pt-3 pb-1 pl-14">
          <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-comic">{item.a}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
