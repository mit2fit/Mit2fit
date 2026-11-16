import React, { useMemo, useState, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Bell,
  BellRing,
  Download,
  ExternalLink,
  Play,
  Check,
  Trash2,
  Plus,
  Layers,
  Paintbrush,
  Wand2,
  Clock,
  Search,
  RotateCcw,
  BookmarkPlus,
} from 'lucide-react';
import {
  EXERCISE_DATABASE,
  ExperienceLevel,
  RoutineTemplate,
  SplitCategory,
} from '../data/exerciseLibrary';
import { ROUTINE_DEFINITIONS, buildParametricRoutine } from '../data/routineLookupTable';
import {
  ScheduledWorkoutItem,
  WeeklyBlueprint,
  WeeklyBlueprintSlot,
  buildGoogleCalendarUrl,
  buildPresetBlueprint,
  downloadScheduleICS,
  generateMonthFromBlueprint,
  getMonthCalendarCells,
  parseLocalDateKey,
  resolveScheduledExercisesSummary,
  toLocalDateKey,
} from '../utils/workoutScheduler';

interface MonthlyScheduleTabProps {
  scheduledWorkouts: ScheduledWorkoutItem[];
  onChangeSchedule: (next: ScheduledWorkoutItem[]) => void;
  weeklyBlueprint: WeeklyBlueprint;
  onChangeBlueprint: (next: WeeklyBlueprint) => void;
  routines: RoutineTemplate[];
  onSaveCustomTemplateFromSchedule: (
    name: string,
    split: SplitCategory,
    exerciseIds: string[]
  ) => RoutineTemplate;
  onStartScheduledWorkout: (item: ScheduledWorkoutItem) => void;
  onOpenCustomSplitBuilder: () => void;
  notificationPermission: string;
  onRequestNotifications: () => void;
  onNotify: (msg: string) => void;
}

const WEEKDAY_NAMES_MON_START: { dow: number; short: string; full: string }[] = [
  { dow: 1, short: 'Mon', full: 'Monday' },
  { dow: 2, short: 'Tue', full: 'Tuesday' },
  { dow: 3, short: 'Wed', full: 'Wednesday' },
  { dow: 4, short: 'Thu', full: 'Thursday' },
  { dow: 5, short: 'Fri', full: 'Friday' },
  { dow: 6, short: 'Sat', full: 'Saturday' },
  { dow: 0, short: 'Sun', full: 'Sunday' },
];

const REMINDER_OPTIONS = [
  { value: -1, label: 'No alert' },
  { value: 0, label: 'At workout time' },
  { value: 15, label: '15 min before' },
  { value: 30, label: '30 min before' },
  { value: 60, label: '1 hr before' },
];

