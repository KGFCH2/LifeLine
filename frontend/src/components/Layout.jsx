import { Outlet, useLocation } from 'react-router-dom'
import TopNav from './TopNav.jsx'
import SOSButton from './SOSButton.jsx'
import Footer from './Footer.jsx'
import { useEffect } from 'react'

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  const hideSOS = ['/emergency'].includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 bg-gray-50 transition-colors pt-14">
        <Outlet />
      </main>
      <Footer />
      {!hideSOS && <SOSButton />}
    </div>
  )
}
