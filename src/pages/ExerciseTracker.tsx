import { useState, useEffect, useMemo, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  Plus, 
  Trash2, 
  Check, 
  Timer, 
  RotateCcw, 
  Activity, 
  History, 
  TrendingUp, 
  Search, 
  X, 
  Zap, 
  Info, 
  Award, 
  Copy, 
  Play, 
  Pause, 
  Sliders, 
  ExternalLink, 
  Flame, 
  Clock, 
  BookmarkCheck,
  BookOpen,
  Download,
  Upload,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Mail,
  MessageCircle,
  FileSpreadsheet,
  HardDrive,
  Send,
  HelpCircle,
  Edit3,
  Save,
  ArrowUp,
  ArrowDown,
  Sparkles,
  RefreshCw,
  FolderPlus
} from 'lucide-react';
import { 
  EXERCISE_DATABASE, 
  EQUIPMENT_OPTIONS, 
  SPLIT_OPTIONS,
  SPLIT_SUBCATEGORIES_MAP,
  ALL_SUBCATEGORIES,
  WORKOUT_TEMPLATES,
  SplitCategory,
  MuscleSubCategory,
  ExerciseDefinition,
  WorkoutTemplate,
  RoutineTemplate,
  RoutineExerciseConfig
} from '../data/exerciseLibrary';

interface WorkoutSet {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
  type: 'Working' | 'Warmup' | 'Drop Set' | 'Failure';
}

interface ActiveExercise {
  instanceId: string;
  exercise: ExerciseDefinition;
  equipment: string;
  targetSets: number;    // e.g. 3
  targetReps: number;    // e.g. 8
  targetWeight: number;  // e.g. 135 (reactive to all sets)
  minReps: number;
  maxReps: number;
  sets: WorkoutSet[];
  notes?: string;
}

interface CompletedWorkout {
  id: string;
  date: string;
  weekNumber: number;
  year: number;
  title: string;
  durationSeconds: number;
  totalVolume: number; // in lbs/kg
  totalSets: number;
  totalReps: number;
  unit: 'lbs' | 'kg';
  exercises: {
    id: string;
    name: string;
    split: SplitCategory;
    subCategory: MuscleSubCategory;
    equipment: string;
    targetSets: number;
    targetReps: number;
    sets: { weight: number; reps: number; completed: boolean; type: string }[];
  }[];
}

// Helper to calculate ISO week number
function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Routine template & exercise configuration interfaces
export interface PreviousExercisePerformance {
  workoutDate: string;
  workoutTitle: string;
  targetSets: number;
  targetReps: number;
  sets: { weight: number; reps: number; completed: boolean; type: string }[];
  lastWeight: number;
  maxWeight: number;
  avgReps: number;
  summary: string;
}

// Find user's most recent completed session for an exercise from history
export function getPreviousExercisePerformance(
  exerciseId: string,
  exerciseName: string,
  historyList: CompletedWorkout[]
): PreviousExercisePerformance | null {
  for (const workout of historyList) {
    const foundEx = workout.exercises.find(
      e => e.id === exerciseId || e.name.toLowerCase() === exerciseName.toLowerCase()
    );
    if (foundEx && foundEx.sets && foundEx.sets.length > 0) {
      const completedSets = foundEx.sets.filter(s => s.completed);
      if (completedSets.length > 0) {
        const maxWeight = Math.max(...completedSets.map(s => s.weight));
        const lastWeight = completedSets[completedSets.length - 1].weight;
        const avgReps = Math.round(completedSets.reduce((sum, s) => sum + s.reps, 0) / completedSets.length);
        return {
          workoutDate: workout.date,
          workoutTitle: workout.title,
          targetSets: foundEx.targetSets || completedSets.length,
          targetReps: foundEx.targetReps || completedSets[0].reps,
          sets: completedSets,
          lastWeight,
          maxWeight,
          avgReps,
          summary: completedSets.map(s => `${s.weight}×${s.reps}`).join(', ')
        };
      }
    }
  }
  return null;
}

// Factory for default routines
export function getDefaultRoutines(): RoutineTemplate[] {
  return WORKOUT_TEMPLATES.map(tpl => ({
    id: tpl.id,
    name: tpl.name,
    split: tpl.split,
    description: tpl.description,
    exerciseIds: tpl.exerciseIds,
    isCustom: false,
    exerciseConfigs: tpl.exerciseIds.map(exId => {
      const def = EXERCISE_DATABASE.find(e => e.id === exId);
      return {
        exerciseId: exId,
        targetSets: def?.defaultTarget?.targetSets || 3,
        targetReps: def?.defaultTarget?.targetReps || 10,
        targetWeight: def?.defaultTarget?.defaultWeight || 45,
        equipment: def?.defaultEquipment || 'Barbell'
      };
    })
  }));
}

// History-aware routine constructor: automatically pre-populates previous set weights and reps
export function buildRoutineExercises(
  routine: RoutineTemplate,
  historyList: CompletedWorkout[]
): ActiveExercise[] {
  return routine.exerciseIds.map((exId, idx) => {
    const def = EXERCISE_DATABASE.find(e => e.id === exId) || EXERCISE_DATABASE[0];
    const prevPerf = getPreviousExercisePerformance(exId, def.name, historyList);
    const cfg = routine.exerciseConfigs?.find(c => c.exerciseId === exId);

    // If history exists, auto-adjust to user's proven working weights & reps!
    const targetSets = prevPerf ? prevPerf.targetSets : (cfg?.targetSets || def.defaultTarget?.targetSets || 3);
    const targetReps = prevPerf ? prevPerf.targetReps : (cfg?.targetReps || def.defaultTarget?.targetReps || 10);
    const targetWeight = prevPerf ? prevPerf.maxWeight : (cfg?.targetWeight || def.defaultTarget?.defaultWeight || 45);
    const equipment = cfg?.equipment || def.defaultEquipment;

    const sets: WorkoutSet[] = Array.from({ length: targetSets }).map((_, sIdx) => {
      const prevSet = prevPerf?.sets[sIdx];
      return {
        id: `s-${routine.id}-${idx}-${sIdx + 1}-${Date.now()}`,
        setNumber: sIdx + 1,
        weight: prevSet ? prevSet.weight : targetWeight,
        reps: prevSet ? prevSet.reps : targetReps,
        completed: false, // Ready to log
        type: (prevSet?.type as WorkoutSet['type']) || 'Working'
      };
    });

    return {
      instanceId: `inst-${routine.id}-${idx}-${Date.now()}-${idx}`,
      exercise: def,
      equipment,
      targetSets,
      targetReps,
      targetWeight,
      minReps: def.defaultTarget?.minReps || 8,
      maxReps: def.defaultTarget?.maxReps || 12,
      sets
    };
  });
}

// Backward compatibility helper
function buildTemplateExercises(templateId: string, historyList: CompletedWorkout[] = []): ActiveExercise[] {
  const defaultRoutines = getDefaultRoutines();
  const routine = defaultRoutines.find(r => r.id === templateId) || defaultRoutines[0];
  return buildRoutineExercises(routine, historyList);
}

// Seed history so weekly progression is immediately demonstrable
const SEED_HISTORY: CompletedWorkout[] = [
  {
    id: 'seed-wk-prev-upper',
    date: new Date(Date.now() - 7 * 86400000).toISOString(),
    weekNumber: getWeekNumber(new Date(Date.now() - 7 * 86400000)),
    year: new Date().getFullYear(),
    title: 'Upper Day A (Hypertrophy & Strength)',
    durationSeconds: 2820,
    totalVolume: 7420,
    totalSets: 14,
    totalReps: 136,
    unit: 'lbs',
    exercises: [
      {
        id: 'bench-press',
        name: 'Bench Press',
        split: 'Upper Body',
        subCategory: 'Chest',
        equipment: 'Barbell',
        targetSets: 3,
        targetReps: 8,
        sets: [
          { weight: 135, reps: 8, completed: true, type: 'Working' },
          { weight: 135, reps: 8, completed: true, type: 'Working' },
          { weight: 135, reps: 7, completed: true, type: 'Working' }
        ]
      },
      {
        id: 'chest-supported-row',
        name: 'Chest-Supported Row',
        split: 'Upper Body',
        subCategory: 'Back / Lats',
        equipment: 'Machine',
        targetSets: 3,
        targetReps: 10,
        sets: [
          { weight: 90, reps: 10, completed: true, type: 'Working' },
          { weight: 90, reps: 10, completed: true, type: 'Working' },
          { weight: 90, reps: 9, completed: true, type: 'Working' }
        ]
      },
      {
        id: 'incline-dumbbell-press',
        name: 'Incline Dumbbell Press',
        split: 'Upper Body',
        subCategory: 'Chest',
        equipment: 'Dumbbell',
        targetSets: 2,
        targetReps: 10,
        sets: [
          { weight: 50, reps: 10, completed: true, type: 'Working' },
          { weight: 50, reps: 10, completed: true, type: 'Working' }
        ]
      }
    ]
  },
  {
    id: 'seed-wk-prev-lower',
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    weekNumber: getWeekNumber(new Date(Date.now() - 5 * 86400000)),
    year: new Date().getFullYear(),
    title: 'Lower Day A (Squat & Hamstring Focus)',
    durationSeconds: 2950,
    totalVolume: 8200,
    totalSets: 13,
    totalReps: 122,
    unit: 'lbs',
    exercises: [
      {
        id: 'squat-or-leg-press',
        name: 'Squat or Leg Press',
        split: 'Lower Body',
        subCategory: 'Quads',
        equipment: 'Barbell',
        targetSets: 3,
        targetReps: 8,
        sets: [
          { weight: 185, reps: 8, completed: true, type: 'Working' },
          { weight: 185, reps: 8, completed: true, type: 'Working' },
          { weight: 185, reps: 7, completed: true, type: 'Working' }
        ]
      },
      {
        id: 'romanian-deadlift',
        name: 'Romanian Deadlift (RDL)',
        split: 'Lower Body',
        subCategory: 'Hamstrings & Glutes',
        equipment: 'Barbell',
        targetSets: 2,
        targetReps: 10,
        sets: [
          { weight: 135, reps: 10, completed: true, type: 'Working' },
          { weight: 135, reps: 10, completed: true, type: 'Working' }
        ]
      }
    ]
  }
];

// Helper: Format a single workout as clean text
function formatWorkoutText(workout: CompletedWorkout): string {
  const dateStr = new Date(workout.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  let txt = `🏋️ MIT2FIT Workout Report • ${workout.title}\n`;
  txt += `📅 Date: ${dateStr}\n`;
  txt += `⏱️ Duration: ${Math.floor(workout.durationSeconds / 60)} min | Tonnage: ${workout.totalVolume.toLocaleString()} ${workout.unit} | Sets: ${workout.totalSets}\n\n`;
  txt += `Exercises Completed:\n`;
  workout.exercises.forEach(ex => {
    const completed = ex.sets.filter(s => s.completed);
    if (completed.length > 0) {
      txt += `• ${ex.name} (${ex.equipment}):\n`;
      completed.forEach((s, idx) => {
        txt += `   Set ${idx + 1}: ${s.weight} ${workout.unit} × ${s.reps} reps\n`;
      });
    }
  });
  txt += `\nTracked with MIT2FIT Progressive Overload Tracker.`;
  return txt;
}

// Helper: Format weekly summary as clean text
function formatWeeklyText(weekNum: number, workouts: CompletedWorkout[], totalVol: number, totalSets: number, unit: string): string {
  let txt = `📊 MIT2FIT Weekly Progress Report • Week ${weekNum}\n`;
  txt += `🔥 Total Volume: ${totalVol.toLocaleString()} ${unit} lifted\n`;
  txt += `📈 Completed Sets: ${totalSets} across ${workouts.length} session(s)\n\n`;
  txt += `Workouts Logged:\n`;
  workouts.forEach((w, i) => {
    const d = new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    txt += `${i + 1}. ${w.title} (${d}) - ${w.totalVolume.toLocaleString()} ${unit}, ${w.totalSets} sets\n`;
  });
  txt += `\nKeep progressing with Double Overload!`;
  return txt;
}

// Helper: Export history as CSV spreadsheet
function exportCSV(workouts: CompletedWorkout[]) {
  let csv = 'Date,Week,Workout Title,Exercise,Equipment,Set Number,Weight,Reps,Completed\n';
  workouts.forEach(w => {
    const date = new Date(w.date).toISOString().split('T')[0];
    w.exercises.forEach(ex => {
      ex.sets.forEach((s, idx) => {
        csv += `"${date}",${w.weekNumber},"${w.title}","${ex.name}","${ex.equipment}",${idx + 1},${s.weight},${s.reps},${s.completed ? 'Yes' : 'No'}\n`;
      });
    });
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mit2fit-workouts-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const ACTIVE_SESSION_STORAGE_KEY = 'mit2fit_active_session_v2';

interface StoredActiveSession {
  activeExercises: ActiveExercise[];
  sessionTitle: string;
  activeTemplateId: string;
  elapsedSeconds: number;
  hasStartedWorkout: boolean;
  unit: 'lbs' | 'kg';
  savedAt: number;
}

function loadSavedActiveSession(): StoredActiveSession | null {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (raw) {
      const parsed: StoredActiveSession = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.activeExercises) && parsed.activeExercises.length > 0) {
        // Keep active session valid if within last 24 hours
        if (Date.now() - (parsed.savedAt || 0) < 24 * 60 * 60 * 1000) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.error('Failed to load active session from localStorage', e);
  }
  return null;
}

function loadInitialHistory(): CompletedWorkout[] {
  const saved = localStorage.getItem('mit2fit_exercise_logs_v4');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error('Failed to parse history', e);
    }
  }
  return SEED_HISTORY;
}

function loadInitialRoutines(): RoutineTemplate[] {
  const saved = localStorage.getItem('mit2fit_workout_routines_v3');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error('Failed to parse saved routines', e);
    }
  }
  return getDefaultRoutines();
}

