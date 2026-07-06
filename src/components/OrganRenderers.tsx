// Detailed animated SVG organ renderers.
// Each organ is an inline SVG with CSS keyframe animations so the
// anatomy visibly moves (beating heart, breathing lungs, firing brain, etc.)

import type { CSSProperties } from 'react';

const tx = (t: string): CSSProperties => ({ transform: t, transformBox: 'fill-box' as const, transformOrigin: 'center' });

/* ------------------------------------------------------------------ HEART */
export function HeartOrgan() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" role="img" aria-label="Animated heart">
      <defs>
        <radialGradient id="hMuscle" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ff7a6b" />
          <stop offset="60%" stopColor="#e23848" />
          <stop offset="100%" stopColor="#a51d2b" />
        </radialGradient>
        <linearGradient id="hVessel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      {/* Great vessels on top */}
      <g stroke="url(#hVessel)" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.85">
        <path d="M95 50 C 90 30, 70 28, 62 18" />
        <path d="M110 52 C 118 32, 135 30, 140 20" />
      </g>
      <ellipse cx="100" cy="22" rx="9" ry="6" fill="url(#hVessel)" opacity="0.7" />
      {/* Heart muscle */}
      <g style={tx('translate(0,0)')} className="animate-heartbeat">
        <path
          d="M100 58 C 70 30, 28 48, 38 86 C 46 116, 84 140, 100 160 C 116 140, 154 116, 162 86 C 172 48, 130 30, 100 58 Z"
          fill="url(#hMuscle)"
          stroke="#7a1620"
          strokeWidth="1.5"
        />
        {/* Coronary arteries */}
        <g stroke="#f6c4c0" strokeWidth="2.5" fill="none" opacity="0.8" strokeLinecap="round">
          <path d="M100 62 C 86 76, 70 84, 58 100 C 54 110, 56 122, 62 130" />
          <path d="M100 64 C 116 78, 134 86, 144 102 C 148 114, 146 126, 140 134" />
          <path d="M100 70 L 100 150" />
        </g>
        {/* Chambers hint */}
        <path d="M100 60 L 100 158" stroke="#7a1620" strokeWidth="1.2" opacity="0.5" fill="none" />
        <ellipse cx="74" cy="86" rx="14" ry="18" fill="#c92638" opacity="0.25" />
        <ellipse cx="126" cy="86" rx="14" ry="18" fill="#c92638" opacity="0.25" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ LUNGS */
