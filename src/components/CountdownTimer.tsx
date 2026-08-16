'use client';

import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDateStr }: { targetDateStr: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const target = new Date(targetDateStr).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem', background: 'var(--primary-gradient)', color: 'white', borderRadius: '12px', borderTop: '5px solid var(--secondary-color)', boxShadow: '0 10px 30px rgba(0, 161, 216, 0.2)' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.35rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
        <span style={{ color: '#a7f3d0', marginRight: '8px' }}>●</span>
        นับถอยหลังสู่วันเลือกตั้งและประชุมใหญ่สามัญ
      </h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <TimeUnit value={timeLeft.days} label="วัน" />
        <TimeUnit value={timeLeft.hours} label="ชั่วโมง" />
        <TimeUnit value={timeLeft.minutes} label="นาที" />
        <TimeUnit value={timeLeft.seconds} label="วินาที" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255, 255, 255, 0.15)', padding: '1rem 1.5rem', minWidth: '90px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(5px)' }}>
      <span style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1', fontFamily: 'monospace', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
        {value.toString().padStart(2, '0')}
      </span>
      <span style={{ fontSize: '0.9rem', color: '#e0f2fe', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>{label}</span>
    </div>
  );
}
