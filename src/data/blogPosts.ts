import mtorTensionImg from '../assets/images/protocol_mtor_tension_1794839055165.jpg';
import metabolicFlexImg from '../assets/images/protocol_metabolic_flexibility_1794839056156.jpg';
import cnsRecoveryImg from '../assets/images/protocol_cns_recovery_1794839056372.jpg';

export interface ProtocolStep {
  id: string;
  title: string;
  instruction: string;
}

export interface ProtocolPrescription {
  code: string;
  objective: string;
  metrics: { label: string; value: string; unit?: string }[];
  steps: ProtocolStep[];
  trackerPreset: {
    id: string;
    label: string;
    routineDefId: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    enableDeload?: boolean;
    note: string;
  };
}

export interface FitnessSciencePost {
  id: string;
  aliases?: string[];
  title: string;
  excerpt: string;
  publishedOn: string;
  category: string;
  readTime: string;
  image: string;
  sections: { heading: string; paragraphs: string[] }[];
  references: { label: string; url: string }[];
  protocolSpec?: ProtocolPrescription;
}

const legacyPosts: FitnessSciencePost[] = [
  {
    id: 'mtor-mechanical-tension',
    aliases: ['1'],
    title: 'The Hypertrophy Signal: mTOR and Mechanical Tension',
    excerpt:
      'Understanding the mechanotransduction pathways that trigger myofibrillar protein synthesis—and how to maximize high-threshold motor unit recruitment.',
    publishedOn: '2026-05-01',
    category: 'PHYSIOLOGY',
    readTime: '6 MIN READ',
    image: mtorTensionImg,
    sections: [
      {
        heading: 'Mechanotransduction and the mTORC1 Cascade',
        paragraphs: [
          'Skeletal muscle fibers convert physical force into biochemical growth signals through mechanosensors embedded in the sarcolemma and costameres. When high mechanical tension is applied across contracting sarcomeres—particularly near maximal fiber length—phosphatidic acid accumulates and activates the mechanistic target of rapamycin complex 1 (mTORC1).',
          'Chasing arbitrary pump or metabolic burn without meaningful force production produces inferior myofibrillar remodeling. Heavy-to-moderate loads lifted with maximal concentric intent recruit high-threshold Type II motor units from rep one or as fatigue slows bar velocity on lighter sets.',
        ],
      },
      {
        heading: 'Controlled Eccentrics and Loaded Stretch',
        paragraphs: [
          'Eccentric lengthening under load subjects titin and passive structural elements to peak mechanical strain while maintaining high cross-bridge attachment. Controlling the lowering phase for 2 to 3 seconds eliminates elastic rebound, keeps tension localized on the target prime mover, and amplifies hypertrophy signaling in the lengthened portion of the range of motion.',
          'Brief 0.5 to 1 second pauses at the stretched inflection point (e.g., bottom of an incline dumbbell press or Romanian deadlift) prevent momentum cheating and equalize effort tracking across training blocks.',
        ],
      },
      {
        heading: 'Applying Effective Reps in Your Log',
        paragraphs: [
          'The final 4 to 5 repetitions before momentary failure—where involuntary bar speed drops despite maximal push intent—account for the vast majority of hypertrophy stimulus per set. Logging RPE (8 to 9.5) alongside weight and reps ensures every working set crosses the tension threshold.',
        ],
      },
    ],
    references: [
      {
        label: 'Schoenfeld, B. J. (2010). The mechanisms of muscle hypertrophy and their application to resistance training. JSCR.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/20847704/',
      },
      {
        label: 'Wackerhage et al. (2019). Stimuli and sensors that initiate skeletal muscle hypertrophy following resistance exercise. J Appl Physiol.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30335577/',
      },
    ],
    protocolSpec: {
      code: 'HYP-MTOR-31',
      objective:
        'Maximize active mechanical tension through controlled 3-second eccentrics, full lengthened ROM, and 1–2 RIR effort.',
      metrics: [
        { label: 'Tempo Cadence', value: '3-1-1-0', unit: 'ecc-pause-con' },
        { label: 'Loading Zone', value: '6–12', unit: 'reps @ 75–85%' },
        { label: 'Target Effort', value: '8.5–9.5', unit: 'RPE' },
        { label: 'Rest Recovery', value: '120–180', unit: 'sec' },
      ],
      steps: [
        {
          id: 'mtor-step-1',
          title: 'Enforce a 3-Second Lowering Tempo',
          instruction:
            'Lower every working rep under active muscular braking for a full 3-count—never drop into the stretch.',
        },
        {
          id: 'mtor-step-2',
          title: 'Pause 1 Second at Peak Stretch',
          instruction:
            'Eliminate stretch-reflex bounce at the bottom position to force maximal cross-bridge recruitment on reversal.',
        },
        {
          id: 'mtor-step-3',
          title: 'Accelerate with Maximal Concentric Intent',
          instruction:
            'Drive the weight up explosively even as bar speed naturally slows near reps 7–10; involuntary velocity slowdown marks effective tension.',
        },
        {
          id: 'mtor-step-4',
          title: 'Track Double Progression in RIR',
          instruction:
            'Add load once you hit the top of the rep range cleanly at RPE ≤ 9 without breaking eccentric cadence.',
        },
      ],
      trackerPreset: {
        id: 'mtor-mechanical-tension',
        label: 'Load Push Tension Hypertrophy',
        routineDefId: 'push-split',
        level: 'Intermediate',
        enableDeload: false,
        note: 'Protocol HYP-MTOR-31 Active: Use 3-1-1-0 tempo (3s controlled eccentric, 1s stretch pause). Log working sets at RPE 8-9.5.',
      },
    },
  },
  {
    id: 'metabolic-flexibility',
    aliases: ['2'],
    title: 'Metabolic Flexibility: Burn Fat and Carbohydrates Efficiently',
    excerpt:
      'How to train mitochondrial density and substrate switching so you sustain high power output without mid-session glycemic crashes.',
    publishedOn: '2026-04-25',
    category: 'BIO-ENERGETICS',
    readTime: '7 MIN READ',
    image: metabolicFlexImg,
    sections: [
      {
        heading: 'What Substrate Switching Actually Means',
        paragraphs: [
          'Metabolic flexibility is the capacity of skeletal muscle mitochondria to transition smoothly between lipid oxidation during low-to-moderate exertion and glycolytic carbohydrate combustion during high-intensity bouts. Lifters with poor mitochondrial efficiency accumulate lactate rapidly at moderate workloads and experience prolonged recovery lag between heavy sets.',
          'Developing both aerobic base capacity and anaerobic repeatability directly improves work density inside the weight room: heart rate recovers faster during 90-second rest windows, preserving output on later sets.',
        ],
      },
      {
        heading: 'Polarized Conditioning Structure',
        paragraphs: [
          'Combine two distinct stimuli rather than living in moderate-fatigue junk zones: steady aerobic work at conversational pace (Zone 2, ~65–75% max HR) to expand mitochondrial volume and capillary perfusion, paired with brief high-power kettlebell or sled conditioning intervals that challenge lactate clearance.',
          'Pairing loaded carries and rhythmic posterior-chain swings trains oxygen utilization across large muscle beds without creating eccentric joint soreness that compromises primary barbell days.',
        ],
      },
      {
        heading: 'Peri-Workout Fuel Calibration',
        paragraphs: [
          'Reserve higher-glycemic carbohydrates around dense strength and glycolytic conditioning sessions when GLUT4 translocation is upregulated by muscular contraction, while keeping rest days anchored around high protein, micronutrients, and unsaturated fats.',
        ],
      },
    ],
    references: [
      {
        label: 'Goodpaster, B. H., & Sparks, L. M. (2017). Metabolic flexibility in health and disease. Cell Metabolism.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28467922/',
      },
      {
        label: 'San-Millan, I., & Brooks, G. A. (2018). Assessment of metabolic flexibility by means of measuring blood lactate, fat, and carbohydrate oxidation responses. Sports Medicine.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/28623613/',
      },
    ],
    protocolSpec: {
      code: 'BIO-FLEX-Z2',
      objective:
        'Build mitochondrial oxidative capacity and accelerate inter-set heart rate recovery through structured conditioning circuits.',
      metrics: [
        { label: 'Zone 2 Target', value: '65–75', unit: '% HRmax' },
        { label: 'Circuit Density', value: '45:30', unit: 'sec work:rest' },
        { label: 'Weekly Output', value: '2–3', unit: 'sessions / wk' },
        { label: 'Carry / Swing Effort', value: '7–8', unit: 'RPE' },
      ],
      steps: [
        {
          id: 'mf-step-1',
          title: 'Anchor 25–35 Min Zone 2 Output',
          instruction:
            'Perform nasal-breathing steady output (air bike, incline walk, or rower) keeping heart rate steady in the aerobic fat-oxidation zone.',
        },
        {
          id: 'mf-step-2',
          title: 'Execute Kettlebell & Carry Work Density',
          instruction:
            'Pair explosive hip-hinge kettlebell swings with heavy farmer carries to challenge substrate utilization without excessive DOMS.',
        },
        {
          id: 'mf-step-3',
          title: 'Monitor Heart Rate Recovery at 60s',
          instruction:
            'Measure BPM drop in the first 60 seconds after intervals; target a recovery drop of ≥ 25 bpm over 4–6 weeks.',
        },
        {
          id: 'mf-step-4',
          title: 'Match Carbohydrate Intake to Glycogen Demand',
          instruction:
            'Time fast-digesting carbs 60–90 minutes pre-session on high-density circuit days to fuel glycolytic peaks.',
        },
      ],
      trackerPreset: {
        id: 'metabolic-flexibility',
        label: 'Load Conditioning & Kettlebell Circuit',
        routineDefId: 'core-conditioning',
        level: 'Intermediate',
        enableDeload: false,
        note: 'Protocol BIO-FLEX-Z2 Active: Keep crisp 45-60s transitions across swings, carries, and conditioning blocks to train lactate clearance.',
      },
    },
  },
  {
    id: 'cns-recovery-fatigue',
    aliases: ['3'],
    title: 'CNS Recovery: The Forgotten Variable in Heavy Lifting',
    excerpt:
      'Your peripheral muscles may recover before your central motor drive does. Spot neural fatigue early and deploy a structured deload.',
    publishedOn: '2026-04-18',
    category: 'RECOVERY',
    readTime: '5 MIN READ',
    image: cnsRecoveryImg,
    sections: [
      {
        heading: 'Central vs. Peripheral Fatigue',
        paragraphs: [
          'Strength performance depends equally on muscle cross-sectional capacity and high-frequency neural drive from the motor cortex down the corticospinal tract. When systemic stress accumulates across weeks of heavy compound lifts or near-failure sets, central fatigue impairs motor-unit firing rates even if local muscle soreness has resolved.',
          'Early warning indicators include bar speed dropping abnormally on warm-up weights, persistent morning grip weakness, elevated resting heart rate, and disrupted sleep architecture.',
        ],
      },
      {
        heading: 'Strategic Deload Mechanics',
        paragraphs: [
          'Effective deloading reduces total weekly working volume by 40% to 50% while retaining movement skill and enough mechanical load (~75–85% of working weight stopped at 3–4 RIR) to preserve neuromuscular sharpness and avoid detraining.',
          'Cutting load too aggressively for a full week can make heavy weights feel foreign upon return; instead, cut working sets down to 2 crisp sets per exercise and pull intensity slightly back from failure.',
        ],
      },
      {
        heading: 'Tracking Autoregulated Readiness',
        paragraphs: [
          'Pairing subjective energy logs with set-by-set RPE ratings exposes creeping systemic fatigue weeks before a soft-tissue strain or strength regression hits. When fatiguing signals cluster for two consecutive sessions, flip into a 5–7 day deload block immediately.',
        ],
      },
    ],
    references: [
      {
        label: 'Bell et al. (2023). Integrating deloading into strength and physique sports training programmes: An international Delphi consensus.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/37722078/',
      },
      {
        label: 'Taylor et al. (2016). Central nervous system fatigue and resistance exercise recovery dynamics. Sports Medicine.',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26474863/',
      },
    ],
    protocolSpec: {
      code: 'REC-CNS-DELOAD',
      objective:
        'Dissipate cumulative central motor fatigue by scaling working sets down ~40% while keeping technical load sharp at 3–4 RIR.',
      metrics: [
        { label: 'Volume Reduction', value: '-40 to -50', unit: '% sets' },
        { label: 'RIR Buffer', value: '3–4', unit: 'reps in reserve' },
        { label: 'Cycle Cadence', value: 'Every 4–6', unit: 'weeks' },
        { label: 'Duration', value: '5–7', unit: 'days' },
      ],
      steps: [
        {
          id: 'cns-step-1',
          title: 'Drop Working Volume to 2 Sets per Lift',
          instruction:
            'Keep primary compound movements in your schedule, but cap each movement at 2 sub-maximal working sets.',
        },
        {
          id: 'cns-step-2',
          title: 'Leave 3–4 Reps in Reserve (RPE ≤ 7)',
          instruction:
            'Retain 80–90% of your working barbell load so motor firing patterns stay primed without grinding slow reps.',
        },
        {
          id: 'cns-step-3',
          title: 'Prioritize Sleep & Parasympathetic Downregulation',
          instruction:
            'Target 8+ hours of sleep and 10 minutes of nasal cadence breathing post-session to lower sympathetic tone.',
        },
        {
          id: 'cns-step-4',
          title: 'Re-Test Warm-Up Bar Speed Next Week',
          instruction:
            'When warm-up weights feel snappy and energy returns to Solid/High, resume progressive overload targets.',
        },
      ],
      trackerPreset: {
        id: 'cns-recovery-fatigue',
        label: 'Activate CNS Deload in Tracker',
        routineDefId: 'full-body',
        level: 'Intermediate',
        enableDeload: true,
        note: 'Protocol REC-CNS-DELOAD Active: Deload mode enabled (2 sets per lift at RPE <= 7 / 3-4 RIR) to restore central nervous system readiness.',
      },
    },
  },
];

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