export function LungsOrgan() {
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full" role="img" aria-label="Animated lungs">
      <defs>
        <radialGradient id="lungG" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="70%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0e7490" />
        </radialGradient>
      </defs>
      {/* Trachea */}
      <rect x="94" y="20" width="12" height="44" rx="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
      <g stroke="#94a3b8" strokeWidth="1" opacity="0.7">
        <line x1="96" y1="30" x2="104" y2="30" /><line x1="96" y1="38" x2="104" y2="38" /><line x1="96" y1="46" x2="104" y2="46" /><line x1="96" y1="54" x2="104" y2="54" />
      </g>
      {/* Bronchi */}
      <g stroke="#0e7490" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M100 64 L 72 88" /><path d="M100 64 L 128 88" />
      </g>
      {/* Left lung */}
      <g style={tx('scale(1,1)')} className="animate-breathe">
        <path d="M70 90 C 40 96, 30 130, 36 160 C 42 186, 64 196, 78 180 C 86 168, 88 140, 86 110 Z" fill="url(#lungG)" stroke="#0e7490" strokeWidth="1.5" />
        {/* bronchial tree */}
        <g stroke="#0e7490" strokeWidth="1.4" fill="none" opacity="0.6" strokeLinecap="round">
          <path d="M72 92 L 60 110 L 52 130 M 60 110 L 50 120 M 60 110 L 68 128 L 60 146 M 72 92 L 78 120 L 72 150 M 78 120 L 84 140" />
        </g>
      </g>
      {/* Right lung */}
      <g className="animate-breathe" style={{ ...tx('scale(1,1)'), animationDelay: '0.05s' }}>
        <path d="M130 90 C 160 96, 170 130, 164 160 C 158 186, 136 196, 122 180 C 114 168, 112 140, 114 110 Z" fill="url(#lungG)" stroke="#0e7490" strokeWidth="1.5" />
        <g stroke="#0e7490" strokeWidth="1.4" fill="none" opacity="0.6" strokeLinecap="round">
          <path d="M128 92 L 140 110 L 148 130 M 140 110 L 150 120 M 140 110 L 132 128 L 140 146 M 128 92 L 122 120 L 128 150 M 122 120 L 116 140" />
        </g>
      </g>
      {/* Air particles */}
      <g fill="#fff" opacity="0.7">
        <circle cx="60" cy="140" r="2" className="animate-brainwave" />
        <circle cx="140" cy="140" r="2" className="animate-brainwave" style={{ animationDelay: '0.4s' }} />
        <circle cx="100" cy="40" r="2" className="animate-brainwave" style={{ animationDelay: '0.8s' }} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ BRAIN */
export function BrainOrgan() {
  return (
    <svg viewBox="0 0 200 170" className="w-full h-full" role="img" aria-label="Animated brain">
      <defs>
        <radialGradient id="brainG" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#f5d0fe" />
          <stop offset="70%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7e22ce" />
        </radialGradient>
      </defs>
      {/* Brain stem */}
      <path d="M96 130 L 96 160 L 104 160 L 104 130 Z" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1.2" />
      <g stroke="#7e22ce" strokeWidth="1" opacity="0.6">
        <line x1="98" y1="138" x2="102" y2="138" /><line x1="98" y1="146" x2="102" y2="146" /><line x1="98" y1="154" x2="102" y2="154" />
      </g>
      {/* Cerebellum */}
      <ellipse cx="100" cy="128" rx="26" ry="14" fill="url(#brainG)" stroke="#6d28d9" strokeWidth="1.2" />
      <g stroke="#7e22ce" strokeWidth="0.8" opacity="0.5">
        <line x1="84" y1="124" x2="116" y2="124" /><line x1="82" y1="130" x2="118" y2="130" /><line x1="84" y1="136" x2="116" y2="136" />
      </g>
      {/* Cerebrum with gyri */}
      <g>
        <path
          d="M100 18 C 60 18, 34 44, 34 78 C 34 100, 50 118, 70 122 C 80 124, 88 120, 100 122 C 112 120, 120 124, 130 122 C 150 118, 166 100, 166 78 C 166 44, 140 18, 100 18 Z"
          fill="url(#brainG)"
          stroke="#6d28d9"
          strokeWidth="1.5"
        />
        {/* Gyri (wrinkles) */}
        <g stroke="#6d28d9" strokeWidth="1.4" fill="none" opacity="0.55" strokeLinecap="round">
          <path d="M52 60 C 64 50, 76 56, 84 64" />
          <path d="M84 36 C 94 28, 106 28, 116 36" />
          <path d="M116 44 C 128 40, 140 48, 148 58" />
          <path d="M44 84 C 58 80, 70 88, 78 96" />
          <path d="M100 60 C 92 68, 92 80, 100 88 C 108 80, 108 68, 100 60" />
          <path d="M122 70 C 134 66, 146 72, 156 82" />
          <path d="M60 104 C 72 100, 84 106, 92 112" />
          <path d="M108 108 C 120 104, 132 108, 142 114" />
        </g>
        {/* Central fissure */}
        <path d="M100 20 L 100 122" stroke="#6d28d9" strokeWidth="1.2" opacity="0.4" fill="none" />
      </g>
      {/* Neural firing sparks */}
      <g fill="#fef08a">
        <circle cx="70" cy="60" r="2.5" className="animate-brainwave" />
        <circle cx="130" cy="70" r="2.5" className="animate-brainwave" style={{ animationDelay: '0.3s' }} />
        <circle cx="100" cy="50" r="2.5" className="animate-brainwave" style={{ animationDelay: '0.6s' }} />
        <circle cx="80" cy="100" r="2.5" className="animate-brainwave" style={{ animationDelay: '0.9s' }} />
        <circle cx="120" cy="96" r="2.5" className="animate-brainwave" style={{ animationDelay: '1.2s' }} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ EYES */
export function EyeOrgan() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full" role="img" aria-label="Animated eye">
      <defs>
        <radialGradient id="irisG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="60%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#134e4a" />
        </radialGradient>
      </defs>
      {/* Eye socket outline */}
      <path d="M20 70 Q 100 20, 180 70 Q 100 120, 20 70 Z" fill="#fff" stroke="#1a2030" strokeWidth="2" />
      <path d="M20 70 Q 100 20, 180 70" fill="none" stroke="#1a2030" strokeWidth="2" />
      {/* Iris + pupil (blink handled by eyelid) */}
      <g className="animate-pulse-soft" style={tx('scale(1)')}>
        <circle cx="100" cy="70" r="30" fill="url(#irisG)" />
        <circle cx="100" cy="70" r="13" fill="#1a2030" />
        <circle cx="106" cy="64" r="5" fill="#fff" opacity="0.9" />
      </g>
      {/* Eyelid blink */}
      <g>
        <path id="lid" d="M20 70 Q 100 20, 180 70 Q 100 18, 20 70 Z" fill="#e8b3a0" opacity="0">
          <animate attributeName="opacity" values="0;0;0;1;0;0" dur="4s" repeatCount="indefinite" keyTimes="0;0.85;0.9;0.93;0.96;1" />
        </path>
      </g>
      {/* Lashes */}
      <g stroke="#1a2030" strokeWidth="1.5" strokeLinecap="round">
        <line x1="60" y1="44" x2="56" y2="36" /><line x1="80" y1="36" x2="78" y2="26" /><line x1="100" y1="32" x2="100" y2="22" /><line x1="120" y1="36" x2="122" y2="26" /><line x1="140" y1="44" x2="144" y2="36" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ DIGESTIVE */
export function DigestiveOrgan() {
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full" role="img" aria-label="Animated digestive system">
      <defs>
        <linearGradient id="stomachG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="intestineG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      {/* Esophagus */}
      <rect x="94" y="14" width="12" height="50" rx="6" fill="#fbbf24" stroke="#b45309" strokeWidth="1.2" />
      {/* Stomach */}
      <path d="M88 62 C 60 60, 50 86, 58 108 C 66 126, 92 128, 108 110 C 118 96, 118 72, 100 64 Z" fill="url(#stomachG)" stroke="#9a3412" strokeWidth="1.5" className="animate-breathe" style={tx('scale(1)')} />
      {/* Liver hint */}
      <path d="M120 60 C 150 58, 166 74, 160 92 C 152 104, 130 100, 122 88 Z" fill="#b91c1c" opacity="0.6" stroke="#7f1d1d" strokeWidth="1" />
      {/* Small intestine (coiled) */}
      <g fill="none" stroke="url(#intestineG)" strokeWidth="9" strokeLinecap="round" opacity="0.95">
        <path d="M84 120 C 60 130, 60 150, 86 150 C 110 150, 110 130, 86 130 C 60 130, 60 168, 86 168 C 110 168, 110 148, 86 148" />
      </g>
      {/* Large intestine frame */}
      <path d="M70 116 C 40 120, 40 180, 70 184 L 130 184 C 160 180, 160 120, 130 116" fill="none" stroke="#d97706" strokeWidth="9" strokeLinecap="round" opacity="0.85" />
      {/* Food particles moving */}
      <circle r="3" fill="#fff" opacity="0.9">
        <animateMotion dur="3s" repeatCount="indefinite" path="M94 18 L 94 60 L 84 90 L 84 120 L 86 150 L 86 168" />
      </circle>
    </svg>
  );
}

/* ------------------------------------------------------------------ SKELETON */
export function SkeletonOrgan() {
  return (
    <svg viewBox="0 0 200 230" className="w-full h-full" role="img" aria-label="Skeleton">
      <defs>
        <linearGradient id="boneG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fafafa" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
      <g fill="url(#boneG)" stroke="#94a3b8" strokeWidth="1.3" strokeLinejoin="round">
        {/* Skull */}
        <path d="M100 16 C 78 16, 64 30, 64 48 C 64 60, 72 68, 80 72 L 120 72 C 128 68, 136 60, 136 48 C 136 30, 122 16, 100 16 Z" />
        <circle cx="86" cy="48" r="6" fill="#1a2030" stroke="none" />
        <circle cx="114" cy="48" r="6" fill="#1a2030" stroke="none" />
        <path d="M92 64 L 108 64" stroke="#94a3b8" strokeWidth="1.5" />
        {/* Spine */}
        <g>
          {[0,1,2,3,4,5,6,7,8].map((i) => (
            <rect key={i} x="94" y={80 + i * 11} width="12" height="9" rx="3" />
          ))}
        </g>
        {/* Ribcage */}
        <g fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round">
          {[88, 98, 108, 118].map((y) => (
            <path key={y} d={`M94 ${y} C 70 ${y+2}, 62 ${y+8}, 66 ${y+14} M106 ${y} C 130 ${y+2}, 138 ${y+8}, 134 ${y+14}`} />
          ))}
        </g>
        {/* Pelvis */}
        <path d="M74 180 C 60 182, 60 200, 78 200 L 122 200 C 140 200, 140 182, 126 180 Z" />
        {/* Arms */}
        <path d="M64 82 L 52 130 L 56 168" fill="none" strokeWidth="7" />
        <path d="M136 82 L 148 130 L 144 168" fill="none" strokeWidth="7" />
        {/* Legs */}
        <path d="M86 200 L 82 228" fill="none" strokeWidth="8" />
        <path d="M114 200 L 118 228" fill="none" strokeWidth="8" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ IMMUNE */
export function ImmuneOrgan() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" role="img" aria-label="Immune system">
      <defs>
        <radialGradient id="shieldG" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="70%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#065f46" />
        </radialGradient>
      </defs>
      {/* Shield body */}
      <path d="M100 24 C 70 32, 48 38, 40 40 L 40 96 C 40 132, 70 156, 100 172 C 130 156, 160 132, 160 96 L 160 40 C 152 38, 130 32, 100 24 Z" fill="url(#shieldG)" stroke="#065f46" strokeWidth="2" className="animate-pulse-soft" style={tx('scale(1)')} />
      {/* Cross emblem */}
      <path d="M92 76 H 108 V 100 H 124 V 116 H 108 V 140 H 92 V 116 H 76 V 100 H 92 Z" fill="#fff" opacity="0.9" />
      {/* Defenders (white blood cells) */}
      <g fill="#fff" opacity="0.85">
        <circle cx="64" cy="64" r="6" className="animate-brainwave" />
        <circle cx="136" cy="70" r="6" className="animate-brainwave" style={{ animationDelay: '0.5s' }} />
        <circle cx="58" cy="120" r="6" className="animate-brainwave" style={{ animationDelay: '1s' }} />
        <circle cx="142" cy="120" r="6" className="animate-brainwave" style={{ animationDelay: '1.5s' }} />
      </g>
      {/* Germs being fought */}
      <g fill="#dc2626" opacity="0.5">
        <circle cx="80" cy="150" r="4" className="animate-flash" />
        <circle cx="120" cy="150" r="4" className="animate-flash" style={{ animationDelay: '0.3s' }} />
      </g>
    </svg>
  );
}

const renderers: Record<string, () => JSX.Element> = {
  heart: HeartOrgan,
  lungs: LungsOrgan,
  brain: BrainOrgan,
  eyes: EyeOrgan,
  digestive: DigestiveOrgan,
  skeleton: SkeletonOrgan,
  immune: ImmuneOrgan,
};

export function OrganRenderer({ systemId }: { systemId: string }) {
  const R = renderers[systemId];
  return R ? <R /> : <div className="grid place-items-center h-full text-muted text-sm">Organ view</div>;
}
