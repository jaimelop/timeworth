import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Trash2, 
  Repeat, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  Sparkles,
  X,
  Calendar
} from 'lucide-react';
import { DecisionRecord, DecisionType, UserProfile } from '../types';
import { formatCurrency, formatHoursMinutes } from '../utils/calculations';

interface HistoryLogProps {
  history: DecisionRecord[];
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onDeleteRecord: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({
  history,
  profile,
  isOpen,
  onClose,
  onDeleteRecord,
  onClearHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | DecisionType>('all');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || item.decision === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalSavedHours = history
    .filter((h) => h.decision === 'not_worth_it')
    .reduce((acc, curr) => acc + curr.hoursCost, 0);

  const totalSavedMoney = history
    .filter((h) => h.decision === 'not_worth_it')
    .reduce((acc, curr) => acc + (curr.isSubscription ? curr.cost * 12 : curr.cost), 0);

  const totalIntentionalHours = history
    .filter((h) => h.decision === 'worth_it')
    .reduce((acc, curr) => acc + curr.hoursCost, 0);

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `timeworth-history-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Decision History</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono-num">
                {history.length}
              </span>
            </h2>
            <p className="text-xs text-slate-400">Track all your mindful spending evaluations</p>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleExport}
                title="Export as JSON"
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100 transition-colors text-xs flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 bg-slate-950/60 border-b border-slate-800/80 text-xs">
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
            <span className="text-emerald-400 font-medium block">Total Reclaimed</span>
            <span className="text-sm sm:text-base font-bold font-mono-num text-emerald-300">
              {formatHoursMinutes(totalSavedHours)}
            </span>
            {profile.showMoneyInStats && (
              <span className="text-[10px] text-emerald-400/80 block">
                {formatCurrency(totalSavedMoney, profile.currency, false)} saved
              </span>
            )}
          </div>

          <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40">
            <span className="text-indigo-400 font-medium block">Intentional Spend</span>
            <span className="text-sm sm:text-base font-bold font-mono-num text-indigo-300">
              {formatHoursMinutes(totalIntentionalHours)}
            </span>
            <span className="text-[10px] text-indigo-400/80 block">conscious choices</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 font-medium block">Reclaim Rate</span>
            <span className="text-sm sm:text-base font-bold font-mono-num text-slate-200">
              {history.length > 0
                ? Math.round((history.filter((h) => h.decision === 'not_worth_it').length / history.length) * 100)
                : 0}
              %
            </span>
            <span className="text-[10px] text-slate-400 block">freedom preserved</span>
          </div>
        </div>

        {/* Controls: Search & Filter */}
        <div className="p-4 border-b border-slate-800/60 flex flex-col sm:flex-row gap-2.5 justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5 self-end sm:self-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-slate-700 text-slate-100'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setFilterType('not_worth_it')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                filterType === 'not_worth_it'
                  ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Reclaimed ({history.filter((h) => h.decision === 'not_worth_it').length})
            </button>
            <button
              onClick={() => setFilterType('worth_it')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                filterType === 'worth_it'
                  ? 'bg-indigo-900/80 text-indigo-200 border border-indigo-700'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-indigo-400" />
              Worth It ({history.filter((h) => h.decision === 'worth_it').length})
            </button>
          </div>
        </div>

        {/* Records List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-800/40">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm space-y-2">
              <Clock className="w-8 h-8 mx-auto stroke-[1.5] text-slate-600" />
              <p>No decision records found.</p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isSavingsWin = item.decision === 'not_worth_it';
              return (
                <div
                  key={item.id}
                  className="pt-2.5 first:pt-0 flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    {/* Status Badge Icon */}
                    <div
                      className={`mt-0.5 p-2 rounded-xl border ${
                        isSavingsWin
                          ? 'bg-emerald-950/60 border-emerald-700/50 text-emerald-400'
                          : 'bg-slate-950/60 border-indigo-800/50 text-indigo-400'
                      }`}
                    >
                      {isSavingsWin ? (
                        <ShieldCheck className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-200 text-sm">{item.title}</span>
                        {item.isSubscription && (
                          <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/40 px-1.5 py-0.2 rounded flex items-center gap-1">
                            <Repeat className="w-2.5 h-2.5" /> /month (Yearly Debt)
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isSavingsWin
                              ? 'bg-emerald-950 border border-emerald-800/60 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isSavingsWin ? 'Reclaimed' : 'Intentional'}
                        </span>
                      </div>

                      {/* Psychological Quote Snippet */}
                      {item.feedbackPhrase && (
                        <p className="text-xs text-slate-400 italic">
                          "{item.feedbackPhrase}"
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono-num">
                        <span>{formatTimestamp(item.timestamp)}</span>
                        <span>•</span>
                        <span>
                          {formatCurrency(item.cost, profile.currency)}
                          {item.isSubscription && ' /mo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right time & delete action */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div
                        className={`font-bold font-mono-num text-sm sm:text-base ${
                          isSavingsWin ? 'text-emerald-400' : 'text-slate-300'
                        }`}
                      >
                        {isSavingsWin ? `+${item.formattedTime}` : item.formattedTime}
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        {isSavingsWin ? 'reclaimed' : 'spent'}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteRecord(item.id)}
                      title="Delete record"
                      className="opacity-40 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Clear All */}
        {history.length > 0 && (
          <div className="p-3.5 bg-slate-950/90 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">
              Stored 100% locally in your browser
            </span>
            <button
              onClick={() => {
                if (window.confirm('Clear all decision history? Lifetime reclaimed counters will stay intact.')) {
                  onClearHistory();
                }
              }}
              className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
