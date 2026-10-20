import React from 'react';

interface WaterSourceInletProps {
  isFlowing: boolean;
  size: number;
}

export const WaterSourceInlet: React.FC<WaterSourceInletProps> = ({ isFlowing, size }) => {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size * 0.95, height: size }}
      title="Water Source"
    >
      <svg viewBox="0 0 90 90" className="w-full h-full overflow-visible">
        <defs>
          {/* Grey Stone Pipe Gradient */}
          <linearGradient id="sourceStoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="25%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="75%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Red Valve Wheel Gradient */}
          <linearGradient id="redValveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>

          {/* Water gradient */}
          <linearGradient id="sourceWaterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#e0f7fa" />
          </linearGradient>
        </defs>

        {/* 1. Pipe coming from left wall */}
        {/* Wall mounting plate on far left */}
        <rect x="0" y="24" width="10" height="42" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        <circle cx="5" cy="30" r="1.5" fill="#94a3b8" />
        <circle cx="5" cy="60" r="1.5" fill="#94a3b8" />

        {/* Horizontal Grey Stone Supply Pipe */}
        <rect x="10" y="32" width="70" height="26" fill="url(#sourceStoneGrad)" stroke="#0f172a" strokeWidth="2" />
        <line x1="10" y1="34" x2="80" y2="34" stroke="#f8fafc" strokeWidth="1" opacity="0.6" />
        <line x1="38" y1="32" x2="38" y2="58" stroke="#1e293b" strokeWidth="1.5" />
        <path d="M 22 36 L 26 40 L 23 44" stroke="#1e293b" strokeWidth="1.2" fill="none" opacity="0.6" />

        {/* Water Stream inside Supply Pipe */}
        <rect
          x="10"
          y="37"
          width="70"
          height="16"
          fill={isFlowing ? 'url(#sourceWaterGrad)' : '#0f172a'}
          stroke="#0f172a"
          strokeWidth="1"
        />
        {isFlowing && (
          <g>
            <line x1="10" y1="45" x2="80" y2="45" stroke="#ffffff" strokeWidth="3" className="water-flow-stream" />
            <circle cx="38" cy="45" r="2.5" fill="#e0f7fa" className="animate-pulse" />
          </g>
        )}

        {/* 2. Red Valve Stem & Turn Wheel (as seen in screenshot) */}
        {/* Vertical valve neck stem */}
        <rect x="32" y="16" width="12" height="16" fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
        <rect x="30" y="14" width="16" height="4" rx="1" fill="#475569" stroke="#0f172a" strokeWidth="1" />

        {/* Circular Red Turn-Wheel Handle */}
        <g className="transition-transform duration-500 hover:rotate-45 origin-[38px_10px]">
          {/* Wheel rim */}
          <circle cx="38" cy="10" r="12" fill="none" stroke="url(#redValveGrad)" strokeWidth="4" />
          <circle cx="38" cy="10" r="12" fill="none" stroke="#7f1d1d" strokeWidth="1" />
          {/* Wheel hub center */}
          <circle cx="38" cy="10" r="4.5" fill="url(#redValveGrad)" stroke="#7f1d1d" strokeWidth="1" />
          <circle cx="38" cy="10" r="2" fill="#fde047" />
          {/* Spokes */}
          <line x1="26" y1="10" x2="50" y2="10" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="38" y1="-2" x2="38" y2="22" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* 3. Right Flange Collar touching the grid entrance directly at x=90 */}
        <rect x="80" y="27" width="10" height="36" rx="2.5" fill="url(#sourceStoneGrad)" stroke="#0f172a" strokeWidth="2" />
        <circle cx="85" cy="33" r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
        <circle cx="85" cy="57" r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
      </svg>
    </div>
  );
};
