import { ExerciseDefinition, LoadType } from './exerciseLibrary';

export interface CompletedSetRecord {
  weight: number;
  reps: number;
  completed: boolean;
  type: string;
  rpe?: number;
}

export interface CompletedExerciseRecord {
  id: string;
  name: string;
  split?: string;
  subCategory?: string;
  equipment?: string;
  targetSets?: number;
  targetReps?: number;
  sets: CompletedSetRecord[];
  supersetTag?: string;
}

export interface CompletedWorkoutSession {
  id: string;
  date: string;
  title: string;
  exercises: CompletedExerciseRecord[];
  unit?: 'lbs' | 'kg';
  totalVolume?: number;
}

export interface PreviousWorkoutLookup {
  isExactSameWorkout: boolean;
  workoutTitle: string;
  workoutDate: string;
  targetSets: number;
  targetReps: number;
  sets: CompletedSetRecord[];
  maxWeight: number;
  workingWeight: number;
  totalVolume: number;
  e1RM: number;
  summary: string;
  repsArray: number[];
  weightsArray: number[];
}

export interface ProgressionStage {
  stageIndex: number;
  stageCode: 'baseline' | 'rep_consolidation' | 'ceiling_mastery' | 'load_jump' | 'new_base' | 'next_ceiling';
  title: string;
  badgeLabel: string;
  subtitle: string;
  isCurrentTarget: boolean;
  targetWeight: number;
  setReps: number[];
  totalReps: number;
  projectedVolume: number;
  volumeDelta: number;
  volumeDeltaPct: number;
  projectedE1RM: number;
  e1RMDelta: number;
  focusCue: string;
  recommendedRPE: string;
  statusBadge: 'completed' | 'recommended' | 'next' | 'future';
}

export interface ProgressionLadder {
  exerciseId: string;
  exerciseName: string;
  equipment: string;
  isTimedHold: boolean;
  isBodyweight: boolean;
  repBracket: { min: number; max: number; unit: string };
  weightIncrement: number;
  source: 'exact_workout' | 'general_history' | 'prescribed_default';
  previousSession: PreviousWorkoutLookup | null;
  stages: ProgressionStage[];
  recommendedNextStage: ProgressionStage;
  progressionPrinciple: string;
}

// Calculate Estimated 1-Rep Max (e1RM) using Epley formula
export function calculateE1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + Math.min(reps, 30) / 30) * 10) / 10;
}

// Normalize workout title string for comparison
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\(.*?\)/g, '')
    .trim();
}

/**
 * Searches history prioritizing the EXACT SAME WORKOUT TITLE first,
 * then falls back to general history for the same exercise.
 */
