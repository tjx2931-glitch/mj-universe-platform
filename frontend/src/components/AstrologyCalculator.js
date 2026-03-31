import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sparkles } from 'lucide-react';
import { calculateAstrology } from '../services/api';

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

const roundRect = (ctx, x, y, w, h, r = 0) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
};

const exportKundali = async (result) => {
  await document.fonts.ready;
  const W = 900, H = 650;
  const canvas = document.createElement('canvas');
  canvas.width = W * 2; canvas.height = H * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#030303'); bg.addColorStop(0.5, '#07070F'); bg.addColorStop(1, '#030303');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // Outer border
  ctx.strokeStyle = 'rgba(255,157,0,0.4)'; ctx.lineWidth = 1;
  ctx.strokeRect(20, 20, W - 40, H - 40);

  // Corner dots
  [[24,24],[W-24,24],[24,H-24],[W-24,H-24]].forEach(([x,y]) => {
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2); ctx.fillStyle = '#FF9D00'; ctx.fill();
  });

  // MJ
  ctx.font = '900 56px "Arima Madurai", serif'; ctx.fillStyle = '#FF9D00';
  ctx.fillText('MJ', 50, 86);

  // Separator line
  const g = ctx.createLinearGradient(50, 0, 260, 0);
  g.addColorStop(0, '#FF9D00'); g.addColorStop(1, 'transparent');
  ctx.strokeStyle = g; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(50, 96); ctx.lineTo(260, 96); ctx.stroke();

  ctx.font = '400 13px "Noto Sans Tamil", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillText('விண்வெளி அனுபவம்  •  ஜாதகம்', 50, 116);

  if (result.name && result.name !== 'நீங்கள்') {
    ctx.font = '700 26px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#FFFFFF'; ctx.fillText(result.name, 50, 154);
    if (result.birth_place) {
      ctx.font = '400 12px "Noto Sans Tamil", sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillText(result.birth_place, 50, 174);
    }
  }

  // Divider
  ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(50, 192, W - 100, 1);

  // Main boxes
  const boxes = [
    { label: 'ராசி', main: `${result.rasi?.symbol||''} ${result.rasi?.tamil||''}`, sub: result.rasi?.english||'', extra: `ஆட்சி: ${result.rasi?.ruler||''}` },
    { label: 'நட்சத்திரம்', main: result.nakshatra?.tamil||'', sub: result.nakshatra?.english||'', extra: `தேவதை: ${result.nakshatra?.deity||''}` },
    { label: 'லக்னம்', main: `${result.lagna?.symbol||''} ${result.lagna?.tamil||''}`, sub: result.lagna?.english||'', extra: `கூறு: ${result.lagna?.element||''}` },
  ];
  boxes.forEach((box, i) => {
    const bx = 50 + i * 270, by = 210, bw = 248, bh = 135;
    ctx.fillStyle = 'rgba(255,157,0,0.06)';
    roundRect(ctx, bx, by, bw, bh, 8); ctx.fill();
    ctx.strokeStyle = 'rgba(255,157,0,0.18)'; ctx.lineWidth = 1;
    roundRect(ctx, bx, by, bw, bh, 8); ctx.stroke();
    ctx.font = '400 10px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = 'rgba(255,157,0,0.75)'; ctx.fillText(box.label, bx+16, by+22);
    ctx.font = '700 21px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = '#FFFFFF'; ctx.fillText(box.main, bx+16, by+57);
    ctx.font = '400 12px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillText(box.sub, bx+16, by+78);
    ctx.font = '400 11px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = 'rgba(255,157,0,0.55)'; ctx.fillText(box.extra, bx+16, by+107);
  });

  // Panchangam
  ctx.font = '400 11px "Noto Sans Tamil", sans-serif';
  ctx.fillStyle = 'rgba(255,157,0,0.7)'; ctx.fillText('பஞ்சாங்கம்', 50, 382);
  ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(50, 390, W-100, 1);
  const panch = [['வாரம்', result.panchangam?.vaara||''],['திதி', result.panchangam?.thithi||''],['யோகம்', result.panchangam?.yoga||''],['நட்சத்திரம்', result.panchangam?.nakshatra||'']];
  panch.forEach(([l,v], i) => {
    const col = i < 2 ? 0 : 1; const row = i < 2 ? i : i-2;
    const px = 50 + col*390, py = 410 + row*28;
    ctx.font = '400 13px "Noto Sans Tamil", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillText(l+':', px, py);
    ctx.fillStyle = '#FFF'; ctx.fillText(v, px+90, py);
  });

  // Lucky
  ctx.font = '400 11px "Noto Sans Tamil", sans-serif';
  ctx.fillStyle = 'rgba(255,215,0,0.7)'; ctx.fillText('அதிர்ஷ்ட விவரங்கள்', 50, 500);
  ctx.fillStyle = 'rgba(255,215,0,0.12)'; ctx.fillRect(50, 508, W-100, 1);
  ctx.font = '400 14px "Noto Sans Tamil", sans-serif'; ctx.fillStyle = '#FFF';
  [`நிறம்: ${result.lucky_color||''}`, `எண்: ${result.lucky_number||''}`, `கல்: ${result.lucky_gem||''}`].forEach((t, i) => {
    ctx.fillText(t, 50 + i*280, 534);
  });

  // Footer
  ctx.font = '400 10px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillText('MJ விண்வெளி அனுபவம்', 50, H-34);

  const link = document.createElement('a');
  link.download = `${(result.name||'my').replace(/\s+/g,'_')}-kundali.png`;
  link.href = canvas.toDataURL('image/png'); link.click();
};

