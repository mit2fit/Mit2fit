import React from 'react';
import { GitMerge, RefreshCw, X, Upload, CheckCircle2 } from 'lucide-react';

export interface BackupSyncPreview {
  fileName: string;
  exportedAt?: string;
  incomingSessions: number;
  newSessionsToAdd: number;
  duplicateSessions: number;
  primaryLabel?: string;
  extraLabel?: string;
  extraSummary?: string;
}

interface BackupSyncModalProps {
  isOpen: boolean;
  preview: BackupSyncPreview | null;
  onMerge: () => void;
  onReplace: () => void;
  onCancel: () => void;
  entityNoun?: string;
}

export const BackupSyncModal: React.FC<BackupSyncModalProps> = ({
  isOpen,
  preview,
  onMerge,
  onReplace,
  onCancel,
  entityNoun = 'workout sessions',
}) => {
  if (!isOpen || !preview) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="backup-sync-modal-title"
        className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 id="backup-sync-modal-title" className="text-base font-bold text-white">
                Sync or Restore Backup File
              </h3>
              <p className="text-xs text-stone-400 font-mono truncate max-w-[260px] sm:max-w-[340px]">
                {preview.fileName}
                {preview.exportedAt
                  ? ` · ${new Date(preview.exportedAt).toLocaleDateString()}`
                  : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close restore dialog"
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-3">
            <div className="text-stone-400">
              {preview.primaryLabel ? `${preview.primaryLabel} in File` : 'In Backup File'}
            </div>
            <div className="text-lg font-bold text-white font-mono tabular-nums mt-0.5">
              {preview.incomingSessions}
            </div>
          </div>

          <div className="bg-stone-950 border border-emerald-500/40 rounded-xl p-3">
            <div className="text-emerald-400">New to Append</div>
            <div className="text-lg font-bold text-emerald-300 font-mono tabular-nums mt-0.5">
              +{preview.newSessionsToAdd}
            </div>
          </div>

          <div className="bg-stone-950 border border-stone-800 rounded-xl p-3 col-span-2 sm:col-span-1">
            <div className="text-stone-400">Already Synced</div>
            <div className="text-lg font-bold text-stone-300 font-mono tabular-nums mt-0.5">
              {preview.duplicateSessions}
            </div>
          </div>
        </div>

        {preview.extraLabel && preview.extraSummary && (
          <div className="bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs gap-2">
            <span className="text-stone-400 shrink-0">{preview.extraLabel}</span>
            <span className="font-mono text-amber-300 font-semibold text-right">{preview.extraSummary}</span>
          </div>
        )}

        <div className="text-xs text-stone-400 leading-relaxed space-y-1.5">
          <p className="flex items-start gap-2 text-stone-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Append &amp; Merge</strong> keeps every item already saved on this device, skips duplicates automatically, and adds missing {entityNoun} from the file.
            </span>
          </p>
          <p className="text-stone-500 pl-6">
            Use <strong className="text-stone-300">Replace All</strong> only if you want an exact copy of this backup file.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2 border-t border-stone-800 text-xs">
          <button
            type="button"
            onClick={onMerge}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition flex items-center justify-center gap-2"
          >
            <GitMerge className="w-4 h-4" />
            <span>
              Append &amp; Merge ({preview.newSessionsToAdd > 0 ? `+${preview.newSessionsToAdd} new` : 'Sync extras'})
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onReplace}
              className="py-2 px-3 rounded-xl bg-stone-950 hover:bg-red-950/50 border border-stone-800 hover:border-red-500/40 text-stone-300 hover:text-red-300 font-semibold transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace All</span>
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
