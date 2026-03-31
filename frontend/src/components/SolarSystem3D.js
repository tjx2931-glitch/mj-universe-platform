import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import * as THREE from 'three';

const PLANETS = [
  { id: 'mercury', nameTamil: 'புதன்', nameEnglish: 'Mercury', radius: 0.4, orbit: 7, color: 0xAAAAAA, speed: 0.9, desc: 'சூரிய குடும்பத்தின் மிக சிறிய கோள். -180°C முதல் 430°C வரை வெப்பநிலை மாறும்.' },
  { id: 'venus', nameTamil: 'வெள்ளி', nameEnglish: 'Venus', radius: 0.65, orbit: 10.5, color: 0xE8C984, speed: 0.65, desc: 'சூரிய குடும்பத்தின் மிக சூடான கோள். 465°C வெப்பநிலை. பூமியின் இரட்டையர்.' },
  { id: 'earth', nameTamil: 'பூமி', nameEnglish: 'Earth', radius: 0.7, orbit: 14, color: 0x336699, speed: 0.5, desc: 'நாம் வாழும் கோள். சூரிய குடும்பத்தில் உயிர்கள் உள்ள ஒரே கோள்.' },
  { id: 'mars', nameTamil: 'செவ்வாய்', nameEnglish: 'Mars', radius: 0.5, orbit: 18.5, color: 0xCC4422, speed: 0.38, desc: 'சிவப்பு கோள். ஒலிம்பஸ் மான்ஸ் - சூரிய குடும்பத்தின் உயரமான மலை இங்கே உள்ளது.' },
  { id: 'jupiter', nameTamil: 'வியாழன்', nameEnglish: 'Jupiter', radius: 1.6, orbit: 26, color: 0xC0813A, speed: 0.22, desc: 'சூரிய குடும்பத்தின் மிகப்பெரிய கோள். 95 சந்திரன்கள். பெரிய சிவப்பு புயல் 400 ஆண்டுகளாக.' },
  { id: 'saturn', nameTamil: 'சனி', nameEnglish: 'Saturn', radius: 1.3, orbit: 34, color: 0xDDCC99, speed: 0.14, isSaturn: true, desc: 'வளையங்களுடன் கூடிய அழகிய கோள். நீரில் மிதக்கும் அடர்த்தி கொண்டது.' },
];

