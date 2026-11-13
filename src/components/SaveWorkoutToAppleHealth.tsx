import { useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import { trackerNative } from '../native/tracker';

type Workout = { id: string; date: string; durationSeconds: number };

export function SaveWorkoutToAppleHealth({ workout }: { workout: Workout }) {
  const saving = useRef(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showDuration, setShowDuration] = useState(false);
  const [manualDuration, setManualDuration] = useState('');
  const [error, setError] = useState('');
  const hasDuration = Number.isFinite(workout.durationSeconds) && workout.durationSeconds > 0;

  async function save() {
    if (saving.current) return;
    if (!hasDuration && !showDuration) {
      setShowDuration(true);
      return;
    }
    const endAt = Date.parse(workout.date);
    const durationSeconds = hasDuration ? workout.durationSeconds : Number(manualDuration);
    if (!Number.isFinite(endAt)) {
      setError('This workout needs a valid date to be saved to Apple Health.');
      return;
    }
    if (!Number.isSafeInteger(durationSeconds) || durationSeconds <= 0 || durationSeconds >= endAt / 1000) {
      setError('Enter the workout duration in seconds.');
      return;
    }

    saving.current = true;
    setStatus('saving');
    setError('');
    try {
      await trackerNative.saveWorkout({ id: workout.id, endAt, durationSeconds });
      setStatus('saved');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not save this workout to Apple Health.');
      setStatus('idle');
    } finally {
      saving.current = false;
    }
  }

  return (
    <div className="space-y-2">
      {showDuration && status !== 'saved' && (
        <label className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-300">
          Workout duration (seconds)
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={manualDuration}
            onChange={event => setManualDuration(event.target.value)}
            className="w-20 rounded border border-stone-700 bg-stone-900 px-2 py-1 text-center text-white"
          />
        </label>
      )}
      <button
        type="button"
        onClick={save}
        disabled={status !== 'idle'}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/20 disabled:opacity-70"
      >
        <Heart className="h-4 w-4" aria-hidden="true" />
        {status === 'saved' ? 'Saved to Apple Health' : status === 'saving' ? 'Saving to Apple Health…' : 'Save to Apple Health'}
      </button>
      {error && <p className="text-xs text-rose-300" role="alert">{error}</p>}
    </div>
  );
}
