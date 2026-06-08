import { useState, useEffect } from 'react';

export default function OrderTimer({ expiresAt }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const expires = new Date(expiresAt);
      const diff = expires - now;

      if (diff <= 0) {
        setTimeLeft('00:00');
        setIsExpired(true);
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt) return null;

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono font-bold
        ${isExpired
          ? 'bg-danger-500/15 text-danger-400 border border-danger-500/20'
          : 'bg-warning-500/15 text-warning-400 border border-warning-500/20 animate-pulse-glow'
        }
      `}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {isExpired ? 'Expired' : timeLeft}
    </div>
  );
}
