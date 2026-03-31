import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fetchObjects } from '../services/api';

const typeAccent = {
  'நட்சத்திரம்': '#FFD700',
  'துணைக்கோள்': '#64B5F6',
  'கோள்': '#FF9D00',
  'நட்சத்திர தொகுப்பு': '#CE93D8',
  'மங்கலம்': '#AB47BC',
  'நட்சத்திர குழு': '#4DD0E1',
};

const useInView = () => {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
};

// Grid layout patterns
const LAYOUT = [
  'col-span-4 row-span-2', 'col-span-4', 'col-span-4',
  'col-span-3', 'col-span-5 row-span-2', 'col-span-4',
  'col-span-4', 'col-span-4', 'col-span-4 row-span-2',
  'col-span-4', 'col-span-4', 'col-span-4',
  'col-span-3', 'col-span-3', 'col-span-3', 'col-span-3',
];

const ObjectCard = ({ obj, idx }) => {
  const navigate = useNavigate();
  const accent = typeAccent[obj.type] || '#FF9D00';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      data-testid={`object-card-${idx}`}
      onClick={() => navigate(`/object/${obj.id}`)}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', cursor: 'pointer', minHeight: '220px', background: '#0A0A0A' }}
      className="group"
    >
      <img
        src={obj.image_url}
        alt={obj.name_english}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
        className="img-hover"
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=60'; }}
      />

      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)', transition: 'opacity 0.3s' }} />

      {/* Hover border */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '12px', border: `1px solid ${accent}00`, transition: 'border-color 0.3s', pointerEvents: 'none' }}
        className="group-hover:border-orange-500/40" />

      {/* Content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px' }}>
        <span style={{ fontSize: '10px', color: accent, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Noto Sans Tamil',sans-serif", display: 'block', marginBottom: '6px' }}>{obj.type}</span>
        <h3 style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 900, fontSize: 'clamp(22px, 3vw, 34px)', color: 'white', lineHeight: 0.95, margin: 0 }}>{obj.name_tamil}</h3>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontFamily: 'sans-serif', marginTop: '4px' }}>{obj.name_english}</p>
      </div>

      {/* Bottom glow on hover */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}
        className="group-hover:opacity-100" />
    </motion.div>
  );
};

const AstronomyObjects = () => {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref, visible] = useInView();

  useEffect(() => {
    fetchObjects().then(d => { setObjects(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <section id="objects" data-testid="objects-section" ref={ref} style={{ position: 'relative', zIndex: 1, padding: '100px 80px' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <p className="label-upper" style={{ marginBottom: '14px' }}>05 — விண்வெளி பொருட்கள்</p>
          <h2 className="text-editorial" style={{ fontSize: 'clamp(48px, 7vw, 90px)', color: 'white' }}>
            CELESTIAL<br /><span className="gradient-gold">OBJECTS</span>
          </h2>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', fontFamily: "'Noto Sans Tamil',sans-serif", maxWidth: '260px', textAlign: 'right', lineHeight: 1.7 }}>
          கிரகங்களை கிளிக் செய்து விரிவான தகவல்கள் அறியுங்கள்
        </p>
      </motion.div>

      {/* Masonry grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '8px' }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ gridColumn: 'span 3', height: '220px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '8px', gridAutoRows: '220px' }}>
          {objects.map((obj, idx) => {
            // Define layout spans
            const layouts = [
              { colSpan: 4, rowSpan: 2 }, { colSpan: 4, rowSpan: 1 }, { colSpan: 4, rowSpan: 1 },
              { colSpan: 3, rowSpan: 1 }, { colSpan: 5, rowSpan: 2 }, { colSpan: 4, rowSpan: 1 },
              { colSpan: 4, rowSpan: 1 }, { colSpan: 4, rowSpan: 1 }, { colSpan: 4, rowSpan: 2 },
              { colSpan: 4, rowSpan: 1 }, { colSpan: 4, rowSpan: 1 }, { colSpan: 3, rowSpan: 1 },
              { colSpan: 3, rowSpan: 1 }, { colSpan: 3, rowSpan: 1 }, { colSpan: 3, rowSpan: 1 }, { colSpan: 3, rowSpan: 1 },
            ];
            const layout = layouts[idx % layouts.length];
            return (
              <div key={obj.id} style={{ gridColumn: `span ${layout.colSpan}`, gridRow: `span ${layout.rowSpan}` }}>
                <ObjectCard obj={obj} idx={idx} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AstronomyObjects;
