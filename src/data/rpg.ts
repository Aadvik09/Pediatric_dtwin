// RPG game data: buddies, enemies, moves, types, maps, NPCs, items, shop.

export type Rarity = 'common' | 'rare' | 'legendary';

export interface Move {
  id: string;
  name: string;
  type: MoveType;
  power: number;
  pp: number;
  effect?: 'heal' | 'shield' | 'stun';
  desc: string;
}

export type MoveType = 'heart' | 'air' | 'mind' | 'shield' | 'bone' | 'vision';

export interface Buddy {
  id: string;
  name: string;
  species: string;
  emoji: string;
  color: string;
  rarity: Rarity;
  type: MoveType;
  bonus: string;
  zone: string;
  blurb: string;
  base: { hp: number; atk: number; def: number; spd: number };
  moves: Move[];
}

export const TYPE_CHART: Record<MoveType, Partial<Record<MoveType, number>>> = {
  heart: { shield: 0.5, bone: 1.5 },
  air: { mind: 1.5, shield: 0.5 },
  mind: { shield: 1.5, bone: 0.5 },
  shield: { bone: 1.5, air: 0.5 },
  bone: { vision: 1.5, mind: 0.5 },
  vision: { heart: 1.5, shield: 0.5 },
};

const m = (o: Move): Move => o;

export const ALL_MOVES: Record<string, Move> = {
  pulse: m({ id: 'pulse', name: 'Pulse Pound', type: 'heart', power: 22, pp: 20, desc: 'A steady heart-powered strike.' }),
  revive: m({ id: 'revive', name: 'Revive', type: 'heart', power: 0, pp: 5, effect: 'heal', desc: 'Restore 30 HP to yourself.' }),
  gust: m({ id: 'gust', name: 'Breath Gust', type: 'air', power: 20, pp: 20, desc: 'A blast of fresh air.' }),
  shieldup: m({ id: 'shieldup', name: 'Shield Up', type: 'shield', power: 0, pp: 8, effect: 'shield', desc: 'Raise defense for 3 turns.' }),
  boneclub: m({ id: 'boneclub', name: 'Bone Club', type: 'bone', power: 18, pp: 15, desc: 'A sturdy bone whack.' }),
  focus: m({ id: 'focus', name: 'Focus Beam', type: 'vision', power: 24, pp: 12, desc: 'A precise vision attack.' }),
  brainwave: m({ id: 'brainwave', name: 'Brain Wave', type: 'mind', power: 21, pp: 15, desc: 'A psychic ripple.' }),
  stun: m({ id: 'stun', name: 'Dizzy Stun', type: 'mind', power: 10, pp: 8, effect: 'stun', desc: 'May stun the enemy.' }),
};

export const buddies: Buddy[] = [
  { id: 'pulse-pup', name: 'Pulse Pup', species: 'Heart Hound', emoji: '🐕', color: '#f44925', rarity: 'common', type: 'heart', bonus: '+10 Heart health', zone: 'clinic', blurb: 'A loyal pup that follows checkup visits.', base: { hp: 90, atk: 16, def: 12, spd: 14 }, moves: [ALL_MOVES.pulse, ALL_MOVES.revive] },
  { id: 'breathe-bee', name: 'Breathe Bee', species: 'Air Sprite', emoji: '🐝', color: '#22d3ee', rarity: 'common', type: 'air', bonus: '+10 Lung power', zone: 'park', blurb: 'Buzzes happily when you run outdoors.', base: { hp: 70, atk: 18, def: 8, spd: 20 }, moves: [ALL_MOVES.gust, ALL_MOVES.stun] },
  { id: 'brain-bit', name: 'Brainy Bit', species: 'Neuron Noggin', emoji: '👾', color: '#a78bfa', rarity: 'rare', type: 'mind', bonus: '+20 Focus', zone: 'school', blurb: 'A clever sprite that loves learning zones.', base: { hp: 80, atk: 20, def: 10, spd: 16 }, moves: [ALL_MOVES.brainwave, ALL_MOVES.stun] },
  { id: 'shield-shell', name: 'Shield Shell', species: 'Immune Turtle', emoji: '🐢', color: '#41d3a8', rarity: 'rare', type: 'shield', bonus: '+20 Defense', zone: 'clinic', blurb: 'A sturdy companion earned at vaccine visits.', base: { hp: 110, atk: 12, def: 20, spd: 8 }, moves: [ALL_MOVES.shieldup, ALL_MOVES.boneclub] },
  { id: 'bone-bear', name: 'Bone Bear', species: 'Skeleton Cub', emoji: '🦴', color: '#94a3b8', rarity: 'rare', type: 'bone', bonus: '+20 Strength', zone: 'park', blurb: 'Grows stronger with every outdoor run.', base: { hp: 100, atk: 18, def: 14, spd: 10 }, moves: [ALL_MOVES.boneclub, ALL_MOVES.shieldup] },
  { id: 'vita-vixen', name: 'Vita Vixen', species: 'Vitamin Fox', emoji: '🦊', color: '#f59e0b', rarity: 'rare', type: 'vision', bonus: '+15 Energy', zone: 'school', blurb: 'Appears when you eat a rainbow of foods.', base: { hp: 85, atk: 19, def: 11, spd: 18 }, moves: [ALL_MOVES.focus, ALL_MOVES.gust] },
  { id: 'molar-mole', name: 'Molar Mole', species: 'Tooth Tunneler', emoji: '🦷', color: '#ffbe1f', rarity: 'common', type: 'bone', bonus: '+10 Dental', zone: 'dental', blurb: 'Pops up after a dentist checkup.', base: { hp: 75, atk: 16, def: 13, spd: 12 }, moves: [ALL_MOVES.boneclub, ALL_MOVES.focus] },
  { id: 'eye-eagle', name: 'Eye Eagle', species: 'Sight Raptor', emoji: '🦅', color: '#1bb88a', rarity: 'legendary', type: 'vision', bonus: '+30 Vision', zone: 'clinic', blurb: 'A legendary guardian of healthy vision.', base: { hp: 100, atk: 24, def: 14, spd: 22 }, moves: [ALL_MOVES.focus, ALL_MOVES.brainwave] },
  { id: 'zen-zenith', name: 'Zen Zenith', species: 'Calm Cloud', emoji: '☁️', color: '#8eb6ff', rarity: 'legendary', type: 'mind', bonus: '+30 Mind', zone: 'park', blurb: 'A serene cloud found at quiet parks.', base: { hp: 120, atk: 18, def: 18, spd: 14 }, moves: [ALL_MOVES.brainwave, ALL_MOVES.revive] },
];

