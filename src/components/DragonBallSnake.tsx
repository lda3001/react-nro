import React, { useEffect, useRef, useState } from 'react';

const BALL_COUNT = 7;
const TRAIL_COUNT = 10;
const BASE_SPEED = 0.2; // Tốc độ cơ bản
const ROTATION_RADIUS = 50; // Bán kính vòng tròn xoay
const ROTATION_SPEED = 0.05; // Tốc độ xoay
const TRAIL_SPEED = 0.1; // Tốc độ đuổi theo của trail

// Hàm easing để tạo chuyển động mượt mà hơn
const easeOutQuad = (t: number) => t * (2 - t);

const DragonBallSnake = () => {
  const [positions, setPositions] = useState(Array(BALL_COUNT).fill({ x: 0, y: 0 }));
  const [trailPositions, setTrailPositions] = useState(Array(TRAIL_COUNT).fill({ x: 0, y: 0 }));
  const animationRef = useRef<number>();
  const mousePos = useRef({ x: 0, y: 0 });
  const lastUpdate = useRef(Date.now());
  const isRotating = useRef(false);
  const rotationAngle = useRef(0);
  const clickPos = useRef({ x: 0, y: 0 });
  const prevPositions = useRef(Array(BALL_COUNT).fill({ x: 0, y: 0 }));

  const handleMouseMove = (e: MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseClick = (e: MouseEvent) => {
    isRotating.current = true;
    clickPos.current = { x: e.clientX, y: e.clientY };
    rotationAngle.current = 0;
  };

  const animate = () => {
    const now = Date.now();
    const deltaTime = Math.min((now - lastUpdate.current) / 16, 2); // Giới hạn delta time để tránh nhảy đột ngột
    lastUpdate.current = now;

    if (isRotating.current) {
      rotationAngle.current += ROTATION_SPEED * deltaTime;
      
      setPositions((prev) => {
        const newPositions = [...prev];
        for (let i = 0; i < BALL_COUNT; i++) {
          const angle = rotationAngle.current + (i * (2 * Math.PI / BALL_COUNT));
          newPositions[i] = {
            x: clickPos.current.x + Math.cos(angle) * ROTATION_RADIUS,
            y: clickPos.current.y + Math.sin(angle) * ROTATION_RADIUS
          };
        }
        return newPositions;
      });

      // Trail xoay theo với độ trễ
      setTrailPositions((prev) => {
        const newTrail = [...prev];
        for (let i = 0; i < TRAIL_COUNT; i++) {
          const angle = rotationAngle.current - (i * 0.2);
          newTrail[i] = {
            x: clickPos.current.x + Math.cos(angle) * (ROTATION_RADIUS * 0.8),
            y: clickPos.current.y + Math.sin(angle) * (ROTATION_RADIUS * 0.8)
          };
        }
        return newTrail;
      });

      // Kết thúc xoay sau 2 vòng
      if (rotationAngle.current >= 4 * Math.PI) {
        isRotating.current = false;
      }
    } else {
      setPositions((prev) => {
        const newPositions = [...prev];
        for (let i = 0; i < BALL_COUNT; i++) {
          const targetPos = i === 0 ? mousePos.current : newPositions[i - 1];
          // Tốc độ giảm dần theo thứ tự viên ngọc
          const speed = BASE_SPEED * (1 - (i * 0.1));
          const dx = targetPos.x - newPositions[i].x;
          const dy = targetPos.y - newPositions[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Áp dụng easing function
          const easedSpeed = easeOutQuad(speed * deltaTime);
          
          newPositions[i] = {
            x: newPositions[i].x + dx * easedSpeed,
            y: newPositions[i].y + dy * easedSpeed
          };
        }
        prevPositions.current = [...newPositions];
        return newPositions;
      });

      // Trail đuổi theo các viên ngọc rồng với độ trễ
      setTrailPositions((prev) => {
        const newTrail = [...prev];
        for (let i = 0; i < TRAIL_COUNT; i++) {
          // Tính toán vị trí mục tiêu dựa trên vị trí của các viên ngọc rồng
          const targetIndex = Math.floor((i / TRAIL_COUNT) * BALL_COUNT);
          const targetPos = prevPositions.current[targetIndex];
          
          const dx = targetPos.x - newTrail[i].x;
          const dy = targetPos.y - newTrail[i].y;
          const speed = TRAIL_SPEED * (1 - (i * 0.08));
          const easedSpeed = easeOutQuad(speed * deltaTime);
          
          newTrail[i] = {
            x: newTrail[i].x + dx * easedSpeed,
            y: newTrail[i].y + dy * easedSpeed
          };
        }
        return newTrail;
      });
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);
    animationRef.current = requestAnimationFrame(animate);
   
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
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
