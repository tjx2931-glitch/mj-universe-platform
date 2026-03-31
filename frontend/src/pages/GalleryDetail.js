import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Download } from 'lucide-react';

const BASE = process.env.REACT_APP_BACKEND_URL;

const GalleryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/gallery/${id}`).then(r => r.json()),
      fetch(`${BASE}/api/gallery`).then(r => r.json()),
    ])
      .then(([single, all]) => { setItem(single); setAllItems(all); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,157,0,0.6)', fontFamily: "'Noto Sans Tamil',sans-serif", letterSpacing: '0.2em' }}>ஏற்றுகிறது...</p>
    </div>
  );

  if (!item) return null;

  const currentIdx = allItems.findIndex(i => i.id === item.id);
  const prev = allItems[currentIdx - 1];
  const next = allItems[currentIdx + 1];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Full screen image */}
      <div style={{ height: '80vh', position: 'relative', overflow: 'hidden' }}>
        <motion.img
          key={item.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          src={item.image_url}
          alt={item.title_english}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600&q=80'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.9) 100%)' }} />

        {/* Back */}
        <button data-testid="gallery-detail-back" onClick={() => navigate(-1)}
          style={{ position: 'absolute', top: '100px', left: '40px', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', padding: '10px 20px', cursor: 'pointer', fontFamily: "'Noto Sans Tamil',sans-serif", fontSize: '13px' }}>
          <ArrowLeft size={16} /> பின்னால்
        </button>

        {/* Nav */}
        {prev && <button onClick={() => navigate(`/gallery/${prev.id}`)} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '48px', height: '48px', color: 'white', cursor: 'pointer', fontSize: '20px' }}>‹</button>}
        {next && <button onClick={() => navigate(`/gallery/${next.id}`)} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '48px', height: '48px', color: 'white', cursor: 'pointer', fontSize: '20px' }}>›</button>}

        {/* Info overlay */}
        <div style={{ position: 'absolute', bottom: '48px', left: '60px', right: '60px' }}>
          <span style={{ background: 'rgba(255,157,0,0.15)', color: '#FF9D00', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Noto Sans Tamil',sans-serif" }}>{item.category}</span>
          <h1 style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 900, fontSize: 'clamp(40px,7vw,80px)', lineHeight: 0.9, color: 'white', marginTop: '12px' }}>
            {item.title_tamil}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>{item.title_english}</p>
        </div>
      </div>

      {/* Description */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '17px', lineHeight: 1.8, fontFamily: "'Noto Sans Tamil',sans-serif", marginBottom: '32px' }}>{item.description_tamil}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.3)' }}>
          <Camera size={14} />
          <span style={{ fontSize: '13px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>{item.photographer}</span>
        </div>
      </div>
    </div>
  );
};

export default GalleryDetail;