export function getBuddy(id: string): Buddy | undefined {
  return buddies.find((b) => b.id === id);
}

export const STARTER_BUDDY = 'pulse-pup';

// --- Enemies (NPC trainers) ---
export interface EnemyBuddy {
  buddyId: string;
  level: number;
}
export interface Enemy {
  id: string;
  name: string;
  emoji: string;
  title: string;
  team: EnemyBuddy[];
  reward: number;
  dialogue: string;
  defeat: string;
}

export const enemies: Enemy[] = [
  { id: 'nurse-nina', name: 'Nurse Nina', emoji: '👩‍⚕️', title: 'Clinic Challenger', team: [{ buddyId: 'shield-shell', level: 3 }, { buddyId: 'pulse-pup', level: 3 }], reward: 120, dialogue: 'Let me test if your buddies are healthy enough for the road!', defeat: 'Wow, your heart is in it! Take these coins.' },
  { id: 'coach-kai', name: 'Coach Kai', emoji: '🏃', title: 'Park Rival', team: [{ buddyId: 'breathe-bee', level: 4 }, { buddyId: 'bone-bear', level: 4 }], reward: 160, dialogue: 'Think you can outrun my team? Prove it!', defeat: 'Fast learners! You earned these coins.' },
  { id: 'prof-ada', name: 'Professor Ada', emoji: '🧙‍♀️', title: 'School Master', team: [{ buddyId: 'brain-bit', level: 5 }, { buddyId: 'vita-vixen', level: 5 }], reward: 220, dialogue: 'A battle of wits awaits. Stay sharp!', defeat: 'Brilliant! Knowledge is your reward.' },
  { id: 'dr-vex', name: 'Dr. Vex', emoji: '😈', title: 'Germ Lord', team: [{ buddyId: 'eye-eagle', level: 6 }, { buddyId: 'zen-zenith', level: 6 }], reward: 400, dialogue: 'I am the source of every cough and sniffle! Face me!', defeat: 'Impossible! You have beaten the Germ Lord. Take the grand prize.' },
];

// --- Shop items ---
export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  price: number;
  type: 'potion' | 'boost';
  effect?: { heal?: number; atkUp?: number; defUp?: number };
}
export const shopItems: ShopItem[] = [
  { id: 'potion', name: 'Health Potion', emoji: '🧪', desc: 'Heal a buddy for 40 HP between battles.', price: 50, type: 'potion', effect: { heal: 40 } },
  { id: 'super-potion', name: 'Super Potion', emoji: '💉', desc: 'Heal a buddy for 80 HP between battles.', price: 100, type: 'potion', effect: { heal: 80 } },
  { id: 'atk-boost', name: 'Strength Shake', emoji: '💪', desc: 'Permanently +3 ATK to a buddy.', price: 150, type: 'boost', effect: { atkUp: 3 } },
  { id: 'def-boost', name: 'Shield Smoothie', emoji: '🥤', desc: 'Permanently +3 DEF to a buddy.', price: 150, type: 'boost', effect: { defUp: 3 } },
];

