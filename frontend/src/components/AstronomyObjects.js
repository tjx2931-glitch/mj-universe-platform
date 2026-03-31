import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { fetchObjects } from '../services/api';

const typeColors = {
  'நட்சத்திரம்': 'text-yellow-400 bg-yellow-400/10',
  'துணைக்கோள்': 'text-blue-400 bg-blue-400/10',
  'கோள்': 'text-orange-400 bg-orange-400/10',
  'நட்சத்திர தொகுப்பு': 'text-violet-400 bg-violet-400/10',
  'மங்கலம்': 'text-purple-400 bg-purple-400/10',
  'நட்சத்திர குழு': 'text-cyan-400 bg-cyan-400/10',
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

const ObjectCard = ({ obj, idx, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.05, duration: 0.5 }}
    data-testid={`object-card-${idx}`}
    onClick={() => onClick(obj)}
    className="glass-card rounded-2xl overflow-hidden cursor-pointer group relative"
  >
    {/* Image */}
    <div className="relative h-48 overflow-hidden">
      <img
        src={obj.image_url}
        alt={obj.name_english}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=60'; }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3,3,3,0.95) 10%, rgba(3,3,3,0.2) 70%)' }} />
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <ZoomIn size={16} className="text-orange-400" />
      </div>
    </div>

    {/* Content */}
    <div className="p-4">
      <span className={`text-xs px-2 py-0.5 rounded-full font-bold font-tamil-body ${typeColors[obj.type] || 'text-zinc-400 bg-zinc-400/10'}`}>{obj.type}</span>
      <h3 className="text-xl font-black text-white mt-2 mb-0.5 font-tamil-heading"
          style={{ textShadow: `0 0 15px ${obj.color || '#FF9D00'}40` }}>
        {obj.name_tamil}
      </h3>
      <p className="text-zinc-500 text-xs mb-2 font-tamil-body">{obj.name_english}</p>
      <div className="flex gap-3 text-xs text-zinc-500 font-tamil-body">
        <span>📏 {obj.distance}</span>
      </div>
    </div>

    {/* Colored bottom border */}
    <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
         style={{ background: `linear-gradient(90deg, transparent, ${obj.color || '#FF9D00'}, transparent)` }} />
  </motion.div>
);

const ObjectModal = ({ obj, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 30 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 30 }}
      data-testid="object-modal"
      className="glass-card rounded-3xl overflow-hidden max-w-lg w-full"
      style={{ border: `1px solid ${obj.color || '#FF9D00'}30`, boxShadow: `0 0 40px ${obj.color || '#FF9D00'}20` }}
      onClick={e => e.stopPropagation()}
    >
      <div className="relative h-56">
        <img src={obj.image_url} alt={obj.name_english} className="w-full h-full object-cover"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=60'; }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3,3,3,0.95) 0%, transparent 60%)' }} />
        <button onClick={onClose} data-testid="object-modal-close"
          className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-black/50 rounded-full p-1.5 transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="p-6">
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${typeColors[obj.type] || 'text-zinc-400 bg-zinc-400/10'}`}>{obj.type}</span>
        <h2 className="text-3xl font-black text-white mt-2 font-tamil-heading">{obj.name_tamil}</h2>
        <p className="text-zinc-400 text-sm mb-4 font-tamil-body">{obj.name_english}</p>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4 font-tamil-body">{obj.description_tamil}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,157,0,0.07)', border: '1px solid rgba(255,157,0,0.15)' }}>
            <p className="text-orange-400 text-xs mb-1 font-tamil-body">தொலைவு</p>
            <p className="text-white text-sm font-semibold font-tamil-body">{obj.distance}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,157,0,0.07)', border: '1px solid rgba(255,157,0,0.15)' }}>
            <p className="text-orange-400 text-xs mb-1 font-tamil-body">அளவு</p>
            <p className="text-white text-sm font-semibold font-tamil-body">{obj.size}</p>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)' }}>
          <p className="text-amber-400 text-xs mb-1 font-tamil-body">சுவாரஸ்ய தகவல்</p>
          <p className="text-zinc-300 text-sm font-tamil-body">{obj.fun_fact_tamil}</p>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const AstronomyObjects = () => {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [ref, visible] = useInView();

  useEffect(() => {
    fetchObjects().then(data => { setObjects(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <section id="objects" data-testid="objects-section" ref={ref} className="relative py-24 px-4 sm:px-6" style={{ zIndex: 1 }}>
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <p className="text-orange-400 text-xs uppercase tracking-widest mb-3 font-tamil-body">விண்வெளி பொருட்கள்</p>
          <h2 className="text-4xl sm:text-5xl font-black font-tamil-heading">
            <span className="gradient-text">கோள்கள் & நட்சத்திரங்கள்</span>
          </h2>
          <div className="section-divider" />
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mt-4 font-tamil-body">சூரிய குடும்பம் முதல் ஆழமான விண்வெளி வரை</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="glass-card rounded-2xl h-64 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {objects.map((obj, idx) => (
              <ObjectCard key={obj.id} obj={obj} idx={idx} onClick={setSelected} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
          onClick={() => setSelected(null)}
        >
          <ObjectModal obj={selected} onClose={() => setSelected(null)} />
        </motion.div>
      )}
    </section>
  );
};

export default AstronomyObjects;
