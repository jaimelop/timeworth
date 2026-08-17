import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  RotateCcw, 
  DollarSign, 
  ShieldAlert, 
  Coffee, 
  Check, 
  Trash2, 
  Heart, 
  ExternalLink,
  Info,
  Clock,
  Sun,
  Moon
} from 'lucide-react';
import { UserProfile, IncomeFrequency } from '../types';
import { calculateHourlyRate, calculateAnnualNetIncome, formatCurrency } from '../utils/calculations';
import { useThemeStore, ThemeMode } from '../stores/themeStore';

interface SettingsDrawerProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
  onResetSession: () => void;
  onResetAllData: () => void;
}

const CURRENCIES = [
  { symbol: '$', label: 'USD / CAD / AUD ($)' },
  { symbol: '€', label: 'EUR (€)' },
  { symbol: '£', label: 'GBP (£)' },
  { symbol: '¥', label: 'JPY / CNY (¥)' },
  { symbol: '₹', label: 'INR (₹)' },
  { symbol: 'CHF', label: 'CHF' },
];

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  profile,
  isOpen,
  onClose,
  onUpdateProfile,
  onResetSession,
  onResetAllData,
}) => {
  const [netIncome, setNetIncome] = useState<number>(profile.netIncome);
  const [frequency, setFrequency] = useState<IncomeFrequency>(profile.frequency);
  const [weeklyHours, setWeeklyHours] = useState<number>(profile.weeklyHours);
  const [currency, setCurrency] = useState<string>(profile.currency);
  const [showMoneyInStats, setShowMoneyInStats] = useState<boolean>(profile.showMoneyInStats);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { theme, setTheme } = useThemeStore();

  if (!isOpen) return null;

  const currentHourlyRate = calculateHourlyRate(netIncome, frequency, weeklyHours);
  const currentAnnualNet = calculateAnnualNetIncome(netIncome, frequency, weeklyHours);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      netIncome,
      frequency,
      weeklyHours,
      currency,
      showMoneyInStats,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-text-muted" />
            <h2 className="text-lg font-bold text-text">Settings & Rate</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-alt transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 flex-1">

          {/* ============ THEME TOGGLE ============ */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Appearance
            </h3>
            <div className="flex rounded-xl border border-border bg-surface-alt p-1 gap-1">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-accent text-background shadow-md'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-accent text-background shadow-md'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Income Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Income & Work Schedule
              </h3>
              <span className="text-[10px] text-accent font-semibold uppercase bg-accent-muted px-2 py-0.5 rounded border border-border-accent">
                Net Take-Home Pay
              </span>
            </div>

            {/* Net Income */}
            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Net Take-Home Pay (After Taxes)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-text-muted font-medium">
                  {currency}
                </span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={netIncome}
                  onChange={(e) => setNetIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-alt border border-border text-text font-mono-num font-semibold text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-xs font-semibold text-text mb-1">
                Payment Frequency
              </label>
              <div className="flex flex-wrap gap-2">
                {(['hourly', 'daily', 'weekly', 'monthly', 'yearly'] as IncomeFrequency[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequency(f)}
                    className={`flex-1 min-w-[60px] py-2 px-2 rounded-xl text-[11px] sm:text-xs font-medium capitalize border transition-all ${
                      frequency === f
                        ? 'bg-accent-muted border-accent text-accent'
                        : 'bg-surface-alt border-border text-text-muted hover:text-text'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Hours & Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  Weekly Work Hours
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-4 py-2 rounded-xl bg-surface-alt border border-border text-text font-mono-num text-sm font-semibold focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-surface-alt border border-border text-text text-xs font-semibold focus:outline-none focus:border-accent"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.symbol} value={c.symbol} className="bg-surface">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rate Preview Output */}
            <div className="p-4 rounded-xl bg-surface-alt border border-border-accent flex items-center justify-between">
              <div>
                <span className="text-[11px] text-text-muted block">Life Energy Rate:</span>
                <span className="text-lg font-bold font-mono-num text-accent">
                  {formatCurrency(currentHourlyRate, currency)} / hr
                </span>
              </div>
              <div className="text-right text-[11px] text-text-muted">
                <span>Annual Net:</span>
                <div className="font-semibold text-text font-mono-num">
                  {formatCurrency(currentAnnualNet, currency, false)}
                </div>
              </div>
            </div>

            {/* Money Toggle Setting */}
            <div className="p-4 rounded-xl bg-surface-alt border border-border flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-text block">
                  Show Money Alongside Time
                </span>
                <span className="text-[11px] text-text-muted">
                  Display monetary savings alongside hours in stat badges
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={showMoneyInStats}
                onClick={() => setShowMoneyInStats(!showMoneyInStats)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                  showMoneyInStats ? 'bg-accent' : 'bg-surface-alt border border-border'
                }`}
              >
                <div
                  className={`bg-background w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    showMoneyInStats ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-accent hover:opacity-90 text-background font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Changes Saved!</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </form>

          {/* Session & Data Management */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Session & Data Management
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onResetSession();
                  alert('Session counter has been reset to 0.');
                }}
                className="w-full py-2 px-4 rounded-xl bg-surface-alt hover:opacity-80 border border-border text-text-muted text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-warning" />
                  Reset Current Session Counter
                </span>
                <span className="text-[10px] text-text-faint">Resets session only</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all data and restart onboarding?')) {
                    onResetAllData();
                  }
                }}
                className="w-full py-2 px-4 rounded-xl bg-surface-alt hover:bg-danger/10 border border-border hover:border-danger/40 text-danger text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Reset Everything & Start Over
                </span>
                <span className="text-[10px] text-danger/70">Wipes local storage</span>
              </button>
            </div>
          </div>

          {/* Monetization / Tip Jar */}
          <div className="p-4 rounded-2xl bg-warning/10 border border-warning/30 space-y-2">
            <div className="flex items-center gap-2 text-warning font-bold text-sm">
              <Coffee className="w-4 h-4" />
              <span>TimeWorth Tip Jar</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              TimeWorth is 100% free, private, and local-first. If it helped you save hours of your life, consider buying a coffee for the creator!
            </p>
            <a
              id="buymeacoffee-main-btn"
              href="https://buymeacoffee.com/jaimelop"
              target="_blank"
              rel="noopener noreferrer"
              className="bmc-button w-full mt-2 py-2 px-4 rounded-xl bg-warning hover:opacity-90 text-background font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md text-center"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Leave a Tip in the Jar (@jaimelop)</span>
              <ExternalLink className="w-4 h-4 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
