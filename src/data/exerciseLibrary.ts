export type SplitCategory =
  | 'Upper Body'
  | 'Lower Body'
  | 'Full Circuit'
  | 'Push'
  | 'Pull'
  | 'Core & Conditioning';

export type MuscleSubCategory =
  | 'Chest'
  | 'Back / Lats'
  | 'Shoulders'
  | 'Arms'
  | 'Quads'
  | 'Hamstrings & Glutes'
  | 'Calves'
  | 'Core / Abs'
  | 'Conditioning & Kettlebells';

export interface ExerciseTarget {
  targetSets: number; // e.g. 2 or 3 sets
  targetReps: number; // e.g. 10 reps (or starting midpoint)
  minReps: number;    // e.g. 6 reps
  maxReps: number;    // e.g. 10 reps
  defaultWeight: number; // in lbs (or kg)
  repsUnit?: string;  // 'reps' | 'per leg' | 'sec/side'
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  split: SplitCategory;
  subCategory: MuscleSubCategory;
  category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body'; // legacy/compatibility
  defaultEquipment: 'Barbell' | 'Dumbbell' | 'Kettlebell' | 'Cable' | 'Machine' | 'Bodyweight' | 'Resistance Band' | 'Trap Bar';
  supportedEquipment: string[];
  primaryMuscle: string;
  secondaryMuscles: string[];
  animationType: 'squat' | 'bench' | 'deadlift' | 'overhead' | 'row' | 'curl' | 'swing' | 'core';
  cues: string[];
  openSourceLink: {
    label: string;
    url: string;
    source: 'MuscleWiki' | 'Wger (Open Source)' | 'ExRx Biomechanics';
  };
  instructions: string[];
  defaultTarget: ExerciseTarget;
  custom?: boolean;
}

export const EQUIPMENT_OPTIONS = [
  'Barbell',
  'Dumbbell',
  'Kettlebell',
  'Cable',
  'Machine',
  'Bodyweight',
  'Resistance Band',
  'Trap Bar',
  'Custom / Other'
] as const;

export const SPLIT_OPTIONS: SplitCategory[] = [
  'Upper Body',
  'Lower Body',
  'Full Circuit',
  'Push',
  'Pull',
  'Core & Conditioning'
];

export const SPLIT_SUBCATEGORIES_MAP: Record<SplitCategory, MuscleSubCategory[]> = {
  'Upper Body': ['Chest', 'Back / Lats', 'Shoulders', 'Arms'],
  'Lower Body': ['Quads', 'Hamstrings & Glutes', 'Calves', 'Core / Abs'],
  'Full Circuit': ['Conditioning & Kettlebells', 'Core / Abs', 'Quads', 'Back / Lats'],
  'Push': ['Chest', 'Shoulders', 'Arms'],
  'Pull': ['Back / Lats', 'Arms', 'Hamstrings & Glutes'],
  'Core & Conditioning': ['Core / Abs', 'Conditioning & Kettlebells']
};

export const ALL_SUBCATEGORIES: MuscleSubCategory[] = [
  'Chest',
  'Back / Lats',
  'Shoulders',
  'Arms',
  'Quads',
  'Hamstrings & Glutes',
  'Calves',
  'Core / Abs',
  'Conditioning & Kettlebells'
];

export const CATEGORY_OPTIONS = [
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
  'Full Body'
] as const;

