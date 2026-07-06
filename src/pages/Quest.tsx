import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MapPin, Coins, Trophy, X, Navigation, Heart as HeartIcon, ShoppingBag,
  Crosshair, AlertCircle, ArrowRight, Sparkles,
} from 'lucide-react';
import {
  enemies, getBuddy, getLevel, levelMaps, STARTER_BUDDY,
  type Buddy, type Enemy, type LevelMap, type NPCEncounter, type ShopItem,
} from '../data/rpg';
import { BattleOverlay } from '../components/BattleOverlay';
import { ShopOverlay } from '../components/ShopOverlay';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useGeolocation } from '../hooks/useGeolocation';

const SPEED = 4.5;
const PLAYER_SIZE = 36;
const INTERACT_RANGE = 70;

interface BuddyState { level: number; hp: number; atk: number; def: number; }
interface InteractTarget { kind: 'npc' | 'shop' | 'heal' | 'exit'; label: string; data?: unknown }

export function QuestGame() {
  const [collectedIds, setCollectedIds] = useLocalStorage<string[]>('healthquest:buddies', [STARTER_BUDDY]);
  const [coins, setCoins] = useLocalStorage<number>('healthquest:coins', 100);
  const [xp, setXp] = useLocalStorage<number>('healthquest:xp', 0);
  const [levelId, setLevelId] = useLocalStorage<string>('healthquest:level', 'clinic');
  const [pos, setPos] = useLocalStorage<{ x: number; y: number }>('healthquest:pos', { x: 200, y: 400 });
  const [buddyStates, setBuddyStates] = useLocalStorage<Record<string, BuddyState>>('healthquest:buddyStates', {});
  const [potions, setPotions] = useLocalStorage<number>('healthquest:potions', 2);

  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [facing, setFacing] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [moving, setMoving] = useState(false);
  const [interact, setInteract] = useState<InteractTarget | null>(null);
  const [battle, setBattle] = useState<Enemy | null>(null);
  const [shop, setShop] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [gpsStarted, setGpsStarted] = useState(false);
  const geo = useGeolocation();

  const keysRef = useRef(keys);
  const posRef = useRef(pos);
  const levelRef = useRef(levelId);
  keysRef.current = keys; posRef.current = pos; levelRef.current = levelId;

  const level = getLevel(levelId)!;
  const levelNum = levelMaps.findIndex((l) => l.id === levelId) + 1;
  const playerLevel = Math.floor(xp / 100) + 1;
  const xpProgress = xp % 100;

  // Owned buddies with state
  const ownedBuddies: Buddy[] = collectedIds.map((id) => getBuddy(id)!).filter(Boolean);
  const statesFor = useCallback((b: Buddy): BuddyState => {
    return buddyStates[b.id] ?? { level: 1, hp: b.base.hp, atk: b.base.atk, def: b.base.def };
  }, [buddyStates]);

  // --- Keyboard ---
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
      if (k === 'e' || k === ' ') { tryInteract(); return; }
      setKeys((prev) => new Set(prev).add(k));
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      setKeys((prev) => { const n = new Set(prev); n.delete(k); return n; });
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interact, levelId]);

  // --- Game loop ---
  useEffect(() => {
    let raf = 0;
    const step = () => {
      const k = keysRef.current;
      let dx = 0, dy = 0;
      if (k.has('arrowup') || k.has('w')) dy -= SPEED;
      if (k.has('arrowdown') || k.has('s')) dy += SPEED;
      if (k.has('arrowleft') || k.has('a')) dx -= SPEED;
      if (k.has('arrowright') || k.has('d')) dx += SPEED;
      const isMoving = dx !== 0 || dy !== 0;
      if (isMoving) {
        setPos((p) => {
          const lvl = getLevel(levelRef.current)!;
          let nx = p.x + dx, ny = p.y + dy;
          // wall collision
          for (const w of lvl.walls) {
            const px = Math.max(w.x, Math.min(nx + PLAYER_SIZE / 2, w.x + w.w));
            const py = Math.max(w.y, Math.min(ny + PLAYER_SIZE / 2, w.y + w.h));
            if (Math.hypot(nx + PLAYER_SIZE / 2 - px, ny + PLAYER_SIZE / 2 - py) < PLAYER_SIZE / 2) {
              // push out on the smaller axis
              if (Math.abs(nx + PLAYER_SIZE / 2 - px) > Math.abs(ny + PLAYER_SIZE / 2 - py)) {
                nx = p.x;
              } else { ny = p.y; }
            }
          }
          nx = Math.max(PLAYER_SIZE / 2, Math.min(lvl.width - PLAYER_SIZE / 2, nx));
          ny = Math.max(PLAYER_SIZE / 2, Math.min(lvl.height - PLAYER_SIZE / 2, ny));
          return { x: nx, y: ny };
        });
        if (Math.abs(dx) > Math.abs(dy)) setFacing(dx > 0 ? 'right' : 'left');
        else setFacing(dy > 0 ? 'down' : 'up');
      }
      setMoving(isMoving);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [setPos]);

  // --- Interaction detection ---
  useEffect(() => {
    const lvl = level;
    const p = pos;
    let nearest: InteractTarget | null = null;
    let best = INTERACT_RANGE;
    // NPCs
    for (const npc of lvl.npcs) {
      const d = Math.hypot(npc.x - p.x, npc.y - p.y);
      if (d < best) { best = d; nearest = { kind: 'npc', label: 'Battle!', data: npc }; }
    }
    if (lvl.shop) {
      const d = Math.hypot(lvl.shop.x - p.x, lvl.shop.y - p.y);
      if (d < best) { best = d; nearest = { kind: 'shop', label: 'Shop' }; }
    }
    if (lvl.heal) {
      const d = Math.hypot(lvl.heal.x - p.x, lvl.heal.y - p.y);
      if (d < best) { best = d; nearest = { kind: 'heal', label: 'Heal station' }; }
    }
    for (const ex of lvl.exits) {
      const d = Math.hypot(ex.x - p.x, ex.y - p.y);
      if (d < best) { best = d; nearest = { kind: 'exit', label: ex.label, data: ex }; }
    }
    setInteract(nearest);
  }, [pos, level]);

  const tryInteract = useCallback(() => {
    if (!interact) return;
    if (interact.kind === 'npc') {
      const npc = interact.data as NPCEncounter;
      const e = enemies.find((en) => en.id === npc.enemyId);
      if (e) setBattle(e);
    } else if (interact.kind === 'shop') {
      setShop(true);
    } else if (interact.kind === 'heal') {
      // full heal all buddies
      setBuddyStates((prev) => {
        const next = { ...prev };
        ownedBuddies.forEach((b) => {
          next[b.id] = { ...(next[b.id] ?? { level: 1, hp: b.base.hp, atk: b.base.atk, def: b.base.def }), hp: b.base.hp };
        });
        return next;
      });
      flashToast('All buddies fully healed!');
    } else if (interact.kind === 'exit') {
      const ex = interact.data as { x: number; y: number; to: string; label: string };
      setLevelId(ex.to);
      const nextLvl = getLevel(ex.to)!;
      // place at opposite entrance
      setPos({ x: nextLvl.width / 2, y: nextLvl.height / 2 });
      flashToast(`Entered ${nextLvl.name}`);
    }
  }, [interact, ownedBuddies, setBuddyStates, setLevelId, setPos]);

  const flashToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2400); };

  // --- Battle outcomes ---
  const onWin = (reward: number) => {
    setCoins((c) => c + reward);
    setXp((x) => x + 60);
    // level up buddies
    setBuddyStates((prev) => {
      const next = { ...prev };
      ownedBuddies.forEach((b) => {
        const st = next[b.id] ?? { level: 1, hp: b.base.hp, atk: b.base.atk, def: b.base.def };
        next[b.id] = { ...st, level: st.level + 1, atk: st.atk + 2, def: st.def + 1, hp: st.hp + 6 };
      });
      return next;
    });
    // boss reward: collect a legendary buddy
    if (battle?.id === 'dr-vex' && !collectedIds.includes('zen-zenith')) {
      setCollectedIds((c) => [...c, 'zen-zenith']);
      flashToast('Legendary buddy Zen Zenith joined your team!');
    } else {
      flashToast(`Won ${reward} coins! Buddies leveled up!`);
    }
  };

  const onBuy = (item: ShopItem, targetId?: string) => {
    setCoins((c) => c - item.price);
    if (item.type === 'potion') {
      setPotions((p) => p + 1);
      flashToast(`Bought ${item.name}!`);
    } else if (item.type === 'boost' && targetId && item.effect) {
      setBuddyStates((prev) => {
        const b = getBuddy(targetId)!;
        const st = prev[targetId] ?? { level: 1, hp: b.base.hp, atk: b.base.atk, def: b.base.def };
        return { ...prev, [targetId]: { ...st, atk: st.atk + (item.effect!.atkUp ?? 0), def: st.def + (item.effect!.defUp ?? 0) } };
      });
      flashToast(`Upgraded ${getBuddy(targetId)?.name}!`);
    }
  };

  const startGps = () => { setGpsStarted(true); geo.start(); };

  // Use a potion on lead buddy
  const usePotion = () => {
    if (potions <= 0) return;
    setPotions((p) => p - 1);
    setBuddyStates((prev) => {
      const next = { ...prev };
      const b = ownedBuddies[0];
      if (b) {
        const st = next[b.id] ?? { level: 1, hp: b.base.hp, atk: b.base.atk, def: b.base.def };
        next[b.id] = { ...st, hp: Math.min(st.hp + 40, b.base.hp) };
      }
      return next;
    });
    flashToast('Used a Health Potion (+40 HP)');
  };

  const buddyLevels = useMemo(() => {
    const o: Record<string, number> = {};
    ownedBuddies.forEach((b) => { o[b.id] = statesFor(b).level; });
    return o;
  }, [ownedBuddies, statesFor]);

  // Camera
  const viewportRef = useRef<HTMLDivElement>(null);
  const cam = useMemo(() => {
    const vw = viewportRef.current?.clientWidth ?? 760;
    const vh = viewportRef.current?.clientHeight ?? 460;
    return { transform: `translate3d(${vw / 2 - pos.x}px, ${vh / 2 - pos.y}px, 0)` };
  }, [pos]);

  return (
    <div className="animate-fade-in py-6">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
          <div>
            <div className="chip mb-2" style={{ background: 'var(--brand-soft)', color: 'var(--brand-strong)' }}>
              <MapPin className="h-3.5 w-3.5" /> Zone {levelNum}: {level.name}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Health Quest RPG</h1>
            <p className="mt-1.5 text-muted text-sm">Walk with arrows/WASD. Press <kbd className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: 'var(--bg-alt)' }}>E</kbd> or <kbd className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: 'var(--bg-alt)' }}>Space</kbd> to interact.</p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <Stat icon={Coins} label="Coins" value={String(coins)} color="#d97706" />
            <Stat icon={Trophy} label="Level" value={String(playerLevel)} color="var(--brand)" />
            <Stat icon={HeartIcon} label="Buddies" value={String(ownedBuddies.length)} color="#dc2626" />
            <button onClick={() => setShowMap(true)} className="btn btn-outline text-sm"><Navigation className="h-4 w-4" /> Map</button>
          </div>
        </div>

        {/* World viewport */}
        <div
          ref={viewportRef}
          className="relative w-full rounded-2xl overflow-hidden border focus:ring-focus"
          style={{ height: 'min(72vh, 540px)', borderColor: 'var(--border)', background: level.ground, outline: 'none' }}
          tabIndex={0}
        >
          <div className="absolute inset-0 will-change-transform transition-transform" style={cam}>
            <WorldContent level={level} pos={pos} facing={facing} moving={moving} interact={interact} />
          </div>

          {/* HUD top */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
            <div className="chip glass text-[11px]"><span className="font-bold">{level.emoji} {level.name}</span></div>
            {geo.error && <div className="chip glass text-[11px]" style={{ color: 'var(--warn)' }}><AlertCircle className="h-3.5 w-3.5" /> Demo GPS</div>}
            {geo.point && <div className="chip glass text-[11px]" style={{ color: 'var(--accent)' }}><Crosshair className="h-3.5 w-3.5" /> GPS live</div>}
          </div>

          {/* XP bar top-right */}
          <div className="absolute top-3 right-3 glass rounded-xl px-3 py-2 pointer-events-none">
            <div className="text-[10px] text-muted font-bold">PLAYER LV {playerLevel}</div>
            <div className="h-1.5 w-24 rounded-full bg-[var(--bg-alt)] overflow-hidden mt-1">
              <div className="h-full rounded-full transition-all" style={{ width: `${xpProgress}%`, background: 'var(--brand)' }} />
            </div>
          </div>

          {/* Interact prompt */}
          {interact && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 chip glass animate-pop" style={{ color: 'var(--text)' }}>
              <span className="grid place-items-center h-5 w-5 rounded text-[10px] font-bold text-white" style={{ background: 'var(--brand)' }}>E</span>
              {interact.label}
            </div>
          )}

          {/* Toast */}
          {toast && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 chip glass animate-slide-up" style={{ color: 'var(--text)', background: 'color-mix(in srgb, var(--accent) 14%, var(--surface))' }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} /> {toast}
            </div>
          )}

          {/* GPS prompt */}
          {!gpsStarted && (
            <div className="absolute inset-0 grid place-items-center bg-black/30 backdrop-blur-sm">
              <div className="card p-6 max-w-sm text-center animate-pop">
                <div className="grid place-items-center h-14 w-14 rounded-2xl mx-auto mb-3" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}>
                  <Crosshair className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg">Start your adventure</h3>
                <p className="text-sm text-muted mt-2 mb-4">Enable GPS to unlock special hospital boss encounters in real clinics. Demo mode works too!</p>
                <div className="flex gap-2 justify-center">
                  <button onClick={startGps} className="btn btn-primary"><Crosshair className="h-4 w-4" /> Enable GPS</button>
                  <button onClick={() => setGpsStarted(true)} className="btn btn-outline">Demo mode</button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom action bar */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <button onClick={usePotion} disabled={potions <= 0} className="chip glass disabled:opacity-40" style={{ color: 'var(--text)' }}>
              <span className="text-base">🧪</span> {potions}
            </button>
            <button onClick={() => setShop(true)} className="chip glass" style={{ color: 'var(--text)' }}>
              <ShoppingBag className="h-3.5 w-3.5" /> Shop
            </button>
          </div>

          {/* Mobile joystick */}
          <Joystick onDir={(d) => {
            if (!d) { setKeys(new Set()); return; }
            const map = { up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright' };
            setKeys(new Set([map[d]]));
          }} />

          {/* Keyboard hint */}
          <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 pointer-events-none">
            <KeyHint k="↑" /><KeyHint k="↓" /><KeyHint k="←" /><KeyHint k="→" />
            <span className="text-[11px] text-muted ml-1">move</span>
            <KeyHint k="E" /> <span className="text-[11px] text-muted">interact</span>
          </div>
        </div>

        {/* Buddy team + map list */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-5 mt-5">
          <div className="card p-5">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><Sparkles className="h-5 w-5" style={{ color: 'var(--brand)' }} /> Your Team</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {ownedBuddies.length === 0 && <div className="text-sm text-muted col-span-3">No buddies yet — win battles to collect them!</div>}
              {ownedBuddies.slice(0, 3).map((b) => {
                const st = statesFor(b);
                return (
                  <div key={b.id} className="rounded-xl p-3 border" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{b.emoji}</span>
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate">{b.name}</div>
                        <div className="text-[10px] text-muted">Lv {st.level} · {b.species}</div>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1 text-[10px] text-muted">
                      <Bar label="HP" v={st.hp} max={b.base.hp + (st.level - 1) * 6} color="#dc2626" />
                      <Bar label="ATK" v={st.atk} max={40} color="#d97706" />
                      <Bar label="DEF" v={st.def} max={40} color="#2563eb" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><MapPin className="h-5 w-5" style={{ color: 'var(--brand)' }} /> Zones</h3>
            <div className="space-y-2">
              {levelMaps.map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => { setLevelId(l.id); setPos({ x: 200, y: 400 }); flashToast(`Travelled to ${l.name}`); }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${l.id === levelId ? 'text-white' : 'text-soft hover:bg-[var(--bg-alt)]'}`}
                  style={l.id === levelId ? { background: 'var(--brand)' } : { background: 'var(--surface-2)' }}
                >
                  <span className="text-xl">{l.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{i + 1}. {l.name}</div>
                    <div className={`text-[11px] ${l.id === levelId ? 'text-white/70' : 'text-muted'}`}>{l.npcs.length} trainer{l.npcs.length > 1 ? 's' : ''}</div>
                  </div>
                  {l.id === levelId && <ArrowRight className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Battle */}
      {battle && (
        <BattleOverlay
          enemy={battle}
          playerBuddies={ownedBuddies}
          buddyLevels={buddyLevels}
          onWin={onWin}
          onClose={() => setBattle(null)}
        />
      )}

      {/* Shop */}
      {shop && (
        <ShopOverlay
          coins={coins}
          buddies={ownedBuddies}
          buddyStates={buddyStates}
          onBuy={onBuy}
          onClose={() => setShop(false)}
        />
      )}

      {/* Map modal */}
      {showMap && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-3 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowMap(false)}>
          <div className="card p-6 max-w-2xl w-full animate-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Quest Map</h3>
              <button onClick={() => setShowMap(false)} className="btn btn-ghost h-9 w-9 p-0"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {levelMaps.map((l) => (
                <div key={l.id} className="rounded-xl p-4 border" style={{ borderColor: 'var(--border)', background: l.id === levelId ? 'var(--brand-soft)' : 'var(--surface-2)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{l.emoji}</span>
                    <span className="font-bold text-sm">{l.name}</span>
                    {l.id === levelId && <span className="chip text-[10px] ml-auto" style={{ background: 'var(--brand)', color: '#fff' }}>Here</span>}
                  </div>
                  <div className="text-xs text-muted">Trainers: {l.npcs.length} · Shop: {l.shop ? 'Yes' : 'No'} · Heal: {l.heal ? 'Yes' : 'No'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- World rendering ---------------- */
function WorldContent({ level, pos, facing, moving, interact }: {
  level: LevelMap; pos: { x: number; y: number }; facing: string; moving: boolean; interact: InteractTarget | null;
}) {
  return (
    <div className="relative" style={{ width: level.width, height: level.height }}>
      <div className="absolute inset-0 world-grid" />
      {/* Paths between features */}
      <svg className="absolute inset-0" width={level.width} height={level.height} style={{ opacity: 0.3 }}>
        <path d={`M ${[...level.npcs.map((n) => `${n.x} ${n.y}`), level.shop ? `${level.shop.x} ${level.shop.y}` : '', level.heal ? `${level.heal.x} ${level.heal.y}` : ''].filter(Boolean).join(' L ')}`} stroke="#fff" strokeWidth="20" strokeLinecap="round" fill="none" strokeDasharray="2 14" />
      </svg>

      {/* Walls */}
      {level.walls.map((w, i) => (
        <div key={i} className="absolute rounded-lg" style={{ left: w.x, top: w.y, width: w.w, height: w.h, background: level.wallColor, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.3)' }} />
      ))}

      {/* Shop */}
      {level.shop && <Feature x={level.shop.x} y={level.shop.y} emoji="🏪" label="Shop" color="#d97706" highlighted={interact?.kind === 'shop'} />}
      {/* Heal */}
      {level.heal && <Feature x={level.heal.x} y={level.heal.y} emoji="❤️" label="Heal" color="#dc2626" highlighted={interact?.kind === 'heal'} />}
      {/* Exits */}
      {level.exits.map((ex, i) => <Feature key={i} x={ex.x} y={ex.y} emoji="🚪" label={ex.label} color="#2563eb" highlighted={interact?.kind === 'exit' && (interact.data as { to: string })?.to === ex.to} />)}

      {/* NPCs */}
      {level.npcs.map((npc) => {
        const e = enemies.find((en) => en.id === npc.enemyId)!;
        return <Feature key={npc.id} x={npc.x} y={npc.y} emoji={e.emoji} label={e.name} color="#7c3aed" highlighted={interact?.kind === 'npc' && (interact.data as NPCEncounter)?.id === npc.id} npc />;
      })}

      {/* Player */}
      <div className="absolute" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%,-60%)' }}>
        <div className="relative">
          <div className="absolute left-1/2 top-full -translate-x-1/2 translate-y-1 h-3 w-9 rounded-full bg-black/25 blur-sm" />
          <div
            className="relative grid place-items-center rounded-full text-white shadow-lg"
            style={{
              width: PLAYER_SIZE, height: PLAYER_SIZE,
              background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
              transform: moving ? 'translateY(-2px)' : 'none',
              transition: 'transform 0.1s',
            }}
          >
            <span className="text-lg">🧒</span>
            <span className="absolute h-1.5 w-1.5 rounded-full bg-white" style={{
              top: facing === 'up' ? 2 : 'auto', bottom: facing === 'down' ? 2 : 'auto',
              left: facing === 'left' ? 3 : 'auto', right: facing === 'right' ? 3 : 'auto',
            }} />
          </div>
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 chip glass text-[9px]" style={{ color: 'var(--text)' }}>You</div>
        </div>
      </div>
    </div>
  );
}

function Feature({ x, y, emoji, label, color, highlighted, npc }: { x: number; y: number; emoji: string; label: string; color: string; highlighted?: boolean; npc?: boolean }) {
  return (
    <div className="absolute" style={{ left: x, top: y, transform: 'translate(-50%,-50%)' }}>
      <div className="absolute left-1/2 top-full -translate-x-1/2 translate-y-1.5 h-3 w-14 rounded-full bg-black/20 blur-sm" />
      <div
        className="relative grid place-items-center rounded-2xl text-white transition-all duration-300"
        style={{
          width: npc ? 60 : 52, height: npc ? 60 : 52,
          background: `linear-gradient(160deg, ${color}, color-mix(in srgb, ${color} 55%, #000))`,
          transform: highlighted ? 'scale(1.12) translateY(-4px)' : 'scale(1)',
          boxShadow: highlighted ? `0 0 30px -6px ${color}` : '0 8px 20px -10px rgba(0,0,0,0.4)',
        }}
      >
        <span className="text-2xl">{emoji}</span>
        {highlighted && <span className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full animate-ping-slow" style={{ background: color }} />}
      </div>
      <div className="text-center text-[10px] font-bold mt-1 px-1 rounded" style={{ color: 'var(--text)', background: 'rgba(255,255,255,0.6)' }}>{label}</div>
    </div>
  );
}

/* ---------------- Helpers ---------------- */
function Stat({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; label: string; value: string; color: string }) {
  return (
    <div className="card px-3 py-2 flex items-center gap-2">
      <Icon className="h-4 w-4" style={{ color }} />
      <div>
        <div className="text-sm font-bold leading-none">{value}</div>
        <div className="text-[10px] text-muted">{label}</div>
      </div>
    </div>
  );
}

function Bar({ label, v, max, color }: { label: string; v: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-7 text-muted">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-alt)] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, (v / max) * 100)}%`, background: color }} />
      </div>
      <span className="w-7 text-right font-semibold">{v}</span>
    </div>
  );
}

function KeyHint({ k }: { k: string }) {
  return <kbd className="grid place-items-center h-7 min-w-7 px-1 rounded-md text-xs font-bold glass border" style={{ borderColor: 'var(--border)' }}>{k}</kbd>;
}

function Joystick({ onDir }: { onDir: (d: 'up' | 'down' | 'left' | 'right' | null) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const press = (d: 'up' | 'down' | 'left' | 'right') => { setActive(d); onDir(d); };
  const release = () => { setActive(null); onDir(null); };
  const Btn = ({ d, label }: { d: 'up' | 'down' | 'left' | 'right'; label: string }) => (
    <button
      onPointerDown={(e) => { e.preventDefault(); press(d); }}
      onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
      className="h-11 w-11 rounded-xl glass border grid place-items-center text-sm font-bold"
      style={active === d ? { background: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' } : { borderColor: 'var(--border)' }}
    >{label}</button>
  );
  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:hidden">
      <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-36">
        <span /><Btn d="up" label="↑" /><span />
        <Btn d="left" label="←" /><span /><Btn d="right" label="→" />
        <span /><Btn d="down" label="↓" /><span />
      </div>
    </div>
  );
}
