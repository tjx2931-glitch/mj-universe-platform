import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause } from 'lucide-react';

// J2000.0 epoch
const J2000_MS = 946728000000;

const PLANET_DATA = [
  { id: 'sun',     tamil: 'சூரியன்',  en: 'The Sun',  r: 3.2,  orbit: 0,    color: 0xFF9D00, emissive: 0xFF7700, emInt: 2,    period: 0,       L0: 0,    desc: 'G-வகை நடுத்தர நட்சத்திரம். 4.6 பில்லியன் ஆண்டு பழமை.', extra: 'சூரிய குடும்ப நிறையின் 99.86% கொண்டது' },
  { id: 'mercury', tamil: 'புதன்',    en: 'Mercury',  r: 0.38, orbit: 6.5,  color: 0xAAAAAA, emissive: 0x888888, emInt: 0.05, period: 87.969,  L0: 252.2, desc: 'சூரிய குடும்பத்தின் மிக சிறிய கோள். 88 நாட்களில் சூரியனை சுற்றும்.', extra: '-180°C முதல் 430°C வரை வெப்பநிலை மாறும்' },
  { id: 'venus',   tamil: 'வெள்ளி',  en: 'Venus',   r: 0.62, orbit: 10,   color: 0xE8C984, emissive: 0xC8A864, emInt: 0.05, period: 224.701, L0: 181.9, desc: 'சூரிய குடும்பத்தின் மிக சூடான கோள். 465°C வெப்பநிலை.', extra: 'மிகவும் அடர்த்தியான CO2 வளிமண்டலம்' },
  { id: 'earth',   tamil: 'பூமி',    en: 'Earth',   r: 0.68, orbit: 14,   color: 0x2244AA, emissive: 0x113388, emInt: 0.05, period: 365.25,  L0: 100.5, desc: 'நாம் வாழும் கோள். சூரிய குடும்பத்தில் உயிர்கள் உள்ள ஒரே கோள்.', extra: '71% நீரால் மூடப்பட்ட நீல கோள்' },
  { id: 'mars',    tamil: 'செவ்வாய்', en: 'Mars',    r: 0.5,  orbit: 18.5, color: 0xCC4422, emissive: 0xAA2200, emInt: 0.05, period: 686.971, L0: 355.4, desc: 'சிவப்பு கோள். ஒலிம்பஸ் மான்ஸ் - சூரிய குடும்பத்தின் உயரமான மலை.', extra: '2 சந்திரன்கள்: போபாஸ் மற்றும் டெய்மாஸ்' },
  { id: 'jupiter', tamil: 'வியாழன்', en: 'Jupiter',  r: 1.6,  orbit: 27,   color: 0xC08030, emissive: 0x805010, emInt: 0.05, period: 4332.59, L0: 34.4,  desc: 'சூரிய குடும்பத்தின் மிகப்பெரிய கோள். 95 சந்திரன்கள்.', extra: 'பெரிய சிவப்பு புயல் 400 ஆண்டுகளாக தொடர்கிறது' },
  { id: 'saturn',  tamil: 'சனி',     en: 'Saturn',  r: 1.3,  orbit: 35.5, color: 0xDDCC88, emissive: 0xBBAA66, emInt: 0.05, period: 10759.22,L0: 50.1,  desc: 'வளையங்களுடன் கூடிய அழகிய கோள்.', extra: '146 சந்திரன்கள். வளையங்கள் 282,000 கி.மீ அகலம்', rings: true },
];

const EARTH_SPEED = (2 * Math.PI) / 22; // Earth completes orbit in 22 seconds (demo)

const getLiveAngle = (pd) => {
  if (!pd.period) return 0;
  const days = (Date.now() - J2000_MS) / 86400000;
  return ((pd.L0 + (360 / pd.period) * days) * Math.PI) / 180;
};

