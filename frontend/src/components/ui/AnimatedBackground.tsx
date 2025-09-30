'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  angle: number;
  rotationSpeed: number;
}

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const colors = ['#3A86FF', '#FF006E', '#FFBE0B'];
    
    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    });

    const initParticles = () => {
      particles = Array.from({ length: 50 }, createParticle);
    };

    const drawParticle = (particle: Particle) => {
      if (!ctx) return;
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.angle);
      
      ctx.beginPath();
      const sides = 6; // Шестиугольник
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides;
        const x = Math.cos(angle) * particle.size;
        const y = Math.sin(angle) * particle.size;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      // Градиентная заливка
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
      gradient.addColorStop(0, `${particle.color}FF`);
      gradient.addColorStop(1, `${particle.color}00`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    };

    const updateParticle = (particle: Particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.angle += particle.rotationSpeed;

      // Плавное замедление
      particle.speedX *= 0.99;
      particle.speedY *= 0.99;

      // Случайное ускорение
      if (Math.random() < 0.01) {
        particle.speedX += (Math.random() - 0.5) * 0.2;
        particle.speedY += (Math.random() - 0.5) * 0.2;
      }

      // Ограничение максимальной скорости
      const maxSpeed = 2;
      const speed = Math.sqrt(particle.speedX ** 2 + particle.speedY ** 2);
      if (speed > maxSpeed) {
        particle.speedX = (particle.speedX / speed) * maxSpeed;
        particle.speedY = (particle.speedY / speed) * maxSpeed;
      }

      // Перенос частиц при выходе за границы
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        updateParticle(particle);
        drawParticle(particle);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />
    </div>
  );
};