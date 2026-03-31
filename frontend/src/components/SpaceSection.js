import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Building2 } from 'lucide-react';
import { fetchSpacePast, fetchSpacePresent, fetchSpaceFuture } from '../services/api';

const TABS = [
  { id: 'past', tamil: 'கடந்தகாலம்', english: 'PAST', accent: '#FF9D00' },
  { id: 'present', tamil: 'நிகழ்காலம்', english: 'PRESENT', accent: '#10B981' },
  { id: 'future', tamil: 'எதிர்காலம்', english: 'FUTURE', accent: '#8B5CF6' },
];

const SpaceCard = ({ item, idx, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.04 }}
    data-testid={`space-card-${idx}`}
    onClick={() => onClick(item)}
    style={{ width: '290px', flexShrink: 0, borderRadius: '16px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
  >
    <div style={{ height: '380px', position: 'relative', overflow: 'hidden' }}>
      <img
        src={item.image_url}
        alt={item.title_english}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=60'; }}
        onMouseOver={e => { e.target.style.transform = 'scale(1.05)'; }}
        onMouseOut={e => { e.target.style.transform = 'scale(1)'; }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }} />
      <div style={{ position: 'absolute', top: '16px', left: '16px', fontFamily: "'Arima Madurai',serif", fontWeight: 900, fontSize: '52px', lineHeight: 1, color: 'rgba(255,255,255,0.1)', userSelect: 'none' }}>
        {String(idx + 1).padStart(2, '0')}
      </div>
      <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>{item.status}</span>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px' }}>
        <span style={{ background: 'rgba(255,157,0,0.15)', color: '#FF9D00', padding: '3px 10px', borderRadius: '12px', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Noto Sans Tamil',sans-serif" }}>{item.agency}</span>
        <h3 style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 700, fontSize: '18px', color: 'white', marginTop: '8px', lineHeight: 1.2 }}>{item.title_tamil}</h3>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '3px', fontFamily: 'sans-serif' }}>{item?.date}</p>
      </div>
    </div>
  </motion.div>
);

const SpaceEventModal = ({ item, onClose }) => {
  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      data-testid="space-event-modal"
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94 }}
        style={{ maxWidth: '780px', width: '100%', background: '#070710', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <div style={{ height: '48vh', position: 'relative', overflow: 'hidden' }}>
          <img
            src={item.image_url}
            alt={item.title_english}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80'; }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,16,0.98) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
          <button
            data-testid="space-modal-close"
            onClick={onClose}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}>
            <X size={16} />
          </button>
          <div style={{ position: 'absolute', bottom: '24px', left: '28px', right: '28px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <span style={{ background: 'rgba(255,157,0,0.15)', color: '#FF9D00', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Noto Sans Tamil',sans-serif" }}>
                {item.agency}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>
                {item.status}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>
                {item.category}
              </span>
            </div>
            <h2 style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 900, fontSize: 'clamp(24px, 4vw, 36px)', color: 'white', lineHeight: 0.95, margin: 0 }}>
              {item.title_tamil}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', fontFamily: 'sans-serif', marginTop: '5px' }}>{item.title_english}</p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            <Calendar size={13} color="rgba(255,157,0,0.6)" />
            <span style={{ color: 'rgba(255,157,0,0.8)', fontSize: '13px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>{item?.date}</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', lineHeight: 1.8, fontFamily: "'Noto Sans Tamil',sans-serif", marginBottom: '14px' }}>
            {item.description_tamil}
          </p>
          {item.description_english && (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', lineHeight: 1.7, fontFamily: 'sans-serif', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
              {item.description_english}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
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

const SpaceSection = () => {
  const [active, setActive] = useState('past');
  const [data, setData] = useState({ past: [], present: [], future: [] });
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ref, visible] = useInView();
  const scrollRef = useRef(null);

  useEffect(() => {
    Promise.all([fetchSpacePast(), fetchSpacePresent(), fetchSpaceFuture()])
      .then(([past, present, future]) => { setData({ past, present, future }); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, [active]);

  const tab = TABS.find(t => t.id === active);

  return (
    <section id="space" data-testid="space-section" ref={ref} style={{ position: 'relative', zIndex: 1, padding: '100px 0' }}>
      <div style={{ padding: '0 80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}
        >
          <div>
            <p className="label-upper" style={{ marginBottom: '14px' }}>04 — விண்வெளி சாதனைகள்</p>
            <h2 className="text-editorial" style={{ fontSize: 'clamp(48px, 7vw, 90px)', color: 'white' }}>
              <span className="gradient-gold">SPACE</span><br />
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>MISSIONS</span>
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '2px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {TABS.map(t => (
              <button key={t.id} data-testid={`tab-${t.id}`} onClick={() => setActive(t.id)}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: "'Noto Sans Tamil',sans-serif", fontSize: '13px', transition: 'all 0.25s', background: active === t.id ? t.accent : 'transparent', color: active === t.id ? '#000' : 'rgba(255,255,255,0.4)', fontWeight: active === t.id ? 700 : 400 }}>
                {t.tamil}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.p key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px', fontFamily: 'sans-serif' }}>
            {data[active]?.length || 0} MISSIONS — {tab?.english} — கிளிக் செய்து விவரங்கள் காண்க
          </motion.p>
        </AnimatePresence>
      </div>

      {loading ? (
        <div style={{ display: 'flex', gap: '16px', padding: '0 80px' }}>
          {[...Array(5)].map((_, i) => <div key={i} style={{ width: '290px', height: '380px', flexShrink: 0, borderRadius: '16px', background: 'rgba(255,255,255,0.03)' }} />)}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div
              ref={scrollRef}
              className="hide-scrollbar"
              style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '8px 80px 24px', cursor: 'grab', userSelect: 'none' }}
              onMouseDown={e => {
                const el = e.currentTarget;
                let startX = e.pageX - el.offsetLeft;
                let scrollL = el.scrollLeft;
                el.style.cursor = 'grabbing';
                const onMove = ev => { el.scrollLeft = scrollL - (ev.pageX - el.offsetLeft - startX); };
                const onUp = () => { el.style.cursor = 'grab'; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
              }}
            >
              {(data[active] || []).map((item, idx) => (
                <SpaceCard key={item.id} item={item} idx={idx} onClick={setSelectedEvent} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Event detail modal */}
      <AnimatePresence>
        {selectedEvent && <SpaceEventModal item={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default SpaceSection;
