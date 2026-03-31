import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const STATS = [
  { num: 50, suffix: '+', label: 'திட்டங்கள்', sub: 'Missions' },
  { num: 16, suffix: '', label: 'கோள்கள்', sub: 'Objects' },
  { num: 25, suffix: '', label: 'நிகழ்வுகள்', sub: 'Events' },
  { num: 27, suffix: '', label: 'நட்சத்திரங்கள்', sub: 'Nakshatras' },
];

const Counter = ({ num, suffix }) => {
  const ref = useRef(null);
  const [count, setCount] = React.useState(0);
  const [started, setStarted] = React.useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let c = 0;
    const step = Math.max(1, Math.floor(num / 40));
    const t = setInterval(() => {
      c = Math.min(c + step, num);
      setCount(c);
      if (c >= num) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [started, num]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const FeatureShowcase = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const textX = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);

  return (
    <section
      ref={sectionRef}
      data-testid="feature-showcase"
      style={{ position: 'relative', minHeight: '100vh', display: 'grid', gridTemplateColumns: '45% 55%', overflow: 'hidden', zIndex: 1 }}
    >
      {/* Left: Text */}
      <motion.div style={{ x: textX, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 60px 80px 80px', position: 'relative', zIndex: 2 }}>
        <p className="label-upper" style={{ marginBottom: '24px' }}>01 — THE UNIVERSE</p>

        <h2 className="text-display" style={{ fontSize: 'clamp(60px, 8vw, 110px)', color: 'white', marginBottom: '0' }}>
          SPACE
        </h2>
        <h2 className="text-display" style={{ fontSize: 'clamp(60px, 8vw, 110px)', marginBottom: '0' }}>
          <span className="gradient-gold">BEGINS</span>
        </h2>
        <h2 className="text-display" style={{ fontSize: 'clamp(60px, 8vw, 110px)', color: 'rgba(255,255,255,0.2)', marginBottom: '40px' }}>
          HERE
        </h2>

        <div className="neon-line" style={{ marginBottom: '40px' }} />

        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.7, fontFamily: "'Noto Sans Tamil',sans-serif", maxWidth: '340px', marginBottom: '48px' }}>
          கடந்த காலம் முதல் எதிர்காலம் வரை விண்வெளியின் முழுமையான பயணத்தை அனுபவியுங்கள்.
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '340px' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ borderTop: '1px solid rgba(255,157,0,0.2)', paddingTop: '16px' }}>
              <p style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 900, fontSize: '44px', lineHeight: 1, color: 'white' }}>
                <Counter num={s.num} suffix={s.suffix} />
              </p>
              <p style={{ color: '#FF9D00', fontSize: '13px', fontFamily: "'Noto Sans Tamil',sans-serif", marginTop: '4px' }}>{s.label}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontFamily: 'sans-serif' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right: Image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <motion.img
          style={{ y: imgY, width: '100%', height: '120%', objectFit: 'cover', objectPosition: 'center', marginTop: '-10%' }}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg/600px-Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg"
          alt="Pillars of Creation"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #000 0%, transparent 40%)' }} />
        <div style={{ position: 'absolute', bottom: '60px', right: '40px' }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', fontFamily: 'sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            NASA / HST — Pillars of Creation
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
