import { useState } from 'react';
import { Activity, Home as HomeIcon, Heart, Gamepad2, ClipboardList, Camera, Menu, X } from 'lucide-react';
import { useMode } from '../context/ModeContext';
import { ModeSwitch } from './ModeSwitch';

export type PageId = 'home' | 'twin' | 'quest' | 'checkups' | 'media';

interface NavItem { id: PageId; parentLabel: string; childLabel: string; icon: React.ComponentType<{ className?: string }>; parentOnly?: boolean }

const navItems: NavItem[] = [
  { id: 'home', parentLabel: 'Home', childLabel: 'Home', icon: HomeIcon },
  { id: 'twin', parentLabel: 'Digital Twin', childLabel: 'My Body', icon: Heart },
  { id: 'checkups', parentLabel: 'Checkups', childLabel: 'Checkups', icon: ClipboardList, parentOnly: true },
  { id: 'media', parentLabel: 'Community', childLabel: 'Community', icon: Camera, parentOnly: true },
  { id: 'quest', parentLabel: 'Quest RPG', childLabel: 'Adventure', icon: Gamepad2 },
];

export function Navbar({ page, onNavigate }: { page: PageId; onNavigate: (p: PageId) => void }) {
  const { mode } = useMode();
  const [open, setOpen] = useState(false);
  const isChild = mode === 'child';

  const visible = navItems.filter((n) => !n.parentOnly || !isChild);
  const go = (p: PageId) => { onNavigate(p); setOpen(false); };

  return (
    <header className="sticky top-0 z-50 glass border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center gap-3">
        <button onClick={() => go('home')} className="flex items-center gap-2.5 group shrink-0">
          <span
            className="grid place-items-center h-9 w-9 rounded-xl text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
            style={{ background: isChild ? 'linear-gradient(135deg,#fbbf24,#ea8a00)' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}
          >
            <Activity className="h-5 w-5" />
          </span>
          <span className="font-display font-extrabold text-lg tracking-tight hidden sm:block">
            Health<span style={{ color: 'var(--brand)' }}>Quest</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {visible.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${active ? 'text-white' : 'text-muted hover:text-[var(--text)]'}`}
              >
                {active && <span className="absolute inset-0 rounded-lg -z-10 animate-pop" style={{ background: 'var(--brand)' }} />}
                <item.icon className="h-4 w-4" />
                {isChild ? item.childLabel : item.parentLabel}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:block"><ModeSwitch size="sm" /></div>
          <button className="md:hidden btn btn-ghost h-9 w-9 p-0" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t px-5 py-3 space-y-1 animate-fade-in" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          {visible.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${page === item.id ? 'text-white' : 'text-muted'}`}
              style={page === item.id ? { background: 'var(--brand)' } : {}}
            >
              <item.icon className="h-4 w-4" />
              {isChild ? item.childLabel : item.parentLabel}
            </button>
          ))}
          <div className="pt-2 flex justify-center"><ModeSwitch size="sm" /></div>
        </div>
      )}
    </header>
  );
}
