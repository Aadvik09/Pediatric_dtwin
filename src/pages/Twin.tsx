import { useState } from 'react';
import { Info, RotateCw } from 'lucide-react';
import { BodyMap } from '../components/BodyMap';
import { SystemPanel } from '../components/SystemPanel';
import { ParentSidebar } from '../components/ParentSidebar';
import { KidSidebar } from '../components/KidSidebar';
import { bodySystems, type BodySystem } from '../data/content';
import { useMode } from '../context/ModeContext';
import type { PageId } from '../components/Navbar';

export function Twin({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  const { mode } = useMode();
  const isChild = mode === 'child';
  const [selected, setSelected] = useState<BodySystem | null>(null);
  const [autoRot, setAutoRot] = useState(false);

  return (
    <div className="animate-fade-in py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div>
            <div className="chip mb-3" style={{ background: 'color-mix(in srgb, var(--brand) 14%, transparent)', color: 'var(--brand-strong)' }}>
              <Info className="h-3.5 w-3.5" />
              {isChild ? 'This is YOU!' : 'Patient: Alex Rivera · Age 7'}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              {isChild ? 'Your Living Body' : 'The Digital Twin'}
            </h1>
            <p className="mt-3 text-muted max-w-xl">
              {isChild
                ? 'Tap the glowing dots to see how each part of your body works and what it does for you.'
                : 'Click any system to explore physiology, current metrics, and progress in plain language.'}
            </p>
          </div>
          <button
            onClick={() => setAutoRot((v) => !v)}
            className="btn btn-ghost surface text-sm"
            title="Toggle idle rotation"
          >
            <RotateCw className={`h-4 w-4 ${autoRot ? 'animate-spin-slow' : ''}`} />
            Auto-rotate
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.1fr_0.9fr] gap-6 items-start">
          {/* Body map */}
          <div className="card p-4 sm:p-6 lg:sticky lg:top-24 animate-fade-up">
            <div className={`relative mx-auto ${autoRot ? 'animate-float' : ''}`} style={{ maxWidth: 360 }}>
              <BodyMap selectedId={selected?.id ?? null} onSelect={setSelected} />
            </div>
            {/* Quick legend */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {bodySystems.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`chip transition-all ${selected?.id === s.id ? 'scale-105' : ''}`}
                  style={{
                    background: `color-mix(in srgb, ${s.color} 14%, transparent)`,
                    color: s.color,
                    outline: selected?.id === s.id ? `1.5px solid ${s.color}` : 'none',
                  }}
                >
                  <s.icon className="h-3.5 w-3.5" />
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="min-h-[420px] animate-fade-up" style={{ animationDelay: '0.05s' }}>
            <SystemPanel system={selected} onClose={() => setSelected(null)} />
          </div>

          {/* Sidebar depends on mode */}
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {isChild ? <KidSidebar onNavigate={onNavigate} /> : <ParentSidebar />}
          </div>
        </div>
      </div>
    </div>
  );
}
