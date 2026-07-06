import { ArrowRight, Heart, Brain, Map as MapIcon, ShieldCheck, Sparkles, Gamepad2, Stethoscope, Footprints, Activity } from 'lucide-react';
import { useMode } from '../context/ModeContext';
import { featureStats, howItWorks } from '../data/anatomy';
import type { PageId } from '../components/Navbar';

export function Home({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  const { mode } = useMode();
  const isChild = mode === 'child';

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-12 sm:pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="chip mb-5" style={{ background: 'var(--brand-soft)', color: 'var(--brand-strong)' }}>
              <Sparkles className="h-3.5 w-3.5" />
              {isChild ? 'Your health adventure starts here!' : 'A digital twin for pediatric care'}
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
              {isChild ? (
                <>Explore your body.<br /><span className="shimmer-text">Go on health quests.</span></>
              ) : (
                <>See inside the care.<br /><span className="shimmer-text">Make it less daunting.</span></>
              )}
            </h1>
            <p className="mt-6 text-lg text-muted max-w-xl leading-relaxed">
              {isChild
                ? 'Tap on your body to watch your organs come alive, then head into a full RPG adventure to collect Health Buddies and battle other trainers!'
                : 'HealthQuest turns doctor visits into an adventure. A living digital twin explains what is happening inside your child, with AI overviews of diagnoses, a location-based RPG, and a parent community.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => onNavigate('twin')} className="btn btn-primary text-base px-6 py-3">
                <Heart className="h-5 w-5" />
                {isChild ? 'Meet your body' : 'Open the Digital Twin'}
              </button>
              <button onClick={() => onNavigate('quest')} className="btn btn-outline text-base px-6 py-3">
                <MapIcon className="h-5 w-5" />
                {isChild ? 'Start the adventure' : 'Play the Quest RPG'}
              </button>
            </div>
          </div>
          <div className="relative animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <HeroVisual isChild={isChild} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {featureStats.map((s) => (
            <div key={s.label} className="card p-5 animate-fade-up">
              <div className="text-3xl font-extrabold font-display">{s.value}</div>
              <div className="text-sm text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold">How it works</h2>
          <p className="mt-3 text-muted">From "scary doctor visit" to "can we go again?"</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {howItWorks.map((step, i) => (
            <div key={step.step} className="card p-6 relative overflow-hidden animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="absolute -right-4 -top-6 text-7xl font-extrabold opacity-[0.06] font-display">{step.step}</div>
              <div className="relative">
                <div className="text-xs font-bold tracking-widest mb-3" style={{ color: 'var(--brand)' }}>STEP {step.step}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature split */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-6">
          <FeatureCard
            icon={Heart}
            title={isChild ? 'Your animated body' : 'A living digital twin'}
            text={isChild
              ? 'Click your heart, brain, lungs and more to watch them move and learn what they do — with fun facts and cool animations.'
              : 'Click any organ for detailed animated anatomy, live metrics, and AI overviews of diagnoses like asthma.'}
            cta={isChild ? 'Explore my body' : 'Open Digital Twin'}
            onClick={() => onNavigate('twin')}
            tint="#f44925"
          />
          <FeatureCard
            icon={Gamepad2}
            title={isChild ? 'A real RPG adventure' : 'A full RPG quest game'}
            text={isChild
              ? 'Walk around 4 zones, battle other trainers with your Health Buddies, buy items, and level up. Use arrow keys to move!'
              : 'A complete top-down RPG with battles, a shop, stat upgrades, and a hospital boss — turning checkups into rewards.'}
            cta={isChild ? 'Start adventure' : 'Explore Quest RPG'}
            onClick={() => onNavigate('quest')}
            tint="#10b981"
          />
        </div>
      </div>

      {/* What you can do */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold">{isChild ? 'What you can do' : 'Built for both of you'}</h2>
          <p className="mt-3 text-muted">{isChild ? 'Fun stuff just for kids!' : 'One app, two modes — designed for parents and children.'}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Pill icon={Stethoscope} title="Checkups & messaging" text="Parents see visit history, diagnoses, and prescriptions — and can message the doctor directly." />
          <Pill icon={Footprints} title="Full RPG quest" text="Explore 4 zones, battle trainers, earn coins, shop for items, and upgrade your buddies." />
          <Pill icon={Brain} title="Animated anatomy" text="Every organ is a detailed, moving diagram — a beating heart, breathing lungs, firing brain." />
          <Pill icon={ShieldCheck} title="AI overviews" text="Diagnoses come with an AI-generated explanation: what it means, next steps, and when to call." />
          <Pill icon={Gamepad2} title="Buddy battles" text="Turn-based battles with types, moves, and a hospital boss that drops a legendary buddy." />
          <Pill icon={Sparkles} title="Parent community" text="An Instagram-style feed and reels where parents share wins, tips, and support." />
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden" style={{ background: isChild ? 'linear-gradient(135deg,#fff3c6,#ffd24d)' : 'linear-gradient(135deg,#e0e9ff,#bcd4ff)' }}>
          <div className="absolute inset-0 opacity-20 world-grid" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              {isChild ? 'Ready to start your quest?' : 'Ready to make care an adventure?'}
            </h2>
            <p className="text-soft max-w-xl mx-auto mb-8">
              {isChild ? 'Jump in and meet your first Health Buddy!' : "Open the digital twin and see your child's health come to life."}
            </p>
            <button onClick={() => onNavigate('twin')} className="btn btn-primary text-base px-7 py-3.5">
              {isChild ? "Let's go!" : 'Get started'}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text, cta, onClick, tint }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string; cta: string; onClick: () => void; tint: string }) {
  return (
    <div className="card p-8 group cursor-pointer hover:-translate-y-1 transition-transform duration-300" onClick={onClick}>
      <div className="grid place-items-center h-14 w-14 rounded-2xl mb-5" style={{ background: `color-mix(in srgb, ${tint} 16%, var(--surface))`, color: tint }}>
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted leading-relaxed mb-5">{text}</p>
      <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: tint }}>
        {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  );
}

function Pill({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="card p-6 animate-fade-up">
      <div className="grid place-items-center h-11 w-11 rounded-xl mb-4" style={{ background: 'var(--bg-alt)', color: 'var(--brand)' }}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-bold text-lg mb-1.5">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{text}</p>
    </div>
  );
}

function HeroVisual({ isChild }: { isChild: boolean }) {
  const items = [
    { Icon: Heart, c: '#f44925', d: '0s' },
    { Icon: Brain, c: '#a78bfa', d: '0.4s' },
    { Icon: MapIcon, c: '#10b981', d: '0.8s' },
    { Icon: ShieldCheck, c: '#41d3a8', d: '1.2s' },
    { Icon: Sparkles, c: '#d97706', d: '0.6s' },
    { Icon: Activity, c: '#2563eb', d: '1s' },
  ];
  return (
    <div className="relative aspect-square max-w-md mx-auto">
      <div className="absolute inset-0 rounded-[2.5rem] blur-2xl opacity-40 animate-pulse-soft" style={{ background: isChild ? 'radial-gradient(circle,#fbbf24,transparent 60%)' : 'radial-gradient(circle,#60a5fa,transparent 60%)' }} />
      <div className="relative card rounded-[2.5rem] h-full p-8 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 world-grid opacity-30" />
        <div className="relative grid grid-cols-3 gap-4">
          {items.map(({ Icon, c, d }, i) => (
            <div key={i} className="grid place-items-center h-16 w-16 rounded-2xl animate-float" style={{ background: `color-mix(in srgb, ${c} 16%, var(--surface))`, color: c, animationDelay: d }}>
              <Icon className="h-8 w-8" />
            </div>
          ))}
        </div>
        <div className="relative mt-8 text-center">
          <div className="text-5xl font-extrabold font-display">7</div>
          <div className="text-sm text-muted">animated organs to explore</div>
        </div>
      </div>
    </div>
  );
}
