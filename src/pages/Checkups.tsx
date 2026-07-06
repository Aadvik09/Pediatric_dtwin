import { useEffect, useRef, useState } from 'react';
import { Stethoscope, Pill, FileText, Send, ArrowLeft, ClipboardList, FileCheck, AlertTriangle, Activity } from 'lucide-react';
import { checkups as initialCheckups, type CheckupRecord } from '../data/social';
import { useLocalStorage } from '../hooks/useLocalStorage';

const statusStyle: Record<string, { color: string; label: string; icon: React.ComponentType<{ className?: string }> }> = {
  clear: { color: '#10b981', label: 'All clear', icon: FileCheck },
  'follow-up': { color: '#d97706', label: 'Follow-up', icon: AlertTriangle },
  monitor: { color: '#2563eb', label: 'Monitoring', icon: Activity },
};

export function Checkups() {
  const [records, setRecords] = useLocalStorage<CheckupRecord[]>('healthquest:checkups', initialCheckups);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = records.find((r) => r.id === selectedId) ?? null;

  if (selected) {
    return <CheckupDetail record={selected} onBack={() => setSelectedId(null)} onSend={(text) => {
      setRecords((rs) => rs.map((r) => r.id === selected.id ? { ...r, messages: [...r.messages, { from: 'parent', text, time: new Date().toISOString().slice(0, 16).replace('T', ' ') }] } : r));
    }} onDoctorReply={(text) => {
      setRecords((rs) => rs.map((r) => r.id === selected.id ? { ...r, messages: [...r.messages, { from: 'doctor', text, time: new Date().toISOString().slice(0, 16).replace('T', ' ') }] } : r));
    }} />;
  }

  return (
    <div className="animate-fade-in py-8">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="chip mb-3" style={{ background: 'var(--brand-soft)', color: 'var(--brand-strong)' }}>
          <ClipboardList className="h-3.5 w-3.5" /> Parent view
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Checkup History</h1>
        <p className="mt-2 text-muted">Tap any visit to see details, diagnosis, prescription, and message the doctor.</p>

        <div className="mt-8 space-y-3">
          {records.map((c, i) => {
            const st = statusStyle[c.status];
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className="card w-full p-5 text-left flex items-center gap-4 hover:-translate-y-0.5 transition-transform animate-fade-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="grid place-items-center h-12 w-12 rounded-xl shrink-0" style={{ background: `color-mix(in srgb, ${st.color} 12%, var(--surface))`, color: st.color }}>
                  <st.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold">{c.type}</span>
                    <span className="chip text-[10px]" style={{ background: `color-mix(in srgb, ${st.color} 14%, transparent)`, color: st.color }}>{st.label}</span>
                  </div>
                  <div className="text-sm text-muted mt-0.5">{new Date(c.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · {c.provider}</div>
                  <div className="text-sm text-soft mt-1 truncate">{c.diagnosis}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {c.messages.length > 0 && <span className="chip text-[10px]" style={{ background: 'var(--bg-alt)', color: 'var(--muted)' }}>{c.messages.length} msg</span>}
                  <ArrowLeft className="h-4 w-4 rotate-180 text-muted" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CheckupDetail({ record, onBack, onSend, onDoctorReply }: { record: CheckupRecord; onBack: () => void; onSend: (text: string) => void; onDoctorReply: (text: string) => void }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const st = statusStyle[record.status];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [record.messages.length]);

  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    setSending(true);
    setTimeout(() => {
      onDoctorReply(`Thanks for the update! I've noted this on Alex's chart. If anything changes before the next visit, don't hesitate to message here.`);
      setSending(false);
    }, 1600);
  };

  return (
    <div className="animate-fade-in py-8">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <button onClick={onBack} className="btn btn-ghost text-sm mb-4"><ArrowLeft className="h-4 w-4" /> Back to all visits</button>

        {/* Visit summary card */}
        <div className="card p-6 animate-fade-up">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="chip" style={{ background: `color-mix(in srgb, ${st.color} 14%, transparent)`, color: st.color }}><st.icon className="h-3.5 w-3.5" /> {st.label}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">{record.type}</h1>
              <div className="text-muted mt-1">{new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">{record.provider}</div>
              <div className="text-sm text-muted">{record.providerRole}</div>
            </div>
          </div>

          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            <DetailRow icon={Stethoscope} label="Diagnosis" value={record.diagnosis} />
            <DetailRow icon={Pill} label="Prescription" value={record.prescription} />
          </div>
          <div className="mt-3">
            <DetailRow icon={FileText} label="Notes" value={record.notes} />
          </div>
        </div>

        {/* Messaging */}
        <div className="card mt-5 flex flex-col animate-fade-up" style={{ height: 460 }}>
          <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
            <div className="grid place-items-center h-10 w-10 rounded-full text-white font-bold" style={{ background: 'var(--brand)' }}>
              {record.provider.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="font-bold text-sm">{record.provider}</div>
              <div className="text-xs text-muted flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Usually replies within a day</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3" style={{ background: 'var(--surface-2)' }}>
            <div className="text-center text-[11px] text-muted">Messages about this visit</div>
            {record.messages.length === 0 && (
              <div className="text-center text-sm text-muted py-8">No messages yet. Start the conversation below.</div>
            )}
            {record.messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'parent' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
                <div
                  className="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm"
                  style={m.from === 'parent'
                    ? { background: 'var(--brand)', color: '#fff', borderBottomRightRadius: 4 }
                    : { background: 'var(--surface)', border: '1px solid var(--border)', borderBottomLeftRadius: 4 }}
                >
                  <div>{m.text}</div>
                  <div className={`text-[10px] mt-1 ${m.from === 'parent' ? 'text-white/60' : 'text-muted'}`}>{m.time}</div>
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start animate-fade-in">
                <div className="rounded-2xl px-4 py-3 text-sm" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted animate-pulse-soft" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Message the doctor…"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm bg-transparent border focus:ring-focus"
              style={{ borderColor: 'var(--border)' }}
            />
            <button onClick={send} disabled={!text.trim()} className="btn btn-primary h-10 w-10 p-0 disabled:opacity-40">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--surface-2)' }}>
      <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-muted mb-1.5">
        <Icon className="h-3.5 w-3.5" /> {label.toUpperCase()}
      </div>
      <div className="text-sm text-soft">{value}</div>
    </div>
  );
}
