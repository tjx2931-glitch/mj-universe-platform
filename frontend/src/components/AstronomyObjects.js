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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.06 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
};

const ObjectCard = ({ obj, idx }) => {
  const navigate = useNavigate();
  const accent = typeAccent[obj.type] || '#FF9D00';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.03 }}
      data-testid={`object-card-${idx}`}
      onClick={() => navigate(`/object/${obj.id}`)}
      style={{
        background: '#080810',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
      }}
      onMouseOver={e => {
        e.currentTarget.style.borderColor = `${accent}40`;
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 8px 28px ${accent}14`;
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image container — 1:1 aspect ratio, object-fit: contain so rings/stars fully visible */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        background: '#050508',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src={obj.image_url}
          alt={obj.name_english}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '6px',
            transition: 'transform 0.5s ease',
          }}
          onMouseOver={e => { e.target.style.transform = 'scale(1.06)'; }}
          onMouseOut={e => { e.target.style.transform = 'scale(1)'; }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=60'; }}
        />
        {/* Type badge */}
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <span style={{
            fontSize: '9px', color: accent,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            fontFamily: "'Noto Sans Tamil',sans-serif",
            background: `${accent}15`,
            padding: '3px 8px', borderRadius: '10px',
            border: `1px solid ${accent}25`,
          }}>{obj.type}</span>
        </div>
      </div>

      {/* Text — below image, not overlapping */}
      <div style={{ padding: '14px 16px 16px' }}>
        <h3 style={{
          fontFamily: "'Arima Madurai',serif", fontWeight: 900,
          fontSize: 'clamp(18px, 2.2vw, 24px)', color: 'white',
          lineHeight: 1.1, margin: 0, marginBottom: '3px',
          wordBreak: 'break-word', overflowWrap: 'break-word',
        }}>
          {obj.name_tamil}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontFamily: 'sans-serif', margin: 0 }}>
          {obj.name_english}
        </p>
      </div>
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

      {/* Auto-fit responsive grid — no masonry, full image visibility */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ aspectRatio: '1/1', background: 'rgba(255,255,255,0.03)', borderRadius: '14px' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', alignItems: 'start' }}>
          {objects.map((obj, idx) => (
            <ObjectCard key={obj.id} obj={obj} idx={idx} />
          ))}
        </div>
      )}
    </section>
  );
};

export default AstronomyObjects;
