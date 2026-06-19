import { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'
import { ReactLenis } from 'lenis/react'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToTop from './components/ScrollToTop'
import ScrollToTopButton from './components/common/ScrollToTop'
import Navbar from './components/Navbar'

import { useLocation } from 'react-router-dom'

function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [location.pathname])

  if (isAdmin) {
    return (
      <>
        <ScrollToTop />
        <ScrollToTopButton />
        <AppRoutes />
      </>
    )
  }

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <ScrollToTop />
      <ScrollToTopButton />
      <AppRoutes />
      <WhatsAppButton />
    </ReactLenis>
  )
}

export default App
