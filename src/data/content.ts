import type { LucideIcon } from 'lucide-react';
import {
  Heart, Brain, Wind, Bone, Eye, Utensils, Activity, Shield, Droplet, Sparkles,
} from 'lucide-react';

export type AgeGroup = 'child' | 'parent';

export interface BodySystem {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  glow: string;
  // position on the body silhouette (percentages)
  hotspot: { cx: number; cy: number; r: number };
  childExplain: string;
  parentExplain: string;
  metrics: { label: string; value: string; status: 'good' | 'watch' | 'info' }[];
  funFact: string;
}

export const bodySystems: BodySystem[] = [
  {
    id: 'heart',
    name: 'Heart',
    icon: Heart,
    color: '#f44925',
    glow: 'rgba(244,73,37,0.55)',
    hotspot: { cx: 49, cy: 44, r: 7 },
    childExplain:
      "Your heart is a superhero muscle that pumps blood around your whole body. It beats about 100,000 times every day — even while you sleep!",
    parentExplain:
      "Cardiovascular status is healthy. Resting heart rate and blood pressure are within pediatric norms. No murmurs detected at the last visit.",
    metrics: [
      { label: 'Resting HR', value: '88 bpm', status: 'good' },
      { label: 'BP', value: '104/66', status: 'good' },
      { label: 'Last ECG', value: 'Normal', status: 'good' },
    ],
    funFact: "A child's heart beats about 100,000 times a day.",
  },
  {
    id: 'brain',
    name: 'Brain',
    icon: Brain,
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.55)',
    hotspot: { cx: 49, cy: 14, r: 9 },
    childExplain:
      "Your brain is the boss of your body! It helps you think, dream, and play games like this one. It has billions of tiny messengers called neurons.",
    parentExplain:
      "Neurodevelopment on track for age. Milestones met; no concerns reported by school or at checkups. Sleep average 9.5h.",
    metrics: [
      { label: 'Milestones', value: 'On track', status: 'good' },
      { label: 'Sleep', value: '9.5 h avg', status: 'good' },
      { label: 'Focus', value: 'Developing', status: 'info' },
    ],
    funFact: 'Your brain has about 86 billion neurons.',
  },
  {
    id: 'lungs',
    name: 'Lungs',
    icon: Wind,
    color: '#22d3ee',
    glow: 'rgba(34,211,238,0.55)',
    hotspot: { cx: 49, cy: 36, r: 8 },
    childExplain:
      "Your lungs are like two spongy balloons. They breathe in fresh air and send the good stuff (oxygen) to your body so you can run and play.",
    parentExplain:
      "Respiratory exam clear. No wheezing. Peak flow consistent with age. Asthma action plan on file but not currently triggered.",
    metrics: [
      { label: 'Peak Flow', value: '240 L/min', status: 'good' },
      { label: 'O₂ Sat', value: '99%', status: 'good' },
      { label: 'Asthma Plan', value: 'On file', status: 'info' },
    ],
    funFact: "You breathe about 20,000 times a day.",
  },
  {
    id: 'skeleton',
    name: 'Bones',
    icon: Bone,
    color: '#94a3b8',
    glow: 'rgba(148,163,184,0.55)',
    hotspot: { cx: 49, cy: 62, r: 7 },
    childExplain:
      "You have 206 bones holding you up! When you drink milk and run around, your bones get stronger. Kids actually have more bones than adults.",
    parentExplain:
      "Skeletal growth aligned with height percentile (55th). Vitamin D sufficient. Scoliosis screening negative.",
    metrics: [
      { label: 'Height', value: '118 cm', status: 'good' },
      { label: 'Vitamin D', value: 'Sufficient', status: 'good' },
      { label: 'Growth', value: '55th %ile', status: 'info' },
    ],
    funFact: 'Babies are born with about 300 bones; some fuse as you grow.',
  },
  {
    id: 'eyes',
    name: 'Eyes',
    icon: Eye,
    color: '#1bb88a',
    glow: 'rgba(27,184,138,0.55)',
    hotspot: { cx: 49, cy: 17, r: 4 },
    childExplain:
      "Your eyes are tiny cameras that send pictures to your brain. You can see millions of colors, and your eyes blink thousands of times a day!",
    parentExplain:
      "Vision screening 20/20 both eyes. Color vision normal. No strabismus. Next routine vision check in 12 months.",
    metrics: [
      { label: 'Vision', value: '20/20', status: 'good' },
      { label: 'Color', value: 'Normal', status: 'good' },
      { label: 'Screen time', value: '1.4 h/day', status: 'watch' },
    ],
    funFact: 'You blink about 15,000 times a day.',
  },
  {
    id: 'digestive',
    name: 'Tummy',
    icon: Utensils,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.55)',
    hotspot: { cx: 50, cy: 55, r: 6 },
    childExplain:
      "Your tummy turns food into fuel! It's a long twisty tube that takes the good stuff out of what you eat and gives your body energy.",
    parentExplain:
      "GI review unremarkable. Growth and appetite stable. Fiber intake below recommended; nutrition follow-up suggested.",
    metrics: [
      { label: 'Appetite', value: 'Stable', status: 'good' },
      { label: 'Fiber', value: 'Low', status: 'watch' },
      { label: 'Allergies', value: 'None', status: 'good' },
    ],
    funFact: 'Your small intestine is about 6 meters long.',
  },
  {
    id: 'immune',
    name: 'Shield',
    icon: Shield,
    color: '#41d3a8',
    glow: 'rgba(65,211,168,0.55)',
    hotspot: { cx: 62, cy: 48, r: 5 },
    childExplain:
      "Your immune system is your body's army! It fights off germs so you stay healthy. Vaccines train your army to beat the bad guys.",
    parentExplain:
      "Immunizations up to date. Last seasonal flu vaccine administered in October. No active infections.",
    metrics: [
      { label: 'Vaccines', value: 'Up to date', status: 'good' },
      { label: 'Flu', value: 'Current', status: 'good' },
      { label: 'Infections', value: 'None active', status: 'good' },
    ],
    funFact: 'Vaccines teach your body to fight germs before they arrive.',
  },
  {
    id: 'blood',
    name: 'Blood',
    icon: Droplet,
    color: '#de3516',
    glow: 'rgba(222,53,22,0.55)',
    hotspot: { cx: 36, cy: 50, r: 5 },
    childExplain:
      "Your blood is like a delivery truck! It carries oxygen and food to every part of you, and picks up the trash to keep you clean inside.",
    parentExplain:
      "CBC within normal limits. Hemoglobin 12.6 g/dL. Iron stores adequate. No anemia indicators.",
    metrics: [
      { label: 'Hemoglobin', value: '12.6 g/dL', status: 'good' },
      { label: 'Iron', value: 'Adequate', status: 'good' },
      { label: 'Type', value: 'O+', status: 'info' },
    ],
    funFact: 'Your body has about 5 liters of blood.',
  },
];

