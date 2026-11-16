import type { FitnessSciencePost } from '../blogPosts';
import weeklySetsImg from '../../assets/images/protocol_weekly_sets_1794839054507.jpg';

export default {
  id: 'weekly-sets-for-muscle-growth',
  title: 'How Many Weekly Sets Build Muscle?',
  excerpt:
    'Research links more weekly sets to more muscle growth on average. Here is how to calibrate your weekly working volume productively.',
  publishedOn: '2026-11-10',
  category: 'TRAINING SCIENCE',
  readTime: '4 MIN READ',
  image: weeklySetsImg,
  sections: [
    {
      heading: 'Count sets across the week',
      paragraphs: [
        'Start by counting the working sets you do for the muscle you want to grow. Suppose you do three sets of squats and two sets of leg extensions on Monday, then repeat that session on Thursday. That gives your quadriceps ten working sets across the week. Keep warm-up sets separate so your count is consistent from week to week.',
        'Track direct and indirect work separately when an exercise trains several muscles. A triceps extension directly targets the triceps. A bench press also trains them, alongside the chest and shoulders. In the analysis by Pelland and colleagues, the models fit the data better when indirect sets counted for less than direct sets. A training log can capture that distinction without assigning a precise fraction to every lift.',
      ],
    },
    {
      heading: 'What the research found',
      paragraphs: [
        'Pelland and colleagues analyzed 67 resistance-training studies with 2,058 participants. More weekly sets were associated with more muscle growth and strength gain on average. The estimated benefit of additional sets got smaller as volume rose, particularly for strength. An American College of Sports Medicine review also found that training volume can affect muscle growth in healthy adults.',
        'The pooled sample was mostly young men. The average response gives you a starting point for thinking about volume, while your training history, exercise selection, and recovery affect how much work you can use productively. The studies do not establish an ideal weekly set count for every lifter.',
      ],
    },
    {
      heading: 'Use your training log to make one change at a time',
      paragraphs: [
        'Record your working sets, loads, and reps for a few weeks. Compare performances at a similar effort and with consistent technique. If reps or load are moving up and you are recovering between sessions, keep your current set count for another training block.',
        'If progress has stalled for several weeks, check your attendance and recovery first. If both have been steady, try adding one working set per week for the target muscle and see how you respond. Reps and load are useful markers for a training log. Changes in muscle size take longer to assess.',
      ],
    },
  ],
  references: [
    {
      label: 'Pelland et al. (2026). Weekly volume and frequency for hypertrophy and strength. Sports Medicine.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/41343037/',
    },
    {
      label: 'American College of Sports Medicine (2026). Resistance training prescription for healthy adults.',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823/',
    },
  ],
  protocolSpec: {
    code: 'HYP-VOL-10',
    objective:
      'Establish an individualized weekly working-set baseline and scale volume by +1 set per week only when overload stalls.',
    metrics: [
      { label: 'Weekly Target', value: '10–18', unit: 'sets / muscle' },
      { label: 'Effort Proximity', value: '1–3', unit: 'RIR / set' },
      { label: 'Rest Interval', value: '90–150', unit: 'sec' },
      { label: 'Evaluation Block', value: '3–4', unit: 'weeks' },
    ],
    steps: [
      {
        id: 'ws-step-1',
        title: 'Audit Working Sets Only',
        instruction:
          'Log only challenging working sets taken within 1–3 reps of technical failure; exclude warm-up sets.',
      },
      {
        id: 'ws-step-2',
        title: 'Separate Direct vs. Indirect Volume',
        instruction:
          'Count isolation and primary compound work at full credit; track synergistic muscles as fractional overlap.',
      },
      {
        id: 'ws-step-3',
        title: 'Hold Volume While Progressing',
        instruction:
          'Maintain your current set count for the entire block as long as reps or load advance week over week.',
      },
      {
        id: 'ws-step-4',
        title: 'Titrate +1 Set on Plateaus',
        instruction:
          'If strength and reps flatten for 2+ consecutive weeks despite solid sleep, add 1 working set per week to the lagging group.',
      },
    ],
    trackerPreset: {
      id: 'weekly-sets-for-muscle-growth',
      label: 'Load Upper Hypertrophy Volume Split',
      routineDefId: 'upper-split',
      level: 'Intermediate',
      enableDeload: false,
      note: 'Protocol HYP-VOL-10 Active: Count 10-18 direct weekly sets at 1-3 RIR. Add +1 set only if progression stalls for 2 weeks.',
    },
  },
} satisfies FitnessSciencePost;
