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
  },

  // -------------------------------------------------------------
  // EXPANDED EXERCISE LIBRARY (CHEST)
  // -------------------------------------------------------------
  {
    id: 'incline-barbell-bench-press',
    name: 'Incline Barbell Bench Press',
    split: 'Upper Body',
    subCategory: 'Chest',
    category: 'Chest',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Dumbbell', 'Machine', 'Smith Machine'],
    primaryMuscle: 'Clavicular Head (Upper Pectorals)',
    secondaryMuscles: ['Anterior Deltoid', 'Triceps Brachii'],
    animationType: 'bench',
    cues: [
      'Set bench to 30 degrees to bias upper clavicular fibers',
      'Touch the bar to upper chest right below clavicles',
      'Drive elbows inward to maximize upper pectoral tension'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Incline Barbell Bench',
      url: 'https://musclewiki.com/barbell/chest/incline-barbell-bench-press',
      source: 'MuscleWiki'
    },
    instructions: [
      'Position bench under barbell at 30-degree incline.',
      'Grip slightly wider than shoulder width.',
      'Lower bar with control to upper chest, then press explosively.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 8,
      minReps: 6,
      maxReps: 10,
      defaultWeight: 115,
      repsUnit: 'reps'
    }
  },
  {
    id: 'dumbbell-flat-bench-press',
    name: 'Dumbbell Flat Bench Press',
    split: 'Upper Body',
    subCategory: 'Chest',
    category: 'Chest',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Barbell', 'Machine'],
    primaryMuscle: 'Pectoralis Major (Sternal Head)',
    secondaryMuscles: ['Anterior Deltoid', 'Triceps Brachii'],
    animationType: 'bench',
    cues: [
      'Kick dumbbells to chest using knees when lying back',
      'Retract scapulae and press in an arcing convergent path',
      'Get a deep stretch at bottom without flaring elbows 90 degrees'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Dumbbell Bench Press',
      url: 'https://wger.de/en/exercise/73/view/dumbbell-bench-press',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Lie flat on bench holding dumbbells directly over chest.',
      'Lower dumbbells until handles reach outer chest depth.',
      'Press upward converging dumbbells toward center.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 55,
      repsUnit: 'reps'
    }
  },
  {
    id: 'decline-dumbbell-press',
    name: 'Decline Dumbbell Press',
    split: 'Upper Body',
    subCategory: 'Chest',
    category: 'Chest',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Barbell', 'Machine'],
    primaryMuscle: 'Lower Pectoralis Major (Costal Head)',
    secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoid'],
    animationType: 'bench',
    cues: [
      'Hook legs securely beneath decline pads',
      'Lower weights to lower pectoral line under control',
      'Lock out overhead with strong chest contraction'
    ],
    openSourceLink: {
      label: 'ExRx - Decline Dumbbell Press',
      url: 'https://exrx.net/WeightExercises/PectoralSternal/DBDeclineBenchPress',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Position yourself on a decline bench with ankles secured.',
      'Press dumbbells up from lower chest level.',
      'Control eccentric stretch and press back to starting point.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 50,
      repsUnit: 'reps'
    }
  },
  {
    id: 'cable-chest-crossover',
    name: 'Cable Chest Crossover (Low to High)',
    split: 'Upper Body',
    subCategory: 'Chest',
    category: 'Chest',
    defaultEquipment: 'Cable',
    supportedEquipment: ['Cable', 'Resistance Band'],
    primaryMuscle: 'Clavicular & Sternal Pectoralis',
    secondaryMuscles: ['Anterior Deltoid', 'Biceps Short Head'],
    animationType: 'bench',
    cues: [
      'Stagger stance for base stability with slight forward lean',
      'Sweep hands upward and inward as if hugging a wide barrel',
      'Hold peak squeeze for 1 second at top cross point'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Cable Low Fly',
      url: 'https://musclewiki.com/cables/chest/low-cable-fly',
      source: 'MuscleWiki'
    },
    instructions: [
      'Set pulleys to lowest notch with D-handles.',
      'Step forward with arms outstretched behind torso.',
      'Bring hands up and together toward eye level with a deep pectoral squeeze.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 25,
      repsUnit: 'reps'
    }
  },
  {
    id: 'weighted-chest-dips',
    name: 'Weighted / Bodyweight Chest Dips',
    split: 'Upper Body',
    subCategory: 'Chest',
    category: 'Chest',
    defaultEquipment: 'Bodyweight',
    supportedEquipment: ['Bodyweight', 'Dumbbell', 'Machine'],
    primaryMuscle: 'Lower Pectoralis Major',
    secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoid'],
    animationType: 'bench',
    cues: [
      'Lean torso forward 30 degrees to shift load from triceps to chest',
      'Flare elbows slightly outward on the descent',
      'Descend until shoulders dip just below elbows'
    ],
    openSourceLink: {
      label: 'ExRx - Chest Dips',
      url: 'https://exrx.net/WeightExercises/PectoralSternal/BWChestDip',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Support body on parallel bars with arms extended.',
      'Lean forward and bend knees, crossing ankles.',
      'Lower torso until chest feels a full stretch, then drive upward to lockout.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 8,
      minReps: 6,
      maxReps: 12,
      defaultWeight: 0,
      repsUnit: 'reps'
    }
  },
  {
    id: 'machine-chest-press',
    name: 'Machine Chest Press (Converging)',
    split: 'Upper Body',
    subCategory: 'Chest',
    category: 'Chest',
    defaultEquipment: 'Machine',
    supportedEquipment: ['Machine'],
    primaryMuscle: 'Pectoralis Major',
    secondaryMuscles: ['Triceps', 'Front Delts'],
    animationType: 'bench',
    cues: [
      'Adjust seat height so handles align with mid-nipple line',
      'Keep shoulder blades packed against back pad throughout press',
      'Slow 3-second negative eccentric tempo'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Machine Bench Press',
      url: 'https://wger.de/en/exercise/235/view/machine-chest-press',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Sit firmly against backrest with feet planted flat.',
      'Grasp horizontal handles and press forward smoothly.',
      'Control return until weight plates hover above stack.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 110,
      repsUnit: 'reps'
    }
  },
  {
    id: 'dumbbell-pullover',
    name: 'Dumbbell Pullover',
    split: 'Upper Body',
    subCategory: 'Chest',
    category: 'Chest',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Barbell'],
    primaryMuscle: 'Serratus Anterior & Lower Pecs',
    secondaryMuscles: ['Latissimus Dorsi', 'Triceps Long Head'],
    animationType: 'bench',
    cues: [
      'Form diamond grip on underside of top dumbbell plate',
      'Lower weight behind head with soft elbow bend until lats stretch',
      'Pull back over chest using chest and serratus contraction'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Dumbbell Pullover',
      url: 'https://musclewiki.com/dumbbells/chest/dumbbell-pullover',
      source: 'MuscleWiki'
    },
    instructions: [
      'Lie perpendicular across bench with upper back supported and hips low.',
      'Hold dumbbell overhead with two hands.',
      'Slowly arc weight behind head and pull back over sternum.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 45,
      repsUnit: 'reps'
    }
  },

  // -------------------------------------------------------------
  // EXPANDED EXERCISE LIBRARY (BACK / LATS)
  // -------------------------------------------------------------
  {
    id: 'barbell-bent-over-row',
    name: 'Barbell Bent-Over Row (Overhand)',
    split: 'Upper Body',
    subCategory: 'Back / Lats',
    category: 'Back',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Dumbbell', 'Smith Machine'],
    primaryMuscle: 'Latissimus Dorsi & Rhomboids',
    secondaryMuscles: ['Erector Spinae', 'Biceps Brachii', 'Rear Delts'],
    animationType: 'row',
    cues: [
      'Hinge at hips until torso is roughly 45 degrees to the floor',
      'Pull bar to lower sternum/belly button, driving elbows back',
      'Maintain neutral spine without rounding lumbar'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Barbell Row',
      url: 'https://wger.de/en/exercise/14/view/barbell-row',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Hinge at hips with knees slightly bent holding barbell overhand.',
      'Row barbell upward until it grazes the abdomen.',
      'Lower with control to full arm hang.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 8,
      minReps: 6,
      maxReps: 10,
      defaultWeight: 115,
      repsUnit: 'reps'
    }
  },
  {
    id: 't-bar-row',
    name: 'T-Bar Row (Neutral Grip)',
    split: 'Upper Body',
    subCategory: 'Back / Lats',
    category: 'Back',
    defaultEquipment: 'Machine',
    supportedEquipment: ['Machine', 'Barbell'],
    primaryMuscle: 'Middle Trapezius & Lats',
    secondaryMuscles: ['Rhomboids', 'Brachialis'],
    animationType: 'row',
    cues: [
      'Grip close neutral handles firmly',
      'Keep chest elevated and pull through elbows',
      'Squeeze shoulder blades hard at top'
    ],
    openSourceLink: {
      label: 'ExRx - T-Bar Row',
      url: 'https://exrx.net/WeightExercises/BackGeneral/LBTBarRow',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Straddle bar and take neutral grip on handles.',
      'Hinge hips and pull handles toward lower ribcage.',
      'Lower smoothly into full stretch.'
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
  {
    id: 'single-arm-dumbbell-row',
    name: 'Single-Arm Dumbbell Row',
    split: 'Upper Body',
    subCategory: 'Back / Lats',
    category: 'Back',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Kettlebell'],
    primaryMuscle: 'Latissimus Dorsi',
    secondaryMuscles: ['Biceps', 'Rhomboids', 'Core Stabilizers'],
    animationType: 'row',
    cues: [
      'Place knee and supporting hand flat on bench',
      'Pull dumbbell in an arc toward hip pocket, not straight up',
      'Keep hips square and avoid excessive torso rotation'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Dumbbell Row',
      url: 'https://musclewiki.com/dumbbells/back/single-arm-dumbbell-row',
      source: 'MuscleWiki'
    },
    instructions: [
      'Set one knee and same-side hand on flat bench.',
      'Hold dumbbell with free hand hanging straight down.',
      'Drive elbow toward hip, pause, and lower under control.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 50,
      repsUnit: 'reps'
    }
  },
  {
    id: 'close-grip-lat-pulldown',
    name: 'Close-Grip V-Bar Lat Pulldown',
    split: 'Upper Body',
    subCategory: 'Back / Lats',
    category: 'Back',
    defaultEquipment: 'Cable',
    supportedEquipment: ['Cable', 'Machine'],
    primaryMuscle: 'Lower Latissimus Dorsi',
    secondaryMuscles: ['Biceps Brachii', 'Mid-Traps'],
    animationType: 'row',
    cues: [
      'Attach V-handle to pulldown cable',
      'Lean back 10–15 degrees and pull handle directly to clavicles',
      'Lead with elbows and tuck them down toward waist'
    ],
    openSourceLink: {
      label: 'ExRx - Cable Close-Grip Pulldown',
      url: 'https://exrx.net/WeightExercises/LatissimusDorsi/CBCloseGripPulldown',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Sit facing machine with knees pinned securely beneath pads.',
      'Grasp V-bar and pull downward until handle reaches upper chest.',
      'Extend arms slowly back to full lat stretch overhead.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 100,
      repsUnit: 'reps'
    }
  },
  {
    id: 'straight-arm-lat-pushdown',
    name: 'Straight-Arm Cable Lat Pushdown',
    split: 'Upper Body',
    subCategory: 'Back / Lats',
    category: 'Back',
    defaultEquipment: 'Cable',
    supportedEquipment: ['Cable', 'Resistance Band'],
    primaryMuscle: 'Latissimus Dorsi (Teres Major)',
    secondaryMuscles: ['Triceps Long Head', 'Abdominals'],
    animationType: 'row',
    cues: [
      'Maintain slight elbow bend without changing angle during rep',
      'Hinge forward slightly at hips',
      'Push bar down in sweeping arc until it touches upper thighs'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Cable Straight Arm Pulldown',
      url: 'https://musclewiki.com/cables/back/straight-arm-pulldown',
      source: 'MuscleWiki'
    },
    instructions: [
      'Face high pulley with straight bar attachment.',
      'Grasp bar overhand with shoulder-width grip.',
      'Sweep bar down toward thighs, pause for contraction, and return overhead.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 45,
      repsUnit: 'reps'
    }
  },
  {
    id: 'chin-ups',
    name: 'Chin-ups (Underhand Grip)',
    split: 'Upper Body',
    subCategory: 'Back / Lats',
    category: 'Back',
    defaultEquipment: 'Bodyweight',
    supportedEquipment: ['Bodyweight', 'Resistance Band', 'Machine'],
    primaryMuscle: 'Latissimus Dorsi & Biceps Brachii',
    secondaryMuscles: ['Brachialis', 'Lower Trapezius'],
    animationType: 'row',
    cues: [
      'Supinated palms-facing-you shoulder-width grip',
      'Pull chest up to touch the bar without swinging or kicking legs',
      'Lower all the way down to complete dead hang'
    ],
    openSourceLink: {
      label: 'ExRx - Underhand Chin-up',
      url: 'https://exrx.net/WeightExercises/LatissimusDorsi/BWUnderhandChinup',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Grasp overhead bar with palms facing you.',
      'Pull body upward until chin clears the bar.',
      'Lower under complete control back to starting dead hang.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 8,
      minReps: 5,
      maxReps: 10,
      defaultWeight: 0,
      repsUnit: 'reps'
    }
  },
  {
    id: 'inverted-bodyweight-row',
    name: 'Inverted Row (Smith / Barbell)',
    split: 'Upper Body',
    subCategory: 'Back / Lats',
    category: 'Back',
    defaultEquipment: 'Bodyweight',
    supportedEquipment: ['Bodyweight', 'Barbell', 'Resistance Band'],
    primaryMuscle: 'Rhomboids & Mid Trapezius',
    secondaryMuscles: ['Biceps', 'Posterior Deltoids', 'Core'],
    animationType: 'row',
    cues: [
      'Set bar at waist height and hang underneath with body rigid',
      'Pull chest to bar while keeping glutes squeezed and body in plank',
      'Lower under control without hips sagging'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Inverted Row',
      url: 'https://wger.de/en/exercise/257/view/inverted-row',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Lie underneath fixed barbell set at waist height.',
      'Grip bar with overhand grip and heels on the floor.',
      'Pull chest directly to bar, squeeze shoulder blades, and lower.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 0,
      repsUnit: 'reps'
    }
  },

  // -------------------------------------------------------------
  // EXPANDED EXERCISE LIBRARY (SHOULDERS)
  // -------------------------------------------------------------
  {
    id: 'barbell-overhead-press',
    name: 'Barbell Overhead Press (OHP)',
    split: 'Upper Body',
    subCategory: 'Shoulders',
    category: 'Shoulders',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Dumbbell', 'Smith Machine'],
    primaryMuscle: 'Anterior & Medial Deltoids',
    secondaryMuscles: ['Triceps Brachii', 'Upper Trapezius', 'Core'],
    animationType: 'overhead',
    cues: [
      'Squeeze glutes and brace core tightly to protect lumbar',
      'Press bar in vertical path, tucking chin back slightly until bar clears',
      'Lock out bar directly over mid-foot balance line'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Overhead Press',
      url: 'https://musclewiki.com/barbell/shoulders/overhead-press',
      source: 'MuscleWiki'
    },
    instructions: [
      'Hold bar at clavicle level with clean grip just outside shoulders.',
      'Take deep breath, brace core and glutes.',
      'Press straight up to full lockout overhead, bringing head slightly through window at top.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 6,
      minReps: 5,
      maxReps: 8,
      defaultWeight: 85,
      repsUnit: 'reps'
    }
  },
  {
    id: 'cable-lateral-raise',
    name: 'Cable Lateral Raise',
    split: 'Upper Body',
    subCategory: 'Shoulders',
    category: 'Shoulders',
    defaultEquipment: 'Cable',
    supportedEquipment: ['Cable', 'Resistance Band'],
    primaryMuscle: 'Lateral Deltoid',
    secondaryMuscles: ['Supraspinatus', 'Trapezius'],
    animationType: 'overhead',
    cues: [
      'Set cable at knee height with cuff or D-handle',
      'Lead with elbow and raise out in scapular plane 30 degrees forward',
      'Constant smooth tension throughout entire range'
    ],
    openSourceLink: {
      label: 'ExRx - Cable Lateral Raise',
      url: 'https://exrx.net/WeightExercises/DeltoidLateral/CBLateralRaise',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Stand sideways to low cable pulley holding handle across body.',
      'Raise arm out to side until parallel to floor.',
      'Lower smoothly resisting the cable pull.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 15,
      repsUnit: 'reps'
    }
  },
  {
    id: 'arnold-press',
    name: 'Arnold Dumbbell Press',
    split: 'Upper Body',
    subCategory: 'Shoulders',
    category: 'Shoulders',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Kettlebell'],
    primaryMuscle: 'Anterior & Medial Deltoid',
    secondaryMuscles: ['Triceps Brachii', 'Rotator Cuff'],
    animationType: 'overhead',
    cues: [
      'Start with dumbbells at chin level, palms facing chest',
      'Rotate wrists outward as you press upward overhead',
      'Finish with palms facing forward at full lockout'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Arnold Press',
      url: 'https://musclewiki.com/dumbbells/shoulders/arnold-press',
      source: 'MuscleWiki'
    },
    instructions: [
      'Sit on upright bench holding dumbbells at chest height, palms facing in.',
      'Press upward while rotating forearms 180 degrees outward.',
      'Reverse rotation smoothly as you lower dumbbells back to starting position.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 35,
      repsUnit: 'reps'
    }
  },
  {
    id: 'reverse-pec-deck-fly',
    name: 'Reverse Pec Deck (Rear Delt Fly)',
    split: 'Upper Body',
    subCategory: 'Shoulders',
    category: 'Shoulders',
    defaultEquipment: 'Machine',
    supportedEquipment: ['Machine', 'Cable', 'Dumbbell'],
    primaryMuscle: 'Posterior Deltoid',
    secondaryMuscles: ['Rhomboids', 'Infraspinatus'],
    animationType: 'row',
    cues: [
      'Adjust seat so handles are at eye level',
      'Keep elbows high and drive arms outward in wide horizontal arc',
      'Focus pull on back of shoulders rather than squeezing mid-back'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Rear Delt Fly',
      url: 'https://wger.de/en/exercise/105/view/reverse-flyes',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Sit facing the pec deck machine with chest against pad.',
      'Grasp handles with neutral or overhand grip.',
      'Sweep handles outward until arms are in line with shoulders.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 70,
      repsUnit: 'reps'
    }
  },
  {
    id: 'incline-dumbbell-rear-delt-raise',
    name: 'Incline Dumbbell Rear Delt Raise',
    split: 'Upper Body',
    subCategory: 'Shoulders',
    category: 'Shoulders',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Resistance Band'],
    primaryMuscle: 'Posterior Deltoid',
    secondaryMuscles: ['Trapezius', 'Teres Minor'],
    animationType: 'row',
    cues: [
      'Lie chest-down on 30-degree incline bench',
      'Raise dumbbells out to sides with slight bend in elbows',
      'Lead with pinkies to maximize rear deltoid contraction'
    ],
    openSourceLink: {
      label: 'ExRx - Incline Rear Lateral Raise',
      url: 'https://exrx.net/WeightExercises/DeltoidPosterior/DBInclineRearLateralRaise',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Lie prone on incline bench holding light dumbbells.',
      'Raise arms outward in a T-shape with elbows slightly bent.',
      'Pause at peak height, then lower under control.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 15,
      repsUnit: 'reps'
    }
  },

  // -------------------------------------------------------------
  // EXPANDED EXERCISE LIBRARY (ARMS: BICEPS & TRICEPS)
  // -------------------------------------------------------------
  {
    id: 'ez-bar-biceps-curl',
    name: 'EZ-Bar Biceps Curl',
    split: 'Upper Body',
    subCategory: 'Arms',
    category: 'Arms',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Cable', 'Dumbbell'],
    primaryMuscle: 'Biceps Brachii (Short & Long Heads)',
    secondaryMuscles: ['Brachialis', 'Brachioradialis'],
    animationType: 'curl',
    cues: [
      'Grip the cambered inner curve of the EZ-bar',
      'Pin elbows securely against ribcage with zero torso swing',
      'Curl upward to full contraction, squeeze for 1 second'
    ],
    openSourceLink: {
      label: 'MuscleWiki - EZ-Bar Biceps Curl',
      url: 'https://musclewiki.com/barbell/biceps/ez-bar-curl',
      source: 'MuscleWiki'
    },
    instructions: [
      'Stand tall holding EZ-bar with underhand grip.',
      'Curl bar up toward shoulders keeping upper arms motionless.',
      'Lower smoothly back to full elbow extension.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 55,
      repsUnit: 'reps'
    }
  },
  {
    id: 'incline-dumbbell-biceps-curl',
    name: 'Incline Dumbbell Biceps Curl',
    split: 'Upper Body',
    subCategory: 'Arms',
    category: 'Arms',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell'],
    primaryMuscle: 'Biceps Brachii (Long Head Stretch)',
    secondaryMuscles: ['Brachialis', 'Forearm Flexors'],
    animationType: 'curl',
    cues: [
      'Set bench to 45–60 degrees incline',
      'Let arms hang perpendicular to floor for deep stretch',
      'Supinate wrists as you curl up, keeping elbows pointed down'
    ],
    openSourceLink: {
      label: 'ExRx - Incline Dumbbell Curl',
      url: 'https://exrx.net/WeightExercises/Biceps/DBInclineCurl',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Lie back on incline bench with dumbbells hanging at sides.',
      'Curl weights upward while turning palms up.',
      'Control the lowering phase to feel maximum long-head stretch.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 25,
      repsUnit: 'reps'
    }
  },
  {
    id: 'preacher-curl',
    name: 'Preacher Curl (EZ-Bar / Machine)',
    split: 'Upper Body',
    subCategory: 'Arms',
    category: 'Arms',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Dumbbell', 'Machine'],
    primaryMuscle: 'Biceps Brachii (Short Head Focus)',
    secondaryMuscles: ['Brachialis'],
    animationType: 'curl',
    cues: [
      'Rest armpits snugly on top of preacher pad',
      'Keep wrists rigid without curling them into forearms',
      'Stop just shy of full lockout at bottom to protect distal tendon'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Preacher Curl',
      url: 'https://wger.de/en/exercise/87/view/preacher-curls',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Sit at preacher bench with upper arms flat against angled pad.',
      'Curl EZ-bar upward toward chin.',
      'Lower bar with control until forearms are almost parallel with pad.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 45,
      repsUnit: 'reps'
    }
  },
  {
    id: 'concentration-curl',
    name: 'Dumbbell Concentration Curl',
    split: 'Upper Body',
    subCategory: 'Arms',
    category: 'Arms',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell'],
    primaryMuscle: 'Biceps Brachii Peak',
    secondaryMuscles: ['Brachialis'],
    animationType: 'curl',
    cues: [
      'Brace triceps against inner thigh, just above knee',
      'Do not swing or rock upper body',
      'Squeeze biceps peak aggressively at top of movement'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Concentration Curl',
      url: 'https://musclewiki.com/dumbbells/biceps/concentration-curl',
      source: 'MuscleWiki'
    },
    instructions: [
      'Sit on edge of bench with legs spread wide.',
      'Rest elbow against inner thigh, arm hanging straight down.',
      'Curl dumbbell upward to chest and lower slowly.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 12,
      minReps: 10,
      maxReps: 12,
      defaultWeight: 25,
      repsUnit: 'reps'
    }
  },
  {
    id: 'skull-crushers',
    name: 'Skull Crushers (Lying Triceps Extension)',
    split: 'Upper Body',
    subCategory: 'Arms',
    category: 'Arms',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Dumbbell', 'Cable'],
    primaryMuscle: 'Triceps Brachii (Medial & Lateral Heads)',
    secondaryMuscles: ['Triceps Long Head', 'Anconeus'],
    animationType: 'curl',
    cues: [
      'Angle upper arms slightly back toward head (not vertical)',
      'Lower bar slowly toward crown of forehead',
      'Extend forearms cleanly without flaring elbows wide'
    ],
    openSourceLink: {
      label: 'ExRx - Lying Triceps Extension',
      url: 'https://exrx.net/WeightExercises/Triceps/BBLyingTriExt',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Lie flat on bench holding EZ-bar with narrow overhand grip.',
      'Lower bar toward forehead by bending elbows only.',
      'Extend elbows powerfully back to lockout position.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 50,
      repsUnit: 'reps'
    }
  },
  {
    id: 'close-grip-bench-press',
    name: 'Close-Grip Barbell Bench Press',
    split: 'Upper Body',
    subCategory: 'Arms',
    category: 'Arms',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Smith Machine'],
    primaryMuscle: 'Triceps Brachii (All Heads)',
    secondaryMuscles: ['Pectoralis Major', 'Anterior Deltoid'],
    animationType: 'bench',
    cues: [
      'Grip shoulder-width (avoid wrists touching)',
      'Tuck elbows 30 degrees to ribcage on descent',
      'Push through triceps and lock out at top'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Close Grip Bench Press',
      url: 'https://musclewiki.com/barbell/triceps/close-grip-bench-press',
      source: 'MuscleWiki'
    },
    instructions: [
      'Lie flat on bench with shoulder-width grip on barbell.',
      'Lower bar to lower sternum with elbows tucked close to sides.',
      'Press upward focusing tension directly into triceps.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 8,
      minReps: 6,
      maxReps: 10,
      defaultWeight: 115,
      repsUnit: 'reps'
    }
  },
  {
    id: 'cable-overhead-triceps-rope',
    name: 'Cable Overhead Triceps Extension (Rope)',
    split: 'Upper Body',
    subCategory: 'Arms',
    category: 'Arms',
    defaultEquipment: 'Cable',
    supportedEquipment: ['Cable', 'Resistance Band'],
    primaryMuscle: 'Triceps Brachii (Long Head Stretch)',
    secondaryMuscles: ['Triceps Lateral Head'],
    animationType: 'curl',
    cues: [
      'Step forward from pulley and lean torso forward 45 degrees',
      'Keep elbows pinned near ears throughout rep',
      'Flare rope ends apart at full overhead extension'
    ],
    openSourceLink: {
      label: 'ExRx - Cable Overhead Triceps Extension',
      url: 'https://exrx.net/WeightExercises/Triceps/CBOverheadTriExtRope',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Attach rope to low or mid pulley and turn back to weight stack.',
      'Hold rope behind head with elbows bent.',
      'Extend arms overhead, separating rope ends at full lockout.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 35,
      repsUnit: 'reps'
    }
  },
  {
    id: 'dumbbell-kickbacks',
    name: 'Dumbbell Triceps Kickback',
    split: 'Upper Body',
    subCategory: 'Arms',
    category: 'Arms',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Cable'],
    primaryMuscle: 'Triceps Brachii (Lateral Head)',
    secondaryMuscles: ['Posterior Deltoid'],
    animationType: 'curl',
    cues: [
      'Hinge torso parallel to floor with upper arm tucked tight against ribs',
      'Extend forearm backward until arm is completely straight',
      'Hold peak squeeze for 1 second before lowering'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Triceps Kickback',
      url: 'https://wger.de/en/exercise/89/view/tricep-kickback',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Place one knee on bench and hinge torso forward.',
      'Bring upper arm parallel with torso.',
      'Extend forearm straight back to full triceps lockout, then lower.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 20,
      repsUnit: 'reps'
    }
  },

  // -------------------------------------------------------------
  // EXPANDED EXERCISE LIBRARY (QUADS)
  // -------------------------------------------------------------
  {
    id: 'barbell-back-squat',
    name: 'Barbell Back Squat (High Bar / Low Bar)',
    split: 'Lower Body',
    subCategory: 'Quads',
    category: 'Legs',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Smith Machine'],
    primaryMuscle: 'Quadriceps Femoris & Gluteus Maximus',
    secondaryMuscles: ['Adductors', 'Hamstrings', 'Erector Spinae', 'Core'],
    animationType: 'squat',
    cues: [
      'Brace abdominal wall with deep diaphragmatic breath into belt',
      'Break at knees and hips simultaneously with chest held tall',
      'Drive out of the hole spreading the floor through whole foot'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Barbell Back Squat',
      url: 'https://musclewiki.com/barbell/quads/barbell-squat',
      source: 'MuscleWiki'
    },
    instructions: [
      'Rest bar securely on upper traps (high bar) or rear delts (low bar).',
      'Descend until hip crease is below parallel with knees.',
      'Drive powerfully upward through mid-foot back to standing.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 6,
      minReps: 5,
      maxReps: 8,
      defaultWeight: 185,
      repsUnit: 'reps'
    }
  },
  {
    id: 'hack-squat',
    name: 'Hack Squat (45° Sled Machine)',
    split: 'Lower Body',
    subCategory: 'Quads',
    category: 'Legs',
    defaultEquipment: 'Machine',
    supportedEquipment: ['Machine'],
    primaryMuscle: 'Vastus Lateralis & Rectus Femoris',
    secondaryMuscles: ['Gluteus Maximus'],
    animationType: 'squat',
    cues: [
      'Place feet lower on platform for maximal knee flexion and quad bias',
      'Keep lumbar and back firmly pinned to padded carriage',
      'Control deep descent to at least 90 degrees knee bend'
    ],
    openSourceLink: {
      label: 'ExRx - Sled Hack Squat',
      url: 'https://exrx.net/WeightExercises/Quadriceps/SLHackSquat',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Step into machine with shoulders under pads and back flat.',
      'Release safety handles and lower carriage smoothly into deep squat.',
      'Drive through mid-foot back to starting lockout.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 140,
      repsUnit: 'reps'
    }
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension (Quadriceps Isolation)',
    split: 'Lower Body',
    subCategory: 'Quads',
    category: 'Legs',
    defaultEquipment: 'Machine',
    supportedEquipment: ['Machine', 'Resistance Band'],
    primaryMuscle: 'Rectus Femoris & Vastus Medialis (Teardrop)',
    secondaryMuscles: ['Vastus Intermedius'],
    animationType: 'squat',
    cues: [
      'Align knee joints directly with machine rotational pivot point',
      'Hold handles tightly to anchor hips firmly into seat',
      'Pause at full knee extension for 1 second squeeze'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Leg Extension',
      url: 'https://musclewiki.com/machine/quads/lever-leg-extension',
      source: 'MuscleWiki'
    },
    instructions: [
      'Sit on machine with shin pad resting just above ankles.',
      'Extend legs forward until knees are fully straightened.',
      'Lower slowly resisting the weight stack down.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 80,
      repsUnit: 'reps'
    }
  },
  {
    id: 'walking-dumbbell-lunges',
    name: 'Walking Dumbbell Lunges',
    split: 'Lower Body',
    subCategory: 'Quads',
    category: 'Legs',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Barbell', 'Kettlebell', 'Bodyweight'],
    primaryMuscle: 'Quadriceps & Gluteus Maximus',
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    animationType: 'squat',
    cues: [
      'Take comfortable stride and drop back knee gently toward floor',
      'Keep front shin roughly vertical and torso upright',
      'Drive up through front heel to step into next lunge'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Walking Lunges',
      url: 'https://wger.de/en/exercise/221/view/lunges',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Stand holding dumbbells at sides.',
      'Step forward with one leg, sinking hips until both knees reach 90 degrees.',
      'Push off forward leg to bring feet together, then alternate legs.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 35,
      repsUnit: 'per leg'
    }
  },
  {
    id: 'dumbbell-step-ups',
    name: 'Dumbbell Step-Ups (Plyo Box / Bench)',
    split: 'Lower Body',
    subCategory: 'Quads',
    category: 'Legs',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Barbell', 'Bodyweight'],
    primaryMuscle: 'Quadriceps & Gluteus Maximus',
    secondaryMuscles: ['Calves', 'Core Stabilizers'],
    animationType: 'squat',
    cues: [
      'Plant whole foot onto box without letting heel hang off',
      'Drive through front leg without bouncing off trailing foot',
      'Control descent to avoid knee crashing on the step down'
    ],
    openSourceLink: {
      label: 'ExRx - Dumbbell Step-up',
      url: 'https://exrx.net/WeightExercises/Quadriceps/DBStepUp',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Stand in front of knee-height box holding dumbbells.',
      'Place one foot on box and drive straight upward to stand tall on box.',
      'Step down carefully under control with trailing leg.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 30,
      repsUnit: 'per leg'
    }
  },

  // -------------------------------------------------------------
  // EXPANDED EXERCISE LIBRARY (HAMSTRINGS & GLUTES)
  // -------------------------------------------------------------
  {
    id: 'barbell-deadlift',
    name: 'Conventional Barbell Deadlift',
    split: 'Lower Body',
    subCategory: 'Hamstrings & Glutes',
    category: 'Legs',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Trap Bar'],
    primaryMuscle: 'Posterior Chain (Glutes & Hamstrings)',
    secondaryMuscles: ['Erector Spinae', 'Latissimus Dorsi', 'Quadriceps', 'Traps'],
    animationType: 'deadlift',
    cues: [
      'Set bar over mid-foot balance point with shins touching bar',
      'Pull slack out of bar until you hear the click',
      'Push floor away with legs while keeping chest proud and spine rigid'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Barbell Deadlift',
      url: 'https://musclewiki.com/barbell/hamstrings/barbell-deadlift',
      source: 'MuscleWiki'
    },
    instructions: [
      'Stand with feet hip-width apart, barbell over mid-foot.',
      'Hinge hips back and grasp bar outside knees.',
      'Brace core and drive floor away to stand fully erect, locking out hips.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 5,
      minReps: 3,
      maxReps: 6,
      defaultWeight: 225,
      repsUnit: 'reps'
    }
  },
  {
    id: 'sumo-deadlift',
    name: 'Sumo Deadlift',
    split: 'Lower Body',
    subCategory: 'Hamstrings & Glutes',
    category: 'Legs',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell'],
    primaryMuscle: 'Gluteus Maximus & Adductors',
    secondaryMuscles: ['Quadriceps', 'Hamstrings', 'Erector Spinae'],
    animationType: 'deadlift',
    cues: [
      'Take wide stance with toes pointed out 45 degrees',
      'Grip bar inside knees with arms straight down',
      'Spread the floor with feet to open hips and drive upright'
    ],
    openSourceLink: {
      label: 'ExRx - Sumo Deadlift',
      url: 'https://exrx.net/WeightExercises/GluteusMaximus/BBSumoDeadlift',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Assume wide stance with shins vertical against bar.',
      'Grip bar inside legs with shoulders directly over barbell.',
      'Drive hips forward into the bar while spreading the floor.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 5,
      minReps: 3,
      maxReps: 6,
      defaultWeight: 225,
      repsUnit: 'reps'
    }
  },
  {
    id: 'dumbbell-romanian-deadlift',
    name: 'Dumbbell Romanian Deadlift (DB RDL)',
    split: 'Lower Body',
    subCategory: 'Hamstrings & Glutes',
    category: 'Legs',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Kettlebell'],
    primaryMuscle: 'Hamstrings & Gluteus Maximus',
    secondaryMuscles: ['Erector Spinae', 'Forearms'],
    animationType: 'deadlift',
    cues: [
      'Hold dumbbells against front of thighs with neutral spine',
      'Push hips back toward wall as if closing a car door with glutes',
      'Lower weights just past knees until deep hamstring stretch is felt'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Dumbbell Romanian Deadlift',
      url: 'https://musclewiki.com/dumbbells/hamstrings/romanian-deadlift',
      source: 'MuscleWiki'
    },
    instructions: [
      'Stand holding dumbbells against thighs with feet hip-width.',
      'Hinge hips straight backward keeping shins almost vertical.',
      'Drive hips forward to return to standing lockout.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 50,
      repsUnit: 'reps'
    }
  },
  {
    id: 'barbell-hip-thrust',
    name: 'Barbell Hip Thrust (Bench Supported)',
    split: 'Lower Body',
    subCategory: 'Hamstrings & Glutes',
    category: 'Legs',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Dumbbell', 'Machine'],
    primaryMuscle: 'Gluteus Maximus',
    secondaryMuscles: ['Hamstrings', 'Adductors'],
    animationType: 'deadlift',
    cues: [
      'Place upper back across flat bench with bar pad across hip crease',
      'Shins should be vertical at full lockout',
      'Tuck chin to chest and achieve full posterior pelvic tilt at top'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Barbell Hip Thrust',
      url: 'https://wger.de/en/exercise/259/view/barbell-hip-thrust',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Sit on floor with upper back against bench and loaded barbell over hips.',
      'Drive through heels to extend hips toward ceiling until thighs align with torso.',
      'Squeeze glutes hard at top, then lower with control.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 135,
      repsUnit: 'reps'
    }
  },
  {
    id: 'good-mornings',
    name: 'Barbell Good Morning',
    split: 'Lower Body',
    subCategory: 'Hamstrings & Glutes',
    category: 'Legs',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Resistance Band'],
    primaryMuscle: 'Hamstrings & Erector Spinae',
    secondaryMuscles: ['Gluteus Maximus'],
    animationType: 'deadlift',
    cues: [
      'Barbell rests across upper traps with tight upper back shelf',
      'Push hips back with soft knee bend until torso approaches 45–60 degrees',
      'Contract hamstrings and glutes to pull torso back to standing'
    ],
    openSourceLink: {
      label: 'ExRx - Barbell Good Morning',
      url: 'https://exrx.net/WeightExercises/Hamstrings/BBGoodMorning',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Unrack barbell across upper traps as in a back squat.',
      'Hinge hips straight backward with soft knees and straight spine.',
      'Squeeze glutes and hamstrings to return to starting upright position.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 8,
      minReps: 6,
      maxReps: 10,
      defaultWeight: 75,
      repsUnit: 'reps'
    }
  },
  {
    id: 'cable-pull-through',
    name: 'Cable Pull-Through',
    split: 'Lower Body',
    subCategory: 'Hamstrings & Glutes',
    category: 'Legs',
    defaultEquipment: 'Cable',
    supportedEquipment: ['Cable', 'Resistance Band'],
    primaryMuscle: 'Gluteus Maximus & Upper Hamstrings',
    secondaryMuscles: ['Erector Spinae'],
    animationType: 'deadlift',
    cues: [
      'Face away from low pulley with rope attachment between legs',
      'Hinge hips back letting cable pull hands between thighs',
      'Thrust hips forward and squeeze glutes hard at top lockout'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Cable Pull Through',
      url: 'https://musclewiki.com/cables/glutes/cable-pull-through',
      source: 'MuscleWiki'
    },
    instructions: [
      'Attach rope to low pulley and straddle cable facing away.',
      'Hinge hips back into deep stretch.',
      'Drive hips forward to stand tall, locking out glutes.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 50,
      repsUnit: 'reps'
    }
  },
  {
    id: 'cable-glute-kickback',
    name: 'Cable Glute Kickback',
    split: 'Lower Body',
    subCategory: 'Hamstrings & Glutes',
    category: 'Legs',
    defaultEquipment: 'Cable',
    supportedEquipment: ['Cable', 'Resistance Band', 'Machine'],
    primaryMuscle: 'Gluteus Maximus (Upper Fibers)',
    secondaryMuscles: ['Hamstrings'],
    animationType: 'deadlift',
    cues: [
      'Strap ankle cuff to low pulley with hands on machine frame for support',
      'Kick leg backward and slightly outward in 30-degree diagonal arc',
      'Avoid arching lower back to fake range of motion'
    ],
    openSourceLink: {
      label: 'ExRx - Cable Glute Kickback',
      url: 'https://exrx.net/WeightExercises/GluteusMaximus/CBGluteKickback',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Attach ankle cuff to low pulley facing machine.',
      'Hinge forward slightly and kick leg backward through heel.',
      'Squeeze glute at top and return under control.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 20,
      repsUnit: 'per leg'
    }
  },

  // -------------------------------------------------------------
  // EXPANDED EXERCISE LIBRARY (CALVES)
  // -------------------------------------------------------------
  {
    id: 'leg-press-calf-raise',
    name: 'Leg Press Toe Press (Calf Extension)',
    split: 'Lower Body',
    subCategory: 'Calves',
    category: 'Legs',
    defaultEquipment: 'Machine',
    supportedEquipment: ['Machine'],
    primaryMuscle: 'Gastrocnemius & Soleus',
    secondaryMuscles: ['Tibialis Posterior'],
    animationType: 'squat',
    cues: [
      'Place balls of feet on bottom edge of sled with heels free',
      'Press sled out to full ankle plantarflexion (point toes forward)',
      'Allow deep 2-second stretch at bottom with knees soft (never hyperextended)'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Leg Press Calf Extension',
      url: 'https://musclewiki.com/machine/calves/lever-calf-press',
      source: 'MuscleWiki'
    },
    instructions: [
      'Position feet on lower edge of leg press platform with heels hanging off.',
      'Push platform away by extending ankles.',
      'Lower under complete control into deep calf stretch.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 180,
      repsUnit: 'reps'
    }
  },
  {
    id: 'single-leg-dumbbell-calf-raise',
    name: 'Single-Leg Dumbbell Calf Raise',
    split: 'Lower Body',
    subCategory: 'Calves',
    category: 'Legs',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Bodyweight'],
    primaryMuscle: 'Gastrocnemius & Soleus',
    secondaryMuscles: ['Plantar Flexors'],
    animationType: 'squat',
    cues: [
      'Stand on ball of foot on edge of weight plate or step',
      'Hold dumbbell in hand on working side, free hand on wall for balance',
      'Elevate heel as high as possible, holding peak contraction for 1 count'
    ],
    openSourceLink: {
      label: 'ExRx - Single Leg Calf Raise',
      url: 'https://exrx.net/WeightExercises/Gastrocnemius/DBSingleLegCalfRaise',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Stand on ledge with ball of one foot holding dumbbell.',
      'Lower heel down into full stretch.',
      'Push up onto toes as high as possible and squeeze calf.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 25,
      repsUnit: 'per leg'
    }
  },

  // -------------------------------------------------------------
  // EXPANDED EXERCISE LIBRARY (CORE / ABS)
  // -------------------------------------------------------------
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Straight Leg Raise (Toes-to-Bar)',
    split: 'Core & Conditioning',
    subCategory: 'Core / Abs',
    category: 'Core',
    defaultEquipment: 'Bodyweight',
    supportedEquipment: ['Bodyweight'],
    primaryMuscle: 'Rectus Abdominis (Lower Fibers)',
    secondaryMuscles: ['Iliopsoas (Hip Flexors)', 'Forearm Grip'],
    animationType: 'core',
    cues: [
      'Initiate movement by tilting pelvis upward, not swinging from shoulders',
      'Raise legs straight until toes approach or touch the bar',
      'Slow 3-second lowering eccentric phase without swinging momentum'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Hanging Leg Raise',
      url: 'https://musclewiki.com/bodyweight/abdominals/hanging-leg-raise',
      source: 'MuscleWiki'
    },
    instructions: [
      'Hang from pull-up bar with overhand grip.',
      'Brace core and raise straight legs upward until parallel or toes touch bar.',
      'Lower slowly back to starting hang without kipping.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 8,
      minReps: 6,
      maxReps: 12,
      defaultWeight: 0,
      repsUnit: 'reps'
    }
  },
  {
    id: 'ab-wheel-rollout',
    name: 'Ab Wheel Rollout (From Knees / Feet)',
    split: 'Core & Conditioning',
    subCategory: 'Core / Abs',
    category: 'Core',
    defaultEquipment: 'Bodyweight',
    supportedEquipment: ['Bodyweight', 'Barbell'],
    primaryMuscle: 'Rectus Abdominis & Transverse Abdominis',
    secondaryMuscles: ['Lats', 'Shoulders', 'Lower Back'],
    animationType: 'core',
    cues: [
      'Start on knees holding wheel directly beneath shoulders',
      'Maintain posterior pelvic tilt (hollow body) throughout rollout',
      'Pull back by contracting abs, not pulling with hips or arms'
    ],
    openSourceLink: {
      label: 'ExRx - Rollout',
      url: 'https://exrx.net/WeightExercises/RectusAbdominis/BWWheelRollout',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Kneel on mat gripping ab wheel handles.',
      'Roll wheel forward extending body as far as possible while maintaining flat back.',
      'Contract abs hard to pull wheel back to starting position.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 6,
      maxReps: 12,
      defaultWeight: 0,
      repsUnit: 'reps'
    }
  },
  {
    id: 'cable-pallof-press',
    name: 'Cable Pallof Press (Anti-Rotation)',
    split: 'Core & Conditioning',
    subCategory: 'Core / Abs',
    category: 'Core',
    defaultEquipment: 'Cable',
    supportedEquipment: ['Cable', 'Resistance Band'],
    primaryMuscle: 'Internal & External Obliques',
    secondaryMuscles: ['Transverse Abdominis', 'Glutes'],
    animationType: 'core',
    cues: [
      'Stand perpendicular to cable at chest height holding D-handle with both hands',
      'Press handle straight out in front of chest resisting any torso twisting',
      'Hold extended position for 2 seconds before returning to sternum'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Cable Pallof Press',
      url: 'https://musclewiki.com/cables/abdominals/cable-pallof-press',
      source: 'MuscleWiki'
    },
    instructions: [
      'Set cable at sternum level and stand sideways with feet shoulder-width.',
      'Hold handle at center of chest.',
      'Press arms straight forward resisting rotation, hold for 2s, and return.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 25,
      repsUnit: 'per side'
    }
  },
  {
    id: 'decline-weighted-crunch',
    name: 'Decline Bench Weighted Crunch',
    split: 'Core & Conditioning',
    subCategory: 'Core / Abs',
    category: 'Core',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Barbell', 'Bodyweight'],
    primaryMuscle: 'Rectus Abdominis (Upper Fibers)',
    secondaryMuscles: ['Hip Flexors'],
    animationType: 'core',
    cues: [
      'Anchor ankles securely at top of decline bench',
      'Hold weight plate across chest or behind head',
      'Curl ribcage toward pelvis, exhaling fully at top peak contraction'
    ],
    openSourceLink: {
      label: 'Open Workout DB - Weighted Crunch',
      url: 'https://wger.de/en/exercise/256/view/decline-crunch',
      source: 'Wger (Open Source)'
    },
    instructions: [
      'Sit on decline bench holding plate to chest.',
      'Lower torso back until shoulders almost touch bench.',
      'Flex abs to curl torso upward, pausing at top squeeze.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 12,
      minReps: 10,
      maxReps: 15,
      defaultWeight: 25,
      repsUnit: 'reps'
    }
  },

  // -------------------------------------------------------------
  // EXPANDED EXERCISE LIBRARY (CONDITIONING & KETTLEBELLS)
  // -------------------------------------------------------------
  {
    id: 'kettlebell-swing',
    name: 'Hardstyle Kettlebell Swing (Russian)',
    split: 'Full Circuit',
    subCategory: 'Conditioning & Kettlebells',
    category: 'Full Body',
    defaultEquipment: 'Kettlebell',
    supportedEquipment: ['Kettlebell', 'Dumbbell'],
    primaryMuscle: 'Posterior Chain (Glutes & Hamstrings)',
    secondaryMuscles: ['Core', 'Forearms', 'Upper Back'],
    animationType: 'swing',
    cues: [
      'Hike kettlebell high between thighs like a football snap',
      'Snap hips forward violently with knees soft, locking glutes at top',
      'Bell floats to chest height via hip snap, not shoulder lifting'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Kettlebell Swing',
      url: 'https://musclewiki.com/kettlebells/glutes/kettlebell-swing',
      source: 'MuscleWiki'
    },
    instructions: [
      'Stand feet shoulder-width behind kettlebell.',
      'Hike bell back between legs, then snap hips forward into standing plank.',
      'Let bell swing back between thighs and repeat in rhythmic cadence.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 15,
      minReps: 12,
      maxReps: 20,
      defaultWeight: 45,
      repsUnit: 'reps'
    }
  },
  {
    id: 'kettlebell-clean-and-press',
    name: 'Kettlebell Clean and Press',
    split: 'Full Circuit',
    subCategory: 'Conditioning & Kettlebells',
    category: 'Full Body',
    defaultEquipment: 'Kettlebell',
    supportedEquipment: ['Kettlebell', 'Dumbbell'],
    primaryMuscle: 'Deltoids, Upper Back & Glutes',
    secondaryMuscles: ['Triceps', 'Core'],
    animationType: 'swing',
    cues: [
      'Clean kettlebell into rack position against chest without banging forearm',
      'Pause in rack, brace core, and press vertically to lockout',
      'Lower smoothly back to rack, then drop into swing'
    ],
    openSourceLink: {
      label: 'ExRx - Kettlebell Clean and Press',
      url: 'https://exrx.net/WeightExercises/Kettlebell/KBCleanPress',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Clean kettlebell from floor into chest rack position.',
      'Press kettlebell overhead to full arm lockout.',
      'Lower back to rack, drop to floor, and switch arms or repeat.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 8,
      minReps: 6,
      maxReps: 10,
      defaultWeight: 35,
      repsUnit: 'per arm'
    }
  },
  {
    id: 'kettlebell-turkish-get-up',
    name: 'Kettlebell Turkish Get-Up',
    split: 'Full Circuit',
    subCategory: 'Conditioning & Kettlebells',
    category: 'Full Body',
    defaultEquipment: 'Kettlebell',
    supportedEquipment: ['Kettlebell', 'Dumbbell'],
    primaryMuscle: 'Rotator Cuff & Shoulder Stabilizers',
    secondaryMuscles: ['Core', 'Glutes', 'Hips'],
    animationType: 'swing',
    cues: [
      'Keep eyes locked on the kettlebell throughout entire ascent and descent',
      'Maintain vertical arm punch at all times',
      'Roll to elbow, press to palm, bridge hips, sweep leg, stand tall'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Turkish Get Up',
      url: 'https://musclewiki.com/kettlebells/shoulders/turkish-get-up',
      source: 'MuscleWiki'
    },
    instructions: [
      'Lie on back holding kettlebell locked out above shoulder.',
      'Roll onto supporting elbow, then press up to palm.',
      'Bridge hips high, sweep opposite knee back underneath body, and stand up tall.',
      'Reverse all steps smoothly back to floor.'
    ],
    defaultTarget: {
      targetSets: 2,
      targetReps: 3,
      minReps: 2,
      maxReps: 5,
      defaultWeight: 25,
      repsUnit: 'per side'
    }
  },
  {
    id: 'farmers-walk',
    name: 'Heavy Dumbbell Farmer\'s Walk',
    split: 'Full Circuit',
    subCategory: 'Conditioning & Kettlebells',
    category: 'Full Body',
    defaultEquipment: 'Dumbbell',
    supportedEquipment: ['Dumbbell', 'Kettlebell', 'Trap Bar'],
    primaryMuscle: 'Forearms & Grip Strength',
    secondaryMuscles: ['Trapezius', 'Core Stabilizers', 'Glutes'],
    animationType: 'deadlift',
    cues: [
      'Pick up heavy dumbbells with flat back and deadlift form',
      'Stand tall with shoulders retracted and chest proud',
      'Walk with short, deliberate, rhythmic steps avoiding side-to-side wobble'
    ],
    openSourceLink: {
      label: 'ExRx - Farmer\'s Walk',
      url: 'https://exrx.net/WeightExercises/Other/DBFarmersWalk',
      source: 'ExRx Biomechanics'
    },
    instructions: [
      'Deadlift heavy dumbbells or kettlebells off the floor.',
      'Walk forward with upright posture for target distance or duration.',
      'Lower weights under control with neutral spine.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 40,
      minReps: 30,
      maxReps: 60,
      defaultWeight: 60,
      repsUnit: 'seconds'
    }
  },
  {
    id: 'barbell-thruster',
    name: 'Barbell Thruster (Conditioning)',
    split: 'Full Circuit',
    subCategory: 'Conditioning & Kettlebells',
    category: 'Full Body',
    defaultEquipment: 'Barbell',
    supportedEquipment: ['Barbell', 'Dumbbell', 'Kettlebell'],
    primaryMuscle: 'Quadriceps, Deltoids & Glutes',
    secondaryMuscles: ['Triceps', 'Core'],
    animationType: 'squat',
    cues: [
      'Front squat with elbows high until hip crease breaks parallel',
      'Drive up explosively using hip extension momentum to propel bar upward',
      'Catch lockout overhead in single continuous fluid motion'
    ],
    openSourceLink: {
      label: 'MuscleWiki - Barbell Thruster',
      url: 'https://musclewiki.com/barbell/full-body/barbell-thruster',
      source: 'MuscleWiki'
    },
    instructions: [
      'Hold barbell in front rack position across shoulders.',
      'Drop into deep front squat.',
      'Explode upward, transferring leg drive directly into an overhead press.'
    ],
    defaultTarget: {
      targetSets: 3,
      targetReps: 10,
      minReps: 8,
      maxReps: 12,
      defaultWeight: 75,
      repsUnit: 'reps'
    }
  }
];

