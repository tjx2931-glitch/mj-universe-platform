import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const VIDEO_URL = 'https://customer-assets.emergentagent.com/job_c5d8a91a-ec18-4f3a-9ccd-e978a3b6b881/artifacts/xlkvujb9_215018.mp4';

const HeroSection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const scrollToNext = () => {
    const el = document.querySelector('#space');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(3,3,3,0.75) 0%, rgba(3,3,3,0.55) 50%, rgba(3,3,3,0.75) 100%)', zIndex: 1 }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(3,3,3,0.6) 100%)', zIndex: 2 }} />
      <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, #030303, transparent)', zIndex: 3 }} />

      {/* Content */}
      <div className="relative text-center px-4 max-w-5xl mx-auto" style={{ zIndex: 10 }}>
        {/* MJ Brand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <h1
            data-testid="hero-brand"
            className="font-tamil-heading font-black text-white select-none"
            style={{
              fontSize: 'clamp(100px, 20vw, 200px)',
              lineHeight: 0.9,
              textShadow: '0 0 40px rgba(255,157,0,0.7), 0 0 80px rgba(255,157,0,0.4), 0 0 120px rgba(255,157,0,0.2)',
              letterSpacing: '-0.02em',
            }}
          >
            <span className="gradient-text-shimmer">MJ</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mt-4"
        >
          <h2
            data-testid="hero-subtitle"
            className="font-tamil-heading text-white font-bold"
            style={{ fontSize: 'clamp(20px, 4vw, 36px)', textShadow: '0 0 20px rgba(255,157,0,0.5)' }}
          >
            விண்வெளியை உணருங்கள்
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-1 font-tamil-body">Experience the Universe</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-6"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full font-tamil-body" style={{ background: 'rgba(255,157,0,0.1)', border: '1px solid rgba(255,157,0,0.3)' }}>
            <span className="text-orange-400 text-sm font-semibold">கடந்தது</span>
            <span className="text-zinc-600">•</span>
            <span className="text-orange-300 text-sm font-semibold">நிகழ்காலம்</span>
            <span className="text-zinc-600">•</span>
            <span className="text-amber-400 text-sm font-semibold">எதிர்காலம்</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            data-testid="hero-explore-btn"
            onClick={scrollToNext}
            className="px-8 py-3 rounded-xl font-semibold text-black font-tamil-body transition-all duration-300 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #FF9D00, #FFD700)', boxShadow: '0 0 25px rgba(255,157,0,0.4)' }}
          >
            ஆராயுங்கள்
          </button>
          <button
            onClick={() => document.querySelector('#astrology').scrollIntoView({ behavior: 'smooth' })}
            data-testid="hero-astrology-btn"
            className="px-8 py-3 rounded-xl font-semibold text-orange-400 font-tamil-body border border-orange-500/40 hover:border-orange-400 hover:bg-white/5 transition-all duration-300"
          >
            ஜோதிடம் →
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        data-testid="hero-scroll-btn"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-500 hover:text-orange-400 transition-colors"
        style={{ zIndex: 10 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <ChevronDown size={30} />
      </motion.button>
    </section>
  );
};

export default HeroSection;
