export type ServiceId =
  | 'strength-design'
  | 'reactive-power'
  | 'movement-quality'
  | 'precision-nutrition';

export type ServiceDetail = {
  id: ServiceId;
  title: string;
  eyebrow: string;
  description: string;
  tags: string[];
  lead: string;
  outcomes: string[];
  includes: string[];
  bestFor: string[];
};

export const services: ServiceDetail[] = [
  {
    id: 'strength-design',
    title: 'Strength Design',
    eyebrow: 'Foundational Force',
    description:
      'Systematic program design focused on foundational strength, muscle growth, and movement quality.',
    tags: ['Hypertrophy', 'Strength', 'NASM Principles'],
    lead:
      'A structured training plan built around progressive overload, clean movement patterns, and recovery you can actually sustain.',
    outcomes: [
      'Clear weekly strength progression',
      'Better lifting mechanics and safer loading',
      'Training blocks matched to your schedule and recovery',
    ],
    includes: [
      'Movement baseline and goal review',
      'Primary lift and accessory exercise selection',
      'Rep, set, tempo, and progression targets',
      'Adjustment plan for plateaus or soreness',
    ],
    bestFor: [
      'Beginners who need structure',
      'Returning lifters rebuilding consistency',
      'Clients chasing strength or muscle gain without random workouts',
    ],
  },
  {
    id: 'reactive-power',
    title: 'Reactive Power',
    eyebrow: 'Explosive Output',
    description:
      'Developing explosive output and stability through high-intensity and plyometric movements.',
    tags: ['Power', 'Explosiveness', 'Agility'],
    lead:
      'Power work for people who need speed, coordination, and control without turning every session into chaos.',
    outcomes: [
      'Sharper acceleration and force production',
      'Improved coordination under fatigue',
      'Better control during high-intensity movement',
    ],
    includes: [
      'Jump, sprint, or agility readiness review',
      'Plyometric progressions matched to your joints and experience',
      'Power-focused warmups and landing mechanics',
      'Recovery rules so intensity stays productive',
    ],
    bestFor: [
      'Athletes and active adults',
      'Clients who feel strong but slow',
      'Anyone adding speed work after a strength base',
    ],
  },
  {
    id: 'movement-quality',
    title: 'Movement Quality',
    eyebrow: 'Form & Longevity',
    description:
      'In-depth form assessment to improve efficiency and reduce the risk of long-term injury.',
    tags: ['Form Analysis', 'Mobility', 'Longevity'],
    lead:
      'A practical look at how you move, where energy leaks happen, and what to clean up before adding more load.',
    outcomes: [
      'Cleaner squat, hinge, push, pull, and carry mechanics',
      'Reduced compensation patterns',
      'More confidence training around prior aches or limitations',
    ],
    includes: [
      'Movement screen and exercise technique review',
      'Mobility and stability priorities',
      'Corrective drills that fit inside real workouts',
      'Form cues you can remember under load',
    ],
    bestFor: [
      'Clients with recurring tightness or discomfort',
      'People returning after a long training gap',
      'Lifters who want better form before heavier work',
    ],
  },
  {
    id: 'precision-nutrition',
    title: 'Precision Nutrition',
    eyebrow: 'Fuel & Consistency',
    description:
      'Grounded nutrition coaching based on your real-world lifestyle and performance goals.',
    tags: ['Macros', 'Lifestyle', 'Consistency'],
    lead:
      'Nutrition guidance built around your habits, schedule, and goals instead of rigid meal plans that collapse after a week.',
    outcomes: [
      'Simple calorie and macro targets',
      'Better protein, hydration, and meal timing habits',
      'A realistic structure for fat loss, maintenance, or muscle gain',
    ],
    includes: [
      'Current intake and schedule review',
      'Macro and hydration baseline',
      'Practical meal structure and adjustment rules',
      'Weekly tracking recommendations',
    ],
    bestFor: [
      'Clients who train but are stuck on body composition',
      'Busy professionals who need simple rules',
      'Anyone who wants nutrition to support performance',
    ],
  },
];

export function getServiceById(id: string | undefined): ServiceDetail | undefined {
  return services.find((service) => service.id === id);
}
