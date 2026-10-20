import React from 'react';
import { Direction, PipeCell } from '../types/game';
import { getPipeOpenings } from '../utils/pipeLogic';

interface PipePieceProps {
  cell: PipeCell;
  size: number;
  onClick: (cell: PipeCell) => void;
  isFlowingWater?: boolean;
}

export const PipePiece: React.FC<PipePieceProps> = ({
  cell,
  size,
  onClick,
  isFlowingWater = false,
}) => {
  const {
    type,
    rotation,
    displayRotationDeg,
    hasWater,
    isHinted,
    locked,
    leakingDirections,
    isOnActivePath,
    isUnusedDisabled,
  } = cell;

  const isFixedPipe = false;
  const isWiggling = false;

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isUnusedDisabled) return;

    if (!locked && type !== 'block' && type !== 'empty') {
      onClick(cell);
    }
  };

  // Continuous smooth clockwise rotation
  const rotAngle = displayRotationDeg !== undefined ? displayRotationDeg : rotation * 90;
  const isWinningIlluminated = isOnActivePath && isFlowingWater;

  // Geometry configuration (in 100x100 viewBox)
  const c = 50; // Center coordinate
  const w = 36; // Pipe body thickness matching screenshot
  const halfW = 18;
  const innerW = 20; // Hollow/water channel width
  const halfInnerW = 10;
  const ringWidth = 44; // Connector ring width
  const halfRing = 22;
  const ringThick = 9; // Connector ring depth

  // Obstacle piece
  if (type === 'block') {
    return (
      <div
        className="relative flex items-center justify-center select-none"
        style={{ width: size, height: size }}
      >
        <div className="w-[86%] h-[86%] rounded-2xl bg-gradient-to-br from-stone-600 via-stone-800 to-stone-900 border-2 border-stone-500 shadow-lg flex items-center justify-center">
          <span className="text-2xl drop-shadow">🪨</span>
        </div>
      </div>
    );
  }

  // Empty piece
  if (type === 'empty') {
    return (
      <div
        className="relative opacity-10"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`relative select-none flex items-center justify-center transition-all duration-500 ${
        isWiggling ? 'animate-wiggle' : ''
      } ${
        isUnusedDisabled
          ? 'pipe-unused-disabled cursor-default pointer-events-none'
          : isWinningIlluminated
          ? 'pipe-path-illuminated scale-[1.02]'
          : isFixedPipe
          ? 'cursor-pointer active:scale-95'
          : locked
          ? 'cursor-default'
          : 'cursor-pointer active:scale-95'
      }`}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Subtle tile boundary / hint aura */}
      <div
        className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
          isHinted
            ? 'ring-4 ring-amber-400 bg-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.9)] animate-pulse'
            : hasWater
            ? 'bg-sky-500/5 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
            : 'bg-transparent hover:bg-white/5'
        }`}
      />

      {/* SVG Canvas for Stone Pipe */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full z-10 overflow-visible"
        style={{
          transform: `rotate(${rotAngle}deg)`,
          transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <defs>
          {/* Grey Stone Pipe Cylindrical Shading - Vertical */}
          <linearGradient id={`stoneCylinderV-${cell.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="12%" stopColor="#64748b" />
            <stop offset="28%" stopColor="#94a3b8" />
            <stop offset="45%" stopColor="#cbd5e1" />
            <stop offset="55%" stopColor="#f1f5f9" />
            <stop offset="70%" stopColor="#94a3b8" />
            <stop offset="88%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Grey Stone Pipe Cylindrical Shading - Horizontal */}
          <linearGradient id={`stoneCylinderH-${cell.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="12%" stopColor="#64748b" />
            <stop offset="28%" stopColor="#94a3b8" />
            <stop offset="45%" stopColor="#cbd5e1" />
            <stop offset="55%" stopColor="#f1f5f9" />
            <stop offset="70%" stopColor="#94a3b8" />
            <stop offset="88%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Toroidal Shading for Elbow Bend */}
          <radialGradient id={`stoneElbowGrad-${cell.id}`} cx="100%" cy="0%" r="100%">
            <stop offset="28%" stopColor="#1e293b" />
            <stop offset="40%" stopColor="#475569" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="58%" stopColor="#e2e8f0" />
            <stop offset="68%" stopColor="#94a3b8" />
            <stop offset="85%" stopColor="#475569" />
            <stop offset="98%" stopColor="#1e293b" />
          </radialGradient>

          {/* Detailed Grey Stone Collar Flange - Vertical */}
          <linearGradient id={`stoneRingV-${cell.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="15%" stopColor="#475569" />
            <stop offset="35%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="65%" stopColor="#94a3b8" />
            <stop offset="85%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Detailed Grey Stone Collar Flange - Horizontal */}
          <linearGradient id={`stoneRingH-${cell.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="15%" stopColor="#475569" />
            <stop offset="35%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="65%" stopColor="#94a3b8" />
            <stop offset="85%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Luxury Metallic Gold Collar Flange for Fixed Ports - Vertical */}
          <linearGradient id={`goldRingV-${cell.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="15%" stopColor="#b45309" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="65%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Luxury Metallic Gold Collar Flange for Fixed Ports - Horizontal */}
          <linearGradient id={`goldRingH-${cell.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="15%" stopColor="#b45309" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="65%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Dark Recessed Hollow Pipe Interior (Dry State) */}
          <linearGradient id={`dryChannel-${cell.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Vibrant Glowing Blue Water Gradient matching reference */}
          <linearGradient id={`waterGrad-${cell.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f7fa" />
            <stop offset="25%" stopColor="#00e5ff" />
            <stop offset="70%" stopColor="#00b0ff" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Glowing Water Filter */}
          <filter id={`waterGlow-${cell.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ============================================================== */}
        {/* 1. STRAIGHT PIPE: UP (0) & DOWN (2)                            */}
        {/* ============================================================== */}
        {type === 'straight' && (
          <g>
            {/* Outer Grey Stone Pipe Body */}
            <rect
              x={c - halfW}
              y={0}
              width={w}
              height={100}
              fill={`url(#stoneCylinderV-${cell.id})`}
              stroke="#0f172a"
              strokeWidth="2"
            />

            {/* Segmented Stone Ridges / Grooves along body */}
            <line x1={c - halfW} y1={25} x2={c + halfW} y2={25} stroke="#1e293b" strokeWidth="1.2" />
            <line x1={c - halfW} y1={26} x2={c + halfW} y2={26} stroke="#f8fafc" strokeWidth="0.8" opacity="0.4" />
            <line x1={c - halfW} y1={50} x2={c + halfW} y2={50} stroke="#1e293b" strokeWidth="1.5" />
            <line x1={c - halfW} y1={51} x2={c + halfW} y2={51} stroke="#f8fafc" strokeWidth="0.8" opacity="0.5" />
            <line x1={c - halfW} y1={75} x2={c + halfW} y2={75} stroke="#1e293b" strokeWidth="1.2" />
            <line x1={c - halfW} y1={76} x2={c + halfW} y2={76} stroke="#f8fafc" strokeWidth="0.8" opacity="0.4" />

            {/* Realistic Carved Stone Surface Cracks */}
            <path d={`M ${c - 12} 32 L ${c - 6} 36 L ${c - 10} 44`} stroke="#1e293b" strokeWidth="1.3" fill="none" opacity="0.6" />
            <path d={`M ${c + 7} 62 L ${c + 12} 68 L ${c + 8} 74`} stroke="#1e293b" strokeWidth="1.3" fill="none" opacity="0.6" />

            {/* Specular Ridge Line */}
            <line x1={c - 2} y1={0} x2={c - 2} y2={100} stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />

            {/* Inner Water Channel (Dry hollow vs Bright Glowing Cyan-Blue) */}
            <rect
              x={c - halfInnerW}
              y={0}
              width={innerW}
              height={100}
              fill={hasWater ? `url(#waterGrad-${cell.id})` : `url(#dryChannel-${cell.id})`}
              stroke="#0f172a"
              strokeWidth="1.2"
            />

            {/* Bright Electric Blue Flowing Core */}
            {hasWater && (
              <g filter={`url(#waterGlow-${cell.id})`}>
                <line
                  x1={c}
                  y1={0}
                  x2={c}
                  y2={100}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="water-flow-stream"
                  strokeLinecap="round"
                />
                <circle cx={c} cy={30} r="2.5" fill="#e0f7fa" className="animate-pulse" />
                <circle cx={c} cy={70} r="2.5" fill="#e0f7fa" className="animate-pulse" />
              </g>
            )}

            {/* TOP Thick Stone/Gold Flange Collar */}
            <g>
              <rect
                x={c - halfRing}
                y={0}
                width={ringWidth}
                height={ringThick}
                rx={2.5}
                fill={isFixedPipe ? `url(#goldRingV-${cell.id})` : `url(#stoneRingV-${cell.id})`}
                stroke={isFixedPipe ? "#78350f" : "#0f172a"}
                strokeWidth="2"
              />
              <line x1={c - halfRing + 2} y1={ringThick - 1} x2={c + halfRing - 2} y2={ringThick - 1} stroke={isFixedPipe ? "#92400e" : "#1e293b"} strokeWidth="1" />
              <line x1={c - halfRing + 2} y1={2} x2={c + halfRing - 2} y2={2} stroke={isFixedPipe ? "#fef08a" : "#f8fafc"} strokeWidth="1" opacity={isFixedPipe ? 0.9 : 0.6} />
              <circle cx={c - 14} cy={4.5} r={1.8} fill={isFixedPipe ? "#fef08a" : "#cbd5e1"} stroke={isFixedPipe ? "#78350f" : "#1e293b"} strokeWidth="0.8" />
              <circle cx={c + 14} cy={4.5} r={1.8} fill={isFixedPipe ? "#fef08a" : "#cbd5e1"} stroke={isFixedPipe ? "#78350f" : "#1e293b"} strokeWidth="0.8" />
            </g>

            {/* BOTTOM Thick Stone/Gold Flange Collar */}
            <g>
              <rect
                x={c - halfRing}
                y={100 - ringThick}
                width={ringWidth}
                height={ringThick}
                rx={2.5}
                fill={isFixedPipe ? `url(#goldRingV-${cell.id})` : `url(#stoneRingV-${cell.id})`}
                stroke={isFixedPipe ? "#78350f" : "#0f172a"}
                strokeWidth="2"
              />
              <line x1={c - halfRing + 2} y1={100 - ringThick + 1} x2={c + halfRing - 2} y2={100 - ringThick + 1} stroke={isFixedPipe ? "#92400e" : "#1e293b"} strokeWidth="1" />
              <line x1={c - halfRing + 2} y1={98} x2={c + halfRing - 2} y2={98} stroke={isFixedPipe ? "#fef08a" : "#f8fafc"} strokeWidth="1" opacity={isFixedPipe ? 0.9 : 0.6} />
              <circle cx={c - 14} cy={95.5} r={1.8} fill={isFixedPipe ? "#fef08a" : "#cbd5e1"} stroke={isFixedPipe ? "#78350f" : "#1e293b"} strokeWidth="0.8" />
              <circle cx={c + 14} cy={95.5} r={1.8} fill={isFixedPipe ? "#fef08a" : "#cbd5e1"} stroke={isFixedPipe ? "#78350f" : "#1e293b"} strokeWidth="0.8" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 2. ELBOW PIPE: Smooth 90-degree bend with stone segments       */}
        {/* ============================================================== */}
        {type === 'elbow' && (
          <g>
            {/* Outer 90-degree Toroidal Stone Body (center at 100, 0, radius 68 outer, 32 inner) */}
            <path
              d={`M ${c - halfW} 0 A ${50 + halfW} ${50 + halfW} 0 0 0 100 ${c + halfW} L 100 ${c - halfW} A ${50 - halfW} ${50 - halfW} 0 0 1 ${c + halfW} 0 Z`}
              fill={`url(#stoneElbowGrad-${cell.id})`}
              stroke="#0f172a"
              strokeWidth="2"
            />

            {/* Mathematically exact radial joint lines dividing the 90-degree bend */}
            {/* Joint 1: at 30 degrees (from 72.3, 16.0 to 41.1, 34.0) */}
            <line x1={72.3} y1={16.0} x2={41.1} y2={34.0} stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            <line x1={72.8} y1={15.2} x2={41.6} y2={33.2} stroke="#f8fafc" strokeWidth="0.8" opacity="0.45" />

            {/* Joint 2: at 60 degrees (from 84.0, 27.7 to 66.0, 58.9) */}
            <line x1={84.0} y1={27.7} x2={66.0} y2={58.9} stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            <line x1={84.5} y1={27.0} x2={66.5} y2={58.2} stroke="#f8fafc" strokeWidth="0.8" opacity="0.45" />

            {/* Center 45-degree Angled Bolted Joint Band / Coupling (from 77.4, 22.6 to 51.9, 48.1) */}
            <g>
              {/* Joint band background */}
              <line x1={77.4} y1={22.6} x2={51.9} y2={48.1} stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
              <line x1={77.4} y1={22.6} x2={51.9} y2={48.1} stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
              <line x1={76.9} y1={22.1} x2={51.4} y2={47.6} stroke="#f8fafc" strokeWidth="1" opacity="0.6" />

              {/* Steel rivets on 45-degree joint coupling */}
              <circle cx={72.0} cy={28.0} r="1.8" fill="#cbd5e1" stroke="#0f172a" strokeWidth="0.8" />
              <circle cx={57.0} cy={43.0} r="1.8" fill="#cbd5e1" stroke="#0f172a" strokeWidth="0.8" />
            </g>

            {/* Specular Highlight Arc along the smooth bend */}
            <path
              d="M 47 0 A 53 53 0 0 0 100 53"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.8"
              opacity="0.55"
            />

            {/* Inner Channel (Dry hollow vs Flowing Bright Blue) */}
            <path
              d={`M ${c - halfInnerW} 0 A ${50 + halfInnerW} ${50 + halfInnerW} 0 0 0 100 ${c + halfInnerW} L 100 ${c - halfInnerW} A ${50 - halfInnerW} ${50 - halfInnerW} 0 0 1 ${c + halfInnerW} 0 Z`}
              fill={hasWater ? `url(#waterGrad-${cell.id})` : `url(#dryChannel-${cell.id})`}
              stroke="#0f172a"
              strokeWidth="1.2"
            />

            {/* Flowing Water Core around the 90-degree elbow */}
            {hasWater && (
              <g filter={`url(#waterGlow-${cell.id})`}>
                <path
                  d="M 50 0 A 50 50 0 0 0 100 50"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="water-flow-stream"
                  strokeLinecap="round"
                />
                <circle cx={64.6} cy={35.4} r="2.8" fill="#e0f7fa" className="animate-pulse" />
              </g>
            )}

            {/* TOP Thick Stone Flange Collar */}
            <g>
              <rect
                x={c - halfRing}
                y={0}
                width={ringWidth}
                height={ringThick}
                rx={2.5}
                fill={`url(#stoneRingV-${cell.id})`}
                stroke="#0f172a"
                strokeWidth="2"
              />
              <line x1={c - halfRing + 2} y1={2} x2={c + halfRing - 2} y2={2} stroke="#f8fafc" strokeWidth="1" opacity="0.6" />
              <circle cx={c - 14} cy={4.5} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
              <circle cx={c + 14} cy={4.5} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
            </g>

            {/* RIGHT Thick Stone Flange Collar */}
            <g>
              <rect
                x={100 - ringThick}
                y={c - halfRing}
                width={ringThick}
                height={ringWidth}
                rx={2.5}
                fill={`url(#stoneRingH-${cell.id})`}
                stroke="#0f172a"
                strokeWidth="2"
              />
              <line x1={98} y1={c - halfRing + 2} x2={98} y2={c + halfRing - 2} stroke="#f8fafc" strokeWidth="1" opacity="0.6" />
              <circle cx={95.5} cy={c - 14} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
              <circle cx={95.5} cy={c + 14} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 3. T-JUNCTION: UP (0), RIGHT (1), LEFT (3)                     */}
        {/* ============================================================== */}
        {type === 'tee' && (
          <g>
            {/* Horizontal Bar */}
            <rect
              x={0}
              y={c - halfW}
              width={100}
              height={w}
              fill={`url(#stoneCylinderH-${cell.id})`}
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Vertical Stem */}
            <rect
              x={c - halfW}
              y={0}
              width={w}
              height={c + halfW}
              fill={`url(#stoneCylinderV-${cell.id})`}
              stroke="#0f172a"
              strokeWidth="2"
            />
            <rect x={c - halfW + 1} y={c - halfW + 1} width={w - 2} height={w - 2} fill={`url(#stoneCylinderV-${cell.id})`} />

            {/* Specular lines */}
            <line x1={0} y1={c - 2} x2={100} y2={c - 2} stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
            <line x1={c - 2} y1={0} x2={c - 2} y2={c} stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />

            {/* Realistic Carved Stone Surface Cracks */}
            <path d="M 22 42 L 28 46 L 24 52" stroke="#1e293b" strokeWidth="1.3" fill="none" opacity="0.6" />
            <path d="M 44 20 L 48 26 L 43 32" stroke="#1e293b" strokeWidth="1.3" fill="none" opacity="0.6" />
            <path d="M 74 42 L 80 46 L 76 52" stroke="#1e293b" strokeWidth="1.3" fill="none" opacity="0.6" />

            {/* Inner Channels (Dry or Filled) */}
            <rect
              x={0}
              y={c - halfInnerW}
              width={100}
              height={innerW}
              fill={hasWater ? `url(#waterGrad-${cell.id})` : `url(#dryChannel-${cell.id})`}
              stroke="#0f172a"
              strokeWidth="1.2"
            />
            <rect
              x={c - halfInnerW}
              y={0}
              width={innerW}
              height={c + halfInnerW}
              fill={hasWater ? `url(#waterGrad-${cell.id})` : `url(#dryChannel-${cell.id})`}
              stroke="#0f172a"
              strokeWidth="1.2"
            />
            <rect x={c - halfInnerW} y={c - halfInnerW} width={innerW} height={innerW} fill={hasWater ? `url(#waterGrad-${cell.id})` : `url(#dryChannel-${cell.id})`} />

            {/* Flowing Water Core */}
            {hasWater && (
              <g filter={`url(#waterGlow-${cell.id})`}>
                <line x1={0} y1={c} x2={100} y2={c} stroke="#ffffff" strokeWidth="4" className="water-flow-stream" />
                <line x1={c} y1={0} x2={c} y2={c} stroke="#ffffff" strokeWidth="4" className="water-flow-stream" />
                <circle cx={c} cy={c} r="3" fill="#e0f7fa" className="animate-pulse" />
              </g>
            )}

            {/* TOP Flange Collar */}
            <g>
              <rect x={c - halfRing} y={0} width={ringWidth} height={ringThick} rx={2.5} fill={`url(#stoneRingV-${cell.id})`} stroke="#0f172a" strokeWidth="2" />
              <circle cx={c - 14} cy={4.5} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
              <circle cx={c + 14} cy={4.5} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
            </g>

            {/* LEFT Flange Collar */}
            <g>
              <rect x={0} y={c - halfRing} width={ringThick} height={ringWidth} rx={2.5} fill={`url(#stoneRingH-${cell.id})`} stroke="#0f172a" strokeWidth="2" />
              <circle cx={4.5} cy={c - 14} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
              <circle cx={4.5} cy={c + 14} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
            </g>

            {/* RIGHT Flange Collar */}
            <g>
              <rect x={100 - ringThick} y={c - halfRing} width={ringThick} height={ringWidth} rx={2.5} fill={`url(#stoneRingH-${cell.id})`} stroke="#0f172a" strokeWidth="2" />
              <circle cx={95.5} cy={c - 14} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
              <circle cx={95.5} cy={c + 14} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* 4. CROSS PIPE: All 4 Directions Open                           */}
        {/* ============================================================== */}
        {type === 'cross' && (
          <g>
            {/* Horizontal & Vertical Bars */}
            <rect
              x={0}
              y={c - halfW}
              width={100}
              height={w}
              fill={`url(#stoneCylinderH-${cell.id})`}
              stroke="#0f172a"
              strokeWidth="2"
            />
            <rect
              x={c - halfW}
              y={0}
              width={w}
              height={100}
              fill={`url(#stoneCylinderV-${cell.id})`}
              stroke="#0f172a"
              strokeWidth="2"
            />
            <rect x={c - halfW + 1} y={c - halfW + 1} width={w - 2} height={w - 2} fill={`url(#stoneCylinderV-${cell.id})`} />

            {/* Specular lines */}
            <line x1={0} y1={c - 2} x2={100} y2={c - 2} stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
            <line x1={c - 2} y1={0} x2={c - 2} y2={100} stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />

            {/* Realistic Carved Stone Surface Cracks */}
            <path d="M 22 42 L 28 46 L 24 52" stroke="#1e293b" strokeWidth="1.3" fill="none" opacity="0.6" />
            <path d="M 44 20 L 48 26 L 43 32" stroke="#1e293b" strokeWidth="1.3" fill="none" opacity="0.6" />
            <path d="M 74 42 L 80 46 L 76 52" stroke="#1e293b" strokeWidth="1.3" fill="none" opacity="0.6" />
            <path d="M 44 72 L 48 78 L 43 84" stroke="#1e293b" strokeWidth="1.3" fill="none" opacity="0.6" />

            {/* Inner Channels (Dry or Flowing Water) */}
            <rect
              x={0}
              y={c - halfInnerW}
              width={100}
              height={innerW}
              fill={hasWater ? `url(#waterGrad-${cell.id})` : `url(#dryChannel-${cell.id})`}
              stroke="#0f172a"
              strokeWidth="1.2"
            />
            <rect
              x={c - halfInnerW}
              y={0}
              width={innerW}
              height={100}
              fill={hasWater ? `url(#waterGrad-${cell.id})` : `url(#dryChannel-${cell.id})`}
              stroke="#0f172a"
              strokeWidth="1.2"
            />
            <rect x={c - halfInnerW} y={c - halfInnerW} width={innerW} height={innerW} fill={hasWater ? `url(#waterGrad-${cell.id})` : `url(#dryChannel-${cell.id})`} />

            {/* Flowing Water Core */}
            {hasWater && (
              <g filter={`url(#waterGlow-${cell.id})`}>
                <line x1={0} y1={c} x2={100} y2={c} stroke="#ffffff" strokeWidth="4" className="water-flow-stream" />
                <line x1={c} y1={0} x2={c} y2={100} stroke="#ffffff" strokeWidth="4" className="water-flow-stream" />
                <circle cx={c} cy={c} r="3.5" fill="#e0f7fa" className="animate-pulse" />
              </g>
            )}

            {/* 4 Thick Stone Flange Collars */}
            <rect x={c - halfRing} y={0} width={ringWidth} height={ringThick} rx={2.5} fill={`url(#stoneRingV-${cell.id})`} stroke="#0f172a" strokeWidth="2" />
            <circle cx={c - 14} cy={4.5} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
            <circle cx={c + 14} cy={4.5} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />

            <rect x={100 - ringThick} y={c - halfRing} width={ringThick} height={ringWidth} rx={2.5} fill={`url(#stoneRingH-${cell.id})`} stroke="#0f172a" strokeWidth="2" />
            <circle cx={95.5} cy={c - 14} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
            <circle cx={95.5} cy={c + 14} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />

            <rect x={c - halfRing} y={100 - ringThick} width={ringWidth} height={ringThick} rx={2.5} fill={`url(#stoneRingV-${cell.id})`} stroke="#0f172a" strokeWidth="2" />
            <circle cx={c - 14} cy={95.5} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
            <circle cx={c + 14} cy={95.5} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />

            <rect x={0} y={c - halfRing} width={ringThick} height={ringWidth} rx={2.5} fill={`url(#stoneRingH-${cell.id})`} stroke="#0f172a" strokeWidth="2" />
            <circle cx={4.5} cy={c - 14} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
            <circle cx={4.5} cy={c + 14} r="1.8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="0.8" />
          </g>
        )}

        {/* Center Stone Rivet Plate on T and Cross */}
        {(type === 'tee' || type === 'cross') && (
          <g>
            <circle cx={c} cy={c} r={7.5} fill="#334155" stroke="#0f172a" strokeWidth="2" />
            <circle cx={c} cy={c} r={3.5} fill="#cbd5e1" />
          </g>
        )}
      </svg>

      {/* --- WATER SPRAY EFFECT AT UNCONNECTED OPENINGS --- */}
      {hasWater && !isUnusedDisabled && leakingDirections && leakingDirections.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {leakingDirections.map((leakDir) => {
            let posStyle: React.CSSProperties = {};

            if (leakDir === 0) {
              posStyle = { top: '-2px', left: '50%', transform: 'translate(-50%, -100%)' };
            } else if (leakDir === 1) {
              posStyle = { top: '50%', right: '-2px', transform: 'translate(100%, -50%) rotate(90deg)' };
            } else if (leakDir === 2) {
              posStyle = { bottom: '-2px', left: '50%', transform: 'translate(-50%, 100%) rotate(180deg)' };
            } else if (leakDir === 3) {
              posStyle = { top: '50%', left: '-2px', transform: 'translate(-100%, -50%) rotate(270deg)' };
            }

            return (
              <div
                key={`leak-${cell.id}-${leakDir}`}
                className="absolute flex flex-col items-center justify-end"
                style={{
                  ...posStyle,
                  width: '36px',
                  height: '48px',
                }}
              >
                <div className="relative w-full h-full flex flex-col items-center justify-end">
                  <svg
                    viewBox="0 0 40 60"
                    className="w-10 h-12 overflow-visible animate-spray-jet origin-bottom"
                  >
                    <defs>
                      <linearGradient id={`sprayGrad-${cell.id}-${leakDir}`} x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.95" />
                        <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#e0f7fa" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 15 60 Q 10 30 5 5 Q 20 0 35 5 Q 30 30 25 60 Z"
                      fill={`url(#sprayGrad-${cell.id}-${leakDir})`}
                    />
                    <path
                      d="M 18 60 Q 16 35 12 10 Q 20 5 28 10 Q 24 35 22 60 Z"
                      fill="#ffffff"
                      opacity="0.9"
                    />
                  </svg>

                  {/* Airborne splash droplets */}
                  <div className="absolute top-1 w-2.5 h-2.5 rounded-full bg-cyan-200 animate-spray-drop-a" />
                  <div className="absolute top-2 w-2 h-2 rounded-full bg-sky-300 animate-spray-drop-b" />
                  <div className="absolute top-0 w-2 h-2 rounded-full bg-white animate-spray-drop-c" />
                  <div className="absolute bottom-0 w-6 h-2 rounded-full bg-cyan-400/80 animate-ping" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subtle rotation cue on hover / tap */}
      {!locked && !isUnusedDisabled && (
        <div className="absolute bottom-1 right-1 opacity-0 hover:opacity-100 transition-opacity bg-black/60 rounded-full p-0.5 pointer-events-none text-[10px] text-slate-300 font-bold">
          ↻
        </div>
      )}
    </div>
  );
};

export const PipeComponent = PipePiece;
