import React from 'react';
import { ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastNotificationProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  const isSavingsWin = toast.type === 'not_worth_it';

  return (
    <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 sm:w-96 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-md relative flex items-start gap-4 bg-surface/95 ${
          isSavingsWin
            ? 'border-secondary-pop/40'
            : 'border-accent/40'
        }`}
      >
        <div
          className={`p-2 rounded-xl shrink-0 mt-0.5 border ${
            isSavingsWin
              ? 'bg-secondary-pop-muted border-secondary-pop/40 text-secondary-pop'
              : 'bg-accent-muted border-accent/40 text-accent'
          }`}
        >
          {isSavingsWin ? (
            <ShieldCheck className="w-5 h-5" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 space-y-1 pr-4">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isSavingsWin ? 'text-secondary-pop' : 'text-accent'
              }`}
            >
              {isSavingsWin ? 'Reclaimed Life Win!' : 'Conscious Choice'}
            </span>
            <span className="text-xs font-bold font-mono-num text-text">
              {isSavingsWin ? `+${toast.timeFormatted}` : toast.timeFormatted}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-medium text-text leading-snug">
            "{toast.phrase}"
          </p>

          <p className="text-[11px] text-text-muted font-mono-num">
            {toast.title} • {toast.amountFormatted}
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
