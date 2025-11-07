import { useEffect, useRef, useMemo } from 'react';

interface AnimatedBackgroundProps {
  pageId?: string;
  density?: 'low' | 'medium' | 'high';
  style?: 'subtle' | 'vibrant' | 'minimal';
}

export const AnimatedBackground = ({ 
  pageId = 'default', 
  density = 'medium', 
  style = 'subtle' 
}: AnimatedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);

  // Optimized density - 70% fewer particles
  const densityMultiplier = useMemo(() => ({
    low: 50000,
    medium: 30000,
    high: 20000
  }[density]), [density]);

  // Style configs
  const styleConfig = useMemo(() => ({
    subtle: {
      baseOpacity: 0.12,
      maxOpacity: 0.3,
      connectionDistance: 150,
      connectionOpacity: 0.1,
      maxConnections: 2
    },
    vibrant: {
      baseOpacity: 0.25,
      maxOpacity: 0.6,
      connectionDistance: 180,
      connectionOpacity: 0.25,
      maxConnections: 3
    },
    minimal: {
      baseOpacity: 0.05,
      maxOpacity: 0.15,
      connectionDistance: 120,
      connectionOpacity: 0.06,
      maxConnections: 1
    }
  }[style]), [style]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { 
      alpha: true,
      desynchronized: true // Better performance
    });
    if (!ctx) return;

    // Page seed for consistent randomness
    const pageSeed = pageId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let seed = pageSeed;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.min(document.documentElement.scrollHeight, window.innerHeight * 2);
    };

    resizeCanvas();
    
    // Optimized particle array
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      connections: number;
    }> = [];

    // Initialize with fewer particles
    const initParticles = () => {
      particles.length = 0;
      seed = pageSeed;
      
      const particleCount = Math.min(
        Math.floor((canvas.width * canvas.height) / densityMultiplier),
        60 // Hard cap at 60 particles
      );
      
      for (let i = 0; i < particleCount; i++) {
        const x = seededRandom() * canvas.width;
        const y = seededRandom() * canvas.height;
        const angle = seededRandom() * Math.PI * 2;
        const speed = seededRandom() * 0.3 + 0.1;
        
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: seededRandom() * 1.5 + 0.8,
          opacity: seededRandom() * (styleConfig.maxOpacity - styleConfig.baseOpacity) + styleConfig.baseOpacity,
          connections: 0
        });
      }
    };

    initParticles();

    // Throttled animation - 30fps instead of 60fps
    const FPS_LIMIT = 30;
    const FRAME_MIN_TIME = 1000 / FPS_LIMIT;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTimeRef.current;
      
      if (elapsed < FRAME_MIN_TIME) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      lastFrameTimeRef.current = currentTime - (elapsed % FRAME_MIN_TIME);

      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Reset connection counts
      particles.forEach(p => p.connections = 0);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(220, 8%, 88%, ${particle.opacity})`;
        ctx.fill();

        // Optimized connections - only check nearby particles with limit
        if (particle.connections < styleConfig.maxConnections) {
          for (let j = i + 1; j < particles.length; j++) {
            const other = particles[j];
            
            if (other.connections >= styleConfig.maxConnections) continue;

            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distSq = dx * dx + dy * dy;
            const maxDistSq = styleConfig.connectionDistance * styleConfig.connectionDistance;

            if (distSq < maxDistSq) {
              const distance = Math.sqrt(distSq);
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              const opacity = (1 - distance / styleConfig.connectionDistance) * styleConfig.connectionOpacity;
              ctx.strokeStyle = `hsla(220, 8%, 88%, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
              
              particle.connections++;
              other.connections++;
              
              if (particle.connections >= styleConfig.maxConnections) break;
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [pageId, densityMultiplier, styleConfig]);

  return (
    <>
      {/* Optimized particles canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: 'transparent', willChange: 'transform' }}
      />
      
      {/* Simplified gradient overlays - CSS only */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            background: `
              radial-gradient(circle at 25% 25%, hsl(220 8% 88% / 0.08) 0%, transparent 45%),
              radial-gradient(circle at 75% 75%, hsl(220 13% 10% / 0.15) 0%, transparent 45%)
            `
          }}
        />
      </div>
    </>
  );
};