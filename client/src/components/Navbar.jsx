import {
  useState,
  useEffect,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { Menu, X } from "lucide-react";

import Logo from "../assets/Full_Logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] =
    useState(false);

  const [showNavbar, setShowNavbar] =
    useState(true);

  const [lastScrollY, setLastScrollY] =
    useState(0);

  const location = useLocation();

  // NAV LINKS
  const navLinks = [
    {
      name: "Home",
      path: "/",
    },

    {
      name: "About",
      path: "/about",
    },

    {
      name: "Login",
      path: "/login",
    },
  ];

  // SCROLL NAVBAR EFFECT
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) {
        // SCROLL DOWN
        setShowNavbar(false);
      } else {
        // SCROLL UP
        setShowNavbar(true);
      }

      setLastScrollY(window.scrollY);
    };

    window.addEventListener(
      "scroll",
      controlNavbar
    );

    return () => {
      window.removeEventListener(
        "scroll",
        controlNavbar
      );
    };
  }, [lastScrollY]);

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{
        y: showNavbar ? 0 : -120,
      }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
      className="
        fixed
        top-0
        left-0
        w-full
        z-[999]

        bg-black/80

        backdrop-blur-xl

        border-b
        border-white/10
      "
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-2">
        <div className="flex items-center justify-between h-20">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-4"
          >
            <img
              src={Logo}
              alt="Logo"
              className="w-54 object-contain"
            />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((item) => {
              const isActive =
                location.pathname ===
                item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    relative

                    font-medium

                    tracking-wide

                    transition-all
                    duration-300

                    group

                    ${
                      isActive
                        ? "text-cyan-400"
                        : "text-white hover:text-cyan-400"
                    }
                  `}
                >
                  {item.name}

                  {/* ACTIVE LINE */}
                  <span
                    className={`
                      absolute
                      left-0
                      -bottom-2

                      h-[2px]

                      bg-gradient-to-r
                      from-cyan-400
                      to-orange-400

                      transition-all
                      duration-300

                      ${
                        isActive
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }
                    `}
                  />
                </Link>
              );
            })}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() =>
              setIsOpen(!isOpen)
            }
            className="
              md:hidden

              text-white

              z-[1001]
            "
          >
            {isOpen ? (
              <X size={30} />
            ) : (
              <Menu size={30} />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              md:hidden

              absolute
              top-20
              left-0

              w-full

              bg-black/95

              backdrop-blur-2xl

              border-b
              border-white/10

              overflow-hidden
            "
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map(
                (item, index) => {
                  const isActive =
                    location.pathname ===
                    item.path;

                  return (
                    <motion.div
                      key={item.name}
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.1,
                      }}
                    >
                      <Link
                        to={item.path}
                        onClick={() =>
                          setIsOpen(false)
                        }
                        className={`
                          text-lg
                          font-semibold

                          tracking-wide

                          transition-all
                          duration-300

                          block

                          ${
                            isActive
                              ? "text-cyan-400"
                              : "text-white hover:text-cyan-400"
                          }
                        `}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                }
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;