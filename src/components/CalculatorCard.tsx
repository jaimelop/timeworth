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
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent-muted border border-border-accent flex items-center justify-center text-accent">
              <Hourglass className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-text uppercase tracking-wider">
              Mindful Cost Evaluator
            </h2>
          </div>
          <span className="text-xs text-text-muted font-mono-num">
            Your rate: <strong className="text-accent">{formatCurrency(hourlyRate, profile.currency)}/hr</strong>
          </span>
        </div>

        {/* Item Title */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              What are you considering? (Optional)
            </label>
            <input
              id="expense-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Wireless Headphones, Dinner Out, Gym Membership"
              className="w-full px-4 py-2 rounded-xl bg-surface-alt border border-border text-text placeholder:text-text-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 text-sm transition-all"
            />
          </div>

          {/* Amount and Subscription Switch */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text">
                Price / Amount
              </label>
              {isSubscription && (
                <span className="text-[11px] font-semibold text-warning flex items-center gap-1 bg-warning/10 px-2 py-0.5 rounded border border-warning/30">
                  <Flame className="w-3 h-3" /> Shows 1-Year Time Debt
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-4 text-text-muted font-semibold text-lg">
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
                className="w-full pl-10 pr-4 py-4 rounded-xl bg-surface-alt border border-border text-text placeholder:text-text-faint focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 text-2xl font-bold font-mono-num tracking-tight"
              />
            </div>
          </div>

          {/* Subscription Toggle */}
          <div className="p-4 rounded-xl bg-surface-alt border border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl border ${isSubscription ? 'bg-warning/10 border-warning/40 text-warning' : 'bg-surface border-border text-text-faint'}`}>
                <Repeat className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold text-text block">
                  Recurring Monthly Subscription
                </span>
                <span className="text-[11px] text-text-muted">
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
                isSubscription ? 'bg-warning' : 'bg-surface-alt border border-border'
              }`}
            >
              <div
                className={`bg-background w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
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
          className="bg-surface border border-border rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300 relative overflow-hidden"
        >
          {/* Top highlight bar */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              True Life-Energy Cost
            </span>
            {isSubscription && (
              <span className="text-xs font-semibold text-warning">
                {formatCurrency(effectiveCost, profile.currency)} / year
              </span>
            )}
          </div>

          {/* Large Time Cost Display */}
          <div className="text-center py-2 space-y-2">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono-num tracking-tight text-text">
              {formattedTime}
            </div>
            <p className="text-xs sm:text-sm text-text-muted">
              That's <strong className="text-text">{detailedTime}</strong> of your life-energy.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-surface-alt border border-border text-xs text-text-muted mt-1">
              <Calendar className="w-4 h-4 text-accent" />
              <span>{equivalents.description}</span>
            </div>
          </div>

          {/* Contextual Visual Progress Bar */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-[11px] text-text-muted font-mono-num">
              <span>Shift Impact</span>
              <span>{equivalents.percentOfDay}% of an 8h work shift</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-alt overflow-hidden border border-border">
              <div
                className="h-full bg-gradient-to-r from-secondary-pop via-accent to-warning transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(4, Math.min(100, equivalents.percentOfDay))}%` }}
              />
            </div>
          </div>

          {/* The Decision Engine Buttons */}
          <div className="pt-2">
            <div className="text-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Is this exchange worth your time?
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Not Worth It / Reclaim Life */}
              <button
                id="decision-not-worth-it-btn"
                type="button"
                onClick={() => handleDecisionClick('not_worth_it')}
                className="group p-4 rounded-xl bg-secondary-pop-muted border border-secondary-pop/40 hover:border-secondary-pop hover:bg-secondary-pop/20 text-text flex flex-col items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-secondary-pop group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-base sm:text-lg text-secondary-pop">
                    Not Worth It
                  </span>
                </div>
                <span className="text-[11px] text-secondary-pop/80 font-medium">
                  Reclaim +{formattedTime} of freedom
                </span>
              </button>

              {/* Worth It / Conscious Spending */}
              <button
                id="decision-worth-it-btn"
                type="button"
                onClick={() => handleDecisionClick('worth_it')}
                className="group p-4 rounded-xl bg-surface-alt border border-border hover:border-accent hover:bg-accent-muted text-text flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-base sm:text-lg text-text">
                    Worth It
                  </span>
                </div>
                <span className="text-[11px] text-text-muted font-medium">
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
