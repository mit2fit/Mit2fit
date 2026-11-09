import {
  ExerciseDefinition,
  EXERCISE_DATABASE,
  SplitCategory,
  ExperienceLevel,
  RoutineTemplate,
  RoutineExerciseConfig
} from './exerciseLibrary';

// ==============================================================
// RELATIONAL DATA MODEL: TABLE FORMAT FOR ROUTINES & PRESCRIBED TIERS
// ==============================================================

export type LoadType = 'weight_reps' | 'bodyweight_reps' | 'bodyweight_timed' | 'assisted';

export interface RoutineSlotPrescription {
  slotNumber: number;
  exerciseId: string;
  targetSets: number;
  targetReps: number;
  targetWeight: number; // In lbs (0 for unweighted bodyweight)
  targetRpe?: number;   // 6 to 10 Rate of Perceived Exertion
  restSeconds: number;  // Calibrated rest interval
  equipment?: string;
  blockType: 'solo' | 'superset';
  supersetGroup?: string; // 'A', 'B', etc.
  supersetOrder?: number; // 1 or 2
}

export interface RoutineDefinition {
  id: string;
  name: string;
  split: SplitCategory;
  targetFrequency: string; // e.g. "3-4 days / week"
  estimatedDurationMin: number;
  description: string;
  primaryFocus: string;
}

// -----------------------------------------------------------------------------
// CORE ROUTINE DEFINITIONS TABLE (Normalized primary routine entities)
// -----------------------------------------------------------------------------
export const ROUTINE_DEFINITIONS: RoutineDefinition[] = [
  {
    id: 'full-body',
    name: 'Full Body Athletic Engine',
    split: 'Full Circuit',
    targetFrequency: '3 days / week',
    estimatedDurationMin: 45,
    description: 'Balanced compound kinetic chain: squats, presses, vertical pulls, posterior hinges, and functional core.',
    primaryFocus: 'Total body motor learning, structural balance, and systemic conditioning'
  },
  {
    id: 'upper-split',
    name: 'Upper Body Power & Hypertrophy',
    split: 'Upper Body',
    targetFrequency: '4 days / week',
    estimatedDurationMin: 55,
    description: 'Horizontal/vertical push-pull balance, clavicular pressing, upper back density, and arm specialization.',
    primaryFocus: 'Chest, lats, upper back thickness, medial delts, and arm hypertrophy'
  },
  {
    id: 'lower-split',
    name: 'Lower Body Quad & Posterior Chain',
    split: 'Lower Body',
    targetFrequency: '4 days / week',
    estimatedDurationMin: 55,
    description: 'High-tension knee flexion, heavy hip hinge, unilateral pelvic stability, and calf development.',
    primaryFocus: 'Quadriceps, hamstrings, gluteus maximus, and calves'
  },
  {
    id: 'push-split',
    name: 'Push Specialization (Chest, Delts & Triceps)',
    split: 'Push',
    targetFrequency: '4-5 days / week',
    estimatedDurationMin: 55,
    description: 'Heavy multi-angle pressing, converging mechanical crossovers, overhead deltoid drive, and triceps overload.',
    primaryFocus: 'Pectoralis major, anterior/lateral deltoids, and triceps brachii'
  },
  {
    id: 'pull-split',
    name: 'Pull Specialization (Back, Lats & Biceps)',
    split: 'Pull',
    targetFrequency: '4-5 days / week',
    estimatedDurationMin: 55,
    description: 'Dead-stop posterior chain hinges, weighted vertical pulls, mid-trap rows, and direct biceps stretch.',
    primaryFocus: 'Latissimus dorsi, trapezius, rhomboids, rear delts, and biceps'
  },
  {
    id: 'core-conditioning',
    name: 'Core & Functional Conditioning',
    split: 'Core & Conditioning',
    targetFrequency: '3-4 days / week',
    estimatedDurationMin: 45,
    description: 'Anti-extension core stiffness, anti-rotation force transfer, explosive kettlebell hinges, and heavy carries.',
    primaryFocus: 'Transverse abdominis, rectus abdominis, rotational power, and work capacity'
  }
];

