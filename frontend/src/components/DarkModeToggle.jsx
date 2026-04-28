import { Sun, Moon } from 'lucide-react'

export default function DarkModeToggle({ dark, toggle }) {
  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 z-50 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-full shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 transition-all hover:scale-105 active:scale-95"
      aria-label="Toggle dark mode"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
