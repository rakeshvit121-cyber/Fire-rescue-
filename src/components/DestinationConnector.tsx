import React from 'react';
import { GameMode } from '../types/game';

interface DestinationConnectorProps {
  mode: GameMode;
  hasWater: boolean;
  isExtinguishedOrSaved: boolean;
  size: number;
}

export const DestinationConnector: React.FC<DestinationConnectorProps> = ({
  mode,
  hasWater,
  isExtinguishedOrSaved,
  size,
}) => {
  const isFire = mode === 'fire';
  const width = size * 1.5;
  const height = size;

  return (
    <div
      className="relative flex items-center justify-start select-none"
      style={{ width, height }}
      title={isFire ? 'Destination: Burning House' : 'Destination: Potted Plant'}
    >
      <svg viewBox="0 0 150 100" className="w-full h-full overflow-visible">
        <defs>
          {/* Grey Stone Pipe Gradient */}
          <linearGradient id="destStoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="25%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="75%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Water gradient */}
          <linearGradient id="destWaterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#00b0ff" />
            <stop offset="100%" stopColor="#e0f7fa" />
          </linearGradient>

          {/* Terracotta Plant Pot Gradient */}
          <linearGradient id="terracottaPot" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9a3412" />
            <stop offset="35%" stopColor="#ea580c" />
            <stop offset="70%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>

          {/* Vibrant Plant Foliage Gradient */}
          <linearGradient id="plantLeafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="40%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          {/* Dark Teal House Wall Gradient matching reference image */}
          <linearGradient id="houseTealWall" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isExtinguishedOrSaved ? '#14b8a6' : '#0d9488'} />
            <stop offset="40%" stopColor="#0f766e" />
            <stop offset="100%" stopColor="#115e59" />
          </linearGradient>

          {/* Dark Slate Roof Gradient */}
          <linearGradient id="houseDarkRoof" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Chimney Gradient */}
          <linearGradient id="houseChimney" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>

        {/* 1. Pipe Receiving Flange Collar from Grid */}
        <g>
          {/* Flange Collar touching the grid tile directly at x=0 (matching PipePiece ringWidth 44) */}
          <rect x="0" y="28" width="10" height="44" rx="2.5" fill="url(#destStoneGrad)" stroke="#0f172a" strokeWidth="2" />
          <line x1="2" y1="28" x2="2" y2="72" stroke="#f8fafc" strokeWidth="1" opacity="0.6" />
          <circle cx="5" cy="36" r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
          <circle cx="5" cy="64" r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />

          {/* Conduit pipe body entering destination (height 36 matching PipePiece w 36) */}
          <rect x="10" y="32" width="22" height="36" fill="url(#destStoneGrad)" stroke="#0f172a" strokeWidth="2" />
          <line x1="10" y1="34" x2="32" y2="34" stroke="#f8fafc" strokeWidth="1" opacity="0.5" />
          <path d="M 16 38 L 20 44 L 17 50" stroke="#1e293b" strokeWidth="1.2" fill="none" opacity="0.6" />

          {/* Water channel inside connector (height 20 matching PipePiece innerW 20) */}
          <rect
            x="10"
            y="40"
            width="22"
            height="20"
            fill={hasWater ? 'url(#destWaterGrad)' : '#0f172a'}
            stroke="#0f172a"
            strokeWidth="1"
          />

          {/* Flowing water stream */}
          {hasWater && (
            <g>
              <line x1="10" y1="50" x2="32" y2="50" stroke="#ffffff" strokeWidth="4" className="water-flow-stream" />
              <circle cx="21" cy="50" r="2.5" fill="#e0f7fa" className="animate-pulse" />
            </g>
          )}

          {/* Pipe spout nozzle aimed at the destination */}
          <path d="M 32 32 L 44 38 L 44 62 L 32 68 Z" fill="url(#destStoneGrad)" stroke="#0f172a" strokeWidth="2" />
        </g>

        {/* High-Pressure Sprinkler Water Spray from nozzle to destination when water arrives */}
        {hasWater && (
          <g>
            {/* Primary curved water stream aimed at burning roof or plant */}
            <path
              d={isFire ? "M 44 50 Q 64 20, 82 28" : "M 44 50 Q 56 46, 68 56"}
              fill="none"
              stroke="#00e5ff"
              strokeWidth={isFire ? "6.5" : "5"}
              strokeLinecap="round"
              className="water-flow-stream"
            />
            {/* Secondary stream spraying over chimney and attic */}
            {isFire && (
              <path
                d="M 44 50 Q 70 12, 98 22"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeLinecap="round"
                className="water-flow-stream"
                opacity="0.85"
              />
            )}
            {/* High-velocity inner core */}
            <path
              d={isFire ? "M 44 50 Q 64 20, 82 28" : "M 44 50 Q 56 46, 68 56"}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Spray impact ripples & droplets */}
            <circle cx={isFire ? 82 : 68} cy={isFire ? 28 : 56} r="4.5" fill="#e0f7fa" className="animate-ping" />
            <circle cx={isFire ? 94 : 72} cy={isFire ? 24 : 52} r="3" fill="#38bdf8" className="animate-ping delay-100" />
            <circle cx={isFire ? 76 : 64} cy={isFire ? 34 : 60} r="2.5" fill="#ffffff" className="animate-ping delay-200" />

            {/* Billowing steam clouds when water hits fire */}
            {isFire && (
              <g className="animate-pulse">
                <circle cx="82" cy="22" r="7" fill="#cbd5e1" opacity="0.5" />
                <circle cx="92" cy="16" r="9" fill="#e2e8f0" opacity="0.4" />
                <circle cx="74" cy="18" r="6" fill="#f1f5f9" opacity="0.45" />
              </g>
            )}
          </g>
        )}

        {/* 2. Destination Object Graphics: Potted Plant (Tree Mode) vs House (Fire Mode) */}
        {!isFire ? (
          /* CUTE POTTED PLANT AS IN REFERENCE SCREENSHOT */
          <g transform="translate(62, 10)">
            {/* Ground shadow beneath pot */}
            <ellipse cx="44" cy="85" rx="36" ry="6" fill="#0f172a" opacity="0.6" />

            {/* Clay / Terracotta Pot */}
            {/* Pot rim collar */}
            <rect x="22" y="58" width="44" height="8" rx="2" fill="url(#terracottaPot)" stroke="#431407" strokeWidth="1.5" />
            <line x1="24" y1="60" x2="64" y2="60" stroke="#fdba74" strokeWidth="1" opacity="0.6" />

            {/* Pot tapered body */}
            <polygon points="26,66 62,66 56,84 32,84" fill="url(#terracottaPot)" stroke="#431407" strokeWidth="1.5" />
            <line x1="28" y1="68" x2="34" y2="82" stroke="#fdba74" strokeWidth="1" opacity="0.5" />

            {/* Soil mound */}
            <ellipse cx="44" cy="58" rx="18" ry="4" fill="#3e2723" stroke="#1c1917" strokeWidth="1" />

            {/* Illustrated Plant Foliage matching screenshot */}
            {isExtinguishedOrSaved || hasWater ? (
              /* BLOOMING HEALTHY PLANT (WATERED) */
              <g className="animate-float origin-bottom">
                {/* Lush cyan/green leaves clusters */}
                <ellipse cx="32" cy="46" rx="14" ry="10" fill="url(#plantLeafGrad)" stroke="#14532d" strokeWidth="1.5" transform="rotate(-25 32 46)" />
                <ellipse cx="56" cy="46" rx="14" ry="10" fill="url(#plantLeafGrad)" stroke="#14532d" strokeWidth="1.5" transform="rotate(25 56 46)" />
                <ellipse cx="44" cy="38" rx="16" ry="12" fill="url(#plantLeafGrad)" stroke="#14532d" strokeWidth="1.5" />
                <ellipse cx="44" cy="28" rx="12" ry="9" fill="#86efac" opacity="0.7" />

                {/* Stems */}
                <path d="M 44 56 Q 44 32 44 20" stroke="#15803d" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M 44 45 Q 60 38 68 28" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                {/* Cute Cartoon Flower (as in reference image) */}
                <g transform="translate(68, 26)">
                  {/* Pink flower petals */}
                  <circle cx="0" cy="-6" r="4.5" fill="#f43f5e" />
                  <circle cx="6" cy="-2" r="4.5" fill="#f43f5e" />
                  <circle cx="4" cy="5" r="4.5" fill="#f43f5e" />
                  <circle cx="-4" cy="5" r="4.5" fill="#f43f5e" />
                  <circle cx="-6" cy="-2" r="4.5" fill="#f43f5e" />
                  {/* Yellow center eye */}
                  <circle cx="0" cy="0" r="4" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
                  <circle cx="-1" cy="-1" r="1.2" fill="#ffffff" />
                </g>

                {/* Sparkles around healthy plant */}
                <g className="animate-pulse">
                  <polygon points="18,32 19,35 22,36 19,37 18,40 17,37 14,36 17,35" fill="#fef08a" />
                  <polygon points="50,12 51,15 54,16 51,17 50,20 49,17 46,16 49,15" fill="#67e8f9" />
                </g>
              </g>
            ) : (
              /* THIRSTY DRY PLANT BEFORE WATERING */
              <g>
                {/* Thin bare stems with drooping withered leaves */}
                <path d="M 44 56 Q 42 42 36 34" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 44 48 Q 54 42 60 36" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
                <ellipse cx="34" cy="38" rx="7" ry="4" fill="#92400e" transform="rotate(-30 34 38)" />
                <ellipse cx="58" cy="40" rx="7" ry="4" fill="#92400e" transform="rotate(30 58 40)" />

                {/* Drooping unbloomed bud */}
                <circle cx="60" cy="36" r="3.5" fill="#b45309" stroke="#78350f" strokeWidth="0.8" />
              </g>
            )}

            {/* Label Pip */}
            <rect x="24" y="86" width="40" height="7" rx="3.5" fill={isExtinguishedOrSaved ? '#065f46' : hasWater ? '#0369a1' : '#78350f'} />
            <text x="44" y="91" fill="#ffffff" fontSize="5" fontWeight="900" textAnchor="middle">
              {isExtinguishedOrSaved ? 'BLOOMING' : hasWater ? 'WATERED' : 'THIRSTY'}
            </text>
          </g>
        ) : (
          /* FIRE RESCUE: DARK TEAL HOUSE WITH ANIMATED FLAMES, SMOKE & WATER SPRAY */
          <g transform="translate(56, 4)">
            {/* Ground shadow beneath house */}
            <ellipse cx="45" cy="89" rx="42" ry="5" fill="#0f172a" opacity="0.6" />

            {/* Rising smoke puffs curling from roof before extinguished */}
            {!isExtinguishedOrSaved && (
              <g className="animate-pulse opacity-70">
                <circle cx="68" cy="6" r="5" fill="#64748b" opacity="0.5" />
                <circle cx="75" cy="1" r="7" fill="#475569" opacity="0.4" />
                <circle cx="48" cy="4" r="6" fill="#64748b" opacity="0.4" />
              </g>
            )}

            {/* Chimney on the roof */}
            <rect x="65" y="10" width="12" height="18" rx="1.5" fill="url(#houseChimney)" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="63" y="8" width="16" height="4" rx="1" fill="#64748b" stroke="#0f172a" strokeWidth="1" />

            {/* Dark Slate Peaked Roof */}
            <polygon
              points="45,10 6,38 84,38"
              fill="url(#houseDarkRoof)"
              stroke="#020617"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Roof Ridge & Trim */}
            <line x1="4" y1="38" x2="86" y2="38" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            <line x1="45" y1="10" x2="45" y2="38" stroke="#475569" strokeWidth="1.5" opacity="0.6" />

            {/* Main Dark Teal House Body */}
            <rect
              x="14"
              y="38"
              width="62"
              height="46"
              rx="3"
              fill="url(#houseTealWall)"
              stroke="#042f2e"
              strokeWidth="2.5"
            />

            {/* Architectural Clapboard Siding Lines */}
            <line x1="14" y1="48" x2="76" y2="48" stroke="#042f2e" strokeWidth="1" opacity="0.5" />
            <line x1="14" y1="58" x2="76" y2="58" stroke="#042f2e" strokeWidth="1" opacity="0.5" />
            <line x1="14" y1="68" x2="76" y2="68" stroke="#042f2e" strokeWidth="1" opacity="0.5" />
            <line x1="14" y1="76" x2="76" y2="76" stroke="#042f2e" strokeWidth="1" opacity="0.5" />

            {/* Entrance Door */}
            <rect
              x="37"
              y="54"
              width="16"
              height="30"
              rx="2"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="1.8"
            />
            {/* Golden doorknob */}
            <circle cx="49" cy="70" r="1.5" fill="#facc15" stroke="#713f12" strokeWidth="0.5" />

            {/* Left Window */}
            <rect
              x="20"
              y="46"
              width="13"
              height="15"
              rx="2"
              fill={isExtinguishedOrSaved ? '#67e8f9' : '#fb923c'}
              stroke="#0f172a"
              strokeWidth="1.8"
            />
            <line x1="26.5" y1="46" x2="26.5" y2="61" stroke="#0f172a" strokeWidth="1" />
            <line x1="20" y1="53.5" x2="33" y2="53.5" stroke="#0f172a" strokeWidth="1" />

            {/* Right Window */}
            <rect
              x="57"
              y="46"
              width="13"
              height="15"
              rx="2"
              fill={isExtinguishedOrSaved ? '#67e8f9' : '#fb923c'}
              stroke="#0f172a"
              strokeWidth="1.8"
            />
            <line x1="63.5" y1="46" x2="63.5" y2="61" stroke="#0f172a" strokeWidth="1" />
            <line x1="57" y1="53.5" x2="70" y2="53.5" stroke="#0f172a" strokeWidth="1" />

            {/* Attic Dormer Round Window */}
            <circle
              cx="45"
              cy="26"
              r="6.5"
              fill={isExtinguishedOrSaved ? '#67e8f9' : '#fdba74'}
              stroke="#0f172a"
              strokeWidth="1.8"
            />
            <line x1="38.5" y1="26" x2="51.5" y2="26" stroke="#0f172a" strokeWidth="1" />
            <line x1="45" y1="19.5" x2="45" y2="32.5" stroke="#0f172a" strokeWidth="1" />

            {/* Layered Animated Flames (Exact in Reference Image) */}
            {!isExtinguishedOrSaved ? (
              <g className={`transition-all duration-500 ${hasWater ? 'scale-75 opacity-60' : 'opacity-100'}`}>
                {/* Center Peak Flame */}
                <g className="animate-flame origin-bottom">
                  <path
                    d="M 45 4 C 50 12 55 16 55 24 C 55 29 50 33 45 33 C 40 33 35 29 35 24 C 35 16 41 12 45 4 Z"
                    fill="#ef4444"
                  />
                  <path
                    d="M 45 10 C 48 16 52 20 52 25 C 52 28 49 31 45 31 C 41 31 38 28 38 25 C 38 20 42 16 45 10 Z"
                    fill="#f97316"
                  />
                  <path
                    d="M 45 16 C 47 20 49 23 49 26 C 49 28 47 29 45 29 C 43 29 41 28 41 26 C 41 23 43 20 45 16 Z"
                    fill="#fde047"
                  />
                </g>

                {/* Left Roof Flame */}
                <g className="animate-flame origin-bottom" style={{ animationDelay: '0.15s' }}>
                  <path
                    d="M 22 22 C 26 28 30 31 30 36 C 30 39 26 41 22 41 C 18 41 15 39 15 36 C 15 31 19 28 22 22 Z"
                    fill="#ef4444"
                  />
                  <path
                    d="M 22 26 C 24 30 27 32 27 35 C 27 37 25 39 22 39 C 19 39 17 37 17 35 C 17 32 20 30 22 26 Z"
                    fill="#facc15"
                  />
                </g>

                {/* Right Roof & Chimney Flame */}
                <g className="animate-flame origin-bottom" style={{ animationDelay: '0.3s' }}>
                  <path
                    d="M 70 2 C 74 8 78 11 78 17 C 78 20 74 22 70 22 C 66 22 63 20 63 17 C 63 11 67 8 70 2 Z"
                    fill="#dc2626"
                  />
                  <path
                    d="M 70 6 C 73 10 75 12 75 16 C 75 18 73 19 70 19 C 67 19 65 18 65 16 C 65 12 68 10 70 6 Z"
                    fill="#f97316"
                  />
                </g>
              </g>
            ) : (
              /* Celebratory Sparkle Stars when Fire Extinguished */
              <g className="animate-pulse">
                <polygon points="45,4 47,8 51,9 48,11 49,15 45,13 41,15 42,11 39,9 43,8" fill="#fde047" />
                <polygon points="20,24 21,27 24,28 22,30 23,33 20,31 17,33 18,30 16,28 19,27" fill="#67e8f9" />
                <polygon points="72,12 73,15 76,16 74,18 75,21 72,19 69,21 70,18 68,16 71,15" fill="#67e8f9" />
              </g>
            )}

            {/* Label Pip */}
            <rect x="25" y="85" width="40" height="7" rx="3.5" fill={isExtinguishedOrSaved ? '#065f46' : hasWater ? '#0284c7' : '#991b1b'} />
            <text x="45" y="90" fill="#ffffff" fontSize="4.8" fontWeight="900" textAnchor="middle">
              {isExtinguishedOrSaved ? 'SAVED' : hasWater ? 'SPRAYING' : 'BURNING'}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
