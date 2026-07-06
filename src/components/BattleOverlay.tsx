import { useEffect, useRef, useState } from 'react';
import { Swords, Shield, Zap, Heart, X, Trophy, ChevronRight } from 'lucide-react';
import {
  doMove, enemyChooseMove, makeCombatant, type BattleState, type Combatant,
} from '../game/battleEngine';
import { type Buddy, type Enemy, getBuddy, type Move } from '../data/rpg';

const TYPE_COLORS: Record<string, string> = {
  heart: '#f44925', air: '#22d3ee', mind: '#a78bfa', shield: '#41d3a8', bone: '#94a3b8', vision: '#1bb88a',
};

interface Props {
  enemy: Enemy;
  playerBuddies: Buddy[];   // buddy ids actually owned/usable
  buddyLevels: Record<string, number>;
  onWin: (coins: number) => void;
  onClose: () => void;
}

export function BattleOverlay({ enemy, playerBuddies, buddyLevels, onWin, onClose }: Props) {
  const [team] = useState<Combatant[]>(() => playerBuddies.slice(0, 3).map((b) => makeCombatant(b, buddyLevels[b.id] ?? 1)));
  const [teamIdx, setTeamIdx] = useState(0);
  const [state, setState] = useState<BattleState>(() => {
    const enemyTeam = enemy.team.map((t) => makeCombatant(getBuddy(t.buddyId)!, t.level));
    return {
      player: team[0],
      enemy: enemyTeam[0],
      enemyTeam,
      enemyIndex: 0,
      log: [`${enemy.name}: "${enemy.dialogue}"`],
      turn: 'player',
      phase: 'fighting',
      reward: enemy.reward,
      enemyName: enemy.name,
      enemyEmoji: enemy.emoji,
      dialogue: enemy.dialogue,
      defeatLine: enemy.defeat,
    };
  });
  const [busy, setBusy] = useState(false);
  const [hitFlash, setHitFlash] = useState<'player' | 'enemy' | null>(null);
  const [rewarded, setRewarded] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Enemy turn
  useEffect(() => {
    if (state.phase !== 'fighting' || state.turn !== 'enemy') return;
    setBusy(true);
    const id = setTimeout(() => {
      setState((s) => {
        if (s.phase !== 'fighting') return s;
        const move = enemyChooseMove(s.enemy);
        flashHit('player');
        return doMove(s, move, 'enemy');
      });
      setBusy(false);
    }, 900);
    return () => clearTimeout(id);
  }, [state.turn, state.phase]);

  // Win / lose
  useEffect(() => {
    if (state.phase === 'won' && !rewarded) { setRewarded(true); onWin(state.reward); }
    if (state.phase === 'lost') { /* onLose called by button */ }
  }, [state.phase, rewarded, onWin, state.reward]);

  const flashHit = (side: 'player' | 'enemy') => {
    setHitFlash(side);
    setTimeout(() => setHitFlash(null), 400);
  };

  const playerMove = (move: Move) => {
    if (busy || state.turn !== 'player' || state.phase !== 'fighting') return;
    setBusy(true);
    setState((s) => { flashHit('enemy'); return doMove(s, move, 'player'); });
    setTimeout(() => setBusy(false), 500);
  };

  const swapBuddy = (idx: number) => {
    if (idx === teamIdx || team[idx].hp <= 0) return;
    setTeamIdx(idx);
    setState((s) => ({ ...s, player: team[idx], log: [`Go, ${team[idx].buddy.name}!`, ...s.log].slice(0, 10), turn: 'enemy' }));
  };

  const restart = () => {
    const freshTeam = playerBuddies.slice(0, 3).map((b) => makeCombatant(b, buddyLevels[b.id] ?? 1));
    const enemyTeam = enemy.team.map((t) => makeCombatant(getBuddy(t.buddyId)!, t.level));
    setTeamIdx(0);
    setRewarded(false);
    setState({
      player: freshTeam[0], enemy: enemyTeam[0], enemyTeam, enemyIndex: 0,
      log: [`${enemy.name}: "${enemy.dialogue}"`], turn: 'player', phase: 'fighting',
      reward: enemy.reward, enemyName: enemy.name, enemyEmoji: enemy.emoji, dialogue: enemy.dialogue, defeatLine: enemy.defeat,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-3 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl card overflow-hidden animate-pop" style={{ background: 'var(--surface)' }}>
        {/* Battle arena */}
        <div className="relative h-72 sm:h-80" style={{ background: 'linear-gradient(180deg,#1e293b,#0f172a)' }}>
          {/* arena floor */}
          <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent)' }} />
          {/* Enemy side */}
          <div className="absolute top-6 right-6 sm:right-16">
            <div className="text-right mb-2">
              <div className="text-white font-bold text-sm flex items-center gap-2 justify-end">
                <span>{state.enemyEmoji}</span> {state.enemyName}
              </div>
              <HpBar c={state.enemy} />
            </div>
            <div
              className={`text-6xl sm:text-7xl drop-shadow-2xl ${hitFlash === 'enemy' ? 'animate-shake-hit' : ''}`}
              style={{ filter: hitFlash === 'enemy' ? 'brightness(2)' : 'none' }}
            >{state.enemy.buddy.emoji}</div>
            <div className="h-3 w-20 mx-auto mt-1 rounded-full bg-black/40" />
          </div>
          {/* Player side */}
          <div className="absolute bottom-6 left-6 sm:left-16">
            <div
              className={`text-6xl sm:text-7xl drop-shadow-2xl ${state.turn === 'player' ? 'animate-bobble' : ''} ${hitFlash === 'player' ? 'animate-shake-hit' : ''}`}
              style={{ filter: hitFlash === 'player' ? 'brightness(2) saturate(0)' : 'none' }}
            >{state.player.buddy.emoji}</div>
            <div className="h-3 w-20 mx-auto mb-1 rounded-full bg-black/40" />
            <div className="mt-1">
              <div className="text-white font-bold text-sm flex items-center gap-2">
                {state.player.buddy.name} <span className="text-[10px] text-white/60">Lv {state.player.level}</span>
              </div>
              <HpBar c={state.player} />
            </div>
          </div>
          {/* VS badge */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 chip text-white text-[10px]" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Swords className="h-3 w-3" /> BATTLE
          </div>
          {/* Close (forfeit) */}
          <button onClick={onClose} className="absolute top-3 right-3 grid place-items-center h-8 w-8 rounded-lg text-white/70 hover:text-white hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Log */}
        <div className="px-5 py-3 border-y min-h-[64px]" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
          <div className="space-y-1">
            {state.log.slice(0, 3).map((l, i) => (
              <div key={i} className={`text-sm ${i === 0 ? 'font-semibold text-soft animate-fade-in' : 'text-muted'}`}>{l}</div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-5">
          {state.phase === 'fighting' ? (
            <div className="grid grid-cols-2 gap-2.5">
              {state.player.buddy.moves.map((move) => (
                <button
                  key={move.id}
                  onClick={() => playerMove(move)}
                  disabled={busy || state.turn !== 'player'}
                  className="rounded-xl p-3 text-left border transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{move.name}</span>
                    <span className="type-tag" style={{ background: `color-mix(in srgb, ${TYPE_COLORS[move.type]} 16%, transparent)`, color: TYPE_COLORS[move.type] }}>{move.type}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-muted">
                    <span className="flex items-center gap-0.5"><Zap className="h-3 w-3" /> {move.power || '—'}</span>
                    <span>PWR</span>
                    <span>PP {move.pp}</span>
                    {move.effect && <span className="flex items-center gap-0.5"><Heart className="h-3 w-3" /> {move.effect}</span>}
                  </div>
                </button>
              ))}
            </div>
          ) : state.phase === 'won' ? (
            <div className="text-center py-4">
              <div className="grid place-items-center h-16 w-16 rounded-2xl mx-auto mb-3 text-white animate-pop" style={{ background: 'linear-gradient(135deg,#fbbf24,#ea8a00)' }}>
                <Trophy className="h-8 w-8" />
              </div>
              <div className="font-bold text-xl">Victory!</div>
              <div className="text-muted text-sm mt-1">+{state.reward} coins earned</div>
              <button onClick={onClose} className="btn btn-primary mt-5"><ChevronRight className="h-4 w-4" /> Continue</button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="grid place-items-center h-16 w-16 rounded-2xl mx-auto mb-3 text-white" style={{ background: 'linear-gradient(135deg,#94a3b8,#64748b)' }}>
                <Shield className="h-8 w-8" />
              </div>
              <div className="font-bold text-xl">Defeated…</div>
              <div className="text-muted text-sm mt-1">Your buddies need to rest. Try again!</div>
              <div className="flex gap-2 justify-center mt-5">
                <button onClick={restart} className="btn btn-primary">Try again</button>
                <button onClick={onClose} className="btn btn-ghost surface">Leave</button>
              </div>
            </div>
          )}

          {/* Team switcher */}
          {state.phase === 'fighting' && team.length > 1 && (
            <div className="mt-4 flex items-center gap-2 justify-center">
              <span className="text-xs text-muted">Team:</span>
              {team.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => swapBuddy(i)}
                  disabled={t.hp <= 0 || i === teamIdx}
                  className={`relative text-2xl rounded-lg p-1 transition-all ${i === teamIdx ? 'ring-2' : 'opacity-60'}`}
                  style={i === teamIdx ? { boxShadow: '0 0 0 2px var(--brand)' } : {}}
                >
                  <span style={{ filter: t.hp <= 0 ? 'grayscale(1)' : 'none' }}>{t.buddy.emoji}</span>
                  {t.hp <= 0 && <span className="absolute inset-0 grid place-items-center text-xs">💀</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HpBar({ c }: { c: Combatant }) {
  const pct = (c.hp / c.maxHp) * 100;
  const color = pct > 50 ? '#10b981' : pct > 20 ? '#d97706' : '#dc2626';
  return (
    <div className="w-32 h-2.5 rounded-full bg-white/20 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}
