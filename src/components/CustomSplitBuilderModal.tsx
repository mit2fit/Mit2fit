import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  X, 
  Search, 
  Dumbbell, 
  Check, 
  Layers, 
  ArrowUp, 
  ArrowDown
} from 'lucide-react';
import { 
  EXERCISE_DATABASE, 
  ExerciseDefinition, 
  SplitCategory, 
  SPLIT_OPTIONS 
} from '../data/exerciseLibrary';

export interface CustomRoutineSlot {
  exercise: ExerciseDefinition;
  targetSets: number;
  targetReps: number;
  minReps: number;
  maxReps: number;
  targetWeight: number;
  equipment: string;
  supersetTag?: string;
}

export interface CustomRoutineOutput {
  id: string;
  name: string;
  split: SplitCategory;
  description: string;
  slots: CustomRoutineSlot[];
}

interface CustomSplitBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRoutine: (routine: CustomRoutineOutput) => boolean;
}

export const CustomSplitBuilderModal: React.FC<CustomSplitBuilderModalProps> = ({
  isOpen,
  onClose,
  onSaveRoutine
}) => {
  const [routineName, setRoutineName] = useState('');
  const [selectedSplit, setSelectedSplit] = useState<SplitCategory>('Upper Body');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [routineSlots, setRoutineSlots] = useState<CustomRoutineSlot[]>([]);
  const [saveFailed, setSaveFailed] = useState(false);

  // Filter exercise database by split, equipment, and search
  const availableExercises = useMemo(() => {
    return EXERCISE_DATABASE.filter(ex => {
      // Split match
      if (selectedSplit && ex.split !== selectedSplit) return false;

      // Equipment match
      if (equipmentFilter !== 'All') {
        if (equipmentFilter === 'Dumbbells Only' && ex.defaultEquipment !== 'Dumbbell' && !ex.supportedEquipment.includes('Dumbbell')) return false;
        if (equipmentFilter === 'Barbell Only' && ex.defaultEquipment !== 'Barbell' && !ex.supportedEquipment.includes('Barbell')) return false;
        if (equipmentFilter === 'Cables & Machines' && ex.defaultEquipment !== 'Cable' && ex.defaultEquipment !== 'Machine') return false;
        if (equipmentFilter === 'Bodyweight Only' && ex.defaultEquipment !== 'Bodyweight') return false;
        if (equipmentFilter === 'Kettlebells' && ex.defaultEquipment !== 'Kettlebell') return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ex.name.toLowerCase().includes(q) ||
          ex.primaryMuscle.toLowerCase().includes(q) ||
          ex.subCategory.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedSplit, equipmentFilter, searchQuery]);

  if (!isOpen) return null;

  const handleAddExercise = (exercise: ExerciseDefinition) => {
    const newSlot: CustomRoutineSlot = {
      exercise,
      targetSets: exercise.defaultTarget?.targetSets || 3,
      targetReps: exercise.defaultTarget?.targetReps || 10,
      minReps: exercise.defaultTarget?.minReps || 8,
      maxReps: exercise.defaultTarget?.maxReps || 12,
      targetWeight: exercise.defaultTarget?.defaultWeight || 0,
      equipment: exercise.defaultEquipment
    };

    setRoutineSlots(prev => prev.some(slot => slot.exercise.id === exercise.id) ? prev : [...prev, newSlot]);
  };

  const handleRemoveSlot = (index: number) => {
    setRoutineSlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveSlot = (index: number, direction: 'up' | 'down') => {
    setRoutineSlots(prev => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleUpdateSlot = (index: number, updates: Partial<CustomRoutineSlot>) => {
    setRoutineSlots(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const handleSave = () => {
    const finalName = routineName.trim() || `Custom ${selectedSplit} Routine`;
    const newRoutine: CustomRoutineOutput = {
      id: `custom-routine-${Date.now()}`,
      name: finalName,
      split: selectedSplit,
      description: `Custom ${selectedSplit} program with ${routineSlots.length} curated exercises.`,
      slots: routineSlots
    };

    if (!onSaveRoutine(newRoutine)) {
      setSaveFailed(true);
      return;
    }

    setRoutineName('');
    setSelectedSplit('Upper Body');
    setEquipmentFilter('All');
    setSearchQuery('');
    setRoutineSlots([]);
    setSaveFailed(false);
    onClose();
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="custom-split-title" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-4xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[92dvh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 id="custom-split-title" className="font-bold text-white text-base">Custom Routine Architect</h3>
              <p className="text-xs text-stone-400">
                Design custom workout days filtered by equipment from the 161-exercise library
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs Strip: Routine Name & Split */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label htmlFor="custom-split-name" className="text-[11px] font-mono text-stone-400 block mb-1">
              Routine Name:
            </label>
            <input
              id="custom-split-name"
              type="text"
              placeholder={`e.g. Hypertrophy ${selectedSplit} Blitz`}
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label htmlFor="custom-split-category" className="text-[11px] font-mono text-stone-400 block mb-1">
              Split Category:
            </label>
            <select
              id="custom-split-category"
              value={selectedSplit}
              onChange={(e) => setSelectedSplit(e.target.value as SplitCategory)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-amber-400 font-bold focus:outline-none focus:border-amber-500"
            >
              {SPLIT_OPTIONS.map(split => (
                <option key={split} value={split}>
                  {split}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Split 2 Columns: Left is Added Sequence, Right is Exercise Library Browser */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 flex-1 min-h-0 overflow-y-auto md:overflow-hidden text-xs">
          {/* LEFT: Current Routine Sequence */}
          <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex flex-col shrink-0 min-h-0">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800/80 mb-2">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <span>Routine Sequence</span>
                <span className="text-[10px] font-mono text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30">
                  {routineSlots.length} Exercises
                </span>
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                Reorder & configure sets
              </span>
            </div>

            {routineSlots.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-2">
                <Dumbbell className="w-8 h-8 opacity-40 text-stone-600" />
                <p>No exercises added yet.</p>
                <p className="text-[11px] text-stone-600">
                  Select exercises from the library on the right to build your custom workout.
                </p>
              </div>
            ) : (
              <div className="md:flex-1 max-h-52 md:max-h-none overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
                {routineSlots.map((slot, sIdx) => (
                  <div 
                    key={slot.exercise.id}
                    className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-stone-500 bg-stone-950 px-1.5 py-0.2 rounded border border-stone-800">
                            #{sIdx + 1}
                          </span>
                          <span className="font-bold text-white text-xs truncate">
                            {slot.exercise.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          {slot.exercise.primaryMuscle} · {slot.equipment}
                        </span>
                      </div>

                      {/* Controls: Up, Down, Delete */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={sIdx === 0}
                          onClick={() => handleMoveSlot(sIdx, 'up')}
                          className="p-1 rounded bg-stone-950 hover:bg-stone-800 text-stone-400 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={sIdx === routineSlots.length - 1}
                          onClick={() => handleMoveSlot(sIdx, 'down')}
                          className="p-1 rounded bg-stone-950 hover:bg-stone-800 text-stone-400 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(sIdx)}
                          className="p-1 rounded bg-red-950/40 hover:bg-red-900/60 text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Config Row: Sets, Reps, Superset */}
                    <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono pt-1 border-t border-stone-800/60">
                      <div>
                        <span className="text-[9px] text-stone-500 block">SETS</span>
                        <input
                          type="number"
                          aria-label={`Sets for ${slot.exercise.name}`}
                          value={slot.targetSets}
                          min={1}
                          max={10}
                          onChange={(e) => handleUpdateSlot(sIdx, { targetSets: Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)) })}
                          className="w-full bg-stone-950 border border-stone-800 rounded px-1.5 py-0.5 text-amber-400 font-bold text-center"
                        />
                      </div>

                      <div>
                        <span className="text-[9px] text-stone-500 block">REPS</span>
                        <input
                          type="number"
                          aria-label={`Reps for ${slot.exercise.name}`}
                          value={slot.targetReps}
                          min={1}
                          max={50}
                          onChange={(e) => handleUpdateSlot(sIdx, { targetReps: Math.max(1, Math.min(50, parseInt(e.target.value, 10) || 1)) })}
                          className="w-full bg-stone-950 border border-stone-800 rounded px-1.5 py-0.5 text-stone-200 font-bold text-center"
                        />
                      </div>

                      <div>
                        <span className="text-[9px] text-stone-500 block">SUPERSET</span>
                        <select
                          aria-label={`Superset for ${slot.exercise.name}`}
                          value={slot.supersetTag || ''}
                          onChange={(e) => handleUpdateSlot(sIdx, { supersetTag: e.target.value || undefined })}
                          className="w-full bg-stone-950 border border-stone-800 rounded px-1 py-0.5 text-[10px] text-cyan-300"
                        >
                          <option value="">Solo</option>
                          <option value="A1">Pair A1</option>
                          <option value="A2">Pair A2</option>
                          <option value="B1">Pair B1</option>
                          <option value="B2">Pair B2</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Exercise Library Browser */}
          <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex flex-col shrink-0 min-h-0">
            {/* Filter Tools */}
            <div className="space-y-2 pb-2 border-b border-stone-800/80 mb-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">
                  Available Exercises ({availableExercises.length})
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {selectedSplit}
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Search exercise, muscle (e.g. Incline, Lats)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Equipment Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 text-[10px] font-mono">
                {['All', 'Dumbbells Only', 'Barbell Only', 'Cables & Machines', 'Bodyweight Only', 'Kettlebells'].map(eq => (
                  <button
                    key={eq}
                    type="button"
                    onClick={() => setEquipmentFilter(eq)}
                    className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition ${
                      equipmentFilter === eq
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                    }`}
                  >
                    {eq}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Selectable Exercises */}
            <div className="md:flex-1 max-h-52 md:max-h-none overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
              {availableExercises.map(ex => {
                const isAdded = routineSlots.some(s => s.exercise.id === ex.id);

                return (
                  <div
                    key={ex.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition ${
                      isAdded
                        ? 'bg-amber-950/20 border-amber-500/40 opacity-70'
                        : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-white text-xs truncate block">
                        {ex.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                        <span>{ex.primaryMuscle}</span>
                        <span>·</span>
                        <span className="text-amber-400/90">{ex.defaultEquipment}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isAdded}
                      onClick={() => handleAddExercise(ex)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0 ${
                        isAdded
                          ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                      }`}
                    >
                      {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      <span>{isAdded ? 'Added' : 'Add'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        {saveFailed && (
          <p role="alert" className="text-xs text-red-300">Could not save the routine to this browser. Check site storage and try again.</p>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-stone-800 text-xs">
          <span className="text-stone-400 text-[11px]">
            {routineSlots.length} exercises ready to assemble
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={routineSlots.length === 0}
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-amber-500/20"
            >
              <Check className="w-4 h-4" />
              <span>Save & Activate Routine</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
