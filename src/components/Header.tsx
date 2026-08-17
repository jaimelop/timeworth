import React from 'react';
import { Clock, ShieldCheck, Sparkles, Settings, RotateCcw, Info, ListOrdered } from 'lucide-react';
import { formatHoursMinutes, formatCurrency } from '../utils/calculations';
import { UserProfile, SessionStats } from '../types';

interface HeaderProps {
  profile: UserProfile;
  session: SessionStats;
  lifetimeSavedHours: number;
  lifetimeSavedMoney: number;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onOpenHistory: () => void;
  onResetSession: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  session,
  lifetimeSavedHours,
  lifetimeSavedMoney,
  onOpenSettings,
  onOpenAbout,
  onOpenHistory,
  onResetSession,
  historyCount,
}) => {
  return (
    <header className="w-full border-b border-border bg-surface/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent-muted border border-border-accent flex items-center justify-center text-accent shadow-sm shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0 hidden xs:block sm:block">
            <div className="flex items-center gap-2">
              <span className="font-bold text-text text-base sm:text-lg tracking-tight truncate hidden sm:inline">TimeWorth</span>
              <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-accent-muted border border-border-accent text-accent">
                PWA
              </span>
            </div>
            <p className="text-xs text-text-muted hidden sm:block truncate">Mindful spending in life-energy</p>
          </div>
        </div>

        {/* Center / Stat Pills */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Lifetime Reclaimed Pill */}
          <div 
            id="lifetime-saved-badge"
            title="Total life energy reclaimed by choosing 'Not Worth It'"
            className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-xl bg-secondary-pop-muted border border-secondary-pop/30 text-secondary-pop transition-all hover:opacity-80 cursor-default min-w-0"
          >
            <ShieldCheck className="w-4 h-4 text-secondary-pop shrink-0" />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[10px] uppercase font-medium text-secondary-pop/80 leading-none hidden sm:block">Reclaimed</span>
              <span className="text-[11px] sm:text-sm font-bold font-mono-num text-secondary-pop leading-tight truncate">
                {formatHoursMinutes(lifetimeSavedHours)}
                {profile.showMoneyInStats && lifetimeSavedMoney > 0 && (
                  <span className="font-normal text-secondary-pop/70 ml-1">
                    ({formatCurrency(lifetimeSavedMoney, profile.currency, false)})
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Session Pill (if active decisions in session) */}
          {session.count > 0 && (
            <div 
              id="session-saved-badge"
              className="hidden md:flex items-center gap-2 px-2 py-2 rounded-xl bg-surface-alt border border-border text-text-muted text-xs"
              title="Current session stats"
            >
              <Sparkles className="w-4 h-4 text-warning" />
              <span>Session: <strong className="font-mono-num text-text">{formatHoursMinutes(session.savedHours)}</strong></span>
              <button
                onClick={onResetSession}
                title="Reset session counter"
                className="ml-1 p-0.5 text-text-faint hover:text-text transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            id="open-history-btn"
            onClick={onOpenHistory}
            className="relative p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-alt transition-colors flex items-center gap-1 text-xs"
            title="View Decision History"
          >
            <ListOrdered className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-alt text-text border border-border">
                {historyCount}
              </span>
            )}
          </button>

          <button
            id="open-about-btn"
            onClick={onOpenAbout}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-alt transition-colors"
            title="Philosophy & Rules"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            id="open-settings-btn"
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-alt transition-colors"
            title="Configure Hourly Rate & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
