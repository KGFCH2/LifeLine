import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import Loader from './components/Loader.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Emergency from './pages/Emergency.jsx'
import Doctors from './pages/Doctors.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import FAQs from './pages/FAQs.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import Documentation from './pages/Documentation.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  const { initAuth } = useAuth()
  const [initialLoading, setInitialLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const authCleanup = initAuth()
    
    // Simulate initial loading for 2 seconds, then fade out
    const timer = setTimeout(() => {
      setFadeOut(true)
      // Wait for fade out animation, then show content with fade in
      setTimeout(() => {
        setInitialLoading(false)
        setShowContent(true)
      }, 500)
    }, 2000)

    return () => {
      authCleanup()
      clearTimeout(timer)
    }
  }, [initAuth])

  if (initialLoading) {
    return (
      <div className={`transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        <Loader fullScreen text="Initializing LifeLine+ Emergency Services..." />
      </div>
    )
  }

  return (
    <div className={`transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/privacy-security" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