export const MonthlyScheduleTab: React.FC<MonthlyScheduleTabProps> = ({
  scheduledWorkouts,
  onChangeSchedule,
  weeklyBlueprint,
  onChangeBlueprint,
  routines,
  onSaveCustomTemplateFromSchedule,
  onStartScheduledWorkout,
  onOpenCustomSplitBuilder,
  notificationPermission,
  onRequestNotifications,
  onNotify,
}) => {
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => toLocalDateKey(today), [today]);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);

  // Planner Mode: Blueprint panel expanded if current month has no scheduled items initially
  const [isBlueprintOpen, setIsBlueprintOpen] = useState<boolean>(() => {
    const prefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-`;
    return !scheduledWorkouts.some((item) => item.date.startsWith(prefix));
  });

  // Blueprint bulk controls
  const [blueprintTier, setBlueprintTier] = useState<ExperienceLevel>('Intermediate');
  const [blueprintDefaultTime, setBlueprintDefaultTime] = useState('07:00');
  const [blueprintReminderMins, setBlueprintReminderMins] = useState(30);
  const [onlyUpcomingDates, setOnlyUpcomingDates] = useState(true);
  const [overwriteExistingDates, setOverwriteExistingDates] = useState(false);

  // Quick-Paint Brush State (Click-to-assign on calendar grid)
  const [isPaintMode, setIsPaintMode] = useState(false);
  const [brushSource, setBrushSource] = useState<'parametric' | 'custom_routine' | 'ad_hoc'>('parametric');
  const [brushRoutineId, setBrushRoutineId] = useState<string>(ROUTINE_DEFINITIONS[0].id);
  const [brushLevel, setBrushLevel] = useState<ExperienceLevel>('Intermediate');
  const [brushCustomRoutineId, setBrushCustomRoutineId] = useState<string>('');
  const [brushCustomTitle, setBrushCustomTitle] = useState<string>('Custom Conditioning Session');
  const [brushTime, setBrushTime] = useState<string>('07:00');
  const [brushReminderMins, setBrushReminderMins] = useState<number>(30);

  // Day Inspector Form State (mirrors selectedDateKey)
  const [editorMode, setEditorMode] = useState<'parametric' | 'custom_routine' | 'ad_hoc'>('parametric');
  const [editorRoutineId, setEditorRoutineId] = useState<string>(ROUTINE_DEFINITIONS[0].id);
  const [editorLevel, setEditorLevel] = useState<ExperienceLevel>('Intermediate');
  const [editorCustomRoutineId, setEditorCustomRoutineId] = useState<string>('');
  const [editorCustomTitle, setEditorCustomTitle] = useState<string>('');
  const [editorCustomSplit, setEditorCustomSplit] = useState<SplitCategory>('Upper Body');
  const [editorCustomExercises, setEditorCustomExercises] = useState<string[]>([]);
  const [editorExerciseSearch, setEditorExerciseSearch] = useState<string>('');
  const [alsoSaveAsRoutine, setAlsoSaveAsRoutine] = useState<boolean>(false);
  const [editorTime, setEditorTime] = useState<string>('07:00');
  const [editorDuration, setEditorDuration] = useState<number>(55);
  const [editorReminder, setEditorReminder] = useState<number>(30);
  const [editorNotes, setEditorNotes] = useState<string>('');

  const customSavedRoutines = useMemo(
    () => routines.filter((r) => r.isCustom),
    [routines]
  );

  // Ensure default custom routine selection stays valid
  useEffect(() => {
    if (customSavedRoutines.length > 0 && !brushCustomRoutineId) {
      setBrushCustomRoutineId(customSavedRoutines[0].id);
    }
    if (customSavedRoutines.length > 0 && !editorCustomRoutineId) {
      setEditorCustomRoutineId(customSavedRoutines[0].id);
    }
  }, [customSavedRoutines, brushCustomRoutineId, editorCustomRoutineId]);

  const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-`;
  const monthLabel = useMemo(
    () => new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
    [viewYear, viewMonth]
  );

  const calendarCells = useMemo(
    () => getMonthCalendarCells(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const scheduleByDate = useMemo(() => {
    const map = new Map<string, ScheduledWorkoutItem>();
    scheduledWorkouts.forEach((item) => map.set(item.date, item));
    return map;
  }, [scheduledWorkouts]);

  const monthItems = useMemo(
    () =>
      scheduledWorkouts
        .filter((item) => item.date.startsWith(monthPrefix))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [scheduledWorkouts, monthPrefix]
  );

  const monthStats = useMemo(() => {
    const total = monthItems.length;
    const completed = monthItems.filter((i) => i.status === 'completed').length;
    const remaining = total - completed;
    const totalHours = Math.round((monthItems.reduce((acc, i) => acc + (i.durationMin || 50), 0) / 60) * 10) / 10;
    return { total, completed, remaining, totalHours };
  }, [monthItems]);

  const selectedScheduledItem = scheduleByDate.get(selectedDateKey);

  // Sync Day Inspector form when selecting a different date
  useEffect(() => {
    const existing = scheduleByDate.get(selectedDateKey);
    if (existing) {
      setEditorMode(existing.sourceType);
      if (existing.sourceType === 'parametric') {
        setEditorRoutineId(existing.routineId || ROUTINE_DEFINITIONS[0].id);
        setEditorLevel(existing.level || 'Intermediate');
      } else if (existing.sourceType === 'custom_routine') {
        setEditorCustomRoutineId(existing.routineId || customSavedRoutines[0]?.id || '');
      } else {
        setEditorCustomTitle(existing.title);
        setEditorCustomSplit(
          existing.split === 'Custom' ? 'Upper Body' : existing.split
        );
        setEditorCustomExercises(existing.customExerciseIds || []);
      }
      setEditorTime(existing.time || '07:00');
      setEditorDuration(existing.durationMin || 55);
      setEditorReminder(existing.reminderMinutesBefore ?? 30);
      setEditorNotes(existing.notes || '');
      setAlsoSaveAsRoutine(false);
    } else {
      setEditorTime(blueprintDefaultTime);
      setEditorReminder(blueprintReminderMins);
      setEditorNotes('');
      setEditorCustomTitle('');
      setEditorCustomExercises([]);
      setAlsoSaveAsRoutine(false);
    }
  }, [selectedDateKey, scheduleByDate]);

  const filteredExercises = useMemo(() => {
    const q = editorExerciseSearch.trim().toLowerCase();
    if (!q) return EXERCISE_DATABASE.slice(0, 24);
    return EXERCISE_DATABASE.filter(
      (ex) =>
        ex.name.toLowerCase().includes(q) ||
        ex.primaryMuscle.toLowerCase().includes(q) ||
        ex.split.toLowerCase().includes(q)
    ).slice(0, 24);
  }, [editorExerciseSearch]);

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const goToCurrentMonth = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDateKey(todayKey);
  };

  const handleApplyBlueprintPreset = (presetKey: 'upper-lower-4' | 'ppl-3' | 'full-body-3') => {
    const next = buildPresetBlueprint(presetKey, blueprintTier, blueprintDefaultTime, blueprintReminderMins);
    onChangeBlueprint(next);
    onNotify('Weekly pattern updated. Click "Auto-Fill Month" to schedule every matching day.');
  };

  const handleUpdateBlueprintDay = (
    dow: number,
    value: string // 'rest' | 'param:<defId>' | 'custom:<routineId>'
  ) => {
    if (value === 'rest') {
      onChangeBlueprint({ ...weeklyBlueprint, [dow]: null });
      return;
    }

    if (value.startsWith('param:')) {
      const defId = value.replace('param:', '');
      const def = ROUTINE_DEFINITIONS.find((d) => d.id === defId) || ROUTINE_DEFINITIONS[0];
      const slot: WeeklyBlueprintSlot = {
        enabled: true,
        sourceType: 'parametric',
        routineId: def.id,
        level: blueprintTier,
        title: def.name,
        split: def.split,
        time: blueprintDefaultTime,
        durationMin: def.estimatedDurationMin,
        reminderMinutesBefore: blueprintReminderMins,
      };
      onChangeBlueprint({ ...weeklyBlueprint, [dow]: slot });
      return;
    }

    if (value.startsWith('custom:')) {
      const routineId = value.replace('custom:', '');
      const custom = customSavedRoutines.find((r) => r.id === routineId);
      if (!custom) return;
      const slot: WeeklyBlueprintSlot = {
        enabled: true,
        sourceType: 'custom_routine',
        routineId: custom.id,
        level: custom.level || 'Intermediate',
        title: custom.name,
        split: custom.split,
        time: blueprintDefaultTime,
        durationMin: custom.durationMin || 50,
        reminderMinutesBefore: blueprintReminderMins,
      };
      onChangeBlueprint({ ...weeklyBlueprint, [dow]: slot });
    }
  };

  const handleAutoFillMonth = () => {
    // Propagate latest default time/tier/reminder onto active slots before building
    const syncedBlueprint: WeeklyBlueprint = { ...weeklyBlueprint };
    Object.keys(syncedBlueprint).forEach((k) => {
      const idx = Number(k);
      const slot = syncedBlueprint[idx];
      if (slot) {
        syncedBlueprint[idx] = {
          ...slot,
          level: slot.sourceType === 'parametric' ? blueprintTier : slot.level,
          time: blueprintDefaultTime,
          reminderMinutesBefore: blueprintReminderMins,
        };
      }
    });
    onChangeBlueprint(syncedBlueprint);

    const updated = generateMonthFromBlueprint(viewYear, viewMonth, syncedBlueprint, scheduledWorkouts, {
      onlyUpcoming: onlyUpcomingDates,
      overwriteExisting: overwriteExistingDates,
    });
    onChangeSchedule(updated);
    const addedCount = updated.filter((i) => i.date.startsWith(monthPrefix)).length;
    onNotify(`Scheduled ${addedCount} workouts for ${monthLabel}.`);
  };

  const handleClearMonth = () => {
    const next = scheduledWorkouts.filter((item) => !item.date.startsWith(monthPrefix));
    onChangeSchedule(next);
    onNotify(`Cleared scheduled workouts for ${monthLabel}.`);
  };

  const handleCalendarCellClick = (dateKey: string) => {
    setSelectedDateKey(dateKey);
    if (!isPaintMode) return;

    const existing = scheduleByDate.get(dateKey);

    if (brushSource === 'parametric') {
      const def = ROUTINE_DEFINITIONS.find((d) => d.id === brushRoutineId) || ROUTINE_DEFINITIONS[0];
      if (existing && existing.sourceType === 'parametric' && existing.routineId === def.id && existing.level === brushLevel) {
        // Toggle off on repeat click
        onChangeSchedule(scheduledWorkouts.filter((i) => i.date !== dateKey));
        return;
      }
      const nextItem: ScheduledWorkoutItem = {
        id: existing?.id || `sched-${dateKey}-${Date.now()}`,
        date: dateKey,
        sourceType: 'parametric',
        routineId: def.id,
        level: brushLevel,
        title: def.name,
        split: def.split,
        time: brushTime,
        durationMin: def.estimatedDurationMin,
        reminderMinutesBefore: brushReminderMins,
        status: existing?.status || 'scheduled',
      };
      onChangeSchedule([...scheduledWorkouts.filter((i) => i.date !== dateKey), nextItem].sort((a, b) => a.date.localeCompare(b.date)));
      return;
    }

    if (brushSource === 'custom_routine') {
      const routine = customSavedRoutines.find((r) => r.id === brushCustomRoutineId);
      if (!routine) {
        onNotify('Select or create a custom routine first.');
        return;
      }
      if (existing && existing.sourceType === 'custom_routine' && existing.routineId === routine.id) {
        onChangeSchedule(scheduledWorkouts.filter((i) => i.date !== dateKey));
        return;
      }
      const nextItem: ScheduledWorkoutItem = {
        id: existing?.id || `sched-${dateKey}-${Date.now()}`,
        date: dateKey,
        sourceType: 'custom_routine',
        routineId: routine.id,
        level: routine.level,
        title: routine.name,
        split: routine.split,
        time: brushTime,
        durationMin: routine.durationMin || 50,
        reminderMinutesBefore: brushReminderMins,
        status: existing?.status || 'scheduled',
      };
      onChangeSchedule([...scheduledWorkouts.filter((i) => i.date !== dateKey), nextItem].sort((a, b) => a.date.localeCompare(b.date)));
      return;
    }

    // Ad-hoc custom workout paint
    const cleanTitle = brushCustomTitle.trim() || 'Custom Workout';
    if (existing && existing.sourceType === 'ad_hoc' && existing.title === cleanTitle) {
      onChangeSchedule(scheduledWorkouts.filter((i) => i.date !== dateKey));
      return;
    }
    const nextItem: ScheduledWorkoutItem = {
      id: existing?.id || `sched-${dateKey}-${Date.now()}`,
      date: dateKey,
      sourceType: 'ad_hoc',
      title: cleanTitle,
      split: 'Custom',
      time: brushTime,
      durationMin: 45,
      reminderMinutesBefore: brushReminderMins,
      status: existing?.status || 'scheduled',
    };
    onChangeSchedule([...scheduledWorkouts.filter((i) => i.date !== dateKey), nextItem].sort((a, b) => a.date.localeCompare(b.date)));
  };

  const handleSaveSelectedDay = () => {
    const existing = scheduleByDate.get(selectedDateKey);

    if (editorMode === 'parametric') {
      const def = ROUTINE_DEFINITIONS.find((d) => d.id === editorRoutineId) || ROUTINE_DEFINITIONS[0];
      const nextItem: ScheduledWorkoutItem = {
        id: existing?.id || `sched-${selectedDateKey}-${Date.now()}`,
        date: selectedDateKey,
        sourceType: 'parametric',
        routineId: def.id,
        level: editorLevel,
        title: def.name,
        split: def.split,
        time: editorTime,
        durationMin: editorDuration || def.estimatedDurationMin,
        reminderMinutesBefore: editorReminder,
        notes: editorNotes.trim() || undefined,
        status: existing?.status || 'scheduled',
      };
      onChangeSchedule([...scheduledWorkouts.filter((i) => i.date !== selectedDateKey), nextItem].sort((a, b) => a.date.localeCompare(b.date)));
      onNotify(`Saved ${def.name} on ${selectedDateKey} at ${editorTime}.`);
      return;
    }

    if (editorMode === 'custom_routine') {
      const routine = customSavedRoutines.find((r) => r.id === editorCustomRoutineId);
      if (!routine) {
        onNotify('Please create a custom routine first using Custom Split Builder.');
        return;
      }
      const nextItem: ScheduledWorkoutItem = {
        id: existing?.id || `sched-${selectedDateKey}-${Date.now()}`,
        date: selectedDateKey,
        sourceType: 'custom_routine',
        routineId: routine.id,
        level: routine.level,
        title: routine.name,
        split: routine.split,
        time: editorTime,
        durationMin: editorDuration || routine.durationMin || 50,
        reminderMinutesBefore: editorReminder,
        notes: editorNotes.trim() || undefined,
        status: existing?.status || 'scheduled',
      };
      onChangeSchedule([...scheduledWorkouts.filter((i) => i.date !== selectedDateKey), nextItem].sort((a, b) => a.date.localeCompare(b.date)));
      onNotify(`Saved "${routine.name}" on ${selectedDateKey} at ${editorTime}.`);
      return;
    }

    // Custom one-off workout
    const finalTitle = editorCustomTitle.trim() || `Custom ${editorCustomSplit} Session`;
    let savedTemplate: RoutineTemplate | null = null;
    if (alsoSaveAsRoutine && editorCustomExercises.length > 0) {
      savedTemplate = onSaveCustomTemplateFromSchedule(finalTitle, editorCustomSplit, editorCustomExercises);
    }

    const nextItem: ScheduledWorkoutItem = {
      id: existing?.id || `sched-${selectedDateKey}-${Date.now()}`,
      date: selectedDateKey,
      sourceType: savedTemplate ? 'custom_routine' : 'ad_hoc',
      routineId: savedTemplate?.id,
      title: finalTitle,
      split: editorCustomSplit,
      time: editorTime,
      durationMin: editorDuration || 50,
      reminderMinutesBefore: editorReminder,
      notes: editorNotes.trim() || undefined,
      customExerciseIds: editorCustomExercises.length > 0 ? editorCustomExercises : undefined,
      status: existing?.status || 'scheduled',
    };
    onChangeSchedule([...scheduledWorkouts.filter((i) => i.date !== selectedDateKey), nextItem].sort((a, b) => a.date.localeCompare(b.date)));
    onNotify(
      savedTemplate
        ? `Scheduled "${finalTitle}" and saved to Custom Routines.`
        : `Scheduled custom workout "${finalTitle}" on ${selectedDateKey}.`
    );
  };

  const handleDeleteDate = (dateKey: string) => {
    onChangeSchedule(scheduledWorkouts.filter((i) => i.date !== dateKey));
    onNotify(`Cleared ${dateKey} from schedule.`);
  };

  const handleToggleCompleted = (item: ScheduledWorkoutItem) => {
    const nextStatus = item.status === 'completed' ? 'scheduled' : 'completed';
    onChangeSchedule(
      scheduledWorkouts.map((i) => (i.date === item.date ? { ...i, status: nextStatus } : i))
    );
  };

  const handleExportMonthICS = () => {
    if (monthItems.length === 0) {
      onNotify(`No workouts scheduled in ${monthLabel} to export.`);
      return;
    }
    const slug = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
    downloadScheduleICS(monthItems, routines, `mit2fit-schedule-${slug}.ics`);
    onNotify(`Downloaded ${monthItems.length} workouts with calendar reminders (.ics). Import into Apple, Google, or Outlook Calendar.`);
  };

  const handleExportSingleICS = (item: ScheduledWorkoutItem) => {
    downloadScheduleICS([item], routines, `mit2fit-${item.date}.ics`);
    onNotify(`Downloaded reminder event for ${item.date}.`);
  };

  const selectedDateFormatted = useMemo(() => {
    return parseLocalDateKey(selectedDateKey).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [selectedDateKey]);

  const selectedPreviewMovements = useMemo(() => {
    if (editorMode === 'parametric') {
      const r = buildParametricRoutine(editorRoutineId, editorLevel);
      return r.exerciseIds.map((id) => EXERCISE_DATABASE.find((e) => e.id === id)?.name || id);
    }
    if (editorMode === 'custom_routine') {
      const r = customSavedRoutines.find((item) => item.id === editorCustomRoutineId);
      return r ? r.exerciseIds.map((id) => EXERCISE_DATABASE.find((e) => e.id === id)?.name || id) : [];
    }
    return editorCustomExercises.map((id) => EXERCISE_DATABASE.find((e) => e.id === id)?.name || id);
  }, [editorMode, editorRoutineId, editorLevel, editorCustomRoutineId, customSavedRoutines, editorCustomExercises]);

  return (
    <div className="space-y-6 pb-14">
      {/* Header & Summary Strip */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Monthly Workout Scheduler</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {monthLabel} Training Calendar
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 font-mono tabular-nums">
            <span>{monthStats.total} scheduled</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">{monthStats.completed} completed</span>
            <span aria-hidden="true">·</span>
            <span>{monthStats.remaining} remaining</span>
            <span aria-hidden="true">·</span>
            <span>{monthStats.totalHours} hrs planned</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <button
            type="button"
            onClick={() => setIsBlueprintOpen((prev) => !prev)}
            className={`px-3.5 py-2 rounded-xl font-semibold border transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              isBlueprintOpen
                ? 'bg-amber-500 text-stone-950 border-amber-500'
                : 'bg-stone-950 text-stone-200 border-stone-800 hover:border-stone-700'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isBlueprintOpen ? 'Hide Monthly Auto-Fill' : 'One-Sitting Auto-Fill'}</span>
          </button>

          <button
            type="button"
            onClick={onRequestNotifications}
            className={`px-3.5 py-2 rounded-xl font-semibold border transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              notificationPermission === 'granted'
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
            }`}
          >
            {notificationPermission === 'granted' ? (
              <BellRing className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Bell className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{notificationPermission === 'granted' ? 'Browser Alerts ON' : 'Enable Alerts'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportMonthICS}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="Export the full month to Apple, Google, or Outlook Calendar with push reminders"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Month (.ics)</span>
          </button>
        </div>
      </div>

      {/* Collapsible One-Sitting Monthly Auto-Fill Panel */}
      {isBlueprintOpen && (
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Weekly Split Blueprint — Fill {monthLabel} in One Click
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Assign routines or custom splits to your weekly training days, set reminder time, and auto-populate the calendar.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-stone-500 mr-1">Presets:</span>
              <button
                type="button"
                onClick={() => handleApplyBlueprintPreset('upper-lower-4')}
                className="px-2.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 font-medium transition whitespace-nowrap"
              >
                Upper / Lower (4d)
              </button>
              <button
                type="button"
                onClick={() => handleApplyBlueprintPreset('ppl-3')}
                className="px-2.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 font-medium transition whitespace-nowrap"
              >
                Push / Pull / Legs (3d)
              </button>
              <button
                type="button"
                onClick={() => handleApplyBlueprintPreset('full-body-3')}
                className="px-2.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 font-medium transition whitespace-nowrap"
              >
                Full Body (3d)
              </button>
            </div>
          </div>

          {/* Mon–Sun Slot Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5 text-xs">
            {WEEKDAY_NAMES_MON_START.map(({ dow, short }) => {
              const slot = weeklyBlueprint[dow];
              const currentValue = !slot
                ? 'rest'
                : slot.sourceType === 'custom_routine'
                ? `custom:${slot.routineId}`
                : `param:${slot.routineId}`;

              return (
                <div
                  key={dow}
                  className={`p-3 rounded-xl border transition space-y-2 ${
                    slot
                      ? 'bg-stone-950 border-amber-500/40'
                      : 'bg-stone-950/40 border-stone-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-white">{short}</span>
                    <span className={slot ? 'text-amber-400 text-[11px]' : 'text-stone-500 text-[11px]'}>
                      {slot ? 'Train' : 'Rest'}
                    </span>
                  </div>

                  <select
                    aria-label={`${short} workout selection`}
                    value={currentValue}
                    onChange={(e) => handleUpdateBlueprintDay(dow, e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="rest">Rest / Recovery</option>
                    <optgroup label="Core Splits">
                      {ROUTINE_DEFINITIONS.map((def) => (
                        <option key={def.id} value={`param:${def.id}`}>
                          {def.name}
                        </option>
                      ))}
                    </optgroup>
                    {customSavedRoutines.length > 0 && (
                      <optgroup label="Custom Saved Routines">
                        {customSavedRoutines.map((r) => (
                          <option key={r.id} value={`custom:${r.id}`}>
                            {r.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
              );
            })}
          </div>

          {/* Shared Time / Tier / Reminder / Apply Footer */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-stone-800 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-stone-300">
                <span className="text-stone-400">Tier:</span>
                <select
                  value={blueprintTier}
                  onChange={(e) => setBlueprintTier(e.target.value as ExperienceLevel)}
                  className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </label>

              <label className="flex items-center gap-2 text-stone-300 font-mono">
                <span className="font-sans text-stone-400">Time:</span>
                <input
                  type="time"
                  value={blueprintDefaultTime}
                  onChange={(e) => setBlueprintDefaultTime(e.target.value)}
                  className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-amber-500"
                />
              </label>

              <label className="flex items-center gap-2 text-stone-300">
                <span className="text-stone-400">Reminder:</span>
                <select
                  value={blueprintReminderMins}
                  onChange={(e) => setBlueprintReminderMins(Number(e.target.value))}
                  className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500"
                >
                  {REMINDER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-1.5 text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyUpcomingDates}
                  onChange={(e) => setOnlyUpcomingDates(e.target.checked)}
                  className="accent-amber-500"
                />
                <span>Upcoming dates only</span>
              </label>

              <label className="flex items-center gap-1.5 text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={overwriteExistingDates}
                  onChange={(e) => setOverwriteExistingDates(e.target.checked)}
                  className="accent-amber-500"
                />
                <span>Overwrite existing</span>
              </label>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenCustomSplitBuilder}
                className="px-3 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-amber-300 font-semibold transition flex items-center gap-1.5 whitespace-nowrap"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>New Custom Split</span>
              </button>

              <button
                type="button"
                onClick={handleAutoFillMonth}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition flex items-center gap-1.5 whitespace-nowrap"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto-Fill {monthLabel.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick-Paint Toolbar (Click-to-Assign Dates Fast) */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsPaintMode((prev) => !prev)}
            className={`px-3.5 py-2 rounded-xl font-bold border transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              isPaintMode
                ? 'bg-emerald-500 text-stone-950 border-emerald-500'
                : 'bg-stone-950 text-stone-200 border-stone-800 hover:border-amber-500/50'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>{isPaintMode ? 'Quick-Paint: ON (Click dates)' : 'Quick-Paint Dates'}</span>
          </button>

          {/* Source Segmented Toggle */}
          <div className="flex items-center bg-stone-950 border border-stone-800 rounded-xl p-1 gap-1">
            {(
              [
                { id: 'parametric', label: 'Splits' },
                { id: 'custom_routine', label: `Custom (${customSavedRoutines.length})` },
                { id: 'ad_hoc', label: 'Quick Custom' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setBrushSource(tab.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition whitespace-nowrap ${
                  brushSource === tab.id
                    ? 'bg-stone-800 text-amber-400'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {brushSource === 'parametric' && (
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={brushRoutineId}
                onChange={(e) => setBrushRoutineId(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                {ROUTINE_DEFINITIONS.map((def) => (
                  <option key={def.id} value={def.id}>
                    {def.name}
                  </option>
                ))}
              </select>
              <select
                value={brushLevel}
                onChange={(e) => setBrushLevel(e.target.value as ExperienceLevel)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-2 text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          )}

          {brushSource === 'custom_routine' && (
            <select
              value={brushCustomRoutineId}
              onChange={(e) => setBrushCustomRoutineId(e.target.value)}
              disabled={customSavedRoutines.length === 0}
              className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
            >
              {customSavedRoutines.length === 0 ? (
                <option value="">No custom routines saved yet</option>
              ) : (
                customSavedRoutines.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.exerciseIds.length} moves)
                  </option>
                ))
              )}
            </select>
          )}

          {brushSource === 'ad_hoc' && (
            <input
              type="text"
              value={brushCustomTitle}
              onChange={(e) => setBrushCustomTitle(e.target.value)}
              placeholder="Custom session name..."
              className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 w-52"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono">
          <input
            type="time"
            value={brushTime}
            onChange={(e) => setBrushTime(e.target.value)}
            aria-label="Quick-paint workout time"
            className="bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500"
          />
          <select
            value={brushReminderMins}
            onChange={(e) => setBrushReminderMins(Number(e.target.value))}
            aria-label="Quick-paint reminder time"
            className="bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-2 text-stone-300 font-sans focus:outline-none focus:border-amber-500"
          >
            {REMINDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Alert: {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Layout: Monthly Calendar Grid (Left 8) + Selected Day Inspector (Right 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Calendar Grid */}
        <div className="lg:col-span-8 bg-stone-900/60 border border-stone-800 rounded-2xl overflow-hidden">
          {/* Calendar Toolbar */}
          <div className="px-4 py-3.5 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPrevMonth}
                className="p-2 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 transition"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-white text-sm min-w-[140px] text-center">
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={goToNextMonth}
                className="p-2 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 transition"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={goToCurrentMonth}
                className="px-3 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-xs font-medium text-stone-300 transition"
              >
                Today
              </button>
            </div>

            {monthItems.length > 0 && (
              <button
                type="button"
                onClick={handleClearMonth}
                className="px-3 py-1.5 rounded-lg bg-stone-950 hover:bg-red-950/50 border border-stone-800 hover:border-red-500/40 text-xs text-stone-400 hover:text-red-300 transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Month</span>
              </button>
            )}
          </div>

          {/* Weekday Column Headers */}
          <div className="grid grid-cols-7 border-b border-stone-800 bg-stone-950/70">
            {WEEKDAY_NAMES_MON_START.map(({ short }) => (
              <div
                key={short}
                className="py-2.5 text-center text-[11px] font-mono uppercase tracking-wider text-stone-400"
              >
                {short}
              </div>
            ))}
          </div>

          {/* 7-Column Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-stone-800/80">
            {calendarCells.map((cell) => {
              const item = scheduleByDate.get(cell.dateKey);
              const isToday = cell.dateKey === todayKey;
              const isSelected = cell.dateKey === selectedDateKey;
              const isCompleted = item?.status === 'completed';

              return (
                <div
                  key={cell.dateKey}
                  onClick={() => handleCalendarCellClick(cell.dateKey)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCalendarCellClick(cell.dateKey);
                    }
                  }}
                  className={`min-h-[92px] sm:min-h-[108px] p-2 text-left transition cursor-pointer flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    !cell.inMonth
                      ? 'bg-stone-950/60 opacity-45'
                      : isSelected
                      ? 'bg-stone-800/80'
                      : 'bg-stone-950/20 hover:bg-stone-900/70'
                  } ${isToday ? 'ring-1 ring-inset ring-amber-500/70' : ''}`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-mono tabular-nums font-bold ${
                        isToday
                          ? 'text-amber-400'
                          : cell.inMonth
                          ? 'text-stone-300'
                          : 'text-stone-600'
                      }`}
                    >
                      {cell.day}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-mono uppercase text-amber-400">
                        Today
                      </span>
                    )}
                    {!isToday && item && (
                      <span
                        className={`text-[10px] font-mono ${
                          isCompleted ? 'text-emerald-400' : 'text-stone-500'
                        }`}
                      >
                        {isCompleted ? 'Done' : item.time}
                      </span>
                    )}
                  </div>

                  {item ? (
                    <div className="mt-1.5 space-y-1">
                      <div
                        className={`text-[11px] font-semibold leading-snug line-clamp-2 ${
                          isCompleted ? 'text-emerald-300' : 'text-white'
                        }`}
                      >
                        {item.title}
                      </div>

                      <div className="flex items-center justify-between gap-1 pt-0.5 text-[10px] font-mono text-stone-400">
                        <span className="truncate">
                          {item.sourceType === 'ad_hoc'
                            ? 'Custom'
                            : item.level || item.split}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartScheduledWorkout(item);
                            }}
                            title="Load into Workout Tracker"
                            className="p-1 rounded bg-stone-800 hover:bg-amber-500 text-stone-300 hover:text-stone-950 transition"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDate(cell.dateKey);
                            }}
                            title="Remove scheduled session"
                            className="p-1 rounded bg-stone-800 hover:bg-red-900/70 text-stone-400 hover:text-red-300 transition"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto pt-2 text-[10px] text-stone-600 font-mono">
                      {isPaintMode ? '+ Click to assign' : 'Rest'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Quick-Add / Inspector Drawer */}
        <div className="lg:col-span-4 bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-3.5">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 block">
                {selectedScheduledItem ? 'Edit Scheduled Day' : 'Quick-Add to Date'}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5 font-mono tabular-nums">
                {selectedDateFormatted}
              </h3>
            </div>

            {selectedScheduledItem && (
              <button
                type="button"
                onClick={() => handleToggleCompleted(selectedScheduledItem)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1 shrink-0 ${
                  selectedScheduledItem.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-emerald-500/40'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{selectedScheduledItem.status === 'completed' ? 'Completed' : 'Mark Done'}</span>
              </button>
            )}
          </div>

          {/* Source Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
            {(
              [
                { id: 'parametric', label: 'Routine Split' },
                { id: 'custom_routine', label: 'My Custom' },
                { id: 'ad_hoc', label: 'Custom New' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setEditorMode(opt.id)}
                className={`py-1.5 px-2 rounded-lg font-semibold transition text-center whitespace-nowrap ${
                  editorMode === opt.id
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Mode-Specific Controls */}
          {editorMode === 'parametric' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-400 block mb-1">Select Program Split</label>
                <select
                  value={editorRoutineId}
                  onChange={(e) => setEditorRoutineId(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {ROUTINE_DEFINITIONS.map((def) => (
                    <option key={def.id} value={def.id}>
                      {def.name} ({def.split})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-stone-400 block mb-1">Experience Tier</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setEditorLevel(lvl)}
                      className={`py-1.5 rounded-lg font-semibold border transition ${
                        editorLevel === lvl
                          ? 'bg-stone-800 border-amber-500/60 text-amber-300'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {editorMode === 'custom_routine' && (
            <div className="space-y-3 text-xs">
              {customSavedRoutines.length === 0 ? (
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-center space-y-2.5">
                  <p className="text-stone-400">
                    You have not saved any custom splits yet.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenCustomSplitBuilder}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Open Custom Split Builder</span>
                  </button>
                </div>
              ) : (
                <div>
                  <label className="text-stone-400 block mb-1">Saved Custom Routine</label>
                  <select
                    value={editorCustomRoutineId}
                    onChange={(e) => setEditorCustomRoutineId(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    {customSavedRoutines.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.exerciseIds.length} exercises)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {editorMode === 'ad_hoc' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-400 block mb-1">Custom Workout Title</label>
                <input
                  type="text"
                  value={editorCustomTitle}
                  onChange={(e) => setEditorCustomTitle(e.target.value)}
                  placeholder="e.g. Heavy Chest + Mobility"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Split Category</label>
                <select
                  value={editorCustomSplit}
                  onChange={(e) => setEditorCustomSplit(e.target.value as SplitCategory)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {(
                    [
                      'Upper Body',
                      'Lower Body',
                      'Full Circuit',
                      'Push',
                      'Pull',
                      'Core & Conditioning',
                    ] as SplitCategory[]
                  ).map((sp) => (
                    <option key={sp} value={sp}>
                      {sp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">
                  Pick Movements ({editorCustomExercises.length} selected)
                </label>
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={editorExerciseSearch}
                    onChange={(e) => setEditorExerciseSearch(e.target.value)}
                    placeholder="Search bench, squat, cable..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-8 pr-3 py-1.5 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1 bg-stone-950 border border-stone-800 rounded-xl p-2">
                  {filteredExercises.map((ex) => {
                    const isPicked = editorCustomExercises.includes(ex.id);
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() =>
                          setEditorCustomExercises((prev) =>
                            isPicked ? prev.filter((id) => id !== ex.id) : [...prev, ex.id]
                          )
                        }
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition ${
                          isPicked
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'hover:bg-stone-900 text-stone-300'
                        }`}
                      >
                        <span className="truncate pr-2">{ex.name}</span>
                        <span className="font-mono text-[10px] shrink-0">
                          {isPicked ? 'Added' : '+ Add'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {editorCustomExercises.length > 0 && (
                <label className="flex items-center gap-2 text-stone-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={alsoSaveAsRoutine}
                    onChange={(e) => setAlsoSaveAsRoutine(e.target.checked)}
                    className="accent-amber-500"
                  />
                  <span className="flex items-center gap-1">
                    <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Also save to Custom Routines library</span>
                  </span>
                </label>
              )}
            </div>
          )}

          {/* Time, Duration & Reminder Controls */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="text-stone-400 block mb-1">Start Time</label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="time"
                  value={editorTime}
                  onChange={(e) => setEditorTime(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-8 pr-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-400 block mb-1">Duration (min)</label>
              <input
                type="number"
                min={15}
                max={180}
                value={editorDuration}
                onChange={(e) => setEditorDuration(parseInt(e.target.value, 10) || 45)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-white font-mono tabular-nums focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="col-span-2">
              <label className="text-stone-400 block mb-1">Reminder Lead Time</label>
              <select
                value={editorReminder}
                onChange={(e) => setEditorReminder(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                {REMINDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-stone-400 block mb-1">Session Note</label>
              <input
                type="text"
                value={editorNotes}
                onChange={(e) => setEditorNotes(e.target.value)}
                placeholder="Focus cues, top set goal, or warm-up note..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Movements Preview */}
          {selectedPreviewMovements.length > 0 && (
            <div className="bg-stone-950 border border-stone-800 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                <span>Planned Movements</span>
                <span>{selectedPreviewMovements.length} total</span>
              </div>
              <div className="text-xs text-stone-300 leading-relaxed">
                {selectedPreviewMovements.slice(0, 6).join(' · ')}
                {selectedPreviewMovements.length > 6
                  ? ` · +${selectedPreviewMovements.length - 6} more`
                  : ''}
              </div>
            </div>
          )}

          {/* Save / Launch / Calendar Reminder Actions */}
          <div className="space-y-2 pt-2 border-t border-stone-800 text-xs">
            <button
              type="button"
              onClick={handleSaveSelectedDay}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{selectedScheduledItem ? 'Update Scheduled Workout' : `Schedule for ${selectedDateKey}`}</span>
            </button>

            {selectedScheduledItem && (
              <>
                <button
                  type="button"
                  onClick={() => onStartScheduledWorkout(selectedScheduledItem)}
                  className="w-full py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Load & Start Workout</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleExportSingleICS(selectedScheduledItem)}
                    className="py-2 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Day .ics</span>
                  </button>

                  <a
                    href={buildGoogleCalendarUrl(selectedScheduledItem, routines)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>Google Cal</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteDate(selectedDateKey)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-950 hover:bg-red-950/50 border border-stone-800 hover:border-red-500/40 text-stone-400 hover:text-red-300 font-medium transition flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove from Calendar</span>
                </button>
              </>
            )}
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed pt-1">
            Tip: In-app and browser alerts notify while Mit2Fit is open. For lock-screen phone & watch reminders when the app is closed, click <strong className="text-stone-300">Export Month (.ics)</strong> once and open it in Apple Calendar, Google Calendar, or Outlook.
          </p>
        </div>
      </div>

      {/* Upcoming Chronological Queue (Next Scheduled Sessions) */}
      {monthItems.length > 0 && (
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <h3 className="text-sm font-bold text-white">
              {monthLabel} Agenda ({monthItems.length} Sessions)
            </h3>
            <span className="text-xs text-stone-400 font-mono">
              Sorted chronologically
            </span>
          </div>

          <div className="divide-y divide-stone-800/80">
            {monthItems.map((item) => {
              const summary = resolveScheduledExercisesSummary(item, routines);
              const dateLabel = parseLocalDateKey(item.date).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
              return (
                <div
                  key={item.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 font-mono tabular-nums text-stone-400">
                      <span className="text-amber-400 font-bold">{dateLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.time}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {item.reminderMinutesBefore >= 0
                          ? `Alert ${item.reminderMinutesBefore === 0 ? 'at start' : `-${item.reminderMinutesBefore}m`}`
                          : 'No alert'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={item.status === 'completed' ? 'text-emerald-400' : 'text-stone-400'}>
                        {item.status === 'completed' ? 'Completed' : 'Scheduled'}
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm truncate">
                      {item.title}
                    </div>
                    <div className="text-stone-400 truncate">
                      {summary.slice(0, 4).join(' · ')}
                      {summary.length > 4 ? ` · +${summary.length - 4} more` : ''}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onStartScheduledWorkout(item)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition flex items-center gap-1 whitespace-nowrap"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleCompleted(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 transition whitespace-nowrap"
                    >
                      {item.status === 'completed' ? 'Reopen' : 'Mark Done'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
