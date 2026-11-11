import React, { useState } from 'react';
import { 
  TrendingUp, 
  History, 
  Target, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Info, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Dumbbell
} from 'lucide-react';
import { 
  ProgressionLadder, 
  ProgressionStage 
} from '../data/progressiveOverloadEngine';

interface ProgressiveOverloadPathwayProps {
  ladder: ProgressionLadder;
  unit: 'lbs' | 'kg';
  onApplyStage?: (stage: ProgressionStage) => void;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
}

export const ProgressiveOverloadPathwayDrawer: React.FC<ProgressiveOverloadPathwayProps> = ({
  ladder,
  unit,
  onApplyStage,
  isCollapsible = true,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [appliedStageIdx, setAppliedStageIdx] = useState<number | null>(null);

  const prev = ladder.previousSession;
  const targetStage = ladder.recommendedNextStage;

  const handleApply = (stage: ProgressionStage) => {
    if (onApplyStage) {
      onApplyStage(stage);
      setAppliedStageIdx(stage.stageIndex);
      setTimeout(() => setAppliedStageIdx(null), 2500);
    }
  };

  return (
    <div className="bg-stone-950/90 border border-stone-800/90 rounded-2xl overflow-hidden transition-all">
      {/* Header Bar / Summary Strip */}
      <div className="p-3.5 sm:p-4 bg-stone-900/60 border-b border-stone-800/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5 sm:mt-0">
            <TrendingUp className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">
                Progressive Overload Pathway
              </span>

              {/* Source Badge */}
              {prev ? (
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                  prev.isExactSameWorkout
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                    : 'bg-stone-800 border-stone-700 text-stone-300'
                }`}>
                  <History className="w-3 h-3" />
                  {prev.isExactSameWorkout ? 'Same Workout History' : 'Recent Exercise History'}
                </span>
              ) : (
                <span className="text-[10px] font-mono text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                  Prescribed Baseline
                </span>
              )}
            </div>

            {/* Unboxed Metadata Line with · Separators */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-400 mt-1">
              {prev ? (
                <>
                  <span className="text-stone-300 font-medium">Last:</span>
                  <span className="text-amber-300 font-mono font-semibold">
                    {prev.workingWeight > 0 ? `${prev.workingWeight} ${unit} × [${prev.repsArray.join(', ')}]` : `[${prev.repsArray.join(', ')}]`}
                  </span>
                  <span>·</span>
                  <span className="font-mono text-stone-400">
                    Vol: {prev.totalVolume.toLocaleString()} {unit}
                  </span>
                  <span>·</span>
                  <span className="text-stone-500 font-mono text-[10px]">
                    {prev.workoutTitle ? `"${prev.workoutTitle}"` : ''} ({new Date(prev.workoutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})
                  </span>
                </>
              ) : (
                <span>No previous logs found for this exercise. Showing standard progression ladder.</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Cluster */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {onApplyStage && targetStage && (
            <button
              type="button"
              onClick={() => handleApply(targetStage)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                appliedStageIdx === targetStage.stageIndex
                  ? 'bg-emerald-500 text-stone-950 shadow-emerald-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20'
              }`}
              title="Apply today's recommended reps & weight target to sets"
            >
              {appliedStageIdx === targetStage.stageIndex ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Applied Today's Target!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply Target ({targetStage.targetWeight > 0 ? `${targetStage.targetWeight} ${unit} · ` : ''}[{targetStage.setReps.join(',')}])</span>
                </>
              )}
            </button>
          )}

          {isCollapsible && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-400 hover:text-white transition flex items-center gap-1 text-xs"
              title={isExpanded ? 'Collapse Overload Table' : 'Expand Overload Table'}
            >
              <span className="text-[11px] font-medium hidden sm:inline">
                {isExpanded ? 'Hide Ladder' : 'View Ladder'}
              </span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Table & Pathway Details */}
      {(isExpanded || !isCollapsible) && (
        <div className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Target Recommendation Spotlight Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-stone-900/60 to-stone-900/40 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  Today's Recommended Target
                </span>
                <span className="font-bold text-white text-sm">
                  {targetStage.title}
                </span>
              </div>
              <p className="text-xs text-stone-300">
                {targetStage.focusCue}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-400 pt-0.5">
                <span>Reps: <strong className="text-amber-300 font-mono">{targetStage.setReps.join(' · ')}</strong></span>
                <span>·</span>
                {targetStage.targetWeight > 0 && (
                  <>
                    <span>Load: <strong className="text-white font-mono">{targetStage.targetWeight} {unit}</strong></span>
                    <span>·</span>
                  </>
                )}
                <span>Target Effort: <strong className="text-emerald-400 font-mono">{targetStage.recommendedRPE}</strong></span>
                {targetStage.volumeDelta > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-emerald-400 font-mono">+{targetStage.volumeDelta.toLocaleString()} {unit} Vol (+{targetStage.volumeDeltaPct}%)</span>
                  </>
                )}
              </div>
            </div>

            {onApplyStage && (
              <button
                type="button"
                onClick={() => handleApply(targetStage)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-amber-500/20"
              >
                <Check className="w-4 h-4" />
                <span>Apply This Target</span>
              </button>
            )}
          </div>

          {/* Overload Lookup Table Matrix */}
          <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-950">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-900/80 text-[11px] font-mono text-stone-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Progression Stage</th>
                  <th className="py-2.5 px-3">Load</th>
                  <th className="py-2.5 px-3">Reps per Set</th>
                  <th className="py-2.5 px-3 text-right">Proj. Vol</th>
                  <th className="py-2.5 px-3 text-right">Vol Δ</th>
                  <th className="py-2.5 px-3 text-right">Est. 1RM</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-mono">
                {ladder.stages.map((stage) => {
                  const isCurrent = stage.isCurrentTarget;
                  const isBaseline = stage.stageIndex === 0;
                  const isApplied = appliedStageIdx === stage.stageIndex;

                  return (
                    <tr 
                      key={stage.stageIndex}
                      className={`transition-colors ${
                        isCurrent 
                          ? 'bg-amber-950/20 hover:bg-amber-950/30 border-l-2 border-l-amber-500' 
                          : isBaseline
                          ? 'bg-stone-900/30 text-stone-400'
                          : 'hover:bg-stone-900/50'
                      }`}
                    >
                      {/* Stage info */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5 font-sans">
                          {isCurrent && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={`font-bold text-xs ${isCurrent ? 'text-amber-300' : isBaseline ? 'text-stone-400' : 'text-stone-200'}`}>
                                {stage.title}
                              </span>
                              {isCurrent && (
                                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                                  Today
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-500 font-sans block">
                              {stage.badgeLabel}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Weight */}
                      <td className="py-2.5 px-3 font-semibold text-stone-200">
                        {stage.targetWeight > 0 ? `${stage.targetWeight} ${unit}` : 'Bodyweight'}
                      </td>

                      {/* Set-by-Set Reps */}
                      <td className="py-2.5 px-3 text-stone-300">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-amber-400/90">
                            [{stage.setReps.join(', ')}]
                          </span>
                          <span className="text-[10px] text-stone-500 font-sans">
                            ({stage.totalReps} total)
                          </span>
                        </div>
                      </td>

                      {/* Total Volume */}
                      <td className="py-2.5 px-3 text-right text-stone-300 tabular-nums">
                        {stage.projectedVolume > 0 ? `${stage.projectedVolume.toLocaleString()} ${unit}` : '—'}
                      </td>

                      {/* Volume Delta */}
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {stage.volumeDelta > 0 ? (
                          <span className="text-emerald-400 font-bold">
                            +{stage.volumeDelta.toLocaleString()} ({stage.volumeDeltaPct}%)
                          </span>
                        ) : stage.volumeDelta < 0 ? (
                          <span className="text-stone-500">
                            {stage.volumeDelta.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-stone-500">Baseline</span>
                        )}
                      </td>

                      {/* Estimated 1RM */}
                      <td className="py-2.5 px-3 text-right text-stone-300 tabular-nums">
                        {stage.projectedE1RM > 0 ? (
                          <span className="font-semibold">
                            {stage.projectedE1RM} {unit}
                            {stage.e1RMDelta > 0 && (
                              <span className="text-emerald-400 text-[10px] ml-1">
                                (+{stage.e1RMDelta})
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-stone-500">—</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 text-center">
                        {onApplyStage ? (
                          <button
                            type="button"
                            onClick={() => handleApply(stage)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-sans font-bold transition flex items-center justify-center gap-1 mx-auto ${
                              isApplied
                                ? 'bg-emerald-500 text-stone-950'
                                : isCurrent
                                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-sm shadow-amber-500/20'
                                : 'bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700'
                            }`}
                            title={`Apply ${stage.title} (${stage.targetWeight} ${unit} × [${stage.setReps.join(',')}]) to sets`}
                          >
                            {isApplied ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Applied</span>
                              </>
                            ) : (
                              <span>Apply</span>
                            )}
                          </button>
                        ) : (
                          <span className="text-stone-600 text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Scientific Principle & Equipment Increments Footnote */}
          <div className="p-3 bg-stone-900/40 rounded-xl border border-stone-800/80 flex items-start gap-2.5 text-[11px] text-stone-400">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-stone-300 block">
                Progressive Overload Rule: Double Progression Method
              </span>
              <p className="leading-relaxed">
                {ladder.progressionPrinciple} Micro-load increment is calibrated to equipment ({ladder.equipment}: +{ladder.weightIncrement} {unit}). Ensure all sets hit the prescribed rep ceiling before taking the load leap to protect tendon health and maintain crisp mechanical tension.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
