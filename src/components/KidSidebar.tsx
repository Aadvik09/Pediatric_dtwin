import { Sparkles, Map, Trophy } from 'lucide-react';
import { buddies } from '../data/content';
import { useMode } from '../context/ModeContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { PageId } from './Navbar';

const rarityColor: Record<string, string> = {
  common: '#94a3b8',
  rare: '#588dff',
  legendary: '#f59e0b',
};

export function KidSidebar({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  const { mode } = useMode();
  const [collected] = useLocalStorage<string[]>('healthquest:buddies', []);
  const [xp] = useLocalStorage<number>('healthquest:xp', 0);
  if (mode !== 'child') return null;

  const level = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100;
  const allBuddies = buddies.map((b) => ({ ...b, owned: collected.includes(b.id) }));

  return (
    <div className="space-y-5">
      {/* Level card */}
      <div className="card p-5 animate-fade-up relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff3c6, #fffdf6)' }}>
        <div className="absolute inset-0 world-grid opacity-30" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5" style={{ color: '#d97706' }} />
            <span className="font-bold text-lg">Level {level}</span>
          </div>
          <div className="h-3 rounded-full bg-white/60 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${levelProgress}%`, background: 'linear-gradient(90deg,#ffd24d,#f59e0b)' }} />
          </div>
          <div className="text-xs mt-1.5" style={{ color: '#a07f43' }}>{levelProgress}/100 XP to next level</div>
        </div>
      </div>

      {/* Buddies */}
      <div className="card p-5 animate-fade-up" style={{ animationDelay: '0.05s' }}>
        <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
          <Sparkles className="h-5 w-5" style={{ color: '#d97706' }} />
          My Health Buddies
        </h3>
        <p className="text-xs text-muted mb-4">{collected.length}/{buddies.length} collected</p>
        <div className="grid grid-cols-3 gap-2.5">
          {allBuddies.map((b) => (
            <div
              key={b.id}
              className={`rounded-xl p-2.5 text-center border transition-all ${b.owned ? 'animate-pop' : ''}`}
              style={{
                borderColor: b.owned ? rarityColor[b.rarity] : 'var(--border)',
                background: b.owned ? `color-mix(in srgb, ${b.color} 12%, var(--surface))` : 'var(--bg-alt)',
                opacity: b.owned ? 1 : 0.4,
              }}
            >
              <div className="text-2xl" style={{ filter: b.owned ? 'none' : 'grayscale(1)' }}>{b.emoji}</div>
              <div className="text-[10px] font-bold mt-1 truncate">{b.owned ? b.name : '???'}</div>
              <div className="text-[8px] uppercase tracking-wide" style={{ color: rarityColor[b.rarity] }}>{b.rarity}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA to quest */}
      <button onClick={() => onNavigate('quest')} className="card p-5 w-full text-left animate-fade-up hover:-translate-y-1 transition-transform" style={{ animationDelay: '0.1s', background: 'linear-gradient(135deg,#d8faee,#effdf6)' }}>
        <div className="flex items-center gap-3">
          <span className="grid place-items-center h-11 w-11 rounded-xl text-white" style={{ background: 'linear-gradient(135deg,#41d3a8,#1bb88a)' }}>
            <Map className="h-5 w-5" />
          </span>
          <div>
            <div className="font-bold">Go on an adventure!</div>
            <div className="text-xs text-muted">Find new buddies at real places</div>
          </div>
        </div>
      </button>
    </div>
  );
}
