import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const BASE = process.env.REACT_APP_BACKEND_URL;

const ObjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [obj, setObj] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/objects/${id}`)
      .then(r => r.json())
      .then(d => { setObj(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,157,0,0.6)', fontFamily: "'Noto Sans Tamil',sans-serif", letterSpacing: '0.2em' }}>ஏற்றுகிறது...</p>
    </div>
  );

  if (!obj) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Noto Sans Tamil',sans-serif" }}>கண்டறியவில்லை</p>
      <button onClick={() => navigate('/')} style={{ color: '#FF9D00', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Noto Sans Tamil',sans-serif" }}>
        முகப்பு திரும்புங்கள்
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* Hero image */}
      <div style={{ height: '70vh', position: 'relative', overflow: 'hidden' }}>
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          src={obj.image_url}
          alt={obj.name_english}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.95) 100%)' }} />

        {/* Back */}
        <button
          data-testid="object-detail-back"
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', top: '100px', left: '40px', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', padding: '10px 20px', cursor: 'pointer', fontFamily: "'Noto Sans Tamil',sans-serif", fontSize: '13px' }}
        >
          <ArrowLeft size={16} /> பின்னால்
        </button>

        {/* Title overlay */}
        <div style={{ position: 'absolute', bottom: '60px', left: '60px', right: '60px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <p className="label-upper" style={{ marginBottom: '12px' }}>{obj.type}</p>
            <h1 style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 900, fontSize: 'clamp(60px,10vw,120px)', lineHeight: 0.85, color: 'white', marginBottom: '8px' }}
                className="gradient-gold">
              {obj.name_tamil}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>{obj.name_english}</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 40px' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', lineHeight: 1.8, fontFamily: "'Noto Sans Tamil',sans-serif", marginBottom: '48px' }}>
            {obj.description_tamil}
          </p>

          {/* Data grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {[['தொலைவு', obj.distance], ['அளவு', obj.size]].map(([label, val]) => (
              <div key={label} style={{ background: 'rgba(255,157,0,0.06)', border: '1px solid rgba(255,157,0,0.15)', borderRadius: '16px', padding: '24px' }}>
                <p className="label-upper" style={{ marginBottom: '8px' }}>{label}</p>
                <p style={{ color: 'white', fontSize: '16px', fontWeight: 600, fontFamily: "'Noto Sans Tamil',sans-serif" }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Fun fact */}
          <div style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: '20px', padding: '32px' }}>
            <p className="label-upper" style={{ color: 'rgba(255,215,0,0.8)', marginBottom: '12px' }}>சுவாரஸ்ய தகவல்</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', lineHeight: 1.7, fontFamily: "'Noto Sans Tamil',sans-serif" }}>
              {obj.fun_fact_tamil}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ObjectDetail;
