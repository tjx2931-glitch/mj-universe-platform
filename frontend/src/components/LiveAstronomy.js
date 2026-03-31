import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const BASE = process.env.REACT_APP_BACKEND_URL;

const MoonSVG = ({ illumination, phaseName }) => {
  const r = 44;
  const cx = 50, cy = 50;
  // Create crescent/gibbous effect
  const lit = illumination / 100;
  const phase = lit <= 0.5 ? lit * 2 : 2 - lit * 2;
  const rx = Math.abs(r * (1 - phase));
  const isWaxing = illumination <= 50;

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <defs>
        <clipPath id="moonClip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      {/* Dark moon base */}
      <circle cx={cx} cy={cy} r={r} fill="#111118" stroke="rgba(255,215,0,0.2)" strokeWidth="1" />
      {/* Lit portion */}
      {illumination > 2 && illumination < 98 ? (
        <ellipse
          cx={cx + (isWaxing ? rx / 2 : -rx / 2)}
          cy={cy} rx={Math.max(rx, 2)} ry={r}
          fill="rgba(255,230,130,0.85)"
          clipPath="url(#moonClip)"
        />
      ) : illumination >= 98 ? (
        <circle cx={cx} cy={cy} r={r} fill="rgba(255,230,130,0.85)" />
      ) : null}
      {/* Glow */}
      <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={illumination > 50 ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.08)'} strokeWidth="3" />
    </svg>
  );
};

const useInView = () => {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
};

const LiveAstronomy = () => {
  const [data, setData] = useState(null);
  const [ref, visible] = useInView();

  useEffect(() => {
    fetch(`${BASE}/api/live-astronomy`).then(r => r.json()).then(setData).catch(() => {});
  }, []);

  return (
    <section
      ref={ref}
      data-testid="live-astronomy-section"
      style={{ position: 'relative', zIndex: 1, padding: '120px 80px', background: 'rgba(0,0,0,0.6)' }}
    >
      {/* BG decoration */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 50%, rgba(255,157,0,0.04), transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px', flexWrap: 'wrap', gap: '20px' }}
          initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <div>
            <p className="label-upper" style={{ marginBottom: '12px' }}>02 — நேரடி ஆய்வு</p>
            <h2 className="text-editorial" style={{ fontSize: 'clamp(48px, 7vw, 90px)', color: 'white' }}>
              LIVE<br /><span className="gradient-gold">COSMOS</span>
            </h2>
          </div>
          {data && (
            <div style={{ maxWidth: '320px' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontFamily: "'Noto Sans Tamil',sans-serif", lineHeight: 1.7, textAlign: 'right' }}>
                {data.space_fact?.tamil}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', fontFamily: 'sans-serif', textAlign: 'right', marginTop: '4px' }}>{data.space_fact?.english}</p>
            </div>
          )}
        </motion.div>

        {/* Data panels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2px' }}>
          {/* Lunar Phase */}
          <motion.div
            data-testid="lunar-phase-panel"
            initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '40px 32px' }}
          >
            <p className="label-upper" style={{ marginBottom: '24px' }}>நிலவு நிலை</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {data && <MoonSVG illumination={data.lunar.illumination} phaseName={data.lunar.phase_name} />}
              <div>
                <p style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 900, fontSize: '28px', color: 'white' }}>{data?.lunar?.phase_name || '...'}</p>
                <p style={{ color: 'rgba(255,215,0,0.7)', fontSize: '13px', fontFamily: "'Noto Sans Tamil',sans-serif", marginTop: '4px' }}>
                  {data?.lunar?.illumination || 0}% ஒளிர்வு
                </p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: 'sans-serif', marginTop: '2px' }}>
                  {data?.lunar?.phase_days || 0} days into cycle
                </p>
              </div>
            </div>
          </motion.div>

          {/* Upcoming events */}
          <motion.div
            data-testid="upcoming-events-panel"
            initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '40px 32px', gridColumn: 'span 2' }}
          >
            <p className="label-upper" style={{ marginBottom: '24px' }}>அடுத்த விண்வெளி நிகழ்வுகள்</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {(data?.upcoming_events || []).map((ev, i) => (
                <motion.div key={ev.id} initial={{ opacity: 0, x: -20 }} animate={visible ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 + i * 0.1 }}
                  style={{ borderLeft: '2px solid rgba(139,92,246,0.5)', paddingLeft: '16px' }}>
                  <p style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 900, fontSize: '32px', color: 'rgba(139,92,246,0.8)', lineHeight: 1 }}>{ev.year}</p>
                  <p style={{ color: 'white', fontSize: '14px', fontWeight: 600, fontFamily: "'Noto Sans Tamil',sans-serif", marginTop: '4px' }}>{ev.title_tamil}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontFamily: 'sans-serif', marginTop: '2px' }}>{ev.category}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveAstronomy;
