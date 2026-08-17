import React from 'react';
import { X, BookOpen, Shield, Flame, Scale, CheckCircle2, HelpCircle } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/70 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Philosophy & Rules</h2>
              <p className="text-[11px] text-slate-400">The science of mindful life-energy calculation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Concept */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <h3 className="font-bold text-slate-100 flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-400">
              <Flame className="w-3.5 h-3.5" /> What is "Life-Energy"?
            </h3>
            <p className="text-slate-300 text-xs">
              Whenever you work, you trade irreplaceable hours of your finite life in exchange for money. <strong>TimeWorth</strong> translates any expense into the exact hours and minutes of your life you must sacrifice to afford it.
            </p>
          </div>

          {/* Rule 1: Net vs Gross */}
          <div className="space-y-1">
            <h4 className="font-semibold text-slate-100 flex items-center gap-1.5 text-xs">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              1. Net vs. Gross Income
            </h4>
            <p className="text-xs text-slate-400">
              We strictly calculate using your <strong>Net Take-Home Pay</strong> (after taxes and deductions). You can't spend gross income, so calculating from gross would underestimate the real life hours you trade.
            </p>
          </div>

          {/* Rule 2: Subscriptions & Yearly Debt */}
          <div className="space-y-1">
            <h4 className="font-semibold text-slate-100 flex items-center gap-1.5 text-xs">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              2. Yearly Time Debt (Subscriptions)
            </h4>
            <p className="text-xs text-slate-400">
              A $15/month subscription might feel insignificant, but it consumes $180 every year indefinitely. Toggling "Subscription" multiplies the cost by 12 to reveal the true yearly life debt.
            </p>
          </div>

          {/* Rule 3: Fixed Costs Disclaimer */}
          <div className="space-y-1">
            <h4 className="font-semibold text-slate-100 flex items-center gap-1.5 text-xs">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              3. Fixed Costs & Simplicity
            </h4>
            <p className="text-xs text-slate-400">
              For clarity and ease of use, TimeWorth uses your overall net wage across your standard working hours. In reality, fixed obligations (rent, food) reduce disposable income further—making discretionary hours even more valuable!
            </p>
          </div>

          {/* Rule 4: No Debt Assumption */}
          <div className="space-y-1">
            <h4 className="font-semibold text-slate-100 flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              4. Cash Basis (No Credit Card Interest)
            </h4>
            <p className="text-xs text-slate-400">
              Calculations assume zero interest / upfront cash settlement. Carrying unpaid credit balances at 20%+ APR would multiply the hours required even higher.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Got it, take me back
          </button>
        </div>
      </div>
    </div>
  );
};
