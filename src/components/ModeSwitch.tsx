import { useMode } from '../context/ModeContext';
import { Shield, Sparkles } from 'lucide-react';

export function ModeSwitch({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const { mode, toggle } = useMode();
  const isChild = mode === 'child';
  const w = size === 'sm' ? 'w-40' : 'w-48';
  const h = size === 'sm' ? 'h-9' : 'h-11';

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isChild ? 'parent' : 'child'} mode`}
      aria-pressed={isChild}
      className={`relative ${w} ${h} rounded-full surface border p-1 flex items-center transition-all duration-300 shadow-soft`}
      style={{ borderColor: 'var(--border)' }}
    >
      <span
        className="absolute top-1 bottom-1 w-1/2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          left: isChild ? 'calc(50% + 0px)' : '0',
          background: isChild
            ? 'linear-gradient(135deg, #ffd24d, #f59e0b)'
            : 'linear-gradient(135deg, #588dff, #1d4ef5)',
          boxShadow: isChild
            ? '0 6px 20px -6px rgba(245,158,11,0.6)'
            : '0 6px 20px -6px rgba(29,78,245,0.6)',
        }}
      />
      <span className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors duration-300 ${!isChild ? 'text-white' : 'text-muted'}`}>
        <Shield className="h-3.5 w-3.5" /> Parent
      </span>
      <span className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors duration-300 ${isChild ? 'text-white' : 'text-muted'}`}>
        <Sparkles className="h-3.5 w-3.5" /> Kid
      </span>
    </button>
  );
}
