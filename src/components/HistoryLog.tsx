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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <span>Decision History</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface-alt text-text-muted font-mono-num">
                {history.length}
              </span>
            </h2>
            <p className="text-xs text-text-muted">Track all your mindful spending evaluations</p>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleExport}
                title="Export as JSON"
                className="p-2 rounded-xl bg-surface-alt text-text-muted hover:text-text transition-colors text-xs flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-alt transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 bg-surface-alt border-b border-border text-xs">
          <div className="p-2 rounded-xl bg-secondary-pop-muted border border-secondary-pop/30">
            <span className="text-secondary-pop font-medium block">Total Reclaimed</span>
            <span className="text-sm sm:text-base font-bold font-mono-num text-secondary-pop">
              {formatHoursMinutes(totalSavedHours)}
            </span>
            {profile.showMoneyInStats && (
              <span className="text-[10px] text-secondary-pop/70 block">
                {formatCurrency(totalSavedMoney, profile.currency, false)} saved
              </span>
            )}
          </div>

          <div className="p-2 rounded-xl bg-accent-muted border border-accent/30">
            <span className="text-accent font-medium block">Intentional Spend</span>
            <span className="text-sm sm:text-base font-bold font-mono-num text-accent">
              {formatHoursMinutes(totalIntentionalHours)}
            </span>
            <span className="text-[10px] text-accent/70 block">conscious choices</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-2 rounded-xl bg-surface border border-border">
            <span className="text-text-muted font-medium block">Reclaim Rate</span>
            <span className="text-sm sm:text-base font-bold font-mono-num text-text">
              {history.length > 0
                ? Math.round((history.filter((h) => h.decision === 'not_worth_it').length / history.length) * 100)
                : 0}
              %
            </span>
            <span className="text-[10px] text-text-muted block">freedom preserved</span>
          </div>
        </div>

        {/* Controls: Search & Filter */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-2 justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-faint absolute left-4 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-alt border border-border text-xs text-text placeholder:text-text-faint focus:outline-none focus:border-accent"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 self-end sm:self-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-1 rounded-xl text-xs font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-surface-alt text-text border border-border'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setFilterType('not_worth_it')}
              className={`px-4 py-1 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 ${
                filterType === 'not_worth_it'
                  ? 'bg-secondary-pop-muted text-secondary-pop border border-secondary-pop/40'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-secondary-pop" />
              Reclaimed ({history.filter((h) => h.decision === 'not_worth_it').length})
            </button>
            <button
              onClick={() => setFilterType('worth_it')}
              className={`px-4 py-1 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 ${
                filterType === 'worth_it'
                  ? 'bg-accent-muted text-accent border border-accent/40'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-accent" />
              Worth It ({history.filter((h) => h.decision === 'worth_it').length})
            </button>
          </div>
        </div>

        {/* Records List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-border/40">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-text-faint text-sm space-y-2">
              <Clock className="w-8 h-8 mx-auto stroke-[1.5] text-text-faint" />
              <p>No decision records found.</p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isSavingsWin = item.decision === 'not_worth_it';
              return (
                <div
                  key={item.id}
                  className="pt-2 first:pt-0 flex items-start justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    {/* Status Badge Icon */}
                    <div
                      className={`mt-0.5 p-2 rounded-xl border ${
                        isSavingsWin
                          ? 'bg-secondary-pop-muted border-secondary-pop/40 text-secondary-pop'
                          : 'bg-accent-muted border-accent/40 text-accent'
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
                        <span className="font-semibold text-text text-sm">{item.title}</span>
                        {item.isSubscription && (
                          <span className="text-[10px] font-semibold text-warning bg-warning/10 border border-warning/30 px-2 py-0.5 rounded flex items-center gap-1">
                            <Repeat className="w-2.5 h-2.5" /> /month (Yearly Debt)
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isSavingsWin
                              ? 'bg-secondary-pop-muted border border-secondary-pop/30 text-secondary-pop'
                              : 'bg-surface-alt text-text-muted'
                          }`}
                        >
                          {isSavingsWin ? 'Reclaimed' : 'Intentional'}
                        </span>
                      </div>

                      {/* Psychological Quote Snippet */}
                      {item.feedbackPhrase && (
                        <p className="text-xs text-text-muted italic">
                          "{item.feedbackPhrase}"
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-[11px] text-text-faint font-mono-num">
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
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div
                        className={`font-bold font-mono-num text-sm sm:text-base ${
                          isSavingsWin ? 'text-secondary-pop' : 'text-text-muted'
                        }`}
                      >
                        {isSavingsWin ? `+${item.formattedTime}` : item.formattedTime}
                      </div>
                      <span className="text-[10px] text-text-faint block">
                        {isSavingsWin ? 'reclaimed' : 'spent'}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteRecord(item.id)}
                      title="Delete record"
                      className="opacity-40 group-hover:opacity-100 p-2 text-text-muted hover:text-danger hover:bg-surface-alt rounded-xl transition-all"
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
          <div className="p-4 bg-surface-alt border-t border-border flex justify-between items-center text-xs">
            <span className="text-text-muted">
              Stored 100% locally in your browser
            </span>
            <button
              onClick={() => {
                if (window.confirm('Clear all decision history? Lifetime reclaimed counters will stay intact.')) {
                  onClearHistory();
                }
              }}
              className="text-danger hover:opacity-80 transition-colors flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
