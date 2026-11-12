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

export type LoadType = 
  | 'weight_reps' 
  | 'bodyweight_reps' 
  | 'bodyweight_timed' 
  | 'distance_time' 
  | 'assisted';

export type MovementPattern =
  | 'horizontal_push'
  | 'vertical_push'
  | 'horizontal_pull'
  | 'vertical_pull'
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'carry'
  | 'anti_extension'
  | 'anti_rotation'
  | 'isolation';

export interface ExerciseTarget {
  targetSets: number; // e.g. 2 or 3 sets
  targetReps: number; // e.g. 10 reps (or starting midpoint)
  minReps: number;    // e.g. 6 reps
  maxReps: number;    // e.g. 10 reps
  defaultWeight: number; // in lbs (or kg)
  repsUnit?: string;  // 'reps' | 'per leg' | 'sec/side' | 'sec' | 'meters'
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  split: SplitCategory;
  subCategory: MuscleSubCategory;
  category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body'; // legacy/compatibility
  loadType?: LoadType;
  movementPattern?: MovementPattern;
  tierSuitability?: ('Beginner' | 'Intermediate' | 'Advanced')[];
  bilateralType?: 'bilateral' | 'unilateral';
  substituteIds?: string[];
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

export const MOVEMENT_PATTERN_OPTIONS: { id: MovementPattern | 'All'; label: string }[] = [
  { id: 'All', label: 'All Patterns' },
  { id: 'horizontal_push', label: 'Horizontal Push' },
  { id: 'vertical_push', label: 'Vertical Push' },
  { id: 'horizontal_pull', label: 'Horizontal Pull' },
  { id: 'vertical_pull', label: 'Vertical Pull' },
  { id: 'squat', label: 'Squat Patterns' },
  { id: 'hinge', label: 'Hip Hinge' },
  { id: 'lunge', label: 'Lunge / Unilateral' },
  { id: 'carry', label: 'Loaded Carries' },
  { id: 'anti_extension', label: 'Core Anti-Extension' },
  { id: 'anti_rotation', label: 'Core Anti-Rotation' },
  { id: 'isolation', label: 'Direct Isolation' }
];

export const LOAD_TYPE_OPTIONS: { id: LoadType | 'All'; label: string }[] = [
  { id: 'All', label: 'All Load Types' },
  { id: 'weight_reps', label: 'Weight & Reps' },
  { id: 'bodyweight_reps', label: 'Bodyweight Reps' },
  { id: 'bodyweight_timed', label: 'Timed Holds (sec)' },
  { id: 'distance_time', label: 'Carries & Distance' }
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
  {
    "id": "bench-press",
    "name": "Bench Press",
    "split": "Upper Body",
    "subCategory": "Chest",
    "category": "Chest",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Dumbbell",
      "Machine"
    ],
    "primaryMuscle": "Pectoralis Major",
    "secondaryMuscles": [
      "Triceps Brachii",
      "Anterior Deltoid"
    ],
    "animationType": "bench",
    "cues": [
      "Retract scapulae and plant feet firmly into the floor",
      "Lower bar with 45-degree elbow tuck to touch lower sternum",
      "Drive aggressively upward without lifting glutes off the bench"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Barbell Bench Press",
      "url": "https://wger.de/en/exercise/192/view/bench-press",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Lie flat with eyes under the barbell.",
      "Unrack and settle the load directly over sternum.",
      "Control lowering to lower chest, then press explosively to full lockout."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 135,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "dumbbell-flat-bench-press",
      "incline-dumbbell-press",
      "chest-dips",
      "machine-chest-press",
      "push-ups"
    ]
  },
  {
    "id": "chest-supported-row",
    "name": "Chest-Supported Row",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine",
      "Dumbbell"
    ],
    "primaryMuscle": "Rhomboids & Mid Trapezius",
    "secondaryMuscles": [
      "Latissimus Dorsi",
      "Posterior Deltoids",
      "Biceps"
    ],
    "animationType": "row",
    "cues": [
      "Keep chest pinned to pad to eliminate lower back cheating",
      "Drive elbows past torso and squeeze shoulder blades together",
      "Pause for 1 second at full squeeze"
    ],
    "openSourceLink": {
      "label": "ExRx - Incline Chest Supported Row",
      "url": "https://exrx.net/WeightExercises/BackGeneral/DBInclineRow",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Set incline bench or machine pad to support chest.",
      "Grasp handles with neutral or overhand grip.",
      "Row handles toward ribcage, pinching scapulae tight.",
      "Lower under control to full arm stretch."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 90,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_pull",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "seated-cable-row",
      "barbell-bent-over-row",
      "single-arm-dumbbell-row",
      "t-bar-row",
      "chest-supported-t-bar-row"
    ]
  },
  {
    "id": "incline-dumbbell-press",
    "name": "Incline Dumbbell Press",
    "split": "Upper Body",
    "subCategory": "Chest",
    "category": "Chest",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell",
      "Machine"
    ],
    "primaryMuscle": "Clavicular Head (Upper Pectorals)",
    "secondaryMuscles": [
      "Anterior Deltoid",
      "Triceps"
    ],
    "animationType": "bench",
    "cues": [
      "Set bench angle to 30-45 degrees",
      "Keep wrists aligned directly above forearms",
      "Converge dumbbells smoothly at the top without clanking"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Incline Dumbbell Bench",
      "url": "https://musclewiki.com/dumbbells/chest/incline-dumbbell-bench-press",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Kick dumbbells to shoulder level while reclining.",
      "Press smoothly towards ceiling until arms lock out.",
      "Lower under 2-second control feeling deep upper chest stretch."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 50,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "incline-barbell-bench-press",
      "bench-press",
      "dumbbell-flat-bench-press",
      "machine-chest-press"
    ]
  },
  {
    "id": "lat-pulldown",
    "name": "Lat Pulldown",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Machine"
    ],
    "primaryMuscle": "Latissimus Dorsi",
    "secondaryMuscles": [
      "Teres Major",
      "Biceps",
      "Brachialis"
    ],
    "animationType": "row",
    "cues": [
      "Slight 10-degree lean back from hips",
      "Drive elbows down towards hips like putting hands in back pockets",
      "Control eccentric phase all the way to full lat extension"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Lat Pulldown",
      "url": "https://wger.de/en/exercise/102/view/lat-pulldown",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Adjust thigh pad firmly over knees.",
      "Grip bar slightly wider than shoulder width.",
      "Pull down smoothly to collarbone while expanding chest.",
      "Resist cable return to full stretch."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 120,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "vertical_pull",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "pull-up-or-lat-pulldown",
      "chin-ups",
      "neutral-grip-pull-ups",
      "close-grip-lat-pulldown"
    ]
  },
  {
    "id": "dumbbell-lateral-raise",
    "name": "Dumbbell Lateral Raise",
    "split": "Upper Body",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Lateral Deltoid (Side Shoulder Cap)",
    "secondaryMuscles": [
      "Supraspinatus",
      "Upper Trapezius"
    ],
    "animationType": "overhead",
    "cues": [
      "Lead with elbows slightly higher than wrists",
      "Maintain slight 15-degree forward hinge to hit lateral deltoid plane",
      "Lower smoothly over 2-3 seconds without swinging"
    ],
    "openSourceLink": {
      "label": "ExRx - Dumbbell Lateral Raise",
      "url": "https://exrx.net/WeightExercises/DeltoidLateral/DBLateralRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Hold dumbbells at sides with relaxed neck.",
      "Raise dumbbells outward in scapular plane until parallel to floor.",
      "Pause at apex, then descend under strict control."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 12,
      "minReps": 12,
      "maxReps": 15,
      "defaultWeight": 20,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "cable-lateral-raise",
      "cable-y-raise"
    ]
  },
  {
    "id": "triceps-rope-pushdown",
    "name": "Triceps Rope Pushdown",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Triceps Brachii (Lateral & Medial Heads)",
    "secondaryMuscles": [
      "Anconeus"
    ],
    "animationType": "curl",
    "cues": [
      "Glue elbows to ribcage without letting them swing forward",
      "Flare rope ends apart aggressively at bottom lockout",
      "Lock out arms completely and hold contraction for 1 second"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Cable Tricep Pushdown",
      "url": "https://musclewiki.com/cables/triceps/rope-pushdown",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Set cable to high pulley with rope attachment.",
      "Lean slightly forward from hips.",
      "Extend forearms straight down, flaring rope apart at the bottom.",
      "Return to 90 degrees under control."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 45,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "overhead-triceps-extension",
      "cable-overhead-triceps-rope",
      "skull-crushers",
      "tricep-bench-dips"
    ]
  },
  {
    "id": "squat-or-leg-press",
    "name": "Squat or Leg Press",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Machine",
      "Dumbbell",
      "Bodyweight"
    ],
    "primaryMuscle": "Quadriceps Femoris & Gluteus Maximus",
    "secondaryMuscles": [
      "Adductors",
      "Hamstrings",
      "Core Bracing"
    ],
    "animationType": "squat",
    "cues": [
      "Plant feet shoulder-width and drive knees out over toes",
      "Descend to parallel or machine depth stop",
      "Press through full foot tripod to drive up"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Squat Biomechanics",
      "url": "https://wger.de/en/exercise/191/view/squat",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Position under barbell or sit back firmly in 45-degree leg press.",
      "Take deep breath, brace abdominal wall.",
      "Descend smoothly until thighs reach parallel with platform.",
      "Explode upward through mid-foot."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 185,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "squat",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-back-squat",
      "goblet-front-squat",
      "hack-squat",
      "bodyweight-squat"
    ]
  },
  {
    "id": "romanian-deadlift",
    "name": "Romanian Deadlift (RDL)",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Dumbbell",
      "Trap Bar",
      "Kettlebell"
    ],
    "primaryMuscle": "Hamstrings (Biceps Femoris & Semitendinosus)",
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Erector Spinae"
    ],
    "animationType": "deadlift",
    "cues": [
      "Maintain soft knee bend and push hips straight backward",
      "Keep bar or dumbbells glued to thighs/shins",
      "Stop when hips can no longer travel backward without rounding"
    ],
    "openSourceLink": {
      "label": "ExRx - Barbell Romanian Deadlift",
      "url": "https://exrx.net/WeightExercises/OlympicLifts/RomanianDeadlift",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand upright holding bar with shoulder-width grip.",
      "Hinge hips back while keeping chest proud and lats locked.",
      "Lower weights to mid-shin level until hamstrings stretch.",
      "Drive hips forward to return to standing."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 135,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "dumbbell-romanian-deadlift",
      "barbell-deadlift",
      "good-mornings",
      "single-leg-romanian-deadlift"
    ]
  },
  {
    "id": "bulgarian-split-squat",
    "name": "Bulgarian Split Squat",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Kettlebell",
      "Barbell",
      "Bodyweight"
    ],
    "primaryMuscle": "Quadriceps & Gluteus Medius",
    "secondaryMuscles": [
      "Hamstrings",
      "Calves",
      "Core Stabilizers"
    ],
    "animationType": "squat",
    "cues": [
      "Rear foot laces resting flat on bench behind you",
      "Slight forward torso tilt to load working hip glute",
      "Lower until front thigh is parallel to floor"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Bulgarian Split Squat",
      "url": "https://musclewiki.com/dumbbells/quads/bulgarian-split-squat",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Stand about 2 feet ahead of bench, place rear foot laces on pad.",
      "Hold dumbbells at sides with core braced.",
      "Drop rear knee straight down towards floor.",
      "Drive through front heel to return to top."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 8,
      "minReps": 8,
      "maxReps": 10,
      "defaultWeight": 30,
      "repsUnit": "/leg"
    },
    "loadType": "weight_reps",
    "movementPattern": "lunge",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "reverse-lunge",
      "walking-dumbbell-lunges",
      "front-foot-elevated-split-squat",
      "dumbbell-step-ups"
    ]
  },
  {
    "id": "leg-curl",
    "name": "Leg Curl (Lying or Seated)",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine",
      "Resistance Band",
      "Dumbbell"
    ],
    "primaryMuscle": "Hamstrings (Knee Flexion Focus)",
    "secondaryMuscles": [
      "Gastrocnemius",
      "Gracilis"
    ],
    "animationType": "squat",
    "cues": [
      "Align knee joints directly with machine pivot axis",
      "Curl pad all the way to touch glutes/upper hamstrings",
      "Hold peak squeeze for 1 second before 2-second release"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Leg Curl",
      "url": "https://wger.de/en/exercise/117/view/leg-curl",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Secure pad against back of calves just below achilles.",
      "Keep hips pressed flat into bench.",
      "Flex knees to pull pad upward as far as possible.",
      "Lower smoothly back to start position."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 75,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "seated-leg-curl",
      "standing-leg-curl",
      "nordic-hamstring-curl",
      "romanian-deadlift"
    ]
  },
  {
    "id": "standing-calf-raise",
    "name": "Standing Calf Raise",
    "split": "Lower Body",
    "subCategory": "Calves",
    "category": "Legs",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell",
      "Machine",
      "Bodyweight"
    ],
    "primaryMuscle": "Gastrocnemius (Calf Upper Diamond)",
    "secondaryMuscles": [
      "Soleus",
      "Plantaris"
    ],
    "animationType": "squat",
    "cues": [
      "Drop heels below step level for a full deep stretch",
      "Pause 1 full second at bottom stretch to eliminate Achilles elastic rebound",
      "Explode onto big toes and hold peak lockout for 2 seconds"
    ],
    "openSourceLink": {
      "label": "ExRx - Standing Calf Raise",
      "url": "https://exrx.net/WeightExercises/Gastrocnemius/CBStandingCalfRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand on balls of feet on block or ledge.",
      "Lower heels under control into deep stretch.",
      "Drive aggressively onto balls of feet.",
      "Squeeze calves firmly at top."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 15,
      "minReps": 12,
      "maxReps": 20,
      "defaultWeight": 50,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "seated-calf-raise",
      "leg-press-calf-raise",
      "single-leg-dumbbell-calf-raise",
      "donkey-calf-raise"
    ]
  },
  {
    "id": "cable-crunch",
    "name": "Kneeling Cable Crunch",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Rectus Abdominis (Six-Pack Core)",
    "secondaryMuscles": [
      "Obliques"
    ],
    "animationType": "core",
    "cues": [
      "Anchor hips over knees and keep hips stationary",
      "Flex spine like curling ribcage down to touch pelvis",
      "Breathe all air out at bottom maximum abdominal contraction"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Cable Kneeling Crunch",
      "url": "https://musclewiki.com/cables/abs/kneeling-cable-crunch",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Kneel in front of high cable with rope attachment held at temples.",
      "Lock hips in position and flex thoracic spine downward.",
      "Curl elbows toward knees until abs contract hard.",
      "Unfurl spine back to starting stretch."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 60,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "anti_extension",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "hanging-knee-raise",
      "hanging-leg-raise",
      "decline-weighted-crunch",
      "ab-wheel-rollout"
    ]
  },
  {
    "id": "pull-up-or-lat-pulldown",
    "name": "Pull-up or Lat Pulldown",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Cable",
      "Machine",
      "Resistance Band"
    ],
    "primaryMuscle": "Latissimus Dorsi",
    "secondaryMuscles": [
      "Biceps",
      "Rhomboids",
      "Brachialis"
    ],
    "animationType": "row",
    "cues": [
      "Begin from a dead hang with active depressed scapulae",
      "Drive elbows down towards ribcage to pull chest toward bar",
      "Chin clears bar without straining or neck reaching"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Pull-up",
      "url": "https://wger.de/en/exercise/101/view/pull-ups",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Grip pullup bar or lat pulldown attachment just outside shoulders.",
      "Engage lats and pull body or bar until upper chest approaches bar.",
      "Hold momentarily at top, lower down under 2-3 second tempo."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 0,
      "repsUnit": "reps"
    },
    "loadType": "bodyweight_reps",
    "movementPattern": "vertical_pull",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "lat-pulldown",
      "chin-ups",
      "neutral-grip-pull-ups",
      "inverted-bodyweight-row"
    ]
  },
  {
    "id": "dumbbell-shoulder-press",
    "name": "Dumbbell Shoulder Press",
    "split": "Upper Body",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell",
      "Machine"
    ],
    "primaryMuscle": "Anterior & Lateral Deltoid",
    "secondaryMuscles": [
      "Triceps Brachii",
      "Upper Trapezius",
      "Core"
    ],
    "animationType": "overhead",
    "cues": [
      "Keep forearms vertical throughout the ascent",
      "Press weights overhead in a natural gentle arc",
      "Lower dumbbells until upper arms are parallel or slightly below shoulders"
    ],
    "openSourceLink": {
      "label": "ExRx - Dumbbell Shoulder Press",
      "url": "https://exrx.net/WeightExercises/DeltoidAnterior/DBShoulderPress",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Sit or stand holding dumbbells at shoulder height with neutral or pronated grip.",
      "Brace core firmly and press both dumbbells overhead.",
      "Lock out at top with dumbbells aligned above crown of head.",
      "Lower smoothly back to shoulders."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 45,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "vertical_push",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-overhead-press",
      "arnold-press",
      "machine-shoulder-press",
      "pike-push-ups"
    ]
  },
  {
    "id": "seated-cable-row",
    "name": "Seated Cable Row",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Machine"
    ],
    "primaryMuscle": "Mid Trapezius & Latissimus Dorsi",
    "secondaryMuscles": [
      "Rhomboids",
      "Posterior Deltoids",
      "Biceps"
    ],
    "animationType": "row",
    "cues": [
      "Maintain upright spine with proud chest throughout the pull",
      "Pull handle to navel while driving elbows backward",
      "Resist stretch forward without rounding lumbar spine"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Seated Cable Row",
      "url": "https://musclewiki.com/cables/back/seated-cable-row",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Sit on bench with feet braced on footrests, knees soft.",
      "Grasp V-grip or handle, sit tall.",
      "Row handle into stomach, pulling shoulder blades together.",
      "Extend arms back to full stretch under control."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 110,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_pull",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "chest-supported-row",
      "barbell-bent-over-row",
      "t-bar-row",
      "chest-supported-t-bar-row"
    ]
  },
  {
    "id": "push-ups-or-cable-chest-fly",
    "name": "Push-ups or Cable Chest Fly",
    "split": "Upper Body",
    "subCategory": "Chest",
    "category": "Chest",
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Cable",
      "Dumbbell"
    ],
    "primaryMuscle": "Pectoralis Major",
    "secondaryMuscles": [
      "Anterior Deltoid",
      "Triceps Brachii",
      "Core"
    ],
    "animationType": "bench",
    "cues": [
      "Keep body in one straight plank line from head to heels",
      "Tuck elbows 45 degrees to protect anterior shoulder capsule",
      "Lower until chest grazes floor or handles hug together in arc"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Push Up",
      "url": "https://wger.de/en/exercise/193/view/push-ups",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Assume high plank or set cable handles at chest height.",
      "Lower torso or hug handles together with slight elbow bend.",
      "Drive into floor or squeeze chest together at peak contraction.",
      "Repeat with strict cadence."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 0,
      "repsUnit": "reps"
    },
    "loadType": "bodyweight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "push-ups",
      "cable-chest-crossover",
      "pec-deck-machine-fly",
      "bench-press"
    ]
  },
  {
    "id": "face-pull-rear-delt-fly",
    "name": "Face Pull / Rear-Delt Fly",
    "split": "Upper Body",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Dumbbell",
      "Resistance Band"
    ],
    "primaryMuscle": "Posterior Deltoid & External Rotators (Infraspinatus)",
    "secondaryMuscles": [
      "Middle Trapezius",
      "Rhomboids"
    ],
    "animationType": "overhead",
    "cues": [
      "Set pulley at eye height and grasp rope thumbs-back",
      "Pull rope towards bridge of nose while externally rotating hands back",
      "Hold the double-bicep rear pose for 1 second"
    ],
    "openSourceLink": {
      "label": "ExRx - Cable Face Pull",
      "url": "https://exrx.net/WeightExercises/DeltoidPosterior/CBFacePull",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Grasp rope with thumbs facing backward.",
      "Step back, pull rope handles toward forehead/ears.",
      "Flare elbows wide and externally rotate shoulders.",
      "Slowly return under control."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 15,
      "minReps": 12,
      "maxReps": 20,
      "defaultWeight": 35,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_pull",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "cable-face-pulls",
      "reverse-pec-deck-fly",
      "incline-dumbbell-rear-delt-raise"
    ]
  },
  {
    "id": "hammer-curl",
    "name": "Hammer Curl",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Cable",
      "Kettlebell"
    ],
    "primaryMuscle": "Brachioradialis & Brachialis",
    "secondaryMuscles": [
      "Biceps Brachii"
    ],
    "animationType": "curl",
    "cues": [
      "Keep palms facing each other (neutral grip) throughout entire rep",
      "Elbows stay pinned to sides without swinging forward",
      "Squeeze forearm and arm muscle at top for 1 second"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Dumbbell Hammer Curl",
      "url": "https://musclewiki.com/dumbbells/biceps/hammer-curl",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Stand holding dumbbells with palms facing inwards.",
      "Curl weights upward while keeping wrists neutral.",
      "Squeeze at peak, then lower slowly over 2-3 seconds."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 30,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "ez-bar-biceps-curl",
      "incline-dumbbell-biceps-curl",
      "reverse-barbell-curl",
      "cable-biceps-curl"
    ]
  },
  {
    "id": "overhead-triceps-extension",
    "name": "Overhead Triceps Extension",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Cable",
      "Barbell"
    ],
    "primaryMuscle": "Triceps Brachii (Long Head Stretch)",
    "secondaryMuscles": [
      "Anconeus"
    ],
    "animationType": "curl",
    "cues": [
      "Keep elbows pointed forward/upward, avoiding excessive elbow flare",
      "Lower weight behind head until long head of triceps is deeply stretched",
      "Extend forearms to complete overhead lockout"
    ],
    "openSourceLink": {
      "label": "ExRx - Overhead Triceps Extension",
      "url": "https://exrx.net/WeightExercises/Triceps/DBOneArmTriExt",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Hold dumbbell with both hands cupping upper plate overhead.",
      "Bend elbows to lower weight behind neck.",
      "Contract triceps to extend arms fully overhead."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 45,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "cable-overhead-triceps-rope",
      "triceps-rope-pushdown",
      "skull-crushers",
      "tricep-bench-dips"
    ]
  },
  {
    "id": "hip-thrust-or-trap-bar-deadlift",
    "name": "Hip Thrust or Trap-Bar Deadlift",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Trap Bar",
      "Dumbbell",
      "Machine"
    ],
    "primaryMuscle": "Gluteus Maximus",
    "secondaryMuscles": [
      "Hamstrings",
      "Erectors",
      "Adductors"
    ],
    "animationType": "deadlift",
    "cues": [
      "Drive through heels and achieve full posterior pelvic tilt at top",
      "Keep chin tucked with ribs down to prevent lumbar hyperextension",
      "Hold lockout squeeze for 1-2 solid seconds"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Barbell Hip Thrust",
      "url": "https://musclewiki.com/barbell/glutes/barbell-hip-thrust",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Sit on floor with upper back against bench and loaded barbell across hips.",
      "Place feet hip-width with vertical shins at top.",
      "Drive hips skyward until thighs and torso align.",
      "Lower under control to light tap on floor."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 185,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-hip-thrust",
      "dumbbell-hip-thrust",
      "barbell-deadlift",
      "cable-pull-through"
    ]
  },
  {
    "id": "goblet-front-squat",
    "name": "Goblet / Front Squat",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "defaultEquipment": "Kettlebell",
    "supportedEquipment": [
      "Kettlebell",
      "Dumbbell",
      "Barbell"
    ],
    "primaryMuscle": "Quadriceps & Anterior Core",
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Upper Back"
    ],
    "animationType": "squat",
    "cues": [
      "Keep kettlebell or dumbbell pinned to sternum with elbows tucked",
      "Drop hips straight down between ankles while staying upright",
      "Drive through mid-foot to stand"
    ],
    "openSourceLink": {
      "label": "ExRx - Goblet Squat",
      "url": "https://exrx.net/WeightExercises/Quadriceps/KBGobletSquat",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Hold weight against upper chest with upright posture.",
      "Descend deep into squat with knees tracking toes.",
      "Pause briefly in the hole, then stand with power."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 45,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "squat",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-back-squat",
      "hack-squat",
      "kettlebell-goblet-squat",
      "bodyweight-squat"
    ]
  },
  {
    "id": "reverse-lunge",
    "name": "Reverse Lunge",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell",
      "Kettlebell",
      "Bodyweight"
    ],
    "primaryMuscle": "Quadriceps & Gluteus Maximus",
    "secondaryMuscles": [
      "Hamstrings",
      "Calves",
      "Core"
    ],
    "animationType": "squat",
    "cues": [
      "Step straight backward with steady hip alignment",
      "Lower back knee smoothly until 1 inch above floor",
      "Drive through front heel to step back to starting position"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Dumbbell Reverse Lunge",
      "url": "https://musclewiki.com/dumbbells/quads/dumbbell-reverse-lunge",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Stand tall holding dumbbells at sides.",
      "Step one foot back and descend into 90/90 lunge.",
      "Push off front leg to return to standing.",
      "Alternate legs or complete repetitions on one side."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 8,
      "minReps": 8,
      "maxReps": 10,
      "defaultWeight": 35,
      "repsUnit": "/leg"
    },
    "loadType": "weight_reps",
    "movementPattern": "lunge",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "walking-dumbbell-lunges",
      "bulgarian-split-squat",
      "bodyweight-reverse-lunge",
      "dumbbell-step-ups"
    ]
  },
  {
    "id": "seated-leg-curl",
    "name": "Seated Leg Curl",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine"
    ],
    "primaryMuscle": "Hamstrings (Seated Hip Flexion Focus)",
    "secondaryMuscles": [
      "Gastrocnemius"
    ],
    "animationType": "squat",
    "cues": [
      "Tighten thigh clamp pad so hips cannot elevate",
      "Dorsiflex toes (pull toes toward shins) for maximal hamstring recruitment",
      "Control return for 3 seconds"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Seated Leg Curl",
      "url": "https://wger.de/en/exercise/117/view/leg-curl",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Adjust seat so knees align with pivot point.",
      "Lower top thigh pad securely.",
      "Flex knees to pull pad down underneath seat.",
      "Slowly release back to starting point."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 80,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "leg-curl",
      "standing-leg-curl",
      "nordic-hamstring-curl",
      "romanian-deadlift"
    ]
  },
  {
    "id": "seated-calf-raise",
    "name": "Seated Calf Raise",
    "split": "Lower Body",
    "subCategory": "Calves",
    "category": "Legs",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine",
      "Dumbbell"
    ],
    "primaryMuscle": "Soleus (Deep Postural Calf Muscle)",
    "secondaryMuscles": [
      "Gastrocnemius"
    ],
    "animationType": "squat",
    "cues": [
      "90-degree knee bend deactivates gastrocnemius to isolate the soleus",
      "Full deep stretch at bottom for 2 seconds",
      "Push up onto toes and squeeze for 2 seconds"
    ],
    "openSourceLink": {
      "label": "ExRx - Seated Calf Raise",
      "url": "https://exrx.net/WeightExercises/Soleus/LVSeatedCalfRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Sit with balls of feet on platform, pads over lower thighs.",
      "Release safety bar, lower heels as low as possible.",
      "Elevate heels to maximum height squeezing soleus.",
      "Lower smoothly."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 15,
      "minReps": 12,
      "maxReps": 20,
      "defaultWeight": 65,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "standing-calf-raise",
      "leg-press-calf-raise",
      "donkey-calf-raise"
    ]
  },
  {
    "id": "hanging-knee-raise",
    "name": "Hanging Knee Raise",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Machine"
    ],
    "primaryMuscle": "Rectus Abdominis & Iliopsoas",
    "secondaryMuscles": [
      "Obliques",
      "Forearms"
    ],
    "animationType": "core",
    "cues": [
      "Posteriorly tilt pelvis to initiate abdominal contraction",
      "Avoid swinging or using backward momentum",
      "Curl knees up to chest level and pause"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Hanging Knee Raise",
      "url": "https://musclewiki.com/bodyweight/abs/hanging-knee-raise",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Hang from bar with active shoulders.",
      "Brace core and tuck knees toward chest.",
      "Pause at peak curl without swinging.",
      "Lower legs under 2-second cadence."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 15,
      "defaultWeight": 0,
      "repsUnit": "reps"
    },
    "loadType": "bodyweight_reps",
    "movementPattern": "anti_extension",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "hanging-leg-raise",
      "captain-chair-leg-raise",
      "cable-crunch",
      "deadbug"
    ]
  },
  {
    "id": "side-plank",
    "name": "Side Plank",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Quadratus Lumborum & Obliques",
    "secondaryMuscles": [
      "Gluteus Medius",
      "Transverse Abdominis"
    ],
    "animationType": "core",
    "cues": [
      "Elbow placed directly below shoulder joint",
      "Lift hips so body forms a straight line from shoulder to ankle",
      "Breathe deeply into diaphragm while maintaining tight abdominal brace"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Side Plank",
      "url": "https://wger.de/en/exercise/258/view/side-plank",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Lie on side with elbow directly beneath shoulder, feet stacked.",
      "Elevate hips off floor into straight rigid alignment.",
      "Hold position for target 30–45 seconds, then switch sides."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 30,
      "minReps": 30,
      "maxReps": 45,
      "defaultWeight": 0,
      "repsUnit": "sec/side"
    },
    "loadType": "bodyweight_timed",
    "movementPattern": "anti_rotation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "plank",
      "cable-pallof-press",
      "bird-dog",
      "suitcase-carry"
    ]
  },
  {
    "id": "incline-barbell-bench-press",
    "name": "Incline Barbell Bench Press",
    "split": "Upper Body",
    "subCategory": "Chest",
    "category": "Chest",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Dumbbell",
      "Machine",
      "Smith Machine"
    ],
    "primaryMuscle": "Clavicular Head (Upper Pectorals)",
    "secondaryMuscles": [
      "Anterior Deltoid",
      "Triceps Brachii"
    ],
    "animationType": "bench",
    "cues": [
      "Set bench to 30 degrees to bias upper clavicular fibers",
      "Touch the bar to upper chest right below clavicles",
      "Drive elbows inward to maximize upper pectoral tension"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Incline Barbell Bench",
      "url": "https://musclewiki.com/barbell/chest/incline-barbell-bench-press",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Position bench under barbell at 30-degree incline.",
      "Grip slightly wider than shoulder width.",
      "Lower bar with control to upper chest, then press explosively."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 115,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "incline-dumbbell-press",
      "bench-press",
      "machine-chest-press"
    ]
  },
  {
    "id": "dumbbell-flat-bench-press",
    "name": "Dumbbell Flat Bench Press",
    "split": "Upper Body",
    "subCategory": "Chest",
    "category": "Chest",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell",
      "Machine"
    ],
    "primaryMuscle": "Pectoralis Major (Sternal Head)",
    "secondaryMuscles": [
      "Anterior Deltoid",
      "Triceps Brachii"
    ],
    "animationType": "bench",
    "cues": [
      "Kick dumbbells to chest using knees when lying back",
      "Retract scapulae and press in an arcing convergent path",
      "Get a deep stretch at bottom without flaring elbows 90 degrees"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Dumbbell Bench Press",
      "url": "https://wger.de/en/exercise/73/view/dumbbell-bench-press",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Lie flat on bench holding dumbbells directly over chest.",
      "Lower dumbbells until handles reach outer chest depth.",
      "Press upward converging dumbbells toward center."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 55,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "bench-press",
      "incline-dumbbell-press",
      "chest-dips",
      "push-ups"
    ]
  },
  {
    "id": "decline-dumbbell-press",
    "name": "Decline Dumbbell Press",
    "split": "Upper Body",
    "subCategory": "Chest",
    "category": "Chest",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell",
      "Machine"
    ],
    "primaryMuscle": "Lower Pectoralis Major (Costal Head)",
    "secondaryMuscles": [
      "Triceps Brachii",
      "Anterior Deltoid"
    ],
    "animationType": "bench",
    "cues": [
      "Hook legs securely beneath decline pads",
      "Lower weights to lower pectoral line under control",
      "Lock out overhead with strong chest contraction"
    ],
    "openSourceLink": {
      "label": "ExRx - Decline Dumbbell Press",
      "url": "https://exrx.net/WeightExercises/PectoralSternal/DBDeclineBenchPress",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Position yourself on a decline bench with ankles secured.",
      "Press dumbbells up from lower chest level.",
      "Control eccentric stretch and press back to starting point."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 50,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "chest-dips",
      "weighted-chest-dips",
      "bench-press",
      "dumbbell-flat-bench-press"
    ]
  },
  {
    "id": "cable-chest-crossover",
    "name": "Cable Chest Crossover (Low to High)",
    "split": "Upper Body",
    "subCategory": "Chest",
    "category": "Chest",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Clavicular & Sternal Pectoralis",
    "secondaryMuscles": [
      "Anterior Deltoid",
      "Biceps Short Head"
    ],
    "animationType": "bench",
    "cues": [
      "Stagger stance for base stability with slight forward lean",
      "Sweep hands upward and inward as if hugging a wide barrel",
      "Hold peak squeeze for 1 second at top cross point"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Cable Low Fly",
      "url": "https://musclewiki.com/cables/chest/low-cable-fly",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Set pulleys to lowest notch with D-handles.",
      "Step forward with arms outstretched behind torso.",
      "Bring hands up and together toward eye level with a deep pectoral squeeze."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 25,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "pec-deck-machine-fly",
      "push-ups-or-cable-chest-fly",
      "dumbbell-flat-bench-press"
    ]
  },
  {
    "id": "weighted-chest-dips",
    "name": "Weighted / Bodyweight Chest Dips",
    "split": "Upper Body",
    "subCategory": "Chest",
    "category": "Chest",
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Dumbbell",
      "Machine"
    ],
    "primaryMuscle": "Lower Pectoralis Major",
    "secondaryMuscles": [
      "Triceps Brachii",
      "Anterior Deltoid"
    ],
    "animationType": "bench",
    "cues": [
      "Lean torso forward 30 degrees to shift load from triceps to chest",
      "Flare elbows slightly outward on the descent",
      "Descend until shoulders dip just below elbows"
    ],
    "openSourceLink": {
      "label": "ExRx - Chest Dips",
      "url": "https://exrx.net/WeightExercises/PectoralSternal/BWChestDip",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Support body on parallel bars with arms extended.",
      "Lean forward and bend knees, crossing ankles.",
      "Lower torso until chest feels a full stretch, then drive upward to lockout."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 12,
      "defaultWeight": 0,
      "repsUnit": "reps"
    },
    "loadType": "bodyweight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "chest-dips",
      "bench-press",
      "decline-dumbbell-press",
      "push-ups"
    ]
  },
  {
    "id": "machine-chest-press",
    "name": "Machine Chest Press (Converging)",
    "split": "Upper Body",
    "subCategory": "Chest",
    "category": "Chest",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine"
    ],
    "primaryMuscle": "Pectoralis Major",
    "secondaryMuscles": [
      "Triceps",
      "Front Delts"
    ],
    "animationType": "bench",
    "cues": [
      "Adjust seat height so handles align with mid-nipple line",
      "Keep shoulder blades packed against back pad throughout press",
      "Slow 3-second negative eccentric tempo"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Machine Bench Press",
      "url": "https://wger.de/en/exercise/235/view/machine-chest-press",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Sit firmly against backrest with feet planted flat.",
      "Grasp horizontal handles and press forward smoothly.",
      "Control return until weight plates hover above stack."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 110,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "bench-press",
      "dumbbell-flat-bench-press",
      "incline-dumbbell-press"
    ]
  },
  {
    "id": "dumbbell-pullover",
    "name": "Dumbbell Pullover",
    "split": "Upper Body",
    "subCategory": "Chest",
    "category": "Chest",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell"
    ],
    "primaryMuscle": "Serratus Anterior & Lower Pecs",
    "secondaryMuscles": [
      "Latissimus Dorsi",
      "Triceps Long Head"
    ],
    "animationType": "bench",
    "cues": [
      "Form diamond grip on underside of top dumbbell plate",
      "Lower weight behind head with soft elbow bend until lats stretch",
      "Pull back over chest using chest and serratus contraction"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Dumbbell Pullover",
      "url": "https://musclewiki.com/dumbbells/chest/dumbbell-pullover",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Lie perpendicular across bench with upper back supported and hips low.",
      "Hold dumbbell overhead with two hands.",
      "Slowly arc weight behind head and pull back over sternum."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 45,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "lat-pullover-machine",
      "straight-arm-lat-pushdown",
      "lat-pulldown"
    ]
  },
  {
    "id": "barbell-bent-over-row",
    "name": "Barbell Bent-Over Row (Overhand)",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Dumbbell",
      "Smith Machine"
    ],
    "primaryMuscle": "Latissimus Dorsi & Rhomboids",
    "secondaryMuscles": [
      "Erector Spinae",
      "Biceps Brachii",
      "Rear Delts"
    ],
    "animationType": "row",
    "cues": [
      "Hinge at hips until torso is roughly 45 degrees to the floor",
      "Pull bar to lower sternum/belly button, driving elbows back",
      "Maintain neutral spine without rounding lumbar"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Barbell Row",
      "url": "https://wger.de/en/exercise/14/view/barbell-row",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Hinge at hips with knees slightly bent holding barbell overhand.",
      "Row barbell upward until it grazes the abdomen.",
      "Lower with control to full arm hang."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 115,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_pull",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "t-bar-row",
      "chest-supported-row",
      "seated-cable-row",
      "single-arm-dumbbell-row"
    ]
  },
  {
    "id": "t-bar-row",
    "name": "T-Bar Row (Neutral Grip)",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine",
      "Barbell"
    ],
    "primaryMuscle": "Middle Trapezius & Lats",
    "secondaryMuscles": [
      "Rhomboids",
      "Brachialis"
    ],
    "animationType": "row",
    "cues": [
      "Grip close neutral handles firmly",
      "Keep chest elevated and pull through elbows",
      "Squeeze shoulder blades hard at top"
    ],
    "openSourceLink": {
      "label": "ExRx - T-Bar Row",
      "url": "https://exrx.net/WeightExercises/BackGeneral/LBTBarRow",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Straddle bar and take neutral grip on handles.",
      "Hinge hips and pull handles toward lower ribcage.",
      "Lower smoothly into full stretch."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 90,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_pull",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "chest-supported-t-bar-row",
      "barbell-bent-over-row",
      "chest-supported-row",
      "seated-cable-row"
    ]
  },
  {
    "id": "single-arm-dumbbell-row",
    "name": "Single-Arm Dumbbell Row",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Kettlebell"
    ],
    "primaryMuscle": "Latissimus Dorsi",
    "secondaryMuscles": [
      "Biceps",
      "Rhomboids",
      "Core Stabilizers"
    ],
    "animationType": "row",
    "cues": [
      "Place knee and supporting hand flat on bench",
      "Pull dumbbell in an arc toward hip pocket, not straight up",
      "Keep hips square and avoid excessive torso rotation"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Dumbbell Row",
      "url": "https://musclewiki.com/dumbbells/back/single-arm-dumbbell-row",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Set one knee and same-side hand on flat bench.",
      "Hold dumbbell with free hand hanging straight down.",
      "Drive elbow toward hip, pause, and lower under control."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 50,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_pull",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "chest-supported-row",
      "seated-cable-row",
      "barbell-bent-over-row"
    ]
  },
  {
    "id": "close-grip-lat-pulldown",
    "name": "Close-Grip V-Bar Lat Pulldown",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Machine"
    ],
    "primaryMuscle": "Lower Latissimus Dorsi",
    "secondaryMuscles": [
      "Biceps Brachii",
      "Mid-Traps"
    ],
    "animationType": "row",
    "cues": [
      "Attach V-handle to pulldown cable",
      "Lean back 10–15 degrees and pull handle directly to clavicles",
      "Lead with elbows and tuck them down toward waist"
    ],
    "openSourceLink": {
      "label": "ExRx - Cable Close-Grip Pulldown",
      "url": "https://exrx.net/WeightExercises/LatissimusDorsi/CBCloseGripPulldown",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Sit facing machine with knees pinned securely beneath pads.",
      "Grasp V-bar and pull downward until handle reaches upper chest.",
      "Extend arms slowly back to full lat stretch overhead."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 100,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "vertical_pull",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "lat-pulldown",
      "chin-ups",
      "neutral-grip-pull-ups"
    ]
  },
  {
    "id": "straight-arm-lat-pushdown",
    "name": "Straight-Arm Cable Lat Pushdown",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Latissimus Dorsi (Teres Major)",
    "secondaryMuscles": [
      "Triceps Long Head",
      "Abdominals"
    ],
    "animationType": "row",
    "cues": [
      "Maintain slight elbow bend without changing angle during rep",
      "Hinge forward slightly at hips",
      "Push bar down in sweeping arc until it touches upper thighs"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Cable Straight Arm Pulldown",
      "url": "https://musclewiki.com/cables/back/straight-arm-pulldown",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Face high pulley with straight bar attachment.",
      "Grasp bar overhand with shoulder-width grip.",
      "Sweep bar down toward thighs, pause for contraction, and return overhead."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 45,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "lat-pullover-machine",
      "dumbbell-pullover",
      "lat-pulldown"
    ]
  },
  {
    "id": "chin-ups",
    "name": "Chin-ups (Underhand Grip)",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Resistance Band",
      "Machine"
    ],
    "primaryMuscle": "Latissimus Dorsi & Biceps Brachii",
    "secondaryMuscles": [
      "Brachialis",
      "Lower Trapezius"
    ],
    "animationType": "row",
    "cues": [
      "Supinated palms-facing-you shoulder-width grip",
      "Pull chest up to touch the bar without swinging or kicking legs",
      "Lower all the way down to complete dead hang"
    ],
    "openSourceLink": {
      "label": "ExRx - Underhand Chin-up",
      "url": "https://exrx.net/WeightExercises/LatissimusDorsi/BWUnderhandChinup",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Grasp overhead bar with palms facing you.",
      "Pull body upward until chin clears the bar.",
      "Lower under complete control back to starting dead hang."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 5,
      "maxReps": 10,
      "defaultWeight": 0,
      "repsUnit": "reps"
    },
    "loadType": "bodyweight_reps",
    "movementPattern": "vertical_pull",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "pull-up-or-lat-pulldown",
      "neutral-grip-pull-ups",
      "lat-pulldown",
      "close-grip-lat-pulldown"
    ]
  },
  {
    "id": "inverted-bodyweight-row",
    "name": "Inverted Row (Smith / Barbell)",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Barbell",
      "Resistance Band"
    ],
    "primaryMuscle": "Rhomboids & Mid Trapezius",
    "secondaryMuscles": [
      "Biceps",
      "Posterior Deltoids",
      "Core"
    ],
    "animationType": "row",
    "cues": [
      "Set bar at waist height and hang underneath with body rigid",
      "Pull chest to bar while keeping glutes squeezed and body in plank",
      "Lower under control without hips sagging"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Inverted Row",
      "url": "https://wger.de/en/exercise/257/view/inverted-row",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Lie underneath fixed barbell set at waist height.",
      "Grip bar with overhand grip and heels on the floor.",
      "Pull chest directly to bar, squeeze shoulder blades, and lower."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 0,
      "repsUnit": "reps"
    },
    "loadType": "bodyweight_reps",
    "movementPattern": "horizontal_pull",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "chest-supported-row",
      "seated-cable-row",
      "pull-up-or-lat-pulldown"
    ]
  },
  {
    "id": "barbell-overhead-press",
    "name": "Barbell Overhead Press (OHP)",
    "split": "Upper Body",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Dumbbell",
      "Smith Machine"
    ],
    "primaryMuscle": "Anterior & Medial Deltoids",
    "secondaryMuscles": [
      "Triceps Brachii",
      "Upper Trapezius",
      "Core"
    ],
    "animationType": "overhead",
    "cues": [
      "Squeeze glutes and brace core tightly to protect lumbar",
      "Press bar in vertical path, tucking chin back slightly until bar clears",
      "Lock out bar directly over mid-foot balance line"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Overhead Press",
      "url": "https://musclewiki.com/barbell/shoulders/overhead-press",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Hold bar at clavicle level with clean grip just outside shoulders.",
      "Take deep breath, brace core and glutes.",
      "Press straight up to full lockout overhead, bringing head slightly through window at top."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 6,
      "minReps": 5,
      "maxReps": 8,
      "defaultWeight": 85,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "vertical_push",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "dumbbell-shoulder-press",
      "arnold-press",
      "machine-shoulder-press",
      "pike-push-ups"
    ]
  },
  {
    "id": "cable-lateral-raise",
    "name": "Cable Lateral Raise",
    "split": "Upper Body",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Lateral Deltoid",
    "secondaryMuscles": [
      "Supraspinatus",
      "Trapezius"
    ],
    "animationType": "overhead",
    "cues": [
      "Set cable at knee height with cuff or D-handle",
      "Lead with elbow and raise out in scapular plane 30 degrees forward",
      "Constant smooth tension throughout entire range"
    ],
    "openSourceLink": {
      "label": "ExRx - Cable Lateral Raise",
      "url": "https://exrx.net/WeightExercises/DeltoidLateral/CBLateralRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand sideways to low cable pulley holding handle across body.",
      "Raise arm out to side until parallel to floor.",
      "Lower smoothly resisting the cable pull."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 15,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "dumbbell-lateral-raise",
      "cable-y-raise"
    ]
  },
  {
    "id": "arnold-press",
    "name": "Arnold Dumbbell Press",
    "split": "Upper Body",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Kettlebell"
    ],
    "primaryMuscle": "Anterior & Medial Deltoid",
    "secondaryMuscles": [
      "Triceps Brachii",
      "Rotator Cuff"
    ],
    "animationType": "overhead",
    "cues": [
      "Start with dumbbells at chin level, palms facing chest",
      "Rotate wrists outward as you press upward overhead",
      "Finish with palms facing forward at full lockout"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Arnold Press",
      "url": "https://musclewiki.com/dumbbells/shoulders/arnold-press",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Sit on upright bench holding dumbbells at chest height, palms facing in.",
      "Press upward while rotating forearms 180 degrees outward.",
      "Reverse rotation smoothly as you lower dumbbells back to starting position."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 35,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "vertical_push",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "dumbbell-shoulder-press",
      "barbell-overhead-press",
      "machine-shoulder-press"
    ]
  },
  {
    "id": "reverse-pec-deck-fly",
    "name": "Reverse Pec Deck (Rear Delt Fly)",
    "split": "Upper Body",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine",
      "Cable",
      "Dumbbell"
    ],
    "primaryMuscle": "Posterior Deltoid",
    "secondaryMuscles": [
      "Rhomboids",
      "Infraspinatus"
    ],
    "animationType": "row",
    "cues": [
      "Adjust seat so handles are at eye level",
      "Keep elbows high and drive arms outward in wide horizontal arc",
      "Focus pull on back of shoulders rather than squeezing mid-back"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Rear Delt Fly",
      "url": "https://wger.de/en/exercise/105/view/reverse-flyes",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Sit facing the pec deck machine with chest against pad.",
      "Grasp handles with neutral or overhand grip.",
      "Sweep handles outward until arms are in line with shoulders."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 70,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "cable-face-pulls",
      "face-pull-rear-delt-fly",
      "incline-dumbbell-rear-delt-raise"
    ]
  },
  {
    "id": "incline-dumbbell-rear-delt-raise",
    "name": "Incline Dumbbell Rear Delt Raise",
    "split": "Upper Body",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Resistance Band"
    ],
    "primaryMuscle": "Posterior Deltoid",
    "secondaryMuscles": [
      "Trapezius",
      "Teres Minor"
    ],
    "animationType": "row",
    "cues": [
      "Lie chest-down on 30-degree incline bench",
      "Raise dumbbells out to sides with slight bend in elbows",
      "Lead with pinkies to maximize rear deltoid contraction"
    ],
    "openSourceLink": {
      "label": "ExRx - Incline Rear Lateral Raise",
      "url": "https://exrx.net/WeightExercises/DeltoidPosterior/DBInclineRearLateralRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Lie prone on incline bench holding light dumbbells.",
      "Raise arms outward in a T-shape with elbows slightly bent.",
      "Pause at peak height, then lower under control."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 15,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "reverse-pec-deck-fly",
      "cable-face-pulls",
      "face-pull-rear-delt-fly"
    ]
  },
  {
    "id": "ez-bar-biceps-curl",
    "name": "EZ-Bar Biceps Curl",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Cable",
      "Dumbbell"
    ],
    "primaryMuscle": "Biceps Brachii (Short & Long Heads)",
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "animationType": "curl",
    "cues": [
      "Grip the cambered inner curve of the EZ-bar",
      "Pin elbows securely against ribcage with zero torso swing",
      "Curl upward to full contraction, squeeze for 1 second"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - EZ-Bar Biceps Curl",
      "url": "https://musclewiki.com/barbell/biceps/ez-bar-curl",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Stand tall holding EZ-bar with underhand grip.",
      "Curl bar up toward shoulders keeping upper arms motionless.",
      "Lower smoothly back to full elbow extension."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 55,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "incline-dumbbell-biceps-curl",
      "hammer-curl",
      "cable-biceps-curl",
      "preacher-curl"
    ]
  },
  {
    "id": "incline-dumbbell-biceps-curl",
    "name": "Incline Dumbbell Biceps Curl",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell"
    ],
    "primaryMuscle": "Biceps Brachii (Long Head Stretch)",
    "secondaryMuscles": [
      "Brachialis",
      "Forearm Flexors"
    ],
    "animationType": "curl",
    "cues": [
      "Set bench to 45–60 degrees incline",
      "Let arms hang perpendicular to floor for deep stretch",
      "Supinate wrists as you curl up, keeping elbows pointed down"
    ],
    "openSourceLink": {
      "label": "ExRx - Incline Dumbbell Curl",
      "url": "https://exrx.net/WeightExercises/Biceps/DBInclineCurl",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Lie back on incline bench with dumbbells hanging at sides.",
      "Curl weights upward while turning palms up.",
      "Control the lowering phase to feel maximum long-head stretch."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 25,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "ez-bar-biceps-curl",
      "preacher-curl",
      "hammer-curl",
      "cable-biceps-curl"
    ]
  },
  {
    "id": "preacher-curl",
    "name": "Preacher Curl (EZ-Bar / Machine)",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Dumbbell",
      "Machine"
    ],
    "primaryMuscle": "Biceps Brachii (Short Head Focus)",
    "secondaryMuscles": [
      "Brachialis"
    ],
    "animationType": "curl",
    "cues": [
      "Rest armpits snugly on top of preacher pad",
      "Keep wrists rigid without curling them into forearms",
      "Stop just shy of full lockout at bottom to protect distal tendon"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Preacher Curl",
      "url": "https://wger.de/en/exercise/87/view/preacher-curls",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Sit at preacher bench with upper arms flat against angled pad.",
      "Curl EZ-bar upward toward chin.",
      "Lower bar with control until forearms are almost parallel with pad."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 45,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "concentration-curl",
      "ez-bar-biceps-curl",
      "cable-biceps-curl"
    ]
  },
  {
    "id": "concentration-curl",
    "name": "Dumbbell Concentration Curl",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell"
    ],
    "primaryMuscle": "Biceps Brachii Peak",
    "secondaryMuscles": [
      "Brachialis"
    ],
    "animationType": "curl",
    "cues": [
      "Brace triceps against inner thigh, just above knee",
      "Do not swing or rock upper body",
      "Squeeze biceps peak aggressively at top of movement"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Concentration Curl",
      "url": "https://musclewiki.com/dumbbells/biceps/concentration-curl",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Sit on edge of bench with legs spread wide.",
      "Rest elbow against inner thigh, arm hanging straight down.",
      "Curl dumbbell upward to chest and lower slowly."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 12,
      "defaultWeight": 25,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "preacher-curl",
      "incline-dumbbell-biceps-curl",
      "hammer-curl"
    ]
  },
  {
    "id": "skull-crushers",
    "name": "Skull Crushers (Lying Triceps Extension)",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Dumbbell",
      "Cable"
    ],
    "primaryMuscle": "Triceps Brachii (Medial & Lateral Heads)",
    "secondaryMuscles": [
      "Triceps Long Head",
      "Anconeus"
    ],
    "animationType": "curl",
    "cues": [
      "Angle upper arms slightly back toward head (not vertical)",
      "Lower bar slowly toward crown of forehead",
      "Extend forearms cleanly without flaring elbows wide"
    ],
    "openSourceLink": {
      "label": "ExRx - Lying Triceps Extension",
      "url": "https://exrx.net/WeightExercises/Triceps/BBLyingTriExt",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Lie flat on bench holding EZ-bar with narrow overhand grip.",
      "Lower bar toward forehead by bending elbows only.",
      "Extend elbows powerfully back to lockout position."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 50,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "close-grip-bench-press",
      "overhead-triceps-extension",
      "triceps-rope-pushdown"
    ]
  },
  {
    "id": "close-grip-bench-press",
    "name": "Close-Grip Barbell Bench Press",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Smith Machine"
    ],
    "primaryMuscle": "Triceps Brachii (All Heads)",
    "secondaryMuscles": [
      "Pectoralis Major",
      "Anterior Deltoid"
    ],
    "animationType": "bench",
    "cues": [
      "Grip shoulder-width (avoid wrists touching)",
      "Tuck elbows 30 degrees to ribcage on descent",
      "Push through triceps and lock out at top"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Close Grip Bench Press",
      "url": "https://musclewiki.com/barbell/triceps/close-grip-bench-press",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Lie flat on bench with shoulder-width grip on barbell.",
      "Lower bar to lower sternum with elbows tucked close to sides.",
      "Press upward focusing tension directly into triceps."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 115,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "skull-crushers",
      "diamond-push-ups",
      "triceps-rope-pushdown",
      "tricep-bench-dips"
    ]
  },
  {
    "id": "cable-overhead-triceps-rope",
    "name": "Cable Overhead Triceps Extension (Rope)",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Triceps Brachii (Long Head Stretch)",
    "secondaryMuscles": [
      "Triceps Lateral Head"
    ],
    "animationType": "curl",
    "cues": [
      "Step forward from pulley and lean torso forward 45 degrees",
      "Keep elbows pinned near ears throughout rep",
      "Flare rope ends apart at full overhead extension"
    ],
    "openSourceLink": {
      "label": "ExRx - Cable Overhead Triceps Extension",
      "url": "https://exrx.net/WeightExercises/Triceps/CBOverheadTriExtRope",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Attach rope to low or mid pulley and turn back to weight stack.",
      "Hold rope behind head with elbows bent.",
      "Extend arms overhead, separating rope ends at full lockout."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 35,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "overhead-triceps-extension",
      "triceps-rope-pushdown",
      "skull-crushers"
    ]
  },
  {
    "id": "dumbbell-kickbacks",
    "name": "Dumbbell Triceps Kickback",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Cable"
    ],
    "primaryMuscle": "Triceps Brachii (Lateral Head)",
    "secondaryMuscles": [
      "Posterior Deltoid"
    ],
    "animationType": "curl",
    "cues": [
      "Hinge torso parallel to floor with upper arm tucked tight against ribs",
      "Extend forearm backward until arm is completely straight",
      "Hold peak squeeze for 1 second before lowering"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Triceps Kickback",
      "url": "https://wger.de/en/exercise/89/view/tricep-kickback",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Place one knee on bench and hinge torso forward.",
      "Bring upper arm parallel with torso.",
      "Extend forearm straight back to full triceps lockout, then lower."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 20,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "triceps-rope-pushdown",
      "overhead-triceps-extension"
    ]
  },
  {
    "id": "barbell-back-squat",
    "name": "Barbell Back Squat (High Bar / Low Bar)",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Smith Machine"
    ],
    "primaryMuscle": "Quadriceps Femoris & Gluteus Maximus",
    "secondaryMuscles": [
      "Adductors",
      "Hamstrings",
      "Erector Spinae",
      "Core"
    ],
    "animationType": "squat",
    "cues": [
      "Brace abdominal wall with deep diaphragmatic breath into belt",
      "Break at knees and hips simultaneously with chest held tall",
      "Drive out of the hole spreading the floor through whole foot"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Barbell Back Squat",
      "url": "https://musclewiki.com/barbell/quads/barbell-squat",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Rest bar securely on upper traps (high bar) or rear delts (low bar).",
      "Descend until hip crease is below parallel with knees.",
      "Drive powerfully upward through mid-foot back to standing."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 6,
      "minReps": 5,
      "maxReps": 8,
      "defaultWeight": 185,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "squat",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "goblet-front-squat",
      "hack-squat",
      "squat-or-leg-press",
      "bodyweight-squat"
    ]
  },
  {
    "id": "hack-squat",
    "name": "Hack Squat (45° Sled Machine)",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine"
    ],
    "primaryMuscle": "Vastus Lateralis & Rectus Femoris",
    "secondaryMuscles": [
      "Gluteus Maximus"
    ],
    "animationType": "squat",
    "cues": [
      "Place feet lower on platform for maximal knee flexion and quad bias",
      "Keep lumbar and back firmly pinned to padded carriage",
      "Control deep descent to at least 90 degrees knee bend"
    ],
    "openSourceLink": {
      "label": "ExRx - Sled Hack Squat",
      "url": "https://exrx.net/WeightExercises/Quadriceps/SLHackSquat",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Step into machine with shoulders under pads and back flat.",
      "Release safety handles and lower carriage smoothly into deep squat.",
      "Drive through mid-foot back to starting lockout."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 140,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "squat",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-back-squat",
      "squat-or-leg-press",
      "leg-extension"
    ]
  },
  {
    "id": "leg-extension",
    "name": "Leg Extension (Quadriceps Isolation)",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine",
      "Resistance Band"
    ],
    "primaryMuscle": "Rectus Femoris & Vastus Medialis (Teardrop)",
    "secondaryMuscles": [
      "Vastus Intermedius"
    ],
    "animationType": "squat",
    "cues": [
      "Align knee joints directly with machine rotational pivot point",
      "Hold handles tightly to anchor hips firmly into seat",
      "Pause at full knee extension for 1 second squeeze"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Leg Extension",
      "url": "https://musclewiki.com/machine/quads/lever-leg-extension",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Sit on machine with shin pad resting just above ankles.",
      "Extend legs forward until knees are fully straightened.",
      "Lower slowly resisting the weight stack down."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 80,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "hack-squat",
      "sissy-squat",
      "goblet-front-squat"
    ]
  },
  {
    "id": "walking-dumbbell-lunges",
    "name": "Walking Dumbbell Lunges",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell",
      "Kettlebell",
      "Bodyweight"
    ],
    "primaryMuscle": "Quadriceps & Gluteus Maximus",
    "secondaryMuscles": [
      "Hamstrings",
      "Calves",
      "Core"
    ],
    "animationType": "squat",
    "cues": [
      "Take comfortable stride and drop back knee gently toward floor",
      "Keep front shin roughly vertical and torso upright",
      "Drive up through front heel to step into next lunge"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Walking Lunges",
      "url": "https://wger.de/en/exercise/221/view/lunges",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Stand holding dumbbells at sides.",
      "Step forward with one leg, sinking hips until both knees reach 90 degrees.",
      "Push off forward leg to bring feet together, then alternate legs."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 35,
      "repsUnit": "per leg"
    },
    "loadType": "weight_reps",
    "movementPattern": "lunge",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "reverse-lunge",
      "bulgarian-split-squat",
      "dumbbell-step-ups",
      "bodyweight-reverse-lunge"
    ]
  },
  {
    "id": "dumbbell-step-ups",
    "name": "Dumbbell Step-Ups (Plyo Box / Bench)",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell",
      "Bodyweight"
    ],
    "primaryMuscle": "Quadriceps & Gluteus Maximus",
    "secondaryMuscles": [
      "Calves",
      "Core Stabilizers"
    ],
    "animationType": "squat",
    "cues": [
      "Plant whole foot onto box without letting heel hang off",
      "Drive through front leg without bouncing off trailing foot",
      "Control descent to avoid knee crashing on the step down"
    ],
    "openSourceLink": {
      "label": "ExRx - Dumbbell Step-up",
      "url": "https://exrx.net/WeightExercises/Quadriceps/DBStepUp",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand in front of knee-height box holding dumbbells.",
      "Place one foot on box and drive straight upward to stand tall on box.",
      "Step down carefully under control with trailing leg."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 30,
      "repsUnit": "per leg"
    },
    "loadType": "weight_reps",
    "movementPattern": "lunge",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "reverse-lunge",
      "walking-dumbbell-lunges",
      "bulgarian-split-squat"
    ]
  },
  {
    "id": "barbell-deadlift",
    "name": "Conventional Barbell Deadlift",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Trap Bar"
    ],
    "primaryMuscle": "Posterior Chain (Glutes & Hamstrings)",
    "secondaryMuscles": [
      "Erector Spinae",
      "Latissimus Dorsi",
      "Quadriceps",
      "Traps"
    ],
    "animationType": "deadlift",
    "cues": [
      "Set bar over mid-foot balance point with shins touching bar",
      "Pull slack out of bar until you hear the click",
      "Push floor away with legs while keeping chest proud and spine rigid"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Barbell Deadlift",
      "url": "https://musclewiki.com/barbell/hamstrings/barbell-deadlift",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Stand with feet hip-width apart, barbell over mid-foot.",
      "Hinge hips back and grasp bar outside knees.",
      "Brace core and drive floor away to stand fully erect, locking out hips."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 5,
      "minReps": 3,
      "maxReps": 6,
      "defaultWeight": 225,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "sumo-deadlift",
      "romanian-deadlift",
      "barbell-hip-thrust"
    ]
  },
  {
    "id": "sumo-deadlift",
    "name": "Sumo Deadlift",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell"
    ],
    "primaryMuscle": "Gluteus Maximus & Adductors",
    "secondaryMuscles": [
      "Quadriceps",
      "Hamstrings",
      "Erector Spinae"
    ],
    "animationType": "deadlift",
    "cues": [
      "Take wide stance with toes pointed out 45 degrees",
      "Grip bar inside knees with arms straight down",
      "Spread the floor with feet to open hips and drive upright"
    ],
    "openSourceLink": {
      "label": "ExRx - Sumo Deadlift",
      "url": "https://exrx.net/WeightExercises/GluteusMaximus/BBSumoDeadlift",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Assume wide stance with shins vertical against bar.",
      "Grip bar inside legs with shoulders directly over barbell.",
      "Drive hips forward into the bar while spreading the floor."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 5,
      "minReps": 3,
      "maxReps": 6,
      "defaultWeight": 225,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-deadlift",
      "romanian-deadlift",
      "barbell-hip-thrust"
    ]
  },
  {
    "id": "dumbbell-romanian-deadlift",
    "name": "Dumbbell Romanian Deadlift (DB RDL)",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Kettlebell"
    ],
    "primaryMuscle": "Hamstrings & Gluteus Maximus",
    "secondaryMuscles": [
      "Erector Spinae",
      "Forearms"
    ],
    "animationType": "deadlift",
    "cues": [
      "Hold dumbbells against front of thighs with neutral spine",
      "Push hips back toward wall as if closing a car door with glutes",
      "Lower weights just past knees until deep hamstring stretch is felt"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Dumbbell Romanian Deadlift",
      "url": "https://musclewiki.com/dumbbells/hamstrings/romanian-deadlift",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Stand holding dumbbells against thighs with feet hip-width.",
      "Hinge hips straight backward keeping shins almost vertical.",
      "Drive hips forward to return to standing lockout."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 50,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "romanian-deadlift",
      "single-leg-romanian-deadlift",
      "cable-pull-through"
    ]
  },
  {
    "id": "barbell-hip-thrust",
    "name": "Barbell Hip Thrust (Bench Supported)",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Dumbbell",
      "Machine"
    ],
    "primaryMuscle": "Gluteus Maximus",
    "secondaryMuscles": [
      "Hamstrings",
      "Adductors"
    ],
    "animationType": "deadlift",
    "cues": [
      "Place upper back across flat bench with bar pad across hip crease",
      "Shins should be vertical at full lockout",
      "Tuck chin to chest and achieve full posterior pelvic tilt at top"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Barbell Hip Thrust",
      "url": "https://wger.de/en/exercise/259/view/barbell-hip-thrust",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Sit on floor with upper back against bench and loaded barbell over hips.",
      "Drive through heels to extend hips toward ceiling until thighs align with torso.",
      "Squeeze glutes hard at top, then lower with control."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 135,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "dumbbell-hip-thrust",
      "romanian-deadlift",
      "cable-glute-kickback"
    ]
  },
  {
    "id": "good-mornings",
    "name": "Barbell Good Morning",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Resistance Band"
    ],
    "primaryMuscle": "Hamstrings & Erector Spinae",
    "secondaryMuscles": [
      "Gluteus Maximus"
    ],
    "animationType": "deadlift",
    "cues": [
      "Barbell rests across upper traps with tight upper back shelf",
      "Push hips back with soft knee bend until torso approaches 45–60 degrees",
      "Contract hamstrings and glutes to pull torso back to standing"
    ],
    "openSourceLink": {
      "label": "ExRx - Barbell Good Morning",
      "url": "https://exrx.net/WeightExercises/Hamstrings/BBGoodMorning",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Unrack barbell across upper traps as in a back squat.",
      "Hinge hips straight backward with soft knees and straight spine.",
      "Squeeze glutes and hamstrings to return to starting upright position."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 75,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "romanian-deadlift",
      "cable-pull-through",
      "dumbbell-romanian-deadlift"
    ]
  },
  {
    "id": "cable-pull-through",
    "name": "Cable Pull-Through",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Gluteus Maximus & Upper Hamstrings",
    "secondaryMuscles": [
      "Erector Spinae"
    ],
    "animationType": "deadlift",
    "cues": [
      "Face away from low pulley with rope attachment between legs",
      "Hinge hips back letting cable pull hands between thighs",
      "Thrust hips forward and squeeze glutes hard at top lockout"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Cable Pull Through",
      "url": "https://musclewiki.com/cables/glutes/cable-pull-through",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Attach rope to low pulley and straddle cable facing away.",
      "Hinge hips back into deep stretch.",
      "Drive hips forward to stand tall, locking out glutes."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 50,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "dumbbell-romanian-deadlift",
      "barbell-hip-thrust",
      "dumbbell-hip-thrust"
    ]
  },
  {
    "id": "cable-glute-kickback",
    "name": "Cable Glute Kickback",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Resistance Band",
      "Machine"
    ],
    "primaryMuscle": "Gluteus Maximus (Upper Fibers)",
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "animationType": "deadlift",
    "cues": [
      "Strap ankle cuff to low pulley with hands on machine frame for support",
      "Kick leg backward and slightly outward in 30-degree diagonal arc",
      "Avoid arching lower back to fake range of motion"
    ],
    "openSourceLink": {
      "label": "ExRx - Cable Glute Kickback",
      "url": "https://exrx.net/WeightExercises/GluteusMaximus/CBGluteKickback",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Attach ankle cuff to low pulley facing machine.",
      "Hinge forward slightly and kick leg backward through heel.",
      "Squeeze glute at top and return under control."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 20,
      "repsUnit": "per leg"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "barbell-hip-thrust",
      "dumbbell-hip-thrust",
      "cable-pull-through"
    ]
  },
  {
    "id": "leg-press-calf-raise",
    "name": "Leg Press Toe Press (Calf Extension)",
    "split": "Lower Body",
    "subCategory": "Calves",
    "category": "Legs",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine"
    ],
    "primaryMuscle": "Gastrocnemius & Soleus",
    "secondaryMuscles": [
      "Tibialis Posterior"
    ],
    "animationType": "squat",
    "cues": [
      "Place balls of feet on bottom edge of sled with heels free",
      "Press sled out to full ankle plantarflexion (point toes forward)",
      "Allow deep 2-second stretch at bottom with knees soft (never hyperextended)"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Leg Press Calf Extension",
      "url": "https://musclewiki.com/machine/calves/lever-calf-press",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Position feet on lower edge of leg press platform with heels hanging off.",
      "Push platform away by extending ankles.",
      "Lower under complete control into deep calf stretch."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 180,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "standing-calf-raise",
      "seated-calf-raise",
      "donkey-calf-raise"
    ]
  },
  {
    "id": "single-leg-dumbbell-calf-raise",
    "name": "Single-Leg Dumbbell Calf Raise",
    "split": "Lower Body",
    "subCategory": "Calves",
    "category": "Legs",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Bodyweight"
    ],
    "primaryMuscle": "Gastrocnemius & Soleus",
    "secondaryMuscles": [
      "Plantar Flexors"
    ],
    "animationType": "squat",
    "cues": [
      "Stand on ball of foot on edge of weight plate or step",
      "Hold dumbbell in hand on working side, free hand on wall for balance",
      "Elevate heel as high as possible, holding peak contraction for 1 count"
    ],
    "openSourceLink": {
      "label": "ExRx - Single Leg Calf Raise",
      "url": "https://exrx.net/WeightExercises/Gastrocnemius/DBSingleLegCalfRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand on ledge with ball of one foot holding dumbbell.",
      "Lower heel down into full stretch.",
      "Push up onto toes as high as possible and squeeze calf."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 25,
      "repsUnit": "per leg"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "standing-calf-raise",
      "seated-calf-raise",
      "donkey-calf-raise"
    ]
  },
  {
    "id": "hanging-leg-raise",
    "name": "Hanging Straight Leg Raise (Toes-to-Bar)",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Rectus Abdominis (Lower Fibers)",
    "secondaryMuscles": [
      "Iliopsoas (Hip Flexors)",
      "Forearm Grip"
    ],
    "animationType": "core",
    "cues": [
      "Initiate movement by tilting pelvis upward, not swinging from shoulders",
      "Raise legs straight until toes approach or touch the bar",
      "Slow 3-second lowering eccentric phase without swinging momentum"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Hanging Leg Raise",
      "url": "https://musclewiki.com/bodyweight/abdominals/hanging-leg-raise",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Hang from pull-up bar with overhand grip.",
      "Brace core and raise straight legs upward until parallel or toes touch bar.",
      "Lower slowly back to starting hang without kipping."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 12,
      "defaultWeight": 0,
      "repsUnit": "reps"
    },
    "loadType": "bodyweight_reps",
    "movementPattern": "anti_extension",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "hanging-knee-raise",
      "captain-chair-leg-raise",
      "ab-wheel-rollout",
      "cable-crunch"
    ]
  },
  {
    "id": "ab-wheel-rollout",
    "name": "Ab Wheel Rollout (From Knees / Feet)",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Barbell"
    ],
    "primaryMuscle": "Rectus Abdominis & Transverse Abdominis",
    "secondaryMuscles": [
      "Lats",
      "Shoulders",
      "Lower Back"
    ],
    "animationType": "core",
    "cues": [
      "Start on knees holding wheel directly beneath shoulders",
      "Maintain posterior pelvic tilt (hollow body) throughout rollout",
      "Pull back by contracting abs, not pulling with hips or arms"
    ],
    "openSourceLink": {
      "label": "ExRx - Rollout",
      "url": "https://exrx.net/WeightExercises/RectusAbdominis/BWWheelRollout",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Kneel on mat gripping ab wheel handles.",
      "Roll wheel forward extending body as far as possible while maintaining flat back.",
      "Contract abs hard to pull wheel back to starting position."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 6,
      "maxReps": 12,
      "defaultWeight": 0,
      "repsUnit": "reps"
    },
    "loadType": "bodyweight_reps",
    "movementPattern": "anti_extension",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "plank",
      "hollow-body-hold",
      "hanging-leg-raise",
      "deadbug"
    ]
  },
  {
    "id": "cable-pallof-press",
    "name": "Cable Pallof Press (Anti-Rotation)",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Internal & External Obliques",
    "secondaryMuscles": [
      "Transverse Abdominis",
      "Glutes"
    ],
    "animationType": "core",
    "cues": [
      "Stand perpendicular to cable at chest height holding D-handle with both hands",
      "Press handle straight out in front of chest resisting any torso twisting",
      "Hold extended position for 2 seconds before returning to sternum"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Cable Pallof Press",
      "url": "https://musclewiki.com/cables/abdominals/cable-pallof-press",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Set cable at sternum level and stand sideways with feet shoulder-width.",
      "Hold handle at center of chest.",
      "Press arms straight forward resisting rotation, hold for 2s, and return."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 25,
      "repsUnit": "per side"
    },
    "loadType": "weight_reps",
    "movementPattern": "anti_rotation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "side-plank",
      "russian-twists",
      "bird-dog",
      "cable-woodchoppers"
    ]
  },
  {
    "id": "decline-weighted-crunch",
    "name": "Decline Bench Weighted Crunch",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell",
      "Bodyweight"
    ],
    "primaryMuscle": "Rectus Abdominis (Upper Fibers)",
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "animationType": "core",
    "cues": [
      "Anchor ankles securely at top of decline bench",
      "Hold weight plate across chest or behind head",
      "Curl ribcage toward pelvis, exhaling fully at top peak contraction"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Weighted Crunch",
      "url": "https://wger.de/en/exercise/256/view/decline-crunch",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Sit on decline bench holding plate to chest.",
      "Lower torso back until shoulders almost touch bench.",
      "Flex abs to curl torso upward, pausing at top squeeze."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 25,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "anti_extension",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "cable-crunch",
      "hanging-knee-raise",
      "ab-wheel-rollout"
    ]
  },
  {
    "id": "kettlebell-swing",
    "name": "Hardstyle Kettlebell Swing (Russian)",
    "split": "Full Circuit",
    "subCategory": "Conditioning & Kettlebells",
    "category": "Full Body",
    "defaultEquipment": "Kettlebell",
    "supportedEquipment": [
      "Kettlebell",
      "Dumbbell"
    ],
    "primaryMuscle": "Posterior Chain (Glutes & Hamstrings)",
    "secondaryMuscles": [
      "Core",
      "Forearms",
      "Upper Back"
    ],
    "animationType": "swing",
    "cues": [
      "Hike kettlebell high between thighs like a football snap",
      "Snap hips forward violently with knees soft, locking glutes at top",
      "Bell floats to chest height via hip snap, not shoulder lifting"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Kettlebell Swing",
      "url": "https://musclewiki.com/kettlebells/glutes/kettlebell-swing",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Stand feet shoulder-width behind kettlebell.",
      "Hike bell back between legs, then snap hips forward into standing plank.",
      "Let bell swing back between thighs and repeat in rhythmic cadence."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 15,
      "minReps": 12,
      "maxReps": 20,
      "defaultWeight": 45,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-deadlift",
      "cable-pull-through",
      "medicine-ball-slam"
    ]
  },
  {
    "id": "kettlebell-clean-and-press",
    "name": "Kettlebell Clean and Press",
    "split": "Full Circuit",
    "subCategory": "Conditioning & Kettlebells",
    "category": "Full Body",
    "defaultEquipment": "Kettlebell",
    "supportedEquipment": [
      "Kettlebell",
      "Dumbbell"
    ],
    "primaryMuscle": "Deltoids, Upper Back & Glutes",
    "secondaryMuscles": [
      "Triceps",
      "Core"
    ],
    "animationType": "swing",
    "cues": [
      "Clean kettlebell into rack position against chest without banging forearm",
      "Pause in rack, brace core, and press vertically to lockout",
      "Lower smoothly back to rack, then drop into swing"
    ],
    "openSourceLink": {
      "label": "ExRx - Kettlebell Clean and Press",
      "url": "https://exrx.net/WeightExercises/Kettlebell/KBCleanPress",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Clean kettlebell from floor into chest rack position.",
      "Press kettlebell overhead to full arm lockout.",
      "Lower back to rack, drop to floor, and switch arms or repeat."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 35,
      "repsUnit": "per arm"
    },
    "loadType": "weight_reps",
    "movementPattern": "vertical_push",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "dumbbell-shoulder-press",
      "barbell-thruster",
      "barbell-overhead-press"
    ]
  },
  {
    "id": "kettlebell-turkish-get-up",
    "name": "Kettlebell Turkish Get-Up",
    "split": "Full Circuit",
    "subCategory": "Conditioning & Kettlebells",
    "category": "Full Body",
    "defaultEquipment": "Kettlebell",
    "supportedEquipment": [
      "Kettlebell",
      "Dumbbell"
    ],
    "primaryMuscle": "Rotator Cuff & Shoulder Stabilizers",
    "secondaryMuscles": [
      "Core",
      "Glutes",
      "Hips"
    ],
    "animationType": "swing",
    "cues": [
      "Keep eyes locked on the kettlebell throughout entire ascent and descent",
      "Maintain vertical arm punch at all times",
      "Roll to elbow, press to palm, bridge hips, sweep leg, stand tall"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Turkish Get Up",
      "url": "https://musclewiki.com/kettlebells/shoulders/turkish-get-up",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Lie on back holding kettlebell locked out above shoulder.",
      "Roll onto supporting elbow, then press up to palm.",
      "Bridge hips high, sweep opposite knee back underneath body, and stand up tall.",
      "Reverse all steps smoothly back to floor."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 3,
      "minReps": 2,
      "maxReps": 5,
      "defaultWeight": 25,
      "repsUnit": "per side"
    },
    "loadType": "weight_reps",
    "movementPattern": "anti_rotation",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "cable-pallof-press",
      "side-plank",
      "farmers-walk"
    ]
  },
  {
    "id": "farmers-walk",
    "name": "Heavy Dumbbell Farmer's Walk",
    "split": "Full Circuit",
    "subCategory": "Conditioning & Kettlebells",
    "category": "Full Body",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Kettlebell",
      "Trap Bar"
    ],
    "primaryMuscle": "Forearms & Grip Strength",
    "secondaryMuscles": [
      "Trapezius",
      "Core Stabilizers",
      "Glutes"
    ],
    "animationType": "deadlift",
    "cues": [
      "Pick up heavy dumbbells with flat back and deadlift form",
      "Stand tall with shoulders retracted and chest proud",
      "Walk with short, deliberate, rhythmic steps avoiding side-to-side wobble"
    ],
    "openSourceLink": {
      "label": "ExRx - Farmer's Walk",
      "url": "https://exrx.net/WeightExercises/Other/DBFarmersWalk",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Deadlift heavy dumbbells or kettlebells off the floor.",
      "Walk forward with upright posture for target distance or duration.",
      "Lower weights under control with neutral spine."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 40,
      "minReps": 30,
      "maxReps": 60,
      "defaultWeight": 60,
      "repsUnit": "seconds"
    },
    "loadType": "weight_reps",
    "movementPattern": "carry",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "trap-bar-farmers-carry",
      "suitcase-carry"
    ]
  },
  {
    "id": "barbell-thruster",
    "name": "Barbell Thruster (Conditioning)",
    "split": "Full Circuit",
    "subCategory": "Conditioning & Kettlebells",
    "category": "Full Body",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Dumbbell",
      "Kettlebell"
    ],
    "primaryMuscle": "Quadriceps, Deltoids & Glutes",
    "secondaryMuscles": [
      "Triceps",
      "Core"
    ],
    "animationType": "squat",
    "cues": [
      "Front squat with elbows high until hip crease breaks parallel",
      "Drive up explosively using hip extension momentum to propel bar upward",
      "Catch lockout overhead in single continuous fluid motion"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Barbell Thruster",
      "url": "https://musclewiki.com/barbell/full-body/barbell-thruster",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Hold barbell in front rack position across shoulders.",
      "Drop into deep front squat.",
      "Explode upward, transferring leg drive directly into an overhead press."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 75,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "vertical_push",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "kettlebell-clean-and-press",
      "barbell-overhead-press",
      "goblet-front-squat"
    ]
  },
  {
    "id": "standing-leg-curl",
    "name": "Standing Leg Curl",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine",
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Hamstrings (Unilateral Knee Flexion)",
    "secondaryMuscles": [
      "Gastrocnemius",
      "Gluteus Medius"
    ],
    "animationType": "squat",
    "cues": [
      "Anchor torso firmly against chest pad and brace core with hips square",
      "Curl single heel upward toward glute without hyperextending lower back",
      "Pause peak contraction for 1 second, then control eccentric descent for 3 seconds"
    ],
    "openSourceLink": {
      "label": "MuscleWiki - Standing Leg Curl",
      "url": "https://musclewiki.com/machine/male/hamstrings/standing-leg-curl",
      "source": "MuscleWiki"
    },
    "instructions": [
      "Stand on footplate facing machine with front pad against torso and roller pad positioned just below lower calf.",
      "Brace core and grip stability handles to keep pelvis aligned and prevent lumbar swinging.",
      "Flex single knee to curl roller upward toward glute under strict control.",
      "Squeeze hamstring peak contraction, then lower slowly through full range of motion.",
      "Perform all prescribed reps before repeating on the opposite leg."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 45,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "seated-leg-curl",
      "leg-curl",
      "nordic-hamstring-curl",
      "romanian-deadlift"
    ]
  },
  {
    "id": "push-ups",
    "name": "Bodyweight Push-Up",
    "split": "Push",
    "subCategory": "Chest",
    "category": "Chest",
    "loadType": "bodyweight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "bench-press",
      "dumbbell-flat-bench-press",
      "chest-dips",
      "deficit-push-ups"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Resistance Band"
    ],
    "primaryMuscle": "Pectoralis Major",
    "secondaryMuscles": [
      "Triceps Brachii",
      "Anterior Deltoid",
      "Rectus Abdominis"
    ],
    "animationType": "bench",
    "cues": [
      "Lock core into a rigid straight plank line",
      "Lower chest until 1 inch off the floor with elbows at 45 degrees",
      "Push the ground away through whole palms to full scapular protraction"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Push Up",
      "url": "https://wger.de/en/exercise/192/view/push-up",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Place hands slightly wider than shoulder width.",
      "Squeeze glutes and abs to prevent lower back sagging.",
      "Lower under control for 2 seconds, tap chest lightly, and drive back up."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 15,
      "minReps": 10,
      "maxReps": 25,
      "defaultWeight": 0,
      "repsUnit": "reps"
    }
  },
  {
    "id": "chest-dips",
    "name": "Chest Parallel Dips",
    "split": "Push",
    "subCategory": "Chest",
    "category": "Chest",
    "loadType": "bodyweight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "weighted-chest-dips",
      "bench-press",
      "decline-dumbbell-press",
      "push-ups"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Resistance Band"
    ],
    "primaryMuscle": "Lower Pectoralis Major",
    "secondaryMuscles": [
      "Triceps Brachii",
      "Anterior Deltoid"
    ],
    "animationType": "bench",
    "cues": [
      "Lean torso 30 degrees forward with flared elbows to isolate chest",
      "Descend until shoulders dip below elbow level",
      "Drive powerfully upward squeezing the lower pecs together"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Parallel Dips",
      "url": "https://wger.de/en/exercise/201/view/dips",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Grip parallel dip bars and support your bodyweight with locked arms.",
      "Cross ankles and tilt torso slightly forward.",
      "Lower smoothly to 90 degrees elbow flexion, then press back up."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 15,
      "defaultWeight": 0,
      "repsUnit": "reps"
    }
  },
  {
    "id": "diamond-push-ups",
    "name": "Diamond Push-Up",
    "split": "Push",
    "subCategory": "Arms",
    "category": "Arms",
    "loadType": "bodyweight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "close-grip-bench-press",
      "skull-crushers",
      "triceps-rope-pushdown",
      "tricep-bench-dips"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Triceps Brachii",
    "secondaryMuscles": [
      "Inner Pectoralis Major",
      "Anterior Deltoid"
    ],
    "animationType": "bench",
    "cues": [
      "Form a triangle or diamond with thumbs and index fingers under chest",
      "Keep elbows tracking along ribs throughout the movement",
      "Push through the palms and lock out triceps at the peak"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Close Grip Push Up",
      "url": "https://wger.de/en/exercise/205/view/diamond-push-up",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Set up in a standard push-up plank with hands touching.",
      "Lower chest until it touches the diamond.",
      "Lock out elbows strongly at top."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 8,
      "maxReps": 15,
      "defaultWeight": 0,
      "repsUnit": "reps"
    }
  },
  {
    "id": "deficit-push-ups",
    "name": "Deficit Push-Up (Deep Stretch)",
    "split": "Push",
    "subCategory": "Chest",
    "category": "Chest",
    "loadType": "bodyweight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "dumbbell-flat-bench-press",
      "bench-press",
      "chest-dips",
      "push-ups"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Dumbbell"
    ],
    "primaryMuscle": "Pectoralis Major",
    "secondaryMuscles": [
      "Anterior Deltoid",
      "Triceps Brachii"
    ],
    "animationType": "bench",
    "cues": [
      "Elevate hands on blocks or dumbbells for extra 2-3 inches of depth",
      "Feel the deep stretch across the chest fascia at the bottom",
      "Pause 1 second in the stretched position before pressing"
    ],
    "openSourceLink": {
      "label": "ExRx - Deficit Push Up",
      "url": "https://exrx.net/WeightExercises/PectoralSternal/BWPushup",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Place hands on 3-4 inch blocks or dumbbells.",
      "Lower chest past hand level to maximize stretch hypertrophy.",
      "Press explosively."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 8,
      "maxReps": 15,
      "defaultWeight": 0,
      "repsUnit": "reps"
    }
  },
  {
    "id": "pike-push-ups",
    "name": "Pike Push-Up (Shoulder Builder)",
    "split": "Push",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "loadType": "bodyweight_reps",
    "movementPattern": "vertical_push",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-overhead-press",
      "dumbbell-shoulder-press",
      "machine-shoulder-press"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Anterior Deltoid",
    "secondaryMuscles": [
      "Triceps Brachii",
      "Upper Trapezius",
      "Upper Chest"
    ],
    "animationType": "overhead",
    "cues": [
      "Pike hips high forming an inverted V with body",
      "Lower crown of head slightly in front of hands into a tripod position",
      "Push head back through arms at the top to complete vertical lock"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Pike Push Up",
      "url": "https://wger.de/en/exercise/221/view/pike-pushup",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Hike hips upward with straight legs.",
      "Control descent touching head forward of hands.",
      "Press back and finish with head between shoulders."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 6,
      "maxReps": 12,
      "defaultWeight": 0,
      "repsUnit": "reps"
    }
  },
  {
    "id": "pec-deck-machine-fly",
    "name": "Pec Deck Machine Fly",
    "split": "Push",
    "subCategory": "Chest",
    "category": "Chest",
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "cable-chest-crossover",
      "push-ups-or-cable-chest-fly",
      "dumbbell-flat-bench-press"
    ],
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine"
    ],
    "primaryMuscle": "Pectoralis Major",
    "secondaryMuscles": [
      "Anterior Deltoid"
    ],
    "animationType": "bench",
    "cues": [
      "Adjust seat so handles align with mid-chest",
      "Maintain a slight bend in elbows and lead with elbows closing",
      "Squeeze hard for 1 full second at peak contraction"
    ],
    "openSourceLink": {
      "label": "ExRx - Lever Pec Deck Fly",
      "url": "https://exrx.net/WeightExercises/PectoralSternal/LVPecDeckFly",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Keep back flat against the pad.",
      "Fly handles together across the chest.",
      "Control eccentric stretch without letting weights slam."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 90,
      "repsUnit": "reps"
    }
  },
  {
    "id": "neutral-grip-pull-ups",
    "name": "Neutral-Grip Pull-Up",
    "split": "Pull",
    "subCategory": "Back / Lats",
    "category": "Back",
    "loadType": "bodyweight_reps",
    "movementPattern": "vertical_pull",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "pull-up-or-lat-pulldown",
      "chin-ups",
      "lat-pulldown",
      "close-grip-lat-pulldown"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Resistance Band"
    ],
    "primaryMuscle": "Latissimus Dorsi",
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis",
      "Biceps Brachii",
      "Lower Trapezius"
    ],
    "animationType": "row",
    "cues": [
      "Grip parallel handles with palms facing each other",
      "Depress scapulae first before pulling with elbows",
      "Pull chest up to handle level without swinging or kipping"
    ],
    "openSourceLink": {
      "label": "ExRx - Parallel Grip Pull-Up",
      "url": "https://exrx.net/WeightExercises/LatissimusDorsi/BWUnderhandChinup",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Hang from parallel handles with straight arms.",
      "Drive elbows down and back.",
      "Control the lowering all the way back to a full dead hang."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 12,
      "defaultWeight": 0,
      "repsUnit": "reps"
    }
  },
  {
    "id": "lat-pullover-machine",
    "name": "Machine Lat Pullover (Dorian Style)",
    "split": "Pull",
    "subCategory": "Back / Lats",
    "category": "Back",
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "dumbbell-pullover",
      "straight-arm-lat-pushdown",
      "lat-pulldown"
    ],
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine"
    ],
    "primaryMuscle": "Latissimus Dorsi",
    "secondaryMuscles": [
      "Teres Major",
      "Posterior Deltoid",
      "Triceps Long Head"
    ],
    "animationType": "row",
    "cues": [
      "Seat position should place shoulder joints in line with machine axis",
      "Rest elbows on pads and initiate movement by driving elbows downward",
      "Full overhead stretch at top without arching lower back"
    ],
    "openSourceLink": {
      "label": "ExRx - Lever Pullover",
      "url": "https://exrx.net/WeightExercises/LatissimusDorsi/LVPullover",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Buckle into seat pad.",
      "Drive elbows through a 180-degree sweep down to your sides.",
      "Pause 1 second in contracted position."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 110,
      "repsUnit": "reps"
    }
  },
  {
    "id": "chest-supported-t-bar-row",
    "name": "Chest-Supported T-Bar Row",
    "split": "Pull",
    "subCategory": "Back / Lats",
    "category": "Back",
    "loadType": "weight_reps",
    "movementPattern": "horizontal_pull",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "chest-supported-row",
      "t-bar-row",
      "seated-cable-row",
      "barbell-bent-over-row"
    ],
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine",
      "Barbell"
    ],
    "primaryMuscle": "Rhomboids & Mid-Traps",
    "secondaryMuscles": [
      "Latissimus Dorsi",
      "Posterior Deltoid",
      "Biceps Brachii"
    ],
    "animationType": "row",
    "cues": [
      "Keep chest firmly glued to pad to completely eliminate lower back strain",
      "Pull handles back retracting shoulder blades completely",
      "Let shoulder blades spread wide at the bottom for massive stretch"
    ],
    "openSourceLink": {
      "label": "ExRx - Lever T-Bar Row",
      "url": "https://exrx.net/WeightExercises/BackGeneral/LVTBarRow",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Adjust chest pad height.",
      "Grip handles and row elbows toward your hips.",
      "Hold the contraction at the top."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 90,
      "repsUnit": "reps"
    }
  },
  {
    "id": "dumbbell-shrugs",
    "name": "Dumbbell Shrugs",
    "split": "Pull",
    "subCategory": "Back / Lats",
    "category": "Back",
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-shrugs",
      "barbell-deadlift",
      "farmers-walk"
    ],
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Trap Bar"
    ],
    "primaryMuscle": "Upper Trapezius",
    "secondaryMuscles": [
      "Levator Scapulae",
      "Forearms"
    ],
    "animationType": "deadlift",
    "cues": [
      "Elevate shoulders straight up toward ears (do NOT roll shoulders)",
      "Hold the top peak contraction for a solid 2-second squeeze",
      "Control the descent to feel a full weighted trap stretch at the bottom"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Dumbbell Shrug",
      "url": "https://wger.de/en/exercise/235/view/dumbbell-shrug",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Hold heavy dumbbells at your sides.",
      "Shrug straight up without bending elbows.",
      "Lower under complete control."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 65,
      "repsUnit": "reps"
    }
  },
  {
    "id": "barbell-shrugs",
    "name": "Barbell Shrugs",
    "split": "Pull",
    "subCategory": "Back / Lats",
    "category": "Back",
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "dumbbell-shrugs",
      "trap-bar-farmers-carry",
      "barbell-deadlift"
    ],
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Smith Machine"
    ],
    "primaryMuscle": "Upper Trapezius",
    "secondaryMuscles": [
      "Forearms",
      "Core"
    ],
    "animationType": "deadlift",
    "cues": [
      "Grip barbell shoulder-width in front of thighs",
      "Pull shoulders straight up vertically towards the ears",
      "Avoid rolling shoulders forward or backwards to protect rotator cuff"
    ],
    "openSourceLink": {
      "label": "ExRx - Barbell Shrug",
      "url": "https://exrx.net/WeightExercises/TrapeziusUpper/BBShrug",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Unrack barbell from rack at mid-thigh height.",
      "Elevate scapulae as high as possible.",
      "Pause 1 second, lower slowly."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 8,
      "maxReps": 15,
      "defaultWeight": 185,
      "repsUnit": "reps"
    }
  },
  {
    "id": "cable-face-pulls",
    "name": "Cable High-Rope Face Pulls",
    "split": "Pull",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "loadType": "weight_reps",
    "movementPattern": "horizontal_pull",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "face-pull-rear-delt-fly",
      "reverse-pec-deck-fly",
      "incline-dumbbell-rear-delt-raise"
    ],
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Rear Deltoid & External Rotators",
    "secondaryMuscles": [
      "Infraspinatus",
      "Teres Minor",
      "Mid/Lower Traps"
    ],
    "animationType": "row",
    "cues": [
      "Set pulley at eye level with rope attachment",
      "Pull rope towards bridge of nose while externally rotating hands back",
      "Finish with thumbs pointing behind you in a double-biceps flex"
    ],
    "openSourceLink": {
      "label": "ExRx - Cable Face Pull",
      "url": "https://exrx.net/WeightExercises/DeltoidPosterior/CBFacePull",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Grip rope ends with overhand or neutral grip.",
      "Step back into a split stance.",
      "Pull rope to face while driving elbows back and hands backward."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 15,
      "minReps": 12,
      "maxReps": 20,
      "defaultWeight": 45,
      "repsUnit": "reps"
    }
  },
  {
    "id": "dumbbell-front-raise",
    "name": "Dumbbell Front Raise",
    "split": "Push",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-overhead-press",
      "dumbbell-shoulder-press",
      "machine-shoulder-press"
    ],
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell",
      "Cable"
    ],
    "primaryMuscle": "Anterior Deltoid",
    "secondaryMuscles": [
      "Upper Pectoralis Major",
      "Serratus Anterior"
    ],
    "animationType": "overhead",
    "cues": [
      "Raise dumbbells with slight elbow bend up to shoulder height",
      "Do not lean back or swing the hips to initiate momentum",
      "Lower under steady 2-second eccentric control"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Front Raise",
      "url": "https://wger.de/en/exercise/251/view/front-raise",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Stand with dumbbells in front of thighs.",
      "Raise arms forward until parallel to floor.",
      "Pause briefly and lower."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 20,
      "repsUnit": "reps"
    }
  },
  {
    "id": "machine-shoulder-press",
    "name": "Machine Overhead Shoulder Press",
    "split": "Push",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "loadType": "weight_reps",
    "movementPattern": "vertical_push",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "dumbbell-shoulder-press",
      "barbell-overhead-press",
      "arnold-press"
    ],
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine"
    ],
    "primaryMuscle": "Anterior Deltoid",
    "secondaryMuscles": [
      "Lateral Deltoid",
      "Triceps Brachii",
      "Upper Trapezius"
    ],
    "animationType": "overhead",
    "cues": [
      "Adjust seat so handles start at mid-ear or chin level",
      "Press upward smoothly without banging weight stack at top",
      "Control lowering to a deep stretch without shrugging neck"
    ],
    "openSourceLink": {
      "label": "ExRx - Lever Shoulder Press",
      "url": "https://exrx.net/WeightExercises/DeltoidAnterior/LVShoulderPress",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Sit with back firmly against pad.",
      "Grip handles and press straight overhead.",
      "Lower back down under full control."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 100,
      "repsUnit": "reps"
    }
  },
  {
    "id": "cable-y-raise",
    "name": "Cable Y-Raise (Lower Trap & Delt)",
    "split": "Pull",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "dumbbell-lateral-raise",
      "cable-lateral-raise",
      "reverse-pec-deck-fly"
    ],
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Dumbbell"
    ],
    "primaryMuscle": "Lateral & Rear Deltoid",
    "secondaryMuscles": [
      "Lower Trapezius",
      "Serratus Anterior"
    ],
    "animationType": "overhead",
    "cues": [
      "Cross cables low and raise arms diagonally into a 30-degree Y overhead",
      "Line of pull matches scaption plane of shoulder blade perfectly",
      "Pause at peak and feel lower trap and side delt contraction"
    ],
    "openSourceLink": {
      "label": "ExRx - Cable Y-Raise",
      "url": "https://exrx.net/WeightExercises/DeltoidLateral/CBLateralRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Set pulleys to bottom with cross-body setup.",
      "Raise both arms diagonally upward forming a Y.",
      "Lower slowly."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 15,
      "minReps": 12,
      "maxReps": 20,
      "defaultWeight": 15,
      "repsUnit": "reps"
    }
  },
  {
    "id": "tricep-bench-dips",
    "name": "Tricep Bench Dips",
    "split": "Push",
    "subCategory": "Arms",
    "category": "Arms",
    "loadType": "bodyweight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "overhead-triceps-extension",
      "triceps-rope-pushdown",
      "close-grip-bench-press",
      "skull-crushers"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Triceps Brachii",
    "secondaryMuscles": [
      "Anterior Deltoid",
      "Chest"
    ],
    "animationType": "bench",
    "cues": [
      "Keep back skimming close to the edge of the bench",
      "Bend elbows to 90 degrees without letting shoulders roll forward",
      "Drive palms down into bench to achieve crisp tricep lockout"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Bench Dips",
      "url": "https://wger.de/en/exercise/271/view/bench-dips",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Sit on bench and place palms beside hips.",
      "Walk feet forward, lower hips down.",
      "Press through heels of hands to lockout."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 20,
      "defaultWeight": 0,
      "repsUnit": "reps"
    }
  },
  {
    "id": "cable-biceps-curl",
    "name": "Cable Straight-Bar Biceps Curl",
    "split": "Pull",
    "subCategory": "Arms",
    "category": "Arms",
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "ez-bar-biceps-curl",
      "hammer-curl",
      "incline-dumbbell-biceps-curl",
      "preacher-curl"
    ],
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable"
    ],
    "primaryMuscle": "Biceps Brachii",
    "secondaryMuscles": [
      "Brachialis",
      "Forearms"
    ],
    "animationType": "curl",
    "cues": [
      "Constant tension: weight stack stays suspended throughout entire set",
      "Keep elbows pinned at sides; do not let elbows sway forward",
      "Squeeze biceps hard at top of contraction"
    ],
    "openSourceLink": {
      "label": "ExRx - Cable Curl",
      "url": "https://exrx.net/WeightExercises/Biceps/CBCurl",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Attach bar to low pulley.",
      "Curl upward to chest level with pinned elbows.",
      "Lower with 3-second negative."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 50,
      "repsUnit": "reps"
    }
  },
  {
    "id": "reverse-barbell-curl",
    "name": "Reverse-Grip Barbell Curl",
    "split": "Pull",
    "subCategory": "Arms",
    "category": "Arms",
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "hammer-curl",
      "ez-bar-biceps-curl",
      "barbell-wrist-curls"
    ],
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "EZ-Bar",
      "Cable"
    ],
    "primaryMuscle": "Brachioradialis & Forearms",
    "secondaryMuscles": [
      "Brachialis",
      "Biceps Brachii"
    ],
    "animationType": "curl",
    "cues": [
      "Grip barbell overhand (pronated) with thumbs wrapped or over",
      "Keep wrists firm and locked in neutral alignment",
      "Curl upwards to 90 degrees feeling intense outer forearm burn"
    ],
    "openSourceLink": {
      "label": "ExRx - Reverse Barbell Curl",
      "url": "https://exrx.net/WeightExercises/Brachioradialis/BBReverseCurl",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand with pronated grip shoulder-width on bar.",
      "Curl bar up without flexing wrists backward.",
      "Lower slowly."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 45,
      "repsUnit": "reps"
    }
  },
  {
    "id": "barbell-wrist-curls",
    "name": "Barbell Wrist Curls (Forearm Flexors)",
    "split": "Pull",
    "subCategory": "Arms",
    "category": "Arms",
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "reverse-barbell-curl",
      "farmers-walk"
    ],
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Dumbbell"
    ],
    "primaryMuscle": "Forearm Flexors",
    "secondaryMuscles": [
      "Grip Strength"
    ],
    "animationType": "curl",
    "cues": [
      "Rest forearms flat on bench with wrists hanging over the edge",
      "Let bar roll down onto fingers for full forearm stretch",
      "Curl fingers closed and flex wrists upward as far as possible"
    ],
    "openSourceLink": {
      "label": "ExRx - Barbell Wrist Curl",
      "url": "https://exrx.net/WeightExercises/WristFlexors/BBWristCurl",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Kneel alongside bench with forearms resting across pad.",
      "Roll bar down into fingertips.",
      "Flex wrists up in smooth rhythm."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 15,
      "minReps": 12,
      "maxReps": 20,
      "defaultWeight": 45,
      "repsUnit": "reps"
    }
  },
  {
    "id": "nordic-hamstring-curl",
    "name": "Nordic Hamstring Curl",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "loadType": "bodyweight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "leg-curl",
      "seated-leg-curl",
      "standing-leg-curl",
      "romanian-deadlift"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Resistance Band"
    ],
    "primaryMuscle": "Hamstrings (Biceps Femoris / Semitendinosus)",
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Gastrocnemius",
      "Core"
    ],
    "animationType": "deadlift",
    "cues": [
      "Anchor ankles securely under bar or partner hands with knees padded",
      "Maintain hips in full extension; do not break at the waist",
      "Lower torso as slowly as possible resisting gravity with pure hamstring tension"
    ],
    "openSourceLink": {
      "label": "ExRx - Nordic Hamstring Curl",
      "url": "https://exrx.net/WeightExercises/Hamstrings/BWInverseLegCurl",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Kneel upright with ankles anchored firmly.",
      "Control fall forward for 3-5 seconds.",
      "Catch yourself with hands on floor and push lightly back up."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 6,
      "minReps": 4,
      "maxReps": 8,
      "defaultWeight": 0,
      "repsUnit": "reps"
    }
  },
  {
    "id": "bodyweight-squat",
    "name": "Bodyweight Air Squat",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "loadType": "bodyweight_reps",
    "movementPattern": "squat",
    "tierSuitability": [
      "Beginner"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "goblet-front-squat",
      "barbell-back-squat",
      "squat-or-leg-press",
      "kettlebell-goblet-squat"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "animationType": "squat",
    "cues": [
      "Foot placement slightly wider than shoulder width with toes angled 15 degrees",
      "Sit back and down until hip crease descends below top of kneecap",
      "Drive through mid-foot and heels to full upright hip extension"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Air Squat",
      "url": "https://wger.de/en/exercise/177/view/squats",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Stand upright with hands in front of chest.",
      "Descend into a deep parallel squat keeping chest tall.",
      "Stand back up smoothly."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 20,
      "minReps": 15,
      "maxReps": 30,
      "defaultWeight": 0,
      "repsUnit": "reps"
    }
  },
  {
    "id": "bodyweight-reverse-lunge",
    "name": "Bodyweight Reverse Lunge",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "loadType": "bodyweight_reps",
    "movementPattern": "lunge",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "reverse-lunge",
      "walking-dumbbell-lunges",
      "bulgarian-split-squat",
      "dumbbell-step-ups"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Calves"
    ],
    "animationType": "squat",
    "cues": [
      "Step back smoothly and descend until rear knee hovers 1 inch off floor",
      "Keep front knee tracking directly over second toe without caving inward",
      "Drive forcefully through front heel to step back to starting position"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Reverse Lunge",
      "url": "https://wger.de/en/exercise/310/view/reverse-lunge",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Stand tall with feet hip-width apart.",
      "Take a long step backward with right foot.",
      "Lower hips into two 90-degree knee angles, then return."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 16,
      "defaultWeight": 0,
      "repsUnit": "reps"
    }
  },
  {
    "id": "front-foot-elevated-split-squat",
    "name": "Front-Foot Elevated Split Squat",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "loadType": "weight_reps",
    "movementPattern": "lunge",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "bulgarian-split-squat",
      "reverse-lunge",
      "dumbbell-step-ups"
    ],
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell",
      "Bodyweight"
    ],
    "primaryMuscle": "Quadriceps (Vastus Medialis / Rectus Femoris)",
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Adductors",
      "Calves"
    ],
    "animationType": "squat",
    "cues": [
      "Elevate front foot on a 3-4 inch bumper plate or step",
      "Allows extreme hip flexion and massive quad stretch without hip pinch",
      "Drive knee over toes in full ankle dorsiflexion, then press back"
    ],
    "openSourceLink": {
      "label": "ExRx - Split Squat Elevated",
      "url": "https://exrx.net/WeightExercises/Quadriceps/DBSingleLegSplitSquat",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Place front foot onto small platform.",
      "Descend deeply until back knee touches floor lightly.",
      "Push through front midfoot to return."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 35,
      "repsUnit": "reps"
    }
  },
  {
    "id": "sissy-squat",
    "name": "Sissy Squat (Quad Teardrop Hypertrophy)",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "loadType": "bodyweight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "leg-extension",
      "hack-squat",
      "goblet-front-squat"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Dumbbell",
      "Machine"
    ],
    "primaryMuscle": "Quadriceps (Rectus Femoris Isolation)",
    "secondaryMuscles": [
      "Patellar Tendon Resilience",
      "Core"
    ],
    "animationType": "squat",
    "cues": [
      "Lean torso back in line with thighs as knees project forward over toes",
      "Rise up onto balls of feet as you descend into deep quad stretch",
      "Contract quads hard to pull torso back to upright lockout"
    ],
    "openSourceLink": {
      "label": "ExRx - Sissy Squat",
      "url": "https://exrx.net/WeightExercises/Quadriceps/BWSissySquat",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Hold onto a support bar for balance if needed.",
      "Incline torso backwards while sending knees forward.",
      "Reverse motion by straightening knees."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 8,
      "maxReps": 15,
      "defaultWeight": 0,
      "repsUnit": "reps"
    }
  },
  {
    "id": "dumbbell-hip-thrust",
    "name": "Dumbbell Glute Hip Thrust",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-hip-thrust",
      "romanian-deadlift",
      "cable-glute-kickback"
    ],
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell"
    ],
    "primaryMuscle": "Gluteus Maximus",
    "secondaryMuscles": [
      "Hamstrings",
      "Erector Spinae"
    ],
    "animationType": "deadlift",
    "cues": [
      "Rest heavy dumbbell across hip crease with hands securing the weight",
      "Upper back supported across a bench below shoulder blades",
      "Drive hips to full lockout parallel with floor and squeeze glutes for 1 second"
    ],
    "openSourceLink": {
      "label": "ExRx - Dumbbell Hip Thrust",
      "url": "https://exrx.net/WeightExercises/GluteusMaximus/BBHipThrust",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Position shoulder blades across bench with feet flat.",
      "Place dumbbell on hips.",
      "Drive hips upward, pausing at horizontal lockout."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 50,
      "repsUnit": "reps"
    }
  },
  {
    "id": "single-leg-romanian-deadlift",
    "name": "Single-Leg Dumbbell RDL",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "dumbbell-romanian-deadlift",
      "romanian-deadlift",
      "cable-pull-through"
    ],
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Kettlebell",
      "Barbell"
    ],
    "primaryMuscle": "Hamstrings & Gluteus Medius",
    "secondaryMuscles": [
      "Erector Spinae",
      "Ankle Stabilizers",
      "Core"
    ],
    "animationType": "deadlift",
    "cues": [
      "Plant working foot firmly and hinge at hip while sending opposite leg straight back",
      "Keep pelvis square to the floor; avoid flaring the back hip open",
      "Drive through front heel and squeeze glute to return to tall posture"
    ],
    "openSourceLink": {
      "label": "ExRx - Single Leg Deadlift",
      "url": "https://exrx.net/WeightExercises/Hamstrings/DBSingleLegDeadlift",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Hold dumbbell in opposite hand of working leg.",
      "Hinge forward until torso is parallel with floor.",
      "Return upright with balanced hip extension."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 35,
      "repsUnit": "reps"
    }
  },
  {
    "id": "donkey-calf-raise",
    "name": "Donkey / Machine Calf Extension",
    "split": "Lower Body",
    "subCategory": "Calves",
    "category": "Legs",
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "standing-calf-raise",
      "seated-calf-raise",
      "leg-press-calf-raise"
    ],
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine",
      "Bodyweight"
    ],
    "primaryMuscle": "Gastrocnemius",
    "secondaryMuscles": [
      "Soleus"
    ],
    "animationType": "squat",
    "cues": [
      "Bend forward 90 degrees at hips with weight resting on sacrum",
      "Extreme stretch at bottom: heels sink deep below platform level",
      "Explode onto balls of big toes and squeeze calves for 1 full second"
    ],
    "openSourceLink": {
      "label": "ExRx - Donkey Calf Raise",
      "url": "https://exrx.net/WeightExercises/Gastrocnemius/LVDonkeyCalfRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Position hips under pad with balls of feet on block.",
      "Lower heels as far as possible for stretch.",
      "Drive up to full peak plantar flexion."
    ],
    "defaultTarget": {
      "targetSets": 4,
      "targetReps": 15,
      "minReps": 12,
      "maxReps": 20,
      "defaultWeight": 140,
      "repsUnit": "reps"
    }
  },
  {
    "id": "deadbug",
    "name": "Deadbug Core Brace",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "loadType": "bodyweight_reps",
    "movementPattern": "anti_extension",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "hollow-body-hold",
      "plank",
      "hanging-knee-raise",
      "bird-dog"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Transverse Abdominis & Rectus Abdominis",
    "secondaryMuscles": [
      "Obliques",
      "Hip Flexors"
    ],
    "animationType": "core",
    "cues": [
      "Crush lower back completely flat into the floor (zero gap under lumbar)",
      "Extend opposite arm and leg simultaneously without letting ribs flare up",
      "Exhale forcefully as limbs extend to maintain deep intra-abdominal pressure"
    ],
    "openSourceLink": {
      "label": "ExRx - Deadbug",
      "url": "https://exrx.net/WeightExercises/RectusAbdominis/BWDeadBug",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Lie on back with arms pointing to ceiling and knees at 90 degrees.",
      "Slowly extend right arm and left leg toward floor.",
      "Return and alternate sides."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 16,
      "minReps": 12,
      "maxReps": 20,
      "defaultWeight": 0,
      "repsUnit": "reps"
    }
  },
  {
    "id": "bird-dog",
    "name": "Bird Dog Posterior Core Stabilizer",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "loadType": "bodyweight_reps",
    "movementPattern": "anti_rotation",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "deadbug",
      "cable-pallof-press",
      "side-plank"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Erector Spinae & Multifidus",
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Deltoids",
      "Transverse Abdominis"
    ],
    "animationType": "core",
    "cues": [
      "Start on hands and knees with hands directly under shoulders",
      "Reach arm forward and opposite heel back forming a straight horizontal line",
      "Keep hips level like you have a glass of water balanced on your lower back"
    ],
    "openSourceLink": {
      "label": "ExRx - Bird Dog",
      "url": "https://exrx.net/WeightExercises/ErectorSpinae/BWBirdDog",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Assume quadruped position.",
      "Reach right arm and left leg straight out.",
      "Hold 1 second, return and switch sides."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 14,
      "minReps": 10,
      "maxReps": 20,
      "defaultWeight": 0,
      "repsUnit": "reps"
    }
  },
  {
    "id": "hollow-body-hold",
    "name": "Hollow Body Gymnastic Hold",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "loadType": "bodyweight_timed",
    "movementPattern": "anti_extension",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "plank",
      "deadbug",
      "ab-wheel-rollout"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Rectus Abdominis & Transverse Abdominis",
    "secondaryMuscles": [
      "Hip Flexors",
      "Quadriceps",
      "Serratus Anterior"
    ],
    "animationType": "core",
    "cues": [
      "Press lower back into ground, tuck chin, and lift shoulder blades",
      "Extend legs straight forward 6 inches off ground with toes pointed",
      "Reach arms overhead by ears forming a rigid banana-shaped crescent"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Hollow Body Hold",
      "url": "https://wger.de/en/exercise/333/view/hollow-body",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Lie flat on back.",
      "Lift legs, head, and arms off floor while driving spine into ground.",
      "Hold for targeted countdown time."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 35,
      "minReps": 20,
      "maxReps": 60,
      "defaultWeight": 0,
      "repsUnit": "sec"
    }
  },
  {
    "id": "plank",
    "name": "Prone Isometric Core Plank",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "loadType": "bodyweight_timed",
    "movementPattern": "anti_extension",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "side-plank",
      "hollow-body-hold",
      "ab-wheel-rollout"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Rectus Abdominis & Transverse Abdominis",
    "secondaryMuscles": [
      "Shoulders",
      "Glutes",
      "Quadriceps"
    ],
    "animationType": "core",
    "cues": [
      "Rest on forearms directly under shoulders with fists unclenched",
      "Tuck pelvis into posterior tilt: squeeze glutes and brace like taking a punch",
      "Pull elbows toward toes isometrically to amplify abdominal recruitment"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Front Plank",
      "url": "https://wger.de/en/exercise/187/view/plank",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Set forearms parallel on floor.",
      "Lift onto toes in straight line from crown to heels.",
      "Breathe rhythmically while holding rigid tension."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 45,
      "minReps": 30,
      "maxReps": 90,
      "defaultWeight": 0,
      "repsUnit": "sec"
    }
  },
  {
    "id": "russian-twists",
    "name": "Russian Twists",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "loadType": "bodyweight_reps",
    "movementPattern": "anti_rotation",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "cable-woodchoppers",
      "cable-pallof-press",
      "decline-weighted-crunch"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Dumbbell",
      "Kettlebell"
    ],
    "primaryMuscle": "Internal & External Obliques",
    "secondaryMuscles": [
      "Rectus Abdominis",
      "Hip Flexors"
    ],
    "animationType": "core",
    "cues": [
      "Sit on floor with knees bent and torso leaned back 45 degrees",
      "Rotate ribcage and shoulders side-to-side (not just swinging arms)",
      "Tap fingertips lightly on floor outside hip on each repetition"
    ],
    "openSourceLink": {
      "label": "Open Workout DB - Russian Twist",
      "url": "https://wger.de/en/exercise/340/view/russian-twist",
      "source": "Wger (Open Source)"
    },
    "instructions": [
      "Elevate feet 2 inches off floor for added challenge.",
      "Rotate torso fully to left, tap floor, then rotate to right.",
      "Keep core braced continuously."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 20,
      "minReps": 16,
      "maxReps": 30,
      "defaultWeight": 0,
      "repsUnit": "reps"
    }
  },
  {
    "id": "cable-woodchoppers",
    "name": "Cable Diagonal Woodchoppers",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "loadType": "weight_reps",
    "movementPattern": "anti_rotation",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "cable-pallof-press",
      "russian-twists",
      "side-plank"
    ],
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Internal & External Obliques",
    "secondaryMuscles": [
      "Transverse Abdominis",
      "Shoulders",
      "Glutes"
    ],
    "animationType": "core",
    "cues": [
      "Set cable high and rotate diagonally across body down to opposite hip",
      "Pivot on back foot and drive rotation through hips and torso",
      "Control eccentric recoil slowly back to top"
    ],
    "openSourceLink": {
      "label": "ExRx - Cable Woodchopper",
      "url": "https://exrx.net/WeightExercises/Obliques/CBWoodchopper",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Grip handle with both hands high on left.",
      "Pull down and across to right knee.",
      "Control return and repeat on both sides."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 35,
      "repsUnit": "reps"
    }
  },
  {
    "id": "captain-chair-leg-raise",
    "name": "Captain's Chair Knee/Leg Raise",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "loadType": "bodyweight_reps",
    "movementPattern": "anti_extension",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "hanging-knee-raise",
      "hanging-leg-raise",
      "cable-crunch"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Rectus Abdominis & Ilopsoas",
    "secondaryMuscles": [
      "Obliques"
    ],
    "animationType": "core",
    "cues": [
      "Rest forearms on pads and press elbows down to elevate neck",
      "Curl pelvis upward toward chest, rounding lower back to engage abs",
      "Lower legs under complete control without swinging or kicking"
    ],
    "openSourceLink": {
      "label": "ExRx - Vertical Leg Raise",
      "url": "https://exrx.net/WeightExercises/RectusAbdominis/BWVerticalLegRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Mount captain chair station with back against pad.",
      "Raise knees or straight legs up to 90 degrees.",
      "Lower with 2-second tempo."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 18,
      "defaultWeight": 0,
      "repsUnit": "reps"
    }
  },
  {
    "id": "trap-bar-farmers-carry",
    "name": "Trap Bar Farmer's Carry",
    "split": "Full Circuit",
    "subCategory": "Conditioning & Kettlebells",
    "category": "Full Body",
    "loadType": "weight_reps",
    "movementPattern": "carry",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "farmers-walk",
      "suitcase-carry"
    ],
    "defaultEquipment": "Trap Bar",
    "supportedEquipment": [
      "Trap Bar",
      "Dumbbell"
    ],
    "primaryMuscle": "Trapezius & Grip Strength",
    "secondaryMuscles": [
      "Erector Spinae",
      "Obliques",
      "Glutes",
      "Calves"
    ],
    "animationType": "deadlift",
    "cues": [
      "Deadlift trap bar to lockout with proud chest and neutral spine",
      "Take short, deliberate heel-to-toe steps without wobbling",
      "Keep core braced and shoulders packed tight against ribs"
    ],
    "openSourceLink": {
      "label": "ExRx - Trap Bar Farmer Walk",
      "url": "https://exrx.net/WeightExercises/TrapeziusUpper/TrapBarCarry",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand inside loaded trap bar and lift to standing.",
      "Walk forward at steady measured pace for target seconds or distance.",
      "Hinge carefully to set load down."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 45,
      "minReps": 30,
      "maxReps": 60,
      "defaultWeight": 205,
      "repsUnit": "sec"
    }
  },
  {
    "id": "suitcase-carry",
    "name": "Single-Arm Dumbbell Suitcase Carry",
    "split": "Full Circuit",
    "subCategory": "Conditioning & Kettlebells",
    "category": "Full Body",
    "loadType": "weight_reps",
    "movementPattern": "carry",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "farmers-walk",
      "cable-pallof-press",
      "side-plank",
      "trap-bar-farmers-carry"
    ],
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Kettlebell"
    ],
    "primaryMuscle": "Contralateral Quadratus Lumborum & Obliques",
    "secondaryMuscles": [
      "Upper Traps",
      "Grip",
      "Glute Medius"
    ],
    "animationType": "deadlift",
    "cues": [
      "Hold a heavy weight in ONE hand only like a heavy piece of luggage",
      "Fight the lateral pull: keep shoulders and hips completely level",
      "Walk a straight tightrope line with smooth controlled steps"
    ],
    "openSourceLink": {
      "label": "ExRx - Suitcase Carry",
      "url": "https://exrx.net/WeightExercises/Obliques/DBFarmerWalk",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Pick up single heavy dumbbell.",
      "Brace core to keep posture completely vertical.",
      "Walk for 40 seconds, switch hands and repeat."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 40,
      "minReps": 30,
      "maxReps": 60,
      "defaultWeight": 55,
      "repsUnit": "sec"
    }
  },
  {
    "id": "kettlebell-goblet-squat",
    "name": "Kettlebell Goblet Squat",
    "split": "Full Circuit",
    "subCategory": "Conditioning & Kettlebells",
    "category": "Legs",
    "loadType": "weight_reps",
    "movementPattern": "squat",
    "tierSuitability": [
      "Beginner",
      "Intermediate"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "goblet-front-squat",
      "barbell-back-squat",
      "bodyweight-squat"
    ],
    "defaultEquipment": "Kettlebell",
    "supportedEquipment": [
      "Kettlebell",
      "Dumbbell"
    ],
    "primaryMuscle": "Quadriceps",
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Upper Back",
      "Core"
    ],
    "animationType": "squat",
    "cues": [
      "Cup kettlebell horns against sternum with elbows tucked inside knees",
      "Sink deep into hip socket keeping spine completely tall and proud",
      "Use elbows to gently push knees out at bottom of squat"
    ],
    "openSourceLink": {
      "label": "ExRx - Kettlebell Goblet Squat",
      "url": "https://exrx.net/WeightExercises/Quadriceps/KBGobletSquat",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Hold kettlebell at chest.",
      "Squat between your legs down to parallel or below.",
      "Drive through floor to stand."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 44,
      "repsUnit": "reps"
    }
  },
  {
    "id": "medicine-ball-slam",
    "name": "Explosive Medicine Ball Slam",
    "split": "Full Circuit",
    "subCategory": "Conditioning & Kettlebells",
    "category": "Full Body",
    "loadType": "weight_reps",
    "movementPattern": "anti_extension",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "kettlebell-swing",
      "barbell-thruster"
    ],
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Full Body Triple Extension & Core",
    "secondaryMuscles": [
      "Lats",
      "Shoulders",
      "Glutes"
    ],
    "animationType": "swing",
    "cues": [
      "Reach ball high overhead stretching tall onto balls of feet",
      "Hinge hips back and violently throw the ball into the floor using full body weight",
      "Catch the ball on the rebound in an athletic half-squat and repeat"
    ],
    "openSourceLink": {
      "label": "ExRx - Medicine Ball Slam",
      "url": "https://exrx.net/WeightExercises/Pliometrics/MBSlam",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand with feet shoulder-width holding non-bouncing slam ball.",
      "Extend overhead then slam down with maximum force.",
      "Catch and immediately cycle into next rep."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 15,
      "minReps": 10,
      "maxReps": 20,
      "defaultWeight": 20,
      "repsUnit": "reps"
    }
  },
  {
    "id": "svend-press",
    "name": "Svend Press (Plate Pinch Press)",
    "split": "Upper Body",
    "subCategory": "Chest",
    "category": "Chest",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Bodyweight"
    ],
    "primaryMuscle": "Pectoralis Major (Sternal & Inner Fibers)",
    "secondaryMuscles": [
      "Anterior Deltoid",
      "Biceps Brachii"
    ],
    "animationType": "bench",
    "cues": [
      "Pinch two light weight plates or dumbbells together aggressively between flat palms",
      "Press straight outward in front of sternum without interlocking elbows",
      "Squeeze pectorals for 2 full seconds at full reach before retracting"
    ],
    "openSourceLink": {
      "label": "ExRx - Plate Pinch Press",
      "url": "https://exrx.net/WeightExercises/PectoralSternal/PlatePress",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand tall with core braced and shoulder blades retracted.",
      "Hold weight plates pressed together flat between open palms at sternum height.",
      "Extend arms straight forward, maintaining relentless inward pressing force.",
      "Return under control to chest level while keeping maximum tension."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 15,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "cable-chest-crossover",
      "pec-deck-machine-fly",
      "push-ups"
    ]
  },
  {
    "id": "incline-cable-fly",
    "name": "Incline Cable Fly (Low-to-High)",
    "split": "Upper Body",
    "subCategory": "Chest",
    "category": "Chest",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Pectoralis Major (Clavicular Head)",
    "secondaryMuscles": [
      "Anterior Deltoid",
      "Biceps Brachii (Short Head)"
    ],
    "animationType": "bench",
    "cues": [
      "Set pulleys low and adopt a staggered athletic stance with slight forward lean",
      "Sweep hands upward and inward in an arc converging at eye level",
      "Maintain a soft bend at the elbows throughout to protect biceps tendons"
    ],
    "openSourceLink": {
      "label": "ExRx - Cable Low Incline Fly",
      "url": "https://exrx.net/WeightExercises/PectoralClavicular/CBInclineFly",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Position an incline bench or stand equidistant between low cable pulleys.",
      "Grip D-handles with palms facing forward and slightly upward.",
      "Contract upper chest to sweep cables upward toward nose height.",
      "Lower under eccentric control for 3 seconds to a deep pectoral stretch."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 25,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "incline-dumbbell-press",
      "cable-chest-crossover",
      "incline-barbell-bench-press"
    ]
  },
  {
    "id": "low-incline-dumbbell-bench-press",
    "name": "Low-Incline Dumbbell Bench Press (15°-30°)",
    "split": "Upper Body",
    "subCategory": "Chest",
    "category": "Chest",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell",
      "Machine"
    ],
    "primaryMuscle": "Pectoralis Major (Clavicular & Sternal)",
    "secondaryMuscles": [
      "Anterior Deltoid",
      "Triceps Brachii"
    ],
    "animationType": "bench",
    "cues": [
      "Set incline to notch 1 or 2 (15° to 30°) to maximize upper chest over front deltoids",
      "Pack shoulder blades hard into pad with active foot drive",
      "Press in a gentle inward arc without banging dumbbells together at top"
    ],
    "openSourceLink": {
      "label": "ExRx - Incline Dumbbell Bench Press",
      "url": "https://exrx.net/WeightExercises/PectoralClavicular/DBInclineBenchPress",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Lie back on a low-incline bench holding dumbbells with neutral/semi-pronated grip.",
      "Retract scapulae and establish a firm arch with heels flat.",
      "Lower dumbbells until elbows form a 90° angle touching deep pectoral stretch.",
      "Press upward smoothly to full arm extension."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 60,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "incline-dumbbell-press",
      "incline-barbell-bench-press",
      "dumbbell-flat-bench-press"
    ]
  },
  {
    "id": "dumbbell-floor-press",
    "name": "Dumbbell Floor Press",
    "split": "Upper Body",
    "subCategory": "Chest",
    "category": "Chest",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell",
      "Kettlebell"
    ],
    "primaryMuscle": "Pectoralis Major & Triceps Brachii",
    "secondaryMuscles": [
      "Anterior Deltoid"
    ],
    "animationType": "bench",
    "cues": [
      "Lie flat on floor with knees bent and feet flat on ground",
      "Lower dumbbells until upper arms gently make contact with floor at 45° angle",
      "Pause for 1 second on floor to eliminate stretch reflex before pressing"
    ],
    "openSourceLink": {
      "label": "ExRx - Dumbbell Floor Press",
      "url": "https://exrx.net/WeightExercises/PectoralSternal/DBFloorPress",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Sit on floor with dumbbells on thighs; roll back to supine position with bent knees.",
      "Press dumbbells up to full extension over lower chest.",
      "Lower under control until triceps touch the floor gently.",
      "Pause momentarily, then explode upward to lockout."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 65,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "bench-press",
      "dumbbell-flat-bench-press",
      "close-grip-bench-press"
    ]
  },
  {
    "id": "landmine-chest-press",
    "name": "Half-Kneeling Landmine Chest Press",
    "split": "Upper Body",
    "subCategory": "Chest",
    "category": "Chest",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell"
    ],
    "primaryMuscle": "Upper Pectoralis & Serratus Anterior",
    "secondaryMuscles": [
      "Anterior Deltoid",
      "Triceps Brachii",
      "Core Stabilizers"
    ],
    "animationType": "overhead",
    "cues": [
      "Kneel on the knee on the pressing side with front foot planted firmly",
      "Hold barbell sleeve at collarbone height with elbow tucked at 45°",
      "Press barbell upward and forward along its natural diagonal arc with scapular protraction"
    ],
    "openSourceLink": {
      "label": "ExRx - Landmine Press",
      "url": "https://exrx.net/WeightExercises/PectoralClavicular/LMPress",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Anchor barbell in a landmine swivel or secure corner.",
      "Assume half-kneeling stance holding end of barbell with one hand at shoulder.",
      "Press diagonally upward, reaching fully at the top to engage serratus.",
      "Lower with a 3-second tempo back to chest."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 45,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "incline-dumbbell-press",
      "dumbbell-shoulder-press",
      "cable-chest-crossover"
    ]
  },
  {
    "id": "meadows-row",
    "name": "Meadows Row (Landmine Lat Row)",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell"
    ],
    "primaryMuscle": "Latissimus Dorsi & Rhomboids",
    "secondaryMuscles": [
      "Teres Major",
      "Posterior Deltoid",
      "Biceps Brachii",
      "Forearms"
    ],
    "animationType": "row",
    "cues": [
      "Stand perpendicular to barbell collar with staggered athletic stance",
      "Grip thick sleeve overhand with wrist strap for maximum lat connection",
      "Drive elbow backward toward hip pocket while keeping torso locked at 45°"
    ],
    "openSourceLink": {
      "label": "ExRx - One Arm Landmine Row",
      "url": "https://exrx.net/WeightExercises/BackGeneral/LVOneArmBentOverRow",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand perpendicular to the loaded end of a landmine barbell.",
      "Hinge hips back with front elbow braced on front thigh.",
      "Grip the barbell sleeve with an overhand pronated grip.",
      "Pull elbow aggressively toward hip, feeling a massive contraction in lower lat.",
      "Lower under control to a deep stretch at bottom."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 50,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_pull",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "single-arm-dumbbell-row",
      "t-bar-row",
      "chest-supported-row"
    ]
  },
  {
    "id": "seal-row",
    "name": "Seal Row (Prone Bench Barbell Row)",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Dumbbell"
    ],
    "primaryMuscle": "Middle & Lower Trapezius, Rhomboids",
    "secondaryMuscles": [
      "Latissimus Dorsi",
      "Posterior Deltoids",
      "Biceps"
    ],
    "animationType": "row",
    "cues": [
      "Lie face down on an elevated flat bench with arms hanging fully straight",
      "Eliminate all momentum and lower back arching; isolate upper back pull",
      "Pull barbell up until it touches the underside of bench, pinching scapulae"
    ],
    "openSourceLink": {
      "label": "ExRx - Barbell Cambered Row",
      "url": "https://exrx.net/WeightExercises/BackGeneral/BBCamberedRow",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Set an elevated flat bench on blocks high enough for full arm extension.",
      "Lie face down with barbell resting directly beneath your chest.",
      "Grip bar slightly wider than shoulder width.",
      "Row bar vertically upward until it contacts the bench underside.",
      "Lower with controlled tempo to complete dead-hang stretch."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 95,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_pull",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "chest-supported-row",
      "barbell-bent-over-row",
      "chest-supported-t-bar-row"
    ]
  },
  {
    "id": "single-arm-cable-lat-pulldown",
    "name": "Single-Arm Half-Kneeling Lat Pulldown",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Latissimus Dorsi (Iliac Division)",
    "secondaryMuscles": [
      "Teres Major",
      "Biceps Brachii",
      "Brachialis"
    ],
    "animationType": "row",
    "cues": [
      "Kneel opposite the pulling side with torso upright and core braced",
      "Start with arm reaching high in full stretch with neutral or pronated wrist",
      "Pull elbow tight down toward your hip bone, slightly side-crunching into lat"
    ],
    "openSourceLink": {
      "label": "ExRx - Cable One Arm Lat Pulldown",
      "url": "https://exrx.net/WeightExercises/LatissimusDorsi/CBOneArmPulldown",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Set high cable pulley with single D-handle attachment.",
      "Take a half-kneeling stance facing the cable column.",
      "Grip handle, rotate palm slightly inward, and pull elbow straight down to the hip.",
      "Hold peak contraction for 1 second, then return to full overhead stretch."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 40,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "vertical_pull",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "lat-pulldown",
      "close-grip-lat-pulldown",
      "pull-up-or-lat-pulldown"
    ]
  },
  {
    "id": "pendlay-row",
    "name": "Pendlay Row (Strict Dead-Stop Row)",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell"
    ],
    "primaryMuscle": "Latissimus Dorsi, Rhomboids, Trapezius",
    "secondaryMuscles": [
      "Erector Spinae",
      "Posterior Deltoids",
      "Biceps",
      "Hamstrings"
    ],
    "animationType": "row",
    "cues": [
      "Torso stays parallel to floor (horizontal) throughout the entire repetition",
      "Reset barbell completely to dead-stop on floor between every single rep",
      "Explode bar up to lower ribcage using strict back drive without standing up"
    ],
    "openSourceLink": {
      "label": "ExRx - Pendlay Bent Over Row",
      "url": "https://exrx.net/WeightExercises/BackGeneral/BBRow",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand with feet shoulder-width, bar over mid-foot as in a deadlift.",
      "Hinge hips back until back is completely horizontal and parallel to floor.",
      "Grip barbell overhand slightly wider than shoulder width.",
      "Explosively row bar to touch upper abdomen / lower sternum.",
      "Return bar to floor dead-stop, pause, and repeat."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 6,
      "minReps": 5,
      "maxReps": 8,
      "defaultWeight": 135,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_pull",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-bent-over-row",
      "seal-row",
      "t-bar-row"
    ]
  },
  {
    "id": "kroc-row",
    "name": "Kroc Row (High-Rep Heavy Dumbbell Row)",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Kettlebell"
    ],
    "primaryMuscle": "Upper Back & Latissimus Dorsi",
    "secondaryMuscles": [
      "Forearms / Grip Strength",
      "Biceps Brachii",
      "Erector Spinae"
    ],
    "animationType": "row",
    "cues": [
      "Use heavy dumbbell with strategic controlled body English at peak reps",
      "Full hang stretch at bottom opening lat and shoulder blade",
      "Drive elbow high and back behind ribs with explosive power"
    ],
    "openSourceLink": {
      "label": "ExRx - One Arm Dumbbell Row",
      "url": "https://exrx.net/WeightExercises/BackGeneral/DBBentOverRow",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Brace opposite hand and foot on bench or dumbbell rack in wide stable base.",
      "Grip heavy dumbbell without straps to build crushing grip endurance.",
      "Allow dumbbell to stretch down toward floor.",
      "Row violently upward to ribcage for sets of 15 to 25 repetitions."
    ],
    "defaultTarget": {
      "targetSets": 2,
      "targetReps": 15,
      "minReps": 12,
      "maxReps": 20,
      "defaultWeight": 85,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_pull",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "single-arm-dumbbell-row",
      "meadows-row",
      "chest-supported-row"
    ]
  },
  {
    "id": "rack-pull",
    "name": "Rack Pull (Above Knee Block Pull)",
    "split": "Upper Body",
    "subCategory": "Back / Lats",
    "category": "Back",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Trap Bar"
    ],
    "primaryMuscle": "Upper Trapezius, Rhomboids, Erector Spinae",
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Forearms / Grip"
    ],
    "animationType": "deadlift",
    "cues": [
      "Set safety pins or blocks so bar sits just below or right at kneecap",
      "Pack lats, wedge hips close to bar, and brace core into lifting belt",
      "Drive hips forward into bar with aggressive glute and upper back lockout"
    ],
    "openSourceLink": {
      "label": "ExRx - Barbell Rack Pull",
      "url": "https://exrx.net/WeightExercises/ErectorSpinae/BBRackPull",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Set barbell on power rack safety pins or wood blocks at knee level.",
      "Take conventional deadlift stance with double-overhand or hook grip.",
      "Pull slack out of bar, engage thoracic spine, and drive floor away.",
      "Lock out hips tall without hyperextending lower back."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 6,
      "minReps": 4,
      "maxReps": 8,
      "defaultWeight": 225,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-deadlift",
      "barbell-shrugs",
      "good-mornings"
    ]
  },
  {
    "id": "behind-the-neck-press",
    "name": "Behind-the-Neck Overhead Press",
    "split": "Upper Body",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Smith Machine"
    ],
    "primaryMuscle": "Lateral & Posterior Deltoid",
    "secondaryMuscles": [
      "Upper Trapezius",
      "Triceps Brachii",
      "Rotator Cuff"
    ],
    "animationType": "overhead",
    "cues": [
      "Take a snatch or wide grip to reduce shoulder rotational strain",
      "Lower bar slowly under control only to ear or hairline level (not upper traps)",
      "Press vertically upward locking out directly over base of skull"
    ],
    "openSourceLink": {
      "label": "ExRx - Behind Neck Press",
      "url": "https://exrx.net/WeightExercises/DeltoidAnterior/BBBehindNeckPress",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Sit on an upright bench or stand with bar racked at upper chest height.",
      "Unrack bar overhead with wide grip and establish solid brace.",
      "Lower bar behind head slowly to upper ear level.",
      "Press upward smoothly to full lockout."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 75,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "vertical_push",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-overhead-press",
      "dumbbell-shoulder-press",
      "machine-shoulder-press"
    ]
  },
  {
    "id": "egyptian-cable-lateral-raise",
    "name": "Leaning Egyptian Cable Lateral Raise",
    "split": "Upper Body",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Lateral Deltoid (Lengthened Range)",
    "secondaryMuscles": [
      "Supraspinatus",
      "Upper Trapezius"
    ],
    "animationType": "overhead",
    "cues": [
      "Hold cable tower upright with one arm and lean torso away at ~20-30° angle",
      "Run cable behind or in front of body from lowest pulley position",
      "Raise arm along scapular plane to parallel with floor, feeling constant tension"
    ],
    "openSourceLink": {
      "label": "ExRx - Cable One Arm Lateral Raise",
      "url": "https://exrx.net/WeightExercises/DeltoidLateral/CBOneArmLateralRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Set cable pulley to lowest notch with single handle attachment.",
      "Grip upright tower with free arm and lean outward into a solid diagonal lean.",
      "Raise cable out to the side until hand reaches shoulder level.",
      "Lower with a 3-second negative to a full stretch across the hip."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 15,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "cable-lateral-raise",
      "dumbbell-lateral-raise",
      "cable-y-raise"
    ]
  },
  {
    "id": "lu-raises",
    "name": "Lu Raises (Full-ROM Overhead Lateral Raise)",
    "split": "Upper Body",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Cable"
    ],
    "primaryMuscle": "Lateral Deltoid & Serratus Anterior",
    "secondaryMuscles": [
      "Upper & Lower Trapezius",
      "Rotator Cuff"
    ],
    "animationType": "overhead",
    "cues": [
      "Hold light dumbbells at sides with thumbs pointing slightly forward",
      "Raise dumbbells out and all the way overhead until plates touch overhead",
      "Keep ribs locked down and core braced without arching lower back"
    ],
    "openSourceLink": {
      "label": "ExRx - Full ROM Lateral Raise",
      "url": "https://exrx.net/WeightExercises/DeltoidLateral/DBLateralRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand tall holding light dumbbells (5–15 lbs) at outer thighs.",
      "Raise arms out to sides in a smooth continuous arc past parallel all the way overhead.",
      "Gently touch dumbbell bells together overhead at full upward scapular rotation.",
      "Lower under control over 3 seconds back to thighs."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 15,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "dumbbell-lateral-raise",
      "cable-lateral-raise",
      "cable-y-raise"
    ]
  },
  {
    "id": "prone-incline-y-raise",
    "name": "Prone Incline Dumbbell Y-Raise",
    "split": "Upper Body",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Cable"
    ],
    "primaryMuscle": "Lower Trapezius & Posterior Deltoid",
    "secondaryMuscles": [
      "Rhomboids",
      "Infraspinatus",
      "Supraspinatus"
    ],
    "animationType": "overhead",
    "cues": [
      "Lie face down on a 30° to 45° incline bench with chest firmly supported",
      "Raise arms in a wide 'Y' shape (thumbs pointing up at 45° angle)",
      "Initiate by depressing and retracting scapulae, pausing 1 second at top"
    ],
    "openSourceLink": {
      "label": "ExRx - Incline Prone Y Raise",
      "url": "https://exrx.net/WeightExercises/BackGeneral/DBInclineYRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Set an incline bench to 30–45 degrees and lie face down.",
      "Hold light dumbbells with thumbs pointing toward ceiling.",
      "Raise arms outward and upward into a 'Y' formation.",
      "Pinch lower shoulder blades hard at peak, then lower slowly."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 10,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "face-pull-rear-delt-fly",
      "incline-dumbbell-rear-delt-raise",
      "cable-y-raise"
    ]
  },
  {
    "id": "trap-bar-shrug",
    "name": "Trap Bar Neutral-Grip Shrug",
    "split": "Upper Body",
    "subCategory": "Shoulders",
    "category": "Shoulders",
    "defaultEquipment": "Trap Bar",
    "supportedEquipment": [
      "Trap Bar",
      "Dumbbell",
      "Barbell"
    ],
    "primaryMuscle": "Upper Trapezius",
    "secondaryMuscles": [
      "Levator Scapulae",
      "Forearms / Grip"
    ],
    "animationType": "deadlift",
    "cues": [
      "Stand inside trap bar with neutral palms-in grip and tall posture",
      "Elevate shoulders straight up toward ears without rolling shoulders back",
      "Hold peak contraction for a solid 2-second pause before lowering"
    ],
    "openSourceLink": {
      "label": "ExRx - Trap Bar Shrug",
      "url": "https://exrx.net/WeightExercises/TrapeziusUpper/TBShrug",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand centered inside the trap bar with feet hip-width.",
      "Deadlift the bar to standing lockout with neutral spine.",
      "Shrug shoulders straight up toward earlobes, squeezing traps forcefully.",
      "Lower under control over 2 seconds to full stretch."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 155,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-shrugs",
      "dumbbell-shrugs",
      "rack-pull"
    ]
  },
  {
    "id": "spider-curl",
    "name": "Spider Curl (Prone Incline Bicep Curl)",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell",
      "Cable"
    ],
    "primaryMuscle": "Biceps Brachii (Short Inner Head)",
    "secondaryMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "animationType": "curl",
    "cues": [
      "Lie face down on a 45° incline bench with chest pinned and arms hanging straight down",
      "Keep upper arms locked vertical perpendicular to floor without swinging backward",
      "Curl dumbbells up toward forehead, squeezing peak contraction for 1 second"
    ],
    "openSourceLink": {
      "label": "ExRx - Spider Curl",
      "url": "https://exrx.net/WeightExercises/Biceps/DBSpiderCurl",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Position yourself chest-down on a 45-degree incline bench.",
      "Let dumbbells hang straight down toward the floor with supinated palms.",
      "Curl dumbbells upward while keeping elbows completely stationary.",
      "Squeeze biceps hard at top contraction, then lower slowly to dead hang."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 25,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "preacher-curl",
      "concentration-curl",
      "ez-bar-biceps-curl"
    ]
  },
  {
    "id": "bayesian-cable-curl",
    "name": "Bayesian Cable Curl (Behind-the-Back Cable Curl)",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Biceps Brachii (Long Outer Head - Lengthened Range)",
    "secondaryMuscles": [
      "Brachialis",
      "Forearm Flexors"
    ],
    "animationType": "curl",
    "cues": [
      "Face away from low cable pulley, stepping forward until arm is drawn back behind torso",
      "Keep elbow behind hips to place long head of biceps under deep stretch",
      "Curl forward and up without letting shoulder shift forward"
    ],
    "openSourceLink": {
      "label": "ExRx - Cable Behind Back Curl",
      "url": "https://exrx.net/WeightExercises/Biceps/CBBehindBackCurl",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Attach single handle to lowest pulley.",
      "Face away from machine, grasp handle, and take 2 steps forward into staggered stance.",
      "Allow cable to pull arm into extension behind torso.",
      "Curl forward through full range of motion, pausing at peak contraction."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 20,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "incline-dumbbell-biceps-curl",
      "cable-biceps-curl",
      "ez-bar-biceps-curl"
    ]
  },
  {
    "id": "zottman-curl",
    "name": "Zottman Curl (Supinated Up, Pronated Down)",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell"
    ],
    "primaryMuscle": "Biceps Brachii & Brachioradialis",
    "secondaryMuscles": [
      "Brachialis",
      "Forearm Extensors"
    ],
    "animationType": "curl",
    "cues": [
      "Curl upward with palms facing up (supinated) to overload biceps",
      "Rotate wrists at the top so palms face down (pronated)",
      "Lower under slow 3-second control with overhand grip to overload brachioradialis"
    ],
    "openSourceLink": {
      "label": "ExRx - Zottman Curl",
      "url": "https://exrx.net/WeightExercises/Biceps/DBZottmanCurl",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand tall holding dumbbells at your sides.",
      "Curl dumbbells upward with supinated palms up to shoulder height.",
      "At top of curl, rotate wrists 180 degrees until palms face downward.",
      "Lower dumbbells slowly with overhand grip back to thighs.",
      "Rotate palms back to supinated and repeat."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 25,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "hammer-curl",
      "reverse-barbell-curl",
      "ez-bar-biceps-curl"
    ]
  },
  {
    "id": "cross-body-hammer-curl",
    "name": "Cross-Body Pinwheel Hammer Curl",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Kettlebell"
    ],
    "primaryMuscle": "Brachialis & Brachioradialis",
    "secondaryMuscles": [
      "Biceps Brachii",
      "Forearms"
    ],
    "animationType": "curl",
    "cues": [
      "Keep palms facing inward (neutral grip) throughout entire movement",
      "Curl dumbbell diagonally across chest toward opposite collarbone",
      "Squeeze outer arm / brachialis hard at top without swinging torso"
    ],
    "openSourceLink": {
      "label": "ExRx - Cross Body Hammer Curl",
      "url": "https://exrx.net/WeightExercises/Brachioradialis/DBCrossBodyHammerCurl",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand tall with dumbbells hanging at sides in neutral grip.",
      "Curl one dumbbell across your body toward opposite shoulder.",
      "Pause for 1 second at top squeeze.",
      "Lower under control and repeat on opposite arm."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 30,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "hammer-curl",
      "zottman-curl",
      "reverse-barbell-curl"
    ]
  },
  {
    "id": "jm-press",
    "name": "JM Press (Hybrid Close-Grip Bench & Skull Crusher)",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Smith Machine",
      "Dumbbell"
    ],
    "primaryMuscle": "Triceps Brachii (Medial & Lateral Heads)",
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Pectoralis Major"
    ],
    "animationType": "bench",
    "cues": [
      "Grip bar with hands shoulder-width apart as in a close-grip bench press",
      "Lower bar straight down toward clavicle/throat while folding elbows forward and down",
      "Explode upward through tricep extension back over lower chest"
    ],
    "openSourceLink": {
      "label": "ExRx - Barbell JM Press",
      "url": "https://exrx.net/WeightExercises/Triceps/BBJMPress",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Lie flat on bench, unrack bar directly over shoulders with close overhand grip.",
      "Allow elbows to drift forward as bar descends toward neck/upper chest junction.",
      "When forearms make deep acute angle with biceps, pause briefly.",
      "Extend elbows forcefully upward to complete lockout."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 95,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "horizontal_push",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "close-grip-bench-press",
      "skull-crushers",
      "triceps-rope-pushdown"
    ]
  },
  {
    "id": "tate-press",
    "name": "Tate Press (Dumbbell Elbows-Out Tricep Extension)",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell"
    ],
    "primaryMuscle": "Triceps Brachii (Lateral Head)",
    "secondaryMuscles": [
      "Anconeus",
      "Pectoralis Major (Inner)"
    ],
    "animationType": "bench",
    "cues": [
      "Lie on flat bench with dumbbells held touching above chest with palms facing feet",
      "Flare elbows outward and lower inner dumbbell heads to gently touch chest",
      "Extend triceps to lock dumbbells back upward without shifting shoulders"
    ],
    "openSourceLink": {
      "label": "ExRx - Dumbbell Tate Press",
      "url": "https://exrx.net/WeightExercises/Triceps/DBTatePress",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Lie flat on a bench holding dumbbells above chest with elbows pointed out.",
      "Flex elbows inward to lower the bells until they touch lower chest.",
      "Drive outward and up using pure tricep extension to lockout.",
      "Squeeze lateral triceps hard at top."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 30,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "skull-crushers",
      "triceps-rope-pushdown",
      "overhead-triceps-extension"
    ]
  },
  {
    "id": "cable-tricep-kickback",
    "name": "Single-Arm Cable Triceps Kickback",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Cable",
    "supportedEquipment": [
      "Cable",
      "Dumbbell"
    ],
    "primaryMuscle": "Triceps Brachii (Long Head Shortened Range)",
    "secondaryMuscles": [
      "Posterior Deltoid",
      "Anconeus"
    ],
    "animationType": "row",
    "cues": [
      "Set cable at elbow height, hinge forward at 45°, and pin upper arm parallel to torso",
      "Extend forearm straight back until arm is completely locked parallel to ground",
      "Hold peak tricep contraction for a full 2-second squeeze"
    ],
    "openSourceLink": {
      "label": "ExRx - Cable One Arm Triceps Kickback",
      "url": "https://exrx.net/WeightExercises/Triceps/CBOneArmTricepsKickback",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Set pulley to mid-chest height without handle (hold bare cable ball).",
      "Hinge hips back with upper arm locked securely to ribcage.",
      "Extend forearm backward into full extension.",
      "Hold contraction 2 seconds, then return slowly to 90 degrees."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 15,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "dumbbell-kickbacks",
      "triceps-rope-pushdown",
      "cable-overhead-triceps-rope"
    ]
  },
  {
    "id": "reverse-barbell-wrist-curl",
    "name": "Overhand Barbell Wrist Extension (Extensor Isolation)",
    "split": "Upper Body",
    "subCategory": "Arms",
    "category": "Arms",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Dumbbell"
    ],
    "primaryMuscle": "Forearm Extensors (Extensor Carpi Radialis & Ulnaris)",
    "secondaryMuscles": [
      "Brachioradialis"
    ],
    "animationType": "curl",
    "cues": [
      "Rest forearms flat across thighs or a flat bench with wrists hanging just over the edge",
      "Use an overhand (pronated) grip with thumbs over or under bar",
      "Curl wrists upward toward ceiling as high as possible, pausing 1 second at full extension"
    ],
    "openSourceLink": {
      "label": "ExRx - Barbell Reverse Wrist Curl",
      "url": "https://exrx.net/WeightExercises/WristExtensors/BBReverseWristCurl",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Sit on flat bench with forearms resting securely on thighs, wrists free.",
      "Hold a light barbell with palms facing downward.",
      "Lower bar into full wrist flexion, feeling a deep stretch in forearm extensors.",
      "Extend wrists upward vigorously toward ceiling, holding the squeeze at top."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 15,
      "minReps": 12,
      "maxReps": 20,
      "defaultWeight": 30,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "barbell-wrist-curls",
      "zottman-curl",
      "reverse-barbell-curl"
    ]
  },
  {
    "id": "pendulum-squat",
    "name": "Pendulum Squat (Deep Knee Flexion Quad Squat)",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine"
    ],
    "primaryMuscle": "Quadriceps (Vastus Medialis, Lateralis, Intermedius)",
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Adductor Magnus"
    ],
    "animationType": "squat",
    "cues": [
      "Keep back completely flat against pad throughout the arc",
      "Position feet low on platform to achieve maximum knee travel over toes",
      "Descend deep into full knee flexion without letting lower back peel off the pad"
    ],
    "openSourceLink": {
      "label": "ExRx - Sled 45° Hack Squat",
      "url": "https://exrx.net/WeightExercises/Quadriceps/SL45HackSquat",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Step onto the pendulum squat platform and rest shoulders under padded yokes.",
      "Release safety handles and plant feet shoulder-width.",
      "Descend slowly into the hole, allowing knees to track forward over toes.",
      "Drive out of the hole smoothly through mid-foot to full extension without locking knees."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 90,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "squat",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "hack-squat",
      "squat-or-leg-press",
      "leg-extension"
    ]
  },
  {
    "id": "belt-squat",
    "name": "Belt Squat (Zero Spinal Compression Squat)",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine",
      "Cable"
    ],
    "primaryMuscle": "Quadriceps & Gluteus Maximus",
    "secondaryMuscles": [
      "Adductor Magnus",
      "Hamstrings"
    ],
    "animationType": "squat",
    "cues": [
      "Fasten dip belt low around hips and hook chain securely to lever or cable arm",
      "Stand tall holding upright guide handles with light fingertips",
      "Squat deep between knees; load pulls hips down directly without any spinal shear"
    ],
    "openSourceLink": {
      "label": "ExRx - Belt Squat",
      "url": "https://exrx.net/WeightExercises/Quadriceps/LVBeltSquat",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Step onto belt squat machine platform with belt snug around iliac crest.",
      "Unrack weight lever and take comfortable shoulder-width stance.",
      "Descend until hip crease is below knee level with an upright torso.",
      "Drive through whole foot to stand tall."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 135,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "squat",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "hack-squat",
      "barbell-back-squat",
      "goblet-front-squat"
    ]
  },
  {
    "id": "zercher-squat",
    "name": "Zercher Squat (Crook of Elbows Front Squat)",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell"
    ],
    "primaryMuscle": "Quadriceps & Upper Back / Biceps",
    "secondaryMuscles": [
      "Anterior Core",
      "Gluteus Maximus",
      "Hamstrings"
    ],
    "animationType": "squat",
    "cues": [
      "Cradle barbell securely in the crook of elbows with hands clasped together tightly",
      "Stand tall with chest puffed out and elbows pulled tight against ribcage",
      "Squat deep between legs, tracking elbows inside the knees at the bottom"
    ],
    "openSourceLink": {
      "label": "ExRx - Zercher Squat",
      "url": "https://exrx.net/WeightExercises/Quadriceps/BBZercherSquat",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Set barbell in rack at mid-chest height.",
      "Hook forearms under bar, resting bar in elbow creases, and clasp hands.",
      "Unrack bar and take slightly wider than shoulder-width stance.",
      "Descend with an upright torso, letting elbows settle between knees.",
      "Drive through heels and midfoot back to standing lockout."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 115,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "squat",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "goblet-front-squat",
      "barbell-back-squat",
      "hack-squat"
    ]
  },
  {
    "id": "smith-machine-squat",
    "name": "Smith Machine Squat (Feet-Forward Quad Bias)",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine"
    ],
    "primaryMuscle": "Quadriceps Femoris (Rectus Femoris & VMO)",
    "secondaryMuscles": [
      "Gluteus Maximus"
    ],
    "animationType": "squat",
    "cues": [
      "Position feet ~12 inches out in front of the bar line",
      "Lean back slightly into the fixed bar path with a completely vertical torso",
      "Squat deep with full knee flexion, driving through midfoot to isolate quadriceps"
    ],
    "openSourceLink": {
      "label": "ExRx - Smith Squat",
      "url": "https://exrx.net/WeightExercises/Quadriceps/SMSquat",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Step under the Smith machine bar, resting it across upper traps.",
      "Walk feet forward 10–14 inches and unhook safety hooks.",
      "Lower under control, keeping hips under shoulders and torso upright.",
      "Descend to parallel or below, then press through the floor to return."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 135,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "squat",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "hack-squat",
      "barbell-back-squat",
      "leg-extension"
    ]
  },
  {
    "id": "heel-elevated-goblet-squat",
    "name": "Heel-Elevated Goblet Squat (VMO Bias)",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Kettlebell",
      "Barbell"
    ],
    "primaryMuscle": "Quadriceps (Vastus Medialis / Teardrop)",
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Anterior Core"
    ],
    "animationType": "squat",
    "cues": [
      "Elevate heels 1–2 inches on a slant board or weight plate with toes on floor",
      "Hold dumbbell vertically against upper sternum with elbows tucked",
      "Descend straight down with vertical torso, letting knees push far past toes"
    ],
    "openSourceLink": {
      "label": "ExRx - Dumbbell Squat",
      "url": "https://exrx.net/WeightExercises/Quadriceps/DBSquat",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Place heels on an elevated wedge or weight plate.",
      "Hold heavy dumbbell or kettlebell tight against chest in goblet position.",
      "Squat down vertically as low as possible without rounding lower back.",
      "Drive straight up through the balls of the feet and midfoot, feeling intense VMO burn."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 50,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "squat",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "goblet-front-squat",
      "sissy-squat",
      "leg-extension"
    ]
  },
  {
    "id": "cossack-squat",
    "name": "Cossack Squat (Frontal Plane Lateral Squat)",
    "split": "Lower Body",
    "subCategory": "Quads",
    "category": "Legs",
    "defaultEquipment": "Kettlebell",
    "supportedEquipment": [
      "Kettlebell",
      "Dumbbell",
      "Bodyweight"
    ],
    "primaryMuscle": "Adductors, Quadriceps & Gluteus Medius",
    "secondaryMuscles": [
      "Hamstrings",
      "Ankle Stabilizers"
    ],
    "animationType": "squat",
    "cues": [
      "Take an ultra-wide stance with toes angled slightly outward",
      "Squat deep to one side while keeping trailing leg completely straight with toes pointing up",
      "Keep heel of working leg glued flat to the floor throughout descent"
    ],
    "openSourceLink": {
      "label": "ExRx - Side Lunge",
      "url": "https://exrx.net/WeightExercises/Quadriceps/BWSideLunge",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Assume a wide straddle stance holding kettlebell in goblet position.",
      "Shift weight to right side and squat down as deep as mobility allows.",
      "Rotate left foot onto heel with toes pointing toward ceiling.",
      "Push through right foot to return to center and switch sides."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 25,
      "repsUnit": "per leg"
    },
    "loadType": "weight_reps",
    "movementPattern": "lunge",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "bulgarian-split-squat",
      "walking-dumbbell-lunges",
      "reverse-lunge"
    ]
  },
  {
    "id": "stiff-leg-deadlift",
    "name": "Stiff-Leg Deadlift (SLDL)",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell",
      "Dumbbell"
    ],
    "primaryMuscle": "Hamstrings (Biceps Femoris & Semitendinosus)",
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Erector Spinae",
      "Grip"
    ],
    "animationType": "deadlift",
    "cues": [
      "Keep knees relatively straight (soft 10° unlock, no knee flexion during hinge)",
      "Start each rep from floor plates or 1 inch above, keeping hips higher than a conventional deadlift",
      "Push hips back toward the wall behind you until maximum hamstring stretch is achieved"
    ],
    "openSourceLink": {
      "label": "ExRx - Stiff Leg Deadlift",
      "url": "https://exrx.net/WeightExercises/Hamstrings/BBStraightLegDeadlift",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand with feet hip-width apart over the barbell.",
      "Hinge hips back with knees softly unlocked, keeping hips elevated.",
      "Grip the bar overhand and pull your chest up.",
      "Drive through heels and push hips forward to stand tall.",
      "Lower under control with high hips to touch the floor or mid-shin."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 185,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "romanian-deadlift",
      "barbell-deadlift",
      "good-mornings"
    ]
  },
  {
    "id": "b-stance-rdl",
    "name": "B-Stance Romanian Deadlift (Kickstand RDL)",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Barbell",
      "Kettlebell"
    ],
    "primaryMuscle": "Unilateral Hamstring & Gluteus Maximus",
    "secondaryMuscles": [
      "Gluteus Medius",
      "Erector Spinae",
      "Core"
    ],
    "animationType": "deadlift",
    "cues": [
      "Set lead foot flat with 85% of body weight; trailing foot acts as a kickstand on toes",
      "Hinge hips backward as if pushing a car door shut with the working glute",
      "Lower dumbbells down front shin until deep hamstring stretch is felt, then drive hips forward"
    ],
    "openSourceLink": {
      "label": "ExRx - One Leg Romanian Deadlift",
      "url": "https://exrx.net/WeightExercises/Hamstrings/DBOneLegDeadlift",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand with feet hip-width; slide one foot back 6 inches onto its toes.",
      "Hold dumbbells in front of thighs with core braced.",
      "Hinge at the hips, keeping 85% of your weight rooted through front heel.",
      "Lower bells along front shin until hamstrings are fully loaded.",
      "Contract glute and hamstring to stand tall."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 45,
      "repsUnit": "per leg"
    },
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "romanian-deadlift",
      "single-leg-romanian-deadlift",
      "dumbbell-romanian-deadlift"
    ]
  },
  {
    "id": "single-leg-hip-thrust",
    "name": "Single-Leg Dumbbell Hip Thrust",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Dumbbell",
    "supportedEquipment": [
      "Dumbbell",
      "Bodyweight",
      "Barbell"
    ],
    "primaryMuscle": "Gluteus Maximus (Unilateral Peak Contraction)",
    "secondaryMuscles": [
      "Hamstrings",
      "Gluteus Medius",
      "Core"
    ],
    "animationType": "deadlift",
    "cues": [
      "Position upper back across sturdy bench with working foot planted flat",
      "Elevate non-working knee to 90° over hip",
      "Drive through working heel to full horizontal hip lockout, holding squeeze 2 seconds"
    ],
    "openSourceLink": {
      "label": "ExRx - Single Leg Hip Thrust",
      "url": "https://exrx.net/WeightExercises/GluteusMaximus/BWSingleLegHipThrust",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Sit on floor with upper back braced against bench and working foot flat.",
      "Rest dumbbell across working hip crease.",
      "Drive working heel into floor to lift hips until pelvis is parallel to ground.",
      "Squeeze working glute hard at top for 2 seconds, then lower slowly."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 30,
      "repsUnit": "per leg"
    },
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "barbell-hip-thrust",
      "dumbbell-hip-thrust",
      "cable-glute-kickback"
    ]
  },
  {
    "id": "glute-ham-raise",
    "name": "Glute-Ham Raise (GHR)",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine",
      "Bodyweight"
    ],
    "primaryMuscle": "Hamstrings (Knee Flexion & Hip Extension)",
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Gastrocnemius",
      "Spinal Erectors"
    ],
    "animationType": "deadlift",
    "cues": [
      "Set GHD machine so thighs rest securely on curved pads and feet locked in rollers",
      "Lower torso down horizontal by extending knees under strict hamstring tension",
      "Pull through hamstrings and calves to return to upright kneeling position"
    ],
    "openSourceLink": {
      "label": "ExRx - Glute Ham Raise",
      "url": "https://exrx.net/WeightExercises/Hamstrings/BWGluteHamRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Lock ankles between roller pads on a Glute-Ham Developer.",
      "Start kneeling upright with torso rigid and arms folded across chest.",
      "Lower body forward by straightening knees under maximum hamstring braking control.",
      "Pull through hamstrings and contract calves to return to starting upright position."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 0,
      "repsUnit": "reps"
    },
    "loadType": "bodyweight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "nordic-hamstring-curl",
      "leg-curl",
      "seated-leg-curl"
    ]
  },
  {
    "id": "seated-hip-abduction-machine",
    "name": "Seated Machine Hip Abduction",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine",
      "Cable",
      "Resistance Band"
    ],
    "primaryMuscle": "Gluteus Medius & Tensor Fasciae Latae",
    "secondaryMuscles": [
      "Gluteus Minimus",
      "Piriformis"
    ],
    "animationType": "squat",
    "cues": [
      "Lean forward slightly from hips or sit back against pad to target different upper glute fibers",
      "Push knees outward against pads as wide as possible",
      "Pause 2 seconds at maximum spread, then resist the return over 3 seconds"
    ],
    "openSourceLink": {
      "label": "ExRx - Lever Seated Hip Abduction",
      "url": "https://exrx.net/WeightExercises/GluteusMedius/LVSeatedHipAbduction",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Sit on abduction machine with outer thighs resting against padded levers.",
      "Select weight and assume upright or slight forward-hinged posture.",
      "Push knees apart forcefully against the pads.",
      "Hold full contraction for 2 seconds, then return under slow control."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 15,
      "minReps": 12,
      "maxReps": 20,
      "defaultWeight": 90,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "cable-glute-kickback",
      "barbell-hip-thrust",
      "side-plank"
    ]
  },
  {
    "id": "seated-hip-adduction-machine",
    "name": "Seated Machine Hip Adduction",
    "split": "Lower Body",
    "subCategory": "Hamstrings & Glutes",
    "category": "Legs",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine",
      "Cable"
    ],
    "primaryMuscle": "Adductor Longus, Brevis, Magnus & Gracilis",
    "secondaryMuscles": [
      "Pectineus",
      "Deep Groin Stabilizers"
    ],
    "animationType": "squat",
    "cues": [
      "Sit back firmly against pad with feet supported on footpegs",
      "Squeeze knees inward together until pads touch gently",
      "Hold inner thigh contraction for 2 seconds before slow eccentric stretch"
    ],
    "openSourceLink": {
      "label": "ExRx - Lever Seated Hip Adduction",
      "url": "https://exrx.net/WeightExercises/Adductors/LVSeatedHipAdduction",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Sit on adduction machine with inner knees against pads spread wide.",
      "Grasp side handles and sit tall with spine neutral.",
      "Squeeze inner thighs to draw knees together smoothly.",
      "Pause at peak touch, then control the outward opening stretch over 3 seconds."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 15,
      "minReps": 12,
      "maxReps": 20,
      "defaultWeight": 80,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "cossack-squat",
      "sumo-deadlift",
      "goblet-front-squat"
    ]
  },
  {
    "id": "tibialis-raise",
    "name": "Tibialis Anterior Wall Raise",
    "split": "Lower Body",
    "subCategory": "Calves",
    "category": "Legs",
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Dumbbell",
      "Kettlebell"
    ],
    "primaryMuscle": "Tibialis Anterior (Shin / Dorsiflexion)",
    "secondaryMuscles": [
      "Extensor Digitorum Longus",
      "Peroneus Tertius"
    ],
    "animationType": "squat",
    "cues": [
      "Lean upper back against wall with legs straight and heels planted 12-18 inches forward",
      "Pull toes and front of feet straight up toward shins as high as possible",
      "Hold top squeeze for 2 seconds to burn shin muscles, building knee deceleration armor"
    ],
    "openSourceLink": {
      "label": "ExRx - Tibialis Anterior Raise",
      "url": "https://exrx.net/WeightExercises/TibialisAnterior/BWTibialisRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Lean butt and shoulders back against a flat wall.",
      "Step feet forward 12 to 18 inches with heels flat on the floor.",
      "Pull toes and balls of feet as high up as possible toward your shins.",
      "Hold the contraction at the top for 2 seconds, then slowly lower back down."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 20,
      "minReps": 15,
      "maxReps": 25,
      "defaultWeight": 0,
      "repsUnit": "reps"
    },
    "loadType": "bodyweight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "standing-calf-raise",
      "seated-calf-raise",
      "leg-press-calf-raise"
    ]
  },
  {
    "id": "smith-machine-calf-raise",
    "name": "Smith Machine Standing Calf Raise",
    "split": "Lower Body",
    "subCategory": "Calves",
    "category": "Legs",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine",
      "Barbell"
    ],
    "primaryMuscle": "Gastrocnemius (Medial & Lateral Heads)",
    "secondaryMuscles": [
      "Soleus"
    ],
    "animationType": "squat",
    "cues": [
      "Place balls of feet on elevated calf block with heels hanging free",
      "Rest bar across upper traps and lock knees straight with soft micro-unlock",
      "Drop heels deep into stretch for 2 full seconds before exploding up onto big toes"
    ],
    "openSourceLink": {
      "label": "ExRx - Smith Standing Calf Raise",
      "url": "https://exrx.net/WeightExercises/Gastrocnemius/SMStandingCalfRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Set a calf block under the Smith machine bar.",
      "Rest bar across upper traps and stand on the balls of your feet.",
      "Lower heels deeply below the platform for a 2-second dead stretch.",
      "Drive up forcefully onto the balls of your big toes, squeezing calves at top."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 12,
      "minReps": 10,
      "maxReps": 15,
      "defaultWeight": 135,
      "repsUnit": "reps"
    },
    "loadType": "weight_reps",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "standing-calf-raise",
      "leg-press-calf-raise",
      "donkey-calf-raise"
    ]
  },
  {
    "id": "dragon-flag",
    "name": "Dragon Flag (Bruce Lee Eccentric Core Raise)",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Rectus Abdominis & Transversus Abdominis",
    "secondaryMuscles": [
      "Hip Flexors",
      "Latissimus Dorsi",
      "Glutes"
    ],
    "animationType": "core",
    "cues": [
      "Lie on flat bench and grip top of bench tightly behind head",
      "Raise entire body upward in a rigid straight line supported only by upper shoulder blades",
      "Lower torso and legs as a single unbending plank under slow 4-second eccentric control"
    ],
    "openSourceLink": {
      "label": "ExRx - Dragon Flag",
      "url": "https://exrx.net/WeightExercises/RectusAbdominis/BWDragonFlag",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Lie flat on bench gripping the edges firmly behind your ears.",
      "Roll hips back and raise your entire body up until pointed vertically.",
      "Keep body in a completely rigid plank from shoulders to toes.",
      "Lower body slowly toward bench without breaking at the hips.",
      "Hover just above bench, then power back upward."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 6,
      "minReps": 5,
      "maxReps": 8,
      "defaultWeight": 0,
      "repsUnit": "reps"
    },
    "loadType": "bodyweight_reps",
    "movementPattern": "anti_extension",
    "tierSuitability": [
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "ab-wheel-rollout",
      "hanging-leg-raise",
      "hollow-body-hold"
    ]
  },
  {
    "id": "toes-to-bar",
    "name": "Strict Hanging Toes to Bar",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Rectus Abdominis (Lower Fibers)",
    "secondaryMuscles": [
      "Iliopsoas",
      "Latissimus Dorsi",
      "Forearms / Grip"
    ],
    "animationType": "core",
    "cues": [
      "Hang with active shoulders from pull-up bar without swinging or kipping",
      "Compress abs and roll pelvis upward as you pull toes directly to touch the bar",
      "Lower under control over 3 seconds to dead hang before initiating next rep"
    ],
    "openSourceLink": {
      "label": "ExRx - Hanging Straight Leg Hip Raise",
      "url": "https://exrx.net/WeightExercises/RectusAbdominis/BWHangingStraightLegHipRaise",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Grasp pull-up bar with overhand grip and hang fully extended.",
      "Engage lats and posterior pelvic tilt to initiate movement without swinging.",
      "Raise straight legs smoothly until toes touch the bar between hands.",
      "Control the descent slowly to full dead hang."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 8,
      "minReps": 6,
      "maxReps": 10,
      "defaultWeight": 0,
      "repsUnit": "reps"
    },
    "loadType": "bodyweight_reps",
    "movementPattern": "anti_extension",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "hanging-leg-raise",
      "captain-chair-leg-raise",
      "hanging-knee-raise"
    ]
  },
  {
    "id": "landmine-rotations",
    "name": "Landmine Rotational Oblique Cleans (Landmine 180s)",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "defaultEquipment": "Barbell",
    "supportedEquipment": [
      "Barbell"
    ],
    "primaryMuscle": "Internal & External Obliques",
    "secondaryMuscles": [
      "Transversus Abdominis",
      "Anterior Deltoids",
      "Forearms"
    ],
    "animationType": "core",
    "cues": [
      "Stand with athletic stance holding sleeve of landmine barbell with both hands",
      "Rotate bar across in a wide rainbow arc down toward hip without twisting lumbar spine",
      "Brake rotational momentum with obliques, then power back across to opposite hip"
    ],
    "openSourceLink": {
      "label": "ExRx - Landmine 180",
      "url": "https://exrx.net/WeightExercises/Obliques/LMRotation",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Anchor barbell in a landmine swivel.",
      "Hold barbell end with both hands with arms extended out at shoulder height.",
      "Pivot feet and rotate bar down toward one hip under core control.",
      "Explode out of hip turn, sweeping bar overhead and down to opposite hip."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 25,
      "repsUnit": "per side"
    },
    "loadType": "weight_reps",
    "movementPattern": "anti_rotation",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "cable-woodchoppers",
      "cable-pallof-press",
      "russian-twists"
    ]
  },
  {
    "id": "stomach-vacuum",
    "name": "Standing Transverse Abdominis Stomach Vacuum",
    "split": "Core & Conditioning",
    "subCategory": "Core / Abs",
    "category": "Core",
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight"
    ],
    "primaryMuscle": "Transversus Abdominis (Deep Core Belt)",
    "secondaryMuscles": [
      "Diaphragm",
      "Pelvic Floor"
    ],
    "animationType": "core",
    "cues": [
      "Exhale all air completely from lungs until abdomen is completely empty",
      "Without inhaling, suck navel inward and upward toward ribcage as deep as possible",
      "Hold isometric contraction rigidly for 15-30 seconds, maintaining hollow stomach"
    ],
    "openSourceLink": {
      "label": "ExRx - Stomach Vacuum",
      "url": "https://exrx.net/WeightExercises/TransverseAbdominis/BWStomachVacuum",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand tall or lean slightly forward with hands resting on a table or knees.",
      "Exhale forcefully until completely empty of air.",
      "Pull stomach inward as though touching belly button to the spine.",
      "Lock the vacuum in place for the full timed prescription, breathing shallowly.",
      "Release slowly and repeat."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 20,
      "minReps": 15,
      "maxReps": 30,
      "defaultWeight": 0,
      "repsUnit": "sec"
    },
    "loadType": "bodyweight_timed",
    "movementPattern": "anti_extension",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "plank",
      "deadbug",
      "hollow-body-hold"
    ]
  },
  {
    "id": "kettlebell-snatch",
    "name": "Kettlebell Snatch (Single-Arm Explosive Snatch)",
    "split": "Core & Conditioning",
    "subCategory": "Conditioning & Kettlebells",
    "category": "Full Body",
    "defaultEquipment": "Kettlebell",
    "supportedEquipment": [
      "Kettlebell",
      "Dumbbell"
    ],
    "primaryMuscle": "Posterior Chain (Glutes & Hamstrings)",
    "secondaryMuscles": [
      "Upper Back / Trapezius",
      "Shoulders",
      "Core",
      "Grip"
    ],
    "animationType": "swing",
    "cues": [
      "Hinge at hips to swing kettlebell between legs with wrist tight to zipper line",
      "Snap hips forward violently, allowing bell to travel close along the body",
      "Punch hand through handle at the top into a soft, seamless overhead lockout"
    ],
    "openSourceLink": {
      "label": "ExRx - Kettlebell Snatch",
      "url": "https://exrx.net/WeightExercises/Kettlebell/KBSnatch",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Stand over kettlebell with feet shoulder-width.",
      "Hinge and hike kettlebell back between legs.",
      "Drive hips forward explosively, pulling elbow high and punch hand through into lockout.",
      "Drop bell in an arc back between legs and repeat."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 10,
      "minReps": 8,
      "maxReps": 12,
      "defaultWeight": 35,
      "repsUnit": "per arm"
    },
    "loadType": "weight_reps",
    "movementPattern": "hinge",
    "tierSuitability": [
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "unilateral",
    "substituteIds": [
      "kettlebell-swing",
      "kettlebell-clean-and-press",
      "barbell-thruster"
    ]
  },
  {
    "id": "sled-push",
    "name": "Heavy Sled / Prowler Push",
    "split": "Core & Conditioning",
    "subCategory": "Conditioning & Kettlebells",
    "category": "Full Body",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine"
    ],
    "primaryMuscle": "Quadriceps (Concentric Overload) & Calves",
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core",
      "Cardiovascular System"
    ],
    "animationType": "squat",
    "cues": [
      "Grip upright poles with arms locked or elbows tucked tight to torso",
      "Set body at a forward 45° angle with rigid neutral spine and braced core",
      "Drive through the balls of your feet with piston-like aggressive leg turnover"
    ],
    "openSourceLink": {
      "label": "ExRx - Sled Push",
      "url": "https://exrx.net/WeightExercises/Quadriceps/SledPush",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Load sled with weight plates on turf or track.",
      "Grasp upright handles at shoulder height, leaning forward into a 45-degree sprint posture.",
      "Drive legs powerfully, striking through the balls of the feet.",
      "Sprint or march steadily for prescribed distance without pausing."
    ],
    "defaultTarget": {
      "targetSets": 4,
      "targetReps": 25,
      "minReps": 20,
      "maxReps": 40,
      "defaultWeight": 135,
      "repsUnit": "meters"
    },
    "loadType": "distance_time",
    "movementPattern": "lunge",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "farmers-walk",
      "trap-bar-farmers-carry",
      "kettlebell-swing"
    ]
  },
  {
    "id": "sled-backward-drag",
    "name": "Reverse Sled Drag (Backward Walking Sled Pull)",
    "split": "Core & Conditioning",
    "subCategory": "Conditioning & Kettlebells",
    "category": "Legs",
    "defaultEquipment": "Machine",
    "supportedEquipment": [
      "Machine"
    ],
    "primaryMuscle": "Vastus Medialis (VMO) & Patellar Tendon",
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Glutes",
      "Hamstrings"
    ],
    "animationType": "squat",
    "cues": [
      "Attach strap/belt to waist or hold handles in front with elbows extended",
      "Lean back slightly into sled resistance with chest upright and knees bent",
      "Walk backward, striking toe-first and rolling back through the heel for continuous VMO pump"
    ],
    "openSourceLink": {
      "label": "ExRx - Reverse Sled Drag",
      "url": "https://exrx.net/WeightExercises/Quadriceps/ReverseSledDrag",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Connect waist harness or long straps to loaded sled.",
      "Face toward the sled and walk backward in steady rhythmic strides.",
      "Reach toes back, plant ball of foot, and push through heel to lock knee out.",
      "Maintain continuous backward stride for target distance."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 30,
      "minReps": 20,
      "maxReps": 50,
      "defaultWeight": 90,
      "repsUnit": "meters"
    },
    "loadType": "distance_time",
    "movementPattern": "lunge",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "tibialis-raise",
      "hack-squat",
      "leg-extension"
    ]
  },
  {
    "id": "battle-ropes-waves",
    "name": "Battle Ropes Alternating Waves",
    "split": "Core & Conditioning",
    "subCategory": "Conditioning & Kettlebells",
    "category": "Full Body",
    "defaultEquipment": "Bodyweight",
    "supportedEquipment": [
      "Bodyweight",
      "Custom / Other"
    ],
    "primaryMuscle": "Shoulders, Forearms & Core",
    "secondaryMuscles": [
      "Lats",
      "Pectorals",
      "Cardiovascular Capacity"
    ],
    "animationType": "swing",
    "cues": [
      "Sit into an athletic quarter-squat with chest proud and spine neutral",
      "Whip ropes up and down alternately with high frequency",
      "Generate power from the core and shoulder drive, keeping waves traveling all the way to anchor"
    ],
    "openSourceLink": {
      "label": "ExRx - Battle Ropes Alternating Waves",
      "url": "https://exrx.net/WeightExercises/Conditioning/BattleRopesWaves",
      "source": "ExRx Biomechanics"
    },
    "instructions": [
      "Hold ends of anchor-wrapped heavy ropes with neutral thumbs-forward grip.",
      "Assume a stable athletic half-squat stance.",
      "Whip right arm up while left arm slams down, creating continuous alternating undulating waves.",
      "Maintain max intensity for prescribed interval time."
    ],
    "defaultTarget": {
      "targetSets": 3,
      "targetReps": 30,
      "minReps": 20,
      "maxReps": 45,
      "defaultWeight": 0,
      "repsUnit": "sec"
    },
    "loadType": "bodyweight_timed",
    "movementPattern": "isolation",
    "tierSuitability": [
      "Beginner",
      "Intermediate",
      "Advanced"
    ],
    "bilateralType": "bilateral",
    "substituteIds": [
      "medicine-ball-slam",
      "kettlebell-swing",
      "farmers-walk"
    ]
  }
];

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface RoutineExerciseConfig {
  exerciseId: string;
  exercise?: ExerciseDefinition;
  targetSets: number;
  targetReps: number;
  targetWeight: number;
  minReps?: number;
  maxReps?: number;
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
