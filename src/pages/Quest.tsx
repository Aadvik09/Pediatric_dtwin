import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Navigation, Sparkles, Trophy, X, Check, AlertCircle, Crosshair, Footprints } from 'lucide-react';
import { buddies, zones, type Buddy } from '../data/content';
import { useGeolocation } from '../hooks/useGeolocation';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WORLD = { w: 1600, h: 1200, tile: 64 };
const PLAYER_SPEED = 6;

interface ZoneSpawn {
  id: string;
  x: number;
  y: number;
  buddyIds: string[];
}
interface FloatingBuddy {
  uid: string;
  buddyId: string;
  x: number;
  y: number;
  bob: number;
}

// Place zones spread across the world
const zoneSpawns: ZoneSpawn[] = [
  { id: 'clinic', x: 380, y: 360, buddyIds: ['pulse-pup', 'shield-shell', 'eye-eagle'] },
  { id: 'park', x: 1100, y: 320, buddyIds: ['breathe-bee', 'bone-bear', 'zen-zenith'] },
  { id: 'school', x: 820, y: 760, buddyIds: ['brain-bit', 'vita-vixen'] },
  { id: 'dental', x: 300, y: 880, buddyIds: ['molar-mole'] },
];

interface Props {
  onCollect?: (b: Buddy) => void;
}

