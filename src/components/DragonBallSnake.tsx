import React, { useEffect, useRef, useState } from 'react';

const BALL_COUNT = 7;
const TRAIL_COUNT = 10;

const DragonBallSnake = () => {
  const [positions, setPositions] = useState(Array(BALL_COUNT).fill({ x: 0, y: 0 }));
  const [trailPositions, setTrailPositions] = useState(Array(TRAIL_COUNT).fill({ x: 0, y: 0 }));
  const animationRef = useRef<number>();

  const handleMouseMove = (e: MouseEvent) => {
    const newPos = { x: e.clientX , y: e.clientY };

    setPositions((prev) => {
      const updated = [newPos, ...prev.slice(0, BALL_COUNT - 1)];
      return updated;
    });

    setTrailPositions((prev) => {
      const updated = [newPos, ...prev.slice(0, TRAIL_COUNT - 1)];
      return updated;
    });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
   
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="dragon-ball-snake" style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 100, width: '100vw', height: '100vh' }}>
      {/* Dragon trails */}
      {trailPositions.map((pos, idx) => (
        <div
          key={`trail-${idx}`}
          className="dragon-trail"
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0) 70%)',
            transform: 'translate(-50%, -50%)',
            opacity: 1 - (idx * 0.1),
            pointerEvents: 'none',
            zIndex: 90,
            filter: 'blur(5px)'
          }}
        />
      ))}
      
      {/* Dragon balls */}
      {positions.map((pos, idx) =>{
    
      

          return(
            <div
          key={`ball-${idx}`}
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            transform: 'translate(-50%, -50%)',
            transition: 'transform 0.1s linear',
            zIndex: 107 - idx,
            pointerEvents: 'none'
          }}
        >
          <div
            className={`dragonball snake-ball snake-ball-${idx + 1} dragonball-${(idx % 7) + 1}`}
            aria-label="Ngọc rồng"
            style={{
              width: `${40 - idx * 2}px`,
              height: `${40 - idx * 2}px`,
              animationDelay: `${Math.random() * 5}s, ${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s, ${12 + Math.random() * 8}s`,
              transform: `rotateX(${Math.random() * 10}deg) rotateY(${Math.random() * 10}deg) scale(${0.95 + Math.random() * 0.1})`
            }}
          />
        </div>
          )
        }
      
      
      )}
    </div>
  );
};

export default DragonBallSnake;
