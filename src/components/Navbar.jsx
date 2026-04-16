import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-navy/95 backdrop-blur-lg border-b border-white/5 shadow-xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex items-center gap-1">
            <span className="w-2 h-6 bg-gold-brand rounded-sm" />
            <span className="w-1.5 h-4 bg-green-brand rounded-sm" />
            <span className="w-1 h-2.5 bg-blue-400 rounded-sm" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">
            Pacific <span className="text-gold-brand">Vertex</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-gold-brand' : 'text-white/70 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="ml-2 px-5 py-2 rounded-lg bg-gold-brand text-navy text-sm font-semibold hover:bg-gold-light transition-colors duration-200"
          >
            Partner With Us
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white/80 hover:text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-mid border-t border-white/8 overflow-hidden"
          >
            <nav className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `text-sm font-medium py-2 ${isActive ? 'text-gold-brand' : 'text-white/70'}`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <Link to="/contact" className="mt-2 px-5 py-2.5 rounded-lg bg-gold-brand text-navy text-sm font-semibold text-center">
                Partner With Us
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}