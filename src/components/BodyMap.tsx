import { useState } from 'react';
import { bodySystems, type BodySystem } from '../data/content';

interface Props {
  selectedId: string | null;
  onSelect: (s: BodySystem) => void;
}

/**
 * A stylized front-facing child body silhouette with clickable hotspots
 * for each body system. The heart pulses, the lungs breathe, and hovered
 * hotspots glow — all in SVG so it scales crisply on any screen.
 */
export function BodyMap({ selectedId, onSelect }: Props) {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <svg viewBox="0 0 100 130" className="w-full h-full select-none" role="group" aria-label="Interactive body diagram">
      <defs>
        <linearGradient id="bodyFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="color-mix(in srgb, var(--brand) 10%, var(--surface))" />
          <stop offset="100%" stopColor="color-mix(in srgb, var(--brand) 4%, var(--surface))" />
        </linearGradient>
        <radialGradient id="bodyGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="color-mix(in srgb, var(--brand) 22%, transparent)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {/* Ambient glow */}
      <ellipse cx="50" cy="65" rx="34" ry="58" fill="url(#bodyGlow)" />

      {/* Body silhouette (front view) */}
      <g fill="url(#bodyFill)" stroke="color-mix(in srgb, var(--brand) 30%, var(--border))" strokeWidth="0.5">
        {/* head */}
        <circle cx="50" cy="14" r="9.5" />
        {/* neck */}
        <rect x="46" y="22" width="8" height="5" rx="2" />
        {/* torso */}
        <path d="M36 27 Q50 24 64 27 L67 38 Q68 50 64 60 L60 78 Q50 80 40 78 L36 60 Q32 50 33 38 Z" />
        {/* arms */}
        <path d="M33 30 Q26 32 24 42 Q22 54 24 64 L27 64 Q28 52 30 44 Q31 36 35 33 Z" />
        <path d="M67 30 Q74 32 76 42 Q78 54 76 64 L73 64 Q72 52 70 44 Q69 36 65 33 Z" />
        {/* hands */}
        <circle cx="25" cy="66" r="3" />
        <circle cx="75" cy="66" r="3" />
        {/* legs */}
        <path d="M40 78 L39 100 Q39 112 42 120 L47 120 Q48 108 48 96 L49 82 Z" />
        <path d="M60 78 L61 100 Q61 112 58 120 L53 120 Q52 108 52 96 L51 82 Z" />
        {/* feet */}
        <ellipse cx="44" cy="122" rx="4" ry="2.5" />
        <ellipse cx="56" cy="122" rx="4" ry="2.5" />
      </g>

      {/* Inner "systems" hint lines (subtle) */}
      <g stroke="color-mix(in srgb, var(--brand) 14%, transparent)" strokeWidth="0.4" fill="none" filter="url(#soft)">
        <path d="M50 24 L50 58" />
        <path d="M42 30 Q50 34 58 30" />
      </g>

      {/* Animated heart in chest */}
      <g style={{ transformOrigin: '49px 44px' }} className="origin-center">
        <circle cx="49" cy="44" r="3.2" fill="#f44925" opacity="0.85" className="animate-breathe" style={{ transformOrigin: '49px 44px' }} />
      </g>

      {/* Lung breathe hint */}
      <g opacity="0.5">
        <ellipse cx="43" cy="38" rx="3.5" ry="5" fill="#22d3ee" opacity="0.4" className="animate-breathe" style={{ transformOrigin: '43px 38px', animationDelay: '0.5s' }} />
        <ellipse cx="55" cy="38" rx="3.5" ry="5" fill="#22d3ee" opacity="0.4" className="animate-breathe" style={{ transformOrigin: '55px 38px', animationDelay: '0.5s' }} />
      </g>

      {/* Hotspots */}
      {bodySystems.map((s) => {
        const isSel = selectedId === s.id;
        const isHover = hover === s.id;
        const active = isSel || isHover;
        const { cx, cy, r } = s.hotspot;
        return (
          <g
            key={s.id}
            className="cursor-pointer"
            onClick={() => onSelect(s)}
            onMouseEnter={() => setHover(s.id)}
            onMouseLeave={() => setHover(null)}
            role="button"
            aria-label={s.name}
          >
            {/* ping ring when selected */}
            {isSel && (
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="0.6" className="animate-ping-slow" style={{ transformOrigin: `${cx}px ${cy}px` }} />
            )}
            {/* glow */}
            <circle cx={cx} cy={cy} r={r + (active ? 2 : 0)} fill={s.color} opacity={active ? 0.28 : 0.14} filter="url(#soft)" className="transition-all duration-300" />
            {/* core */}
            <circle
              cx={cx} cy={cy} r={active ? r * 0.7 : r * 0.55}
              fill={s.color}
              stroke="var(--surface)"
              strokeWidth="0.8"
              className="transition-all duration-300"
              style={{ filter: `drop-shadow(0 0 ${active ? 3 : 1}px ${s.glow})` }}
            />
          </g>
        );
      })}
    </svg>
  );
}
