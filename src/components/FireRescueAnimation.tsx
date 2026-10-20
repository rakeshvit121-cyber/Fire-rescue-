import React from 'react';

interface FireRescueAnimationProps {
  isExtinguishing: boolean;
  isExtinguished: boolean;
  waterReached: boolean;
}

export const FireRescueAnimation: React.FC<FireRescueAnimationProps> = ({
  isExtinguishing,
  isExtinguished,
  waterReached,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 select-none">
      {/* Container with ground */}
      <div className="relative w-48 sm:w-56 h-40 sm:h-44 flex items-end justify-center">
        {/* Ground platform */}
        <div className="absolute bottom-0 w-44 sm:w-52 h-5 bg-gradient-to-r from-stone-900 via-slate-800 to-stone-900 rounded-full border-t border-slate-700/60" />

        {/* Rising Smoke clouds before extinguished */}
        {!isExtinguished && (
          <div className="absolute top-1 left-8 right-8 flex justify-around pointer-events-none">
            <div className="w-8 h-8 rounded-full bg-slate-600/50 blur-sm animate-ping duration-1000" />
            <div className="w-11 h-11 rounded-full bg-slate-700/60 blur-sm animate-pulse -mt-3" />
            <div className="w-7 h-7 rounded-full bg-slate-500/40 blur-sm animate-ping delay-200" />
          </div>
        )}

        {/* Dark Teal Building SVG */}
        <svg
          viewBox="0 0 160 140"
          className="w-44 sm:w-52 h-40 sm:h-44 z-10 transition-transform duration-500 overflow-visible"
        >
          <defs>
            {/* Dark Teal House Wall Gradient */}
            <linearGradient id="tealHouseWall" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isExtinguished ? '#14b8a6' : '#0d9488'} />
              <stop offset="40%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#115e59" />
            </linearGradient>

            {/* Dark Slate Roof Gradient */}
            <linearGradient id="darkRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Chimney Gradient */}
            <linearGradient id="chimneyTeal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Silver-Blue Pipe Collar Gradient */}
            <linearGradient id="housePipeRing" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* Chimney */}
          <rect x="105" y="18" width="18" height="32" rx="2" fill="url(#chimneyTeal)" stroke="#0f172a" strokeWidth="2" />
          <rect x="102" y="16" width="24" height="6" rx="1.5" fill="#64748b" stroke="#0f172a" strokeWidth="1" />

          {/* Main Dark Roof */}
          <polygon
            points="80,15 15,62 145,62"
            fill="url(#darkRoofGrad)"
            stroke="#020617"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Roof Ridge & Trim */}
          <line x1="12" y1="62" x2="148" y2="62" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
          <line x1="80" y1="15" x2="80" y2="62" stroke="#475569" strokeWidth="2" opacity="0.6" />

          {/* Main Dark Teal House Body */}
          <rect
            x="30"
            y="62"
            width="100"
            height="68"
            fill="url(#tealHouseWall)"
            stroke="#042f2e"
            strokeWidth="3.5"
            rx="5"
          />

          {/* Architectural Clapboard Siding Lines */}
          <line x1="30" y1="78" x2="130" y2="78" stroke="#042f2e" strokeWidth="1" opacity="0.6" />
          <line x1="30" y1="94" x2="130" y2="94" stroke="#042f2e" strokeWidth="1" opacity="0.6" />
          <line x1="30" y1="110" x2="130" y2="110" stroke="#042f2e" strokeWidth="1" opacity="0.6" />

          {/* Main Entrance Door */}
          <rect
            x="66"
            y="88"
            width="28"
            height="42"
            rx="3"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="2.5"
          />
          <circle cx="88" cy="110" r="3" fill="#fde047" stroke="#713f12" strokeWidth="1" />

          {/* Left Window */}
          <rect
            x="38"
            y="74"
            width="20"
            height="22"
            rx="3"
            fill={isExtinguished ? '#67e8f9' : '#fed7aa'}
            stroke="#0f172a"
            strokeWidth="2.5"
          />
          <line x1="48" y1="74" x2="48" y2="96" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="38" y1="85" x2="58" y2="85" stroke="#0f172a" strokeWidth="1.5" />

          {/* Right Window */}
          <rect
            x="102"
            y="74"
            width="20"
            height="22"
            rx="3"
            fill={isExtinguished ? '#67e8f9' : '#fed7aa'}
            stroke="#0f172a"
            strokeWidth="2.5"
          />
          <line x1="112" y1="74" x2="112" y2="96" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="102" y1="85" x2="122" y2="85" stroke="#0f172a" strokeWidth="1.5" />

          {/* Attics Dormer / Round Window */}
          <circle cx="80" cy="42" r="10" fill={isExtinguished ? '#67e8f9' : '#fdba74'} stroke="#0f172a" strokeWidth="2.5" />
          <line x1="70" y1="42" x2="90" y2="42" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="80" y1="32" x2="80" y2="52" stroke="#0f172a" strokeWidth="1.5" />

          {/* Pipe Connection leading into the house from the left */}
          <g>
            <rect x="12" y="100" width="22" height="14" fill="#0f766e" stroke="#042f2e" strokeWidth="2" rx="2" />
            <rect x="26" y="97" width="6" height="20" fill="url(#housePipeRing)" stroke="#1e293b" strokeWidth="1.5" rx="1.5" />
            <circle cx="29" cy="101" r="1.2" fill="#ffffff" />
            <circle cx="29" cy="113" r="1.2" fill="#ffffff" />
            {/* Water pipe riser going up side of house */}
            <rect x="22" y="55" width="10" height="47" fill="#0f766e" stroke="#042f2e" strokeWidth="1.5" />
            {/* Sprinkler nozzle head pointing onto roof */}
            <path d="M 22 55 L 36 45 L 38 52 Z" fill="#94a3b8" stroke="#1e293b" strokeWidth="1.5" />
          </g>

          {/* Safe sparkles on house when extinguished */}
          {isExtinguished && (
            <g className="animate-pulse">
              <polygon points="80,5 83,11 89,12 84,15 85,21 80,18 75,21 76,15 71,12 77,11" fill="#fde047" />
              <polygon points="25,40 27,44 31,45 28,47 29,51 25,48 21,51 22,47 19,45 23,44" fill="#67e8f9" />
              <polygon points="135,40 137,44 141,45 138,47 139,51 135,48 131,51 132,47 129,45 133,44" fill="#67e8f9" />
            </g>
          )}
        </svg>

        {/* Animated Layered Fire Flames */}
        {!isExtinguished && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center items-end pointer-events-none">
            {/* Center Roof Flame */}
            <div
              className={`absolute -top-12 transition-all duration-700 ${
                isExtinguishing ? 'scale-0 opacity-0' : 'animate-flame opacity-95'
              }`}
            >
              <svg viewBox="0 0 50 65" className="w-14 h-16">
                <path
                  d="M25 0 C32 20 48 30 48 46 C48 58 38 65 25 65 C12 65 2 58 2 46 C2 30 18 20 25 0 Z"
                  fill="#dc2626"
                />
                <path
                  d="M25 15 C30 26 40 34 40 46 C40 54 34 58 25 58 C16 58 10 54 10 46 C10 34 20 26 25 15 Z"
                  fill="#f97316"
                />
                <path
                  d="M25 30 C28 36 33 42 33 48 C33 52 30 54 25 54 C20 54 17 52 17 48 C17 42 22 36 25 30 Z"
                  fill="#fde047"
                />
              </svg>
            </div>

            {/* Left Roof Flame */}
            <div
              className={`absolute left-8 bottom-8 transition-all duration-700 ${
                isExtinguishing ? 'scale-0 opacity-0' : 'animate-flame opacity-90'
              }`}
              style={{ animationDelay: '0.15s' }}
            >
              <svg viewBox="0 0 40 50" className="w-10 h-12">
                <path
                  d="M20 0 C26 16 38 24 38 36 C38 46 30 50 20 50 C10 50 2 46 2 36 C2 24 14 16 20 0 Z"
                  fill="#ef4444"
                />
                <path
                  d="M20 12 C24 22 32 28 32 36 C32 43 27 46 20 46 C13 46 8 43 8 36 C8 28 16 22 20 12 Z"
                  fill="#fbbf24"
                />
              </svg>
            </div>

            {/* Right Roof Flame */}
            <div
              className={`absolute right-8 bottom-8 transition-all duration-700 ${
                isExtinguishing ? 'scale-0 opacity-0' : 'animate-flame opacity-90'
              }`}
              style={{ animationDelay: '0.3s' }}
            >
              <svg viewBox="0 0 40 50" className="w-10 h-12">
                <path
                  d="M20 0 C26 16 38 24 38 36 C38 46 30 50 20 50 C10 50 2 46 2 36 C2 24 14 16 20 0 Z"
                  fill="#dc2626"
                />
                <path
                  d="M20 12 C24 22 32 28 32 36 C32 43 27 46 20 46 C13 46 8 43 8 36 C8 28 16 22 20 12 Z"
                  fill="#f97316"
                />
              </svg>
            </div>
          </div>
        )}

        {/* High-Pressure Sprinkler Water Stream Spray onto House Roof */}
        {(isExtinguishing || (waterReached && !isExtinguished)) && (
          <div className="absolute -left-8 bottom-6 w-44 h-32 pointer-events-none z-20">
            <svg viewBox="0 0 160 120" className="w-full h-full overflow-visible">
              <path
                d="M 10 90 Q 70 15, 125 45"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="11"
                strokeLinecap="round"
                className="water-flow-stream"
              />
              <path
                d="M 10 90 Q 70 15, 125 45"
                fill="none"
                stroke="#bae6fd"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="125" cy="45" r="7" fill="#bae6fd" className="animate-ping" />
              <circle cx="135" cy="40" r="4.5" fill="#38bdf8" className="animate-ping delay-100" />
              <circle cx="118" cy="52" r="5.5" fill="#e0f2fe" className="animate-ping delay-200" />
            </svg>
          </div>
        )}
      </div>

      {/* Status banner under house */}
      <div className="mt-1 text-center">
        {isExtinguished ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-black text-xs tracking-wider uppercase animate-bounce">
            <span>🛡️</span> FIRE EXTINGUISHED!
          </div>
        ) : isExtinguishing ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400 text-sky-300 font-bold text-xs tracking-wider animate-pulse">
            <span>💧</span> Spraying Water on Fire...
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs tracking-wider">
            <span className="animate-pulse">🔥</span> Dark Teal House on Fire!
          </div>
        )}
      </div>
    </div>
  );
};
