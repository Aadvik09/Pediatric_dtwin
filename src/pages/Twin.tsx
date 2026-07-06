import { useState } from 'react';
import { Sparkles, Activity, Info, ChevronRight } from 'lucide-react';
import { BodySilhouette } from '../components/BodySilhouette';
import { OrganRenderer } from '../components/OrganRenderers';
import { DiagnosisCard, VitalRow } from '../components/DiagnosisView';
import { bodySystems } from '../data/anatomy';
import { vitals } from '../data/social';
import { useMode } from '../context/ModeContext';
import type { PageId } from '../components/Navbar';

const statusColor: Record<string, string> = { good: '#10b981', watch: '#d97706', info: 'var(--brand)' };

export function Twin({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  const { mode } = useMode();
  const isChild = mode === 'child';
  const [selectedId, setSelectedId] = useState<string | null>('heart');
  const selected = bodySystems.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="animate-fade-in py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="chip mb-3" style={{ background: 'var(--brand-soft)', color: 'var(--brand-strong)' }}>
            <Info className="h-3.5 w-3.5" />
            {isChild ? 'This is YOU!' : 'Patient: Alex Rivera · Age 7'}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {isChild ? 'Your Living Body' : 'The Digital Twin'}
          </h1>
          <p className="mt-3 text-muted max-w-2xl">
            {isChild
              ? 'Tap a glowing dot to watch that body part come alive and learn what it does for you.'
              : 'Click any organ to see detailed, animated anatomy, live metrics, and diagnoses with AI overviews.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr_340px] gap-6 items-start">
          {/* Body silhouette */}
          <div className="card p-4 lg:sticky lg:top-24 animate-fade-up">
            <BodySilhouette selectedId={selectedId} onSelect={setSelectedId} />
            <div className="mt-2 flex flex-wrap gap-1.5 justify-center">
              {bodySystems.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`text-[11px] font-semibold px-2 py-1 rounded-lg transition-all ${selectedId === s.id ? 'text-white' : 'text-muted hover:text-[var(--text)]'}`}
                  style={selectedId === s.id ? { background: 'var(--brand)' } : { background: 'var(--bg-alt)' }}
                >{s.name}</button>
              ))}
            </div>
          </div>

          {/* Center: animated organ */}
          <div className="animate-fade-up" style={{ animationDelay: '0.05s' }}>
            {selected ? (
              <div className="card p-6 sm:p-8 flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className="chip" style={{ background: 'var(--brand-soft)', color: 'var(--brand-strong)' }}>
                    <Activity className="h-3.5 w-3.5" /> Live anatomy
                  </span>
                  {selected.diagnosis && (
                    <span className="chip text-[10px]" style={{ background: 'color-mix(in srgb, #2563eb 12%, transparent)', color: '#2563eb' }}>
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse-soft" /> Diagnosis attached
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-extrabold mb-4">{selected.name}</h2>
                <div className="relative w-full max-w-sm aspect-square">
                  <div className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse-soft" style={{ background: 'var(--brand)' }} />
                  <div className="relative h-full w-full grid place-items-center animate-pop" key={selected.id}>
                    <div className="w-full h-full" style={{ maxHeight: 360 }}>
                      <OrganRenderer systemId={selected.id} />
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-base text-soft leading-relaxed max-w-md">
                  {isChild ? selected.childExplain : selected.parentExplain}
                </p>
                <div className="mt-4 chip" style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent)' }}>
                  <Sparkles className="h-3.5 w-3.5" /> {selected.funFact}
                </div>
              </div>
            ) : (
              <div className="card p-10 text-center text-muted">Select an organ to view it.</div>
            )}
          </div>

          {/* Right: metrics + diagnosis */}
          <div className="space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {selected && (
              <>
                <div className="card p-5">
                  <div className="text-xs font-bold tracking-widest text-muted mb-3 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5" /> {isChild ? "HOW IT'S DOING" : 'METRICS'}
                  </div>
                  {selected.metrics.map((m) => (
                    <div key={m.label} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                      <span className="h-2 w-2 rounded-full" style={{ background: statusColor[m.status] }} />
                      <span className="text-sm flex-1">{m.label}</span>
                      <span className="text-sm font-bold">{m.value}</span>
                    </div>
                  ))}
                </div>

                {selected.diagnosis && (
                  <DiagnosisCard diagnosis={selected.diagnosis} systemName={selected.name} />
                )}

                {!isChild && (
                  <div className="card p-5">
                    <div className="text-xs font-bold tracking-widest text-muted mb-2">VITALS TREND</div>
                    {vitals.map((v) => (
                      <VitalRow key={v.label} {...v} />
                    ))}
                  </div>
                )}

                {isChild && (
                  <button onClick={() => onNavigate('quest')} className="card p-5 w-full text-left flex items-center gap-3 hover:-translate-y-1 transition-transform">
                    <span className="grid place-items-center h-11 w-11 rounded-xl text-white" style={{ background: 'linear-gradient(135deg,#34d399,#10b981)' }}>
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-sm">Go on an adventure!</div>
                      <div className="text-xs text-muted">Find Health Buddies</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
