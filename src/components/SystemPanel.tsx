import { X, Sparkles, Activity } from 'lucide-react';
import type { BodySystem } from '../data/content';
import { useMode } from '../context/ModeContext';

interface Props {
  system: BodySystem | null;
  onClose: () => void;
}

const statusColor: Record<string, string> = {
  good: '#1bb88a',
  watch: '#f59e0b',
  info: '#588dff',
};

export function SystemPanel({ system, onClose }: Props) {
  const { mode } = useMode();
  const isChild = mode === 'child';

  if (!system) {
    return (
      <div className="card p-8 h-full flex flex-col items-center justify-center text-center">
        <div className="grid place-items-center h-16 w-16 rounded-2xl mb-4 animate-pulse-soft" style={{ background: 'var(--bg-alt)', color: 'var(--brand)' }}>
          <Activity className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold mb-2">{isChild ? 'Tap a glowing part!' : 'Select a body system'}</h3>
        <p className="text-sm text-muted max-w-xs">
          {isChild
            ? 'Click any glowing dot on the body to learn what it does and how it keeps you healthy.'
            : 'Click a hotspot to view metrics, explanations, and status for that system.'}
        </p>
      </div>
    );
  }

  return (
    <div key={system.id} className="card p-6 h-full flex flex-col animate-pop">
      <div className="flex items-start gap-4">
        <div
          className="grid place-items-center h-14 w-14 rounded-2xl shrink-0"
          style={{ background: `color-mix(in srgb, ${system.color} 18%, var(--surface))`, color: system.color }}
        >
          <system.icon className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl font-bold">{system.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="chip" style={{ background: `color-mix(in srgb, ${system.color} 16%, transparent)`, color: system.color }}>
              <span className="h-2 w-2 rounded-full" style={{ background: system.color }} />
              {isChild ? 'Kid view' : 'Parent view'}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="btn btn-ghost h-9 w-9 p-0" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 p-4 rounded-xl" style={{ background: 'var(--bg-alt)' }}>
        <p className="text-sm leading-relaxed">
          {isChild ? system.childExplain : system.parentExplain}
        </p>
      </div>

      <div className="mt-5">
        <div className="text-xs font-bold tracking-widest text-muted mb-3 flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5" /> {isChild ? "HOW IT'S DOING" : 'METRICS'}
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {system.metrics.map((m) => (
            <div key={m.label} className="rounded-xl p-3 border" style={{ borderColor: 'var(--border)' }}>
              <div className="text-[10px] uppercase tracking-wide text-muted">{m.label}</div>
              <div className="text-sm font-bold mt-0.5">{m.value}</div>
              <div className="mt-1.5 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusColor[m.status] }} />
                <span className="text-[10px] font-semibold" style={{ color: statusColor[m.status] }}>
                  {m.status === 'good' ? 'Good' : m.status === 'watch' ? 'Watch' : 'Info'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-5">
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: `color-mix(in srgb, ${system.color} 10%, var(--surface))` }}
        >
          <Sparkles className="h-5 w-5 shrink-0 mt-0.5" style={{ color: system.color }} />
          <div>
            <div className="text-xs font-bold mb-0.5" style={{ color: system.color }}>
              {isChild ? 'Fun Fact!' : 'Did you know?'}
            </div>
            <div className="text-sm text-muted">{system.funFact}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
