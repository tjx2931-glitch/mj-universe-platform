import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureShowcase from '../components/FeatureShowcase';
import LiveAstronomy from '../components/LiveAstronomy';
import SolarSystem3D from '../components/SolarSystem3D';
import SpaceSection from '../components/SpaceSection';
import AstronomyObjects from '../components/AstronomyObjects';
import Timeline from '../components/Timeline';
import AstrologyCalculator from '../components/AstrologyCalculator';
import Gallery from '../components/Gallery';

class ErrBound extends React.Component {
  constructor(props) { super(props); this.state = { err: false }; }
  static getDerivedStateFromError() { return { err: true }; }
  render() {
    if (this.state.err) return (
      <div style={{ padding: '60px 80px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '13px', fontFamily: 'sans-serif' }}>
        {this.props.fallback || 'Section loading...'}
      </div>
    );
    return this.props.children;
  }
}

const HomePage = () => (
  <main>
    <HeroSection />
    <ErrBound fallback="Feature showcase loading..."><FeatureShowcase /></ErrBound>
    <ErrBound fallback="Live data loading..."><LiveAstronomy /></ErrBound>
    <ErrBound fallback="3D Solar system loading..."><SolarSystem3D /></ErrBound>
    <SpaceSection />
    <AstronomyObjects />
    <Timeline />
    <AstrologyCalculator />
    <Gallery />
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', background: 'rgba(0,0,0,0.9)' }}>
      <div>
        <p style={{ fontSize: '36px', fontFamily: "'Arima Madurai',serif", fontWeight: 900, background: 'linear-gradient(135deg,#FF9D00,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MJ</p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: "'Noto Sans Tamil',sans-serif", marginTop: '4px' }}>விண்வெளியை உணருங்கள்</p>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>
        © 2024 MJ – விண்வெளி அனுபவம் • NASA, ISRO & ESA Data
      </p>
    </footer>
  </main>
);

export default HomePage;
