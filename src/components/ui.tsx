import type { ReactNode } from 'react';

export function Section({
  children, className = '',
}: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</section>;
}

export function StatCard({
  value, label, icon: Icon, accent,
}: { value: string; label: string; icon: React.ComponentType<{ className?: string }>; accent?: string }) {
  return (
    <div className="card p-5 flex items-center gap-4 animate-fade-up">
      <div
        className="grid place-items-center h-12 w-12 rounded-xl shrink-0"
        style={{ background: `color-mix(in srgb, ${accent ?? 'var(--brand)'} 16%, transparent)`, color: accent ?? 'var(--brand)' }}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold tracking-tight font-display">{value}</div>
        <div className="text-xs text-muted truncate">{label}</div>
      </div>
    </div>
  );
}

export function Badge({
  children, color, className = '',
}: { children: ReactNode; color?: string; className?: string }) {
  return (
    <span
      className={`chip ${className}`}
      style={color ? { background: `color-mix(in srgb, ${color} 16%, transparent)`, color } : { background: 'var(--bg-alt)', color: 'var(--muted)' }}
    >
      {children}
    </span>
  );
}
