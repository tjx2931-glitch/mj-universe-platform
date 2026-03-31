import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Camera } from 'lucide-react';
import { fetchGallery } from '../services/api';

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

const GalleryCard = ({ item, idx, onClick }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: idx * 0.05, duration: 0.5 }}
    data-testid={`gallery-card-${idx}`}
    onClick={() => onClick(item)}
    className="relative overflow-hidden rounded-2xl cursor-pointer group"
    style={{ aspectRatio: idx % 5 === 0 || idx % 5 === 3 ? '16/9' : '4/3' }}
  >
    <img
      src={item.image_url}
      alt={item.title_english}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=60'; }}
      loading="lazy"
    />

    {/* Overlay */}
    <div className="absolute inset-0 transition-opacity duration-300"
      style={{ background: 'linear-gradient(to top, rgba(3,3,3,0.9) 0%, rgba(3,3,3,0.2) 60%, transparent 100%)', opacity: 0.7 }} />
    <div className="absolute inset-0 flex items-end p-4">
      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <span className="text-orange-400/80 text-xs font-bold font-tamil-body block mb-1">{item.category}</span>
        <h3 className="text-white font-bold text-sm font-tamil-heading leading-tight">{item.title_tamil}</h3>
        <p className="text-zinc-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-tamil-body mt-1 line-clamp-2">{item.description_tamil}</p>
      </div>
    </div>

    {/* Hover icon */}
    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 p-1.5 rounded-lg">
      <ZoomIn size={14} className="text-orange-400" />
    </div>

    {/* Neon border on hover */}
    <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-orange-500/40 transition-colors duration-300 pointer-events-none" />
  </motion.div>
);

const GalleryModal = ({ item, items, onClose, onNext, onPrev }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9 }}
      data-testid="gallery-modal"
      className="relative max-w-3xl w-full glass-card rounded-3xl overflow-hidden"
      style={{ border: '1px solid rgba(255,157,0,0.2)' }}
      onClick={e => e.stopPropagation()}
    >
      <div className="relative" style={{ maxHeight: '60vh' }}>
        <img
          src={item.image_url}
          alt={item.title_english}
          className="w-full object-contain"
          style={{ maxHeight: '60vh' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80'; }}
        />
        <div className="absolute top-4 right-4">
          <button onClick={onClose} data-testid="gallery-modal-close"
            className="bg-black/70 hover:bg-black/90 p-2 rounded-full text-zinc-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-orange-400 text-xs font-bold font-tamil-body">{item.category}</span>
            <h3 className="text-white text-xl font-black font-tamil-heading mt-1">{item.title_tamil}</h3>
            <p className="text-zinc-500 text-sm font-tamil-body">{item.title_english}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 text-zinc-500 text-xs font-tamil-body">
              <Camera size={11} />
              <span>{item.photographer}</span>
            </div>
          </div>
        </div>
        <p className="text-zinc-400 text-sm mt-3 leading-relaxed font-tamil-body">{item.description_tamil}</p>
      </div>

      {/* Nav */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4">
        <button onClick={onPrev} data-testid="gallery-prev-btn"
          className="bg-black/70 hover:bg-orange-500/20 p-2 rounded-full text-zinc-400 hover:text-orange-400 transition-all">
          ←
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4">
        <button onClick={onNext} data-testid="gallery-next-btn"
          className="bg-black/70 hover:bg-orange-500/20 p-2 rounded-full text-zinc-400 hover:text-orange-400 transition-all">
          →
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [ref, visible] = useInView();

  useEffect(() => {
    fetchGallery().then(d => { setItems(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const selectedIdx = selected ? items.findIndex(i => i.id === selected.id) : -1;
  const goPrev = () => { const i = (selectedIdx - 1 + items.length) % items.length; setSelected(items[i]); };
  const goNext = () => { const i = (selectedIdx + 1) % items.length; setSelected(items[i]); };

  return (
    <section id="gallery" data-testid="gallery-section" ref={ref} className="relative py-24 px-4 sm:px-6" style={{ zIndex: 1 }}>
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <p className="text-orange-400 text-xs uppercase tracking-widest mb-3 font-tamil-body">விண்வெளி கோட்சேரி</p>
          <h2 className="text-4xl sm:text-5xl font-black font-tamil-heading">
            <span className="gradient-text">விண்வெளி படங்கள்</span>
          </h2>
          <div className="section-divider" />
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mt-4 font-tamil-body">NASA, ESA மற்றும் விண்வெளி ஆய்வாளர்களின் உண்மையான படங்கள்</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="glass-card rounded-2xl h-48 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, idx) => (
              <GalleryCard key={item.id} item={item} idx={idx} onClick={setSelected} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <GalleryModal item={selected} items={items} onClose={() => setSelected(null)} onNext={goNext} onPrev={goPrev} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