const InfoPanel = ({ planet, onClose }) => (
  <motion.div
    data-testid="planet-info-panel"
    initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
    style={{ position: 'absolute', top: '20px', right: '20px', width: '280px', zIndex: 30,
      background: 'rgba(4,4,10,0.96)', backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,157,0,0.2)', borderRadius: '20px', padding: '24px' }}
  >
    <button data-testid="planet-panel-close" onClick={onClose}
      style={{ position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
      <X size={15} />
    </button>
    <p style={{ color: 'rgba(255,157,0,0.65)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: '6px' }}>
      {planet.id === 'sun' ? 'நட்சத்திரம்' : 'கிரகம்'}
    </p>
    <h3 style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 900, fontSize: '34px', color: 'white', lineHeight: 0.9, marginBottom: '3px' }}>{planet.tamil}</h3>
    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontFamily: 'sans-serif', marginBottom: '14px' }}>{planet.en}</p>
    <div style={{ width: '36px', height: '1px', background: `#${planet.color.toString(16).padStart(6,'0')}80`, marginBottom: '14px' }} />
    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', lineHeight: 1.7, fontFamily: "'Noto Sans Tamil',sans-serif", marginBottom: '10px' }}>{planet.desc}</p>
    {planet.extra && (
      <p style={{ color: '#FF9D00', fontSize: '12px', fontFamily: "'Noto Sans Tamil',sans-serif", padding: '9px 12px', background: 'rgba(255,157,0,0.07)', borderRadius: '10px', lineHeight: 1.6 }}>{planet.extra}</p>
    )}
  </motion.div>
);

const SolarSystem3D = () => {
  const mountRef = useRef(null);
  const rafRef = useRef(null);
  const sceneDataRef = useRef({});
  const liveModeRef = useRef(false);
  const anglesRef = useRef({});

  const [selected, setSelected] = useState(null);
  const [liveMode, setLiveMode] = useState(false);

  // Keep refs in sync
  useEffect(() => { liveModeRef.current = liveMode; }, [liveMode]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || 1200;
    const H = 580;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
    camera.position.set(0, 38, 75);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x111133, 3));
    const sunLight = new THREE.PointLight(0xFF9D00, 12, 280, 1.2);
    scene.add(sunLight);

    // Stars background
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(12000).fill(0).map(() => (Math.random() - 0.5) * 600);
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true, opacity: 0.75 })));

    // Build planets
    const planetMeshes = [];
    const planetGroups = {};

    PLANET_DATA.forEach((pd, i) => {
      // Orbit ring (skip sun)
      if (pd.orbit > 0) {
        const ringMesh = new THREE.Mesh(
          new THREE.RingGeometry(pd.orbit - 0.06, pd.orbit + 0.06, 96),
          new THREE.MeshBasicMaterial({ color: 0x222236, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })
        );
        ringMesh.rotation.x = -Math.PI / 2;
        scene.add(ringMesh);
      }

      // Planet body
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(pd.r, 32, 32),
        new THREE.MeshStandardMaterial({ color: pd.color, emissive: pd.emissive, emissiveIntensity: pd.emInt, roughness: 0.75, metalness: 0.1 })
      );
      mesh.userData = { pd };

      // Saturn rings
      if (pd.rings) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(pd.r * 1.5, pd.r * 2.6, 64),
          new THREE.MeshBasicMaterial({ color: 0xC8B880, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
        );
        ring.rotation.x = Math.PI / 2.8;
        mesh.add(ring);
      }

      // Initial position
      const initAngle = pd.orbit > 0 ? getLiveAngle(pd) : 0;
      anglesRef.current[pd.id] = initAngle;
      mesh.position.x = Math.cos(initAngle) * pd.orbit;
      mesh.position.z = Math.sin(initAngle) * pd.orbit;

      scene.add(mesh);
      planetMeshes.push(mesh);
      planetGroups[pd.id] = mesh;
    });

    sceneDataRef.current = { scene, camera, renderer, planetMeshes, planetGroups };

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(planetMeshes, true);
      if (hits.length > 0) {
        let obj = hits[0].object;
        while (obj.parent && !obj.userData.pd) obj = obj.parent;
        if (obj.userData.pd) setSelected(obj.userData.pd);
      } else {
        setSelected(null);
      }
    };

    const onMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(planetMeshes, true);
      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'default';
    };

    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('mousemove', onMouseMove);

    // Simple mouse-drag orbit controls
    let isDragging = false, prevX = 0, prevY = 0;
    let phi = Math.PI / 6, theta = 0;
    const radius_cam = 85;

    const onPointerDown = (e) => { isDragging = true; prevX = e.clientX; prevY = e.clientY; };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = (e.clientX - prevX) * 0.006;
      const dy = (e.clientY - prevY) * 0.004;
      theta -= dx;
      phi = Math.max(0.1, Math.min(Math.PI / 2.2, phi + dy));
      prevX = e.clientX; prevY = e.clientY;
      camera.position.x = radius_cam * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius_cam * Math.cos(phi);
      camera.position.z = radius_cam * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 0, 0);
    };
    const onPointerUp = () => { isDragging = false; };

    // Scroll to zoom
    const onWheel = (e) => {
      const newR = Math.max(15, Math.min(150, radius_cam + e.deltaY * 0.1));
      camera.position.multiplyScalar(newR / radius_cam);
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('wheel', onWheel);

    // Animation loop
    let t0 = performance.now();
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const elapsed = (performance.now() - t0) / 1000;

      // Update planet positions
      PLANET_DATA.forEach(pd => {
        if (!pd.orbit || !pd.period) return;
        let angle;
        if (liveModeRef.current) {
          angle = getLiveAngle(pd);
        } else {
          const relSpeed = EARTH_SPEED / (pd.period / 365.25);
          anglesRef.current[pd.id] = (anglesRef.current[pd.id] || getLiveAngle(pd)) + relSpeed * 0.016;
          angle = anglesRef.current[pd.id];
        }
        const mesh = planetGroups[pd.id];
        if (mesh) {
          mesh.position.x = Math.cos(angle) * pd.orbit;
          mesh.position.z = Math.sin(angle) * pd.orbit;
          mesh.rotation.y += 0.008;
        }
      });

      // Rotate sun gently
      if (planetGroups['sun']) {
        planetGroups['sun'].rotation.y = elapsed * 0.2;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const onResize = () => {
      const w = mount.clientWidth;
      camera.aspect = w / H;
      camera.updateProjectionMatrix();
      renderer.setSize(w, H);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('mouseenter', onMouseEnter);
      renderer.domElement.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
      document.body.style.overflow = ''; // restore on unmount
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <section data-testid="solar-system-section" style={{ position: 'relative', zIndex: 1, background: '#000' }}>
      {/* Header */}
      <div style={{ padding: '100px 80px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <p className="label-upper" style={{ marginBottom: '12px' }}>03 — 3D EXPERIENCE</p>
          <h2 className="text-editorial" style={{ fontSize: 'clamp(48px, 7vw, 90px)', color: 'white' }}>
            சூரிய<br /><span className="gradient-gold">குடும்பம்</span>
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>
            இழுத்து சுழற்றுங்கள் • ஸ்க்ரோல் செய்து zoom செய்யுங்கள் • கிரகங்களை கிளிக் செய்யுங்கள்
          </p>
          <button
            data-testid="live-mode-toggle"
            onClick={() => setLiveMode(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '30px', cursor: 'pointer',
              border: `1px solid ${liveMode ? 'rgba(16,185,129,0.5)' : 'rgba(255,157,0,0.3)'}`,
              background: liveMode ? 'rgba(16,185,129,0.08)' : 'rgba(255,157,0,0.05)',
              color: liveMode ? '#10B981' : '#FF9D00', fontSize: '12px', fontFamily: 'sans-serif', fontWeight: 600, letterSpacing: '0.1em', transition: 'all 0.3s' }}
          >
            {liveMode ? <Pause size={11} /> : <Play size={11} />}
            {liveMode ? 'LIVE POSITIONS' : 'DEMO MODE'}
          </button>
        </div>
      </div>

      {/* Canvas wrapper */}
      <div style={{ position: 'relative', height: '580px', width: '100%' }}>
        <div
          ref={mountRef}
          data-testid="solar-canvas"
          style={{ width: '100%', height: '580px', background: '#000' }}
        />

        {/* Info panel */}
        <AnimatePresence>
          {selected && <InfoPanel planet={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>

        {!selected && (
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}>
            <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '10px', fontFamily: 'sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              DRAG TO ROTATE  •  SCROLL TO ZOOM  •  CLICK PLANET FOR INFO
            </p>
          </div>
        )}
      </div>

      {/* Planet quick-select row */}
      <div style={{ display: 'flex', gap: '10px', padding: '16px 80px 60px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {PLANET_DATA.map(pd => (
          <button key={pd.id} data-testid={`planet-btn-${pd.id}`}
            onClick={() => setSelected(selected?.id === pd.id ? null : pd)}
            style={{ background: selected?.id === pd.id ? 'rgba(255,157,0,0.1)' : 'none',
              border: `1px solid ${selected?.id === pd.id ? 'rgba(255,157,0,0.3)' : 'transparent'}`,
              cursor: 'pointer', padding: '5px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            onMouseOut={e => { e.currentTarget.style.background = selected?.id === pd.id ? 'rgba(255,157,0,0.1)' : 'none'; }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: `#${pd.color.toString(16).padStart(6, '0')}`, boxShadow: `0 0 5px #${pd.color.toString(16).padStart(6, '0')}70`, flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>{pd.tamil}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default SolarSystem3D;
