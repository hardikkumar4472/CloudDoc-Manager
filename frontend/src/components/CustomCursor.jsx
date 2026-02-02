import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const cursorGlowRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if device is touch-capable
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsVisible(false);
      return;
    }

    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;
    const cursorGlow = cursorGlowRef.current;
    
    if (!cursorDot || !cursorOutline || !cursorGlow) return;

    // Position variables
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;
    let glowX = 0, glowY = 0;
    
    // Smoothness factor for outline and glow
    const delay = 8; 
    const glowDelay = 12; // Slower follow for glow

    // Mouse Move Event
    const onMouseMove = (e) => {
      // Update dot position immediately
      dotX = e.clientX;
      dotY = e.clientY;
      
      // Make sure cursor is visible
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
      cursorGlow.style.opacity = '0.4'; // Base opacity for glow
    };
    
    // Animation Loop
    let animationId;
    const animate = () => {
      // Linear interpolation for outline
      outlineX += (dotX - outlineX) / delay;
      outlineY += (dotY - outlineY) / delay;
      
      // Linear interpolation for glow
      glowX += (dotX - glowX) / glowDelay;
      glowY += (dotY - glowY) / glowDelay;
      
      if (cursorDot && cursorOutline && cursorGlow) {
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    // Hover Effects
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') || 
        target.closest('button') ||
        target.tagName.toLowerCase() === 'input' ||
        target.className.includes('clickable') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        cursorOutline.classList.add('cursor-hover');
        cursorGlow.classList.add('glow-hover');
      }
    };
    
    const handleMouseOut = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') || 
        target.closest('button') ||
        target.tagName.toLowerCase() === 'input' ||
        target.className.includes('clickable') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        cursorOutline.classList.remove('cursor-hover');
        cursorGlow.classList.remove('glow-hover');
      }
    };

    // Click Effects
    const handleMouseDown = () => {
        cursorOutline.classList.add('cursor-click');
        cursorGlow.classList.add('glow-click');
    };

    const handleMouseUp = () => {
        cursorOutline.classList.remove('cursor-click');
        cursorGlow.classList.remove('glow-click');
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    animationId = requestAnimationFrame(animate);

    // cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div ref={cursorGlowRef} className="cursor-glow"></div>
      <div ref={cursorDotRef} className="cursor-dot"></div>
      <div ref={cursorOutlineRef} className="cursor-outline"></div>
      <style>{`
        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          background-color: var(--accent-color);
          border-radius: 50%;
          z-index: 9999;
          pointer-events: none;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 10px var(--accent-color);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .cursor-outline {
          position: fixed;
          top: 0;
          left: 0;
          width: 40px;
          height: 40px;
          border: 1px solid var(--accent-color);
          border-radius: 50%;
          z-index: 9998;
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: width 0.2s, height 0.2s, background-color 0.2s, opacity 0.3s ease;
          opacity: 0;
        }

        .cursor-glow {
          position: fixed;
          top: 0;
          left: 0;
          width: 400px; /* Large area */
          height: 400px;
          background: radial-gradient(circle, var(--accent-glow) 0%, rgba(0, 0, 0, 0) 70%);
          border-radius: 50%;
          z-index: 9997; /* Behind dot/outline but on top of content */
          pointer-events: none;
          transform: translate(-50%, -50%);
          mix-blend-mode: screen; /* Helps it glow over dark backgrounds */
          transition: width 0.5s ease, height 0.5s ease, opacity 0.3s ease;
          opacity: 0;
        }
        
        [data-theme='light'] .cursor-glow {
          mix-blend-mode: normal;
        }

        .cursor-hover {
          width: 70px;
          height: 70px;
          background-color: var(--accent-glow);
          border-color: var(--accent-hover);
          mix-blend-mode: screen;
        }
        
        [data-theme='light'] .cursor-hover {
          mix-blend-mode: normal;
        }

        .glow-hover {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, var(--accent-glow) 0%, rgba(0, 0, 0, 0) 70%);
        }
        
        .cursor-click {
            width: 30px;
            height: 30px;
            background-color: var(--accent-glow);
            border-color: transparent;
        }

        .glow-click {
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, var(--accent-glow) 0%, rgba(0, 0, 0, 0) 70%);
        }
        
        /* Hide default cursor on desktops */
        @media (pointer: fine) {
            * {
                cursor: none !important;
            }
        }
      `}</style>
    </>
  );
}
