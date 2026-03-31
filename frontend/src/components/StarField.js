import React, { useEffect, useRef } from 'react';

const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // Create stars
    const stars = Array.from({ length: 350 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      opacity: Math.random(),
      speed: (Math.random() - 0.5) * 0.015,
      color: Math.random() > 0.9 ? '#FFD700' : Math.random() > 0.8 ? '#FF9D00' : '#ffffff',
    }));

    // Shooting stars
    const shooters = Array.from({ length: 3 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      len: Math.random() * 120 + 80,
      speed: Math.random() * 4 + 3,
      opacity: 0,
      active: false,
      timer: Math.random() * 300 + i * 120,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach(s => {
        s.opacity += s.speed;
        if (s.opacity > 1 || s.opacity < 0.1) s.speed = -s.speed;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color.replace(')', `,${Math.max(0.1, s.opacity)})`).replace('rgb', 'rgba').replace('#', 'rgba(').replace('ffffff', '255,255,255,').replace('FFD700', '255,215,0,').replace('FF9D00', '255,157,0,');
        if (s.color === '#ffffff') ctx.fillStyle = `rgba(255,255,255,${Math.max(0.1, s.opacity)})`;
        else if (s.color === '#FFD700') ctx.fillStyle = `rgba(255,215,0,${Math.max(0.1, s.opacity)})`;
        else ctx.fillStyle = `rgba(255,157,0,${Math.max(0.1, s.opacity)})`;
        ctx.fill();
      });

      // Draw shooting stars
      shooters.forEach(sh => {
        sh.timer--;
        if (sh.timer <= 0 && !sh.active) {
          sh.active = true;
          sh.x = -sh.len;
          sh.y = Math.random() * canvas.height * 0.4;
          sh.opacity = 1;
          sh.timer = Math.random() * 400 + 200;
        }
        if (sh.active) {
          sh.x += sh.speed * 4;
          sh.y += sh.speed * 1.5;
          sh.opacity -= 0.012;
          if (sh.opacity <= 0 || sh.x > canvas.width + 100) {
            sh.active = false;
          } else {
            const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.len, sh.y - sh.len * 0.4);
            grad.addColorStop(0, `rgba(255,215,0,${sh.opacity})`);
            grad.addColorStop(1, 'rgba(255,215,0,0)');
            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.moveTo(sh.x, sh.y);
            ctx.lineTo(sh.x - sh.len, sh.y - sh.len * 0.4);
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default StarField;
