import React, { useState } from 'react';
import { Clock, Shield, ArrowRight, DollarSign, Sparkles } from 'lucide-react';
import { UserProfile, IncomeFrequency } from '../types';
import { calculateHourlyRate, calculateAnnualNetIncome, formatCurrency } from '../utils/calculations';

interface OnboardingModalProps {
  onSave: (profile: Partial<UserProfile>) => void;
  initialProfile: UserProfile;
}

const CURRENCIES = [
  { symbol: '$', label: 'USD / CAD / AUD ($)' },
  { symbol: '€', label: 'EUR (€)' },
  { symbol: '£', label: 'GBP (£)' },
  { symbol: '¥', label: 'JPY / CNY (¥)' },
  { symbol: '₹', label: 'INR (₹)' },
  { symbol: 'CHF', label: 'CHF' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onSave, initialProfile }) => {
  const [netIncome, setNetIncome] = useState<number | ''>(initialProfile.netIncome || 4500);
  const [frequency, setFrequency] = useState<IncomeFrequency>(initialProfile.frequency || 'monthly');
  const [weeklyHours, setWeeklyHours] = useState<number | ''>(initialProfile.weeklyHours || 40);
  const [currency, setCurrency] = useState<string>(initialProfile.currency || '$');

  const parsedIncome = typeof netIncome === 'number' ? netIncome : 0;
  const parsedHours = typeof weeklyHours === 'number' ? weeklyHours : 40;

  const hourlyRate = calculateHourlyRate(parsedIncome, frequency, parsedHours);
  const annualNet = calculateAnnualNetIncome(parsedIncome, frequency, parsedHours);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedIncome <= 0 || parsedHours <= 0) return;

    onSave({
      netIncome: parsedIncome,
      frequency,
      weeklyHours: parsedHours,
      currency,
      isSetupComplete: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Subtle decorative glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              Welcome to TimeWorth
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Calculate the true cost of purchases in hours of your life.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Net Income Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Net Take-Home Pay
              </label>
              <span className="text-[11px] text-emerald-400/90 flex items-center gap-1 font-medium">
                <Shield className="w-3 h-3" /> After taxes & deductions
              </span>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 font-medium text-base">
                {currency}
              </span>
              <input
                id="onboarding-income-input"
                type="number"
                min="1"
                step="any"
                required
                value={netIncome}
                onChange={(e) => setNetIncome(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
                placeholder="4500"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 font-mono-num text-base font-semibold"
              />
            </div>
          </div>

          {/* Pay Frequency Switcher */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Payment Frequency
            </label>
            <div className="flex flex-wrap gap-2">
              {(['hourly', 'daily', 'weekly', 'monthly', 'yearly'] as IncomeFrequency[]).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={`flex-1 min-w-[60px] py-2 px-1 sm:px-3 rounded-lg text-[11px] sm:text-sm font-medium capitalize transition-all border ${
                    frequency === freq
                      ? 'bg-emerald-950/60 border-emerald-600/70 text-emerald-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Work Hours & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Weekly Work Hours
              </label>
              <input
                id="onboarding-hours-input"
                type="number"
                min="1"
                max="120"
                required
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10)))}
                placeholder="40"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 font-mono-num text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Currency
              </label>
              <select
                id="onboarding-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500/80 text-sm font-semibold cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.symbol} value={c.symbol} className="bg-slate-900 text-slate-100">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rate Preview Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-900/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Your Calculated Net Rate</span>
              <div className="text-xl sm:text-2xl font-bold font-mono-num text-emerald-400 flex items-baseline gap-1 mt-0.5">
                {formatCurrency(hourlyRate, currency)}
                <span className="text-xs font-medium text-slate-400">/ hour of life</span>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400">
              <span>Annual Net:</span>
              <div className="font-semibold text-slate-200 font-mono-num">
                {formatCurrency(annualNet, currency, false)}
              </div>
            </div>
          </div>

          <button
            id="start-timeworth-btn"
            type="submit"
            disabled={parsedIncome <= 0 || hourlyRate <= 0}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/50 cursor-pointer"
          >
            <span>Start Mindful Spending</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
