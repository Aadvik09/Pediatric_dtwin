import { useState } from 'react';
import { Activity, Home as HomeIcon, Heart, Map, Menu, X } from 'lucide-react';
import { useMode } from '../context/ModeContext';
import { ModeSwitch } from './ModeSwitch';

export type PageId = 'home' | 'twin' | 'quest';

const navItems: { id: PageId; label: string; childLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', childLabel: 'Home', icon: HomeIcon },
  { id: 'twin', label: 'Digital Twin', childLabel: 'My Body', icon: Heart },
  { id: 'quest', label: 'Quest Game', childLabel: 'Adventure', icon: Map },
];

export function Navbar({ page, onNavigate }: { page: PageId; onNavigate: (p: PageId) => void }) {
  const { mode } = useMode();
  const [open, setOpen] = useState(false);
  const isChild = mode === 'child';

  const go = (p: PageId) => { onNavigate(p); setOpen(false); };

  return (
    <header className="sticky top-0 z-50 glass border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center gap-3">
        <button onClick={() => go('home')} className="flex items-center gap-2.5 group shrink-0">
          <span
            className="grid place-items-center h-9 w-9 rounded-xl text-white transition-transform group-hover:scale-110 group-hover:rotate-6"
            style={{ background: isChild ? 'linear-gradient(135deg,#ffd24d,#f59e0b)' : 'linear-gradient(135deg,#588dff,#1d4ef5)' }}
          >
            <Activity className="h-5 w-5" />
          </span>
          <span className="font-display font-extrabold text-lg tracking-tight">
            Health<span style={{ color: 'var(--brand)' }}>Quest</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {navItems.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${active ? 'text-white' : 'text-muted hover:text-[var(--text)]'}`}
              >
                {active && (
                  <span
                    className="absolute inset-0 rounded-lg -z-10 animate-pop"
                    style={{ background: 'var(--brand)' }}
                  />
                )}
                <item.icon className="h-4 w-4" />
                {isChild ? item.childLabel : item.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:block">
            <ModeSwitch size="sm" />
          </div>
          <button
            className="md:hidden btn btn-ghost h-9 w-9 p-0"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t px-5 py-3 space-y-1 animate-fade-in" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${page === item.id ? 'text-white' : 'text-muted'}`}
              style={page === item.id ? { background: 'var(--brand)' } : {}}
            >
              <item.icon className="h-4 w-4" />
              {isChild ? item.childLabel : item.label}
            </button>
          ))}
          <div className="pt-2 flex justify-center">
            <ModeSwitch size="sm" />
          </div>
        </div>
      )}
    </header>
  );
}
