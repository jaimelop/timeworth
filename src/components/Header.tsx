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
    <header className="w-full border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-950/40 shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0 hidden xs:block sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 text-base sm:text-lg tracking-tight truncate hidden sm:inline">TimeWorth</span>
              <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/50 text-emerald-400">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block truncate">Mindful spending in life-energy</p>
          </div>
        </div>

        {/* Center / Stat Pills */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Lifetime Reclaimed Pill */}
          <div 
            id="lifetime-saved-badge"
            title="Total life energy reclaimed by choosing 'Not Worth It'"
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 transition-all hover:bg-emerald-950/60 cursor-default min-w-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[10px] uppercase font-medium text-emerald-400/90 leading-none hidden sm:block">Reclaimed</span>
              <span className="text-[11px] sm:text-sm font-bold font-mono-num text-emerald-300 leading-tight truncate">
                {formatHoursMinutes(lifetimeSavedHours)}
                {profile.showMoneyInStats && lifetimeSavedMoney > 0 && (
                  <span className="font-normal text-emerald-400/80 ml-1">
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
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300 text-xs"
              title="Current session stats"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Session: <strong className="font-mono-num text-slate-100">{formatHoursMinutes(session.savedHours)}</strong></span>
              <button
                onClick={onResetSession}
                title="Reset session counter"
                className="ml-1 p-0.5 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            id="open-history-btn"
            onClick={onOpenHistory}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors flex items-center gap-1 text-xs"
            title="View Decision History"
          >
            <ListOrdered className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                {historyCount}
              </span>
            )}
          </button>

          <button
            id="open-about-btn"
            onClick={onOpenAbout}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
            title="Philosophy & Rules"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            id="open-settings-btn"
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
            title="Configure Hourly Rate & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