export default function ExerciseTracker() {
  const initialSession = useMemo(() => loadSavedActiveSession(), []);

  // Workout History from localStorage (loaded first so routines auto-adjust to it)
  const [history, setHistory] = useState<CompletedWorkout[]>(loadInitialHistory);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem('mit2fit_exercise_logs_v4', JSON.stringify(history));
  }, [history]);

  // Routines state (preset + custom routines)
  const [routines, setRoutines] = useState<RoutineTemplate[]>(loadInitialRoutines);

  // Sync routines to localStorage
  useEffect(() => {
    localStorage.setItem('mit2fit_workout_routines_v3', JSON.stringify(routines));
  }, [routines]);

  const [activeTab, setActiveTab] = useState<'workout' | 'weekly' | 'library' | 'history'>('workout');
  const [unit, setUnit] = useState<'lbs' | 'kg'>(initialSession?.unit || 'lbs');
  const [sessionTitle, setSessionTitle] = useState(initialSession?.sessionTitle || 'Upper Day A (Hypertrophy & Strength)');
  const [activeTemplateId, setActiveTemplateId] = useState<string>(initialSession?.activeTemplateId || 'upper-day-a');
  
  // Stopwatch State: NEVER auto-starts, user initiates via "Start Workout"
  const [elapsedSeconds, setElapsedSeconds] = useState(initialSession?.elapsedSeconds || 0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasStartedWorkout, setHasStartedWorkout] = useState(initialSession?.hasStartedWorkout || false);

  // Active exercises in workout session
  const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>(() => {
    if (initialSession?.activeExercises && initialSession.activeExercises.length > 0) {
      return initialSession.activeExercises;
    }
    const initialRoutines = loadInitialRoutines();
    const initialHist = loadInitialHistory();
    const routine = initialRoutines.find(r => r.id === (initialSession?.activeTemplateId || 'upper-day-a')) || initialRoutines[0];
    return buildRoutineExercises(routine, initialHist);
  });

  // Routine Creator / Editor Modal State
  const [routineModal, setRoutineModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'save_active';
    routineId?: string;
    name: string;
    split: SplitCategory;
    description: string;
    exerciseConfigs: {
      exerciseId: string;
      targetSets: number;
      targetReps: number;
      targetWeight: number;
      equipment: string;
    }[];
    isPickerOpen: boolean;
    pickerSearch: string;
    pickerSplit: string;
  } | null>(null);

  // Rest Timer State
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);
  const [restInitialSeconds, setRestInitialSeconds] = useState(90);

  // Modals & Popups
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGuideExercise, setSelectedGuideExercise] = useState<ExerciseDefinition | null>(null);
  const [completedModalData, setCompletedModalData] = useState<CompletedWorkout | null>(null);
  const [isDataPortalOpen, setIsDataPortalOpen] = useState(false);
  const [alertNotice, setAlertNotice] = useState<string | null>(null);

  // In-App Confirmation Modal (Sandbox & iFrame safe - eliminates window.confirm)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    isDanger?: boolean;
    onConfirm: () => void;
  } | null>(null);

  // Hidden file input for importing workout data
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dynamic Dual-Lens Navigation Filter States
  const [selectedSplit, setSelectedSplit] = useState<string>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [selectedEquipmentFilter, setSelectedEquipmentFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Custom Exercise Creation State
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customSplit, setCustomSplit] = useState<SplitCategory>('Upper Body');
  const [customSubCategory, setCustomSubCategory] = useState<MuscleSubCategory>('Chest');
  const [customEquipment, setCustomEquipment] = useState<string>('Dumbbell');
  const [customTargetSets, setCustomTargetSets] = useState<number>(3);
  const [customTargetReps, setCustomTargetReps] = useState<number>(10);
  const [customStartingWeight, setCustomStartingWeight] = useState<number>(35);

  // Auto-persist active workout session so reloading or closing/reopening browser preserves in-progress sets
  useEffect(() => {
    try {
      const sessionData: StoredActiveSession = {
        activeExercises,
        sessionTitle,
        activeTemplateId,
        elapsedSeconds,
        hasStartedWorkout,
        unit,
        savedAt: Date.now()
      };
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    } catch (e) {
      console.error('Failed to sync active session to localStorage', e);
    }
  }, [activeExercises, sessionTitle, activeTemplateId, elapsedSeconds, hasStartedWorkout, unit]);

  // Workout Duration Stopwatch
  useEffect(() => {
    if (!isTimerRunning) return;
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Rest Timer Countdown & Audio Chime
  useEffect(() => {
    if (restSecondsLeft === null || restSecondsLeft <= 0) return;
    const timer = setInterval(() => {
      setRestSecondsLeft(prev => {
        if (prev === null || prev <= 1) {
          try {
            const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
          } catch (e) {
            // Audio context safely ignored if blocked
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [restSecondsLeft]);

  // Available Subcategories based on selected split (Dynamic Dual-Lens)
  const availableSubCategories = useMemo(() => {
    if (selectedSplit === 'All') {
      return ALL_SUBCATEGORIES;
    }
    return SPLIT_SUBCATEGORIES_MAP[selectedSplit as SplitCategory] || ALL_SUBCATEGORIES;
  }, [selectedSplit]);

  // Reset subcategory if not in the new split
  useEffect(() => {
    if (selectedSplit !== 'All') {
      const allowed = SPLIT_SUBCATEGORIES_MAP[selectedSplit as SplitCategory] || [];
      if (selectedSubCategory !== 'All' && !allowed.includes(selectedSubCategory as MuscleSubCategory)) {
        setSelectedSubCategory('All');
      }
    }
  }, [selectedSplit, selectedSubCategory]);

  // Filtered exercises for Library & Add Modal
  const filteredExercises = useMemo(() => {
    return EXERCISE_DATABASE.filter(ex => {
      const matchesSplit = selectedSplit === 'All' || ex.split === selectedSplit;
      const matchesSubCat = selectedSubCategory === 'All' || ex.subCategory === selectedSubCategory;
      const matchesEquipment = selectedEquipmentFilter === 'All' || 
        ex.defaultEquipment === selectedEquipmentFilter || 
        ex.supportedEquipment.includes(selectedEquipmentFilter);
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.primaryMuscle.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSplit && matchesSubCat && matchesEquipment && matchesSearch;
    });
  }, [selectedSplit, selectedSubCategory, selectedEquipmentFilter, searchQuery]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Workout Summary Metrics
  const totalVolume = activeExercises.reduce((sum, ex) => {
    return sum + ex.sets.reduce((setSum, s) => {
      return s.completed ? setSum + (s.weight * s.reps) : setSum;
    }, 0);
  }, 0);

  const totalCompletedSets = activeExercises.reduce((sum, ex) => {
    return sum + ex.sets.filter(s => s.completed).length;
  }, 0);

  const totalTargetSets = activeExercises.reduce((sum, ex) => sum + ex.targetSets, 0);

  // 1-Click Load Routine with Automatic History Auto-Adjustment
  const handleLoadRoutine = (routineId: string) => {
    const routine = routines.find(r => r.id === routineId) || routines[0];
    if (!routine) return;
    setActiveTemplateId(routine.id);
    setSessionTitle(routine.name);
    setActiveExercises(buildRoutineExercises(routine, history));
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    setHasStartedWorkout(false);
    setAlertNotice(`Loaded "${routine.name}" with history auto-loaded!`);
    setTimeout(() => setAlertNotice(null), 3000);
  };

  const handleLoadTemplate = handleLoadRoutine;

  // Open Routine Creator Modal (from scratch)
  const handleOpenCreateRoutine = () => {
    setRoutineModal({
      isOpen: true,
      mode: 'create',
      name: '',
      split: 'Upper Body',
      description: '',
      exerciseConfigs: [],
      isPickerOpen: false,
      pickerSearch: '',
      pickerSplit: 'All'
    });
  };

  // Open Routine Editor Modal (modify existing routine)
  const handleOpenEditRoutine = (routine: RoutineTemplate) => {
    const configs = routine.exerciseIds.map(exId => {
      const existingCfg = routine.exerciseConfigs?.find(c => c.exerciseId === exId);
      const def = EXERCISE_DATABASE.find(e => e.id === exId);
      const prevPerf = getPreviousExercisePerformance(exId, def?.name || '', history);
      return {
        exerciseId: exId,
        targetSets: existingCfg?.targetSets || prevPerf?.targetSets || def?.defaultTarget?.targetSets || 3,
        targetReps: existingCfg?.targetReps || prevPerf?.targetReps || def?.defaultTarget?.targetReps || 10,
        targetWeight: existingCfg?.targetWeight || prevPerf?.maxWeight || def?.defaultTarget?.defaultWeight || 45,
        equipment: existingCfg?.equipment || def?.defaultEquipment || 'Barbell'
      };
    });

    setRoutineModal({
      isOpen: true,
      mode: 'edit',
      routineId: routine.id,
      name: routine.name,
      split: routine.split,
      description: routine.description,
      exerciseConfigs: configs,
      isPickerOpen: false,
      pickerSearch: '',
      pickerSplit: 'All'
    });
  };

  // Open Routine Modal pre-populated with currently active workout
  const handleOpenSaveActiveAsRoutine = () => {
    const configs = activeExercises.map(ae => ({
      exerciseId: ae.exercise.id,
      targetSets: ae.targetSets,
      targetReps: ae.targetReps,
      targetWeight: ae.targetWeight,
      equipment: ae.equipment
    }));

    setRoutineModal({
      isOpen: true,
      mode: 'save_active',
      name: sessionTitle.includes('Custom') ? sessionTitle : `${sessionTitle} (Custom)`,
      split: activeExercises[0]?.exercise.split || 'Upper Body',
      description: `Custom routine with ${activeExercises.length} exercises`,
      exerciseConfigs: configs,
      isPickerOpen: false,
      pickerSearch: '',
      pickerSplit: 'All'
    });
  };

  // 1-Tap Quick Update: Save current active modifications directly back to the active routine
  const handleQuickUpdateActiveRoutine = () => {
    const currentRoutine = routines.find(r => r.id === activeTemplateId);
    if (!currentRoutine) {
      handleOpenSaveActiveAsRoutine();
      return;
    }
    const updatedConfigs = activeExercises.map(ae => ({
      exerciseId: ae.exercise.id,
      targetSets: ae.targetSets,
      targetReps: ae.targetReps,
      targetWeight: ae.targetWeight,
      equipment: ae.equipment
    }));
    const updatedRoutine: RoutineTemplate = {
      ...currentRoutine,
      exerciseIds: activeExercises.map(ae => ae.exercise.id),
      exerciseConfigs: updatedConfigs,
      description: `${activeExercises.map(e => e.exercise.name).slice(0, 4).join(', ')}${activeExercises.length > 4 ? '...' : ''}`
    };
    setRoutines(prev => prev.map(r => r.id === currentRoutine.id ? updatedRoutine : r));
    setAlertNotice(`Saved changes to "${currentRoutine.name}" routine!`);
    setTimeout(() => setAlertNotice(null), 3000);
  };

  // Save or Update Routine from Modal
  const handleSaveRoutineModal = () => {
    if (!routineModal) return;
    const trimmedName = routineModal.name.trim();
    if (!trimmedName) {
      setAlertNotice('Please provide a name for this routine.');
      setTimeout(() => setAlertNotice(null), 3000);
      return;
    }
    if (routineModal.exerciseConfigs.length === 0) {
      setAlertNotice('Please add at least 1 exercise to this routine.');
      setTimeout(() => setAlertNotice(null), 3000);
      return;
    }

    if (routineModal.mode === 'create' || routineModal.mode === 'save_active') {
      const newId = `routine-${Date.now()}`;
      const newRoutine: RoutineTemplate = {
        id: newId,
        name: trimmedName,
        split: routineModal.split,
        description: routineModal.description || `${routineModal.exerciseConfigs.length} exercises (${routineModal.split})`,
        exerciseIds: routineModal.exerciseConfigs.map(c => c.exerciseId),
        exerciseConfigs: routineModal.exerciseConfigs,
        isCustom: true
      };
      setRoutines(prev => [...prev, newRoutine]);
      setActiveTemplateId(newId);
      setSessionTitle(trimmedName);
      if (routineModal.mode === 'create') {
        setActiveExercises(buildRoutineExercises(newRoutine, history));
      }
      setAlertNotice(`Routine "${trimmedName}" created and loaded!`);
    } else if (routineModal.mode === 'edit' && routineModal.routineId) {
      const updatedRoutine: RoutineTemplate = {
        id: routineModal.routineId,
        name: trimmedName,
        split: routineModal.split,
        description: routineModal.description,
        exerciseIds: routineModal.exerciseConfigs.map(c => c.exerciseId),
        exerciseConfigs: routineModal.exerciseConfigs,
        isCustom: true
      };
      setRoutines(prev => prev.map(r => r.id === routineModal.routineId ? updatedRoutine : r));
      if (activeTemplateId === routineModal.routineId) {
        setSessionTitle(trimmedName);
      }
      setAlertNotice(`Routine "${trimmedName}" updated!`);
    }

    setTimeout(() => setAlertNotice(null), 3000);
    setRoutineModal(null);
  };

  // Delete Routine
  const handleDeleteRoutine = (routineId: string) => {
    const toDelete = routines.find(r => r.id === routineId);
    if (!toDelete) return;

    setConfirmModal({
      isOpen: true,
      title: `Delete Routine "${toDelete.name}"?`,
      message: 'Are you sure you want to delete this routine? Past logged workouts will remain safely intact in your history.',
      confirmText: 'Delete Routine',
      isDanger: true,
      onConfirm: () => {
        setRoutines(prev => {
          const filtered = prev.filter(r => r.id !== routineId);
          if (filtered.length === 0) return getDefaultRoutines();
          return filtered;
        });
        if (activeTemplateId === routineId) {
          const remaining = routines.filter(r => r.id !== routineId);
          const next = remaining[0] || getDefaultRoutines()[0];
          setActiveTemplateId(next.id);
          setSessionTitle(next.name);
          setActiveExercises(buildRoutineExercises(next, history));
        }
        setConfirmModal(null);
        setAlertNotice(`Routine "${toDelete.name}" deleted.`);
        setTimeout(() => setAlertNotice(null), 3000);
      }
    });
  };

  // Restore factory preset routines
  const handleRestoreDefaultRoutines = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset to Factory Routines?',
      message: 'This will restore the 4 default MIT2FIT split templates. Your workout history will remain unaffected.',
      confirmText: 'Restore Defaults',
      isDanger: false,
      onConfirm: () => {
        const defaults = getDefaultRoutines();
        setRoutines(defaults);
        handleLoadRoutine(defaults[0].id);
        setConfirmModal(null);
        setAlertNotice('Default routines restored.');
        setTimeout(() => setAlertNotice(null), 3000);
      }
    });
  };

  // ==============================================================
  // FRICTION-REDUCING OVERLOAD & HISTORY ADJUSTMENT HELPERS
  // ==============================================================
  // 1-Tap Overload Weight (+5 lbs / +2.5 kg) across all uncompleted sets
  const applyOverloadWeightToExercise = (exIdx: number, delta: number) => {
    setActiveExercises(prev => {
      const next = [...prev];
      const ex = next[exIdx];
      const newTarget = Math.max(0, ex.targetWeight + delta);
      next[exIdx] = {
        ...ex,
        targetWeight: newTarget,
        sets: ex.sets.map(s => s.completed ? s : { ...s, weight: Math.max(0, s.weight + delta) })
      };
      return next;
    });
    setAlertNotice(`${delta > 0 ? `+${delta}` : delta} ${unit} overload applied to pending sets!`);
    setTimeout(() => setAlertNotice(null), 2500);
  };

  // 1-Tap Overload Reps (+1 rep) across all uncompleted sets
  const applyOverloadRepsToExercise = (exIdx: number, delta: number) => {
    setActiveExercises(prev => {
      const next = [...prev];
      const ex = next[exIdx];
      const newTarget = Math.max(1, ex.targetReps + delta);
      next[exIdx] = {
        ...ex,
        targetReps: newTarget,
        sets: ex.sets.map(s => s.completed ? s : { ...s, reps: Math.max(1, s.reps + delta) })
      };
      return next;
    });
    setAlertNotice(`${delta > 0 ? `+${delta}` : delta} rep overload applied to pending sets!`);
    setTimeout(() => setAlertNotice(null), 2500);
  };

  // Reset/Match sets to exact numbers from user's last session
  const matchPreviousSessionForExercise = (exIdx: number) => {
    const ex = activeExercises[exIdx];
    const prevPerf = getPreviousExercisePerformance(ex.exercise.id, ex.exercise.name, history);
    if (!prevPerf) return;
    setActiveExercises(prev => {
      const next = [...prev];
      next[exIdx] = {
        ...ex,
        targetWeight: prevPerf.maxWeight,
        targetReps: prevPerf.targetReps,
        sets: ex.sets.map((s, sIdx) => {
          const prevSet = prevPerf.sets[sIdx];
          return {
            ...s,
            weight: prevSet ? prevSet.weight : prevPerf.maxWeight,
            reps: prevSet ? prevSet.reps : prevPerf.targetReps
          };
        })
      };
      return next;
    });
    setAlertNotice(`Restored ${ex.exercise.name} sets to last session (${prevPerf.summary})`);
    setTimeout(() => setAlertNotice(null), 3000);
  };

  // 1-Tap apply previous set's weight & reps to this specific set
  const applyPreviousSetToCurrent = (exIdx: number, sIdx: number, prevSet: { weight: number; reps: number }) => {
    setActiveExercises(prev => {
      const next = [...prev];
      next[exIdx].sets[sIdx] = {
        ...next[exIdx].sets[sIdx],
        weight: prevSet.weight,
        reps: prevSet.reps
      };
      return next;
    });
    setAlertNotice(`Set ${sIdx + 1} set to ${prevSet.weight} ${unit} × ${prevSet.reps} reps`);
    setTimeout(() => setAlertNotice(null), 2000);
  };

  // ==============================================================
  // REACTIVE TARGET SETTERS (Changes automatically apply to sets)
  // ==============================================================
  const updateTargetSets = (exIdx: number, delta: number) => {
    setActiveExercises(prev => {
      const next = [...prev];
      const ex = next[exIdx];
      const newTarget = Math.max(1, Math.min(8, ex.targetSets + delta));
      if (newTarget === ex.targetSets) return prev;

      const currentSets = [...ex.sets];
      if (newTarget > currentSets.length) {
        const toAdd = newTarget - currentSets.length;
        for (let i = 0; i < toAdd; i++) {
          currentSets.push({
            id: `s-${Date.now()}-${currentSets.length + 1}`,
            setNumber: currentSets.length + 1,
            weight: ex.targetWeight,
            reps: ex.targetReps,
            completed: false,
            type: 'Working'
          });
        }
      } else if (newTarget < currentSets.length) {
        const uncompletedIndices: number[] = [];
        currentSets.forEach((s, idx) => {
          if (!s.completed) uncompletedIndices.push(idx);
        });
        const trimCount = currentSets.length - newTarget;
        for (let i = 0; i < trimCount && uncompletedIndices.length > 0; i++) {
          const removeIdx = uncompletedIndices.pop()!;
          currentSets.splice(removeIdx, 1);
        }
        currentSets.forEach((s, idx) => {
          s.setNumber = idx + 1;
        });
      }

      next[exIdx] = {
        ...ex,
        targetSets: newTarget,
        sets: currentSets
      };
      return next;
    });
  };

  const updateTargetReps = (exIdx: number, delta: number) => {
    setActiveExercises(prev => {
      const next = [...prev];
      const ex = next[exIdx];
      const newTarget = Math.max(1, ex.targetReps + delta);

      const updatedSets = ex.sets.map(s => {
        if (!s.completed) {
          return { ...s, reps: newTarget };
        }
        return s;
      });

      next[exIdx] = {
        ...ex,
        targetReps: newTarget,
        sets: updatedSets
      };
      return next;
    });
  };

  const updateTargetWeight = (exIdx: number, delta: number) => {
    setActiveExercises(prev => {
      const next = [...prev];
      const ex = next[exIdx];
      const newWeight = Math.max(0, ex.targetWeight + delta);

      const updatedSets = ex.sets.map(s => {
        if (!s.completed) {
          return { ...s, weight: newWeight };
        }
        return s;
      });

      next[exIdx] = {
        ...ex,
        targetWeight: newWeight,
        sets: updatedSets
      };
      return next;
    });
  };

  const updateIndividualSetWeight = (exIdx: number, setIdx: number, delta: number) => {
    setActiveExercises(prev => {
      const next = [...prev];
      const targetSet = next[exIdx].sets[setIdx];
      const newWeight = Math.max(0, targetSet.weight + delta);
      next[exIdx].sets[setIdx] = { ...targetSet, weight: newWeight };
      return next;
    });
  };

  const updateIndividualSetReps = (exIdx: number, setIdx: number, delta: number) => {
    setActiveExercises(prev => {
      const next = [...prev];
      const targetSet = next[exIdx].sets[setIdx];
      const newReps = Math.max(0, targetSet.reps + delta);
      next[exIdx].sets[setIdx] = { ...targetSet, reps: newReps };
      return next;
    });
  };

  const toggleSetCompleted = (exIdx: number, setIdx: number) => {
    if (!hasStartedWorkout) {
      setHasStartedWorkout(true);
      setIsTimerRunning(true);
    }

    setActiveExercises(prev => {
      const next = [...prev];
      const targetSet = next[exIdx].sets[setIdx];
      const willBeCompleted = !targetSet.completed;
      next[exIdx].sets[setIdx] = { ...targetSet, completed: willBeCompleted };
      
      if (willBeCompleted) {
        setRestSecondsLeft(restInitialSeconds);
      }
      return next;
    });
  };

  const cloneSet = (exIdx: number, setIdx: number) => {
    setActiveExercises(prev => {
      const next = [...prev];
      const prevSet = next[exIdx].sets[setIdx];
      const newSet: WorkoutSet = {
        id: `set-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        setNumber: next[exIdx].sets.length + 1,
        weight: prevSet.weight,
        reps: prevSet.reps,
        completed: false,
        type: prevSet.type
      };
      next[exIdx].sets.push(newSet);
      next[exIdx].targetSets = next[exIdx].sets.length;
      return next;
    });
  };

  const removeSet = (exIdx: number, setIdx: number) => {
    setActiveExercises(prev => {
      const next = [...prev];
      if (next[exIdx].sets.length <= 1) return prev;
      next[exIdx].sets = next[exIdx].sets.filter((_, i) => i !== setIdx).map((s, idx) => ({
        ...s,
        setNumber: idx + 1
      }));
      next[exIdx].targetSets = next[exIdx].sets.length;
      return next;
    });
  };

  const addSet = (exIdx: number) => {
    setActiveExercises(prev => {
      const next = [...prev];
      const ex = next[exIdx];
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSet: WorkoutSet = {
        id: `set-${Date.now()}`,
        setNumber: ex.sets.length + 1,
        weight: lastSet ? lastSet.weight : ex.targetWeight,
        reps: lastSet ? lastSet.reps : ex.targetReps,
        completed: false,
        type: 'Working'
      };
      ex.sets.push(newSet);
      ex.targetSets = ex.sets.length;
      return next;
    });
  };

  const removeExercise = (instanceId: string) => {
    setActiveExercises(prev => prev.filter(e => e.instanceId !== instanceId));
  };

  const addExerciseToWorkout = (exercise: ExerciseDefinition, equipment: string) => {
    const prevPerf = getPreviousExercisePerformance(exercise.id, exercise.name, history);
    const targetSets = prevPerf ? prevPerf.targetSets : (exercise.defaultTarget?.targetSets || 3);
    const targetReps = prevPerf ? prevPerf.targetReps : (exercise.defaultTarget?.targetReps || 10);
    const defaultWeight = prevPerf ? prevPerf.maxWeight : (exercise.defaultTarget?.defaultWeight || 45);

    const newActive: ActiveExercise = {
      instanceId: `inst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      exercise,
      equipment,
      targetSets,
      targetReps,
      targetWeight: defaultWeight,
      minReps: exercise.defaultTarget?.minReps || 8,
      maxReps: exercise.defaultTarget?.maxReps || 12,
      sets: Array.from({ length: targetSets }).map((_, sIdx) => {
        const prevSet = prevPerf?.sets[sIdx];
        return {
          id: `s-${Date.now()}-${sIdx + 1}`,
          setNumber: sIdx + 1,
          weight: prevSet ? prevSet.weight : defaultWeight,
          reps: prevSet ? prevSet.reps : targetReps,
          completed: false,
          type: (prevSet?.type as WorkoutSet['type']) || 'Working'
        };
      })
    };
    setActiveExercises(prev => [...prev, newActive]);
    setIsAddModalOpen(false);
    if (prevPerf) {
      setAlertNotice(`Added ${exercise.name} with previous session (${prevPerf.maxWeight} ${unit} × ${prevPerf.targetReps}) auto-loaded!`);
      setTimeout(() => setAlertNotice(null), 3500);
    }
  };

  // Progression advice engine
  const evaluateProgression = (activeEx: ActiveExercise) => {
    const workingSets = activeEx.sets.filter(s => s.type === 'Working');
    const completedWorkingSets = workingSets.filter(s => s.completed);
    const completedHittingTarget = completedWorkingSets.filter(s => s.reps >= activeEx.targetReps);
    const allTargetCompleted = completedHittingTarget.length >= activeEx.targetSets;

    const topWeight = completedWorkingSets.length > 0 
      ? Math.max(...completedWorkingSets.map(s => s.weight))
      : activeEx.targetWeight;

    const repsSuffix = activeEx.exercise.defaultTarget?.repsUnit 
      ? ` ${activeEx.exercise.defaultTarget.repsUnit}` 
      : ' reps';

    if (allTargetCompleted) {
      if (activeEx.targetSets === 2) {
        return {
          status: 'ready-add-set',
          badge: 'Step 1 Hit: Expand Sets',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          advice: `Mastered 2 sets of ${activeEx.targetReps}${repsSuffix}! Next session: Add a 3rd set at ${topWeight} ${unit} before increasing weight.`,
          actionLabel: 'Advance to 3 Sets',
          action: () => updateTargetSets(activeExercises.findIndex(e => e.instanceId === activeEx.instanceId), 1)
        };
      } else {
        return {
          status: 'ready-add-weight',
          badge: 'Step 2 Hit: Overload Weight',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          advice: `Incredible! Completed all ${activeEx.targetSets} sets @ ${activeEx.targetReps}${repsSuffix}. You earned a weight increase of +5 ${unit} (+2.5 kg) for next week!`,
          actionLabel: `+5 ${unit} Next Week`,
          action: () => {}
        };
      }
    }

    if (completedWorkingSets.length > 0) {
      const avgReps = Math.round(
        completedWorkingSets.reduce((sum, s) => sum + s.reps, 0) / completedWorkingSets.length
      );
      return {
        status: 'building',
        badge: `${completedWorkingSets.length}/${activeEx.targetSets} Sets Logged`,
        color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        advice: `Averaging ${avgReps}${repsSuffix}. Keep weight at ${topWeight} ${unit}. Focus on hitting ${activeEx.targetReps} clean reps across all sets.`,
        actionLabel: null,
        action: null
      };
    }

    return {
      status: 'pending',
      badge: `Target: ${activeEx.targetSets} sets × ${activeEx.minReps}–${activeEx.maxReps}${repsSuffix}`,
      color: 'text-stone-400 bg-stone-800 border-stone-700',
      advice: `Target is ${activeEx.targetSets} sets of ${activeEx.minReps}–${activeEx.maxReps}${repsSuffix}. Check off sets as you complete them to receive coaching advice.`,
      actionLabel: null,
      action: null
    };
  };

  // Finish Workout
  const handleFinishWorkout = () => {
    const now = new Date();
    const workoutRecord: CompletedWorkout = {
      id: `workout-${Date.now()}`,
      date: now.toISOString(),
      weekNumber: getWeekNumber(now),
      year: now.getFullYear(),
      title: sessionTitle || 'MIT2FIT Workout Session',
      durationSeconds: elapsedSeconds,
      totalVolume,
      totalSets: totalCompletedSets,
      totalReps: activeExercises.reduce((sum, ex) => {
        return sum + ex.sets.reduce((setSum, s) => s.completed ? setSum + s.reps : setSum, 0);
      }, 0),
      unit,
      exercises: activeExercises.map(ex => ({
        id: ex.exercise.id,
        name: ex.exercise.name,
        split: ex.exercise.split,
        subCategory: ex.exercise.subCategory,
        equipment: ex.equipment,
        targetSets: ex.targetSets,
        targetReps: ex.targetReps,
        sets: ex.sets.map(s => ({ weight: s.weight, reps: s.reps, completed: s.completed, type: s.type }))
      }))
    };

    setHistory(prev => [workoutRecord, ...prev]);
    setCompletedModalData(workoutRecord);
    setIsTimerRunning(false);
    setHasStartedWorkout(false);
    setElapsedSeconds(0);
    setActiveExercises(prev => prev.map(ex => ({
      ...ex,
      sets: ex.sets.map(s => ({ ...s, completed: false }))
    })));
    try {
      localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Dispatchers: Send via WhatsApp, Email, or Clipboard
  const handleSendWhatsApp = (text: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendEmail = (subject: string, text: string) => {
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setAlertNotice(`${label} copied to clipboard! Paste anywhere.`);
    setTimeout(() => setAlertNotice(null), 4000);
  };

  // Export JSON Backup
  const handleExportData = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mit2fit-workouts-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setAlertNotice('Backup JSON exported! Keep this file safe.');
    setTimeout(() => setAlertNotice(null), 4000);
  };

  // Import JSON Backup
  const handleImportData = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
          setAlertNotice(`Restored ${parsed.length} workouts successfully!`);
          setTimeout(() => setAlertNotice(null), 4000);
        }
      } catch (err) {
        setAlertNotice('Invalid backup file. Please select a valid JSON export.');
        setTimeout(() => setAlertNotice(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Delete single workout from history (In-app confirmation modal, sandbox-safe)
  const deleteHistoryItem = (workoutId: string, title?: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Workout Session?',
      message: `Are you sure you want to remove ${title ? `"${title}"` : 'this workout'} from your history log? This action cannot be undone.`,
      confirmText: 'Delete Workout',
      isDanger: true,
      onConfirm: () => {
        setHistory(prev => {
          const updated = prev.filter(w => w.id !== workoutId);
          localStorage.setItem('mit2fit_exercise_logs_v4', JSON.stringify(updated));
          return updated;
        });
        setAlertNotice('Workout removed from history.');
        setTimeout(() => setAlertNotice(null), 3000);
        setConfirmModal(null);
      }
    });
  };

  // Clear all workout history (In-app confirmation modal, sandbox-safe)
  const clearAllHistory = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear All Workout History?',
      message: 'Are you sure you want to permanently delete ALL logged workouts from this browser? This action cannot be undone.',
      confirmText: 'Clear All History',
      isDanger: true,
      onConfirm: () => {
        setHistory([]);
        localStorage.setItem('mit2fit_exercise_logs_v4', JSON.stringify([]));
        setAlertNotice('All workout history has been cleared.');
        setTimeout(() => setAlertNotice(null), 3000);
        setConfirmModal(null);
      }
    });
  };

  // Reset current in-progress routine (In-app confirmation modal, sandbox-safe)
  const handleResetActiveRoutine = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Active Routine Session?',
      message: 'This will reset the workout stopwatch to 00:00 and uncheck all completed sets for this session.',
      confirmText: 'Reset Session',
      isDanger: false,
      onConfirm: () => {
        setIsTimerRunning(false);
        setHasStartedWorkout(false);
        setElapsedSeconds(0);
        setActiveExercises(prev => prev.map(ex => ({
          ...ex,
          sets: ex.sets.map(s => ({ ...s, completed: false }))
        })));
        try {
          localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
        } catch (e) {
          console.error(e);
        }
        setAlertNotice('Current session reset.');
        setTimeout(() => setAlertNotice(null), 3000);
        setConfirmModal(null);
      }
    });
  };

  // Weekly Aggregations
  const currentWeekNumber = getWeekNumber(new Date());
  const currentYear = new Date().getFullYear();

  const thisWeekWorkouts = history.filter(w => w.weekNumber === currentWeekNumber && w.year === currentYear);
  const lastWeekWorkouts = history.filter(
    w => w.weekNumber === (currentWeekNumber - 1 <= 0 ? 52 : currentWeekNumber - 1)
  );

  const thisWeekVolume = thisWeekWorkouts.reduce((sum, w) => sum + w.totalVolume, 0) + totalVolume;
  const lastWeekVolume = lastWeekWorkouts.reduce((sum, w) => sum + w.totalVolume, 0);

  const thisWeekSets = thisWeekWorkouts.reduce((sum, w) => sum + w.totalSets, 0) + totalCompletedSets;
  const lastWeekSets = lastWeekWorkouts.reduce((sum, w) => sum + w.totalSets, 0);

  const volumeGrowthPercent = lastWeekVolume > 0 
    ? Math.round(((thisWeekVolume - lastWeekVolume) / lastWeekVolume) * 100) 
    : 100;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pt-20 pb-28">
      {/* Top Banner / Session Header */}
      <div className="border-b border-stone-800 bg-stone-900/60 backdrop-blur sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  className="bg-transparent text-lg font-bold text-white focus:outline-none focus:border-b border-amber-500 px-1"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 mt-0.5">
                <span className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {formatTime(elapsedSeconds)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  {totalCompletedSets} / {totalTargetSets} Sets
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  {totalVolume.toLocaleString()} {unit} Volume
                </span>

                {/* Local Storage Indicator Pill */}
                <button
                  onClick={() => setIsDataPortalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] hover:bg-emerald-500/20 transition cursor-pointer"
                  title="Click to view local browser storage & data options"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Saved to Device</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs, Stopwatch Controls & Unit Toggle */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Primary Start / Pause Stopwatch Button */}
            {!hasStartedWorkout ? (
              <button
                onClick={() => {
                  setHasStartedWorkout(true);
                  setIsTimerRunning(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Workout
              </button>
            ) : (
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  isTimerRunning 
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30' 
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                }`}
                title={isTimerRunning ? 'Pause Stopwatch' : 'Resume Stopwatch'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
              </button>
            )}

            <div className="bg-stone-950 p-1 rounded-xl border border-stone-800 flex items-center text-xs">
              <button
                onClick={() => setActiveTab('workout')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeTab === 'workout' 
                    ? 'bg-amber-500 text-stone-950 shadow-sm' 
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Active Routine ({activeExercises.length})
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'weekly' 
                    ? 'bg-amber-500 text-stone-950 shadow-sm' 
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Weekly Progression
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'library' 
                    ? 'bg-amber-500 text-stone-950 shadow-sm' 
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Exercise Guide ({EXERCISE_DATABASE.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeTab === 'history' 
                    ? 'bg-amber-500 text-stone-950 shadow-sm' 
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                History ({history.length})
              </button>
            </div>

            {/* lbs / kg Switcher */}
            <button
              onClick={() => setUnit(unit === 'lbs' ? 'kg' : 'lbs')}
              className="px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-stone-800 bg-stone-900 text-stone-300 hover:border-amber-500/50 transition"
              title="Toggle Unit"
            >
              {unit.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Live Rest Timer Progress Bar */}
        {restSecondsLeft !== null && (
          <div className="bg-amber-500/10 border-t border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Timer className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="font-medium text-stone-200">
                Rest Period: <strong className="font-mono text-amber-400 text-sm ml-1">{formatTime(restSecondsLeft)}</strong>
              </span>
              <div className="flex items-center gap-1">
                {[60, 90, 120, 180].map(s => (
                  <button
                    key={s}
                    onClick={() => setRestSecondsLeft(s)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      restSecondsLeft === s ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setRestSecondsLeft(null)}
              className="text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Skip
            </button>
          </div>
        )}

        {/* Floating Notification / Confirmation Banner */}
        {alertNotice && (
          <div className="bg-emerald-950/90 border-t border-emerald-500/40 px-4 py-2 flex items-center justify-center gap-2 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{alertNotice}</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ============================================================== */}
        {/* TAB 1: ACTIVE WORKOUT ROUTINE                                  */}
        {/* ============================================================== */}
        {activeTab === 'workout' && (
          <div className="space-y-6">
            {/* Split Presets & Custom Routines Switcher Bar */}
            <div className="bg-stone-900/50 p-4 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                    Active Routines & Splits:
                  </span>
                  <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full font-mono">
                    {routines.length} saved
                  </span>
                </div>
                
                {/* Routine Controls: Add New Routine, Save Current as Routine, Reset */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleOpenCreateRoutine}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition"
                    title="Create a brand new routine from scratch"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Routine</span>
                  </button>

                  <button
                    onClick={handleOpenSaveActiveAsRoutine}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded-xl text-xs font-medium transition"
                    title="Save current workout exercises as a new routine"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Save Current as Routine</span>
                  </button>

                  <button
                    onClick={handleQuickUpdateActiveRoutine}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 rounded-xl text-xs font-medium transition"
                    title="Save current sets and exercises into active routine"
                  >
                    <Save className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden md:inline">Save to Active</span>
                  </button>

                  <button
                    onClick={handleRestoreDefaultRoutines}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-stone-300 hover:bg-stone-800 transition text-[11px]"
                    title="Restore default MIT2FIT routines"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Routine Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {routines.map(tpl => {
                  const isActive = activeTemplateId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      className={`relative group p-3 rounded-xl border text-xs transition flex flex-col justify-between gap-2 ${
                        isActive 
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm' 
                          : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
                      }`}
                    >
                      <button
                        onClick={() => handleLoadRoutine(tpl.id)}
                        className="text-left w-full flex-grow flex flex-col justify-between gap-1 pr-14"
                      >
                        <div className="font-bold flex items-center justify-between gap-1">
                          <span className="truncate">{tpl.name}</span>
                          {isActive && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                          <span>{tpl.exerciseIds.length} Exercises</span>
                          <span>•</span>
                          <span className="text-stone-400">{tpl.split}</span>
                          {tpl.isCustom && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded font-semibold">
                              Custom
                            </span>
                          )}
                        </div>
                      </button>

                      {/* Card Edit & Delete Actions */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditRoutine(tpl);
                          }}
                          className="p-1 rounded bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-amber-300 border border-stone-800 transition"
                          title="Modify and save routine"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        {tpl.isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRoutine(tpl.id);
                            }}
                            className="p-1 rounded bg-stone-900/80 hover:bg-red-950/80 text-stone-500 hover:text-red-400 border border-stone-800 transition"
                            title="Delete custom routine"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Workout Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-900/40 p-4 rounded-2xl border border-stone-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-500" />
                    {sessionTitle}
                  </h2>
                  <button
                    onClick={() => {
                      const current = routines.find(r => r.id === activeTemplateId);
                      if (current) handleOpenEditRoutine(current);
                      else handleOpenSaveActiveAsRoutine();
                    }}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-amber-400 border border-stone-700 transition"
                    title="Modify this routine"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-stone-400">
                  Target weights & reps automatically adjust from your past history. Tap + / - to adjust without retyping.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleQuickUpdateActiveRoutine}
                  className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                  title="Save current sets and exercises into active routine"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Save Routine Changes</span>
                </button>
                {(hasStartedWorkout || totalCompletedSets > 0 || elapsedSeconds > 0) && (
                  <button
                    onClick={handleResetActiveRoutine}
                    className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                    title="Discard current session and reset stopwatch"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset Session</span>
                  </button>
                )}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Add Exercise
                </button>
                <button
                  onClick={handleFinishWorkout}
                  disabled={totalCompletedSets === 0}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-white font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-600/20"
                >
                  <Check className="w-4 h-4" />
                  Finish & Save
                </button>
              </div>
            </div>

            {/* Exercise Cards List */}
            {activeExercises.length === 0 ? (
              <div className="text-center py-16 bg-stone-900/30 rounded-3xl border border-stone-800/80 p-8">
                <Dumbbell className="w-12 h-12 text-stone-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-stone-300">Your routine is currently empty</h3>
                <p className="text-sm text-stone-500 max-w-md mx-auto mt-1 mb-6">
                  Select a pre-built split above or add an exercise from the library.
                </p>
                <button
                  onClick={() => handleLoadTemplate('upper-day-a')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-stone-950 font-bold rounded-xl text-sm hover:bg-amber-400 transition"
                >
                  <Plus className="w-4 h-4" />
                  Load Upper Day A
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {activeExercises.map((activeEx, exIdx) => {
                  const progressionAdvice = evaluateProgression(activeEx);
                  const completedWorkingCount = activeEx.sets.filter(s => s.completed && s.type === 'Working').length;
                  const targetHitCount = activeEx.sets.filter(s => s.completed && s.type === 'Working' && s.reps >= activeEx.targetReps).length;
                  const repsUnit = activeEx.exercise.defaultTarget?.repsUnit || 'reps';
                  const prevPerf = getPreviousExercisePerformance(activeEx.exercise.id, activeEx.exercise.name, history);

                  return (
                    <div 
                      key={activeEx.instanceId}
                      className="bg-stone-900/70 border border-stone-800 rounded-2xl overflow-hidden shadow-xl transition-all"
                    >
                      {/* Exercise Header & Reactive Setup Controls */}
                      <div className="p-4 sm:p-5 border-b border-stone-800/80 bg-stone-900/90 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-white tracking-tight">
                              {activeEx.exercise.name}
                            </h3>
                            {/* Dynamic Taxonomy Tags */}
                            <span className="text-[11px] font-semibold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                              {activeEx.exercise.split}
                            </span>
                            <span className="text-[11px] font-medium text-stone-300 px-2 py-0.5 rounded bg-stone-800 border border-stone-700">
                              {activeEx.exercise.subCategory}
                            </span>
                            <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40">
                              {activeEx.equipment}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
                            <span>Prime: <strong className="text-stone-300">{activeEx.exercise.primaryMuscle}</strong></span>
                            <span>•</span>
                            <span className="text-amber-400/90 font-mono font-semibold">
                              Window: {activeEx.minReps}–{activeEx.maxReps} {repsUnit}
                            </span>
                          </div>

                          {/* Friction-Eliminating History Summary & 1-Tap Overload Bumps */}
                          {prevPerf ? (
                            <div className="mt-2 flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800/60">
                              <div className="flex items-center gap-1.5 text-xs text-stone-300 bg-stone-950/80 px-2 py-1 rounded-lg border border-stone-800">
                                <History className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-[11px] text-stone-400">Last Session:</span>
                                <span className="font-mono font-bold text-amber-300">{prevPerf.summary} {unit}</span>
                                <span className="text-[10px] text-stone-500">({new Date(prevPerf.workoutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})</span>
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => applyOverloadWeightToExercise(exIdx, unit === 'lbs' ? 5 : 2.5)}
                                  className="px-2 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 hover:bg-emerald-900/80 text-emerald-300 text-[11px] font-bold font-mono transition flex items-center gap-1 shadow-sm"
                                  title="Add 5 lbs (or 2.5 kg) across all uncompleted sets"
                                >
                                  <Sparkles className="w-3 h-3 text-emerald-400" />
                                  +{unit === 'lbs' ? '5' : '2.5'} {unit} All
                                </button>
                                <button
                                  type="button"
                                  onClick={() => applyOverloadRepsToExercise(exIdx, 1)}
                                  className="px-2 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 hover:bg-cyan-900/80 text-cyan-300 text-[11px] font-bold font-mono transition flex items-center gap-1 shadow-sm"
                                  title="Add 1 rep across all uncompleted sets"
                                >
                                  <Sparkles className="w-3 h-3 text-cyan-400" />
                                  +1 Rep All
                                </button>
                                <button
                                  type="button"
                                  onClick={() => matchPreviousSessionForExercise(exIdx)}
                                  className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-medium transition flex items-center gap-1"
                                  title="Restore sets to match previous session"
                                >
                                  <RefreshCw className="w-3 h-3 text-stone-400" />
                                  Match Last
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              <span>First session for this exercise • Baseline target will be saved to your history</span>
                            </div>
                          )}
                        </div>

                        {/* REACTIVE SETUP CONTROLS (Directly affects all sets below) */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          {/* 1. Target Sets Stepper */}
                          <div className="flex items-center gap-1.5 bg-stone-950 px-2.5 py-1.5 rounded-xl border border-stone-800 text-xs">
                            <span className="text-stone-400 font-medium">Sets:</span>
                            <button 
                              onClick={() => updateTargetSets(exIdx, -1)}
                              className="w-5 h-5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold"
                              title="Decrease target sets (trims pending set)"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-amber-400 px-1">
                              {activeEx.targetSets}
                            </span>
                            <button 
                              onClick={() => updateTargetSets(exIdx, 1)}
                              className="w-5 h-5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold"
                              title="Increase target sets (adds new set)"
                            >
                              +
                            </button>
                          </div>

                          {/* 2. Target Reps Stepper */}
                          <div className="flex items-center gap-1.5 bg-stone-950 px-2.5 py-1.5 rounded-xl border border-stone-800 text-xs">
                            <span className="text-stone-400 font-medium">Reps:</span>
                            <button 
                              onClick={() => updateTargetReps(exIdx, -1)}
                              className="w-5 h-5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold"
                              title="Decrease target reps for all pending sets"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-amber-400 px-1">
                              {activeEx.targetReps}
                            </span>
                            <button 
                              onClick={() => updateTargetReps(exIdx, 1)}
                              className="w-5 h-5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold"
                              title="Increase target reps for all pending sets"
                            >
                              +
                            </button>
                          </div>

                          {/* 3. Target Weight Stepper (Updates all pending sets) */}
                          <div className="flex items-center gap-1.5 bg-stone-950 px-2.5 py-1.5 rounded-xl border border-stone-800 text-xs">
                            <span className="text-stone-400 font-medium">Weight ({unit}):</span>
                            <button 
                              onClick={() => updateTargetWeight(exIdx, -5)}
                              className="w-6 h-5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-[11px] flex items-center justify-center font-bold"
                              title="Minus 5"
                            >
                              -5
                            </button>
                            <input
                              type="number"
                              value={activeEx.targetWeight}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                updateTargetWeight(exIdx, val - activeEx.targetWeight);
                              }}
                              className="w-14 bg-stone-900 border border-stone-700 text-center font-mono font-bold text-amber-400 text-xs rounded py-0.5 focus:outline-none focus:border-amber-500"
                              title="Target weight applied to all uncompleted sets"
                            />
                            <button 
                              onClick={() => updateTargetWeight(exIdx, 5)}
                              className="w-6 h-5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-[11px] flex items-center justify-center font-bold"
                              title="Plus 5"
                            >
                              +5
                            </button>
                          </div>

                          {/* Clean Form Guide & Biomechanics Modal Link */}
                          <button
                            onClick={() => setSelectedGuideExercise(activeEx.exercise)}
                            className="p-2 rounded-xl border border-stone-700 bg-stone-800/80 text-xs text-stone-300 hover:text-amber-400 hover:border-amber-500/40 flex items-center gap-1.5 transition"
                            title="Open Exercise Execution Guide & Form Cues"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                            <span className="hidden sm:inline">Guide & Cues</span>
                          </button>

                          {/* Remove Exercise */}
                          <button
                            onClick={() => removeExercise(activeEx.instanceId)}
                            className="p-2 text-stone-500 hover:text-red-400 transition rounded-xl hover:bg-stone-800"
                            title="Remove Exercise"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Double Progression Coach Bar */}
                      <div className={`px-4 py-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${progressionAdvice.color}`}>
                        <div className="flex items-start sm:items-center gap-2">
                          <Zap className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" />
                          <div>
                            <span className="font-bold mr-2 uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-black/30">
                              {progressionAdvice.badge}
                            </span>
                            <span className="text-stone-200">
                              {progressionAdvice.advice}
                            </span>
                          </div>
                        </div>

                        {progressionAdvice.actionLabel && (
                          <button
                            onClick={progressionAdvice.action || undefined}
                            className="self-start sm:self-center px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs whitespace-nowrap transition"
                          >
                            {progressionAdvice.actionLabel}
                          </button>
                        )}
                      </div>

                      {/* Interactive Sets Table */}
                      <div className="p-4 sm:p-5">
                        {/* Target Progress Bar */}
                        <div className="mb-4 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-stone-400">Progress:</span>
                            <span className="font-bold text-white font-mono">
                              {completedWorkingCount} of {activeEx.targetSets} sets completed
                            </span>
                            {targetHitCount >= activeEx.targetSets && (
                              <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                                <Check className="w-3.5 h-3.5" /> Target Achieved!
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {Array.from({ length: activeEx.targetSets }).map((_, i) => (
                              <div 
                                key={i}
                                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                                  i < targetHitCount
                                    ? 'bg-emerald-500 border-emerald-400 text-stone-950'
                                    : i < completedWorkingCount
                                    ? 'bg-amber-500 border-amber-400 text-stone-950'
                                    : 'border-stone-700 bg-stone-800'
                                }`}
                              >
                                {i < targetHitCount && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Sets Grid */}
                        <div className="space-y-2">
                          <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 pb-1 border-b border-stone-800">
                            <div className="col-span-1 text-center">Set</div>
                            <div className="col-span-2">Type</div>
                            <div className="col-span-4 text-center">Weight ({unit})</div>
                            <div className="col-span-3 text-center">Reps ({repsUnit})</div>
                            <div className="col-span-2 text-right">Log / Copy</div>
                          </div>

                          {activeEx.sets.map((set, sIdx) => {
                            const prevSet = prevPerf?.sets[sIdx];
                            return (
                              <div 
                                key={set.id}
                                className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl transition ${
                                  set.completed 
                                    ? 'bg-emerald-950/20 border border-emerald-500/20' 
                                    : 'bg-stone-950/50 hover:bg-stone-950/80 border border-stone-800/80'
                                }`}
                              >
                                {/* Set Number & Clickable Previous Log */}
                                <div className="col-span-1 text-center font-mono font-bold text-stone-400 text-xs flex flex-col items-center justify-center">
                                  <span>{set.setNumber}</span>
                                  {prevSet && (
                                    <button
                                      type="button"
                                      onClick={() => applyPreviousSetToCurrent(exIdx, sIdx, prevSet)}
                                      className="text-[9px] font-mono text-stone-500 hover:text-amber-400 hover:underline transition truncate max-w-full"
                                      title={`Last time: ${prevSet.weight} × ${prevSet.reps}. Tap to copy to this set.`}
                                    >
                                      {prevSet.weight}×{prevSet.reps}
                                    </button>
                                  )}
                                </div>

                                {/* Set Type */}
                                <div className="col-span-2">
                                  <select
                                    value={set.type}
                                    onChange={(e) => {
                                      const val = e.target.value as WorkoutSet['type'];
                                      setActiveExercises(prev => {
                                        const next = [...prev];
                                        next[exIdx].sets[sIdx].type = val;
                                        return next;
                                      });
                                    }}
                                    className="w-full bg-stone-900 border border-stone-700 text-stone-300 text-[11px] rounded px-1.5 py-1 focus:outline-none focus:border-amber-500"
                                  >
                                    <option value="Working">Working</option>
                                    <option value="Warmup">Warmup</option>
                                    <option value="Drop Set">Drop</option>
                                    <option value="Failure">Failure</option>
                                  </select>
                                </div>

                                {/* Individual Set Weight Adjuster */}
                                <div className="col-span-4 flex flex-col items-center justify-center">
                                  <div className="flex items-center justify-center gap-1 w-full">
                                    <button
                                      type="button"
                                      onClick={() => updateIndividualSetWeight(exIdx, sIdx, -5)}
                                      className="w-6 h-7 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-xs flex items-center justify-center"
                                      title="Minus 5"
                                    >
                                      -5
                                    </button>
                                    <input
                                      type="number"
                                      value={set.weight}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        setActiveExercises(prev => {
                                          const next = [...prev];
                                          next[exIdx].sets[sIdx].weight = val;
                                          return next;
                                        });
                                      }}
                                      className="w-16 bg-stone-900 border border-stone-700 text-center text-white font-mono font-bold text-xs rounded py-1 focus:outline-none focus:border-amber-500"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => updateIndividualSetWeight(exIdx, sIdx, 5)}
                                      className="w-6 h-7 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-xs flex items-center justify-center"
                                      title="Plus 5"
                                    >
                                      +5
                                    </button>
                                  </div>
                                  {prevSet && set.weight > prevSet.weight && (
                                    <span className="text-[9px] font-bold text-emerald-400 font-mono">
                                      +{set.weight - prevSet.weight} {unit}
                                    </span>
                                  )}
                                </div>

                                {/* Individual Set Reps Adjuster */}
                                <div className="col-span-3 flex flex-col items-center justify-center">
                                  <div className="flex items-center justify-center gap-1 w-full">
                                    <button
                                      type="button"
                                      onClick={() => updateIndividualSetReps(exIdx, sIdx, -1)}
                                      className="w-6 h-7 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-xs flex items-center justify-center"
                                      title="Minus 1 rep"
                                    >
                                      -1
                                    </button>
                                    <input
                                      type="number"
                                      value={set.reps}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setActiveExercises(prev => {
                                          const next = [...prev];
                                          next[exIdx].sets[sIdx].reps = val;
                                          return next;
                                        });
                                      }}
                                      className={`w-12 bg-stone-900 border text-center font-mono font-bold text-xs rounded py-1 focus:outline-none focus:border-amber-500 ${
                                        set.reps >= activeEx.targetReps ? 'text-emerald-400 border-emerald-500/50' : 'text-white border-stone-700'
                                      }`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => updateIndividualSetReps(exIdx, sIdx, 1)}
                                      className="w-6 h-7 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-xs flex items-center justify-center"
                                      title="Plus 1 rep"
                                    >
                                      +1
                                    </button>
                                  </div>
                                  {prevSet && set.reps > prevSet.reps && (
                                    <span className="text-[9px] font-bold text-cyan-400 font-mono">
                                      +{set.reps - prevSet.reps} reps
                                    </span>
                                  )}
                                </div>

                              {/* Complete Checkmark & Clone */}
                              <div className="col-span-2 flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => cloneSet(exIdx, sIdx)}
                                  className="p-1.5 rounded-lg text-stone-500 hover:text-stone-300 hover:bg-stone-800 transition"
                                  title="Duplicate Set"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => toggleSetCompleted(exIdx, sIdx)}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition font-bold ${
                                    set.completed 
                                      ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/30' 
                                      : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-white'
                                  }`}
                                  title={set.completed ? 'Mark Incomplete' : 'Complete Set & Start Rest'}
                                >
                                  <Check className="w-4 h-4 stroke-[3]" />
                                </button>

                                {activeEx.sets.length > 1 && (
                                  <button
                                    onClick={() => removeSet(exIdx, sIdx)}
                                    className="p-1 rounded text-stone-600 hover:text-red-400 transition"
                                    title="Delete Set"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        </div>

                        {/* Add Set Button */}
                        <div className="mt-3 flex items-center justify-between">
                          <button
                            onClick={() => addSet(exIdx)}
                            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Another Set
                          </button>

                          <div className="text-xs text-stone-500">
                            Subtotal: <span className="font-mono text-stone-300 font-bold">
                              {activeEx.sets.filter(s => s.completed).reduce((s, x) => s + (x.weight * x.reps), 0).toLocaleString()} {unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: WEEKLY PROGRESSION & OVERLOAD ADVISOR                   */}
        {/* ============================================================== */}
        {activeTab === 'weekly' && (
          <div className="space-y-8">
            {/* Device Persistence & Sending Controls Card */}
            <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>Local Device Storage (No Login / 100% Private)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      {history.length} Sessions Saved
                    </span>
                  </div>
                  <p className="text-stone-400 max-w-xl">
                    All your workouts are stored permanently on this device. Send your weekly report to your coach, your email, or WhatsApp with 1 click.
                  </p>
                </div>
              </div>

              {/* Weekly Dispatch Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    const text = formatWeeklyText(currentWeekNumber, thisWeekWorkouts, thisWeekVolume, thisWeekSets, unit);
                    handleSendWhatsApp(text);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  title="Send weekly report via WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </button>

                <button
                  onClick={() => {
                    const text = formatWeeklyText(currentWeekNumber, thisWeekWorkouts, thisWeekVolume, thisWeekSets, unit);
                    handleSendEmail(`MIT2FIT Weekly Progress Report (Week ${currentWeekNumber})`, text);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-semibold transition"
                  title="Email weekly report to coach or yourself"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  Email Report
                </button>

                <button
                  onClick={() => exportCSV(history)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-semibold transition"
                  title="Download CSV spreadsheet for Excel / Google Sheets"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                  CSV
                </button>

                <button
                  onClick={() => setIsDataPortalOpen(true)}
                  className="p-1.5 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-300"
                  title="Open Storage & Backup Manager"
                >
                  <HardDrive className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>

            {/* Coach Overload Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-stone-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Award className="w-4 h-4" />
                    Double Progression Overload Engine
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Week {currentWeekNumber} Training Overview
                  </h2>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Progressive overload is tracked across your exact lifts.
                    Follow the 3-tier rule: <strong className="text-amber-400">Expand from 2 to 3 sets first</strong>, then once all sets hit target reps, <strong className="text-emerald-400">increase weight by +5 {unit}</strong>.
                  </p>
                </div>

                {/* Week Stats Summary Card */}
                <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 min-w-[240px] space-y-3">
                  <div className="text-xs text-stone-400">Total Weekly Tonnage</div>
                  <div className="text-3xl font-extrabold font-mono text-amber-400">
                    {thisWeekVolume.toLocaleString()} <span className="text-sm font-sans text-stone-400">{unit}</span>
                  </div>
                  <div className="text-xs text-stone-400 flex items-center justify-between border-t border-stone-800 pt-2">
                    <span>Working Sets:</span>
                    <strong className="text-white font-mono">{thisWeekSets} completed</strong>
                  </div>
                  <div className="text-xs text-stone-400 flex items-center justify-between">
                    <span>vs. Last Week:</span>
                    <strong className={volumeGrowthPercent >= 0 ? 'text-emerald-400 font-mono' : 'text-amber-400 font-mono'}>
                      {volumeGrowthPercent >= 0 ? `+${volumeGrowthPercent}%` : `${volumeGrowthPercent}%`}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise-by-Exercise Overload Progression Comparison */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                Exercise Progression Cards (This Week vs. Last Week)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bench Press Card */}
                <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">Bench Press</h4>
                      <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                        <span className="text-amber-400 font-medium">Upper Body</span> • <span>Chest</span> • <span>Barbell</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Progressing
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-stone-950 p-3 rounded-xl border border-stone-800/80">
                    <div>
                      <div className="text-stone-500">Last Week</div>
                      <div className="font-mono text-stone-300 font-bold mt-0.5">3 sets: 8, 8, 7 @ 135 {unit}</div>
                      <div className="text-[11px] text-stone-500 mt-1">Volume: 3,105 {unit}</div>
                    </div>
                    <div>
                      <div className="text-amber-400">Target Ceiling</div>
                      <div className="font-mono text-emerald-400 font-bold mt-0.5">3 sets × 10 @ 135 {unit}</div>
                      <div className="text-[11px] text-stone-500 mt-1">Target Volume: 4,050 {unit}</div>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-stone-200">
                    <strong className="text-amber-400 block mb-0.5">💡 Coach Prescription:</strong>
                    You hit 8, 8, 7 reps last week. Aim to complete all 3 sets with 8-10 reps this session to lock in your next weight jump!
                  </div>
                </div>

                {/* Squat or Leg Press Card */}
                <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">Squat or Leg Press</h4>
                      <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                        <span className="text-emerald-400 font-medium">Lower Body</span> • <span>Quads</span> • <span>Barbell</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Rep Building
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-stone-950 p-3 rounded-xl border border-stone-800/80">
                    <div>
                      <div className="text-stone-500">Last Week</div>
                      <div className="font-mono text-stone-300 font-bold mt-0.5">3 sets: 8, 8, 7 @ 185 {unit}</div>
                      <div className="text-[11px] text-stone-500 mt-1">Volume: 4,255 {unit}</div>
                    </div>
                    <div>
                      <div className="text-amber-400">Target Ceiling</div>
                      <div className="font-mono text-amber-400 font-bold mt-0.5">3 sets × 10 @ 185 {unit}</div>
                      <div className="text-[11px] text-stone-500 mt-1">Target Volume: 5,550 {unit}</div>
                    </div>
                  </div>

                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-xs text-stone-200">
                    <strong className="text-cyan-400 block mb-0.5">💡 Coach Prescription:</strong>
                    Drive out of the hole with full foot pressure. Once 3x10 is reached, bump load by +5 {unit} next week.
                  </div>
                </div>

                {/* Romanian Deadlift Card */}
                <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">Romanian Deadlift (RDL)</h4>
                      <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                        <span className="text-emerald-400 font-medium">Lower Body</span> • <span>Hamstrings</span> • <span>Barbell</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Target Mastered
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-stone-950 p-3 rounded-xl border border-stone-800/80">
                    <div>
                      <div className="text-stone-500">Last Week</div>
                      <div className="font-mono text-stone-300 font-bold mt-0.5">2 sets × 10 @ 135 {unit}</div>
                      <div className="text-[11px] text-stone-500 mt-1">2x10 Completed</div>
                    </div>
                    <div>
                      <div className="text-amber-400">Tier 2 Target</div>
                      <div className="font-mono text-emerald-400 font-bold mt-0.5">3 sets × 10 @ 135 {unit}</div>
                      <div className="text-[11px] text-stone-500 mt-1">Add Set 3</div>
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-stone-200">
                    <strong className="text-emerald-400 block mb-0.5">💡 Coach Prescription:</strong>
                    You completed 2 clean sets of 10. Expand to 3 sets of 10 this session before bumping to 140 {unit}.
                  </div>
                </div>

                {/* Chest-Supported Row Card */}
                <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">Chest-Supported Row</h4>
                      <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                        <span className="text-amber-400 font-medium">Upper Body</span> • <span>Back / Lats</span> • <span>Machine</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                      Steady Load
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-stone-950 p-3 rounded-xl border border-stone-800/80">
                    <div>
                      <div className="text-stone-500">Last Week</div>
                      <div className="font-mono text-stone-300 font-bold mt-0.5">3 sets: 10, 10, 9 @ 90 {unit}</div>
                      <div className="text-[11px] text-stone-500 mt-1">Volume: 2,610 {unit}</div>
                    </div>
                    <div>
                      <div className="text-amber-400">Target Ceiling</div>
                      <div className="font-mono text-amber-400 font-bold mt-0.5">3 sets × 12 @ 90 {unit}</div>
                      <div className="text-[11px] text-stone-500 mt-1">Volume: 3,240 {unit}</div>
                    </div>
                  </div>

                  <div className="bg-stone-800/60 border border-stone-700 rounded-xl p-3 text-xs text-stone-300">
                    <strong className="text-amber-400 block mb-0.5">💡 Coach Prescription:</strong>
                    Focus on pinching scapulae for 1 solid second at contraction. Squeeze out that 10th rep on set 3.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: EXERCISE EXECUTION & BIOMECHANICS GUIDE                 */}
        {/* ============================================================== */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/40 p-4 rounded-2xl border border-stone-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  Exercise Execution & Biomechanics Guide ({EXERCISE_DATABASE.length} Exercises)
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Click any movement to view proper setup cues, step-by-step biomechanics, and open-source database references.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsCustomMode(true);
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold rounded-xl text-xs transition"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                Create Custom Exercise
              </button>
            </div>

            {/* Split Filter Tabs */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Filter by Session Split:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSplit('All')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedSplit === 'All' 
                      ? 'bg-amber-500 text-stone-950' 
                      : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  All Splits
                </button>
                {SPLIT_OPTIONS.map(split => (
                  <button
                    key={split}
                    onClick={() => setSelectedSplit(split)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedSplit === split 
                        ? 'bg-amber-500 text-stone-950' 
                        : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                    }`}
                  >
                    {split}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Subcategory Filters */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Filter by Muscle Subcategory:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSubCategory('All')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    selectedSubCategory === 'All' 
                      ? 'bg-stone-200 text-stone-950 font-bold' 
                      : 'bg-stone-900/90 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  All Subcategories
                </button>
                {availableSubCategories.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      selectedSubCategory === sub 
                        ? 'bg-stone-200 text-stone-950 font-bold' 
                        : 'bg-stone-900/90 text-stone-400 hover:text-white border border-stone-800'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment Filter & Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  placeholder="Search exercise by name or prime muscle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <select
                  value={selectedEquipmentFilter}
                  onChange={(e) => setSelectedEquipmentFilter(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="All">All Equipment</option>
                  {EQUIPMENT_OPTIONS.map(eq => (
                    <option key={eq} value={eq}>{eq}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Exercises Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map(exercise => (
                <div 
                  key={exercise.id}
                  className="bg-stone-900/60 border border-stone-800/80 hover:border-amber-500/50 rounded-2xl p-5 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-white text-base leading-snug">{exercise.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-800/30 shrink-0">
                        {exercise.defaultEquipment}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-amber-400 font-semibold">{exercise.split}</span>
                      <span className="text-stone-500">•</span>
                      <span className="text-stone-300">{exercise.subCategory}</span>
                    </div>

                    <p className="text-xs text-stone-400">
                      Prime Muscle: <strong className="text-stone-200">{exercise.primaryMuscle}</strong>
                    </p>

                    <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800/80 text-xs space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Key Cue
                      </div>
                      <p className="text-stone-300 line-clamp-2">
                        {exercise.cues[0] || 'Execute with controlled eccentric tempo.'}
                      </p>
                    </div>

                    <div className="text-[11px] font-mono text-stone-400 flex items-center justify-between pt-1">
                      <span>Prescribed: {exercise.defaultTarget.targetSets} sets × {exercise.defaultTarget.minReps}–{exercise.defaultTarget.maxReps} {exercise.defaultTarget.repsUnit || 'reps'}</span>
                      <span className="text-amber-400 font-bold">{exercise.defaultTarget.defaultWeight} {unit}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedGuideExercise(exercise)}
                      className="text-xs text-stone-300 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 transition"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      Full Guide
                    </button>

                    <button
                      onClick={() => addExerciseToWorkout(exercise, exercise.defaultEquipment)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add to Routine
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: WORKOUT HISTORY LOG                                     */}
        {/* ============================================================== */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-stone-900/40 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-500" />
                  Logged Sessions & Overload History
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Saved automatically in your browser. Send any session report or export your history.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {history.length > 0 && (
                  <button
                    onClick={clearAllHistory}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-red-950/70 text-stone-400 hover:text-red-400 border border-stone-700 hover:border-red-500/40 rounded-xl text-xs font-semibold transition"
                    title="Clear all saved history logs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
                <button
                  onClick={() => exportCSV(history)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-semibold transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                  Export CSV
                </button>
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  Backup JSON
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-semibold transition"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  Restore JSON
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportData}
                  accept=".json"
                  className="hidden"
                />
              </div>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                No completed sessions logged yet. Complete today's workout to start recording history!
              </div>
            ) : (
              <div className="space-y-4">
                {history.map(workout => (
                  <div 
                    key={workout.id}
                    className="bg-stone-900/70 border border-stone-800 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                      <div>
                        <h3 className="font-bold text-white text-base">{workout.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-stone-400 mt-0.5">
                          <span>{new Date(workout.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span>•</span>
                          <span>Week {workout.weekNumber}</span>
                          <span>•</span>
                          <span>{formatTime(workout.durationSeconds)} duration</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-4 text-xs font-mono mr-2">
                          <div className="text-right">
                            <div className="text-stone-400 text-[10px]">TOTAL TONNAGE</div>
                            <div className="font-bold text-amber-400 text-sm">{workout.totalVolume.toLocaleString()} {workout.unit}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-stone-400 text-[10px]">SETS</div>
                            <div className="font-bold text-emerald-400 text-sm">{workout.totalSets}</div>
                          </div>
                        </div>

                        {/* Send / Share Individual Workout Dropdown / Buttons */}
                        <div className="flex items-center gap-1 border-l border-stone-800 pl-3">
                          <button
                            onClick={() => {
                              const text = formatWorkoutText(workout);
                              handleSendWhatsApp(text);
                            }}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-emerald-600 text-stone-300 hover:text-white transition"
                            title="Send this workout via WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              const text = formatWorkoutText(workout);
                              handleSendEmail(`MIT2FIT Workout Summary (${workout.title})`, text);
                            }}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-amber-600 text-stone-300 hover:text-white transition"
                            title="Email this workout to yourself or coach"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              const text = formatWorkoutText(workout);
                              handleCopyText(text, 'Workout report');
                            }}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
                            title="Copy workout summary to clipboard"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteHistoryItem(workout.id, workout.title)}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-950/70 text-stone-400 hover:text-red-400 border border-transparent hover:border-red-500/30 transition"
                            title="Delete this workout from history"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Exercise Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {workout.exercises.map((ex, i) => (
                        <div key={i} className="bg-stone-950 p-3 rounded-xl border border-stone-800/80 text-xs space-y-1">
                          <div className="font-bold text-stone-200">{ex.name}</div>
                          <div className="text-stone-400 text-[11px]">{ex.split} • {ex.equipment}</div>
                          <div className="font-mono text-stone-400 pt-1 text-[11px]">
                            {ex.sets.map((s, idx) => (
                              <span key={idx} className="mr-2">
                                Set {idx + 1}: {s.weight}{workout.unit} × {s.reps}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODAL 1: LOCAL DEVICE STORAGE & EXPORT PORTAL                  */}
      {/* ============================================================== */}
      {isDataPortalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Device Storage & Export Portal</h3>
                  <p className="text-xs text-stone-400">Zero-login, 100% private local storage</p>
                </div>
              </div>
              <button
                onClick={() => setIsDataPortalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Explanation of how it saves in browser */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>How your data is saved:</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                Your workouts and double progression targets are saved directly in your browser's persistent storage (<code className="text-amber-400 font-mono">HTML5 LocalStorage</code>).
                No passwords, no tracking, and no cloud logins required.
              </p>
              <div className="pt-1 text-[11px] text-stone-500 border-t border-stone-800/80 flex items-center justify-between">
                <span>Storage Key: <strong className="font-mono text-stone-400">mit2fit_exercise_logs_v4</strong></span>
                <span>Saved Sessions: <strong className="font-mono text-amber-400">{history.length}</strong></span>
              </div>
            </div>

            {/* Send & Export Actions */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Send & Share Options:
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    const text = formatWeeklyText(currentWeekNumber, thisWeekWorkouts, thisWeekVolume, thisWeekSets, unit);
                    handleSendWhatsApp(text);
                    setIsDataPortalOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-stone-950 hover:bg-emerald-950/40 border border-stone-800 hover:border-emerald-500/40 rounded-xl transition text-stone-200"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Send via WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    const text = formatWeeklyText(currentWeekNumber, thisWeekWorkouts, thisWeekVolume, thisWeekSets, unit);
                    handleSendEmail(`MIT2FIT Weekly Progress Report (Week ${currentWeekNumber})`, text);
                    setIsDataPortalOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-stone-950 hover:bg-amber-950/40 border border-stone-800 hover:border-amber-500/40 rounded-xl transition text-stone-200"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Email to Coach / Self</span>
                </button>

                <button
                  onClick={() => {
                    exportCSV(history);
                    setIsDataPortalOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-stone-950 hover:bg-cyan-950/40 border border-stone-800 hover:border-cyan-500/40 rounded-xl transition text-stone-200"
                >
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  <span>Export CSV (Excel)</span>
                </button>

                <button
                  onClick={() => {
                    handleExportData();
                    setIsDataPortalOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl transition text-stone-200"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Backup File (JSON)</span>
                </button>
              </div>
            </div>

            {/* Restore from File & Danger Zone */}
            <div className="pt-3 border-t border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">Need to move logs to another device?</span>
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setIsDataPortalOpen(false);
                  }}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline"
                >
                  Import Backup File
                </button>
              </div>

              {history.length > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-stone-800/60">
                  <span className="text-xs text-stone-500">Accidentally logged data or want a fresh start?</span>
                  <button
                    onClick={() => {
                      setIsDataPortalOpen(false);
                      clearAllHistory();
                    }}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear All Saved Logs
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: DEDICATED EXERCISE EXECUTION GUIDE & FORM CUES        */}
      {/* ============================================================== */}
      {selectedGuideExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-stone-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedGuideExercise.name}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 mt-1">
                  <span className="text-amber-400 font-semibold">{selectedGuideExercise.split}</span>
                  <span>•</span>
                  <span>{selectedGuideExercise.subCategory}</span>
                  <span>•</span>
                  <span className="text-cyan-400 font-mono">{selectedGuideExercise.defaultEquipment}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuideExercise(null)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-stone-400">Prescribed Target:</span>
                <strong className="text-white ml-2 font-mono">
                  {selectedGuideExercise.defaultTarget.targetSets} sets × {selectedGuideExercise.defaultTarget.minReps}–{selectedGuideExercise.defaultTarget.maxReps} {selectedGuideExercise.defaultTarget.repsUnit || 'reps'}
                </strong>
              </div>
              <div className="text-amber-400 font-mono font-bold">
                {selectedGuideExercise.defaultTarget.defaultWeight} {unit}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Step-by-Step Execution
              </h4>
              <ol className="space-y-2 text-xs text-stone-300 list-decimal list-inside pl-1 bg-stone-950/50 p-3.5 rounded-xl border border-stone-800/80">
                {selectedGuideExercise.instructions.map((inst, i) => (
                  <li key={i} className="leading-relaxed">
                    <span className="text-stone-200">{inst}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-400" />
                Biomechanical Form Cues
              </h4>
              <ul className="space-y-2 text-xs text-stone-300 bg-stone-950/50 p-3.5 rounded-xl border border-stone-800/80">
                {selectedGuideExercise.cues.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-stone-950 p-3 rounded-xl border border-stone-800">
              <div>
                <span className="text-stone-500 block text-[11px]">Primary Target:</span>
                <strong className="text-white">{selectedGuideExercise.primaryMuscle}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Secondary Muscles:</span>
                <strong className="text-stone-300">
                  {selectedGuideExercise.secondaryMuscles.length > 0 ? selectedGuideExercise.secondaryMuscles.join(', ') : 'None'}
                </strong>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-stone-800">
              {selectedGuideExercise.openSourceLink && (
                <a
                  href={selectedGuideExercise.openSourceLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 underline"
                >
                  <span>Open {selectedGuideExercise.openSourceLink.source} Entry</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                onClick={() => {
                  addExerciseToWorkout(selectedGuideExercise, selectedGuideExercise.defaultEquipment);
                  setSelectedGuideExercise(null);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition"
              >
                Add to Current Routine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: ADD EXERCISE / CUSTOM BUILDER                         */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-500" />
                  {isCustomMode ? 'Create Custom Exercise' : 'Select Exercise to Add'}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {isCustomMode 
                    ? 'Define dynamic splits, target sets, reps, and custom equipment' 
                    : 'Choose from 26 calibrated routine movements'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition"
                >
                  {isCustomMode ? 'Browse Database' : '+ Custom Move'}
                </button>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsCustomMode(false);
                  }}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {isCustomMode ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-stone-400 font-bold mb-1">Exercise Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Single-Arm Clean, Deficit Deadlift"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-400 font-bold mb-1">Split Category</label>
                      <select
                        value={customSplit}
                        onChange={(e) => setCustomSplit(e.target.value as SplitCategory)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                      >
                        {SPLIT_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-400 font-bold mb-1">Muscle Subcategory</label>
                      <select
                        value={customSubCategory}
                        onChange={(e) => setCustomSubCategory(e.target.value as MuscleSubCategory)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                      >
                        {ALL_SUBCATEGORIES.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-400 font-bold mb-1">Equipment</label>
                      <select
                        value={customEquipment}
                        onChange={(e) => setCustomEquipment(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                      >
                        {EQUIPMENT_OPTIONS.map(eq => (
                          <option key={eq} value={eq}>{eq}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-400 font-bold mb-1">Starting Weight ({unit})</label>
                      <input
                        type="number"
                        value={customStartingWeight}
                        onChange={(e) => setCustomStartingWeight(parseFloat(e.target.value) || 0)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 font-mono text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-stone-950 p-3 rounded-xl border border-stone-800">
                    <div>
                      <label className="block text-stone-400 font-bold mb-1">Target Sets</label>
                      <input
                        type="number"
                        value={customTargetSets}
                        onChange={(e) => setCustomTargetSets(parseInt(e.target.value) || 2)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-1.5 font-mono text-center text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 font-bold mb-1">Target Reps</label>
                      <input
                        type="number"
                        value={customTargetReps}
                        onChange={(e) => setCustomTargetReps(parseInt(e.target.value) || 10)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-1.5 font-mono text-center text-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!customName.trim()) return;
                      const customDef: ExerciseDefinition = {
                        id: `custom-${Date.now()}`,
                        name: customName.trim(),
                        split: customSplit,
                        subCategory: customSubCategory,
                        category: 'Full Body',
                        defaultEquipment: customEquipment as ExerciseDefinition['defaultEquipment'],
                        supportedEquipment: [customEquipment],
                        primaryMuscle: customSubCategory,
                        secondaryMuscles: [],
                        animationType: 'bench',
                        cues: ['Keep spine locked in neutral', 'Full controlled range of motion'],
                        openSourceLink: {
                          label: 'Custom Exercise',
                          url: '#',
                          source: 'Wger (Open Source)'
                        },
                        instructions: ['Execute with steady controlled tempo.'],
                        defaultTarget: {
                          targetSets: customTargetSets,
                          targetReps: customTargetReps,
                          minReps: customTargetReps - 2,
                          maxReps: customTargetReps + 2,
                          defaultWeight: customStartingWeight,
                          repsUnit: 'reps'
                        },
                        custom: true
                      };
                      addExerciseToWorkout(customDef, customEquipment);
                      setCustomName('');
                    }}
                    disabled={!customName.trim()}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold rounded-xl text-xs transition"
                  >
                    Save & Add to Current Routine
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Search by exercise name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />

                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setSelectedSplit('All')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                          selectedSplit === 'All' ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        All
                      </button>
                      {SPLIT_OPTIONS.map(s => (
                        <button
                          key={s}
                          onClick={() => setSelectedSplit(s)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                            selectedSplit === s ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="divide-y divide-stone-800 max-h-[50vh] overflow-y-auto">
                    {filteredExercises.map(ex => (
                      <div 
                        key={ex.id}
                        className="py-3 flex items-center justify-between gap-3 hover:bg-stone-800/40 px-2 rounded-xl transition"
                      >
                        <div>
                          <div className="font-bold text-white text-xs">{ex.name}</div>
                          <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
                            <span className="text-amber-400">{ex.split}</span>
                            <span>•</span>
                            <span>{ex.subCategory}</span>
                            <span>•</span>
                            <span className="text-cyan-400 font-mono">{ex.defaultEquipment}</span>
                            <span>•</span>
                            <span className="font-mono text-stone-300">
                              {ex.defaultTarget.targetSets}×{ex.defaultTarget.minReps}–{ex.defaultTarget.maxReps} {ex.defaultTarget.repsUnit || 'reps'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedGuideExercise(ex)}
                            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-700"
                            title="View Guide & Form Cues"
                          >
                            <BookOpen className="w-4 h-4 text-amber-400" />
                          </button>
                          <button
                            onClick={() => addExerciseToWorkout(ex, ex.defaultEquipment)}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs transition"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: WORKOUT FINISHED CELEBRATION & SEND REPORT            */}
      {/* ============================================================== */}
      {completedModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-white">Workout Completed!</h3>
              <p className="text-xs text-stone-400">
                Session automatically saved to your browser on this device.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs">
              <div>
                <div className="text-stone-500">Duration</div>
                <div className="font-mono font-bold text-white text-sm mt-0.5">
                  {formatTime(completedModalData.durationSeconds)}
                </div>
              </div>
              <div>
                <div className="text-stone-500">Sets Finished</div>
                <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                  {completedModalData.totalSets}
                </div>
              </div>
              <div>
                <div className="text-stone-500">Total Volume</div>
                <div className="font-mono font-bold text-amber-400 text-sm mt-0.5">
                  {completedModalData.totalVolume.toLocaleString()} {completedModalData.unit}
                </div>
              </div>
            </div>

            {/* Direct Send / Share Workout Row */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Send or Save Today's Report:
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => {
                    const text = formatWorkoutText(completedModalData);
                    handleSendWhatsApp(text);
                  }}
                  className="p-2.5 rounded-xl bg-stone-950 hover:bg-emerald-950/40 border border-stone-800 hover:border-emerald-500/40 text-stone-200 flex flex-col items-center justify-center gap-1 transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    const text = formatWorkoutText(completedModalData);
                    handleSendEmail(`MIT2FIT Workout Summary (${completedModalData.title})`, text);
                  }}
                  className="p-2.5 rounded-xl bg-stone-950 hover:bg-amber-950/40 border border-stone-800 hover:border-amber-500/40 text-stone-200 flex flex-col items-center justify-center gap-1 transition"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Email Report</span>
                </button>

                <button
                  onClick={() => {
                    const text = formatWorkoutText(completedModalData);
                    handleCopyText(text, 'Workout summary');
                  }}
                  className="p-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 flex flex-col items-center justify-center gap-1 transition"
                >
                  <Copy className="w-4 h-4 text-cyan-400" />
                  <span>Copy Text</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setCompletedModalData(null);
                setActiveTab('weekly');
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
            >
              View Weekly Progression Dashboard
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* IN-APP CONFIRMATION MODAL (Sandbox-Proof, No window.confirm)  */}
      {/* ============================================================== */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${confirmModal.isDanger ? 'bg-red-950/60 text-red-400 border border-red-500/30' : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'}`}>
                {confirmModal.isDanger ? <Trash2 className="w-6 h-6" /> : <RotateCcw className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{confirmModal.title}</h3>
                <span className="text-xs text-stone-400">Confirmation Required</span>
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80">
              {confirmModal.message}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-700 hover:bg-stone-800 text-stone-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg ${
                  confirmModal.isDanger
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20'
                }`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CREATE / MODIFY WORKOUT ROUTINE                         */}
      {/* ============================================================== */}
      {routineModal && routineModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  {routineModal.mode === 'create' ? <Plus className="w-5 h-5" /> : routineModal.mode === 'save_active' ? <FolderPlus className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {routineModal.mode === 'create' 
                      ? 'Create New Workout Routine' 
                      : routineModal.mode === 'save_active'
                      ? 'Save Current Workout as Routine'
                      : `Modify Routine: ${routineModal.name}`}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Customize exercises, target sets, reps, and baseline weights
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRoutineModal(null)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              {/* Routine Meta Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Routine Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={routineModal.name}
                    onChange={(e) => setRoutineModal({ ...routineModal, name: e.target.value })}
                    placeholder="e.g. Chest & Back Hypertrophy"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Split Category
                  </label>
                  <select
                    value={routineModal.split}
                    onChange={(e) => setRoutineModal({ ...routineModal, split: e.target.value as SplitCategory })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
                  >
                    {SPLIT_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Description / Focus Notes
                </label>
                <input
                  type="text"
                  value={routineModal.description}
                  onChange={(e) => setRoutineModal({ ...routineModal, description: e.target.value })}
                  placeholder="e.g. Primary focus on horizontal pressing and vertical pulling with 8-12 rep range"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              {/* Exercises in Routine List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                      Exercises in this Routine ({routineModal.exerciseConfigs.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRoutineModal({ ...routineModal, isPickerOpen: !routineModal.isPickerOpen })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{routineModal.isPickerOpen ? 'Hide Picker' : 'Add Exercises'}</span>
                  </button>
                </div>

                {/* Inline Exercise Picker from Database */}
                {routineModal.isPickerOpen && (
                  <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="Search movements (e.g. Press, Squat, Curl)..."
                          value={routineModal.pickerSearch}
                          onChange={(e) => setRoutineModal({ ...routineModal, pickerSearch: e.target.value })}
                          className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <select
                        value={routineModal.pickerSplit}
                        onChange={(e) => setRoutineModal({ ...routineModal, pickerSplit: e.target.value })}
                        className="bg-stone-900 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="All">All Splits</option>
                        {SPLIT_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 divide-y divide-stone-800/40">
                      {EXERCISE_DATABASE.filter(ex => {
                        const matchesSplit = routineModal.pickerSplit === 'All' || ex.split === routineModal.pickerSplit;
                        const matchesSearch = ex.name.toLowerCase().includes(routineModal.pickerSearch.toLowerCase()) ||
                          ex.primaryMuscle.toLowerCase().includes(routineModal.pickerSearch.toLowerCase());
                        return matchesSplit && matchesSearch;
                      }).map(ex => {
                        const isAlreadyAdded = routineModal.exerciseConfigs.some(c => c.exerciseId === ex.id);
                        return (
                          <div key={ex.id} className="pt-1.5 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <span className="font-semibold text-white block truncate">{ex.name}</span>
                              <span className="text-[10px] text-stone-500">{ex.subCategory} • {ex.defaultEquipment}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (isAlreadyAdded) return;
                                const prevPerf = getPreviousExercisePerformance(ex.id, ex.name, history);
                                const newConfig = {
                                  exerciseId: ex.id,
                                  targetSets: prevPerf?.targetSets || ex.defaultTarget?.targetSets || 3,
                                  targetReps: prevPerf?.targetReps || ex.defaultTarget?.targetReps || 10,
                                  targetWeight: prevPerf?.maxWeight || ex.defaultTarget?.defaultWeight || 45,
                                  equipment: ex.defaultEquipment
                                };
                                setRoutineModal({
                                  ...routineModal,
                                  exerciseConfigs: [...routineModal.exerciseConfigs, newConfig]
                                });
                              }}
                              disabled={isAlreadyAdded}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                                isAlreadyAdded
                                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                              }`}
                            >
                              {isAlreadyAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                              <span>{isAlreadyAdded ? 'Added' : 'Add'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Exercises currently in routine */}
                {routineModal.exerciseConfigs.length === 0 ? (
                  <div className="text-center py-8 bg-stone-950/40 rounded-2xl border border-stone-800/80 p-4">
                    <p className="text-stone-500 text-xs">
                      No exercises in this routine yet. Click "Add Exercises" above to add movements.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {routineModal.exerciseConfigs.map((cfg, cfgIdx) => {
                      const def = EXERCISE_DATABASE.find(e => e.id === cfg.exerciseId) || EXERCISE_DATABASE[0];
                      const prevPerf = getPreviousExercisePerformance(cfg.exerciseId, def.name, history);
                      return (
                        <div
                          key={`${cfg.exerciseId}-${cfgIdx}`}
                          className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-stone-500 font-bold">#{cfgIdx + 1}</span>
                              <span className="font-bold text-white truncate">{def.name}</span>
                              <span className="text-[10px] text-amber-400/90 font-mono px-1.5 py-0.5 bg-amber-500/10 rounded">
                                {cfg.equipment}
                              </span>
                            </div>
                            <div className="text-[10px] text-stone-500 flex items-center gap-2">
                              <span>{def.subCategory}</span>
                              {prevPerf && (
                                <span className="text-emerald-400/90 font-mono">
                                  Last: {prevPerf.summary} {unit}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Exercise Targets Steppers */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {/* Sets */}
                            <div className="flex items-center gap-1 bg-stone-900 px-2 py-1 rounded-lg border border-stone-800">
                              <span className="text-stone-400 text-[10px]">Sets:</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...routineModal.exerciseConfigs];
                                  updated[cfgIdx].targetSets = Math.max(1, updated[cfgIdx].targetSets - 1);
                                  setRoutineModal({ ...routineModal, exerciseConfigs: updated });
                                }}
                                className="w-4 h-4 rounded bg-stone-800 text-stone-300 font-bold flex items-center justify-center hover:bg-stone-700"
                              >
                                -
                              </button>
                              <span className="font-mono font-bold text-amber-400 px-1">{cfg.targetSets}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...routineModal.exerciseConfigs];
                                  updated[cfgIdx].targetSets = Math.min(8, updated[cfgIdx].targetSets + 1);
                                  setRoutineModal({ ...routineModal, exerciseConfigs: updated });
                                }}
                                className="w-4 h-4 rounded bg-stone-800 text-stone-300 font-bold flex items-center justify-center hover:bg-stone-700"
                              >
                                +
                              </button>
                            </div>

                            {/* Reps */}
                            <div className="flex items-center gap-1 bg-stone-900 px-2 py-1 rounded-lg border border-stone-800">
                              <span className="text-stone-400 text-[10px]">Reps:</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...routineModal.exerciseConfigs];
                                  updated[cfgIdx].targetReps = Math.max(1, updated[cfgIdx].targetReps - 1);
                                  setRoutineModal({ ...routineModal, exerciseConfigs: updated });
                                }}
                                className="w-4 h-4 rounded bg-stone-800 text-stone-300 font-bold flex items-center justify-center hover:bg-stone-700"
                              >
                                -
                              </button>
                              <span className="font-mono font-bold text-amber-400 px-1">{cfg.targetReps}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...routineModal.exerciseConfigs];
                                  updated[cfgIdx].targetReps = updated[cfgIdx].targetReps + 1;
                                  setRoutineModal({ ...routineModal, exerciseConfigs: updated });
                                }}
                                className="w-4 h-4 rounded bg-stone-800 text-stone-300 font-bold flex items-center justify-center hover:bg-stone-700"
                              >
                                +
                              </button>
                            </div>

                            {/* Default Weight */}
                            <div className="flex items-center gap-1 bg-stone-900 px-2 py-1 rounded-lg border border-stone-800">
                              <span className="text-stone-400 text-[10px]">{unit}:</span>
                              <input
                                type="number"
                                value={cfg.targetWeight}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const updated = [...routineModal.exerciseConfigs];
                                  updated[cfgIdx].targetWeight = val;
                                  setRoutineModal({ ...routineModal, exerciseConfigs: updated });
                                }}
                                className="w-12 bg-stone-950 border border-stone-700 text-center font-mono font-bold text-amber-400 rounded py-0.5 text-xs focus:outline-none"
                              />
                            </div>

                            {/* Reorder Up & Down */}
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                disabled={cfgIdx === 0}
                                onClick={() => {
                                  if (cfgIdx === 0) return;
                                  const updated = [...routineModal.exerciseConfigs];
                                  const temp = updated[cfgIdx - 1];
                                  updated[cfgIdx - 1] = updated[cfgIdx];
                                  updated[cfgIdx] = temp;
                                  setRoutineModal({ ...routineModal, exerciseConfigs: updated });
                                }}
                                className="p-1 rounded bg-stone-900 hover:bg-stone-800 disabled:opacity-30 text-stone-400 hover:text-white"
                                title="Move up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={cfgIdx === routineModal.exerciseConfigs.length - 1}
                                onClick={() => {
                                  if (cfgIdx === routineModal.exerciseConfigs.length - 1) return;
                                  const updated = [...routineModal.exerciseConfigs];
                                  const temp = updated[cfgIdx + 1];
                                  updated[cfgIdx + 1] = updated[cfgIdx];
                                  updated[cfgIdx] = temp;
                                  setRoutineModal({ ...routineModal, exerciseConfigs: updated });
                                }}
                                className="p-1 rounded bg-stone-900 hover:bg-stone-800 disabled:opacity-30 text-stone-400 hover:text-white"
                                title="Move down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Remove */}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = routineModal.exerciseConfigs.filter((_, i) => i !== cfgIdx);
                                setRoutineModal({ ...routineModal, exerciseConfigs: updated });
                              }}
                              className="p-1.5 rounded text-stone-500 hover:text-red-400 hover:bg-stone-900 transition"
                              title="Remove from routine"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-stone-800 bg-stone-950 flex items-center justify-between gap-3">
              <div>
                {routineModal.mode === 'edit' && routineModal.routineId && (
                  <button
                    type="button"
                    onClick={() => {
                      const id = routineModal.routineId!;
                      setRoutineModal(null);
                      handleDeleteRoutine(id);
                    }}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Routine
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRoutineModal(null)}
                  className="px-4 py-2 rounded-xl border border-stone-700 hover:bg-stone-800 text-stone-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveRoutineModal}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Routine</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
