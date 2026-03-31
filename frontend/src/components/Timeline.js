import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fetchTimeline } from '../services/api';

const TYPE_COLOR = {
  past: '#FF9D00',
  present: '#10B981',
  future: '#8B5CF6',
};

const TimelineCard = ({ event, idx }) => {
  const color = TYPE_COLOR[event.type] || '#FF9D00';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.02 }}
      data-testid={`timeline-card-${idx}`}
      style={{
        width: '360px', flexShrink: 0, minHeight: '440px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        padding: '28px 26px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Year badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '6px 16px', borderRadius: '20px', background: `${color}15`, border: `1px solid ${color}35`, alignSelf: 'flex-start', flexShrink: 0 }}>
        <span style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 900, fontSize: '22px', color: color, lineHeight: 1 }}>
          {event.year > 0 ? event.year : `${Math.abs(event.year)} கி.மு`}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, marginTop: '16px', overflow: 'hidden' }}>
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif', display: 'block' }}>{event.category}</span>
        <h3 style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 700, fontSize: '19px', color: 'white', marginTop: '8px', lineHeight: 1.3, wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}>{event.title_tamil}</h3>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '4px', fontFamily: 'sans-serif', wordBreak: 'break-word' }}>{event.title_english}</p>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.7, marginTop: '12px', fontFamily: "'Noto Sans Tamil',sans-serif", wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}>
          {event.description_tamil}
        </p>
      </div>

      {/* Bottom color bar */}
      <div style={{ height: '2px', background: `linear-gradient(90deg, ${color}, transparent)`, borderRadius: '1px', marginTop: '16px', flexShrink: 0 }} />

      {/* BG number */}
      <div style={{ position: 'absolute', bottom: '-10px', right: '-8px', fontFamily: "'Arima Madurai',serif", fontWeight: 900, fontSize: '80px', color: `${color}08`, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
        {String(idx + 1).padStart(2, '0')}
      </div>
    </motion.div>
  );
};

const Timeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchTimeline().then(d => { setEvents(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const CARD_W = 360;
  const GAP = 20;
  const PAD = 80;

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  // Calculate horizontal scroll distance
  const totalCards = events.length;
  const totalW = totalCards * (CARD_W + GAP) + PAD * 2;
  const x = useTransform(scrollYProgress, [0, 1], [PAD, -(totalW - PAD * 3)]);
  const progressX = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Container height: more height = more scroll = easier to move through
  const containerH = Math.max(totalCards * 180, 3000);

  return (
    <section id="timeline" data-testid="timeline-section" style={{ position: 'relative', zIndex: 1, background: 'rgba(0,0,0,0.5)' }}>
      <div ref={containerRef} style={{ height: `${containerH}px`, position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          {/* Section Header (stays fixed at top) */}
          <div style={{ position: 'absolute', top: '60px', left: '80px', zIndex: 10 }}>
            <p className="label-upper" style={{ marginBottom: '10px' }}>06 — TIMELINE</p>
            <h2 className="text-editorial" style={{ fontSize: 'clamp(44px, 6vw, 80px)', color: 'white', lineHeight: 0.88 }}>
              காலவரிசை<br /><span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '60%' }}>SCROLL</span>
            </h2>
          </div>

          {/* Legend */}
          <div style={{ position: 'absolute', top: '80px', right: '80px', display: 'flex', gap: '20px', zIndex: 10 }}>
            {[['past', 'கடந்தகாலம்'], ['present', 'நிகழ்காலம்'], ['future', 'எதிர்காலம்']].map(([type, label]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: TYPE_COLOR[type], boxShadow: `0 0 6px ${TYPE_COLOR[type]}` }} />
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ position: 'absolute', bottom: '48px', left: '80px', right: '80px', height: '1px', background: 'rgba(255,255,255,0.08)', zIndex: 10, borderRadius: '1px' }}>
            <motion.div style={{ height: '100%', background: '#FF9D00', width: progressX, transformOrigin: 'left', borderRadius: '1px' }} />
          </div>

          {/* Scroll hint */}
          <div style={{ position: 'absolute', bottom: '66px', right: '80px', zIndex: 10 }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', fontFamily: 'sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase' }}>SCROLL</p>
          </div>

          {/* Horizontal scrolling cards */}
          {loading ? (
            <div style={{ position: 'absolute', top: '50%', left: '80px', transform: 'translateY(-50%)', display: 'flex', gap: `${GAP}px` }}>
              {[...Array(5)].map((_, i) => <div key={i} style={{ width: `${CARD_W}px`, height: '420px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px' }} />)}
            </div>
          ) : (
            <motion.div
              style={{ x, position: 'absolute', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: `${GAP}px`, width: 'max-content', paddingTop: '40px' }}
            >
              {events.map((ev, idx) => <TimelineCard key={ev.id} event={ev} idx={idx} />)}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