// --- Maps / levels ---
export interface NPCEncounter {
  id: string;
  enemyId: string;
  x: number;
  y: number;
  reward: string;
}
export interface LevelMap {
  id: string;
  name: string;
  emoji: string;
  width: number;
  height: number;
  walls: { x: number; y: number; w: number; h: number }[];
  npcs: NPCEncounter[];
  shop?: { x: number; y: number };
  heal?: { x: number; y: number };
  exits: { x: number; y: number; to: string; label: string }[];
  ground: string;
  wallColor: string;
}

export const levelMaps: LevelMap[] = [
  {
    id: 'clinic',
    name: 'Health Clinic',
    emoji: '🏥',
    width: 1280, height: 800,
    walls: [
      { x: 0, y: 0, w: 1280, h: 40 },
      { x: 0, y: 760, w: 1280, h: 40 },
      { x: 0, y: 0, w: 40, h: 800 },
      { x: 1240, y: 0, w: 40, h: 800 },
      { x: 300, y: 200, w: 40, h: 160 },
      { x: 820, y: 120, w: 40, h: 200 },
      { x: 600, y: 480, w: 200, h: 40 },
    ],
    npcs: [
      { id: 'npc-nina', enemyId: 'nurse-nina', x: 1000, y: 300, reward: '120 coins' },
    ],
    shop: { x: 180, y: 600 },
    heal: { x: 640, y: 300 },
    exits: [{ x: 1240, y: 400, to: 'park', label: '→ Park' }],
    ground: '#e8f0fa',
    wallColor: '#a8c3e8',
  },
  {
    id: 'park',
    name: 'Adventure Park',
    emoji: '🌳',
    width: 1280, height: 800,
    walls: [
      { x: 0, y: 0, w: 1280, h: 40 },
      { x: 0, y: 760, w: 1280, h: 40 },
      { x: 0, y: 0, w: 40, h: 800 },
      { x: 1240, y: 0, w: 40, h: 800 },
      { x: 400, y: 300, w: 120, h: 120 },
      { x: 800, y: 200, w: 100, h: 100 },
      { x: 200, y: 500, w: 80, h: 80 },
    ],
    npcs: [
      { id: 'npc-kai', enemyId: 'coach-kai', x: 1000, y: 500, reward: '160 coins' },
    ],
    shop: { x: 1080, y: 200 },
    heal: { x: 640, y: 640 },
    exits: [
      { x: 40, y: 400, to: 'clinic', label: '← Clinic' },
      { x: 640, y: 40, to: 'school', label: '↑ School' },
    ],
    ground: '#e3f2e6',
    wallColor: '#a8d3b0',
  },
  {
    id: 'school',
    name: 'Learning Hub',
    emoji: '🏫',
    width: 1280, height: 800,
    walls: [
      { x: 0, y: 0, w: 1280, h: 40 },
      { x: 0, y: 760, w: 1280, h: 40 },
      { x: 0, y: 0, w: 40, h: 800 },
      { x: 1240, y: 0, w: 40, h: 800 },
      { x: 400, y: 200, w: 40, h: 160 },
      { x: 820, y: 400, w: 40, h: 200 },
      { x: 200, y: 560, w: 300, h: 40 },
    ],
    npcs: [
      { id: 'npc-ada', enemyId: 'prof-ada', x: 1000, y: 300, reward: '220 coins' },
    ],
    shop: { x: 200, y: 200 },
    heal: { x: 640, y: 600 },
    exits: [
      { x: 640, y: 760, to: 'park', label: '↓ Park' },
      { x: 1240, y: 400, to: 'hospital', label: '→ Hospital' },
    ],
    ground: '#f0e8f8',
    wallColor: '#c0a8d8',
  },
  {
    id: 'hospital',
    name: 'Grand Hospital',
    emoji: '🏨',
    width: 1280, height: 800,
    walls: [
      { x: 0, y: 0, w: 1280, h: 40 },
      { x: 0, y: 760, w: 1280, h: 40 },
      { x: 0, y: 0, w: 40, h: 800 },
      { x: 1240, y: 0, w: 40, h: 800 },
      { x: 300, y: 300, w: 200, h: 40 },
      { x: 780, y: 300, w: 200, h: 40 },
      { x: 300, y: 500, w: 200, h: 40 },
      { x: 780, y: 500, w: 200, h: 40 },
    ],
    npcs: [
      { id: 'npc-vex', enemyId: 'dr-vex', x: 640, y: 400, reward: '400 coins + Legendary' },
    ],
    shop: { x: 180, y: 640 },
    heal: { x: 1100, y: 640 },
    exits: [{ x: 40, y: 400, to: 'school', label: '← School' }],
    ground: '#fde8e8',
    wallColor: '#e8a8a8',
  },
];

export function getLevel(id: string): LevelMap | undefined {
  return levelMaps.find((l) => l.id === id);
}
