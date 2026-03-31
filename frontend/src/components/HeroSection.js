import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const VIDEO_URL = 'https://customer-assets.emergentagent.com/job_c5d8a91a-ec18-4f3a-9ccd-e978a3b6b881/artifacts/xlkvujb9_215018.mp4';

const HeroSection = () => {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      data-testid="hero-section"
      style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}
    >
      {/* Video */}
      <video ref={videoRef} autoPlay muted loop playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.62)', zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.5) 100%)', zIndex: 2 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30vh', background: 'linear-gradient(to top, #000, transparent)', zIndex: 3 }} />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity, position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 20px', width: '100%' }}
      >
        {/* MJ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            data-testid="hero-brand"
            style={{
              fontFamily: "'Arima Madurai', serif",
              fontWeight: 900,
              fontSize: 'clamp(120px, 22vw, 240px)',
              lineHeight: 0.82,
              letterSpacing: '-0.04em',
              margin: 0,
              background: 'linear-gradient(135deg, #FFFFFF 30%, #FF9D00 70%, #FFD700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 60px rgba(255,157,0,0.35))',
            }}
          >
            MJ
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          style={{ marginTop: '20px' }}
        >
          <h2
            data-testid="hero-subtitle"
            style={{
              fontFamily: "'Arima Madurai', serif",
              fontWeight: 700,
              fontSize: 'clamp(22px, 4.5vw, 48px)',
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            விண்வெளி அனுபவம்
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.2em', marginTop: '6px' }}>
            EXPERIENCE THE UNIVERSE
          </p>
        </motion.div>

        {/* Tagline pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          style={{ marginTop: '32px', display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '8px 24px', borderRadius: '40px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
        >
          <span style={{ color: '#FF9D00', fontSize: '12px', fontFamily: "'Noto Sans Tamil',sans-serif", fontWeight: 600 }}>கடந்தது</span>
          <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>நிகழ்காலம்</span>
          <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
          <span style={{ color: '#FFD700', fontSize: '12px', fontFamily: "'Noto Sans Tamil',sans-serif", fontWeight: 600 }}>எதிர்காலம்</span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}
        >
          <button
            data-testid="hero-explore-btn"
            onClick={() => document.querySelector('#space')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '14px 36px', borderRadius: '50px', background: 'linear-gradient(135deg,#FF9D00,#FFD700)', color: '#000', fontWeight: 700, fontSize: '14px', fontFamily: "'Noto Sans Tamil',sans-serif", border: 'none', cursor: 'pointer', boxShadow: '0 0 30px rgba(255,157,0,0.35)', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 0 50px rgba(255,157,0,0.5)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(255,157,0,0.35)'; }}
          >
            ஆராயுங்கள்
          </button>
          <button
            data-testid="hero-astrology-btn"
            onClick={() => document.querySelector('#astrology')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '14px 36px', borderRadius: '50px', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontFamily: "'Noto Sans Tamil',sans-serif", border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(10px)' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,157,0,0.5)'; e.currentTarget.style.color = '#FF9D00'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          >
            ஜோதிடம்
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => document.querySelector('#space')?.scrollIntoView({ behavior: 'smooth' })}
        data-testid="hero-scroll-btn"
        style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', zIndex: 10 }}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
      >
        <ChevronDown size={28} />
      </motion.button>
    </section>
  );
};

export default HeroSection;
