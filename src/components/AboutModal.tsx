import React from 'react';
import { X, BookOpen, Shield, Flame, Scale, CheckCircle2, HelpCircle } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent-muted border border-border-accent flex items-center justify-center text-accent">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text">Philosophy & Rules</h2>
              <p className="text-[11px] text-text-muted">The science of mindful life-energy calculation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface-alt transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto text-xs sm:text-sm text-text-muted leading-relaxed">
          {/* Concept */}
          <div className="p-4 rounded-2xl bg-surface-alt border border-border space-y-2">
            <h3 className="font-bold text-text flex items-center gap-2 text-xs uppercase tracking-wider text-accent">
              <Flame className="w-4 h-4" /> What is "Life-Energy"?
            </h3>
            <p className="text-text-muted text-xs">
              Whenever you work, you trade irreplaceable hours of your finite life in exchange for money. <strong className="text-text">TimeWorth</strong> translates any expense into the exact hours and minutes of your life you must sacrifice to afford it.
            </p>
          </div>

          {/* Rule 1: Net vs Gross */}
          <div className="space-y-1">
            <h4 className="font-semibold text-text flex items-center gap-2 text-xs">
              <Shield className="w-4 h-4 text-secondary-pop" />
              1. Net vs. Gross Income
            </h4>
            <p className="text-xs text-text-muted">
              We strictly calculate using your <strong className="text-text">Net Take-Home Pay</strong> (after taxes and deductions). You can't spend gross income, so calculating from gross would underestimate the real life hours you trade.
            </p>
          </div>

          {/* Rule 2: Subscriptions & Yearly Debt */}
          <div className="space-y-1">
            <h4 className="font-semibold text-text flex items-center gap-2 text-xs">
              <Scale className="w-4 h-4 text-warning" />
              2. Yearly Time Debt (Subscriptions)
            </h4>
            <p className="text-xs text-text-muted">
              A $15/month subscription might feel insignificant, but it consumes $180 every year indefinitely. Toggling "Subscription" multiplies the cost by 12 to reveal the true yearly life debt.
            </p>
          </div>

          {/* Rule 3: Fixed Costs Disclaimer */}
          <div className="space-y-1">
            <h4 className="font-semibold text-text flex items-center gap-2 text-xs">
              <HelpCircle className="w-4 h-4 text-accent" />
              3. Fixed Costs & Simplicity
            </h4>
            <p className="text-xs text-text-muted">
              For clarity and ease of use, TimeWorth uses your overall net wage across your standard working hours. In reality, fixed obligations (rent, food) reduce disposable income further—making discretionary hours even more valuable!
            </p>
          </div>

          {/* Rule 4: No Debt Assumption */}
          <div className="space-y-1">
            <h4 className="font-semibold text-text flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-text-muted" />
              4. Cash Basis (No Credit Card Interest)
            </h4>
            <p className="text-xs text-text-muted">
              Calculations assume zero interest / upfront cash settlement. Carrying unpaid credit balances at 20%+ APR would multiply the hours required even higher.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-alt border-t border-border text-center">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-surface hover:opacity-80 text-text text-xs font-bold transition-colors border border-border"
          >
            Got it, take me back
          </button>
        </div>
      </div>
    </div>
  );
};
