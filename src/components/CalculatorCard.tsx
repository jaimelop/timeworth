import React, { useState } from 'react';
import { 
  Sparkles, 
  Repeat, 
  ThumbsUp, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Hourglass, 
  Calendar, 
  Layers, 
  Flame,
  ArrowDownRight,
  TrendingDown
} from 'lucide-react';
import { UserProfile, DecisionType } from '../types';
import { 
  calculateHourlyRate, 
  formatHoursMinutes, 
  formatTimeDetailed, 
  formatCurrency, 
  getWorkEquivalents 
} from '../utils/calculations';

interface CalculatorCardProps {
  profile: UserProfile;
  onDecision: (data: {
    title: string;
    cost: number;
    isSubscription: boolean;
    hoursCost: number;
    formattedTime: string;
    decision: DecisionType;
  }) => void;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ profile, onDecision }) => {
  const [title, setTitle] = useState('');
  const [costInput, setCostInput] = useState<string>('');
  const [isSubscription, setIsSubscription] = useState(false);

  const hourlyRate = calculateHourlyRate(profile.netIncome, profile.frequency, profile.weeklyHours);
  const cost = parseFloat(costInput) || 0;

  // Effective cost: if subscription, multiply by 12 to get yearly time debt
  const effectiveCost = isSubscription ? cost * 12 : cost;
  const hoursCost = hourlyRate > 0 ? effectiveCost / hourlyRate : 0;
  const formattedTime = formatHoursMinutes(hoursCost);
  const detailedTime = formatTimeDetailed(hoursCost);
  const equivalents = getWorkEquivalents(hoursCost, profile.weeklyHours);

  const handleDecisionClick = (decision: DecisionType) => {
    if (cost <= 0 || hourlyRate <= 0) return;

    onDecision({
      title: title.trim() || (isSubscription ? 'Monthly Subscription' : 'Purchase Item'),
      cost,
      isSubscription,
      hoursCost,
      formattedTime,
      decision,
    });

    // Reset fields for the next mindful evaluation
    setTitle('');
    setCostInput('');
    setIsSubscription(false);
  };

  const hasValidCost = cost > 0 && hourlyRate > 0;

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Main Input Card */}
      <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-sm relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-950/70 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
              <Hourglass className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 uppercase tracking-wider text-xs">
              Mindful Cost Evaluator
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono-num">
            Your rate: <strong className="text-emerald-400">{formatCurrency(hourlyRate, profile.currency)}/hr</strong>
          </span>
        </div>

        {/* Item Title */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              What are you considering? (Optional)
            </label>
            <input
              id="expense-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Wireless Headphones, Dinner Out, Gym Membership"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/40 text-sm transition-all"
            />
          </div>

          {/* Amount and Subscription Switch */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Price / Amount
              </label>
              {isSubscription && (
                <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                  <Flame className="w-3 h-3" /> Shows 1-Year Time Debt
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400 font-semibold text-lg">
                {profile.currency}
              </span>
              <input
                id="expense-cost-input"
                type="number"
                min="0.01"
                step="any"
                value={costInput}
                onChange={(e) => setCostInput(e.target.value)}
                placeholder="0.00"
                autoFocus
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-2xl font-bold font-mono-num tracking-tight"
              />
            </div>
          </div>

          {/* Subscription Toggle */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg border ${isSubscription ? 'bg-amber-950/60 border-amber-700/50 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                <Repeat className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold text-slate-200 block">
                  Recurring Monthly Subscription
                </span>
                <span className="text-[11px] text-slate-400">
                  Calculates total annual commitment (cost × 12 months)
                </span>
              </div>
            </div>

            <button
              id="subscription-toggle-btn"
              type="button"
              role="switch"
              aria-checked={isSubscription}
              onClick={() => setIsSubscription(!isSubscription)}
              className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                isSubscription ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`bg-slate-950 w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                  isSubscription ? 'translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Action / Result Card */}
      {hasValidCost && (
        <div 
          id="decision-action-card"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300 relative overflow-hidden"
        >
          {/* Top highlight bar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              True Life-Energy Cost
            </span>
            {isSubscription && (
              <span className="text-xs font-semibold text-amber-400">
                {formatCurrency(effectiveCost, profile.currency)} / year
              </span>
            )}
          </div>

          {/* Large Time Cost Display */}
          <div className="text-center py-2 space-y-1.5">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono-num tracking-tight text-slate-100">
              {formattedTime}
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              That's <strong className="text-slate-200">{detailedTime}</strong> of your life-energy.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-300 mt-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{equivalents.description}</span>
            </div>
          </div>

          {/* Contextual Visual Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-mono-num">
              <span>Shift Impact</span>
              <span>{equivalents.percentOfDay}% of an 8h work shift</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500 transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(4, Math.min(100, equivalents.percentOfDay))}%` }}
              />
            </div>
          </div>

          {/* The Decision Engine Buttons */}
          <div className="pt-2">
            <div className="text-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Is this exchange worth your time?
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Not Worth It / Reclaim Life */}
              <button
                id="decision-not-worth-it-btn"
                type="button"
                onClick={() => handleDecisionClick('not_worth_it')}
                className="group p-4 rounded-xl bg-gradient-to-br from-emerald-950/80 to-emerald-900/40 border border-emerald-500/50 hover:border-emerald-400 hover:from-emerald-900/90 hover:to-emerald-800/60 text-emerald-100 flex flex-col items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-950/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-base sm:text-lg text-emerald-300">
                    Not Worth It
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400/90 font-medium">
                  Reclaim +{formattedTime} of freedom
                </span>
              </button>

              {/* Worth It / Conscious Spending */}
              <button
                id="decision-worth-it-btn"
                type="button"
                onClick={() => handleDecisionClick('worth_it')}
                className="group p-4 rounded-xl bg-slate-950/80 border border-slate-700 hover:border-slate-500 hover:bg-slate-800/80 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-base sm:text-lg text-slate-100">
                    Worth It
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Conscious intentional spend
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