export interface VitalSummary {
  label: string;
  value: string;
  icon: LucideIcon;
  trend: 'up' | 'down' | 'flat';
  trendValue: string;
  status: 'good' | 'watch' | 'info';
}

export const vitals: VitalSummary[] = [
  { label: 'Heart Rate', value: '88 bpm', icon: Heart, trend: 'flat', trendValue: 'stable', status: 'good' },
  { label: 'Sleep', value: '9.5 h', icon: Activity, trend: 'up', trendValue: '+0.4h', status: 'good' },
  { label: 'Activity', value: '64 min', icon: Sparkles, trend: 'up', trendValue: '+12 min', status: 'good' },
  { label: 'Screen Time', value: '1.4 h', icon: Eye, trend: 'down', trendValue: '-0.3h', status: 'watch' },
];

export interface Buddy {
  id: string;
  name: string;
  species: string;
  emoji: string;
  color: string;
  rarity: 'common' | 'rare' | 'legendary';
  bonus: string;
  zone: string;
  blurb: string;
}

export const buddies: Buddy[] = [
  { id: 'pulse-pup', name: 'Pulse Pup', species: 'Heart Hound', emoji: '🐕', color: '#f44925', rarity: 'common', bonus: '+10 Heart health', zone: 'clinic', blurb: 'A loyal pup that follows checkup visits.' },
  { id: 'breathe-bee', name: 'Breathe Bee', species: 'Air Sprite', emoji: '🐝', color: '#22d3ee', rarity: 'common', bonus: '+10 Lung power', zone: 'park', blurb: 'Buzzes happily when you run outdoors.' },
  { id: 'brain-bit', name: 'Brainy Bit', species: 'Neuron Noggin', emoji: '👾', color: '#a78bfa', rarity: 'rare', bonus: '+20 Focus', zone: 'school', blurb: 'A clever sprite that loves learning zones.' },
  { id: 'shield-shell', name: 'Shield Shell', species: 'Immune Turtle', emoji: '🐢', color: '#41d3a8', rarity: 'rare', bonus: '+20 Defense', zone: 'clinic', blurb: 'A sturdy companion earned at vaccine visits.' },
  {id:'bone-bear',name:'Bone Bear',species:'Skeleton Cub',emoji:'🦴',color:'#94a3b8',rarity:'rare',bonus:'+20 Strength',zone:'park',blurb:'Grows stronger with every outdoor run.'},
  { id: 'vita-vixen', name: 'Vita Vixen', species: 'Vitamin Fox', emoji: '🦊', color: '#f59e0b', rarity: 'rare', bonus: '+15 Energy', zone: 'school', blurb: 'Appears when you eat a rainbow of foods.' },
  { id: 'molar-mole', name: 'Molar Mole', species: 'Tooth Tunneler', emoji: '🦷', color: '#ffbe1f', rarity: 'common', bonus: '+10 Dental', zone: 'dental', blurb: 'Pops up after a dentist checkup.' },
  { id: 'eye-eagle', name: 'Eye Eagle', species: 'Sight Raptor', emoji: '🦅', color: '#1bb88a', rarity: 'legendary', bonus: '+30 Vision', zone: 'clinic', blurb: 'A legendary guardian of healthy vision.' },
  { id: 'zen-zenith', name: 'Zen Zenith', species: 'Calm Cloud', emoji: '☁️', color: '#8eb6ff', rarity: 'legendary', bonus: '+30 Mind', zone: 'park', blurb: 'A serene cloud found at quiet parks.' },
];

