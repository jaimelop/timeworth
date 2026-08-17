/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  loadProfile, 
  saveProfile, 
  loadHistory, 
  saveHistory, 
  loadSession, 
  saveSession, 
  clearAllData, 
  DEFAULT_PROFILE, 
  DEFAULT_SESSION 
} from './utils/storage';
import { UserProfile, DecisionRecord, SessionStats, ToastMessage, DecisionType } from './types';
import { calculateHourlyRate, formatCurrency, formatHoursMinutes, getWorkEquivalents } from './utils/calculations';
import { getRandomPhrase } from './utils/phrases';
import { sound } from './utils/sound';

import { Header } from './components/Header';
import { OnboardingModal } from './components/OnboardingModal';
import { CalculatorCard } from './components/CalculatorCard';
import { HistoryLog } from './components/HistoryLog';
import { SettingsDrawer } from './components/SettingsDrawer';
import { AboutModal } from './components/AboutModal';
import { ToastNotification } from './components/ToastNotification';

import { 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Download, 
  Flame,
  Scale,
  ListOrdered
} from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [history, setHistory] = useState<DecisionRecord[]>(loadHistory);
  const [session, setSession] = useState<SessionStats>(loadSession);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<ToastMessage | null>(null);
  const [toastTimer, setToastTimer] = useState<NodeJS.Timeout | null>(null);

  // PWA install prompt state
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Listen for PWA install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Sync profile changes to localStorage
  const handleSaveProfile = (updated: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updated };
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  // Lifetime stats computed from entire history
  const lifetimeSavedHours = history
    .filter((h) => h.decision === 'not_worth_it')
    .reduce((acc, curr) => acc + curr.hoursCost, 0);

  const lifetimeSavedMoney = history
    .filter((h) => h.decision === 'not_worth_it')
    .reduce((acc, curr) => acc + (curr.isSubscription ? curr.cost * 12 : curr.cost), 0);

  const lifetimeIntentionalHours = history
    .filter((h) => h.decision === 'worth_it')
    .reduce((acc, curr) => acc + curr.hoursCost, 0);

  // Handle a user making a decision
  const handleDecision = (data: {
    title: string;
    cost: number;
    isSubscription: boolean;
    hoursCost: number;
    formattedTime: string;
    decision: DecisionType;
  }) => {
    const feedbackPhrase = getRandomPhrase(data.decision, data.formattedTime);

    // Audio cue
    if (data.decision === 'not_worth_it') {
      sound.playReclaimedChime();
    } else {
      sound.playConsciousTap();
    }

    const annualCost = data.isSubscription ? data.cost * 12 : data.cost;

    const newRecord: DecisionRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title: data.title,
      cost: data.cost,
      isSubscription: data.isSubscription,
      annualCost,
      hoursCost: data.hoursCost,
      formattedTime: data.formattedTime,
      decision: data.decision,
      feedbackPhrase,
      timestamp: Date.now(),
    };

    // Update history
    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    saveHistory(updatedHistory);

    // Update session stats
    const updatedSession: SessionStats = {
      ...session,
      count: session.count + 1,
      savedHours: data.decision === 'not_worth_it' ? session.savedHours + data.hoursCost : session.savedHours,
      savedMoney: data.decision === 'not_worth_it' ? session.savedMoney + annualCost : session.savedMoney,
      spentHours: data.decision === 'worth_it' ? session.spentHours + data.hoursCost : session.spentHours,
      spentMoney: data.decision === 'worth_it' ? session.spentMoney + annualCost : session.spentMoney,
    };
    setSession(updatedSession);
    saveSession(updatedSession);

    // Show toast
    if (toastTimer) clearTimeout(toastTimer);
    const toast: ToastMessage = {
      id: newRecord.id,
      type: data.decision,
      title: data.title,
      phrase: feedbackPhrase,
      timeFormatted: data.formattedTime,
      amountFormatted: `${formatCurrency(data.cost, profile.currency)}${data.isSubscription ? '/mo' : ''}`,
    };
    setActiveToast(toast);

    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 4500);
    setToastTimer(timer);
  };

  const handleResetSession = () => {
    const resetSess: SessionStats = {
      ...DEFAULT_SESSION,
      sessionStartTime: Date.now(),
    };
    setSession(resetSess);
    saveSession(resetSess);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    saveHistory(updated);
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  const handleResetAllData = () => {
    clearAllData();
    setProfile(DEFAULT_PROFILE);
    setHistory([]);
    setSession(DEFAULT_SESSION);
    setIsSettingsOpen(false);
  };

  const handleInstallPWA = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Onboarding Modal if not setup */}
      {!profile.isSetupComplete && (
        <OnboardingModal onSave={handleSaveProfile} initialProfile={profile} />
      )}

      {/* Header */}
      <Header
        profile={profile}
        session={session}
        lifetimeSavedHours={lifetimeSavedHours}
        lifetimeSavedMoney={lifetimeSavedMoney}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onResetSession={handleResetSession}
        historyCount={history.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* PWA Install Banner (if installable on device) */}
        {isInstallable && (
          <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-900/50 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Download className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Install TimeWorth as an app on your home screen for quick offline access.</span>
            </div>
            <button
              onClick={handleInstallPWA}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold shrink-0 transition-colors cursor-pointer"
            >
              Install App
            </button>
          </div>
        )}

        {/* Primary Calculator Engine */}
        <CalculatorCard profile={profile} onDecision={handleDecision} />

        {/* Stats Dashboard Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Card 1: Reclaimed Freedom */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Lifetime Reclaimed
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/40">
                {history.filter((h) => h.decision === 'not_worth_it').length} wins
              </span>
            </div>
            <div className="text-2xl font-bold font-mono-num text-emerald-300 tracking-tight">
              {formatHoursMinutes(lifetimeSavedHours)}
            </div>
            <p className="text-[11px] text-slate-400">
              {profile.showMoneyInStats
                ? `${formatCurrency(lifetimeSavedMoney, profile.currency, false)} in purchases avoided`
                : 'Life energy preserved for personal freedom'}
            </p>
          </div>

          {/* Card 2: Conscious Purchases */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <CheckCircle className="w-4 h-4" /> Conscious Spends
              </span>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800/40">
                {history.filter((h) => h.decision === 'worth_it').length} choices
              </span>
            </div>
            <div className="text-2xl font-bold font-mono-num text-slate-100 tracking-tight">
              {formatHoursMinutes(lifetimeIntentionalHours)}
            </div>
            <p className="text-[11px] text-slate-400">
              Traded intentionally with zero regret
            </p>
          </div>

          {/* Card 3: Quick Action / History Shortcut */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between space-y-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Recent Log</span>
                <span className="text-[10px] text-slate-500 font-mono-num">{history.length} evaluated</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium line-clamp-1">
                {history[0] ? `Latest: ${history[0].title} (${history[0].formattedTime})` : 'No evaluations yet'}
              </p>
            </div>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Open History & Wins</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TimeWorth • Mindful spending in life-energy</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Philosophy & Rules
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Configure Rate
            </button>
          </div>
        </div>
      </footer>

      {/* Drawers and Modals */}
      <SettingsDrawer
        profile={profile}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateProfile={handleSaveProfile}
        onResetSession={handleResetSession}
        onResetAllData={handleResetAllData}
      />

      <HistoryLog
        history={history}
        profile={profile}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onDeleteRecord={handleDeleteRecord}
        onClearHistory={handleClearHistory}
      />

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Toast Feedback */}
      <ToastNotification
        toast={activeToast}
        onDismiss={() => setActiveToast(null)}
      />
    </div>
  );
}