export const EXERCISE_DATABASE: ExerciseDefinition[] = [
  // 1. Bench press: Sets: 3, Reps: 6–10
  {
    id: 'bench-press',
    name: 'Bench Press',
    split: 'Upper Body',
    subCategory: 'Chest',
    category: 'Chest',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Dumbbell', 'Machine'],
    primaryMuscle: 'Pectoralis Major',
    secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoid'],
    animationType: 'bench',
    cues: [
      'Retract scapulae and plant feet firmly into the floor',
      'Lower bar with 45-degree elbow tuck to touch lower sternum',
      'Drive aggressively upward without lifting glutes off the bench'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Barbell Bench Press',
      url: 'https://wger.de/en/exercise/192/view/bench-press',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Lie flat with eyes under the barbell.',
      'Unrack and settle the load directly over sternum.',
      'Control lowering to lower chest, then press explosively to full lockout.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 8,
      minReps: 6,
      maxReps: 10,
      defaultWeight: 135,
      repsUnit: 'reps'
    }
  },

  // 2. Chest-supported row: Sets: 3, Reps: 8–12
  {
    id: 'chest-supported-row',
    name: 'Chest-Supported Row',
    split: 'Upper Body',
    subCategory: 'Back / Lats',
    category: 'Back',
    defaultEquipment: 'Machine',
    supportedEquipment: ['Machine', 'Dumbbell'],
    primaryMuscle: 'Rhomboids & Mid Trapezius',
    secondaryMuscles: ['Latissimus Dorsi', 'Posterior Deltoids', 'Biceps'],
    animationType: 'row',
    cues: [
      'Keep chest pinned to pad to eliminate lower back cheating',
      'Drive elbows past torso and squeeze shoulder blades together',
      'Pause for 1 second at full squeeze'
    ],
    openSourceLink: {
      label: 'ExRx - Incline Chest Supported Row',
      url: 'https://exrx.net/WeightExercises/BackGeneral/DBInclineRow',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Set incline bench or machine pad to support chest.',
      'Grasp handles with neutral or overhand grip.',
      'Row handles toward ribcage, pinching scapulae tight.',
      'Lower under control to full arm stretch.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 90,
      repsUnit: 'reps'
    }
  },

  // 3. Incline dumbbell press: Sets: 2, Reps: 8–12
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    split: 'Upper Body',
    subCategory: 'Chest',
    category: 'Chest',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Barbell', 'Machine'],
    primaryMuscle: 'Clavicular Head (Upper Pectorals)',
    secondaryMuscles: ['Anterior Deltoid', 'Triceps'],
    animationType: 'bench',
    cues: [
      'Set bench angle to 30-45 degrees',
      'Keep wrists aligned directly above forearms',
      'Converge dumbbells smoothly at the top without clanking'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Incline Dumbbell Bench',
      url: 'https://musclewiki.com/dumbbells/chest/incline-dumbbell-bench-press',
      source: 'MuscleWiki'
    },
    instructions: [
      'Kick dumbbells to shoulder level while reclining.',
      'Press smoothly towards ceiling until arms lock out.',
      'Lower under 2-second control feeling deep upper chest stretch.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 50,
      repsUnit: 'reps'
    }
  },

  // 4. Lat pulldown: Sets: 2, Reps: 8–12
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    split: 'Upper Body',
    subCategory: 'Back / Lats',
    category: 'Back',
    defaultEquipment: 'Cable',
    supportedEquipment: ['Cable', 'Machine'],
    primaryMuscle: 'Latissimus Dorsi',
    secondaryMuscles: ['Teres Major', 'Biceps', 'Brachialis'],
    animationType: 'row',
    cues: [
      'Slight 10-degree lean back from hips',
      'Drive elbows down towards hips like putting hands in back pockets',
      'Control eccentric phase all the way to full lat extension'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Lat Pulldown',
      url: 'https://wger.de/en/exercise/102/view/lat-pulldown',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Adjust thigh pad firmly over knees.',
      'Grip bar slightly wider than shoulder width.',
      'Pull down smoothly to collarbone while expanding chest.',
      'Resist cable return to full stretch.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 120,
      repsUnit: 'reps'
    }
  },

  // 5. Dumbbell lateral raise: Sets: 2, Reps: 12–15
  {
    id: 'dumbbell-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    split: 'Upper Body',
    subCategory: 'Shoulders',
    category: 'Shoulders',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Cable', 'Resistance Band'],
    primaryMuscle: 'Lateral Deltoid (Side Shoulder Cap)',
    secondaryMuscles: ['Supraspinatus', 'Upper Trapezius'],
    animationType: 'overhead',
    cues: [
      'Lead with elbows slightly higher than wrists',
      'Maintain slight 15-degree forward hinge to hit lateral deltoid plane',
      'Lower smoothly over 2-3 seconds without swinging'
    ],
    openSourceLink: {
      label: 'ExRx - Dumbbell Lateral Raise',
      url: 'https://exrx.net/WeightExercises/DeltoidLateral/DBLateralRaise',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Hold dumbbells at sides with relaxed neck.',
      'Raise dumbbells outward in scapular plane until parallel to floor.',
      'Pause at apex, then descend under strict control.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 12,
      minReps: 12,
      maxReps: 15,
      defaultWeight: 20,
      repsUnit: 'reps'
    }
  },

  // 6. Triceps rope pushdown: Sets: 2, Reps: 10–15
  {
    id: 'triceps-rope-pushdown',
    name: 'Triceps Rope Pushdown',
    split: 'Upper Body',
    subCategory: 'Arms',
    category: 'Arms',
    defaultEquipment: 'Cable',
    supportedEquipment: ['Cable', 'Resistance Band'],
    primaryMuscle: 'Triceps Brachii (Lateral & Medial Heads)',
    secondaryMuscles: ['Anconeus'],
    animationType: 'curl',
    cues: [
      'Glue elbows to ribcage without letting them swing forward',
      'Flare rope ends apart aggressively at bottom lockout',
      'Lock out arms completely and hold contraction for 1 second'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Cable Tricep Pushdown',
      url: 'https://musclewiki.com/cables/triceps/rope-pushdown',
      source: 'MuscleWiki'
    },
    instructions: [
      'Set cable to high pulley with rope attachment.',
      'Lean slightly forward from hips.',
      'Extend forearms straight down, flaring rope apart at the bottom.',
      'Return to 90 degrees under control.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 45,
      repsUnit: 'reps'
    }
  },

  // 7. Squat or leg press: Sets: 3, Reps: 6–10
  {
    id: 'squat-or-leg-press',
    name: 'Squat or Leg Press',
    split: 'Lower Body',
    subCategory: 'Quads',
    category: 'Legs',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Machine', 'Dumbbell', 'Bodyweight'],
    primaryMuscle: 'Quadriceps Femoris & Gluteus Maximus',
    secondaryMuscles: ['Adductors', 'Hamstrings', 'Core Bracing'],
    animationType: 'squat',
    cues: [
      'Plant feet shoulder-width and drive knees out over toes',
      'Descend to parallel or machine depth stop',
      'Press through full foot tripod to drive up'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Squat Biomechanics',
      url: 'https://wger.de/en/exercise/191/view/squat',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Position under barbell or sit back firmly in 45-degree leg press.',
      'Take deep breath, brace abdominal wall.',
      'Descend smoothly until thighs reach parallel with platform.',
      'Explode upward through mid-foot.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 8,
      minReps: 6,
      maxReps: 10,
      defaultWeight: 185,
      repsUnit: 'reps'
    }
  },

  // 8. Romanian deadlift: Sets: 2, Reps: 8–12
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    split: 'Lower Body',
    subCategory: 'Hamstrings & Glutes',
    category: 'Legs',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Dumbbell', 'Trap Bar', 'Kettlebell'],
    primaryMuscle: 'Hamstrings (Biceps Femoris & Semitendinosus)',
    secondaryMuscles: ['Gluteus Maximus', 'Erector Spinae'],
    animationType: 'deadlift',
    cues: [
      'Maintain soft knee bend and push hips straight backward',
      'Keep bar or dumbbells glued to thighs/shins',
      'Stop when hips can no longer travel backward without rounding'
    ],
    openSourceLink: {
      label: 'ExRx - Barbell Romanian Deadlift',
      url: 'https://exrx.net/WeightExercises/OlympicLifts/RomanianDeadlift',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Stand upright holding bar with shoulder-width grip.',
      'Hinge hips back while keeping chest proud and lats locked.',
      'Lower weights to mid-shin level until hamstrings stretch.',
      'Drive hips forward to return to standing.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 135,
      repsUnit: 'reps'
    }
  },

  // 9. Bulgarian split squat: Sets: 2, Reps: 8–10/leg
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    split: 'Lower Body',
    subCategory: 'Quads',
    category: 'Legs',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Kettlebell', 'Barbell', 'Bodyweight'],
    primaryMuscle: 'Quadriceps & Gluteus Medius',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core Stabilizers'],
    animationType: 'squat',
    cues: [
      'Rear foot laces resting flat on bench behind you',
      'Slight forward torso tilt to load working hip glute',
      'Lower until front thigh is parallel to floor'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Bulgarian Split Squat',
      url: 'https://musclewiki.com/dumbbells/quads/bulgarian-split-squat',
      source: 'MuscleWiki'
    },
    instructions: [
      'Stand about 2 feet ahead of bench, place rear foot laces on pad.',
      'Hold dumbbells at sides with core braced.',
      'Drop rear knee straight down towards floor.',
      'Drive through front heel to return to top.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 8,
      minReps: 8,
      maxReps: 10,
      defaultWeight: 30,
      repsUnit: '/leg'
    }
  },

  // 10. Leg curl: Sets: 2, Reps: 10–15
  {
    id: 'leg-curl',
    name: 'Leg Curl (Lying or Seated)',
    split: 'Lower Body',
    subCategory: 'Hamstrings & Glutes',
    category: 'Legs',
    defaultEquipment: 'Machine',
    supportedEquipment: ['Machine', 'Resistance Band', 'Dumbbell'],
    primaryMuscle: 'Hamstrings (Knee Flexion Focus)',
    secondaryMuscles: ['Gastrocnemius', 'Gracilis'],
    animationType: 'squat',
    cues: [
      'Align knee joints directly with machine pivot axis',
      'Curl pad all the way to touch glutes/upper hamstrings',
      'Hold peak squeeze for 1 second before 2-second release'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Leg Curl',
      url: 'https://wger.de/en/exercise/117/view/leg-curl',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Secure pad against back of calves just below achilles.',
      'Keep hips pressed flat into bench.',
      'Flex knees to pull pad upward as far as possible.',
      'Lower smoothly back to start position.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 75,
      repsUnit: 'reps'
    }
  },

  // 11. Standing calf raise: Sets: 2, Reps: 12–20
  {
    id: 'standing-calf-raise',
    name: 'Standing Calf Raise',
    split: 'Lower Body',
    subCategory: 'Calves',
    category: 'Legs',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Barbell', 'Machine', 'Bodyweight'],
    primaryMuscle: 'Gastrocnemius (Calf Upper Diamond)',
    secondaryMuscles: ['Soleus', 'Plantaris'],
    animationType: 'squat',
    cues: [
      'Drop heels below step level for a full deep stretch',
      'Pause 1 full second at bottom stretch to eliminate Achilles elastic rebound',
      'Explode onto big toes and hold peak lockout for 2 seconds'
    ],
    openSourceLink: {
      label: 'ExRx - Standing Calf Raise',
      url: 'https://exrx.net/WeightExercises/Gastrocnemius/CBStandingCalfRaise',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Stand on balls of feet on block or ledge.',
      'Lower heels under control into deep stretch.',
      'Drive aggressively onto balls of feet.',
      'Squeeze calves firmly at top.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 15,
      minReps: 12,
      maxReps: 20,
      defaultWeight: 50,
      repsUnit: 'reps'
    }
  },

  // 12. Cable crunch: Sets: 2, Reps: 10–15
  {
    id: 'cable-crunch',
    name: 'Kneeling Cable Crunch',
    split: 'Core & Conditioning',
    subCategory: 'Core / Abs',
    category: 'Core',
    defaultEquipment: 'Cable',
    supportedEquipment: ['Cable', 'Resistance Band'],
    primaryMuscle: 'Rectus Abdominis (Six-Pack Core)',
    secondaryMuscles: ['Obliques'],
    animationType: 'core',
    cues: [
      'Anchor hips over knees and keep hips stationary',
      'Flex spine like curling ribcage down to touch pelvis',
      'Breathe all air out at bottom maximum abdominal contraction'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Cable Kneeling Crunch',
      url: 'https://musclewiki.com/cables/abs/kneeling-cable-crunch',
      source: 'MuscleWiki'
    },
    instructions: [
      'Kneel in front of high cable with rope attachment held at temples.',
      'Lock hips in position and flex thoracic spine downward.',
      'Curl elbows toward knees until abs contract hard.',
      'Unfurl spine back to starting stretch.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 60,
      repsUnit: 'reps'
    }
  },

  // 13. Pull-up or lat pulldown: Sets: 3, Reps: 6–10
  {
    id: 'pull-up-or-lat-pulldown',
    name: 'Pull-up or Lat Pulldown',
    split: 'Upper Body',
    subCategory: 'Back / Lats',
    category: 'Back',
    defaultEquipment: 'Bodyweight',
    supportedEquipment: ['Bodyweight', 'Cable', 'Machine', 'Resistance Band'],
    primaryMuscle: 'Latissimus Dorsi',
    secondaryMuscles: ['Biceps', 'Rhomboids', 'Brachialis'],
    animationType: 'row',
    cues: [
      'Begin from a dead hang with active depressed scapulae',
      'Drive elbows down towards ribcage to pull chest toward bar',
      'Chin clears bar without straining or neck reaching'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Pull-up',
      url: 'https://wger.de/en/exercise/101/view/pull-ups',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Grip pullup bar or lat pulldown attachment just outside shoulders.',
      'Engage lats and pull body or bar until upper chest approaches bar.',
      'Hold momentarily at top, lower down under 2-3 second tempo.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 8,
      minReps: 6,
      maxReps: 10,
      defaultWeight: 0,
      repsUnit: 'reps'
    }
  },

  // 14. Dumbbell shoulder press: Sets: 3, Reps: 6–10
  {
    id: 'dumbbell-shoulder-press',
    name: 'Dumbbell Shoulder Press',
    split: 'Upper Body',
    subCategory: 'Shoulders',
    category: 'Shoulders',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Barbell', 'Machine'],
    primaryMuscle: 'Anterior & Lateral Deltoid',
    secondaryMuscles: ['Triceps Brachii', 'Upper Trapezius', 'Core'],
    animationType: 'overhead',
    cues: [
      'Keep forearms vertical throughout the ascent',
      'Press weights overhead in a natural gentle arc',
      'Lower dumbbells until upper arms are parallel or slightly below shoulders'
    ],
    openSourceLink: {
      label: 'ExRx - Dumbbell Shoulder Press',
      url: 'https://exrx.net/WeightExercises/DeltoidAnterior/DBShoulderPress',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Sit or stand holding dumbbells at shoulder height with neutral or pronated grip.',
      'Brace core firmly and press both dumbbells overhead.',
      'Lock out at top with dumbbells aligned above crown of head.',
      'Lower smoothly back to shoulders.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 8,
      minReps: 6,
      maxReps: 10,
      defaultWeight: 45,
      repsUnit: 'reps'
    }
  },

  // 15. Seated cable row: Sets: 2, Reps: 8–12
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    split: 'Upper Body',
    subCategory: 'Back / Lats',
    category: 'Back',
    defaultEquipment: 'Cable',
    supportedEquipment: ['Cable', 'Machine'],
    primaryMuscle: 'Mid Trapezius & Latissimus Dorsi',
    secondaryMuscles: ['Rhomboids', 'Posterior Deltoids', 'Biceps'],
    animationType: 'row',
    cues: [
      'Maintain upright spine with proud chest throughout the pull',
      'Pull handle to navel while driving elbows backward',
      'Resist stretch forward without rounding lumbar spine'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Seated Cable Row',
      url: 'https://musclewiki.com/cables/back/seated-cable-row',
      source: 'MuscleWiki'
    },
    instructions: [
      'Sit on bench with feet braced on footrests, knees soft.',
      'Grasp V-grip or handle, sit tall.',
      'Row handle into stomach, pulling shoulder blades together.',
      'Extend arms back to full stretch under control.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 110,
      repsUnit: 'reps'
    }
  },

  // 16. Push-ups or cable chest fly: Sets: 2, Reps: 10–15
  {
    id: 'push-ups-or-cable-chest-fly',
    name: 'Push-ups or Cable Chest Fly',
    split: 'Upper Body',
    subCategory: 'Chest',
    category: 'Chest',
    defaultEquipment: 'Bodyweight',
    supportedEquipment: ['Bodyweight', 'Cable', 'Dumbbell'],
    primaryMuscle: 'Pectoralis Major',
    secondaryMuscles: ['Anterior Deltoid', 'Triceps Brachii', 'Core'],
    animationType: 'bench',
    cues: [
      'Keep body in one straight plank line from head to heels',
      'Tuck elbows 45 degrees to protect anterior shoulder capsule',
      'Lower until chest grazes floor or handles hug together in arc'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Push Up',
      url: 'https://wger.de/en/exercise/193/view/push-ups',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Assume high plank or set cable handles at chest height.',
      'Lower torso or hug handles together with slight elbow bend.',
      'Drive into floor or squeeze chest together at peak contraction.',
      'Repeat with strict cadence.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 0,
      repsUnit: 'reps'
    }
  },

  // 17. Face pull / rear-delt fly: Sets: 2, Reps: 12–20
  {
    id: 'face-pull-rear-delt-fly',
    name: 'Face Pull / Rear-Delt Fly',
    split: 'Upper Body',
    subCategory: 'Shoulders',
    category: 'Shoulders',
    defaultEquipment: 'Cable',
    supportedEquipment: ['Cable', 'Dumbbell', 'Resistance Band'],
    primaryMuscle: 'Posterior Deltoid & External Rotators (Infraspinatus)',
    secondaryMuscles: ['Middle Trapezius', 'Rhomboids'],
    animationType: 'overhead',
    cues: [
      'Set pulley at eye height and grasp rope thumbs-back',
      'Pull rope towards bridge of nose while externally rotating hands back',
      'Hold the double-bicep rear pose for 1 second'
    ],
    openSourceLink: {
      label: 'ExRx - Cable Face Pull',
      url: 'https://exrx.net/WeightExercises/DeltoidPosterior/CBFacePull',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Grasp rope with thumbs facing backward.',
      'Step back, pull rope handles toward forehead/ears.',
      'Flare elbows wide and externally rotate shoulders.',
      'Slowly return under control.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 15,
      minReps: 12,
      maxReps: 20,
      defaultWeight: 35,
      repsUnit: 'reps'
    }
  },

  // 18. Hammer curl: Sets: 2, Reps: 10–15
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    split: 'Upper Body',
    subCategory: 'Arms',
    category: 'Arms',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Cable', 'Kettlebell'],
    primaryMuscle: 'Brachioradialis & Brachialis',
    secondaryMuscles: ['Biceps Brachii'],
    animationType: 'curl',
    cues: [
      'Keep palms facing each other (neutral grip) throughout entire rep',
      'Elbows stay pinned to sides without swinging forward',
      'Squeeze forearm and arm muscle at top for 1 second'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Dumbbell Hammer Curl',
      url: 'https://musclewiki.com/dumbbells/biceps/hammer-curl',
      source: 'MuscleWiki'
    },
    instructions: [
      'Stand holding dumbbells with palms facing inwards.',
      'Curl weights upward while keeping wrists neutral.',
      'Squeeze at peak, then lower slowly over 2-3 seconds.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 30,
      repsUnit: 'reps'
    }
  },

  // 19. Overhead triceps extension: Sets: 2, Reps: 10–15
  {
    id: 'overhead-triceps-extension',
    name: 'Overhead Triceps Extension',
    split: 'Upper Body',
    subCategory: 'Arms',
    category: 'Arms',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Cable', 'Barbell'],
    primaryMuscle: 'Triceps Brachii (Long Head Stretch)',
    secondaryMuscles: ['Anconeus'],
    animationType: 'curl',
    cues: [
      'Keep elbows pointed forward/upward, avoiding excessive elbow flare',
      'Lower weight behind head until long head of triceps is deeply stretched',
      'Extend forearms to complete overhead lockout'
    ],
    openSourceLink: {
      label: 'ExRx - Overhead Triceps Extension',
      url: 'https://exrx.net/WeightExercises/Triceps/DBOneArmTriExt',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Hold dumbbell with both hands cupping upper plate overhead.',
      'Bend elbows to lower weight behind neck.',
      'Contract triceps to extend arms fully overhead.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 45,
      repsUnit: 'reps'
    }
  },

  // 20. Hip thrust or trap-bar deadlift: Sets: 3, Reps: 6–10
  {
    id: 'hip-thrust-or-trap-bar-deadlift',
    name: 'Hip Thrust or Trap-Bar Deadlift',
    split: 'Lower Body',
    subCategory: 'Hamstrings & Glutes',
    category: 'Legs',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Trap Bar', 'Dumbbell', 'Machine'],
    primaryMuscle: 'Gluteus Maximus',
    secondaryMuscles: ['Hamstrings', 'Erectors', 'Adductors'],
    animationType: 'deadlift',
    cues: [
      'Drive through heels and achieve full posterior pelvic tilt at top',
      'Keep chin tucked with ribs down to prevent lumbar hyperextension',
      'Hold lockout squeeze for 1-2 solid seconds'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Barbell Hip Thrust',
      url: 'https://musclewiki.com/barbell/glutes/barbell-hip-thrust',
      source: 'MuscleWiki'
    },
    instructions: [
      'Sit on floor with upper back against bench and loaded barbell across hips.',
      'Place feet hip-width with vertical shins at top.',
      'Drive hips skyward until thighs and torso align.',
      'Lower under control to light tap on floor.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 8,
      minReps: 6,
      maxReps: 10,
      defaultWeight: 185,
      repsUnit: 'reps'
    }
  },

  // 21. Goblet/front squat: Sets: 2, Reps: 8–12
  {
    id: 'goblet-front-squat',
    name: 'Goblet / Front Squat',
    split: 'Lower Body',
    subCategory: 'Quads',
    category: 'Legs',
    defaultEquipment: 'Kettlebell',
    supportedEquipment: ['Kettlebell', 'Dumbbell', 'Barbell'],
    primaryMuscle: 'Quadriceps & Anterior Core',
    secondaryMuscles: ['Gluteus Maximus', 'Upper Back'],
    animationType: 'squat',
    cues: [
      'Keep kettlebell or dumbbell pinned to sternum with elbows tucked',
      'Drop hips straight down between ankles while staying upright',
      'Drive through mid-foot to stand'
    ],
    openSourceLink: {
      label: 'ExRx - Goblet Squat',
      url: 'https://exrx.net/WeightExercises/Quadriceps/KBGobletSquat',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Hold weight against upper chest with upright posture.',
      'Descend deep into squat with knees tracking toes.',
      'Pause briefly in the hole, then stand with power.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 45,
      repsUnit: 'reps'
    }
  },

  // 22. Reverse lunge: Sets: 2, Reps: 8–10/leg
  {
    id: 'reverse-lunge',
    name: 'Reverse Lunge',
    split: 'Lower Body',
    subCategory: 'Quads',
    category: 'Legs',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Barbell', 'Kettlebell', 'Bodyweight'],
    primaryMuscle: 'Quadriceps & Gluteus Maximus',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    animationType: 'squat',
    cues: [
      'Step straight backward with steady hip alignment',
      'Lower back knee smoothly until 1 inch above floor',
      'Drive through front heel to step back to starting position'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Dumbbell Reverse Lunge',
      url: 'https://musclewiki.com/dumbbells/quads/dumbbell-reverse-lunge',
      source: 'MuscleWiki'
    },
    instructions: [
      'Stand tall holding dumbbells at sides.',
      'Step one foot back and descend into 90/90 lunge.',
      'Push off front leg to return to standing.',
      'Alternate legs or complete repetitions on one side.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 8,
      minReps: 8,
      maxReps: 10,
      defaultWeight: 35,
      repsUnit: '/leg'
    }
  },

  // 23. Seated leg curl: Sets: 2, Reps: 10–15
  {
    id: 'seated-leg-curl',
    name: 'Seated Leg Curl',
    split: 'Lower Body',
    subCategory: 'Hamstrings & Glutes',
    category: 'Legs',
    defaultEquipment: 'Machine',
    supportedEquipment: ['Machine'],
    primaryMuscle: 'Hamstrings (Seated Hip Flexion Focus)',
    secondaryMuscles: ['Gastrocnemius'],
    animationType: 'squat',
    cues: [
      'Tighten thigh clamp pad so hips cannot elevate',
      'Dorsiflex toes (pull toes toward shins) for maximal hamstring recruitment',
      'Control return for 3 seconds'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Seated Leg Curl',
      url: 'https://wger.de/en/exercise/117/view/leg-curl',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Adjust seat so knees align with pivot point.',
      'Lower top thigh pad securely.',
      'Flex knees to pull pad down underneath seat.',
      'Slowly release back to starting point.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 80,
      repsUnit: 'reps'
    }
  },

  // 24. Seated calf raise: Sets: 2, Reps: 12–20
  {
    id: 'seated-calf-raise',
    name: 'Seated Calf Raise',
    split: 'Lower Body',
    subCategory: 'Calves',
    category: 'Legs',
    defaultEquipment: 'Machine',
    supportedEquipment: ['Machine', 'Dumbbell'],
    primaryMuscle: 'Soleus (Deep Postural Calf Muscle)',
    secondaryMuscles: ['Gastrocnemius'],
    animationType: 'squat',
    cues: [
      '90-degree knee bend deactivates gastrocnemius to isolate the soleus',
      'Full deep stretch at bottom for 2 seconds',
      'Push up onto toes and squeeze for 2 seconds'
    ],
    openSourceLink: {
      label: 'ExRx - Seated Calf Raise',
      url: 'https://exrx.net/WeightExercises/Soleus/LVSeatedCalfRaise',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Sit with balls of feet on platform, pads over lower thighs.',
      'Release safety bar, lower heels as low as possible.',
      'Elevate heels to maximum height squeezing soleus.',
      'Lower smoothly.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 15,
      minReps: 12,
      maxReps: 20,
      defaultWeight: 65,
      repsUnit: 'reps'
    }
  },

  // 25. Hanging knee raise: Sets: 2, Reps: 8–15
  {
    id: 'hanging-knee-raise',
    name: 'Hanging Knee Raise',
    split: 'Core & Conditioning',
    subCategory: 'Core / Abs',
    category: 'Core',
    defaultEquipment: 'Bodyweight',
    supportedEquipment: ['Bodyweight', 'Machine'],
    primaryMuscle: 'Rectus Abdominis & Iliopsoas',
    secondaryMuscles: ['Obliques', 'Forearms'],
    animationType: 'core',
    cues: [
      'Posteriorly tilt pelvis to initiate abdominal contraction',
      'Avoid swinging or using backward momentum',
      'Curl knees up to chest level and pause'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Hanging Knee Raise',
      url: 'https://musclewiki.com/bodyweight/abs/hanging-knee-raise',
      source: 'MuscleWiki'
    },
    instructions: [
      'Hang from bar with active shoulders.',
      'Brace core and tuck knees toward chest.',
      'Pause at peak curl without swinging.',
      'Lower legs under 2-second cadence.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 10,
      minReps: 8,
      maxReps: 15,
      defaultWeight: 0,
      repsUnit: 'reps'
    }
  },

  // 26. Side plank: Sets: 2, Reps: 30–45 sec/side
  {
    id: 'side-plank',
    name: 'Side Plank',
    split: 'Core & Conditioning',
    subCategory: 'Core / Abs',
    category: 'Core',
    defaultEquipment: 'Bodyweight',
    supportedEquipment: ['Bodyweight'],
    primaryMuscle: 'Quadratus Lumborum & Obliques',
    secondaryMuscles: ['Gluteus Medius', 'Transverse Abdominis'],
    animationType: 'core',
    cues: [
      'Elbow placed directly below shoulder joint',
      'Lift hips so body forms a straight line from shoulder to ankle',
      'Breathe deeply into diaphragm while maintaining tight abdominal brace'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Side Plank',
      url: 'https://wger.de/en/exercise/258/view/side-plank',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Lie on side with elbow directly beneath shoulder, feet stacked.',
      'Elevate hips off floor into straight rigid alignment.',
      'Hold position for target 30–45 seconds, then switch sides.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 30,
      minReps: 30,
      maxReps: 45,
      defaultWeight: 0,
      repsUnit: 'sec/side'
    }
  }
];

