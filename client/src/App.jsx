import { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'
import { ReactLenis } from 'lenis/react'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'

function App() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  return (
    // <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
    <>
      <ScrollToTop />
      <AppRoutes />
    </>
    // </ReactLenis>
  )
}

export default App
