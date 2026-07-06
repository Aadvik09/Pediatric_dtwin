// Anatomy data for the detailed digital twin.
// Each system has an organ renderer id that maps to an animated SVG organ.

export type AgeGroup = 'child' | 'parent';

export interface BodySystem {
  id: string;
  name: string;
  // Position of the organ's center on the body silhouette (percent 0-100)
  cx: number;
  cy: number;
  // child-facing and parent-facing copy
  childExplain: string;
  parentExplain: string;
  metrics: { label: string; value: string; status: 'good' | 'watch' | 'info' }[];
  funFact: string;
  // Optional diagnosis attached to this system
  diagnosis?: SystemDiagnosis;
}

export interface SystemDiagnosis {
  id: string;
  name: string;
  short: string;
  severity: 'mild' | 'moderate' | 'managed';
  diagnosed: string;
  // AI overview content shown when parent requests it
  aiOverview: {
    summary: string;
    whatItMeans: string[];
    nextSteps: string[];
    signsToCall: string[];
  };
}

export const bodySystems: BodySystem[] = [
  {
    id: 'brain',
    name: 'Brain',
    cx: 50,
    cy: 13,
    childExplain:
      'Your brain is the boss! It helps you think, dream, and play. It has billions of tiny messengers called neurons that zip around at super speed.',
    parentExplain:
      'Neurodevelopment on track for age. Milestones met; sleep average 9.5h. No concerns reported by school or at checkups.',
    metrics: [
      { label: 'Milestones', value: 'On track', status: 'good' },
      { label: 'Sleep', value: '9.5 h avg', status: 'good' },
      { label: 'Focus', value: 'Developing', status: 'info' },
    ],
    funFact: 'Your brain has about 86 billion neurons.',
  },
  {
    id: 'eyes',
    name: 'Eyes',
    cx: 50,
    cy: 17,
    childExplain:
      'Your eyes are tiny cameras that send pictures to your brain. You can see millions of colors and blink thousands of times a day!',
    parentExplain:
      'Vision 20/20 both eyes. Color vision normal. No strabismus. Screen time slightly above recommendation.',
    metrics: [
      { label: 'Vision', value: '20/20', status: 'good' },
      { label: 'Color', value: 'Normal', status: 'good' },
      { label: 'Screen time', value: '1.4 h/day', status: 'watch' },
    ],
    funFact: 'You blink about 15,000 times a day.',
  },
  {
    id: 'heart',
    name: 'Heart',
    cx: 49,
    cy: 42,
    childExplain:
      'Your heart is a superhero muscle that pumps blood around your whole body. It beats about 100,000 times every day — even while you sleep!',
    parentExplain:
      'Cardiovascular status healthy. Resting HR and BP within pediatric norms. No murmurs detected at last visit.',
    metrics: [
      { label: 'Resting HR', value: '88 bpm', status: 'good' },
      { label: 'BP', value: '104/66', status: 'good' },
      { label: 'Last ECG', value: 'Normal', status: 'good' },
    ],
    funFact: "A child's heart beats about 100,000 times a day.",
  },
  {
    id: 'lungs',
    name: 'Lungs',
    cx: 49,
    cy: 35,
    childExplain:
      'Your lungs are like two spongy balloons. They breathe in fresh air and send the good stuff (oxygen) to your body so you can run and play.',
    parentExplain:
      'Respiratory exam mostly clear. Mild asthma well controlled with an action plan. Peak flow consistent with age.',
    metrics: [
      { label: 'Peak Flow', value: '240 L/min', status: 'good' },
      { label: 'O₂ Sat', value: '99%', status: 'good' },
      { label: 'Asthma', value: 'Managed', status: 'watch' },
    ],
    funFact: 'You breathe about 20,000 times a day.',
    diagnosis: {
      id: 'asthma',
      name: 'Mild Asthma',
      short: 'Well-controlled intermittent asthma with an up-to-date action plan.',
      severity: 'managed',
      diagnosed: '2025-09-08',
      aiOverview: {
        summary:
          'Asthma is a common childhood condition where the airways become narrow and inflamed, making breathing harder. Alex has a mild, well-controlled form.',
        whatItMeans: [
          'Airways are sensitive to triggers like cold air, dust, or exercise.',
          'Symptoms include coughing, wheezing, or shortness of breath during a flare.',
          'With an action plan and a reliever inhaler, most kids live completely normally.',
        ],
        nextSteps: [
          'Keep the reliever inhaler (salbutamol) available at all times.',
          'Avoid known triggers; review the action plan every 6 months.',
          'Track any flares in the app so the doctor can spot patterns.',
          'Next scheduled review: March 2026.',
        ],
        signsToCall: [
          'Wheezing or coughing that does not improve after the reliever inhaler.',
          'Breathing faster than usual or struggling to finish a sentence.',
          'Lips or fingertips looking bluish.',
          'Symptoms waking the child up repeatedly at night.',
        ],
      },
    },
  },
  {
    id: 'digestive',
    name: 'Digestive',
    cx: 50,
    cy: 55,
    childExplain:
      'Your tummy turns food into fuel! A long twisty tube takes the good stuff out of what you eat and gives your body energy.',
    parentExplain:
      'GI review unremarkable. Growth and appetite stable. Fiber intake below recommended; nutrition follow-up suggested.',
    metrics: [
      { label: 'Appetite', value: 'Stable', status: 'good' },
      { label: 'Fiber', value: 'Low', status: 'watch' },
      { label: 'Allergies', value: 'None', status: 'good' },
    ],
    funFact: 'Your small intestine is about 6 meters long.',
  },
  {
    id: 'skeleton',
    name: 'Bones',
    cx: 50,
    cy: 62,
    childExplain:
      'You have 206 bones holding you up! Running and drinking milk makes them stronger. Kids actually have more bones than adults.',
    parentExplain:
      'Skeletal growth aligned with height percentile (55th). Vitamin D sufficient. Scoliosis screening negative.',
    metrics: [
      { label: 'Height', value: '118 cm', status: 'good' },
      { label: 'Vitamin D', value: 'Sufficient', status: 'good' },
      { label: 'Growth', value: '55th %ile', status: 'info' },
    ],
    funFact: 'Babies are born with about 300 bones; some fuse as you grow.',
  },
  {
    id: 'immune',
    name: 'Immune',
    cx: 62,
    cy: 46,
    childExplain:
      "Your immune system is your body's army! It fights off germs so you stay healthy. Vaccines train your army to beat the bad guys.",
    parentExplain:
      'Immunizations up to date. Last seasonal flu vaccine in October. No active infections.',
    metrics: [
      { label: 'Vaccines', value: 'Up to date', status: 'good' },
      { label: 'Flu', value: 'Current', status: 'good' },
      { label: 'Infections', value: 'None active', status: 'good' },
    ],
    funFact: 'Vaccines teach your body to fight germs before they arrive.',
  },
];

export const featureStats = [
  { value: '7', label: 'Body systems visualized' },
  { value: '4', label: 'RPG zones to explore' },
  { value: '9', label: 'Collectible Health Buddies' },
  { value: '100%', label: 'Parent transparency' },
];

export const howItWorks = [
  { step: '01', title: 'See the body', text: 'A living digital twin shows how each system works — with detailed, moving anatomy, no scary jargon.' },
  { step: '02', title: 'Go on quests', text: 'Explore a full RPG world. Visit clinics and parks, battle with your buddies, and unlock new levels.' },
  { step: '03', title: 'Track together', text: 'Parents see diagnoses, AI overviews, and visit history; kids see progress, buddies, and rewards.' },
  { step: '04', title: 'Feel in control', text: 'Understanding what is happening makes care less daunting and a lot more empowering.' },
];
