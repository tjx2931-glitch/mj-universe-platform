import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const links = [
  { label: 'முகப்பு', href: '#hero' },
  { label: 'வான்வெளி', href: '#space' },
  { label: 'கோள்கள்', href: '#objects' },
  { label: 'காலவரிசை', href: '#timeline' },
  { label: 'ஜோதிடம்', href: '#astrology' },
  { label: 'கோட்சேரி', href: '#gallery' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = href => {
    setOpen(false);
    if (href.startsWith('#')) {
      if (window.location.pathname !== '/') { navigate('/'); setTimeout(() => scrollTo(href), 200); }
      else scrollTo(href);
    }
  };

  const scrollTo = href => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      data-testid="navbar"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '12px 48px' : '20px 48px',
        background: scrolled ? 'rgba(0,0,0,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Logo */}
      <button data-testid="nav-logo" onClick={() => go('#hero')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 900, fontSize: '24px', background: 'linear-gradient(135deg,#FF9D00,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MJ</span>
        <span style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.15)' }} />
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '0.2em', fontFamily: "'Noto Sans Tamil',sans-serif', 'sans-serif'" }}>விண்வெளி</span>
      </button>

      {/* Desktop nav */}
      <div style={{ display: 'flex', gap: '32px' }} className="hidden md:flex">
        {links.map(l => (
          <button key={l.href} data-testid={`nav-${l.href.replace('#', '')}-link`}
            onClick={() => go(l.href)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: '12px', letterSpacing: '0.08em', fontFamily: "'Noto Sans Tamil',sans-serif", padding: '4px 0', transition: 'color 0.2s', borderBottom: '1px solid transparent' }}
            onMouseOver={e => { e.currentTarget.style.color = '#FF9D00'; e.currentTarget.style.borderBottomColor = 'rgba(255,157,0,0.3)'; }}
            onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderBottomColor = 'transparent'; }}>
            {l.label}
          </button>
        ))}
      </div>

      {/* Mobile toggle */}
      <button data-testid="nav-mobile-toggle"
        onClick={() => setOpen(!open)}
        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', flexDirection: 'column', gap: '5px', padding: '4px' }}
        className="flex md:hidden flex-col">
        <span style={{ width: '22px', height: '1px', background: 'currentColor', display: 'block' }} />
        <span style={{ width: '14px', height: '1px', background: 'currentColor', display: 'block' }} />
        <span style={{ width: '22px', height: '1px', background: 'currentColor', display: 'block' }} />
      </button>

      {/* Mobile menu */}
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 48px' }}>
          {links.map(l => (
            <button key={l.href} onClick={() => go(l.href)}
              style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '14px', padding: '12px 0', fontFamily: "'Noto Sans Tamil',sans-serif", borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
