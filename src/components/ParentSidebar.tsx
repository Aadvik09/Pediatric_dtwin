import { Calendar, Stethoscope, Pill, FileText, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { checkups, vitals } from '../data/content';
import { useMode } from '../context/ModeContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

const statusStyle: Record<string, { color: string; label: string }> = {
  clear: { color: '#1bb88a', label: 'All clear' },
  'follow-up': { color: '#f59e0b', label: 'Follow-up' },
  monitor: { color: '#588dff', label: 'Monitoring' },
};

export function ParentSidebar() {
  const { mode } = useMode();
  const [collected] = useLocalStorage<string[]>('healthquest:buddies', []);
  if (mode !== 'parent') return null;

  const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };
  const trendColor = { up: '#1bb88a', down: '#f44925', flat: 'var(--muted)' };

  return (
    <div className="space-y-5">
      {/* Vitals */}
      <div className="card p-5 animate-fade-up">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span className="grid place-items-center h-8 w-8 rounded-lg" style={{ background: 'var(--bg-alt)', color: 'var(--brand)' }}>
            <TrendingUp className="h-4 w-4" />
          </span>
          Recent Vitals
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {vitals.map((v) => {
            const TIcon = trendIcon[v.trend];
            return (
              <div key={v.label} className="rounded-xl p-3 border" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between">
                  <v.icon className="h-4 w-4 text-muted" />
                  <span className="flex items-center gap-0.5 text-[10px] font-bold" style={{ color: trendColor[v.trend] }}>
                    <TIcon className="h-3 w-3" /> {v.trendValue}
                  </span>
                </div>
                <div className="text-xl font-bold mt-1.5 font-display">{v.value}</div>
                <div className="text-[11px] text-muted">{v.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checkups timeline */}
      <div className="card p-5 animate-fade-up" style={{ animationDelay: '0.05s' }}>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span className="grid place-items-center h-8 w-8 rounded-lg" style={{ background: 'var(--bg-alt)', color: 'var(--brand)' }}>
            <Calendar className="h-4 w-4" />
          </span>
          Checkup History
        </h3>
        <div className="relative space-y-4 before:content-[''] before:absolute before:left-3 before:top-1 before:bottom-1 before:w-px before:bg-[var(--border)]">
          {checkups.map((c) => {
            const st = statusStyle[c.status];
            return (
              <div key={c.id} className="relative pl-9">
                <span className="absolute left-1.5 top-1 h-3 w-3 rounded-full ring-4 ring-[var(--surface)]" style={{ background: st.color }} />
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-sm font-bold">{c.type}</span>
                  <span className="chip" style={{ background: `color-mix(in srgb, ${st.color} 14%, transparent)`, color: st.color }}>{st.label}</span>
                </div>
                <div className="text-xs text-muted mt-0.5">{new Date(c.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} · {c.provider}</div>
                <div className="mt-2 text-sm">
                  <div className="flex items-start gap-1.5">
                    <Stethoscope className="h-3.5 w-3.5 mt-0.5 text-muted shrink-0" />
                    <span><span className="text-muted">Diagnosis: </span>{c.diagnosis}</span>
                  </div>
                  <div className="flex items-start gap-1.5 mt-1">
                    <Pill className="h-3.5 w-3.5 mt-0.5 text-muted shrink-0" />
                    <span><span className="text-muted">Prescription: </span>{c.prescription}</span>
                  </div>
                  <div className="flex items-start gap-1.5 mt-1">
                    <FileText className="h-3.5 w-3.5 mt-0.5 text-muted shrink-0" />
                    <span className="text-muted">{c.notes}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buddies earned */}
      <div className="card p-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="font-bold text-lg mb-3">Health Buddies Earned</h3>
        <div className="text-3xl font-extrabold font-display">{collected.length} <span className="text-sm font-normal text-muted">collected</span></div>
        <p className="text-xs text-muted mt-1">See the Adventure page to collect more.</p>
      </div>
    </div>
  );
}
