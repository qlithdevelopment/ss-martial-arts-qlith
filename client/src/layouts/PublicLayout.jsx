import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import WelcomeScreen from '../components/WelcomeScreen'
import Footer from '../components/public/home/Footer'
import Navbar from '../components/Navbar'
import WhatsAppButton from '../components/WhatsAppButton'

const PublicLayout = () => {
  const [showWelcome, setShowWelcome] = useState(false)
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  useEffect(() => {
    const SHOW_AFTER_MINUTES = 7

    if (SHOW_AFTER_MINUTES === 0) return

    const startWelcome = () => {
      setShowWelcome(true)
      // Cleaned up timer to 2500ms so the screen opens swiftly
      // without leaving users stranded on an empty black page.
      const timer = setTimeout(() => setShowWelcome(false), 2500)
      return () => clearTimeout(timer)
    }

    if (SHOW_AFTER_MINUTES === -1) {
      return startWelcome()
    }

    const lastShown = localStorage.getItem('welcome_last_shown')
    const now = Date.now()
    const SHOW_AFTER = SHOW_AFTER_MINUTES * 60 * 1000

    if (!lastShown || now - Number(lastShown) > SHOW_AFTER) {
      localStorage.setItem('welcome_last_shown', String(now))
      return startWelcome()
    }
  }, [])

  return (
    <>
      {/* FIXED: AnimatePresence must live here, wrapping the conditional block */}
      <AnimatePresence>{showWelcome && <WelcomeScreen />}</AnimatePresence>

      <div className="min-h-screen bg-black flex flex-col">
        {!isLoginPage && <Navbar />}
        <div className="flex-grow">
          <Outlet />
        </div>
        {!isLoginPage && <Footer />}
        {!isLoginPage && <WhatsAppButton />}
      </div>
    </>
  )
}

export default PublicLayout
