import { registerPlugin } from '@capacitor/core';

type RestAlertPermission = 'granted' | 'denied' | 'default';

interface TrackerPlugin {
  saveWorkout(options: { id: string; endAt: number; durationSeconds: number }): Promise<void>;
  restAlertPermission(): Promise<{ permission: RestAlertPermission }>;
  requestRestAlerts(): Promise<{ permission: RestAlertPermission }>;
  syncRestTimer(options: { endsAt: number | null; notify: boolean; sound: boolean }): Promise<void>;
}

export const trackerNative = registerPlugin<TrackerPlugin>('Mit2FitTracker');

let restUpdate = Promise.resolve();
let restRevision = 0;

export function syncNativeRestTimer(endsAt: number | null, notify: boolean, sound: boolean) {
  const revision = ++restRevision;
  restUpdate = restUpdate.then(async () => {
    if (revision === restRevision) await trackerNative.syncRestTimer({ endsAt, notify, sound });
  }).catch(error => console.warn('Could not update the iPhone rest timer', error));
}
