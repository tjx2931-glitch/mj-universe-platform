import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import StarField from './components/StarField';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import './App.css';

const ObjectDetail = lazy(() => import('./pages/ObjectDetail'));
const GalleryDetail = lazy(() => import('./pages/GalleryDetail'));

const Loader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '48px', fontFamily: "'Arima Madurai',serif", fontWeight: 900, background: 'linear-gradient(135deg,#FF9D00,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MJ</p>
      <p style={{ color: 'rgba(255,157,0,0.6)', fontSize: '12px', letterSpacing: '0.3em', fontFamily: "'Noto Sans Tamil',sans-serif", marginTop: '8px' }}>ஏற்றுகிறது...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div style={{ background: '#000', minHeight: '100vh' }}>
        <StarField />
        <Navbar />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/object/:id" element={<ObjectDetail />} />
            <Route path="/gallery/:id" element={<GalleryDetail />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
