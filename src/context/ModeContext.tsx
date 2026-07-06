import {
  createContext, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';
import type { AgeGroup } from '../data/content';

interface ModeState {
  mode: AgeGroup;
  setMode: (m: AgeGroup) => void;
  toggle: () => void;
}

const ModeContext = createContext<ModeState | null>(null);
const STORAGE_KEY = 'healthquest:mode';

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AgeGroup>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'child' ? 'child' : 'parent';
    } catch {
      return 'parent';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('child-mode', mode === 'child');
    try { localStorage.setItem(STORAGE_KEY, mode); } catch { /* ignore */ }
  }, [mode]);

  const value = useMemo<ModeState>(() => ({
    mode,
    setMode: setModeState,
    toggle: () => setModeState((m) => (m === 'parent' ? 'child' : 'parent')),
  }), [mode]);

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}
