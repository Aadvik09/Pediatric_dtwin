import { useState } from 'react';
import { X, Coins, ShoppingCart, Check } from 'lucide-react';
import { shopItems, type ShopItem, type Buddy } from '../data/rpg';

interface Props {
  coins: number;
  buddies: Buddy[];          // owned buddies
  buddyStates: Record<string, { level: number; hp: number; atk: number; def: number }>;
  onBuy: (item: ShopItem, targetBuddyId?: string) => void;
  onClose: () => void;
}

const rarityColor: Record<string, string> = { common: '#94a3b8', rare: '#2563eb', legendary: '#d97706' };

export function ShopOverlay({ coins, buddies, buddyStates, onBuy, onClose }: Props) {
  const [tab, setTab] = useState<'items' | 'boosts'>('items');
  const [target, setTarget] = useState<string>(buddies[0]?.id ?? '');
  const [bought, setBought] = useState<string | null>(null);

  const buy = (item: ShopItem) => {
    if (coins < item.price) return;
    if (item.type === 'boost' && !target) return;
    onBuy(item, item.type === 'boost' ? target : undefined);
    setBought(item.id);
    setTimeout(() => setBought(null), 1200);
  };

  const items = shopItems.filter((i) => tab === 'items' ? i.type === 'potion' : i.type === 'boost');

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-3 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-2xl card overflow-hidden animate-pop" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <span className="grid place-items-center h-10 w-10 rounded-xl text-white" style={{ background: 'linear-gradient(135deg,#fbbf24,#ea8a00)' }}>
              <ShoppingCart className="h-5 w-5" />
            </span>
            <div>
              <div className="font-bold text-lg">Health Shop</div>
              <div className="text-xs text-muted flex items-center gap-1"><Coins className="h-3 w-3" /> {coins} coins</div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost h-9 w-9 p-0"><X className="h-5 w-5" /></button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-4">
          {(['items', 'boosts'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t ? 'text-white' : 'text-muted'}`}
              style={tab === t ? { background: 'var(--brand)' } : { background: 'var(--bg-alt)' }}
            >
              {t === 'items' ? 'Potions' : 'Stat Boosts'}
            </button>
          ))}
        </div>

        {/* Boost target selector */}
        {tab === 'boosts' && (
          <div className="px-5 pt-4">
            <div className="text-xs text-muted mb-2">Apply boost to:</div>
            <div className="flex flex-wrap gap-2">
              {buddies.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setTarget(b.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-all ${target === b.id ? 'text-white' : 'text-soft'}`}
                  style={target === b.id ? { background: 'var(--brand)' } : { background: 'var(--bg-alt)' }}
                >
                  <span>{b.emoji}</span> {b.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="p-5 grid sm:grid-cols-2 gap-3">
          {items.map((item) => {
            const afford = coins >= item.price;
            const isBought = bought === item.id;
            return (
              <div key={item.id} className="rounded-xl p-4 border" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{item.name}</div>
                    <div className="text-xs text-muted mt-0.5">{item.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => buy(item)}
                  disabled={!afford || isBought || (tab === 'boosts' && !target)}
                  className="btn w-full mt-3 text-sm disabled:opacity-40"
                  style={isBought ? { background: '#10b981', color: '#fff' } : afford ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--bg-alt)', color: 'var(--muted)' }}
                >
                  {isBought ? <><Check className="h-4 w-4" /> Bought!</> : <><Coins className="h-4 w-4" /> {item.price}</>}
                </button>
              </div>
            );
          })}
        </div>

        {/* Buddy stats preview */}
        {tab === 'boosts' && target && (
          <div className="px-5 pb-5">
            <div className="text-xs text-muted mb-2">Current stats:</div>
            {buddies.filter((b) => b.id === target).map((b) => {
              const st = buddyStates[b.id];
              return (
                <div key={b.id} className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'var(--bg-alt)' }}>
                  <span className="text-2xl">{b.emoji}</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{b.name} <span className="text-muted text-xs">Lv {st?.level ?? 1}</span></div>
                    <div className="flex gap-3 text-[11px] text-muted mt-0.5">
                      <span>HP {st?.hp ?? b.base.hp}</span>
                      <span>ATK {st?.atk ?? b.base.atk}</span>
                      <span>DEF {st?.def ?? b.base.def}</span>
                    </div>
                  </div>
                  <span className="type-tag" style={{ background: `color-mix(in srgb, ${rarityColor[b.rarity]} 16%, transparent)`, color: rarityColor[b.rarity] }}>{b.rarity}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