const weeklyPosts = Object.values(
  import.meta.glob<FitnessSciencePost>('./blog-posts/*.ts', { eager: true, import: 'default' }),
);

function buildDefaultProtocolSpec(post: FitnessSciencePost): ProtocolPrescription {
  return {
    code: post.id.toUpperCase().slice(0, 12),
    objective: post.excerpt,
    metrics: [
      { label: 'Focus', value: post.category },
      { label: 'Duration', value: '30–45', unit: 'min' },
      { label: 'Effort', value: 'RPE 6–7', unit: 'steady' },
      { label: 'Check-In', value: 'Talk Test', unit: 'conversational' },
    ],
    steps: [
      {
        id: `${post.id}-step-1`,
        title: 'Warm Up Gradually',
        instruction: 'Spend 5–10 minutes easing into the target movement pattern before gauging steady-state effort.',
      },
      {
        id: `${post.id}-step-2`,
        title: 'Monitor Pacing Markers',
        instruction: 'Use full-sentence speech comfort or movement quality checks to keep intensity in the target aerobic or conditioning zone.',
      },
      {
        id: `${post.id}-step-3`,
        title: 'Log Effort in Tracker',
        instruction: 'Record duration and subjective readiness notes after finishing so weekly progression remains comparable.',
      },
    ],
    trackerPreset: {
      id: post.id,
      label: 'Apply Protocol in Tracker',
      routineDefId: 'core-conditioning',
      level: 'Beginner',
      note: `Protocol ${post.title}: Use conversational Talk Test pacing and log duration/readiness notes.`,
    },
  };
}

export const BLOG_POSTS = [...weeklyPosts, ...legacyPosts]
  .sort((first, second) => second.publishedOn.localeCompare(first.publishedOn))
  .map((post) => ({
    ...post,
    protocolSpec: post.protocolSpec ?? buildDefaultProtocolSpec(post),
    date: dateFormatter.format(new Date(post.publishedOn)).toUpperCase(),
  }));

export type EnrichedBlogPost = (typeof BLOG_POSTS)[number];

export function findBlogPostById(idOrAlias?: string): EnrichedBlogPost | undefined {
  if (!idOrAlias) return undefined;
  return BLOG_POSTS.find(
    (entry) => entry.id === idOrAlias || entry.aliases?.includes(idOrAlias),
  );
}