// Preset split routine templates for 1-click loading
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

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
  level: ExperienceLevel;
  daysPerWeek?: string;
  durationMin?: number;
  description: string;
  exerciseIds: string[];
  exerciseConfigs?: RoutineExerciseConfig[];
  isCustom?: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  split: SplitCategory;
  level: ExperienceLevel;
  daysPerWeek?: string;
  durationMin?: number;
  description: string;
  exerciseIds: string[];
  exerciseConfigs?: RoutineExerciseConfig[];
}

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  // ==========================================
  // BEGINNER ROUTINES (3 Days/Week • Motor Learning & Safe Loading)
  // ==========================================
  {
    id: 'beginner-full-body-a',
    name: 'Beginner Full Body A (Foundations)',
    split: 'Full Circuit',
    level: 'Beginner',
    daysPerWeek: '3 days / week',
    durationMin: 45,
    description: 'Core multi-joint foundations: goblet squats, horizontal bench pressing, lat pulldowns, dumbbell hinges, and core brace.',
    exerciseIds: [
      'goblet-front-squat',
      'bench-press',
      'lat-pulldown',
      'dumbbell-romanian-deadlift',
      'side-plank'
    ],
    exerciseConfigs: [
      { exerciseId: 'goblet-front-squat', targetSets: 3, targetReps: 10, targetWeight: 35, equipment: 'Dumbbell' },
      { exerciseId: 'bench-press', targetSets: 3, targetReps: 8, targetWeight: 95, equipment: 'Barbell' },
      { exerciseId: 'lat-pulldown', targetSets: 3, targetReps: 10, targetWeight: 85, equipment: 'Cable' },
      { exerciseId: 'dumbbell-romanian-deadlift', targetSets: 3, targetReps: 10, targetWeight: 30, equipment: 'Dumbbell' },
      { exerciseId: 'side-plank', targetSets: 3, targetReps: 45, targetWeight: 0, equipment: 'Bodyweight' }
    ]
  },
  {
    id: 'beginner-full-body-b',
    name: 'Beginner Full Body B (Machine & DB Stability)',
    split: 'Full Circuit',
    level: 'Beginner',
    daysPerWeek: '3 days / week',
    durationMin: 45,
    description: 'Guided knee flexion, overhead shoulder press mechanics, chest-supported rows, and functional carry.',
    exerciseIds: [
      'squat-or-leg-press',
      'dumbbell-shoulder-press',
      'chest-supported-row',
      'leg-curl',
      'farmers-walk'
    ],
    exerciseConfigs: [
      { exerciseId: 'squat-or-leg-press', targetSets: 3, targetReps: 10, targetWeight: 140, equipment: 'Machine' },
      { exerciseId: 'dumbbell-shoulder-press', targetSets: 3, targetReps: 10, targetWeight: 25, equipment: 'Dumbbell' },
      { exerciseId: 'chest-supported-row', targetSets: 3, targetReps: 10, targetWeight: 70, equipment: 'Dumbbell' },
      { exerciseId: 'leg-curl', targetSets: 3, targetReps: 12, targetWeight: 65, equipment: 'Machine' },
      { exerciseId: 'farmers-walk', targetSets: 3, targetReps: 40, targetWeight: 35, equipment: 'Dumbbell' }
    ]
  },
  {
    id: 'beginner-upper-primer',
    name: 'Beginner Upper Body Primer',
    split: 'Upper Body',
    level: 'Beginner',
    daysPerWeek: '2-3 days / week',
    durationMin: 40,
    description: 'Balanced push-pull mechanics for upper body hypertrophy with minimal joint stress.',
    exerciseIds: [
      'push-ups-or-cable-chest-fly',
      'seated-cable-row',
      'dumbbell-lateral-raise',
      'hammer-curl',
      'triceps-rope-pushdown'
    ],
    exerciseConfigs: [
      { exerciseId: 'push-ups-or-cable-chest-fly', targetSets: 3, targetReps: 12, targetWeight: 40, equipment: 'Cable' },
      { exerciseId: 'seated-cable-row', targetSets: 3, targetReps: 10, targetWeight: 80, equipment: 'Cable' },
      { exerciseId: 'dumbbell-lateral-raise', targetSets: 3, targetReps: 12, targetWeight: 15, equipment: 'Dumbbell' },
      { exerciseId: 'hammer-curl', targetSets: 3, targetReps: 12, targetWeight: 20, equipment: 'Dumbbell' },
      { exerciseId: 'triceps-rope-pushdown', targetSets: 3, targetReps: 12, targetWeight: 40, equipment: 'Cable' }
    ]
  },

  // ==========================================
  // INTERMEDIATE ROUTINES (4-5 Days/Week • Progressive Overload & Hypertrophy)
  // ==========================================
  {
    id: 'intermediate-upper-power',
    name: 'Intermediate Upper Power & Hypertrophy',
    split: 'Upper Body',
    level: 'Intermediate',
    daysPerWeek: '4 days / week',
    durationMin: 55,
    description: 'Heavy barbell bench & bent-over rows paired with incline pressing, close-grip lat pulldowns, lateral raises, and skull crushers.',
    exerciseIds: [
      'bench-press',
      'barbell-bent-over-row',
      'incline-dumbbell-press',
      'close-grip-lat-pulldown',
      'cable-lateral-raise',
      'skull-crushers'
    ],
    exerciseConfigs: [
      { exerciseId: 'bench-press', targetSets: 4, targetReps: 6, targetWeight: 165, equipment: 'Barbell' },
      { exerciseId: 'barbell-bent-over-row', targetSets: 4, targetReps: 8, targetWeight: 135, equipment: 'Barbell' },
      { exerciseId: 'incline-dumbbell-press', targetSets: 3, targetReps: 10, targetWeight: 55, equipment: 'Dumbbell' },
      { exerciseId: 'close-grip-lat-pulldown', targetSets: 3, targetReps: 10, targetWeight: 120, equipment: 'Cable' },
      { exerciseId: 'cable-lateral-raise', targetSets: 4, targetReps: 12, targetWeight: 20, equipment: 'Cable' },
      { exerciseId: 'skull-crushers', targetSets: 3, targetReps: 10, targetWeight: 65, equipment: 'Barbell' }
    ]
  },
  {
    id: 'intermediate-lower-hypertrophy',
    name: 'Intermediate Lower Quad & Posterior Chain',
    split: 'Lower Body',
    level: 'Intermediate',
    daysPerWeek: '4 days / week',
    durationMin: 55,
    description: 'Back squat strength progression followed by Romanian deadlifts, Bulgarian split squats, knee extensions, and calves.',
    exerciseIds: [
      'barbell-back-squat',
      'romanian-deadlift',
      'bulgarian-split-squat',
      'leg-extension',
      'seated-calf-raise',
      'hanging-knee-raise'
    ],
    exerciseConfigs: [
      { exerciseId: 'barbell-back-squat', targetSets: 4, targetReps: 6, targetWeight: 205, equipment: 'Barbell' },
      { exerciseId: 'romanian-deadlift', targetSets: 3, targetReps: 8, targetWeight: 185, equipment: 'Barbell' },
      { exerciseId: 'bulgarian-split-squat', targetSets: 3, targetReps: 10, targetWeight: 40, equipment: 'Dumbbell' },
      { exerciseId: 'leg-extension', targetSets: 3, targetReps: 12, targetWeight: 110, equipment: 'Machine' },
      { exerciseId: 'seated-calf-raise', targetSets: 4, targetReps: 12, targetWeight: 90, equipment: 'Machine' },
      { exerciseId: 'hanging-knee-raise', targetSets: 3, targetReps: 12, targetWeight: 0, equipment: 'Bodyweight' }
    ]
  },
  {
    id: 'intermediate-push-pull-hybrid',
    name: 'Intermediate Push / Pull Hybrid',
    split: 'Upper Body',
    level: 'Intermediate',
    daysPerWeek: '4-5 days / week',
    durationMin: 50,
    description: 'Overhead barbell press, weighted dips, T-bar rowing, vertical pulls, face pulls, and EZ-bar curls.',
    exerciseIds: [
      'barbell-overhead-press',
      'pull-up-or-lat-pulldown',
      'weighted-chest-dips',
      't-bar-row',
      'face-pull-rear-delt-fly',
      'ez-bar-biceps-curl'
    ],
    exerciseConfigs: [
      { exerciseId: 'barbell-overhead-press', targetSets: 4, targetReps: 6, targetWeight: 105, equipment: 'Barbell' },
      { exerciseId: 'pull-up-or-lat-pulldown', targetSets: 4, targetReps: 8, targetWeight: 130, equipment: 'Cable' },
      { exerciseId: 'weighted-chest-dips', targetSets: 3, targetReps: 10, targetWeight: 25, equipment: 'Bodyweight' },
      { exerciseId: 't-bar-row', targetSets: 3, targetReps: 10, targetWeight: 90, equipment: 'Barbell' },
      { exerciseId: 'face-pull-rear-delt-fly', targetSets: 3, targetReps: 15, targetWeight: 45, equipment: 'Cable' },
      { exerciseId: 'ez-bar-biceps-curl', targetSets: 3, targetReps: 10, targetWeight: 60, equipment: 'Barbell' }
    ]
  },
  {
    id: 'upper-day-a',
    name: 'Upper Day A (Classic Hypertrophy)',
    split: 'Upper Body',
    level: 'Intermediate',
    daysPerWeek: '4 days / week',
    durationMin: 55,
    description: 'Bench press, Chest-supported row, Incline DB press, Lat pulldown, Lateral raise, Triceps pushdown',
    exerciseIds: [
      'bench-press',
      'chest-supported-row',
      'incline-dumbbell-press',
      'lat-pulldown',
      'dumbbell-lateral-raise',
      'triceps-rope-pushdown'
    ],
    exerciseConfigs: [
      { exerciseId: 'bench-press', targetSets: 3, targetReps: 10, targetWeight: 155, equipment: 'Barbell' },
      { exerciseId: 'chest-supported-row', targetSets: 3, targetReps: 10, targetWeight: 75, equipment: 'Dumbbell' },
      { exerciseId: 'incline-dumbbell-press', targetSets: 3, targetReps: 10, targetWeight: 50, equipment: 'Dumbbell' },
      { exerciseId: 'lat-pulldown', targetSets: 3, targetReps: 10, targetWeight: 110, equipment: 'Cable' },
      { exerciseId: 'dumbbell-lateral-raise', targetSets: 3, targetReps: 12, targetWeight: 20, equipment: 'Dumbbell' },
      { exerciseId: 'triceps-rope-pushdown', targetSets: 3, targetReps: 12, targetWeight: 45, equipment: 'Cable' }
    ]
  },
  {
    id: 'lower-day-a',
    name: 'Lower Day A (Squat & Hamstring Focus)',
    split: 'Lower Body',
    level: 'Intermediate',
    daysPerWeek: '4 days / week',
    durationMin: 55,
    description: 'Squat/Leg press, Romanian deadlift, Bulgarian split squat, Leg curl, Standing calf raise, Cable crunch',
    exerciseIds: [
      'squat-or-leg-press',
      'romanian-deadlift',
      'bulgarian-split-squat',
      'leg-curl',
      'standing-calf-raise',
      'cable-crunch'
    ],
    exerciseConfigs: [
      { exerciseId: 'squat-or-leg-press', targetSets: 4, targetReps: 8, targetWeight: 185, equipment: 'Barbell' },
      { exerciseId: 'romanian-deadlift', targetSets: 3, targetReps: 8, targetWeight: 175, equipment: 'Barbell' },
      { exerciseId: 'bulgarian-split-squat', targetSets: 3, targetReps: 10, targetWeight: 35, equipment: 'Dumbbell' },
      { exerciseId: 'leg-curl', targetSets: 3, targetReps: 12, targetWeight: 80, equipment: 'Machine' },
      { exerciseId: 'standing-calf-raise', targetSets: 4, targetReps: 15, targetWeight: 135, equipment: 'Barbell' },
      { exerciseId: 'cable-crunch', targetSets: 3, targetReps: 15, targetWeight: 60, equipment: 'Cable' }
    ]
  },
  {
    id: 'upper-day-b',
    name: 'Upper Day B (Vertical Pull & Overhead Focus)',
    split: 'Upper Body',
    level: 'Intermediate',
    daysPerWeek: '4 days / week',
    durationMin: 55,
    description: 'Pull-up/Lat pulldown, DB shoulder press, Seated cable row, Push-ups/Fly, Face pull, Hammer curl, Overhead triceps',
    exerciseIds: [
      'pull-up-or-lat-pulldown',
      'dumbbell-shoulder-press',
      'seated-cable-row',
      'push-ups-or-cable-chest-fly',
      'face-pull-rear-delt-fly',
      'hammer-curl',
      'overhead-triceps-extension'
    ],
    exerciseConfigs: [
      { exerciseId: 'pull-up-or-lat-pulldown', targetSets: 3, targetReps: 8, targetWeight: 120, equipment: 'Cable' },
      { exerciseId: 'dumbbell-shoulder-press', targetSets: 3, targetReps: 10, targetWeight: 45, equipment: 'Dumbbell' },
      { exerciseId: 'seated-cable-row', targetSets: 3, targetReps: 10, targetWeight: 95, equipment: 'Cable' },
      { exerciseId: 'push-ups-or-cable-chest-fly', targetSets: 3, targetReps: 12, targetWeight: 45, equipment: 'Cable' },
      { exerciseId: 'face-pull-rear-delt-fly', targetSets: 3, targetReps: 15, targetWeight: 40, equipment: 'Cable' },
      { exerciseId: 'hammer-curl', targetSets: 3, targetReps: 12, targetWeight: 25, equipment: 'Dumbbell' },
      { exerciseId: 'overhead-triceps-extension', targetSets: 3, targetReps: 12, targetWeight: 40, equipment: 'Dumbbell' }
    ]
  },
  {
    id: 'lower-day-b',
    name: 'Lower Day B (Posterior Chain & Unilateral Focus)',
    split: 'Lower Body',
    level: 'Intermediate',
    daysPerWeek: '4 days / week',
    durationMin: 55,
    description: 'Hip thrust/Trap-bar, Goblet/Front squat, Reverse lunge, Seated leg curl, Seated calf raise, Hanging knee raise, Side plank',
    exerciseIds: [
      'hip-thrust-or-trap-bar-deadlift',
      'goblet-front-squat',
      'reverse-lunge',
      'seated-leg-curl',
      'seated-calf-raise',
      'hanging-knee-raise',
      'side-plank'
    ],
    exerciseConfigs: [
      { exerciseId: 'hip-thrust-or-trap-bar-deadlift', targetSets: 4, targetReps: 8, targetWeight: 185, equipment: 'Barbell' },
      { exerciseId: 'goblet-front-squat', targetSets: 3, targetReps: 10, targetWeight: 50, equipment: 'Dumbbell' },
      { exerciseId: 'reverse-lunge', targetSets: 3, targetReps: 10, targetWeight: 35, equipment: 'Dumbbell' },
      { exerciseId: 'seated-leg-curl', targetSets: 3, targetReps: 12, targetWeight: 75, equipment: 'Machine' },
      { exerciseId: 'seated-calf-raise', targetSets: 4, targetReps: 12, targetWeight: 80, equipment: 'Machine' },
      { exerciseId: 'hanging-knee-raise', targetSets: 3, targetReps: 12, targetWeight: 0, equipment: 'Bodyweight' },
      { exerciseId: 'side-plank', targetSets: 3, targetReps: 45, targetWeight: 0, equipment: 'Bodyweight' }
    ]
  },

  // ==========================================
  // ADVANCED ROUTINES (5-6 Days/Week • High-Threshold Specialization & Density)
  // ==========================================
  {
    id: 'advanced-push-specialization',
    name: 'Advanced Push (Heavy Chest & Delts)',
    split: 'Upper Body',
    level: 'Advanced',
    daysPerWeek: '5-6 days / week',
    durationMin: 70,
    description: 'Heavy mechanical tension barbell benching, incline pressing, weighted chest dips, cable crossovers, and rope triceps extensions.',
    exerciseIds: [
      'bench-press',
      'incline-barbell-bench-press',
      'weighted-chest-dips',
      'cable-chest-crossover',
      'cable-lateral-raise',
      'cable-overhead-triceps-rope'
    ],
    exerciseConfigs: [
      { exerciseId: 'bench-press', targetSets: 5, targetReps: 5, targetWeight: 225, equipment: 'Barbell' },
      { exerciseId: 'incline-barbell-bench-press', targetSets: 4, targetReps: 8, targetWeight: 175, equipment: 'Barbell' },
      { exerciseId: 'weighted-chest-dips', targetSets: 4, targetReps: 8, targetWeight: 45, equipment: 'Bodyweight' },
      { exerciseId: 'cable-chest-crossover', targetSets: 3, targetReps: 12, targetWeight: 30, equipment: 'Cable' },
      { exerciseId: 'cable-lateral-raise', targetSets: 5, targetReps: 12, targetWeight: 25, equipment: 'Cable' },
      { exerciseId: 'cable-overhead-triceps-rope', targetSets: 4, targetReps: 12, targetWeight: 55, equipment: 'Cable' }
    ]
  },
  {
    id: 'advanced-pull-specialization',
    name: 'Advanced Pull (Deadlift & Lat Density)',
    split: 'Upper Body',
    level: 'Advanced',
    daysPerWeek: '5-6 days / week',
    durationMin: 70,
    description: 'Heavy conventional deadlift strength, weighted chin-ups, T-bar rowing, straight-arm lat pushdowns, reverse pec deck, and incline curls.',
    exerciseIds: [
      'barbell-deadlift',
      'chin-ups',
      't-bar-row',
      'straight-arm-lat-pushdown',
      'reverse-pec-deck-fly',
      'incline-dumbbell-biceps-curl'
    ],
    exerciseConfigs: [
      { exerciseId: 'barbell-deadlift', targetSets: 4, targetReps: 4, targetWeight: 315, equipment: 'Barbell' },
      { exerciseId: 'chin-ups', targetSets: 4, targetReps: 8, targetWeight: 25, equipment: 'Bodyweight' },
      { exerciseId: 't-bar-row', targetSets: 4, targetReps: 8, targetWeight: 135, equipment: 'Barbell' },
      { exerciseId: 'straight-arm-lat-pushdown', targetSets: 3, targetReps: 12, targetWeight: 50, equipment: 'Cable' },
      { exerciseId: 'reverse-pec-deck-fly', targetSets: 4, targetReps: 15, targetWeight: 85, equipment: 'Machine' },
      { exerciseId: 'incline-dumbbell-biceps-curl', targetSets: 4, targetReps: 10, targetWeight: 35, equipment: 'Dumbbell' }
    ]
  },
  {
    id: 'advanced-lower-overload',
    name: 'Advanced Lower (Squat & Glute Peak Tension)',
    split: 'Lower Body',
    level: 'Advanced',
    daysPerWeek: '5-6 days / week',
    durationMin: 75,
    description: 'Heavy Olympic back squats, heavy barbell hip thrusts, hack squats, Romanian deadlifts, calf extensions, and ab wheel rollouts.',
    exerciseIds: [
      'barbell-back-squat',
      'barbell-hip-thrust',
      'hack-squat',
      'romanian-deadlift',
      'leg-press-calf-raise',
      'ab-wheel-rollout'
    ],
    exerciseConfigs: [
      { exerciseId: 'barbell-back-squat', targetSets: 5, targetReps: 5, targetWeight: 275, equipment: 'Barbell' },
      { exerciseId: 'barbell-hip-thrust', targetSets: 4, targetReps: 8, targetWeight: 245, equipment: 'Barbell' },
      { exerciseId: 'hack-squat', targetSets: 4, targetReps: 10, targetWeight: 200, equipment: 'Machine' },
      { exerciseId: 'romanian-deadlift', targetSets: 4, targetReps: 8, targetWeight: 225, equipment: 'Barbell' },
      { exerciseId: 'leg-press-calf-raise', targetSets: 5, targetReps: 15, targetWeight: 220, equipment: 'Machine' },
      { exerciseId: 'ab-wheel-rollout', targetSets: 4, targetReps: 12, targetWeight: 0, equipment: 'Bodyweight' }
    ]
  },
  {
    id: 'advanced-functional-conditioning',
    name: 'Advanced Kettlebell & Athletic Conditioning',
    split: 'Full Circuit',
    level: 'Advanced',
    daysPerWeek: '4-5 days / week',
    durationMin: 55,
    description: 'Multi-planar kinetic power: thrusters, clean & press, hardstyle swings, Turkish get-ups, anti-rotation cable presses, and heavy carries.',
    exerciseIds: [
      'barbell-thruster',
      'kettlebell-clean-and-press',
      'kettlebell-swing',
      'kettlebell-turkish-get-up',
      'cable-pallof-press',
      'farmers-walk'
    ],
    exerciseConfigs: [
      { exerciseId: 'barbell-thruster', targetSets: 4, targetReps: 8, targetWeight: 115, equipment: 'Barbell' },
      { exerciseId: 'kettlebell-clean-and-press', targetSets: 4, targetReps: 6, targetWeight: 53, equipment: 'Kettlebell' },
      { exerciseId: 'kettlebell-swing', targetSets: 5, targetReps: 15, targetWeight: 70, equipment: 'Kettlebell' },
      { exerciseId: 'kettlebell-turkish-get-up', targetSets: 3, targetReps: 3, targetWeight: 44, equipment: 'Kettlebell' },
      { exerciseId: 'cable-pallof-press', targetSets: 3, targetReps: 12, targetWeight: 40, equipment: 'Cable' },
      { exerciseId: 'farmers-walk', targetSets: 4, targetReps: 45, targetWeight: 70, equipment: 'Dumbbell' }
    ]
  }
];
