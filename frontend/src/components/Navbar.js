import React, { useState, useEffect } from 'react';
import { Menu, X, Star } from 'lucide-react';

const navLinks = [
  { label: 'முகப்பு', href: '#hero' },
  { label: 'வான்வெளி', href: '#space' },
  { label: 'கோள்கள்', href: '#objects' },
  { label: 'காலவரிசை', href: '#timeline' },
  { label: 'ஜோதிடம்', href: '#astrology' },
  { label: 'கோட்சேரி', href: '#gallery' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      data-testid="navbar"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(3,3,3,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,157,0,0.15)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          data-testid="nav-logo"
          onClick={() => scrollTo('#hero')}
          className="flex items-center gap-2 group"
        >
          <Star size={18} className="text-orange-400" />
          <span
            className="text-2xl font-black gradient-text font-tamil-heading"
            style={{ textShadow: '0 0 20px rgba(255,157,0,0.5)' }}
          >
            MJ
          </span>
          <span className="text-zinc-500 text-xs hidden sm:block font-tamil-body">விண்வெளி அனுபவம்</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <button
              key={l.href}
              data-testid={`nav-${l.href.replace('#', '')}-link`}
              onClick={() => scrollTo(l.href)}
              className="px-3 py-2 text-sm text-zinc-400 hover:text-orange-400 transition-colors font-tamil-body rounded-md hover:bg-white/5"
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          data-testid="nav-mobile-toggle"
          className="md:hidden text-zinc-400 hover:text-orange-400 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          data-testid="nav-mobile-menu"
          className="md:hidden border-t border-white/10 py-2"
          style={{ background: 'rgba(3,3,3,0.97)', backdropFilter: 'blur(20px)' }}
        >
          {navLinks.map(l => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="block w-full text-left px-6 py-3 text-zinc-300 hover:text-orange-400 hover:bg-white/5 transition-colors font-tamil-body"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
