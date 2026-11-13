import { registerPlugin } from '@capacitor/core';

export type RestActivityStatus = 'active' | 'disabled' | 'unavailable' | 'inactive';

type RestAlertPermission = 'granted' | 'denied' | 'default';

interface TrackerPlugin {
  saveWorkout(options: { id: string; endAt: number; durationSeconds: number }): Promise<void>;
  restAlertPermission(): Promise<{ permission: RestAlertPermission }>;
  requestRestAlerts(): Promise<{ permission: RestAlertPermission }>;
  syncRestTimer(options: { endsAt: number | null; notify: boolean; sound: boolean }): Promise<{ activity: RestActivityStatus }>;
  openAppSettings(): Promise<void>;
}

export const trackerNative = registerPlugin<TrackerPlugin>('Mit2FitTracker');

let restUpdate = Promise.resolve();
let restRevision = 0;

export function syncNativeRestTimer(endsAt: number | null, notify: boolean, sound: boolean) {
  const revision = ++restRevision;
  const update = restUpdate.then(async () => {
    if (revision !== restRevision) return undefined;
    const { activity } = await trackerNative.syncRestTimer({ endsAt, notify, sound });
    return activity;
  }).catch(error => {
    console.warn('Could not update the iPhone rest timer', error);
    return 'unavailable' as const;
  });
  restUpdate = update.then(() => undefined);
  return update;
}