export function QuestGame({ onCollect }: Props) {
  const [pos, setPos] = useState({ x: WORLD.w / 2, y: WORLD.h / 2 });
  const [facing, setFacing] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [moving, setMoving] = useState(false);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [collected, setCollected] = useLocalStorage<string[]>('healthquest:buddies', []);
  const [xp, setXp] = useLocalStorage<number>('healthquest:xp', 0);
  const [encounter, setEncounter] = useState<Buddy | null>(null);
  const [nearZone, setNearZone] = useState<ZoneSpawn | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [gpsStarted, setGpsStarted] = useState(false);
  const geo = useGeolocation();
  const keysRef = useRef(keys);
  const posRef = useRef(pos);
  const worldRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  keysRef.current = keys;
  posRef.current = pos;

  const level = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100;

  // Floating buddies in the world (visible ones not yet collected)
  const floatingBuddies = useMemo<FloatingBuddy[]>(() => {
    const list: FloatingBuddy[] = [];
    zoneSpawns.forEach((z) => {
      z.buddyIds.forEach((bid, i) => {
        if (collected.includes(bid)) return;
        const b = buddies.find((bb) => bb.id === bid)!;
        const angle = (i / z.buddyIds.length) * Math.PI * 2;
        list.push({
          uid: `${z.id}-${bid}`,
          buddyId: b.id,
          x: z.x + Math.cos(angle) * 70,
          y: z.y + Math.sin(angle) * 70,
          bob: i * 0.7,
        });
      });
    });
    return list;
  }, [collected]);

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      const k = e.key.toLowerCase();
      setKeys((prev) => new Set(prev).add(k));
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      setKeys((prev) => { const n = new Set(prev); n.delete(k); return n; });
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  // Game loop
  useEffect(() => {
    const step = () => {
      const k = keysRef.current;
      let dx = 0, dy = 0;
      if (k.has('arrowup') || k.has('w')) dy -= PLAYER_SPEED;
      if (k.has('arrowdown') || k.has('s')) dy += PLAYER_SPEED;
      if (k.has('arrowleft') || k.has('a')) dx -= PLAYER_SPEED;
      if (k.has('arrowright') || k.has('d')) dx += PLAYER_SPEED;
      const isMoving = dx !== 0 || dy !== 0;
      if (isMoving) {
        setPos((p) => ({
          x: Math.max(40, Math.min(WORLD.w - 40, p.x + dx)),
          y: Math.max(40, Math.min(WORLD.h - 40, p.y + dy)),
        }));
        if (Math.abs(dx) > Math.abs(dy)) setFacing(dx > 0 ? 'right' : 'left');
        else setFacing(dy > 0 ? 'down' : 'up');
      }
      setMoving(isMoving);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Near-zone detection + GPS zone
  useEffect(() => {
    let nearest: ZoneSpawn | null = null;
    let best = 120;
    zoneSpawns.forEach((z) => {
      const d = Math.hypot(z.x - pos.x, z.y - pos.y);
      if (d < best) { best = d; nearest = z; }
    });
    setNearZone(nearest);
  }, [pos, geo.point]);

  // Touch joystick movement
  const handleJoystick = useCallback((dir: 'up' | 'down' | 'left' | 'right' | null) => {
    if (!dir) { setKeys(new Set()); return; }
    const map = { up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright' };
    setKeys(new Set([map[dir]]));
  }, []);

  const tryCollect = (b: Buddy) => {
    if (collected.includes(b.id)) return;
    setCollected((c) => [...c, b.id]);
    setXp((x) => x + (b.rarity === 'legendary' ? 50 : b.rarity === 'rare' ? 30 : 15));
    onCollect?.(b);
    setEncounter(b);
  };

  const startGps = () => {
    setGpsStarted(true);
    geo.start();
  };

  // Camera transform — center on player
  const camStyle = useMemo(() => {
    const vx = worldRef.current?.clientWidth ?? 800;
    const vy = worldRef.current?.clientHeight ?? 600;
    return { transform: `translate3d(${vx / 2 - pos.x}px, ${vy / 2 - pos.y}px, 0)` };
  }, [pos, worldRef.current?.clientWidth, worldRef.current?.clientHeight]);

  return (
    <div className="animate-fade-in py-6 sm:py-8">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
          <div>
            <div className="chip mb-2" style={{ background: 'color-mix(in srgb, var(--brand) 14%, transparent)', color: 'var(--brand-strong)' }}>
              <MapPin className="h-3.5 w-3.5" /> Location Adventure
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Health Quest</h1>
            <p className="mt-2 text-muted text-sm">Walk to real zones, collect Health Buddies. Use arrow keys / WASD to move.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="card px-4 py-2.5 flex items-center gap-2">
              <Trophy className="h-4 w-4" style={{ color: 'var(--brand)' }} />
              <span className="font-bold">Lv {level}</span>
              <div className="h-2 w-20 rounded-full bg-[var(--bg-alt)] overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${levelProgress}%`, background: 'var(--brand)' }} />
              </div>
            </div>
            <button onClick={() => setShowMap(true)} className="btn btn-ghost surface text-sm">
              <Navigation className="h-4 w-4" /> Map
            </button>
          </div>
        </div>

        {/* World */}
        <div
          ref={worldRef}
          className="relative w-full rounded-2xl overflow-hidden border perspective"
          style={{ height: 'min(70vh, 560px)', borderColor: 'var(--border)', background: 'radial-gradient(circle at 50% 40%, #e9f5ee 0%, #d4e8dc 60%, #c3dccd 100%)' }}
          tabIndex={0}
        >
          {/* sky / ambient */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.6), transparent 50%)' }} />

          {/* World layer */}
          <div className="absolute inset-0 will-change-transform" style={camStyle}>
            <div className="relative" style={{ width: WORLD.w, height: WORLD.h }}>
              {/* ground grid */}
              <div className="absolute inset-0 world-grid" />
              {/* paths */}
              <svg className="absolute inset-0" width={WORLD.w} height={WORLD.h} style={{ opacity: 0.35 }}>
                <path d={`M ${zoneSpawns.map((z) => `${z.x} ${z.y}`).join(' L ')}`} stroke="#fff" strokeWidth="20" strokeLinecap="round" fill="none" strokeDasharray="2 14" />
              </svg>

              {/* Zones */}
              {zoneSpawns.map((z) => {
                const zone = zones.find((zz) => zz.id === z.id)!;
                const d = Math.hypot(z.x - pos.x, z.y - pos.y);
                const isNear = d < 120;
                return (
                  <div key={z.id} className="absolute" style={{ left: z.x, top: z.y, transform: 'translate(-50%,-50%)' }}>
                    {/* shadow */}
                    <div className="absolute left-1/2 top-full -translate-x-1/2 translate-y-2 h-4 w-20 rounded-full bg-black/20 blur-sm" />
                    {/* building */}
                    <div
                      className="relative rounded-2xl flex flex-col items-center justify-center text-white shadow-card transition-transform"
                      style={{
                        width: 110, height: 110,
                        background: `linear-gradient(160deg, ${zone.color}, color-mix(in srgb, ${zone.color} 60%, #000))`,
                        transform: isNear ? 'scale(1.06) translateY(-6px)' : 'scale(1)',
                        boxShadow: isNear ? `0 0 40px -8px ${zone.color}` : '0 12px 30px -12px rgba(0,0,0,0.3)',
                      }}
                    >
                      <div className="text-4xl drop-shadow">{zone.emoji}</div>
                      <div className="text-[10px] font-bold mt-1 px-2 text-center leading-tight">{zone.name}</div>
                      {isNear && <span className="absolute -top-2 -right-2 chip bg-white text-[10px]" style={{ color: zone.color }}>Near!</span>}
                    </div>
                  </div>
                );
              })}

              {/* Floating buddies */}
              {floatingBuddies.map((fb) => {
                const b = buddies.find((bb) => bb.id === fb.buddyId)!;
                const d = Math.hypot(fb.x - pos.x, fb.y - pos.y);
                const inRange = d < 70;
                return (
                  <button
                    key={fb.uid}
                    onClick={() => inRange && tryCollect(b)}
                    className="absolute grid place-items-center transition-transform"
                    style={{
                      left: fb.x, top: fb.y, transform: 'translate(-50%,-50%)',
                      animation: `float 3s ease-in-out infinite`, animationDelay: `${fb.bob}s`,
                      cursor: inRange ? 'pointer' : 'default',
                      filter: inRange ? 'drop-shadow(0 0 12px rgba(245,158,11,0.7))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
                    }}
                    aria-label={inRange ? `Collect ${b.name}` : b.name}
                  >
                    <span className="text-3xl" style={{ opacity: inRange ? 1 : 0.55 }}>{b.emoji}</span>
                    {inRange && (
                      <span className="absolute -bottom-5 chip text-[9px] animate-pop" style={{ background: 'var(--surface)', color: 'var(--brand)' }}>
                        <Footprints className="h-2.5 w-2.5" /> Collect
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Player */}
              <div className="absolute" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%,-70%)' }}>
                <div className="relative">
                  {/* shadow */}
                  <div className="absolute left-1/2 top-full -translate-x-1/2 translate-y-1 h-3 w-10 rounded-full bg-black/25 blur-sm" />
                  {/* avatar */}
                  <div
                    className="relative grid place-items-center h-12 w-12 rounded-full text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg,#588dff,#1d4ef5)', transform: moving ? 'translateY(-3px)' : 'none' }}
                  >
                    <span className="text-xl">{facing === 'up' ? '🧑‍🦱' : facing === 'down' ? '🧒' : '🧑‍🦱'}</span>
                    {/* facing indicator */}
                    <span
                      className="absolute h-2 w-2 rounded-full bg-white"
                      style={{
                        top: facing === 'up' ? 2 : 'auto',
                        bottom: facing === 'down' ? 2 : 'auto',
                        left: facing === 'left' ? 2 : 'auto',
                        right: facing === 'right' ? 2 : 'auto',
                      }}
                    />
                  </div>
                  {/* name tag */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 chip text-[9px] glass" style={{ color: 'var(--text)' }}>You</div>
                </div>
              </div>
            </div>
          </div>

          {/* HUD overlays */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
            {geo.error && (
              <div className="chip glass text-[11px]" style={{ color: 'var(--warn)' }}>
                <AlertCircle className="h-3.5 w-3.5" /> {geo.error}
              </div>
            )}
            {geo.point && (
              <div className="chip glass text-[11px]" style={{ color: 'var(--accent)' }}>
                <Crosshair className="h-3.5 w-3.5" /> GPS live · ±{Math.round(geo.point.accuracy)}m
              </div>
            )}
            {nearZone && (
              <div className="chip glass text-[11px] animate-pop" style={{ color: zones.find(z=>z.id===nearZone.id)?.color }}>
                <Sparkles className="h-3.5 w-3.5" /> Near {zones.find(z => z.id === nearZone.id)?.name}
              </div>
            )}
          </div>

          {/* GPS button */}
          {!gpsStarted && (
            <div className="absolute inset-0 grid place-items-center bg-black/30 backdrop-blur-sm">
              <div className="card p-6 max-w-sm text-center animate-pop">
                <div className="grid place-items-center h-14 w-14 rounded-2xl mx-auto mb-3" style={{ background: 'color-mix(in srgb, var(--brand) 14%, transparent)', color: 'var(--brand)' }}>
                  <Crosshair className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg">Enable location for real zones</h3>
                <p className="text-sm text-muted mt-2 mb-4">We use your location to unlock real-world quest zones. You can still play in demo mode if you skip.</p>
                <div className="flex gap-2 justify-center">
                  <button onClick={startGps} className="btn btn-primary"><Crosshair className="h-4 w-4" /> Enable GPS</button>
                  <button onClick={() => setGpsStarted(true)} className="btn btn-ghost surface">Demo mode</button>
                </div>
              </div>
            </div>
          )}

          {/* Touch joystick (mobile) */}
          <Joystick onMove={handleJoystick} />

          {/* Keyboard hint */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-2 pointer-events-none">
            <KeyHint k="↑" /><KeyHint k="←" /><KeyHint k="↓" /><KeyHint k="→" />
            <span className="text-[11px] text-muted ml-1">or WASD to move</span>
          </div>
        </div>

        {/* Zone list */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {zones.map((z) => {
            const spawn = zoneSpawns.find((s) => s.id === z.id)!;
            const owned = spawn.buddyIds.filter((id) => collected.includes(id)).length;
            return (
              <div key={z.id} className="card p-4 animate-fade-up">
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center h-10 w-10 rounded-xl text-white text-lg" style={{ background: z.color }}>{z.emoji}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-sm truncate">{z.name}</div>
                    <div className="text-xs text-muted truncate">{z.blurb}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted">Buddies: {owned}/{spawn.buddyIds.length}</span>
                  <span className="chip" style={{ background: `color-mix(in srgb, ${z.color} 14%, transparent)`, color: z.color }}>{z.reward}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Collection */}
        <div className="card p-5 mt-5">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5" style={{ color: 'var(--brand)' }} /> Buddy Collection
            <span className="text-sm text-muted font-normal">({collected.length}/{buddies.length})</span>
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2.5">
            {buddies.map((b) => {
              const owned = collected.includes(b.id);
              return (
                <div key={b.id} className="rounded-xl p-2.5 text-center border" style={{ borderColor: owned ? b.color : 'var(--border)', background: owned ? `color-mix(in srgb, ${b.color} 12%, var(--surface))` : 'var(--bg-alt)', opacity: owned ? 1 : 0.4 }}>
                  <div className="text-2xl" style={{ filter: owned ? 'none' : 'grayscale(1)' }}>{b.emoji}</div>
                  <div className="text-[10px] font-bold mt-1 truncate">{owned ? b.name : '???'}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Encounter modal */}
      {encounter && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setEncounter(null)}>
          <div className="card p-8 max-w-sm text-center animate-pop" onClick={(e) => e.stopPropagation()}>
            <div className="text-xs font-bold tracking-widest mb-2" style={{ color: 'var(--brand)' }}>BUDDY COLLECTED!</div>
            <div className="text-7xl my-4 animate-float">{encounter.emoji}</div>
            <h3 className="text-2xl font-extrabold">{encounter.name}</h3>
            <div className="text-sm text-muted mt-1">{encounter.species}</div>
            <div className="chip mx-auto mt-3" style={{ background: `color-mix(in srgb, ${encounter.color} 16%, transparent)`, color: encounter.color }}>
              <Trophy className="h-3.5 w-3.5" /> {encounter.bonus}
            </div>
            <p className="text-sm text-muted mt-4">{encounter.blurb}</p>
            <button onClick={() => setEncounter(null)} className="btn btn-primary w-full mt-5">
              <Check className="h-4 w-4" /> Awesome!
            </button>
          </div>
        </div>
      )}

      {/* Full map modal */}
      {showMap && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowMap(false)}>
          <div className="card p-6 max-w-2xl w-full animate-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Quest Map</h3>
              <button onClick={() => setShowMap(false)} className="btn btn-ghost h-9 w-9 p-0"><X className="h-5 w-5" /></button>
            </div>
            <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: 'radial-gradient(circle at 50% 40%, #e9f5ee, #c3dccd)' }}>
              <svg viewBox={`0 0 ${WORLD.w} ${WORLD.h}`} className="w-full" style={{ height: 320 }}>
                <path d={`M ${zoneSpawns.map((z) => `${z.x} ${z.y}`).join(' L ')}`} stroke="#fff" strokeWidth="16" strokeLinecap="round" fill="none" strokeDasharray="2 12" />
                {zoneSpawns.map((z) => {
                  const zone = zones.find((zz) => zz.id === z.id)!;
                  return (
                    <g key={z.id}>
                      <circle cx={z.x} cy={z.y} r="32" fill={zone.color} opacity="0.25" />
                      <circle cx={z.x} cy={z.y} r="18" fill={zone.color} />
                      <text x={z.x} y={z.y + 5} textAnchor="middle" fontSize="18">{zone.emoji}</text>
                      <text x={z.x} y={z.y + 50} textAnchor="middle" fontSize="13" fill="#3a425c" fontWeight="bold">{zone.name}</text>
                    </g>
                  );
                })}
                <circle cx={pos.x} cy={pos.y} r="14" fill="#1d4ef5" stroke="#fff" strokeWidth="3" />
                <text x={pos.x} y={pos.y - 20} textAnchor="middle" fontSize="11" fill="#1d4ef5" fontWeight="bold">You</text>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KeyHint({ k }: { k: string }) {
  return <kbd className="grid place-items-center h-7 w-7 rounded-md text-xs font-bold glass border" style={{ borderColor: 'var(--border)' }}>{k}</kbd>;
}

function Joystick({ onMove }: { onMove: (dir: 'up' | 'down' | 'left' | 'right' | null) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const press = (dir: 'up' | 'down' | 'left' | 'right') => { setActive(dir); onMove(dir); };
  const release = () => { setActive(null); onMove(null); };
  const Btn = ({ dir, label }: { dir: 'up' | 'down' | 'left' | 'right'; label: string }) => (
    <button
      onPointerDown={(e) => { e.preventDefault(); press(dir); }}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      className={`h-11 w-11 rounded-xl glass border grid place-items-center text-sm font-bold ${active === dir ? 'text-white' : ''}`}
      style={active === dir ? { background: 'var(--brand)', borderColor: 'var(--brand)' } : { borderColor: 'var(--border)' }}
    >{label}</button>
  );
  return (
    <div className="absolute bottom-3 right-3 sm:hidden">
      <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-36">
        <span /><Btn dir="up" label="↑" /><span />
        <Btn dir="left" label="←" /><span /><Btn dir="right" label="→" />
        <span /><Btn dir="down" label="↓" /><span />
      </div>
    </div>
  );
}