// -----------------------------------------------------------------------------
// ROUTINE TIER PRESCRIPTION LOOKUP TABLE
// Maps: routineId + ExperienceLevel -> Array of Slot Prescriptions
// -----------------------------------------------------------------------------
export const ROUTINE_TIER_LOOKUP: Record<string, Record<ExperienceLevel, RoutineSlotPrescription[]>> = {
  // 1. FULL BODY ATHLETIC ENGINE
  'full-body': {
    Beginner: [
      { slotNumber: 1, exerciseId: 'goblet-front-squat', targetSets: 3, targetReps: 10, targetWeight: 35, targetRpe: 7, restSeconds: 90, equipment: 'Dumbbell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'dumbbell-flat-bench-press', targetSets: 3, targetReps: 10, targetWeight: 35, targetRpe: 7, restSeconds: 90, equipment: 'Dumbbell', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'lat-pulldown', targetSets: 3, targetReps: 10, targetWeight: 85, targetRpe: 7, restSeconds: 90, equipment: 'Cable', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'dumbbell-romanian-deadlift', targetSets: 3, targetReps: 10, targetWeight: 30, targetRpe: 7, restSeconds: 90, equipment: 'Dumbbell', blockType: 'solo' },
      { slotNumber: 5, exerciseId: 'side-plank', targetSets: 3, targetReps: 45, targetWeight: 0, targetRpe: 7, restSeconds: 60, equipment: 'Bodyweight', blockType: 'superset', supersetGroup: 'A', supersetOrder: 1 },
      { slotNumber: 6, exerciseId: 'farmers-walk', targetSets: 3, targetReps: 40, targetWeight: 35, targetRpe: 7, restSeconds: 90, equipment: 'Dumbbell', blockType: 'superset', supersetGroup: 'A', supersetOrder: 2 }
    ],
    Intermediate: [
      { slotNumber: 1, exerciseId: 'barbell-back-squat', targetSets: 4, targetReps: 6, targetWeight: 195, targetRpe: 8, restSeconds: 120, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'bench-press', targetSets: 4, targetReps: 8, targetWeight: 165, targetRpe: 8, restSeconds: 120, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'barbell-bent-over-row', targetSets: 4, targetReps: 8, targetWeight: 135, targetRpe: 8, restSeconds: 90, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'romanian-deadlift', targetSets: 3, targetReps: 8, targetWeight: 185, targetRpe: 8, restSeconds: 90, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 5, exerciseId: 'hammer-curl', targetSets: 3, targetReps: 12, targetWeight: 25, targetRpe: 8, restSeconds: 0, equipment: 'Dumbbell', blockType: 'superset', supersetGroup: 'A', supersetOrder: 1 },
      { slotNumber: 6, exerciseId: 'triceps-rope-pushdown', targetSets: 3, targetReps: 12, targetWeight: 45, targetRpe: 8, restSeconds: 90, equipment: 'Cable', blockType: 'superset', supersetGroup: 'A', supersetOrder: 2 },
      { slotNumber: 7, exerciseId: 'hanging-knee-raise', targetSets: 3, targetReps: 12, targetWeight: 0, targetRpe: 8, restSeconds: 60, equipment: 'Bodyweight', blockType: 'solo' }
    ],
    Advanced: [
      { slotNumber: 1, exerciseId: 'barbell-back-squat', targetSets: 5, targetReps: 5, targetWeight: 265, targetRpe: 9, restSeconds: 180, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'bench-press', targetSets: 5, targetReps: 5, targetWeight: 215, targetRpe: 9, restSeconds: 180, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'chin-ups', targetSets: 4, targetReps: 8, targetWeight: 25, targetRpe: 9, restSeconds: 120, equipment: 'Bodyweight', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'barbell-deadlift', targetSets: 4, targetReps: 4, targetWeight: 315, targetRpe: 9, restSeconds: 180, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 5, exerciseId: 'cable-lateral-raise', targetSets: 4, targetReps: 12, targetWeight: 25, targetRpe: 8.5, restSeconds: 0, equipment: 'Cable', blockType: 'superset', supersetGroup: 'A', supersetOrder: 1 },
      { slotNumber: 6, exerciseId: 'face-pull-rear-delt-fly', targetSets: 4, targetReps: 15, targetWeight: 45, targetRpe: 8.5, restSeconds: 90, equipment: 'Cable', blockType: 'superset', supersetGroup: 'A', supersetOrder: 2 },
      { slotNumber: 7, exerciseId: 'ab-wheel-rollout', targetSets: 4, targetReps: 12, targetWeight: 0, targetRpe: 9, restSeconds: 75, equipment: 'Bodyweight', blockType: 'solo' }
    ]
  },

  // 2. UPPER BODY POWER & HYPERTROPHY
  'upper-split': {
    Beginner: [
      { slotNumber: 1, exerciseId: 'dumbbell-flat-bench-press', targetSets: 3, targetReps: 10, targetWeight: 40, targetRpe: 7, restSeconds: 90, equipment: 'Dumbbell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'chest-supported-row', targetSets: 3, targetReps: 10, targetWeight: 70, targetRpe: 7, restSeconds: 90, equipment: 'Dumbbell', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'dumbbell-shoulder-press', targetSets: 3, targetReps: 10, targetWeight: 25, targetRpe: 7, restSeconds: 90, equipment: 'Dumbbell', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'lat-pulldown', targetSets: 3, targetReps: 10, targetWeight: 90, targetRpe: 7, restSeconds: 90, equipment: 'Cable', blockType: 'solo' },
      { slotNumber: 5, exerciseId: 'hammer-curl', targetSets: 3, targetReps: 12, targetWeight: 20, targetRpe: 7, restSeconds: 0, equipment: 'Dumbbell', blockType: 'superset', supersetGroup: 'A', supersetOrder: 1 },
      { slotNumber: 6, exerciseId: 'triceps-rope-pushdown', targetSets: 3, targetReps: 12, targetWeight: 40, targetRpe: 7, restSeconds: 90, equipment: 'Cable', blockType: 'superset', supersetGroup: 'A', supersetOrder: 2 }
    ],
    Intermediate: [
      { slotNumber: 1, exerciseId: 'bench-press', targetSets: 4, targetReps: 6, targetWeight: 175, targetRpe: 8, restSeconds: 120, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'barbell-bent-over-row', targetSets: 4, targetReps: 8, targetWeight: 140, targetRpe: 8, restSeconds: 90, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'incline-dumbbell-press', targetSets: 3, targetReps: 10, targetWeight: 55, targetRpe: 8, restSeconds: 90, equipment: 'Dumbbell', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'close-grip-lat-pulldown', targetSets: 3, targetReps: 10, targetWeight: 120, targetRpe: 8, restSeconds: 90, equipment: 'Cable', blockType: 'solo' },
      { slotNumber: 5, exerciseId: 'cable-lateral-raise', targetSets: 4, targetReps: 12, targetWeight: 20, targetRpe: 8, restSeconds: 0, equipment: 'Cable', blockType: 'superset', supersetGroup: 'A', supersetOrder: 1 },
      { slotNumber: 6, exerciseId: 'skull-crushers', targetSets: 3, targetReps: 10, targetWeight: 65, targetRpe: 8, restSeconds: 90, equipment: 'Barbell', blockType: 'superset', supersetGroup: 'A', supersetOrder: 2 },
      { slotNumber: 7, exerciseId: 'ez-bar-biceps-curl', targetSets: 3, targetReps: 10, targetWeight: 60, targetRpe: 8, restSeconds: 75, equipment: 'Barbell', blockType: 'solo' }
    ],
    Advanced: [
      { slotNumber: 1, exerciseId: 'bench-press', targetSets: 5, targetReps: 5, targetWeight: 225, targetRpe: 9, restSeconds: 180, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 't-bar-row', targetSets: 4, targetReps: 8, targetWeight: 145, targetRpe: 9, restSeconds: 120, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'incline-barbell-bench-press', targetSets: 4, targetReps: 8, targetWeight: 185, targetRpe: 8.5, restSeconds: 120, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'chin-ups', targetSets: 4, targetReps: 8, targetWeight: 25, targetRpe: 9, restSeconds: 120, equipment: 'Bodyweight', blockType: 'solo' },
      { slotNumber: 5, exerciseId: 'incline-dumbbell-biceps-curl', targetSets: 4, targetReps: 10, targetWeight: 35, targetRpe: 8.5, restSeconds: 0, equipment: 'Dumbbell', blockType: 'superset', supersetGroup: 'A', supersetOrder: 1 },
      { slotNumber: 6, exerciseId: 'cable-overhead-triceps-rope', targetSets: 4, targetReps: 12, targetWeight: 55, targetRpe: 8.5, restSeconds: 90, equipment: 'Cable', blockType: 'superset', supersetGroup: 'A', supersetOrder: 2 },
      { slotNumber: 7, exerciseId: 'reverse-pec-deck-fly', targetSets: 4, targetReps: 15, targetWeight: 90, targetRpe: 9, restSeconds: 60, equipment: 'Machine', blockType: 'solo' }
    ]
  },

  // 3. LOWER BODY QUAD & POSTERIOR CHAIN
  'lower-split': {
    Beginner: [
      { slotNumber: 1, exerciseId: 'goblet-front-squat', targetSets: 3, targetReps: 10, targetWeight: 40, targetRpe: 7, restSeconds: 90, equipment: 'Dumbbell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'dumbbell-romanian-deadlift', targetSets: 3, targetReps: 10, targetWeight: 35, targetRpe: 7, restSeconds: 90, equipment: 'Dumbbell', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'squat-or-leg-press', targetSets: 3, targetReps: 10, targetWeight: 150, targetRpe: 7, restSeconds: 90, equipment: 'Machine', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'standing-leg-curl', targetSets: 3, targetReps: 12, targetWeight: 40, targetRpe: 7, restSeconds: 60, equipment: 'Machine', blockType: 'solo' },
      { slotNumber: 5, exerciseId: 'standing-calf-raise', targetSets: 3, targetReps: 15, targetWeight: 100, targetRpe: 7, restSeconds: 60, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 6, exerciseId: 'hanging-knee-raise', targetSets: 3, targetReps: 12, targetWeight: 0, targetRpe: 7, restSeconds: 60, equipment: 'Bodyweight', blockType: 'solo' }
    ],
    Intermediate: [
      { slotNumber: 1, exerciseId: 'barbell-back-squat', targetSets: 4, targetReps: 6, targetWeight: 215, targetRpe: 8, restSeconds: 150, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'romanian-deadlift', targetSets: 3, targetReps: 8, targetWeight: 185, targetRpe: 8, restSeconds: 120, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'bulgarian-split-squat', targetSets: 3, targetReps: 10, targetWeight: 45, targetRpe: 8, restSeconds: 90, equipment: 'Dumbbell', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'seated-leg-curl', targetSets: 3, targetReps: 12, targetWeight: 85, targetRpe: 8, restSeconds: 0, equipment: 'Machine', blockType: 'superset', supersetGroup: 'A', supersetOrder: 1 },
      { slotNumber: 5, exerciseId: 'leg-extension', targetSets: 3, targetReps: 12, targetWeight: 110, targetRpe: 8, restSeconds: 90, equipment: 'Machine', blockType: 'superset', supersetGroup: 'A', supersetOrder: 2 },
      { slotNumber: 6, exerciseId: 'seated-calf-raise', targetSets: 4, targetReps: 12, targetWeight: 90, targetRpe: 8, restSeconds: 60, equipment: 'Machine', blockType: 'solo' },
      { slotNumber: 7, exerciseId: 'cable-crunch', targetSets: 3, targetReps: 15, targetWeight: 60, targetRpe: 8, restSeconds: 60, equipment: 'Cable', blockType: 'solo' }
    ],
    Advanced: [
      { slotNumber: 1, exerciseId: 'barbell-back-squat', targetSets: 5, targetReps: 5, targetWeight: 275, targetRpe: 9, restSeconds: 180, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'barbell-hip-thrust', targetSets: 4, targetReps: 8, targetWeight: 245, targetRpe: 9, restSeconds: 120, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'hack-squat', targetSets: 4, targetReps: 10, targetWeight: 200, targetRpe: 9, restSeconds: 120, equipment: 'Machine', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'romanian-deadlift', targetSets: 4, targetReps: 8, targetWeight: 225, targetRpe: 8.5, restSeconds: 120, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 5, exerciseId: 'leg-press-calf-raise', targetSets: 5, targetReps: 15, targetWeight: 220, targetRpe: 8.5, restSeconds: 0, equipment: 'Machine', blockType: 'superset', supersetGroup: 'A', supersetOrder: 1 },
      { slotNumber: 6, exerciseId: 'standing-leg-curl', targetSets: 4, targetReps: 12, targetWeight: 55, targetRpe: 8.5, restSeconds: 90, equipment: 'Machine', blockType: 'superset', supersetGroup: 'A', supersetOrder: 2 },
      { slotNumber: 7, exerciseId: 'ab-wheel-rollout', targetSets: 4, targetReps: 12, targetWeight: 0, targetRpe: 9, restSeconds: 75, equipment: 'Bodyweight', blockType: 'solo' }
    ]
  },

  // 4. PUSH SPECIALIZATION
  'push-split': {
    Beginner: [
      { slotNumber: 1, exerciseId: 'push-ups-or-cable-chest-fly', targetSets: 3, targetReps: 12, targetWeight: 40, targetRpe: 7, restSeconds: 60, equipment: 'Cable', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'dumbbell-shoulder-press', targetSets: 3, targetReps: 10, targetWeight: 25, targetRpe: 7, restSeconds: 90, equipment: 'Dumbbell', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'incline-dumbbell-press', targetSets: 3, targetReps: 10, targetWeight: 40, targetRpe: 7, restSeconds: 90, equipment: 'Dumbbell', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'dumbbell-lateral-raise', targetSets: 3, targetReps: 12, targetWeight: 15, targetRpe: 7, restSeconds: 60, equipment: 'Dumbbell', blockType: 'solo' },
      { slotNumber: 5, exerciseId: 'triceps-rope-pushdown', targetSets: 3, targetReps: 12, targetWeight: 40, targetRpe: 7, restSeconds: 60, equipment: 'Cable', blockType: 'solo' }
    ],
    Intermediate: [
      { slotNumber: 1, exerciseId: 'bench-press', targetSets: 4, targetReps: 6, targetWeight: 175, targetRpe: 8, restSeconds: 120, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'barbell-overhead-press', targetSets: 4, targetReps: 6, targetWeight: 105, targetRpe: 8, restSeconds: 120, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'weighted-chest-dips', targetSets: 3, targetReps: 10, targetWeight: 20, targetRpe: 8, restSeconds: 90, equipment: 'Bodyweight', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'cable-lateral-raise', targetSets: 4, targetReps: 12, targetWeight: 20, targetRpe: 8, restSeconds: 0, equipment: 'Cable', blockType: 'superset', supersetGroup: 'A', supersetOrder: 1 },
      { slotNumber: 5, exerciseId: 'skull-crushers', targetSets: 3, targetReps: 10, targetWeight: 65, targetRpe: 8, restSeconds: 90, equipment: 'Barbell', blockType: 'superset', supersetGroup: 'A', supersetOrder: 2 },
      { slotNumber: 6, exerciseId: 'cable-chest-crossover', targetSets: 3, targetReps: 12, targetWeight: 30, targetRpe: 8, restSeconds: 60, equipment: 'Cable', blockType: 'solo' }
    ],
    Advanced: [
      { slotNumber: 1, exerciseId: 'bench-press', targetSets: 5, targetReps: 5, targetWeight: 225, targetRpe: 9, restSeconds: 180, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'incline-barbell-bench-press', targetSets: 4, targetReps: 8, targetWeight: 180, targetRpe: 9, restSeconds: 120, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'weighted-chest-dips', targetSets: 4, targetReps: 8, targetWeight: 45, targetRpe: 9, restSeconds: 120, equipment: 'Bodyweight', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'cable-chest-crossover', targetSets: 3, targetReps: 12, targetWeight: 35, targetRpe: 8.5, restSeconds: 0, equipment: 'Cable', blockType: 'superset', supersetGroup: 'A', supersetOrder: 1 },
      { slotNumber: 5, exerciseId: 'cable-lateral-raise', targetSets: 5, targetReps: 12, targetWeight: 25, targetRpe: 8.5, restSeconds: 90, equipment: 'Cable', blockType: 'superset', supersetGroup: 'A', supersetOrder: 2 },
      { slotNumber: 6, exerciseId: 'cable-overhead-triceps-rope', targetSets: 4, targetReps: 12, targetWeight: 55, targetRpe: 9, restSeconds: 75, equipment: 'Cable', blockType: 'solo' }
    ]
  },

  // 5. PULL SPECIALIZATION
  'pull-split': {
    Beginner: [
      { slotNumber: 1, exerciseId: 'lat-pulldown', targetSets: 3, targetReps: 10, targetWeight: 85, targetRpe: 7, restSeconds: 90, equipment: 'Cable', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'chest-supported-row', targetSets: 3, targetReps: 10, targetWeight: 70, targetRpe: 7, restSeconds: 90, equipment: 'Dumbbell', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'face-pull-rear-delt-fly', targetSets: 3, targetReps: 15, targetWeight: 35, targetRpe: 7, restSeconds: 60, equipment: 'Cable', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'hammer-curl', targetSets: 3, targetReps: 12, targetWeight: 20, targetRpe: 7, restSeconds: 0, equipment: 'Dumbbell', blockType: 'superset', supersetGroup: 'A', supersetOrder: 1 },
      { slotNumber: 5, exerciseId: 'reverse-pec-deck-fly', targetSets: 3, targetReps: 15, targetWeight: 50, targetRpe: 7, restSeconds: 60, equipment: 'Machine', blockType: 'superset', supersetGroup: 'A', supersetOrder: 2 }
    ],
    Intermediate: [
      { slotNumber: 1, exerciseId: 'barbell-bent-over-row', targetSets: 4, targetReps: 8, targetWeight: 140, targetRpe: 8, restSeconds: 120, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'pull-up-or-lat-pulldown', targetSets: 4, targetReps: 8, targetWeight: 125, targetRpe: 8, restSeconds: 90, equipment: 'Cable', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 't-bar-row', targetSets: 3, targetReps: 10, targetWeight: 95, targetRpe: 8, restSeconds: 90, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'face-pull-rear-delt-fly', targetSets: 3, targetReps: 15, targetWeight: 45, targetRpe: 8, restSeconds: 60, equipment: 'Cable', blockType: 'solo' },
      { slotNumber: 5, exerciseId: 'ez-bar-biceps-curl', targetSets: 3, targetReps: 10, targetWeight: 60, targetRpe: 8, restSeconds: 0, equipment: 'Barbell', blockType: 'superset', supersetGroup: 'A', supersetOrder: 1 },
      { slotNumber: 6, exerciseId: 'hammer-curl', targetSets: 3, targetReps: 12, targetWeight: 25, targetRpe: 8, restSeconds: 90, equipment: 'Dumbbell', blockType: 'superset', supersetGroup: 'A', supersetOrder: 2 }
    ],
    Advanced: [
      { slotNumber: 1, exerciseId: 'barbell-deadlift', targetSets: 4, targetReps: 4, targetWeight: 315, targetRpe: 9, restSeconds: 180, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'chin-ups', targetSets: 4, targetReps: 8, targetWeight: 25, targetRpe: 9, restSeconds: 120, equipment: 'Bodyweight', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 't-bar-row', targetSets: 4, targetReps: 8, targetWeight: 140, targetRpe: 9, restSeconds: 120, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'straight-arm-lat-pushdown', targetSets: 3, targetReps: 12, targetWeight: 50, targetRpe: 8.5, restSeconds: 75, equipment: 'Cable', blockType: 'solo' },
      { slotNumber: 5, exerciseId: 'reverse-pec-deck-fly', targetSets: 4, targetReps: 15, targetWeight: 85, targetRpe: 8.5, restSeconds: 0, equipment: 'Machine', blockType: 'superset', supersetGroup: 'A', supersetOrder: 1 },
      { slotNumber: 6, exerciseId: 'incline-dumbbell-biceps-curl', targetSets: 4, targetReps: 10, targetWeight: 35, targetRpe: 9, restSeconds: 90, equipment: 'Dumbbell', blockType: 'superset', supersetGroup: 'A', supersetOrder: 2 }
    ]
  },

  // 6. CORE & CONDITIONING
  'core-conditioning': {
    Beginner: [
      { slotNumber: 1, exerciseId: 'farmers-walk', targetSets: 3, targetReps: 40, targetWeight: 35, targetRpe: 7, restSeconds: 60, equipment: 'Dumbbell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'side-plank', targetSets: 3, targetReps: 45, targetWeight: 0, targetRpe: 7, restSeconds: 45, equipment: 'Bodyweight', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'cable-pallof-press', targetSets: 3, targetReps: 12, targetWeight: 25, targetRpe: 7, restSeconds: 60, equipment: 'Cable', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'hanging-knee-raise', targetSets: 3, targetReps: 10, targetWeight: 0, targetRpe: 7, restSeconds: 60, equipment: 'Bodyweight', blockType: 'solo' }
    ],
    Intermediate: [
      { slotNumber: 1, exerciseId: 'kettlebell-swing', targetSets: 4, targetReps: 15, targetWeight: 53, targetRpe: 8, restSeconds: 75, equipment: 'Kettlebell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'cable-pallof-press', targetSets: 3, targetReps: 12, targetWeight: 35, targetRpe: 8, restSeconds: 60, equipment: 'Cable', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'hanging-knee-raise', targetSets: 3, targetReps: 12, targetWeight: 0, targetRpe: 8, restSeconds: 0, equipment: 'Bodyweight', blockType: 'superset', supersetGroup: 'A', supersetOrder: 1 },
      { slotNumber: 4, exerciseId: 'side-plank', targetSets: 3, targetReps: 50, targetWeight: 0, targetRpe: 8, restSeconds: 60, equipment: 'Bodyweight', blockType: 'superset', supersetGroup: 'A', supersetOrder: 2 },
      { slotNumber: 5, exerciseId: 'farmers-walk', targetSets: 4, targetReps: 45, targetWeight: 55, targetRpe: 8, restSeconds: 75, equipment: 'Dumbbell', blockType: 'solo' }
    ],
    Advanced: [
      { slotNumber: 1, exerciseId: 'barbell-thruster', targetSets: 4, targetReps: 8, targetWeight: 115, targetRpe: 9, restSeconds: 90, equipment: 'Barbell', blockType: 'solo' },
      { slotNumber: 2, exerciseId: 'kettlebell-clean-and-press', targetSets: 4, targetReps: 6, targetWeight: 53, targetRpe: 9, restSeconds: 90, equipment: 'Kettlebell', blockType: 'solo' },
      { slotNumber: 3, exerciseId: 'kettlebell-swing', targetSets: 5, targetReps: 15, targetWeight: 70, targetRpe: 9, restSeconds: 60, equipment: 'Kettlebell', blockType: 'solo' },
      { slotNumber: 4, exerciseId: 'kettlebell-turkish-get-up', targetSets: 3, targetReps: 3, targetWeight: 44, targetRpe: 9, restSeconds: 90, equipment: 'Kettlebell', blockType: 'solo' },
      { slotNumber: 5, exerciseId: 'ab-wheel-rollout', targetSets: 4, targetReps: 12, targetWeight: 0, targetRpe: 9, restSeconds: 0, equipment: 'Bodyweight', blockType: 'superset', supersetGroup: 'A', supersetOrder: 1 },
      { slotNumber: 6, exerciseId: 'cable-pallof-press', targetSets: 3, targetReps: 12, targetWeight: 45, targetRpe: 9, restSeconds: 75, equipment: 'Cable', blockType: 'superset', supersetGroup: 'A', supersetOrder: 2 }
    ]
  }
};

// -----------------------------------------------------------------------------
// HELPER: BUILD ACTIVE ROUTINE TEMPLATE FROM RELATIONAL LOOKUP
// -----------------------------------------------------------------------------
export function buildParametricRoutine(routineId: string, level: ExperienceLevel): RoutineTemplate {
  const def = ROUTINE_DEFINITIONS.find(d => d.id === routineId) || ROUTINE_DEFINITIONS[0];
  const lookup = ROUTINE_TIER_LOOKUP[def.id] || ROUTINE_TIER_LOOKUP['full-body'];
  const prescriptions = lookup[level] || lookup.Intermediate;

  const exerciseConfigs: RoutineExerciseConfig[] = prescriptions.map(p => {
    const ex = EXERCISE_DATABASE.find(e => e.id === p.exerciseId);
    return {
      exerciseId: p.exerciseId,
      targetSets: p.targetSets,
      targetReps: p.targetReps,
      targetWeight: p.targetWeight,
      equipment: p.equipment || ex?.defaultEquipment || 'Barbell',
      supersetTag: p.blockType === 'superset' ? `${p.supersetGroup}${p.supersetOrder}` : undefined
    };
  });

  return {
    id: `${def.id}-${level.toLowerCase()}`,
    name: `${def.name} (${level})`,
    split: def.split,
    level,
    daysPerWeek: def.targetFrequency,
    durationMin: def.estimatedDurationMin,
    description: def.description,
    exerciseIds: prescriptions.map(p => p.exerciseId),
    exerciseConfigs,
    isCustom: false
  };
}

// -----------------------------------------------------------------------------
// FACTORY: ALL PARAMETRIC ROUTINES FOR DEFAULT SEEDING
// -----------------------------------------------------------------------------
export function getAllParametricRoutines(): RoutineTemplate[] {
  const routines: RoutineTemplate[] = [];
  ROUTINE_DEFINITIONS.forEach(def => {
    (['Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[]).forEach(level => {
      routines.push(buildParametricRoutine(def.id, level));
    });
  });
  return routines;
}
