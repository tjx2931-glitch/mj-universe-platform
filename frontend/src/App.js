import React from 'react';
import StarField from './components/StarField';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SpaceSection from './components/SpaceSection';
import AstronomyObjects from './components/AstronomyObjects';
import Timeline from './components/Timeline';
import AstrologyCalculator from './components/AstrologyCalculator';
import Gallery from './components/Gallery';
import './App.css';

function App() {
  return (
    <div className="min-h-screen" style={{ background: '#030303' }}>
      <StarField />
      <Navbar />
      <main>
        <HeroSection />
        <SpaceSection />
        <AstronomyObjects />
        <Timeline />
        <AstrologyCalculator />
        <Gallery />
      </main>
      <footer className="border-t border-white/10 py-10 text-center" style={{ background: 'rgba(0,0,0,0.8)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-2xl font-bold gradient-text font-tamil-heading mb-2">MJ</p>
          <p className="text-zinc-500 text-sm font-tamil-body mb-1">விண்வெளியை உணருங்கள் • கடந்தது • நிகழ்காலம் • எதிர்காலம்</p>
          <p className="text-zinc-600 text-xs">© 2024 MJ – விண்வெளி அனுபவம் • NASA, ISRO & ESA Data</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