const SolarSystem3D = () => {
  const mountRef = useRef(null);
  const stateRef = useRef({});
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let THREE;
    try { THREE = require('three'); } catch { return; }

    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth, H = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
    camera.position.set(0, 28, 60);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x111111, 2));
    const sunLight = new THREE.PointLight(0xFF9D00, 10, 250);
    scene.add(sunLight);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(8000).fill(0).map(() => (Math.random() - 0.5) * 500);
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.7 })));

    // Sun
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(3.2, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xFF9D00, emissive: 0xFF8000, emissiveIntensity: 2 })
    );
    scene.add(sunMesh);
    const sunGlowMesh = new THREE.Mesh(
      new THREE.SphereGeometry(4.5, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xFF9D00, transparent: true, opacity: 0.1, side: THREE.BackSide })
    );
    scene.add(sunGlowMesh);

    // Planets
    const planetObjs = PLANETS.map((pd, i) => {
      const orbit = new THREE.Mesh(
        new THREE.RingGeometry(pd.orbit - 0.04, pd.orbit + 0.04, 96),
        new THREE.MeshBasicMaterial({ color: 0x1a1a1a, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
      );
      orbit.rotation.x = -Math.PI / 2;
      scene.add(orbit);

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(pd.radius, 28, 28),
        new THREE.MeshStandardMaterial({ color: pd.color, roughness: 0.75, metalness: 0.15 })
      );
      mesh.userData = { pd };

      if (pd.isSaturn) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(pd.radius * 1.5, pd.radius * 2.6, 64),
          new THREE.MeshBasicMaterial({ color: 0xBBAA77, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
        );
        ring.rotation.x = Math.PI / 3;
        mesh.add(ring);
      }

      const angle = (i / PLANETS.length) * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * pd.orbit, 0, Math.sin(angle) * pd.orbit);
      scene.add(mesh);
      return { mesh, angle, pd };
    });

    stateRef.current = { planetObjs };

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let mousePos = { x: 0, y: 0 };

    const onMouseMove = e => {
      const r = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      mousePos = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(planetObjs.map(p => p.mesh));
      if (hits.length > 0) {
        setSelected(hits[0].object.userData.pd);
      } else {
        raycaster.setFromCamera(mouse, camera);
        const sunHits = raycaster.intersectObject(sunMesh);
        if (sunHits.length > 0) {
          setSelected({ id: 'sun', nameTamil: 'சூரியன்', nameEnglish: 'The Sun', desc: 'நமது சூரிய குடும்பத்தின் மையம். G-வகை நட்சத்திரம். 1.39 மில்லியன் கி.மீ விட்டம்.' });
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Animate
    let raf;
    let t0 = Date.now();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = (Date.now() - t0) / 1000;
      sunMesh.rotation.y = t * 0.25;
      sunGlowMesh.rotation.y = t * 0.1;
      planetObjs.forEach(p => {
        p.angle += p.pd.speed * 0.004;
        p.mesh.position.set(Math.cos(p.angle) * p.pd.orbit, 0, Math.sin(p.angle) * p.pd.orbit);
        p.mesh.rotation.y += 0.009;
      });
      camera.position.y = 28 + Math.sin(t * 0.12) * 3;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();
    setLoaded(true);

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <section data-testid="solar-system-section" style={{ position: 'relative', zIndex: 1, background: '#000', padding: '0 0 0 0' }}>
      {/* Header */}
      <div style={{ padding: '100px 80px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <p className="label-upper" style={{ marginBottom: '12px' }}>03 — 3D EXPERIENCE</p>
          <h2 className="text-editorial" style={{ fontSize: 'clamp(48px, 7vw, 90px)', color: 'white' }}>
            சூரிய<br /><span className="gradient-gold">குடும்பம்</span>
          </h2>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', fontFamily: "'Noto Sans Tamil',sans-serif", maxWidth: '260px', textAlign: 'right', lineHeight: 1.7 }}>
          கிரகங்களை கிளிக் செய்து மேலும் அறியுங்கள்
        </p>
      </div>

      {/* Canvas */}
      <div
        ref={mountRef}
        data-testid="solar-canvas"
        style={{ width: '100%', height: '580px', cursor: 'crosshair', position: 'relative' }}
      />

      {/* Planet labels */}
      <div style={{ display: 'flex', gap: '24px', padding: '24px 80px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {PLANETS.map(p => (
          <button key={p.id} data-testid={`planet-btn-${p.id}`}
            onClick={() => setSelected(p)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,157,0,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
          >
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: `#${p.color.toString(16).padStart(6, '0')}`, boxShadow: `0 0 8px #${p.color.toString(16).padStart(6, '0')}60` }} />
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontFamily: "'Noto Sans Tamil',sans-serif" }}>{p.nameTamil}</span>
          </button>
        ))}
      </div>

      {/* Info panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            data-testid="planet-info-panel"
            style={{ position: 'absolute', top: '140px', right: '40px', width: '300px', background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,157,0,0.2)', borderRadius: '20px', padding: '28px', zIndex: 20 }}
          >
            <button onClick={() => setSelected(null)} data-testid="planet-panel-close"
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
              <X size={16} />
            </button>
            <p className="label-upper" style={{ marginBottom: '8px' }}>கிரகம்</p>
            <h3 style={{ fontFamily: "'Arima Madurai',serif", fontWeight: 900, fontSize: '36px', color: 'white', lineHeight: 0.9, marginBottom: '4px' }}>{selected.nameTamil}</h3>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', fontFamily: 'sans-serif', marginBottom: '16px' }}>{selected.nameEnglish}</p>
            <div style={{ width: '40px', height: '1px', background: 'rgba(255,157,0,0.4)', marginBottom: '16px' }} />
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', lineHeight: 1.7, fontFamily: "'Noto Sans Tamil',sans-serif" }}>{selected.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SolarSystem3D;
