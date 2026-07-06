import { useEffect, useState } from 'react';
import { Sparkles, Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { SystemDiagnosis } from '../data/anatomy';

const severityStyle: Record<string, { color: string; label: string }> = {
  mild: { color: '#10b981', label: 'Mild' },
  moderate: { color: '#d97706', label: 'Moderate' },
  managed: { color: '#2563eb', label: 'Managed' },
};

interface Props {
  diagnosis: SystemDiagnosis;
  systemName: string;
}

/** Streams an AI overview token-by-token for a diagnosis. */
export function AIOView({ diagnosis, systemName }: Props) {
  const [stage, setStage] = useState<'idle' | 'thinking' | 'done'>('idle');
  const [typed, setTyped] = useState('');

  const full = [
    `${diagnosis.aiOverview.summary}`,
    `\n\nWhat this means:`,
    ...diagnosis.aiOverview.whatItMeans.map((x) => `\n• ${x}`),
    `\n\nNext steps:`,
    ...diagnosis.aiOverview.nextSteps.map((x) => `\n• ${x}`),
    `\n\nSigns to call the doctor:`,
    ...diagnosis.aiOverview.signsToCall.map((x) => `\n• ${x}`),
  ].join('');

  useEffect(() => {
    if (stage !== 'thinking') return;
    let i = 0;
    const id = setInterval(() => {
      i += 3;
      setTyped(full.slice(0, i));
      if (i >= full.length) { clearInterval(id); setStage('done'); }
    }, 18);
    return () => clearInterval(id);
  }, [stage, full]);

  if (stage === 'idle') {
    return (
      <button
        onClick={() => setStage('thinking')}
        className="w-full rounded-xl p-4 text-left flex items-center gap-3 transition-all hover:-translate-y-0.5"
        style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--brand) 10%, var(--surface)), var(--surface))', border: '1px solid var(--border)' }}
      >
        <span className="grid place-items-center h-10 w-10 rounded-xl text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))' }}>
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <div className="font-bold text-sm">Get an AI overview of {systemName}</div>
          <div className="text-xs text-muted">Explain the diagnosis, next steps, and when to call the doctor.</div>
        </div>
      </button>
    );
  }

  return (
    <div className="rounded-xl p-4 animate-fade-up" style={{ background: 'color-mix(in srgb, var(--brand) 6%, var(--surface))', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="grid place-items-center h-8 w-8 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))' }}>
          <Brain className="h-4 w-4" />
        </span>
        <div className="font-bold text-sm">AI Overview</div>
        {stage === 'thinking' && <span className="chip text-[10px] text-muted"><span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse-soft" /> Generating…</span>}
      </div>
      <div className="text-sm leading-relaxed whitespace-pre-line text-soft">
        {typed}
        {stage === 'thinking' && <span className="inline-block w-2 h-4 align-middle ml-0.5 animate-flash" style={{ background: 'var(--brand)' }} />}
      </div>
      {stage === 'done' && (
        <div className="mt-3 text-[11px] text-muted flex items-center gap-1.5 border-t pt-2" style={{ borderColor: 'var(--border)' }}>
          <Sparkles className="h-3 w-3" /> AI-generated for guidance only — not a medical diagnosis. Always consult your doctor.
        </div>
      )}
    </div>
  );
}

export function DiagnosisCard({ diagnosis, systemName }: Props) {
  const sev = severityStyle[diagnosis.severity];
  return (
    <div className="rounded-xl p-4 animate-fade-up" style={{ background: `color-mix(in srgb, ${sev.color} 8%, var(--surface))`, border: `1px solid color-mix(in srgb, ${sev.color} 30%, var(--border))` }}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full animate-pulse-soft" style={{ background: sev.color }} />
          <span className="font-bold">{diagnosis.name}</span>
        </div>
        <span className="chip" style={{ background: `color-mix(in srgb, ${sev.color} 14%, transparent)`, color: sev.color }}>{sev.label}</span>
      </div>
      <p className="text-sm text-muted mt-2">{diagnosis.short}</p>
      <div className="text-xs text-muted mt-2">Diagnosed {new Date(diagnosis.diagnosed).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
      <div className="mt-4">
        <AIOView diagnosis={diagnosis} systemName={systemName} />
      </div>
    </div>
  );
}

export function VitalRow({ label, value, trend, trendValue, status }: { label: string; value: string; trend: string; trendValue: string; status: string }) {
  const TIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const color = trend === 'up' ? '#10b981' : trend === 'down' ? '#dc2626' : 'var(--muted)';
  const sc = status === 'good' ? '#10b981' : status === 'watch' ? '#d97706' : 'var(--brand)';
  return (
    <div className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
      <span className="h-2 w-2 rounded-full" style={{ background: sc }} />
      <span className="text-sm flex-1">{label}</span>
      <span className="text-sm font-bold">{value}</span>
      <span className="flex items-center gap-0.5 text-[11px] font-semibold" style={{ color }}><TIcon className="h-3 w-3" />{trendValue}</span>
    </div>
  );
}