const AstrologyCalculator = () => {
  const [form, setForm] = useState({ name: '', birth_date: '', birth_time: '08:00', birth_place: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ref, visible] = useInView();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async e => {
    e.preventDefault();
    if (!form.birth_date) { setError('பிறந்த தேதி தேவை'); return; }
    setLoading(true); setError('');
    try { setResult(await calculateAstrology(form)); }
    catch { setError('கணக்கிட முடியவில்லை.'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'white', fontSize: '14px', fontFamily: "'Noto Sans Tamil',sans-serif", outline: 'none', transition: 'border-color 0.2s', colorScheme: 'dark' };
  const labelStyle = { display: 'block', color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: '8px' };

  return (
    <section id="astrology" data-testid="astrology-section" ref={ref} style={{ position: 'relative', zIndex: 1, padding: '100px 80px', background: 'rgba(0,0,0,0.7)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(255,157,0,0.03) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}
          style={{ marginBottom: '64px' }}>
          <p className="label-upper" style={{ marginBottom: '14px' }}>07 — VEDIC ASTROLOGY</p>
          <h2 className="text-editorial" style={{ fontSize: 'clamp(48px, 7vw, 90px)', color: 'white' }}>
            ஜோதிட<br /><span className="gradient-gold">கணக்கீடு</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
          {/* Form */}
          <motion.form onSubmit={submit} initial={{ opacity: 0, x: -30 }} animate={visible ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '40px' }}>
            <h3 style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 700, fontSize: '22px', color: 'white', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} color="#FF9D00" /> பிறப்பு விவரங்கள்
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>பெயர் (விரும்பினால்)</label>
                <input data-testid="astrology-name-input" name="name" value={form.name} onChange={handle} placeholder="உங்கள் பெயர்..." style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(255,157,0,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>
              <div>
                <label style={labelStyle}>பிறந்த தேதி *</label>
                <input data-testid="astrology-date-input" type="date" name="birth_date" value={form.birth_date} onChange={handle} required style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(255,157,0,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>
              <div>
                <label style={labelStyle}>பிறந்த நேரம்</label>
                <input data-testid="astrology-time-input" type="time" name="birth_time" value={form.birth_time} onChange={handle} style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(255,157,0,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>
              <div>
                <label style={labelStyle}>பிறந்த இடம்</label>
                <input data-testid="astrology-place-input" name="birth_place" value={form.birth_place} onChange={handle} placeholder="சென்னை, தமிழ்நாடு..." style={inputStyle} onFocus={e => e.target.style.borderColor = 'rgba(255,157,0,0.4)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>
              {error && <p data-testid="astrology-error" style={{ color: '#F87171', fontSize: '13px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>{error}</p>}
              <button type="submit" data-testid="astrology-submit-btn" disabled={loading}
                style={{ padding: '15px', borderRadius: '12px', background: loading ? 'rgba(255,157,0,0.4)' : 'linear-gradient(135deg,#FF9D00,#FFD700)', color: '#000', fontWeight: 700, fontSize: '15px', fontFamily: "'Noto Sans Tamil',sans-serif", border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 0 24px rgba(255,157,0,0.25)', transition: 'transform 0.2s' }}
                onMouseOver={e => !loading && (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                {loading ? 'கணக்கிடுகிறது...' : 'கணக்கிடுங்கள்'}
              </button>
            </div>
          </motion.form>

          {/* Results */}
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,157,0,0.06)', border: '1px solid rgba(255,157,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '32px' }}>&#9800;</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Noto Sans Tamil',sans-serif", fontSize: '14px' }}>பிறப்பு விவரங்களை உள்ளீடு செய்யுங்கள்</p>
              </motion.div>
            ) : (
              <motion.div key="result" data-testid="astrology-results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Name banner */}
                <div style={{ padding: '20px 24px', borderRadius: '16px', background: 'rgba(255,157,0,0.06)', border: '1px solid rgba(255,157,0,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 700, fontSize: '22px', color: '#FF9D00' }}>{result.name !== 'நீங்கள்' ? result.name : ''} ஜாதகம்</p>
                    {result.birth_place && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>{result.birth_place}</p>}
                  </div>
                  <button data-testid="kundali-export-btn" onClick={() => exportKundali(result)}
                    title="Download Kundali"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '20px', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', color: '#FFD700', fontSize: '12px', cursor: 'pointer', fontFamily: "'Noto Sans Tamil',sans-serif" }}>
                    <Download size={13} /> ஜாதகம் பதிவிறக்கு
                  </button>
                </div>

                {/* Core: Rasi, Nakshatra, Lagna */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
                  {[
                    { l: 'ராசி', v: `${result.rasi?.symbol||''} ${result.rasi?.tamil||''}`, s: result.rasi?.english, x: `ஆட்சி: ${result.rasi?.ruler||''}` },
                    { l: 'நட்சத்திரம்', v: result.nakshatra?.tamil, s: result.nakshatra?.english, x: `தேவதை: ${result.nakshatra?.deity||''}` },
                    { l: 'லக்னம்', v: `${result.lagna?.symbol||''} ${result.lagna?.tamil||''}`, s: result.lagna?.english, x: `கூறு: ${result.lagna?.element||''}` },
                  ].map(item => (
                    <div key={item.l} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,157,0,0.12)', borderRadius: '14px', padding: '18px 14px' }}>
                      <p style={{ color: 'rgba(255,157,0,0.65)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: '6px' }}>{item.l}</p>
                      <p style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 700, fontSize: '20px', color: 'white', lineHeight: 1 }}>{item.v}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontFamily: 'sans-serif', marginTop: '2px' }}>{item.s}</p>
                      <p style={{ color: 'rgba(255,157,0,0.5)', fontSize: '11px', fontFamily: "'Noto Sans Tamil',sans-serif", marginTop: '6px' }}>{item.x}</p>
                    </div>
                  ))}
                </div>

                {/* Panchangam */}
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px' }}>
                  <p style={{ color: 'rgba(255,157,0,0.65)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: '14px' }}>பஞ்சாங்கம்</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[['வாரம்', result.panchangam?.vaara],['திதி', result.panchangam?.thithi],['யோகம்', result.panchangam?.yoga],['நட்சத்திரம்', result.panchangam?.nakshatra]].map(([k,v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>{k}:</span>
                        <span style={{ color: 'white', fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Characteristics */}
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px' }}>
                  <p style={{ color: 'rgba(255,157,0,0.65)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: '10px' }}>குண நலன்கள்</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.7, fontFamily: "'Noto Sans Tamil',sans-serif" }}>{result.characteristics}</p>
                </div>

                {/* Lucky */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                  {[['அதிர்ஷ்ட நிறம்', result.lucky_color],['அதிர்ஷ்ட எண்', result.lucky_number],['அதிர்ஷ்ட கல்', result.lucky_gem]].map(([l,v]) => (
                    <div key={l} style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                      <p style={{ color: 'rgba(255,215,0,0.6)', fontSize: '10px', letterSpacing: '0.1em', fontFamily: 'sans-serif', marginBottom: '6px' }}>{l}</p>
                      <p style={{ color: 'white', fontSize: '15px', fontWeight: 700, fontFamily: "'Noto Sans Tamil',sans-serif" }}>{v}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default AstrologyCalculator;
