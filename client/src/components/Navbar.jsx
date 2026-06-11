import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from '../assets/Full_Logo.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const location = useLocation()
  const navigate = useNavigate()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Trainers', path: '/trainers' },
    { name: 'Events', path: '/events' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
    { name: 'Login', path: '/login' },
  ]

  // SCROLL NAVBAR EFFECT & INTERSECTION OBSERVER
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Intersection Observer to detect active section
    if (location.pathname === '/') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id || 'hero');
            }
          });
        },
        { rootMargin: '-30% 0px -70% 0px' } // Triggers when section is near the top
      );

      const sectionIds = ['hero', 'about', 'trainers', 'programs', 'events', 'services', 'gallery', 'testimonials', 'faq'];
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });

      return () => {
        window.removeEventListener('scroll', handleScroll)
        observer.disconnect();
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [location.pathname])

  const handleNavClick = (e, path) => {
    setIsOpen(false)
    if (path.startsWith('/#')) {
      const targetId = path.split('#')[1]
      if (location.pathname === '/') {
        // If already on Home, smooth scroll to the element
        e.preventDefault()
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
          window.history.pushState(null, '', path)
        }
      }
    } else if (path === '/') {
      if (location.pathname === '/') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        window.history.pushState(null, '', path)
      }
    }
  }

  const checkIsActive = (path) => {
    if (path === '/') return location.pathname === '/' && activeSection === 'hero';
    if (path.startsWith('/#')) return location.pathname === '/' && activeSection === path.split('#')[1];
    return location.pathname === path;
  }

  return (
    <motion.nav
      initial={{ y: -120 }}
      animate={{ y: 0 }}
      transition={{
        duration: 0.4,
        ease: 'easeOut',
      }}
      className={`
        fixed
        top-0
        left-0
        w-full
        z-[999]
        transition-all
        duration-300
        ${isScrolled 
          ? 'bg-[rgba(0,0,0,0.7)] py-0 shadow-sm border-b border-white/10' 
          : 'bg-[rgba(0,0,0,0.3)] py-1'}
      `}
    >
      <div className="global-container">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-12' : 'h-16'}`}>
          {/* LOGO */}
          <Link to="/" onClick={(e) => handleNavClick(e, '/')} className="flex items-center h-full">
            <img src={Logo} alt="Logo" className={`object-contain transition-all duration-300 ${isScrolled ? 'w-28' : 'w-36 md:w-40'}`} />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-10">
            {navLinks.map((item) => {
              const isActive = checkIsActive(item.path)

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className={`
                    relative
                    text-[10px] xl:text-[12px]
                    font-bold
                    tracking-widest
                    transition-all
                    duration-300
                    group
                    ${isActive ? 'text-primary' : 'text-white hover:text-primary'}
                  `}
                >
                  {item.name.toUpperCase()}

                  {/* ACTIVE LINE */}
                  <span
                    className={`
                      absolute
                      left-0
                      -bottom-2
                      h-[2px]
                      w-full
                      bg-amber-500
                      transition-all
                      duration-300
                      ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}
                    `}
                  />
                </Link>
              )
            })}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white z-[1001]"
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      {/* AESTHETIC DROPDOWN MOBILE & TABLET MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="
              lg:hidden
              absolute
              top-[110%]
              right-4
              w-[calc(100vw-32px)]
              md:w-[350px]
              bg-[#0b1b24]/80
              backdrop-blur-2xl
              border
              border-white/10
              rounded-2xl
              shadow-[0_20px_40px_rgba(0,0,0,0.5)]
              overflow-hidden
              z-[990]
            "
          >
            {/* Subtle top highlight */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#26c0ff]/50 to-transparent" />

            <div className="flex flex-col p-2">
              {navLinks.map((item, index) => {
                const isActive = checkIsActive(item.path)

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={(e) => handleNavClick(e, item.path)}
                    className={`
                        relative
                        flex
                        items-center
                        px-6
                        py-4
                        text-sm
                        md:text-base
                        font-bold
                        uppercase
                        tracking-widest
                        transition-all
                        duration-300
                        rounded-xl
                        group
                        overflow-hidden
                        ${isActive ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}
                      `}
                  >
                    {/* Active/Hover Indicator Line */}
                    <span 
                      className={`
                        absolute 
                        left-0 
                        top-1/4 
                        bottom-1/4 
                        w-1 
                        bg-[#26c0ff] 
                        rounded-r-full 
                        transition-transform 
                        duration-300
                        ${isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}
                      `}
                    />
                    <span className="relative z-10 pl-2">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