export function getPreviousSameWorkoutPerformance(
  exerciseId: string,
  exerciseName: string,
  currentWorkoutTitle: string,
  historyList: CompletedWorkoutSession[]
): PreviousWorkoutLookup | null {
  if (!historyList || historyList.length === 0) return null;

  const normCurrent = normalizeTitle(currentWorkoutTitle || '');

  // Pass 1: Look for exact or near-identical workout title match
  let exactMatchRecord: { workout: CompletedWorkoutSession; exercise: CompletedExerciseRecord } | null = null;
  let fallbackMatchRecord: { workout: CompletedWorkoutSession; exercise: CompletedExerciseRecord } | null = null;

  for (const workout of historyList) {
    const foundEx = workout.exercises?.find(
      e => e.id === exerciseId || e.name.toLowerCase() === exerciseName.toLowerCase()
    );

    if (foundEx && foundEx.sets && foundEx.sets.length > 0) {
      const completedSets = foundEx.sets.filter(s => s.completed && s.type !== 'Warmup');
      const validSets = completedSets.length > 0 ? completedSets : foundEx.sets.filter(s => s.completed);

      if (validSets.length > 0) {
        const normWorkout = normalizeTitle(workout.title || '');
        const isSameTitle = normCurrent.length > 2 && (normWorkout === normCurrent || normWorkout.includes(normCurrent) || normCurrent.includes(normWorkout));

        if (isSameTitle && !exactMatchRecord) {
          exactMatchRecord = { workout, exercise: foundEx };
          break; // Most recent exact match found!
        }

        if (!fallbackMatchRecord) {
          fallbackMatchRecord = { workout, exercise: foundEx };
        }
      }
    }
  }

  const selected = exactMatchRecord || fallbackMatchRecord;
  if (!selected) return null;

  const isExactSameWorkout = Boolean(exactMatchRecord);
  const { workout, exercise } = selected;
  const completedSets = exercise.sets.filter(s => s.completed && s.type !== 'Warmup');
  const workingSets = completedSets.length > 0 ? completedSets : exercise.sets.filter(s => s.completed);

  const repsArray = workingSets.map(s => s.reps);
  const weightsArray = workingSets.map(s => s.weight);
  const maxWeight = Math.max(...weightsArray, 0);
  const workingWeight = weightsArray[weightsArray.length - 1] ?? maxWeight;
  const totalVolume = workingSets.reduce((sum, s) => sum + (s.weight * s.reps), 0);

  // Highest e1RM in that session
  const e1rmList = workingSets.map(s => calculateE1RM(s.weight, s.reps));
  const bestE1RM = Math.max(...e1rmList, 0);

  return {
    isExactSameWorkout,
    workoutTitle: workout.title,
    workoutDate: workout.date,
    targetSets: exercise.targetSets || workingSets.length,
    targetReps: exercise.targetReps || repsArray[0] || 10,
    sets: workingSets,
    maxWeight,
    workingWeight,
    totalVolume,
    e1RM: bestE1RM,
    summary: workingSets.map(s => `${s.weight > 0 ? `${s.weight}×` : ''}${s.reps}`).join(', '),
    repsArray,
    weightsArray
  };
}

/**
 * Determine the optimal load step increment based on equipment & unit
 */
export function getStandardEquipmentIncrement(
  equipment: string,
  unit: 'lbs' | 'kg' = 'lbs',
  loadType?: LoadType
): number {
  if (loadType === 'bodyweight_reps' || loadType === 'bodyweight_timed' || equipment === 'Bodyweight') {
    return 0; // Progress via reps/time
  }

  const eq = equipment.toLowerCase();
  if (eq.includes('barbell') || eq.includes('trap bar') || eq.includes('smith')) {
    return unit === 'lbs' ? 5 : 2.5;
  }
  if (eq.includes('dumbbell') || eq.includes('kettlebell')) {
    // 5 lbs total (2.5 lbs per hand or next dumbbell increment)
    return unit === 'lbs' ? 5 : 2.5;
  }
  if (eq.includes('machine') || eq.includes('press') || eq.includes('hack')) {
    return unit === 'lbs' ? 5 : 2.5;
  }
  if (eq.includes('cable') || eq.includes('band')) {
    return unit === 'lbs' ? 5 : 2.5;
  }
  return unit === 'lbs' ? 5 : 2.5;
}

export interface BuildLadderParams {
  exerciseId: string;
  exerciseName: string;
  equipment: string;
  loadType?: LoadType;
  currentSetsCount?: number;
  minReps?: number;
  maxReps?: number;
  repsUnit?: string;
  defaultWeight?: number;
  unit?: 'lbs' | 'kg';
  sessionTitle?: string;
  history?: CompletedWorkoutSession[];
}

/**
 * Builds the comprehensive 5-6 stage Progressive Overload Ladder Matrix
 * using previous session data from the same workout (or fallback).
 */
