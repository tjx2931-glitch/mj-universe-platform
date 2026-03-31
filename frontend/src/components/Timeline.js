import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fetchTimeline } from '../services/api';

const typeColor = {
  past: { dot: '#FF9D00', line: 'rgba(255,157,0,0.3)', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  present: { dot: '#10B981', line: 'rgba(16,185,129,0.3)', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  future: { dot: '#8B5CF6', line: 'rgba(139,92,246,0.3)', badge: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
};

const useInView = (opts = {}) => {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.15, ...opts });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
};

const TimelineCard = ({ event, idx, side }) => {
  const [ref, vis] = useInView();
  const colors = typeColor[event.type] || typeColor.past;

  return (
    <div
      ref={ref}
      data-testid={`timeline-card-${idx}`}
      className={`relative flex items-center gap-4 sm:gap-8 mb-8 ${side === 'right' ? 'flex-row-reverse' : ''}`}
    >
      {/* Card */}
      <motion.div
        className="flex-1 glass-card rounded-2xl p-5 max-w-sm"
        initial={{ opacity: 0, x: side === 'right' ? 40 : -40 }}
        animate={vis ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ borderColor: `${colors.dot}25` }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{event.icon}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-bold font-tamil-body ${colors.badge}`}>
            {event.category}
          </span>
        </div>
        <h3 className="text-white font-bold text-base mb-1 font-tamil-heading">{event.title_tamil}</h3>
        <p className="text-zinc-500 text-xs mb-2 font-tamil-body">{event.title_english}</p>
        <p className="text-zinc-400 text-sm leading-relaxed font-tamil-body">{event.description_tamil}</p>
      </motion.div>

      {/* Center year + dot */}
      <motion.div
        className="flex flex-col items-center shrink-0 relative z-10"
        initial={{ opacity: 0, scale: 0 }}
        animate={vis ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4 }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-black text-black font-tamil-body"
          style={{ background: `radial-gradient(circle, ${colors.dot}, ${colors.dot}88)`, boxShadow: `0 0 20px ${colors.dot}60, 0 0 40px ${colors.dot}20` }}
        >
          {event.year > 0 ? (event.year >= 2024 ? event.year.toString().slice(2) : event.year > 999 ? event.year : event.year < 0 ? `${Math.abs(event.year)}BC` : event.year) : `${Math.abs(event.year)}BC`}
        </div>
        <span className="text-zinc-600 text-xs mt-1 font-tamil-body">{event.year > 0 ? event.year : `${Math.abs(event.year)} கி.மு`}</span>
      </motion.div>

      {/* Spacer for other side */}
      <div className="flex-1 max-w-sm hidden sm:block" />
    </div>
  );
};

const Timeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref, visible] = useInView();

  useEffect(() => {
    fetchTimeline().then(d => { setEvents(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <section id="timeline" data-testid="timeline-section" ref={ref} className="relative py-24 px-4 sm:px-6" style={{ zIndex: 1 }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <p className="text-orange-400 text-xs uppercase tracking-widest mb-3 font-tamil-body">காலவரிசை</p>
          <h2 className="text-4xl sm:text-5xl font-black font-tamil-heading">
            <span className="gradient-text">வரலாற்று பயணம்</span>
          </h2>
          <div className="section-divider" />
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mt-4 font-tamil-body">கி.மு 200 முதல் 2040 வரை விண்வெளி வரலாறு</p>
        </motion.div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-12 flex-wrap">
          {[['past', 'கடந்தகாலம்'], ['present', 'நிகழ்காலம்'], ['future', 'எதிர்காலம்']].map(([type, label]) => (
            <div key={type} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: typeColor[type].dot, boxShadow: `0 0 8px ${typeColor[type].dot}` }} />
              <span className="text-zinc-400 text-xs font-tamil-body">{label}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-8 items-center">
                <div className="flex-1 h-24 glass-card rounded-2xl animate-pulse" />
                <div className="w-12 h-12 rounded-full animate-pulse" style={{ background: 'rgba(255,157,0,0.2)' }} />
                <div className="flex-1 h-24 hidden sm:block glass-card rounded-2xl animate-pulse opacity-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden sm:block"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,157,0,0.3) 10%, rgba(255,157,0,0.3) 90%, transparent)' }} />

            {events.map((event, idx) => (
              <TimelineCard key={event.id} event={event} idx={idx} side={idx % 2 === 0 ? 'left' : 'right'} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Timeline;