export interface Zone {
  id: string;
  name: string;
  emoji: string;
  color: string;
  blurb: string;
  reward: string;
}

export const zones: Zone[] = [
  { id: 'clinic', name: "Doctor's Clinic", emoji: '🏥', color: '#3168fb', blurb: 'Checkups & vaccines', reward: 'Pulse Pup, Shield Shell' },
  { id: 'park', name: 'Adventure Park', emoji: '🌳', color: '#1bb88a', blurb: 'Run, play & breathe', reward: 'Breathe Bee, Bone Bear' },
  { id: 'school', name: 'Learning Hub', emoji: '🏫', color: '#a78bfa', blurb: 'Brain & focus quests', reward: 'Brainy Bit, Vita Vixen' },
  { id: 'dental', name: 'Dental Den', emoji: '🦷', color: '#22d3ee', blurb: 'Smile checkups', reward: 'Molar Mole' },
];

export interface CheckupRecord {
  id: string;
  date: string;
  type: string;
  provider: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  status: 'clear' | 'follow-up' | 'monitor';
}

export const checkups: CheckupRecord[] = [
  {
    id: 'c1',
    date: '2026-06-18',
    type: 'Wellness Visit',
    provider: 'Dr. Maya Okafor',
    diagnosis: 'Healthy, growth on track',
    prescription: '—',
    notes: 'Continue balanced diet; increase fiber. Next visit in 12 months.',
    status: 'clear',
  },
  {
    id: 'c2',
    date: '2026-04-02',
    type: 'Vision Screening',
    provider: 'Dr. Raj Patel',
    diagnosis: '20/20 both eyes',
    prescription: '—',
    notes: 'No correction needed. Limit screen time to <2h/day.',
    status: 'clear',
  },
  {
    id: 'c3',
    date: '2026-02-14',
    type: 'Dental Checkup',
    provider: 'Dr. Lena Sørensen',
    diagnosis: 'No cavities',
    prescription: 'Fluoride toothpaste',
    notes: 'One sealant applied to molar. Brush twice daily.',
    status: 'clear',
  },
  {
    id: 'c4',
    date: '2025-11-20',
    type: 'Flu Vaccine',
    provider: 'Nurse Adams',
    diagnosis: 'Seasonal immunization',
    prescription: '—',
    notes: 'No adverse reaction. Shield Buddy unlocked!',
    status: 'clear',
  },
  {
    id: 'c5',
    date: '2025-09-08',
    type: 'Asthma Review',
    provider: 'Dr. Maya Okafor',
    diagnosis: 'Mild asthma, well controlled',
    prescription: 'Salbutamol inhaler (as needed)',
    notes: 'Action plan updated. Avoid known triggers.',
    status: 'monitor',
  },
];

export const featureStats = [
  { value: '8', label: 'Body systems visualized', icon: Activity },
  { value: '4', label: 'Real-world quest zones', icon: Sparkles },
  { value: '9', label: 'Collectible Health Buddies', icon: Shield },
  { value: '100%', label: 'Parent transparency', icon: Heart },
];

export const howItWorks = [
  { step: '01', title: 'See the body', text: 'A living digital twin shows how each system works and how your child is doing — no scary jargon.' },
  { step: '02', title: 'Go on quests', text: 'Visit real places like clinics and parks to unlock new levels and meet Health Buddies.' },
  { step: '03', title: 'Track together', text: 'Parents see diagnoses & prescriptions; kids see progress, buddies, and rewards.' },
  { step: '04', title: 'Feel in control', text: 'Understanding what is happening makes care less daunting and a lot more empowering.' },
];
