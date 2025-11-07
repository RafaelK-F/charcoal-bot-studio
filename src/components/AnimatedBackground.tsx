import { useEffect, useRef } from 'react';

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
  const particles = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    speed: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create unique seed for this page to ensure different patterns
    const pageSeed = pageId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Seeded random function for consistent per-page randomness
    let seed = pageSeed;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight || window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Density settings - 20% more particles
    const densityMultiplier = {
      low: 16000,
      medium: 9600,
      high: 6400
    }[density];

    // Style settings
    const styleConfig = {
      subtle: {
        baseOpacity: 0.15,
        maxOpacity: 0.4,
        connectionDistance: 80,
        connectionOpacity: 0.15
      },
      vibrant: {
        baseOpacity: 0.3,
        maxOpacity: 0.7,
        connectionDistance: 120,
        connectionOpacity: 0.3
      },
      minimal: {
        baseOpacity: 0.05,
        maxOpacity: 0.2,
        connectionDistance: 60,
        connectionOpacity: 0.08
      }
    }[style];

    // Initialize particles with page-specific randomness
    const initParticles = () => {
      particles.current = [];
      seed = pageSeed; // Reset seed for consistent generation
      
      const particleCount = Math.floor((canvas.width * canvas.height) / densityMultiplier);
      
      // Create main particles with page-specific distribution
      for (let i = 0; i < particleCount; i++) {
        // Use seeded random for consistent per-page placement
        const x = seededRandom() * canvas.width;
        const y = seededRandom() * canvas.height;
        
        // Page-specific movement patterns
        const angle = seededRandom() * Math.PI * 2;
        const baseSpeed = seededRandom() * 0.8 + 0.2;
        
        particles.current.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * baseSpeed * 0.4,
          vy: Math.sin(angle) * baseSpeed * 0.4,
          size: seededRandom() * 2.5 + 0.5,
          opacity: seededRandom() * (styleConfig.maxOpacity - styleConfig.baseOpacity) + styleConfig.baseOpacity,
          speed: seededRandom() * 0.6 + 0.3
        });
      }
      
      // Add page-specific special particles
      const specialCount = Math.floor(particleCount * 0.15);
      for (let i = 0; i < specialCount; i++) {
        const x = seededRandom() * canvas.width;
        const y = seededRandom() * canvas.height;
        
        particles.current.push({
          x: x,
          y: y,
          vx: (seededRandom() - 0.5) * 1.5,
          vy: (seededRandom() - 0.5) * 1.5,
          size: seededRandom() * 1.8 + 0.3,
          opacity: seededRandom() * styleConfig.baseOpacity + 0.02,
          speed: seededRandom() * 1.2 + 0.4
        });
      }

      // Add floating particles that move vertically through entire page
      const floatingCount = Math.floor(particleCount * 0.1);
      for (let i = 0; i < floatingCount; i++) {
        particles.current.push({
          x: seededRandom() * canvas.width,
          y: seededRandom() * canvas.height,
          vx: (seededRandom() - 0.5) * 0.3,
          vy: seededRandom() * 0.8 + 0.2, // Always moving down
          size: seededRandom() * 1.2 + 0.8,
          opacity: seededRandom() * styleConfig.maxOpacity * 0.6,
          speed: seededRandom() * 0.4 + 0.1
        });
      }
    };

    initParticles();

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx * particle.speed;
        particle.y += particle.vy * particle.speed;

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

        // Draw connections to nearby particles using style config
        particles.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < styleConfig.connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const opacity = (1 - distance / styleConfig.connectionDistance) * styleConfig.connectionOpacity;
            ctx.strokeStyle = `hsla(220, 8%, 88%, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [pageId, density, style]);

  return (
    <>
      {/* Animated particles canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: 'transparent' }}
      />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 z-1">
        {/* Primary gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 25% 25%, hsl(220 8% 88% / 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, hsl(220 13% 10% / 0.2) 0%, transparent 50%),
              linear-gradient(135deg, 
                hsl(220 15% 4%) 0%,
                hsl(220 13% 6%) 50%, 
                hsl(220 15% 4%) 100%
              )
            `
          }}
        />
        
        {/* Subtle moving gradients */}
        <div 
          className="absolute inset-0 opacity-20 animate-pulse"
          style={{
            background: `
              radial-gradient(ellipse at 20% 80%, hsl(220 8% 88% / 0.05) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, hsl(220 13% 10% / 0.08) 0%, transparent 60%)
            `,
            animationDuration: '8s'
          }}
        />

        {/* Final overlay to ensure readability */}
        <div 
          className="absolute inset-0 z-2"
          style={{
            background: `
              linear-gradient(
                to bottom, 
                hsl(220 15% 4% / 0.3) 0%,
                hsl(220 15% 4% / 0.1) 50%,
                hsl(220 15% 4% / 0.3) 100%
              )
            `
          }}
        />
      </div>
    </>
  );
};