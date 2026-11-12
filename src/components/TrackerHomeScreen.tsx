import { useEffect } from 'react';
import { ChevronDown, Smartphone } from 'lucide-react';

export function TrackerHomeScreen() {
  useEffect(() => {
    const manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = '/tracker.webmanifest';
    document.head.append(manifest);

    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/tracker-sw.js', { scope: '/tracker' }).catch(error => {
        console.warn('Could not prepare the tracker for offline use', error);
      });
    }

    return () => manifest.remove();
  }, []);

  const isAppleMobile = /iPhone|iPad|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || (navigator as Navigator & { standalone?: boolean }).standalone;
  if (!isAppleMobile || isStandalone) return null;

  return (
    <details className="group mb-4 rounded-xl border border-stone-800 bg-stone-900/60 text-sm print:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-semibold text-stone-200 [&::-webkit-details-marker]:hidden">
        <Smartphone aria-hidden="true" className="h-4 w-4 shrink-0 text-amber-400" />
        <span className="flex-1">Add Tracker to Home Screen</span>
        <ChevronDown aria-hidden="true" className="h-4 w-4 text-stone-400 group-open:rotate-180" />
      </summary>
      <div className="space-y-2 px-4 pb-4 text-xs leading-relaxed text-stone-300">
        <p>Open the tracker in Safari. Tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>. Turn on <strong>Open as Web App</strong> if shown, then tap <strong>Add</strong>.</p>
        <p>Open the new icon once while online to prepare it for offline workouts.</p>
        <p>To bring over existing workouts and routines, use <strong>Saved to Device</strong> to export a backup here and import it from the Home Screen app.</p>
      </div>
    </details>
  );
}
