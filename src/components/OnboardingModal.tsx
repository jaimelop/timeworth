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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Subtle decorative glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-accent-muted border border-border-accent flex items-center justify-center text-accent">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text tracking-tight">
              Welcome to TimeWorth
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Calculate the true cost of purchases in hours of your life.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Net Income Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text">
                Net Take-Home Pay
              </label>
              <span className="text-[11px] text-accent/80 flex items-center gap-1 font-medium">
                <Shield className="w-3 h-3" /> After taxes & deductions
              </span>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-4 text-text-muted font-medium text-base">
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
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-alt border border-border text-text placeholder:text-text-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 font-mono-num text-base font-semibold"
              />
            </div>
          </div>

          {/* Pay Frequency Switcher */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-2">
              Payment Frequency
            </label>
            <div className="flex flex-wrap gap-2">
              {(['hourly', 'daily', 'weekly', 'monthly', 'yearly'] as IncomeFrequency[]).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={`flex-1 min-w-[60px] py-2 px-2 sm:px-4 rounded-xl text-[11px] sm:text-sm font-medium capitalize transition-all border ${
                    frequency === freq
                      ? 'bg-accent-muted border-accent text-accent shadow-sm'
                      : 'bg-surface-alt border-border text-text-muted hover:text-text hover:bg-surface-alt/80'
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-2">
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
                className="w-full px-4 py-2 rounded-xl bg-surface-alt border border-border text-text placeholder:text-text-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 font-mono-num text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text mb-2">
                Currency
              </label>
              <select
                id="onboarding-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-surface-alt border border-border text-text focus:outline-none focus:border-accent text-sm font-semibold cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.symbol} value={c.symbol} className="bg-surface text-text">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rate Preview Card */}
          <div className="p-4 rounded-2xl bg-surface-alt border border-border-accent flex items-center justify-between">
            <div>
              <span className="text-xs text-text-muted block">Your Calculated Net Rate</span>
              <div className="text-xl sm:text-2xl font-bold font-mono-num text-accent flex items-baseline gap-1 mt-0.5">
                {formatCurrency(hourlyRate, currency)}
                <span className="text-xs font-medium text-text-muted">/ hour of life</span>
              </div>
            </div>
            <div className="text-right text-xs text-text-muted">
              <span>Annual Net:</span>
              <div className="font-semibold text-text font-mono-num">
                {formatCurrency(annualNet, currency, false)}
              </div>
            </div>
          </div>

          <button
            id="start-timeworth-btn"
            type="submit"
            disabled={parsedIncome <= 0 || hourlyRate <= 0}
            className="w-full py-4 px-4 rounded-xl bg-accent hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none text-background font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer"
          >
            <span>Start Mindful Spending</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
