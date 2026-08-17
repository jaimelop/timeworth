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
  Clock
} from 'lucide-react';
import { UserProfile, IncomeFrequency } from '../types';
import { calculateHourlyRate, calculateAnnualNetIncome, formatCurrency } from '../utils/calculations';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-300" />
            <h2 className="text-lg font-bold text-slate-100">Settings & Rate</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 flex-1">
          {/* Income Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Income & Work Schedule
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                Net Take-Home Pay
              </span>
            </div>

            {/* Net Income */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Net Take-Home Pay (After Taxes)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 font-medium">
                  {currency}
                </span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={netIncome}
                  onChange={(e) => setNetIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono-num font-semibold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Payment Frequency
              </label>
              <div className="flex flex-wrap gap-2">
                {(['hourly', 'daily', 'weekly', 'monthly', 'yearly'] as IncomeFrequency[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequency(f)}
                    className={`flex-1 min-w-[60px] py-1.5 px-1 sm:px-2 rounded-lg text-[11px] sm:text-xs font-medium capitalize border transition-all ${
                      frequency === f
                        ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Hours & Currency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Weekly Work Hours
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono-num text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.symbol} value={c.symbol} className="bg-slate-900">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rate Preview Output */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-900/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Life Energy Rate:</span>
                <span className="text-lg font-bold font-mono-num text-emerald-400">
                  {formatCurrency(currentHourlyRate, currency)} / hr
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <span>Annual Net:</span>
                <div className="font-semibold text-slate-200 font-mono-num">
                  {formatCurrency(currentAnnualNet, currency, false)}
                </div>
              </div>
            </div>

            {/* Money Toggle Setting */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Show Money Alongside Time
                </span>
                <span className="text-[11px] text-slate-400">
                  Display monetary savings alongside hours in stat badges
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={showMoneyInStats}
                onClick={() => setShowMoneyInStats(!showMoneyInStats)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                  showMoneyInStats ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    showMoneyInStats ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
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
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Session & Data Management
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onResetSession();
                  alert('Session counter has been reset to 0.');
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-300 text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  Reset Current Session Counter
                </span>
                <span className="text-[10px] text-slate-500">Resets session only</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all data and restart onboarding?')) {
                    onResetAllData();
                  }
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-red-950/40 border border-slate-800 hover:border-red-900/50 text-red-400 text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Reset Everything & Start Over
                </span>
                <span className="text-[10px] text-red-400/70">Wipes local storage</span>
              </button>
            </div>
          </div>

          {/* Monetization / Tip Jar */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 to-slate-950 border border-amber-800/40 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Coffee className="w-4 h-4" />
              <span>TimeWorth Tip Jar</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              TimeWorth is 100% free, private, and local-first. If it helped you save hours of your life, consider buying a coffee for the creator!
            </p>
            <a
              id="buymeacoffee-main-btn"
              href="https://buymeacoffee.com/jaimelop"
              target="_blank"
              rel="noopener noreferrer"
              className="bmc-button w-full mt-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-950/40 text-center"
            >
              <Heart className="w-3.5 h-3.5 fill-slate-950" />
              <span>Leave a Tip in the Jar (@jaimelop)</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
