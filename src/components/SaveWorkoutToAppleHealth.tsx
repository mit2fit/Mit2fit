import { useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import { trackerNative } from '../native/tracker';

type Workout = { id: string; date: string; durationSeconds: number };

export function SaveWorkoutToAppleHealth({ workout }: { workout: Workout }) {
  const saving = useRef(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState('');

  async function save() {
    if (saving.current) return;
    saving.current = true;
    setStatus('saving');
    setError('');
    try {
      await trackerNative.saveWorkout({
        id: workout.id,
        endAt: Date.parse(workout.date),
        durationSeconds: workout.durationSeconds,
      });
      setStatus('saved');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not save this workout to Apple Health.');
      setStatus('idle');
    } finally {
      saving.current = false;
    }
  }

  if (workout.durationSeconds <= 0 || !Number.isFinite(Date.parse(workout.date))) return null;

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={save}
        disabled={status !== 'idle'}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/20 disabled:opacity-70"
      >
        <Heart className="h-4 w-4" aria-hidden="true" />
        {status === 'saved' ? 'Saved to Apple Health' : status === 'saving' ? 'Saving to Apple Health…' : 'Save to Apple Health'}
      </button>
      {error && <p className="text-xs text-rose-300" role="alert">{error}</p>}
    </div>
  );
}
