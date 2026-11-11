import React, { useState } from 'react';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Minus, 
  Check, 
  Zap, 
  Dumbbell, 
  ChevronUp, 
  ChevronDown, 
  Disc, 
  BookOpen, 
  Flame,
  Volume2,
  VolumeX,
  ArrowRight
} from 'lucide-react';

interface ActiveExerciseItem {
  instanceId: string;
  name: string;
  equipment: string;
  supersetTag?: string;
  targetSets: number;
  completedSets: number;
  nextWeight: number;
  nextReps: number;
}

interface ActiveWorkoutCompanionHUDProps {
  hasStarted: boolean;
  elapsedSeconds: number;
  restSecondsLeft: number;
  isRestActive: boolean;
  isTimerRunning: boolean;
  activeExercisesCount: number;
  completedSetsCount: number;
  totalSetsCount: number;
  totalVolume: number;
  unit: 'lbs' | 'kg';
  currentExerciseIndex: number;
  activeExercises: ActiveExerciseItem[];
  onToggleTimer: () => void;
  onAdjustRest: (delta: number) => void;
  onSkipRest: () => void;
  onOpenPlateCalculator: () => void;
  isRestSoundEnabled: boolean;
  onToggleRestSound: () => void;
  onFinishWorkout: () => void;
}

export const ActiveWorkoutCompanionHUD: React.FC<ActiveWorkoutCompanionHUDProps> = ({
  hasStarted,
  elapsedSeconds,
  restSecondsLeft,
  isRestActive,
  isTimerRunning,
  activeExercisesCount,
  completedSetsCount,
  totalSetsCount,
  totalVolume,
  unit,
  currentExerciseIndex,
  activeExercises,
  onToggleTimer,
  onAdjustRest,
  onSkipRest,
  onOpenPlateCalculator,
  isRestSoundEnabled,
  onToggleRestSound,
  onFinishWorkout
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!hasStarted) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const formatElapsed = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentEx = activeExercises[currentExerciseIndex] || activeExercises[0];
  const nextEx = activeExercises[currentExerciseIndex + 1] || null;
  const isSupersetTransition = 
    Boolean(currentEx?.supersetTag) && 
    Boolean(nextEx?.supersetTag) && 
    currentEx?.supersetTag?.slice(0, 1) === nextEx?.supersetTag?.slice(0, 1);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-2 sm:p-3 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-stone-950/95 backdrop-blur-md border border-stone-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-200">
          {/* Top Mini Header Strip: Time, Sets, Volume & Toggle */}
          <div className="px-4 py-2 bg-stone-900/90 border-b border-stone-800/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              {/* Workout Timer */}
              <div className="flex items-center gap-1.5 font-mono">
                <button
                  type="button"
                  onClick={onToggleTimer}
                  className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
                  title={isTimerRunning ? 'Pause session' : 'Resume session'}
                >
                  {isTimerRunning ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                </button>
                <span className="font-bold text-white text-xs tabular-nums">
                  {formatElapsed(elapsedSeconds)}
                </span>
              </div>

              <span className="text-stone-600">·</span>

              {/* Progress counter */}
              <div className="flex items-center gap-1 text-[11px] font-mono text-stone-400">
                <span>Sets:</span>
                <span className="text-amber-400 font-bold">{completedSetsCount}</span>
                <span>/</span>
                <span>{totalSetsCount}</span>
              </div>

              <span className="text-stone-600 hidden sm:inline">·</span>

              {/* Volume */}
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-stone-400">
                <span>Vol:</span>
                <span className="text-emerald-400 font-bold">{totalVolume.toLocaleString()} {unit}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleRestSound}
                className={`p-1 rounded-lg transition ${
                  isRestSoundEnabled ? 'text-amber-400 bg-amber-950/40' : 'text-stone-500 bg-stone-900'
                }`}
                title={isRestSoundEnabled ? 'Mute rest timer chime' : 'Enable rest timer chime'}
              >
                {isRestSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={onOpenPlateCalculator}
                className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-cyan-400 hover:text-cyan-300 transition"
                title="Open Barbell Plate Calculator"
              >
                <Disc className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded-lg bg-stone-800 text-stone-400 hover:text-white transition"
                title={isMinimized ? 'Expand Companion HUD' : 'Minimize Companion HUD'}
              >
                {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Main Companion Body */}
          {!isMinimized && (
            <div className="p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              {/* Left: Rest Timer HUD */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className={`p-2.5 rounded-2xl flex items-center justify-center shrink-0 ${
                  isRestActive 
                    ? 'bg-amber-500/15 border border-amber-500/40 text-amber-400 animate-pulse' 
                    : 'bg-stone-900 border border-stone-800 text-stone-400'
                }`}>
                  <Timer className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1 md:flex-none">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400">
                      {isRestActive ? 'REST INTERVAL' : 'REST READY'}
                    </span>
                    {isRestActive && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums tracking-tight">
                    {formatTime(restSecondsLeft)}
                  </div>
                </div>

                {/* Rest Adjustments */}
                <div className="flex items-center gap-1 shrink-0 ml-auto md:ml-2">
                  <button
                    type="button"
                    onClick={() => onAdjustRest(-15)}
                    className="px-2 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 font-mono text-[11px] font-bold border border-stone-800"
                    title="Minus 15 seconds rest"
                  >
                    -15s
                  </button>
                  <button
                    type="button"
                    onClick={() => onAdjustRest(30)}
                    className="px-2 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 font-mono text-[11px] font-bold border border-stone-800"
                    title="Plus 30 seconds rest"
                  >
                    +30s
                  </button>
                  {isRestActive && (
                    <button
                      type="button"
                      onClick={onSkipRest}
                      className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-bold transition"
                    >
                      Skip
                    </button>
                  )}
                </div>
              </div>

              {/* Center / Right: Up-Next or Superset Preview */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-stone-800 pt-2 md:pt-0">
                <div className="min-w-0 pr-2">
                  {isSupersetTransition ? (
                    <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-[11px]">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                      <span className="font-bold">SUPERSET PAIR:</span>
                      <span className="text-white font-sans font-bold truncate max-w-[140px] sm:max-w-[200px]">
                        {nextEx?.name}
                      </span>
                    </div>
                  ) : currentEx ? (
                    <div className="text-[11px]">
                      <span className="text-stone-500">Active: </span>
                      <strong className="text-white font-medium truncate inline-block max-w-[140px] sm:max-w-[180px] align-bottom">
                        {currentEx.name}
                      </strong>
                      <span className="text-amber-400 font-mono text-[10px] ml-1">
                        ({currentEx.completedSets}/{currentEx.targetSets} sets)
                      </span>
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={onFinishWorkout}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Finish Workout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
