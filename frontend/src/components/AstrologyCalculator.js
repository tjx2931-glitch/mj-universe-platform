import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, MapPin, Clock, Calendar } from 'lucide-react';
import { calculateAstrology } from '../services/api';

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

const ResultCard = ({ label, tamil, english, extra, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card rounded-2xl p-4"
    style={{ border: '1px solid rgba(255,157,0,0.2)' }}
  >
    <div className="flex items-center gap-2 mb-2">
      <span className="text-orange-400 text-lg">{icon}</span>
      <p className="text-orange-400/70 text-xs uppercase tracking-widest font-tamil-body">{label}</p>
    </div>
    <p className="text-white text-xl font-black font-tamil-heading">{tamil}</p>
    <p className="text-zinc-500 text-xs font-tamil-body">{english}</p>
    {extra && <p className="text-zinc-400 text-xs mt-2 font-tamil-body border-t border-white/10 pt-2">{extra}</p>}
  </motion.div>
);

const AstrologyCalculator = () => {
  const [form, setForm] = useState({ name: '', birth_date: '', birth_time: '06:00', birth_place: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ref, visible] = useInView();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.birth_date) { setError('பிறந்த தேதி கட்டாயம் உள்ளீடு செய்யவும்'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await calculateAstrology(form);
      setResult(data);
    } catch (err) {
      setError('கணக்கிட முடியவில்லை. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-white text-sm font-tamil-body outline-none transition-all duration-200 focus:ring-1 focus:ring-orange-500/50";
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' };

  return (
    <section id="astrology" data-testid="astrology-section" ref={ref} className="relative py-24 px-4 sm:px-6 overflow-hidden" style={{ zIndex: 1 }}>
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,157,0,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <p className="text-orange-400 text-xs uppercase tracking-widest mb-3 font-tamil-body">வைதிக ஜோதிடம்</p>
          <h2 className="text-4xl sm:text-5xl font-black font-tamil-heading">
            <span className="gradient-text">ஜோதிட கணக்கீடு</span>
          </h2>
          <div className="section-divider" />
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mt-4 font-tamil-body">உங்கள் ராசி, நட்சத்திரம் மற்றும் லக்னம் கண்டறியுங்கள்</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass-card rounded-3xl p-6 sm:p-8"
            style={{ border: '1px solid rgba(255,157,0,0.2)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,157,0,0.15)' }}>
                <Sparkles size={18} className="text-orange-400" />
              </div>
              <div>
                <h3 className="text-white font-bold font-tamil-heading text-lg">பிறப்பு விவரங்கள்</h3>
                <p className="text-zinc-500 text-xs font-tamil-body">Birth Details</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-xs mb-2 font-tamil-body flex items-center gap-1">
                  <User size={12} /> பெயர் (விரும்பினால்)
                </label>
                <input
                  data-testid="astrology-name-input"
                  name="name" value={form.name} onChange={handleChange}
                  placeholder="உங்கள் பெயர்..."
                  className={inputClass} style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-xs mb-2 font-tamil-body flex items-center gap-1">
                  <Calendar size={12} /> பிறந்த தேதி *
                </label>
                <input
                  data-testid="astrology-date-input"
                  type="date" name="birth_date" value={form.birth_date} onChange={handleChange}
                  required className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-xs mb-2 font-tamil-body flex items-center gap-1">
                  <Clock size={12} /> பிறந்த நேரம்
                </label>
                <input
                  data-testid="astrology-time-input"
                  type="time" name="birth_time" value={form.birth_time} onChange={handleChange}
                  className={inputClass} style={{ ...inputStyle, colorScheme: 'dark' }}
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-xs mb-2 font-tamil-body flex items-center gap-1">
                  <MapPin size={12} /> பிறந்த இடம்
                </label>
                <input
                  data-testid="astrology-place-input"
                  name="birth_place" value={form.birth_place} onChange={handleChange}
                  placeholder="சென்னை, தமிழ்நாடு..."
                  className={inputClass} style={inputStyle}
                />
              </div>

              {error && (
                <p data-testid="astrology-error" className="text-red-400 text-sm font-tamil-body">{error}</p>
              )}

              <button
                type="submit"
                data-testid="astrology-submit-btn"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-black font-tamil-body transition-all duration-300 disabled:opacity-50 hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #FF9D00, #FFD700)', boxShadow: '0 0 25px rgba(255,157,0,0.35)' }}
              >
                {loading ? 'கணக்கிடுகிறது...' : '✨ கணக்கிடுங்கள்'}
              </button>
            </form>
          </motion.div>

          {/* Results */}
          <div>
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center"
                  style={{ border: '1px solid rgba(255,157,0,0.1)', minHeight: '400px' }}
                >
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                    style={{ background: 'rgba(255,157,0,0.08)', border: '1px solid rgba(255,157,0,0.2)' }}>
                    <span className="text-4xl">🔯</span>
                  </div>
                  <p className="text-zinc-400 font-tamil-body text-sm">பிறப்பு விவரங்களை உள்ளீட்டு கணக்கிடுங்கள்</p>
                  <p className="text-zinc-600 font-tamil-body text-xs mt-2">உங்கள் ராசி, நட்சத்திரம், லக்னம் தெரியும்</p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  data-testid="astrology-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Name banner */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-4 text-center"
                    style={{ background: 'linear-gradient(135deg, rgba(255,157,0,0.1), rgba(255,215,0,0.05))', border: '1px solid rgba(255,157,0,0.25)' }}
                  >
                    <p className="text-orange-300 font-bold font-tamil-heading text-lg">
                      {result.name !== 'நீங்கள்' ? `${result.name}` : 'உங்கள்'} ஜாதகம்
                    </p>
                    {result.birth_place && <p className="text-zinc-500 text-xs font-tamil-body mt-0.5">{result.birth_place}</p>}
                  </motion.div>

                  {/* Core results grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <ResultCard label="ராசி" tamil={`${result.rasi?.symbol} ${result.rasi?.tamil}`} english={result.rasi?.english} extra={`ஆட்சி: ${result.rasi?.ruler}`} icon="♈" delay={0.1} />
                    <ResultCard label="நட்சத்திரம்" tamil={result.nakshatra?.tamil} english={result.nakshatra?.english} extra={`தேவதை: ${result.nakshatra?.deity}`} icon="⭐" delay={0.2} />
                    <ResultCard label="லக்னம்" tamil={`${result.lagna?.symbol} ${result.lagna?.tamil}`} english={result.lagna?.english} extra={`தனி: ${result.lagna?.quality}`} icon="🌅" delay={0.3} />
                  </div>

                  {/* Panchangam */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="glass-card rounded-2xl p-4" style={{ border: '1px solid rgba(255,157,0,0.2)' }}>
                    <p className="text-orange-400/70 text-xs uppercase tracking-widest mb-3 font-tamil-body">பஞ்சாங்கம்</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[['வாரம்', result.panchangam?.vaara], ['திதி', result.panchangam?.thithi], ['யோகம்', result.panchangam?.yoga], ['நட்சத்திரம்', result.panchangam?.nakshatra]].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm">
                          <span className="text-zinc-500 font-tamil-body">{k}:</span>
                          <span className="text-white font-semibold font-tamil-body">{v}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Characteristics */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="glass-card rounded-2xl p-4" style={{ border: '1px solid rgba(255,157,0,0.2)' }}>
                    <p className="text-orange-400/70 text-xs uppercase tracking-widest mb-2 font-tamil-body">குண நலன்கள்</p>
                    <p className="text-zinc-300 text-sm leading-relaxed font-tamil-body">{result.characteristics}</p>
                  </motion.div>

                  {/* Lucky */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    className="grid grid-cols-3 gap-3">
                    {[['அதிர்ஷ்ட நிறம்', result.lucky_color, '🎨'], ['அதிர்ஷ்ட எண்', result.lucky_number, '🔢'], ['அதிர்ஷ்ட கல்', result.lucky_gem, '💎']].map(([label, val, icon]) => (
                      <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)' }}>
                        <span className="text-xl block mb-1">{icon}</span>
                        <p className="text-amber-400 text-xs font-tamil-body mb-1">{label}</p>
                        <p className="text-white text-sm font-bold font-tamil-body">{val}</p>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AstrologyCalculator;
