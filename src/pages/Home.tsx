import { ArrowRight, Heart, Brain, Map as MapIcon, ShieldCheck, Sparkles, Gamepad2, Stethoscope, Footprints, Eye } from 'lucide-react';
import { useMode } from '../context/ModeContext';
import { featureStats, howItWorks } from '../data/content';
import { Section } from '../components/ui';
import type { PageId } from '../components/Navbar';

export function Home({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  const { mode } = useMode();
  const isChild = mode === 'child';

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <Section className="pt-12 sm:pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div
              className="chip mb-5"
              style={{ background: 'color-mix(in srgb, var(--brand) 14%, transparent)', color: 'var(--brand-strong)' }}
            >
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
                ? "Tap on your body to see how it works, then head outside to visit real places and collect Health Buddies. The more you learn, the more levels you unlock!"
                : "HealthQuest turns doctor visits into an adventure. A living digital twin explains what is happening inside your child, and a location-based game rewards healthy habits — so families feel informed, involved, and in control."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => onNavigate('twin')} className="btn btn-primary text-base px-6 py-3">
                <Heart className="h-5 w-5" />
                {isChild ? 'Meet your body' : 'Open the Digital Twin'}
              </button>
              <button onClick={() => onNavigate('quest')} className="btn btn-ghost text-base px-6 py-3 surface">
                <MapIcon className="h-5 w-5" />
                {isChild ? 'Start the adventure' : 'Try the Quest Game'}
              </button>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <HeroVisual isChild={isChild} />
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section className="py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {featureStats.map((s) => (
            <div key={s.label} className="card p-5 animate-fade-up">
              <s.icon className="h-6 w-6 mb-3" style={{ color: 'var(--brand)' }} />
              <div className="text-3xl font-extrabold font-display">{s.value}</div>
              <div className="text-sm text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section className="py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold">How it works</h2>
          <p className="mt-3 text-muted">Four simple steps from "scary doctor visit" to "can we go again?"</p>
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
      </Section>

      {/* Feature split */}
      <Section className="py-16">
        <div className="grid lg:grid-cols-2 gap-6">
          <FeatureCard
            icon={Heart}
            title={isChild ? 'Your animated body' : 'A living digital twin'}
            text={isChild
              ? 'Click your heart, brain, lungs and more to see what they do — with fun facts and cool animations.'
              : 'Click any system to see how it works, current metrics, and plain-language explanations of diagnoses and progress.'}
            cta={isChild ? 'Explore my body' : 'Open Digital Twin'}
            onClick={() => onNavigate('twin')}
            tint="#f44925"
          />
          <FeatureCard
            icon={Gamepad2}
            title={isChild ? 'A real-world adventure' : 'A Pokémon Go-style quest'}
            text={isChild
              ? 'Walk to clinics and parks in real life to unlock new levels and meet Health Buddies. Use arrow keys to explore!'
              : 'Visit real locations to unlock zones, collect buddies, and build healthy habits — with full parent transparency.'}
            cta={isChild ? 'Start adventure' : 'Explore Quest Game'}
            onClick={() => onNavigate('quest')}
            tint="#1bb88a"
          />
        </div>
      </Section>

      {/* What you can do */}
      <Section className="py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold">{isChild ? 'What you can do' : 'Built for both of you'}</h2>
          <p className="mt-3 text-muted">{isChild ? 'Fun stuff just for kids!' : 'One app, two modes — designed for parents and children.'}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Pill icon={Stethoscope} title="Checkups & diagnoses" text="Parents see recent visits, diagnoses, and prescriptions in one calm timeline." />
          <Pill icon={Footprints} title="Location quests" text="Real places become in-game zones that reward healthy visits and outdoor play." />
          <Pill icon={Brain} title="Learn by tapping" text="Every body part opens a kid-friendly explanation and a fun fact." />
          <Pill icon={ShieldCheck} title="Buddy collection" text="Earn collectible Health Buddies for milestones like vaccines and checkups." />
          <Pill icon={Eye} title="Visualize progress" text="See how conditions and growth change over time — no scary charts." />
          <Pill icon={Sparkles} title="Kid & parent modes" text="Switch themes anytime. Each mode shows what matters for that age." />
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-16">
        <div
          className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
          style={{ background: isChild ? 'linear-gradient(135deg,#fff3c6,#ffd24d)' : 'linear-gradient(135deg,#eef5ff,#d9e7ff)' }}
        >
          <div className="absolute inset-0 opacity-20 world-grid" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              {isChild ? 'Ready to start your quest?' : 'Ready to make care an adventure?'}
            </h2>
            <p className="text-muted max-w-xl mx-auto mb-8">
              {isChild ? 'Jump into the game and meet your first Health Buddy!' : 'Open the digital twin and see your child\'s health come to life.'}
            </p>
            <button onClick={() => onNavigate('twin')} className="btn btn-primary text-base px-7 py-3.5">
              {isChild ? 'Let\'s go!' : 'Get started'}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function FeatureCard({
  icon: Icon, title, text, cta, onClick, tint,
}: { icon: React.ComponentType<{ className?: string }>; title: string; text: string; cta: string; onClick: () => void; tint: string }) {
  return (
    <div className="card p-8 group cursor-pointer hover:-translate-y-1 transition-transform duration-300" onClick={onClick}>
      <div className="grid place-items-center h-14 w-14 rounded-2xl mb-5" style={{ background: `color-mix(in srgb, ${tint} 16%, transparent)`, color: tint }}>
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
  return (
    <div className="relative aspect-square max-w-md mx-auto">
      <div
        className="absolute inset-0 rounded-[2.5rem] blur-2xl opacity-50 animate-pulse-soft"
        style={{ background: isChild ? 'radial-gradient(circle,#ffd24d,transparent 60%)' : 'radial-gradient(circle,#8eb6ff,transparent 60%)' }}
      />
      <div className="relative card rounded-[2.5rem] h-full p-8 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 world-grid opacity-40" />
        {/* Floating body icons */}
        <div className="relative grid grid-cols-3 gap-4">
          {[
            { Icon: Heart, c: '#f44925', d: '0s' },
            { Icon: Brain, c: '#a78bfa', d: '0.4s' },
            { Icon: MapIcon, c: '#1bb88a', d: '0.8s' },
            { Icon: ShieldCheck, c: '#41d3a8', d: '1.2s' },
            { Icon: Sparkles, c: '#f59e0b', d: '0.6s' },
            { Icon: Stethoscope, c: '#3168fb', d: '1s' },
          ].map(({ Icon, c, d }, i) => (
            <div
              key={i}
              className="grid place-items-center h-16 w-16 rounded-2xl animate-float"
              style={{ background: `color-mix(in srgb, ${c} 16%, var(--surface))`, color: c, animationDelay: d }}
            >
              <Icon className="h-8 w-8" />
            </div>
          ))}
        </div>
        <div className="relative mt-8 text-center">
          <div className="text-5xl font-extrabold font-display">8</div>
          <div className="text-sm text-muted">body systems to explore</div>
        </div>
      </div>
    </div>
  );
}
