import React, { useMemo } from 'react';
import './App.css';

const BabyRain = () => {
  const babies = useMemo(() => {
    const icons = ['👶', '🍼', '🧸', '👣', '👶🏻', '👶🏼', '👶🏽'];
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      left: Math.random() * 100 + '%',
      duration: 5 + Math.random() * 10 + 's',
      delay: Math.random() * 10 + 's',
      size: 1 + Math.random() * 2 + 'rem'
    }));
  }, []);

  return (
    <div className="baby-rain">
      {babies.map((baby) => (
        <div
          key={baby.id}
          className="falling-baby"
          style={{
            left: baby.left,
            animationDuration: baby.duration,
            animationDelay: baby.delay,
            fontSize: baby.size
          }}
        >
          {baby.icon}
        </div>
      ))}
    </div>
  );
};

export default BabyRain;
