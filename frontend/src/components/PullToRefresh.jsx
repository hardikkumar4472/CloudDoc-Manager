import { useState, useEffect, useRef } from 'react';

const PullToRefresh = ({ onRefresh, children }) => {
  const [startPoint, setStartPoint] = useState(0);
  const [pullChange, setPullChange] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const refreshRef = useRef(null);

  useEffect(() => {
    // Add non-passive event listener for wheel to prevent default scrolling
    const container = refreshRef.current;
    if (!container) return;

    let isPulling = false;
    let startY = 0;

    const handleTouchStart = (e) => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop === 0) {
        startY = e.touches[0].pageY;
        isPulling = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling) return;
      const y = e.touches[0].pageY;
      const pull = y - startY;
      
      if (pull > 0) {
        // Resistance effect
        const resistance = pull * 0.4;
        setPullChange(resistance > 80 ? 80 : resistance);
        if (pull > 0 && window.scrollY === 0) {
            e.preventDefault(); // Prevent native scroll only when pulling down at top
        }
      } else {
        setPullChange(0);
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling) return;
      isPulling = false;
      
      if (pullChange > 60) {
        setRefreshing(true);
        onRefresh().finally(() => {
          setRefreshing(false);
          setPullChange(0);
        });
      } else {
        setPullChange(0);
      }
    };
    
    // Desktop Wheel Support (Top of page pull)
    const handleWheel = (e) => {
        if (window.scrollY === 0 && e.deltaY < 0) {
             // Pulling down at top
             const pull = Math.abs(e.deltaY) * 0.5;
             if (pullChange < 80) {
                 setPullChange(prev => Math.min(prev + pull, 80));
             }
        } else if (pullChange > 0) {
             setPullChange(0);
        }
    };

    const handleMouseUp = () => {
         if (pullChange > 60) {
            setRefreshing(true);
            onRefresh().finally(() => {
              setRefreshing(false);
              setPullChange(0);
            });
         } else {
             setPullChange(0);
         }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    
    // For PC testing mostly, real PC UX usually relies on a button
    document.addEventListener('mouseup', handleMouseUp);
    // window.addEventListener('wheel', handleWheel); // Optional: can conflict with scroll

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mouseup', handleMouseUp);
      // window.removeEventListener('wheel', handleWheel);
    };
  }, [pullChange, onRefresh]);

  return (
    <div ref={refreshRef} style={{ minHeight: '100vh', position: 'relative' }}>
      <div 
        style={{ 
          height: pullChange, 
          overflow: 'hidden', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          transition: refreshing ? 'height 0.2s' : 'none',
          background: 'transparent'
        }}
      >
        {refreshing ? (
           <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: 'var(--brand-color)' }}></i>
        ) : (
           <div style={{ transform: `rotate(${pullChange * 3}deg)`, opacity: pullChange / 60 }}>
              <i className="fas fa-arrow-down" style={{ fontSize: '24px', color: 'var(--brand-color)' }}></i>
           </div>
        )}
      </div>
      <div style={{ 
          transform: `translateY(${pullChange}px)`, 
          transition: refreshing ? 'transform 0.2s' : 'none' 
      }}>
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
