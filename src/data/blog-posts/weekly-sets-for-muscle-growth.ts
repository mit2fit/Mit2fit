import type { FitnessSciencePost } from '../blogPosts';

export default {
  id: 'weekly-sets-for-muscle-growth',
  title: 'How Many Weekly Sets Build Muscle?',
  excerpt: 'Research links more weekly sets to more muscle growth on average. Here’s how to decide whether adding sets makes sense for your training.',
  publishedOn: '2026-11-10',
  category: 'TRAINING SCIENCE',
  readTime: '3 MIN READ',
  image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
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
        'Record your working sets, loads, and reps for a few weeks. Compare performances at a similar effort and with consistent technique. If reps or load are moving up and you’re recovering between sessions, keep your current set count for another training block.',
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
} satisfies FitnessSciencePost;
