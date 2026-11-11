import React, { useState, useRef } from 'react';
import { 
  Trophy, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  X, 
  Flame, 
  Timer, 
  Calendar, 
  Award, 
  Sparkles,
  Zap,
  Dumbbell
} from 'lucide-react';

interface CompletedExerciseData {
  id: string;
  name: string;
  split?: string;
  subCategory?: string;
  targetSets?: number;
  sets: { weight: number; reps: number; completed: boolean; type: string; rpe?: number }[];
}

interface CompletedWorkoutData {
  id: string;
  date: string;
  title: string;
  durationSeconds?: number;
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  unit: 'lbs' | 'kg';
  sessionNotes?: string;
  energyRating?: string;
  exercises: CompletedExerciseData[];
}

interface WorkoutShareCardModalProps {
  workout: CompletedWorkoutData | null;
  onClose: () => void;
  calculateE1RM: (weight: number, reps: number) => number;
}

export const WorkoutShareCardModal: React.FC<WorkoutShareCardModalProps> = ({
  workout,
  onClose,
  calculateE1RM
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!workout) return null;

  const formatDuration = (secs?: number) => {
    if (!secs) return '0 min';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  // Find top lifts and PRs from this workout
  const topLifts = workout.exercises
    .map(ex => {
      const valid = ex.sets.filter(s => s.completed && s.weight > 0 && s.reps > 0);
      if (valid.length === 0) return null;
      const maxWeight = Math.max(...valid.map(s => s.weight));
      const bestE1RM = Math.max(...valid.map(s => calculateE1RM(s.weight, s.reps)));
      const bestSet = valid.find(s => calculateE1RM(s.weight, s.reps) === bestE1RM) || valid[0];
      return {
        name: ex.name,
        maxWeight,
        bestE1RM,
        bestReps: bestSet.reps,
        bestWeight: bestSet.weight,
        setsCount: valid.length
      };
    })
    .filter(Boolean)
    .sort((a, b) => (b?.bestE1RM || 0) - (a?.bestE1RM || 0))
    .slice(0, 4);

  const handleCopyText = () => {
    const lines = [
      `🏋️ MIT2FIT WORKOUT COMPLETED: ${workout.title}`,
      `📅 Date: ${new Date(workout.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`,
      `⏱️ Duration: ${formatDuration(workout.durationSeconds)} | ⚡ Volume: ${workout.totalVolume.toLocaleString()} ${workout.unit}`,
      `📊 Sets: ${workout.totalSets} completed | Reps: ${workout.totalReps} total`,
      '',
      '🔥 Top Highlights:',
      ...topLifts.map(l => `• ${l?.name}: ${l?.bestWeight} ${workout.unit} × ${l?.bestReps} reps (e1RM: ${l?.bestE1RM} ${workout.unit})`),
      '',
      '💪 Train smart, progress relentlessly.'
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadImage = () => {
    // Generate Canvas export of the share card
    setIsExporting(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350; // 4:5 Instagram Portrait Ratio
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Dark luxurious background
      const grad = ctx.createLinearGradient(0, 0, 0, 1350);
      grad.addColorStop(0, '#09090b');
      grad.addColorStop(0.5, '#18181b');
      grad.addColorStop(1, '#09090b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1350);

      // Gold border accent
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 1020, 1290);

      // Header Brand
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 36px monospace';
      ctx.fillText('MIT2FIT // PERFORMANCE RECORD', 70, 110);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText(workout.title.slice(0, 26), 70, 200);

      // Date & Duration
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '32px monospace';
      ctx.fillText(
        `${new Date(workout.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}  •  ${formatDuration(workout.durationSeconds)}`,
        70,
        260
      );

      // Big Stats Box
      ctx.fillStyle = '#27272a';
      ctx.fillRect(70, 310, 940, 240);
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 2;
      ctx.strokeRect(70, 310, 940, 240);

      // Stats 1: Total Volume
      ctx.fillStyle = '#71717a';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('TOTAL VOLUME', 110, 370);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 64px monospace';
      ctx.fillText(`${workout.totalVolume.toLocaleString()}`, 110, 440);
      ctx.font = '32px monospace';
      ctx.fillText(workout.unit, 110, 490);

      // Stats 2: Sets & Reps
      ctx.fillStyle = '#71717a';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('TOTAL SETS', 590, 370);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px monospace';
      ctx.fillText(`${workout.totalSets}`, 590, 440);
      ctx.fillStyle = '#71717a';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`${workout.totalReps} Reps Completed`, 590, 490);

      // Top Lifts Section
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('KEY LIFTS & ESTIMATED 1RMs', 70, 620);

      let liftY = 680;
      topLifts.forEach(lift => {
        if (!lift) return;
        ctx.fillStyle = '#18181b';
        ctx.fillRect(70, liftY, 940, 110);
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 1;
        ctx.strokeRect(70, liftY, 940, 110);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 34px sans-serif';
        ctx.fillText(lift.name.slice(0, 28), 100, liftY + 50);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 32px monospace';
        ctx.fillText(`${lift.bestWeight} ${workout.unit} × ${lift.bestReps}`, 100, liftY + 90);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 36px monospace';
        ctx.fillText(`e1RM: ${lift.bestE1RM} ${workout.unit}`, 650, liftY + 68);

        liftY += 130;
      });

      // Footer Motto
      ctx.fillStyle = '#52525b';
      ctx.font = 'italic 28px sans-serif';
      ctx.fillText('Progressive Overload  •  Double Progression  •  Mit2fit', 70, 1260);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `mit2fit-${workout.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      a.click();
    }
    setIsExporting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Session Completed!</h3>
              <p className="text-xs text-stone-400">Shareable milestone card & performance summary</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shareable Visual Card */}
        <div 
          ref={cardRef}
          className="p-5 rounded-2xl bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border border-amber-500/30 space-y-4 shadow-xl text-xs overflow-y-auto"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold text-amber-400 tracking-wider uppercase block">
                MIT2FIT // SESSION RECORD
              </span>
              <h4 className="text-lg font-bold text-white tracking-tight mt-0.5">
                {workout.title}
              </h4>
              <div className="flex items-center gap-2 text-stone-400 text-[11px] mt-1 font-mono">
                <span>{new Date(workout.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>·</span>
                <span className="text-stone-300">{formatDuration(workout.durationSeconds)}</span>
              </div>
            </div>
            <Award className="w-7 h-7 text-amber-400 shrink-0" />
          </div>

          {/* Core Metrics Banner */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-500 uppercase block">Total Volume</span>
              <span className="text-base font-bold text-amber-400">{workout.totalVolume.toLocaleString()}</span>
              <span className="text-[9px] text-stone-400 block">{workout.unit}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-500 uppercase block">Completed Sets</span>
              <span className="text-base font-bold text-white">{workout.totalSets}</span>
              <span className="text-[9px] text-stone-400 block">Sets</span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
              <span className="text-[10px] text-stone-500 uppercase block">Total Reps</span>
              <span className="text-base font-bold text-emerald-400">{workout.totalReps}</span>
              <span className="text-[9px] text-stone-400 block">Reps</span>
            </div>
          </div>

          {/* Top Lifts Section */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400 block">
              Top Lifts & Estimated 1RMs
            </span>
            <div className="space-y-1.5">
              {topLifts.map(l => (
                <div key={l?.name} className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800 flex items-center justify-between text-xs font-mono">
                  <div className="truncate pr-2">
                    <span className="font-bold text-white block truncate">{l?.name}</span>
                    <span className="text-[10px] text-stone-400">
                      Best: {l?.bestWeight} {workout.unit} × {l?.bestReps} reps
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-stone-500 uppercase block">e1RM</span>
                    <span className="font-bold text-amber-400 text-sm">
                      {l?.bestE1RM} {workout.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800 text-xs">
          <button
            type="button"
            onClick={handleCopyText}
            className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold transition flex items-center justify-center gap-2 border border-stone-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-stone-400" />}
            <span>{copied ? 'Copied Summary!' : 'Copy Summary'}</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadImage}
            className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};
