import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Calendar, 
  Flame, 
  TrendingUp, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Info,
  CheckCircle2,
  Dumbbell
} from 'lucide-react';

export interface SetRecord {
  weight: number;
  reps: number;
  completed: boolean;
  type: string;
  rpe?: number;
}

export interface ExerciseRecord {
  id: string;
  name: string;
  split?: string;
  subCategory?: string;
  equipment?: string;
  targetSets?: number;
  targetReps?: number;
  sets: SetRecord[];
  supersetTag?: string;
}

export interface WorkoutSessionRecord {
  id: string;
  date: string;
  title: string;
  durationSeconds?: number;
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  unit: 'lbs' | 'kg';
  exercises: ExerciseRecord[];
}

interface TrainingHeatmapAndPRTrophyRoomProps {
  history: WorkoutSessionRecord[];
  unit: 'lbs' | 'kg';
  calculateE1RM: (weight: number, reps: number) => number;
  onSelectExercise?: (exerciseName: string) => void;
}

export const TrainingHeatmapAndPRTrophyRoom: React.FC<TrainingHeatmapAndPRTrophyRoomProps> = ({
  history,
  unit,
  calculateE1RM,
  onSelectExercise
}) => {
  const [heatmapTimeframe, setHeatmapTimeframe] = useState<'12w' | '26w' | '52w'>('52w');
  const [selectedDay, setSelectedDay] = useState<{
    dateStr: string;
    workouts: WorkoutSessionRecord[];
    totalVolume: number;
  } | null>(null);

  // Compute 52-week calendar grid (or 12w / 26w)
  const heatmapData = useMemo(() => {
    const numWeeks = heatmapTimeframe === '12w' ? 12 : heatmapTimeframe === '26w' ? 26 : 52;
    const now = new Date();
    // Normalize to end of current week (Saturday)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentDayOfWeek = today.getDay(); // 0 is Sunday
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (6 - currentDayOfWeek)); // Saturday

    const totalDays = numWeeks * 7;
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - totalDays + 1);

    // Map history to ISO date string YYYY-MM-DD
    const workoutsByDate = new Map<string, WorkoutSessionRecord[]>();
    history.forEach(w => {
      const d = new Date(w.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const existing = workoutsByDate.get(key) || [];
      existing.push(w);
      workoutsByDate.set(key, existing);
    });

    const days: {
      date: Date;
      dateKey: string;
      dayOfWeek: number;
      workouts: WorkoutSessionRecord[];
      volume: number;
      count: number;
      isToday: boolean;
      isFuture: boolean;
    }[] = [];

    const cur = new Date(startDate);
    while (cur <= endDate) {
      const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
      const ws = workoutsByDate.get(key) || [];
      const vol = ws.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
      const isToday = key === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const isFuture = cur > today;

      days.push({
        date: new Date(cur),
        dateKey: key,
        dayOfWeek: cur.getDay(),
        workouts: ws,
        volume: vol,
        count: ws.length,
        isToday,
        isFuture
      });
      cur.setDate(cur.getDate() + 1);
    }

    // Group into columns of 7 days (Sunday = 0 to Saturday = 6)
    const weeks: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    // Streaks calculation
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    // Sort unique workout days
    const uniqueWorkoutDays = Array.from(workoutsByDate.keys()).sort();
    
    // Check if worked out today or yesterday to continue active streak
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    const tKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const hasToday = workoutsByDate.has(tKey);
    const hasYesterday = workoutsByDate.has(yKey);

    let streakWalker = new Date(hasToday ? today : yesterday);
    if (hasToday || hasYesterday) {
      while (true) {
        const checkKey = `${streakWalker.getFullYear()}-${String(streakWalker.getMonth() + 1).padStart(2, '0')}-${String(streakWalker.getDate()).padStart(2, '0')}`;
        if (workoutsByDate.has(checkKey)) {
          currentStreak++;
          streakWalker.setDate(streakWalker.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Calculate all-time max streak
    if (uniqueWorkoutDays.length > 0) {
      let prevD: Date | null = null;
      uniqueWorkoutDays.forEach(dayStr => {
        const parts = dayStr.split('-').map(Number);
        const thisD = new Date(parts[0], parts[1] - 1, parts[2]);
        if (prevD) {
          const diffDays = Math.round((thisD.getTime() - prevD.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
        } else {
          tempStreak = 1;
        }
        if (tempStreak > maxStreak) maxStreak = tempStreak;
        prevD = thisD;
      });
    }

    const totalSessions = history.length;
    const totalVolumeAll = history.reduce((sum, w) => sum + (w.totalVolume || 0), 0);

    return {
      weeks,
      numWeeks,
      currentStreak,
      maxStreak: Math.max(maxStreak, currentStreak),
      totalSessions,
      totalVolumeAll,
      activeDaysThisPeriod: days.filter(d => d.count > 0).length
    };
  }, [history, heatmapTimeframe]);

  // All-time PR Trophy Case
  const prTrophies = useMemo(() => {
    interface TrophyRecord {
      exerciseName: string;
      maxWeight: number;
      bestE1RM: number;
      bestReps: number;
      weightAtBestReps: number;
      bestDate: string;
      totalSetsLogged: number;
      category: 'Compound' | 'Isolation';
    }

    const map = new Map<string, TrophyRecord>();

    history.forEach(w => {
      w.exercises?.forEach(ex => {
        const comp = ex.sets?.filter(s => s.completed && s.type !== 'Warmup' && s.weight > 0 && s.reps > 0) || [];
        if (comp.length === 0) return;

        const current = map.get(ex.name) || {
          exerciseName: ex.name,
          maxWeight: 0,
          bestE1RM: 0,
          bestReps: 0,
          weightAtBestReps: 0,
          bestDate: '',
          totalSetsLogged: 0,
          category: (
            ex.name.toLowerCase().includes('squat') || 
            ex.name.toLowerCase().includes('press') || 
            ex.name.toLowerCase().includes('deadlift') || 
            ex.name.toLowerCase().includes('row') || 
            ex.name.toLowerCase().includes('pull-up') || 
            ex.name.toLowerCase().includes('chin')
          ) ? 'Compound' : 'Isolation'
        };

        current.totalSetsLogged += comp.length;

        comp.forEach(s => {
          if (s.weight > current.maxWeight) {
            current.maxWeight = s.weight;
          }
          const e1rm = calculateE1RM(s.weight, s.reps);
          if (e1rm > current.bestE1RM) {
            current.bestE1RM = e1rm;
            current.bestReps = s.reps;
            current.weightAtBestReps = s.weight;
            current.bestDate = w.date;
          }
        });

        map.set(ex.name, current);
      });
    });

    const all = Array.from(map.values());
    const compounds = all.filter(t => t.category === 'Compound').sort((a, b) => b.bestE1RM - a.bestE1RM);
    const isolations = all.filter(t => t.category === 'Isolation').sort((a, b) => b.bestE1RM - a.bestE1RM);

    return {
      all,
      compounds,
      isolations,
      topTrophies: all.sort((a, b) => b.bestE1RM - a.bestE1RM).slice(0, 8)
    };
  }, [history, calculateE1RM]);

  return (
    <div className="space-y-6">
      {/* 52-Week Training Heatmap & Consistency Card */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Training Frequency & Consistency Heatmap</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {heatmapData.totalSessions} Total Sessions
                </span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Every logged workout mapped across weeks to visualize volume density and habit momentum
              </p>
            </div>
          </div>

          {/* Timeframe Switcher & Streaks Badge */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{heatmapData.currentStreak} Day Streak</span>
            </div>

            <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
              {(['12w', '26w', '52w'] as const).map(tf => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setHeatmapTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-semibold transition ${
                    heatmapTimeframe === tf
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {tf === '12w' ? '12 Weeks' : tf === '26w' ? '6 Months' : '1 Year'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800/80">
            <div className="text-[10px] text-stone-500 uppercase font-mono font-bold">CURRENT STREAK</div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-0.5 flex items-baseline gap-1">
              <span>{heatmapData.currentStreak}</span>
              <span className="text-xs text-stone-400 font-normal">days</span>
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">Consecutive active training days</div>
          </div>

          <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800/80">
            <div className="text-[10px] text-stone-500 uppercase font-mono font-bold">LONGEST STREAK</div>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5 flex items-baseline gap-1">
              <span>{heatmapData.maxStreak}</span>
              <span className="text-xs text-stone-400 font-normal">days</span>
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">Personal record consistency run</div>
          </div>

          <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800/80">
            <div className="text-[10px] text-stone-500 uppercase font-mono font-bold">ACTIVE TRAINING DAYS</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5 flex items-baseline gap-1">
              <span>{heatmapData.activeDaysThisPeriod}</span>
              <span className="text-xs text-stone-400 font-normal">days</span>
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">Sessions logged in selected window</div>
          </div>

          <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800/80">
            <div className="text-[10px] text-stone-500 uppercase font-mono font-bold">LIFETIME VOLUME</div>
            <div className="text-xl font-bold font-mono text-stone-200 mt-0.5 flex items-baseline gap-1">
              <span>{heatmapData.totalVolumeAll.toLocaleString()}</span>
              <span className="text-xs text-stone-400 font-normal">{unit}</span>
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">Cumulative mechanical load</div>
          </div>
        </div>

        {/* The Interactive Heatmap Matrix */}
        <div className="bg-stone-950/90 p-4 rounded-2xl border border-stone-800 overflow-x-auto no-scrollbar">
          <div className="min-w-fit space-y-2">
            <div className="flex gap-1.5 items-center">
              {/* Day of Week Row Header */}
              <div className="flex flex-col gap-1 text-[9px] font-mono text-stone-500 pr-1.5 text-right select-none w-6">
                <span className="h-3 leading-3">S</span>
                <span className="h-3 leading-3 text-stone-400 font-bold">M</span>
                <span className="h-3 leading-3">T</span>
                <span className="h-3 leading-3 text-stone-400 font-bold">W</span>
                <span className="h-3 leading-3">T</span>
                <span className="h-3 leading-3 text-stone-400 font-bold">F</span>
                <span className="h-3 leading-3">S</span>
              </div>

              {/* Grid of Weeks (columns) */}
              <div className="flex gap-1">
                {heatmapData.weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {week.map((d) => {
                      const hasWorkout = d.count > 0;
                      const isMulti = d.count > 1;
                      const isHighVolume = d.volume > 15000;
                      const isSelected = selectedDay?.dateStr === d.dateKey;

                      // Color based on volume & status
                      let cellClass = 'bg-stone-900 border-stone-800 hover:border-stone-600';
                      if (d.isFuture) {
                        cellClass = 'bg-stone-950/40 border-stone-900 opacity-40 cursor-not-allowed';
                      } else if (hasWorkout) {
                        if (isHighVolume || isMulti) {
                          cellClass = 'bg-emerald-400 border-emerald-300 text-stone-950 shadow-sm shadow-emerald-400/30';
                        } else if (d.volume > 8000) {
                          cellClass = 'bg-emerald-500 border-emerald-400 text-stone-950';
                        } else {
                          cellClass = 'bg-emerald-700/80 border-emerald-600 text-emerald-100';
                        }
                      }

                      if (d.isToday) {
                        cellClass += ' ring-2 ring-amber-400 ring-offset-1 ring-offset-stone-950';
                      }
                      if (isSelected) {
                        cellClass += ' ring-2 ring-cyan-400 ring-offset-1 ring-offset-stone-950';
                      }

                      return (
                        <button
                          key={d.dateKey}
                          type="button"
                          disabled={d.isFuture}
                          onClick={() => {
                            if (d.count > 0) {
                              setSelectedDay({
                                dateStr: d.dateKey,
                                workouts: d.workouts,
                                totalVolume: d.volume
                              });
                            } else {
                              setSelectedDay(null);
                            }
                          }}
                          className={`w-3.5 h-3.5 rounded-[3px] border transition-all flex items-center justify-center text-[7px] font-bold ${cellClass}`}
                          title={`${d.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}: ${
                            hasWorkout ? `${d.count} workout (${d.volume.toLocaleString()} ${unit})` : 'Rest day'
                          }`}
                        >
                          {d.isToday && !hasWorkout && <span className="w-1 h-1 rounded-full bg-amber-400" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center justify-between text-[10px] text-stone-500 pt-2 border-t border-stone-800/60 font-mono">
              <div className="flex items-center gap-4">
                <span>{heatmapTimeframe === '12w' ? '12 Weeks Ago' : heatmapTimeframe === '26w' ? '6 Months Ago' : '52 Weeks Ago'}</span>
                <span>&rarr;</span>
                <span className="text-amber-400 font-bold">Today</span>
              </div>

              <div className="flex items-center gap-2">
                <span>Rest</span>
                <span className="w-3 h-3 rounded-[3px] bg-stone-900 border border-stone-800" />
                <span className="w-3 h-3 rounded-[3px] bg-emerald-700/80 border border-emerald-600" />
                <span className="w-3 h-3 rounded-[3px] bg-emerald-500 border border-emerald-400" />
                <span className="w-3 h-3 rounded-[3px] bg-emerald-400 border border-emerald-300" />
                <span>Heavy Load</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Day Inspection Drawer */}
        {selectedDay && (
          <div className="p-4 rounded-2xl bg-stone-950 border border-cyan-500/30 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-xs">
                  {new Date(selectedDay.dateStr).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-[11px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                  Vol: {selectedDay.totalVolume.toLocaleString()} {unit}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="text-[11px] text-stone-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-2">
              {selectedDay.workouts.map(w => (
                <div key={w.id} className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-white text-xs block">{w.title}</span>
                    <span className="text-[11px] text-stone-400">
                      {w.exercises?.length || 0} movements · {w.totalSets} completed sets · {w.totalReps} total reps
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-stone-300">
                    {w.exercises?.map(e => e.name).slice(0, 3).join(', ')}
                    {(w.exercises?.length || 0) > 3 && ` +${w.exercises.length - 3} more`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* All-Time PR Trophy Room & Hall of Fame */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>All-Time PR Trophy Room & Hall of Fame</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {prTrophies.all.length} Lifts Ranked
                </span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Verified estimated 1-Rep Maxes (e1RM), peak load PRs, and volume records across all completed workouts
              </p>
            </div>
          </div>
        </div>

        {prTrophies.all.length === 0 ? (
          <div className="text-center py-10 text-stone-500 text-xs">
            No personal records logged yet. Complete workouts with working sets to populate your trophy room!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {prTrophies.topTrophies.map((trophy, idx) => {
              const rankColor = 
                idx === 0 ? 'text-amber-400 border-amber-500/40 bg-amber-950/20 shadow-amber-500/10' :
                idx === 1 ? 'text-stone-300 border-stone-600 bg-stone-900/60' :
                idx === 2 ? 'text-amber-600 border-amber-700/50 bg-stone-900/60' :
                'text-stone-400 border-stone-800 bg-stone-950/60';

              const rankBadge = idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`;

              return (
                <div
                  key={trophy.exerciseName}
                  onClick={() => onSelectExercise && onSelectExercise(trophy.exerciseName)}
                  className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] cursor-pointer space-y-3 ${rankColor}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-900 border border-stone-700">
                          {rankBadge}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500 uppercase">
                          {trophy.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm tracking-tight truncate" title={trophy.exerciseName}>
                        {trophy.exerciseName}
                      </h4>
                    </div>
                    <Award className="w-5 h-5 shrink-0 mt-0.5" />
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-800/70 text-xs font-mono">
                    <div className="bg-stone-950/60 p-2 rounded-xl border border-stone-800/80">
                      <span className="text-[10px] text-stone-500 uppercase block">Best e1RM</span>
                      <span className="text-base font-bold text-amber-400">
                        {trophy.bestE1RM} {unit}
                      </span>
                    </div>

                    <div className="bg-stone-950/60 p-2 rounded-xl border border-stone-800/80">
                      <span className="text-[10px] text-stone-500 uppercase block">Max Load</span>
                      <span className="text-base font-bold text-cyan-400">
                        {trophy.maxWeight} {unit}
                      </span>
                    </div>
                  </div>

                  {/* Best set recap and date */}
                  <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 font-mono">
                    <span>Best: {trophy.weightAtBestReps} {unit} × {trophy.bestReps} reps</span>
                    <span className="text-stone-500">
                      {trophy.bestDate ? new Date(trophy.bestDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
