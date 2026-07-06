import { useState } from 'react';
import { bodySystems } from '../data/anatomy';

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/**
 * Detailed front-facing child body silhouette. Organ positions are marked
 * with subtle glow markers that pulse; the anatomy itself makes each organ
 * obvious, so we avoid heavy color-coding. Clicking a marker selects it.
 */
export function BodySilhouette({ selectedId, onSelect }: Props) {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <svg viewBox="0 0 100 200" className="w-full h-full select-none" role="group" aria-label="Interactive body">
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde4d4" />
          <stop offset="100%" stopColor="#f3c9b0" />
        </linearGradient>
        <radialGradient id="bodyGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="color-mix(in srgb, var(--brand) 16%, transparent)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="softBlur"><feGaussianBlur stdDeviation="1.4" /></filter>
      </defs>

      <ellipse cx="50" cy="100" rx="30" ry="80" fill="url(#bodyGlow)" />

      {/* Body */}
      <g fill="url(#skin)" stroke="color-mix(in srgb, var(--text) 14%, var(--skin))" strokeWidth="0.4">
        {/* head */}
        <circle cx="50" cy="12" r="10" />
        {/* ears */}
        <circle cx="40" cy="12" r="2" /><circle cx="60" cy="12" r="2" />
        {/* neck */}
        <path d="M45 21 L 45 27 L 55 27 L 55 21 Z" />
        {/* torso */}
        <path d="M34 27 Q 50 24 66 27 L 70 40 Q 72 56 68 72 L 64 92 Q 50 96 36 92 L 32 72 Q 28 56 30 40 Z" />
        {/* arms */}
        <path d="M31 30 Q 22 34 19 48 Q 16 64 18 78 L 23 78 Q 24 62 26 50 Q 28 38 34 33 Z" />
        <path d="M69 30 Q 78 34 81 48 Q 84 64 82 78 L 77 78 Q 76 62 74 50 Q 72 38 66 33 Z" />
        {/* hands */}
        <circle cx="20" cy="82" r="3.4" /><circle cx="80" cy="82" r="3.4" />
        {/* legs */}
        <path d="M38 92 L 36 130 Q 36 150 40 168 L 48 168 Q 50 150 49 128 L 50 96 Z" />
        <path d="M62 92 L 64 130 Q 64 150 60 168 L 52 168 Q 50 150 51 128 L 50 96 Z" />
        {/* feet */}
        <ellipse cx="42" cy="172" rx="5" ry="3" /><ellipse cx="58" cy="172" rx="5" ry="3" />
      </g>

      {/* Subtle internal anatomy hints (faint) */}
      <g opacity="0.16" fill="none" stroke="var(--text)" strokeWidth="0.5" filter="url(#softBlur)">
        {/* ribcage hint */}
        <path d="M36 40 Q 50 46 64 40 M 34 48 Q 50 54 66 48 M 34 56 Q 50 62 66 56" />
        {/* spine */}
        <line x1="50" y1="28" x2="50" y2="90" />
      </g>

      {/* Organ markers */}
      {bodySystems.map((s) => {
        const sel = selectedId === s.id;
        const h = hover === s.id;
        const active = sel || h;
        return (
          <g
            key={s.id}
            className="cursor-pointer"
            onClick={() => onSelect(s.id)}
            onMouseEnter={() => setHover(s.id)}
            onMouseLeave={() => setHover(null)}
            role="button"
            aria-label={s.name}
          >
            {sel && <circle cx={s.cx} cy={s.cy} r="6" fill="none" stroke="var(--brand)" strokeWidth="0.8" className="animate-ping-slow" style={{ transformBox: 'fill-box', transformOrigin: `${s.cx}px ${s.cy}px` }} />}
            <circle cx={s.cx} cy={s.cy} r={active ? 5 : 3.5} fill="var(--brand)" opacity={active ? 0.5 : 0.22} filter="url(#softBlur)" className="transition-all duration-300" />
            <circle cx={s.cx} cy={s.cy} r={active ? 2.6 : 1.8} fill="var(--brand)" stroke="var(--surface)" strokeWidth="0.6" className="transition-all duration-300" />
            {active && (
              <text x={s.cx} y={s.cy - 6} textAnchor="middle" fontSize="4" fontWeight="700" fill="var(--text)" style={{ pointerEvents: 'none' }}>{s.name}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