// Preset split routine templates for 1-click loading
export interface RoutineExerciseConfig {
  exerciseId: string;
  targetSets: number;
  targetReps: number;
  targetWeight: number;
  equipment?: string;
  supersetTag?: string;
}

export interface RoutineTemplate {
  id: string;
  name: string;
  split: SplitCategory;
  description: string;
  exerciseIds: string[];
  exerciseConfigs?: RoutineExerciseConfig[];
  isCustom?: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  split: SplitCategory;
  description: string;
  exerciseIds: string[];
}

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'upper-day-a',
    name: 'Upper Day A (Hypertrophy & Strength)',
    split: 'Upper Body',
    description: 'Bench press, Chest-supported row, Incline DB press, Lat pulldown, Lateral raise, Triceps pushdown',
    exerciseIds: [
      'bench-press',
      'chest-supported-row',
      'incline-dumbbell-press',
      'lat-pulldown',
      'dumbbell-lateral-raise',
      'triceps-rope-pushdown'
    ]
  },
  {
    id: 'lower-day-a',
    name: 'Lower Day A (Squat & Hamstring Focus)',
    split: 'Lower Body',
    description: 'Squat/Leg press, Romanian deadlift, Bulgarian split squat, Leg curl, Standing calf raise, Cable crunch',
    exerciseIds: [
      'squat-or-leg-press',
      'romanian-deadlift',
      'bulgarian-split-squat',
      'leg-curl',
      'standing-calf-raise',
      'cable-crunch'
    ]
  },
  {
    id: 'upper-day-b',
    name: 'Upper Day B (Vertical Pull & Overhead Focus)',
    split: 'Upper Body',
    description: 'Pull-up/Lat pulldown, DB shoulder press, Seated cable row, Push-ups/Fly, Face pull, Hammer curl, Overhead triceps',
    exerciseIds: [
      'pull-up-or-lat-pulldown',
      'dumbbell-shoulder-press',
      'seated-cable-row',
      'push-ups-or-cable-chest-fly',
      'face-pull-rear-delt-fly',
      'hammer-curl',
      'overhead-triceps-extension'
    ]
  },
  {
    id: 'lower-day-b',
    name: 'Lower Day B (Posterior Chain & Unilateral Focus)',
    split: 'Lower Body',
    description: 'Hip thrust/Trap-bar, Goblet/Front squat, Reverse lunge, Seated leg curl, Seated calf raise, Hanging knee raise, Side plank',
    exerciseIds: [
      'hip-thrust-or-trap-bar-deadlift',
      'goblet-front-squat',
      'reverse-lunge',
      'seated-leg-curl',
      'seated-calf-raise',
      'hanging-knee-raise',
      'side-plank'
    ]
  }
];