export function generateProgressiveOverloadLadder(params: BuildLadderParams): ProgressionLadder {
  const {
    exerciseId,
    exerciseName,
    equipment,
    loadType,
    currentSetsCount = 3,
    minReps = 8,
    maxReps = 12,
    repsUnit = 'reps',
    defaultWeight = 0,
    unit = 'lbs',
    sessionTitle = '',
    history = []
  } = params;

  const isTimedHold = 
    loadType === 'bodyweight_timed' || 
    repsUnit.includes('sec') || 
    exerciseName.toLowerCase().includes('plank');

  const isBodyweight = 
    equipment === 'Bodyweight' || 
    loadType === 'bodyweight_reps' || 
    loadType === 'bodyweight_timed';

  const weightIncrement = getStandardEquipmentIncrement(equipment, unit, loadType);

  const prevPerf = getPreviousSameWorkoutPerformance(exerciseId, exerciseName, sessionTitle, history);

  const source: ProgressionLadder['source'] = prevPerf
    ? (prevPerf.isExactSameWorkout ? 'exact_workout' : 'general_history')
    : 'prescribed_default';

  const numSets = Math.max(1, prevPerf?.sets.length || currentSetsCount || 3);

  // Establish base working weight and base reps
  let baseWeight = 0;
  let baseReps: number[] = [];

  if (prevPerf && prevPerf.sets.length > 0) {
    baseWeight = prevPerf.workingWeight > 0 ? prevPerf.workingWeight : (prevPerf.maxWeight || defaultWeight);
    baseReps = prevPerf.repsArray.slice(0, numSets);
    // Pad if needed
    while (baseReps.length < numSets) {
      baseReps.push(baseReps[baseReps.length - 1] || minReps);
    }
  } else {
    baseWeight = defaultWeight;
    baseReps = Array(numSets).fill(minReps);
  }

  // Calculate baseline metrics
  const baseVolume = baseReps.reduce((sum, r) => sum + (baseWeight * r), 0);
  const baseE1RM = calculateE1RM(baseWeight, Math.max(...baseReps, 0));

  // Determine if previous session already hit the ceiling
  // (e.g. all sets reached maxReps)
  const allReachedCeiling = baseReps.every(r => r >= maxReps);
  const avgBaseRep = baseReps.reduce((a, b) => a + b, 0) / baseReps.length;
  const closeToCeiling = avgBaseRep >= (maxReps - 0.5);

  const stages: ProgressionStage[] = [];

  // ==========================================
  // STAGE 0: BASELINE (PREVIOUS HISTORY)
  // ==========================================
  stages.push({
    stageIndex: 0,
    stageCode: 'baseline',
    title: prevPerf ? 'Previous Performance' : 'Initial Program Baseline',
    badgeLabel: prevPerf ? (prevPerf.isExactSameWorkout ? 'Same Workout History' : 'Last Logged Session') : 'Day 1 Baseline',
    subtitle: prevPerf 
      ? `Completed on ${prevPerf.workoutDate ? new Date(prevPerf.workoutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'past session'}`
      : 'Prescribed starting load and volume',
    isCurrentTarget: false,
    targetWeight: baseWeight,
    setReps: [...baseReps],
    totalReps: baseReps.reduce((a, b) => a + b, 0),
    projectedVolume: baseVolume,
    volumeDelta: 0,
    volumeDeltaPct: 0,
    projectedE1RM: baseE1RM,
    e1RMDelta: 0,
    focusCue: prevPerf ? 'Verified baseline. Benchmark for progressive overload.' : 'Establish stable movement mechanics and baseline reps.',
    recommendedRPE: 'RPE 7.5–8.0',
    statusBadge: 'completed'
  });

  if (isTimedHold) {
    // ----------------------------------------------------
    // TIMED HOLD PROGRESSION (+5s, +10s steps)
    // ----------------------------------------------------
    const stepTime = 5; // seconds
    const timeStages = [
      { name: 'Consolidation', add: stepTime, cue: 'Extend hold duration while maintaining neutral spine.' },
      { name: 'Core Ceiling', add: stepTime * 2, cue: 'Hit upper endurance bracket. Focus on steady diaphragmatic breathing.' },
      { name: 'Tempo Compression', add: stepTime * 3, cue: 'Advanced time under tension benchmark.' },
      { name: 'Weighted / Strict', add: stepTime * 4, cue: 'Mastery reached. Consider elevating feet or adding a light plate.' }
    ];

    timeStages.forEach((ts, idx) => {
      const stageIdx = idx + 1;
      const targetRepsArr = baseReps.map(r => r + ts.add);
      const isTarget = stageIdx === 1;
      stages.push({
        stageIndex: stageIdx,
        stageCode: stageIdx === 1 ? 'rep_consolidation' : stageIdx === 2 ? 'ceiling_mastery' : 'next_ceiling',
        title: `Stage ${stageIdx}: +${ts.add}s ${ts.name}`,
        badgeLabel: `+${ts.add}s Hold`,
        subtitle: `Increase duration by ${ts.add} seconds across sets`,
        isCurrentTarget: isTarget,
        targetWeight: baseWeight,
        setReps: targetRepsArr,
        totalReps: targetRepsArr.reduce((a, b) => a + b, 0),
        projectedVolume: 0,
        volumeDelta: 0,
        volumeDeltaPct: 0,
        projectedE1RM: 0,
        e1RMDelta: 0,
        focusCue: ts.cue,
        recommendedRPE: 'RPE 8.0–8.5',
        statusBadge: isTarget ? 'recommended' : 'next'
      });
    });
  } else if (isBodyweight) {
    // ----------------------------------------------------
    // BODYWEIGHT REPS PROGRESSION (+1 to +2 reps per set)
    // ----------------------------------------------------
    const bwStages = [
      {
        code: 'rep_consolidation' as const,
        title: 'Stage 1: Rep Density Boost',
        badge: '+1 Rep Lagging Sets',
        subtitle: 'Bring trailing sets closer to top rep bracket',
        getReps: (prev: number[]) => {
          const next = [...prev];
          const minVal = Math.min(...next);
          const minIdx = next.findIndex(r => r === minVal);
          if (minIdx !== -1) next[minIdx] += 1;
          return next;
        },
        cue: 'Target completing +1 rep on your final set before form breakdown.',
        rpe: 'RPE 8.0'
      },
      {
        code: 'ceiling_mastery' as const,
        title: 'Stage 2: Rep Ceiling Mastery',
        badge: 'All Sets Max Reps',
        subtitle: `Master ${maxReps} strict reps across all ${numSets} sets`,
        getReps: () => Array(numSets).fill(maxReps),
        cue: 'Full range of motion: chest to bar / full extension at top.',
        rpe: 'RPE 8.5'
      },
      {
        code: 'load_jump' as const,
        title: 'Stage 3: Micro-Load Introduction',
        badge: '+5 lbs / Weighted Vest',
        subtitle: 'Introduce external resistance belt or 2.5–5 lbs chain/vest',
        weightAdd: unit === 'lbs' ? 5 : 2.5,
        getReps: () => Array(numSets).fill(minReps),
        cue: 'Transition to weighted overload: explosive concentric, controlled eccentric.',
        rpe: 'RPE 8.0'
      },
      {
        code: 'new_base' as const,
        title: 'Stage 4: Weighted Rep Consolidation',
        badge: 'Weighted Progression',
        subtitle: 'Re-expand repetitions under external load',
        weightAdd: unit === 'lbs' ? 5 : 2.5,
        getReps: () => Array(numSets).fill(Math.min(maxReps, minReps + 2)),
        cue: 'Volume accumulation at new external load.',
        rpe: 'RPE 8.5'
      },
      {
        code: 'next_ceiling' as const,
        title: 'Stage 5: Weighted Ceiling Benchmark',
        badge: 'High-Water Mark',
        subtitle: `Master all sets at ${maxReps} reps with external load`,
        weightAdd: unit === 'lbs' ? 5 : 2.5,
        getReps: () => Array(numSets).fill(maxReps),
        cue: 'Elite milestone reached. Prepare for next load increment.',
        rpe: 'RPE 9.0'
      }
    ];

    bwStages.forEach((st, idx) => {
      const stageIdx = idx + 1;
      const weight = baseWeight + (st.weightAdd || 0);
      const reps = st.getReps(baseReps);
      const totalReps = reps.reduce((a, b) => a + b, 0);
      const projVol = reps.reduce((sum, r) => sum + (weight * r), 0);
      const volDelta = projVol - baseVolume;
      const volDeltaPct = baseVolume > 0 ? Math.round((volDelta / baseVolume) * 1000) / 10 : 0;
      const projE1RM = calculateE1RM(weight, Math.max(...reps));
      const e1rmDelta = Math.round((projE1RM - baseE1RM) * 10) / 10;
      const isTarget = allReachedCeiling ? (stageIdx === 3) : (stageIdx === 1);

      stages.push({
        stageIndex: stageIdx,
        stageCode: st.code,
        title: st.title,
        badgeLabel: st.badge,
        subtitle: st.subtitle,
        isCurrentTarget: isTarget,
        targetWeight: weight,
        setReps: reps,
        totalReps,
        projectedVolume: projVol,
        volumeDelta: volDelta,
        volumeDeltaPct: volDeltaPct,
        projectedE1RM: projE1RM,
        e1RMDelta: e1rmDelta,
        focusCue: st.cue,
        recommendedRPE: st.rpe,
        statusBadge: isTarget ? 'recommended' : 'next'
      });
    });
  } else {
    // ----------------------------------------------------
    // DOUBLE PROGRESSION ENGINE (Helms / Schoenfeld Model)
    // 1. Fill rep bracket at current weight
    // 2. Once mastered, step weight up by equipment increment
    // 3. Drop reps back to minReps
    // 4. Repeat
    // ----------------------------------------------------

    // Stage 1: Rep Consolidation
    // Bring lagging sets up (e.g. [10, 9, 8] -> [10, 10, 9] or [10, 10, 10])
    const stage1Reps = [...baseReps];
    const minVal = Math.min(...stage1Reps);
    for (let i = 0; i < stage1Reps.length; i++) {
      if (stage1Reps[i] === minVal && stage1Reps[i] < maxReps) {
        stage1Reps[i] += 1;
        break;
      }
    }
    // If already uniform, bump first set or all
    if (stage1Reps.every((r, _, arr) => r === arr[0]) && stage1Reps[0] < maxReps) {
      stage1Reps[0] = Math.min(maxReps, stage1Reps[0] + 1);
    }

    const s1Vol = stage1Reps.reduce((sum, r) => sum + (baseWeight * r), 0);
    const s1DeltaVol = s1Vol - baseVolume;
    const s1E1RM = calculateE1RM(baseWeight, Math.max(...stage1Reps));

    // Stage 2: Rep Ceiling Mastery
    // All sets at maxReps at baseWeight
    const stage2Reps = Array(numSets).fill(maxReps);
    const s2Vol = stage2Reps.reduce((sum, r) => sum + (baseWeight * r), 0);
    const s2DeltaVol = s2Vol - baseVolume;
    const s2E1RM = calculateE1RM(baseWeight, maxReps);

    // Stage 3: Load Jump (+5 lbs / +2.5 kg)
    // Weight goes up, reps drop to minReps
    const jumpWeight = baseWeight + weightIncrement;
    const stage3Reps = Array(numSets).fill(minReps);
    const s3Vol = stage3Reps.reduce((sum, r) => sum + (jumpWeight * r), 0);
    const s3DeltaVol = s3Vol - baseVolume;
    const s3E1RM = calculateE1RM(jumpWeight, minReps);

    // Stage 4: New Base Expansion
    // Halfway through rep bracket at new weight
    const midRep = Math.min(maxReps, minReps + Math.max(1, Math.floor((maxReps - minReps) / 2)));
    const stage4Reps = Array(numSets).fill(midRep);
    const s4Vol = stage4Reps.reduce((sum, r) => sum + (jumpWeight * r), 0);
    const s4DeltaVol = s4Vol - baseVolume;
    const s4E1RM = calculateE1RM(jumpWeight, midRep);

    // Stage 5: Next Ceiling Mastery
    // All sets at maxReps at jumpWeight
    const stage5Reps = Array(numSets).fill(maxReps);
    const s5Vol = stage5Reps.reduce((sum, r) => sum + (jumpWeight * r), 0);
    const s5DeltaVol = s5Vol - baseVolume;
    const s5E1RM = calculateE1RM(jumpWeight, maxReps);

    // Which stage is today's recommended target?
    // If previous session already reached all maxReps, recommended is Stage 3 (Load Jump)
    // If close (within 1 rep), recommended is Stage 2 (Ceiling Mastery)
    // Otherwise Stage 1 (Rep Consolidation)
    const isS3Target = allReachedCeiling;
    const isS2Target = !isS3Target && closeToCeiling;
    const isS1Target = !isS3Target && !isS2Target;

    // Stage 1
    stages.push({
      stageIndex: 1,
      stageCode: 'rep_consolidation',
      title: 'Stage 1: Rep Consolidation',
      badgeLabel: '+1–2 Reps Progress',
      subtitle: `Push reps toward upper bracket (${maxReps} reps) at ${baseWeight} ${unit}`,
      isCurrentTarget: isS1Target,
      targetWeight: baseWeight,
      setReps: stage1Reps,
      totalReps: stage1Reps.reduce((a, b) => a + b, 0),
      projectedVolume: s1Vol,
      volumeDelta: s1DeltaVol,
      volumeDeltaPct: baseVolume > 0 ? Math.round((s1DeltaVol / baseVolume) * 1000) / 10 : 5.0,
      projectedE1RM: s1E1RM,
      e1RMDelta: Math.round((s1E1RM - baseE1RM) * 10) / 10,
      focusCue: 'Keep bar speed high on concentric. Target +1 rep on your final set with crisp technique.',
      recommendedRPE: 'RPE 8.0',
      statusBadge: isS1Target ? 'recommended' : (allReachedCeiling ? 'completed' : 'next')
    });

    // Stage 2
    stages.push({
      stageIndex: 2,
      stageCode: 'ceiling_mastery',
      title: 'Stage 2: Rep Ceiling Mastery',
      badgeLabel: `Master ${maxReps} Reps All Sets`,
      subtitle: `Hit ceiling (${maxReps} reps) across all ${numSets} sets before adding load`,
      isCurrentTarget: isS2Target,
      targetWeight: baseWeight,
      setReps: stage2Reps,
      totalReps: stage2Reps.reduce((a, b) => a + b, 0),
      projectedVolume: s2Vol,
      volumeDelta: s2DeltaVol,
      volumeDeltaPct: baseVolume > 0 ? Math.round((s2DeltaVol / baseVolume) * 1000) / 10 : 15.0,
      projectedE1RM: s2E1RM,
      e1RMDelta: Math.round((s2E1RM - baseE1RM) * 10) / 10,
      focusCue: `Mastery checkpoint: complete all ${numSets} sets at ${maxReps} reps with 1–2 reps in reserve.`,
      recommendedRPE: 'RPE 8.5',
      statusBadge: isS2Target ? 'recommended' : (allReachedCeiling ? 'completed' : 'next')
    });

    // Stage 3
    stages.push({
      stageIndex: 3,
      stageCode: 'load_jump',
      title: `Stage 3: Load Jump (+${weightIncrement} ${unit})`,
      badgeLabel: `Load Step (+${weightIncrement} ${unit})`,
      subtitle: `Advance load to ${jumpWeight} ${unit} and reset reps to base (${minReps} reps)`,
      isCurrentTarget: isS3Target,
      targetWeight: jumpWeight,
      setReps: stage3Reps,
      totalReps: stage3Reps.reduce((a, b) => a + b, 0),
      projectedVolume: s3Vol,
      volumeDelta: s3DeltaVol,
      volumeDeltaPct: baseVolume > 0 ? Math.round((s3DeltaVol / baseVolume) * 1000) / 10 : 8.0,
      projectedE1RM: s3E1RM,
      e1RMDelta: Math.round((s3E1RM - baseE1RM) * 10) / 10,
      focusCue: `Increased mechanical tension. Solid brace before unrack, controlled 3-second eccentric.`,
      recommendedRPE: 'RPE 8.0',
      statusBadge: isS3Target ? 'recommended' : 'next'
    });

    // Stage 4
    stages.push({
      stageIndex: 4,
      stageCode: 'new_base',
      title: 'Stage 4: New Load Consolidation',
      badgeLabel: `Rep Re-build @ ${jumpWeight} ${unit}`,
      subtitle: `Build reps from ${minReps} toward ${maxReps} at new load`,
      isCurrentTarget: false,
      targetWeight: jumpWeight,
      setReps: stage4Reps,
      totalReps: stage4Reps.reduce((a, b) => a + b, 0),
      projectedVolume: s4Vol,
      volumeDelta: s4DeltaVol,
      volumeDeltaPct: baseVolume > 0 ? Math.round((s4DeltaVol / baseVolume) * 1000) / 10 : 18.0,
      projectedE1RM: s4E1RM,
      e1RMDelta: Math.round((s4E1RM - baseE1RM) * 10) / 10,
      focusCue: `Neuromuscular stabilization at ${jumpWeight} ${unit}. Volume expansion phase.`,
      recommendedRPE: 'RPE 8.5',
      statusBadge: 'next'
    });

    // Stage 5
    stages.push({
      stageIndex: 5,
      stageCode: 'next_ceiling',
      title: 'Stage 5: High-Water Ceiling Mastery',
      badgeLabel: `New Ceiling (${maxReps} reps)`,
      subtitle: `Master all sets at ${maxReps} reps @ ${jumpWeight} ${unit}`,
      isCurrentTarget: false,
      targetWeight: jumpWeight,
      setReps: stage5Reps,
      totalReps: stage5Reps.reduce((a, b) => a + b, 0),
      projectedVolume: s5Vol,
      volumeDelta: s5DeltaVol,
      volumeDeltaPct: baseVolume > 0 ? Math.round((s5DeltaVol / baseVolume) * 1000) / 10 : 25.0,
      projectedE1RM: s5E1RM,
      e1RMDelta: Math.round((s5E1RM - baseE1RM) * 10) / 10,
      focusCue: `PR cycle complete! e1RM increased by +${Math.round((s5E1RM - baseE1RM) * 10) / 10} ${unit}. Ready for next load step!`,
      recommendedRPE: 'RPE 9.0',
      statusBadge: 'future'
    });
  }

  // Find recommended next stage
  const recommendedNextStage = stages.find(s => s.isCurrentTarget) || stages[1] || stages[0];

  const progressionPrinciple = isTimedHold
    ? 'Endurance Progression: Expand isometric time-under-tension by 5s increments while preserving rigid pelvic-spinal positioning.'
    : isBodyweight
    ? 'Relative Strength Progression: Maximize strict repetition density across working sets before progressing to external loading.'
    : `Double Progression Method: Lock in ${baseWeight} ${unit} until all ${numSets} sets achieve ${maxReps} reps, then advance load by +${weightIncrement} ${unit} and reset reps to ${minReps}.`;

  return {
    exerciseId,
    exerciseName,
    equipment,
    isTimedHold,
    isBodyweight,
    repBracket: { min: minReps, max: maxReps, unit: repsUnit },
    weightIncrement,
    source,
    previousSession: prevPerf,
    stages,
    recommendedNextStage,
    progressionPrinciple
  };
}
