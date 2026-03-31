import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { fetchGallery } from '../services/api';

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

// Editorial grid layout
const GRID_LAYOUTS = [
  { col: '1 / 8', row: '1 / 3' },
  { col: '8 / 13', row: '1 / 2' },
  { col: '8 / 13', row: '2 / 3' },
  { col: '1 / 5', row: '3 / 4' },
  { col: '5 / 9', row: '3 / 5' },
  { col: '9 / 13', row: '3 / 4' },
  { col: '1 / 5', row: '4 / 5' },
  { col: '9 / 13', row: '4 / 5' },
  { col: '1 / 6', row: '5 / 7' },
  { col: '6 / 10', row: '5 / 6' },
  { col: '10 / 13', row: '5 / 6' },
  { col: '6 / 13', row: '6 / 7' },
];

const GalleryCard = ({ item, idx, onClick }) => {
  const layout = GRID_LAYOUTS[idx % GRID_LAYOUTS.length];
  const rotation = idx % 3 === 1 ? '0.8deg' : idx % 3 === 2 ? '-0.6deg' : '0deg';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: idx * 0.04 }}
      data-testid={`gallery-card-${idx}`}
      onClick={() => onClick(item)}
      style={{
        gridColumn: layout.col, gridRow: layout.row,
        position: 'relative', overflow: 'hidden', borderRadius: '10px',
        cursor: 'pointer', transform: `rotate(${rotation})`,
        transition: 'transform 0.4s ease',
      }}
      onMouseOver={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)'; e.currentTarget.style.zIndex = '5'; }}
      onMouseOut={e => { e.currentTarget.style.transform = `rotate(${rotation})`; e.currentTarget.style.zIndex = '1'; }}
    >
      <img
        src={item.image_url}
        alt={item.title_english}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=60'; }}
        loading="lazy"
      />
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)', opacity: 0.8, transition: 'opacity 0.3s' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 14px', transform: 'translateY(4px)', transition: 'transform 0.3s' }}>
        <span style={{ color: '#FF9D00', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>{item.category}</span>
        <p style={{ color: 'white', fontSize: '14px', fontWeight: 700, fontFamily: "'Arima Madurai',serif", lineHeight: 1.2, marginTop: '3px' }}>{item.title_tamil}</p>
      </div>
    </motion.div>
  );
};

const GalleryModal = ({ item, onClose }) => {
  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94 }}
        data-testid="gallery-modal"
        style={{ maxWidth: '900px', width: '100%', background: '#080808', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ position: 'relative', maxHeight: '60vh' }}>
          <img src={item.image_url} alt={item.title_english}
            style={{ width: '100%', maxHeight: '60vh', objectFit: 'cover', display: 'block' }}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900&q=80'; }} />
          <button data-testid="gallery-modal-close" onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', backdropFilter: 'blur(8px)' }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: '28px 32px' }}>
          <span style={{ color: '#FF9D00', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>{item.category}</span>
          <h3 style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 900, fontSize: '28px', color: 'white', margin: '6px 0 4px' }}>{item.title_tamil}</h3>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', fontFamily: 'sans-serif', marginBottom: '14px' }}>{item.title_english}</p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', lineHeight: 1.7, fontFamily: "'Noto Sans Tamil',sans-serif" }}>{item.description_tamil}</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', fontFamily: 'sans-serif', marginTop: '16px' }}>Photo: {item.photographer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [ref, visible] = useInView();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGallery().then(d => { setItems(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <section id="gallery" data-testid="gallery-section" ref={ref} style={{ position: 'relative', zIndex: 1, padding: '100px 80px' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <p className="label-upper" style={{ marginBottom: '14px' }}>08 — கோட்சேரி</p>
          <h2 className="text-editorial" style={{ fontSize: 'clamp(48px, 7vw, 90px)', color: 'white' }}>
            SPACE<br /><span className="gradient-gold">GALLERY</span>
          </h2>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', fontFamily: "'Noto Sans Tamil',sans-serif", maxWidth: '260px', textAlign: 'right', lineHeight: 1.7 }}>
          NASA, ESA மற்றும் விண்வெளி ஆய்வாளர்களின் உண்மையான படங்கள்
        </p>
      </motion.div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: '180px', gap: '8px' }}>
          {[...Array(6)].map((_, i) => <div key={i} style={{ gridColumn: 'span 4', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: '180px', gap: '8px' }}>
          {items.slice(0, 12).map((item, idx) => (
            <GalleryCard key={item.id} item={item} idx={idx} onClick={setSelected} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && <GalleryModal item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
