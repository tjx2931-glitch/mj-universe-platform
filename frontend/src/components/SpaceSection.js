import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Rocket, Globe, Tag, ExternalLink } from 'lucide-react';
import { fetchSpacePast, fetchSpacePresent, fetchSpaceFuture } from '../services/api';

const TABS = [
  { id: 'past', label: 'கடந்தகாலம்', sub: 'Historical Events', color: 'from-amber-600 to-orange-600' },
  { id: 'present', label: 'நிகழ்காலம்', sub: 'Active Missions', color: 'from-emerald-600 to-teal-600' },
  { id: 'future', label: 'எதிர்காலம்', sub: 'Future Plans', color: 'from-violet-600 to-purple-600' },
];

const statusColor = { 'வெற்றி': 'text-emerald-400 bg-emerald-400/10', 'செயல்பாட்டில்': 'text-blue-400 bg-blue-400/10', 'திட்டமிட்டது': 'text-purple-400 bg-purple-400/10', 'தயாரிப்பில்': 'text-yellow-400 bg-yellow-400/10', 'பயணத்தில்': 'text-cyan-400 bg-cyan-400/10', 'சோதனையில்': 'text-orange-400 bg-orange-400/10', 'தொடர்கிறது': 'text-teal-400 bg-teal-400/10', 'பகுதி வெற்றி': 'text-amber-400 bg-amber-400/10' };

const SpaceCard = ({ item, idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.06, duration: 0.5 }}
    data-testid={`space-card-${idx}`}
    className="glass-card rounded-2xl overflow-hidden cursor-pointer group"
  >
    {/* Image */}
    <div className="relative h-44 overflow-hidden">
      <img
        src={item.image_url}
        alt={item.title_english}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=60'; }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3,3,3,0.9) 0%, transparent 60%)' }} />
      {/* Badges */}
      <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-500/90 text-black font-tamil-body">{item.agency}</span>
      </div>
      <div className="absolute top-3 right-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold font-tamil-body ${statusColor[item.status] || 'text-zinc-400 bg-zinc-400/10'}`}>{item.status}</span>
      </div>
      <div className="absolute bottom-3 left-3 flex items-center gap-1 text-zinc-400">
        <Calendar size={11} />
        <span className="text-xs font-tamil-body">{item.date}</span>
      </div>
    </div>

    {/* Content */}
    <div className="p-4">
      <div className="flex items-start gap-2 mb-2">
        <Tag size={13} className="text-orange-400 mt-1 shrink-0" />
        <span className="text-orange-400/70 text-xs font-tamil-body">{item.category}</span>
      </div>
      <h3 className="text-white font-bold text-base mb-1 font-tamil-heading leading-snug">{item.title_tamil}</h3>
      <p className="text-zinc-500 text-xs mb-1 font-tamil-body">{item.title_english}</p>
      <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 font-tamil-body">{item.description_tamil}</p>
    </div>
  </motion.div>
);

const useInView = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const SpaceSection = () => {
  const [activeTab, setActiveTab] = useState('past');
  const [data, setData] = useState({ past: [], present: [], future: [] });
  const [loading, setLoading] = useState(true);
  const [ref, visible] = useInView();

  useEffect(() => {
    Promise.all([fetchSpacePast(), fetchSpacePresent(), fetchSpaceFuture()])
      .then(([past, present, future]) => {
        setData({ past, present, future });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const currentTab = TABS.find(t => t.id === activeTab);

  return (
    <section id="space" data-testid="space-section" ref={ref} className="relative py-24 px-4 sm:px-6" style={{ zIndex: 1 }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-orange-400 text-xs uppercase tracking-widest mb-3 font-tamil-body">வான்வெளி சாதனைகள்</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white font-tamil-heading mb-3">
            <span className="gradient-text">விண்வெளி திட்டங்கள்</span>
          </h2>
          <div className="section-divider" />
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mt-4 font-tamil-body">NASA, ISRO மற்றும் உலக விண்வெளி நிறுவனங்களின் சாதனைகள்</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab.id}
              data-testid={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 font-tamil-body ${
                activeTab === tab.id
                  ? 'text-white scale-105'
                  : 'glass-card text-zinc-400 hover:text-white'
              }`}
              style={activeTab === tab.id ? { background: `linear-gradient(135deg, var(--tw-gradient-stops))`, backgroundImage: `linear-gradient(135deg, ${tab.id === 'past' ? '#d97706,#ea580c' : tab.id === 'present' ? '#059669,#0d9488' : '#7c3aed,#9333ea'})`, boxShadow: '0 0 20px rgba(255,157,0,0.2)' } : {}}
            >
              <span>{tab.label}</span>
              <span className="block text-xs opacity-60 font-normal">{data[tab.id]?.length || 0} திட்டங்கள்</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {(data[activeTab] || []).map((item, idx) => (
                <SpaceCard key={item.id} item={item} idx={idx} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

export default SpaceSection;
