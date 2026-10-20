import React from 'react';

interface TreeRescueAnimationProps {
  isWatering: boolean;
  isSaved: boolean;
  waterReached: boolean;
  levelId: number;
}

export const TreeRescueAnimation: React.FC<TreeRescueAnimationProps> = ({
  isWatering,
  isSaved,
  waterReached,
  levelId,
}) => {
  const hasApples = levelId >= 6;
  const hasBlossoms = levelId >= 3;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2 select-none">
      {/* Container with ample space for the large tree */}
      <div className="relative w-48 sm:w-56 h-40 sm:h-44 flex items-end justify-center">
        {/* Grassy / Soil Base Platform */}
        <div
          className={`absolute bottom-0 w-44 sm:w-52 h-6 rounded-full transition-colors duration-1000 shadow-md ${
            isSaved
              ? 'bg-gradient-to-r from-emerald-950 via-lime-900 to-emerald-950 border-t-2 border-lime-400/60 shadow-[0_0_20px_rgba(132,204,22,0.3)]'
              : 'bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 border-t border-amber-800/40'
          }`}
        />

        {/* Thirsty Soil Cracks (Visible before watering) */}
        {!isSaved && (
          <div className="absolute bottom-2 inset-x-12 flex justify-around opacity-60">
            <span className="text-xs text-amber-600 font-bold">⚡</span>
            <span className="text-xs text-amber-600 font-bold">⚡</span>
            <span className="text-xs text-amber-600 font-bold">⚡</span>
          </div>
        )}

        {/* Tree SVG Illustration */}
        <svg
          viewBox="0 0 200 180"
          className="w-44 sm:w-52 h-40 sm:h-44 z-10 transition-all duration-700 overflow-visible"
        >
          <defs>
            {/* Healthy Wood Trunk Gradient */}
            <linearGradient id="healthyTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="35%" stopColor="#92400e" />
              <stop offset="70%" stopColor="#a16207" />
              <stop offset="100%" stopColor="#582405" />
            </linearGradient>

            {/* Dry Withering Trunk Gradient */}
            <linearGradient id="dryTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="40%" stopColor="#573016" />
              <stop offset="80%" stopColor="#6d3c1a" />
              <stop offset="100%" stopColor="#3b1b04" />
            </linearGradient>

            {/* Lush Vibrant Foliage Gradient */}
            <radialGradient id="leafGradMain" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="35%" stopColor="#22c55e" />
              <stop offset="80%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#14532d" />
            </radialGradient>

            {/* Dry Shriveled Foliage Gradient */}
            <radialGradient id="dryLeafGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="60%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>

            {/* Root Absorption Blue Glow */}
            <radialGradient id="rootMoisture" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Root Water Moisture Absorption Glow */}
          {(isWatering || isSaved) && (
            <ellipse
              cx="100"
              cy="165"
              rx="65"
              ry="16"
              fill="url(#rootMoisture)"
              className="animate-pulse"
            />
          )}

          {/* Visible Spreading Roots */}
          <g>
            <path
              d="M 85 155 Q 60 168 35 168 M 115 155 Q 140 168 165 168 M 100 155 Q 100 174 105 174"
              stroke={isSaved ? '#92400e' : '#573016'}
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 92 155 Q 75 165 55 170 M 108 155 Q 125 165 145 170"
              stroke={isSaved ? '#78350f' : '#451a03'}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Visible Sturdy Wooden Trunk */}
          <path
            d="M 82 160 C 82 120 72 100 70 85 L 130 85 C 128 100 118 120 118 160 Z"
            fill={isSaved ? 'url(#healthyTrunk)' : 'url(#dryTrunk)'}
            stroke="#2e1403"
            strokeWidth="3"
          />

          {/* Bark texture & hollow details */}
          <path
            d="M 94 150 Q 96 115 90 95 M 106 150 Q 104 120 110 95"
            stroke={isSaved ? '#78350f' : '#3b1b04'}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />

          {/* Multiple Spreading Branches */}
          <g>
            {/* Left Main Branch & Sub-branches */}
            <path
              d="M 80 95 C 65 85 45 75 32 60 M 52 75 C 40 65 30 50 25 35"
              stroke={isSaved ? '#92400e' : '#573016'}
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* Center Branch Limb */}
            <path
              d="M 98 85 L 98 45 M 102 85 L 105 40"
              stroke={isSaved ? '#92400e' : '#573016'}
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Main Branch & Sub-branches */}
            <path
              d="M 120 95 C 135 85 155 75 168 60 M 148 75 C 160 65 170 50 175 35"
              stroke={isSaved ? '#92400e' : '#573016'}
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* ========================================================== */}
          {/* FOLIAGE CROWN (Dry before watering vs Lush Green after)     */}
          {/* ========================================================== */}
          {isSaved ? (
            /* LUSH VIBRANT CARTOON FOLIAGE CROWN */
            <g className="transition-all duration-700 ease-out animate-float">
              {/* Back foliage mass for depth */}
              <circle cx="100" cy="50" r="48" fill="#14532d" />
              <circle cx="55" cy="55" r="36" fill="#14532d" />
              <circle cx="145" cy="55" r="36" fill="#14532d" />

              {/* Main leafy cloud clusters */}
              <circle cx="100" cy="46" r="44" fill="url(#leafGradMain)" stroke="#14532d" strokeWidth="3" />
              <circle cx="58" cy="56" r="32" fill="url(#leafGradMain)" stroke="#14532d" strokeWidth="3" />
              <circle cx="142" cy="56" r="32" fill="url(#leafGradMain)" stroke="#14532d" strokeWidth="3" />
              <circle cx="78" cy="30" r="28" fill="url(#leafGradMain)" stroke="#14532d" strokeWidth="2.5" />
              <circle cx="122" cy="30" r="28" fill="url(#leafGradMain)" stroke="#14532d" strokeWidth="2.5" />
              <circle cx="100" cy="22" r="26" fill="url(#leafGradMain)" stroke="#14532d" strokeWidth="2" />

              {/* Foliage Highlights */}
              <ellipse cx="90" cy="34" rx="20" ry="12" fill="#bbf7d0" opacity="0.45" />
              <ellipse cx="55" cy="48" rx="14" ry="8" fill="#bbf7d0" opacity="0.4" />
              <ellipse cx="140" cy="48" rx="14" ry="8" fill="#bbf7d0" opacity="0.4" />

              {/* Cherry blossoms / Pink flowers */}
              {hasBlossoms && (
                <g className="animate-pulse">
                  <circle cx="52" cy="45" r="5" fill="#f472b6" />
                  <circle cx="52" cy="45" r="2" fill="#fef08a" />
                  <circle cx="148" cy="48" r="5" fill="#f472b6" />
                  <circle cx="148" cy="48" r="2" fill="#fef08a" />
                  <circle cx="100" cy="24" r="5.5" fill="#f472b6" />
                  <circle cx="100" cy="24" r="2.5" fill="#fef08a" />
                  <circle cx="82" cy="62" r="4.5" fill="#f472b6" />
                  <circle cx="82" cy="62" r="2" fill="#fef08a" />
                  <circle cx="118" cy="62" r="4.5" fill="#f472b6" />
                  <circle cx="118" cy="62" r="2" fill="#fef08a" />
                </g>
              )}

              {/* Shiny Red Apples */}
              {hasApples && (
                <g>
                  <circle cx="70" cy="42" r="6" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
                  <circle cx="68" cy="40" r="1.5" fill="#fca5a5" />
                  <circle cx="130" cy="40" r="6" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
                  <circle cx="128" cy="38" r="1.5" fill="#fca5a5" />
                  <circle cx="100" cy="55" r="6.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
                  <circle cx="98" cy="53" r="1.5" fill="#fca5a5" />
                </g>
              )}

              {/* Magical Sparkles around Saved Tree */}
              <g className="animate-pulse">
                <polygon points="32,22 34,27 39,28 34,29 32,34 30,29 25,28 30,27" fill="#fef08a" />
                <polygon points="168,22 170,27 175,28 170,29 168,34 166,29 161,28 166,27" fill="#fef08a" />
                <polygon points="100,5 102,9 106,10 102,11 100,15 98,11 94,10 98,9" fill="#86efac" />
              </g>
            </g>
          ) : (
            /* DRY WITHERED BROWN TREE CROWN */
            <g className="transition-all duration-500">
              {/* Shriveled small dry foliage clumps */}
              <circle cx="100" cy="52" r="20" fill="url(#dryLeafGrad)" opacity="0.6" />
              <circle cx="48" cy="58" r="14" fill="url(#dryLeafGrad)" opacity="0.5" />
              <circle cx="152" cy="58" r="14" fill="url(#dryLeafGrad)" opacity="0.5" />

              {/* Falling dry brown leaves */}
              <ellipse cx="65" cy="110" rx="3" ry="6" fill="#b45309" transform="rotate(25 65 110)" />
              <ellipse cx="135" cy="120" rx="4" ry="7" fill="#92400e" transform="rotate(-30 135 120)" />
              <ellipse cx="45" cy="140" rx="3.5" ry="5.5" fill="#78350f" transform="rotate(45 45 140)" />
            </g>
          )}
        </svg>

        {/* High-Pressure Water Stream pouring into soil/roots */}
        {(isWatering || (waterReached && !isSaved)) && (
          <div className="absolute -left-8 bottom-3 w-40 h-28 pointer-events-none z-20">
            <svg viewBox="0 0 160 100" className="w-full h-full overflow-visible">
              <path
                d="M 0 45 Q 60 5, 110 82"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="10"
                strokeLinecap="round"
                className="water-flow-stream"
              />
              <path
                d="M 0 45 Q 60 5, 110 82"
                fill="none"
                stroke="#bae6fd"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="110" cy="82" r="7" fill="#38bdf8" className="animate-ping" />
              <circle cx="118" cy="86" r="4.5" fill="#bae6fd" className="animate-ping delay-100" />
            </svg>
          </div>
        )}
      </div>

      {/* Status banner under tree */}
      <div className="mt-1 text-center">
        {isSaved ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-500/20 border border-lime-400 text-lime-300 font-black text-xs tracking-wider uppercase animate-bounce">
            <span>🌿</span> TREE SAVED!
          </div>
        ) : isWatering ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400 text-sky-300 font-bold text-xs tracking-wider animate-pulse">
            <span>💧</span> Watering Roots...
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs tracking-wider">
            <span className="animate-pulse">🥀</span> Dry & Thirsty Tree!
          </div>
        )}
      </div>
    </div>
  );
};
