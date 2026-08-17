import { UserProfile, DecisionRecord, SessionStats } from '../types';

const PROFILE_KEY = 'timeworth_profile_v1';
const HISTORY_KEY = 'timeworth_history_v1';
const SESSION_KEY = 'timeworth_session_v1';

export const DEFAULT_PROFILE: UserProfile = {
  netIncome: 4500,
  frequency: 'monthly',
  weeklyHours: 40,
  currency: '$',
  showMoneyInStats: false,
  isSetupComplete: false,
  createdAt: Date.now(),
};

export const DEFAULT_SESSION: SessionStats = {
  savedHours: 0,
  savedMoney: 0,
  spentHours: 0,
  spentMoney: 0,
  count: 0,
  sessionStartTime: Date.now(),
};

export function loadProfile(): UserProfile {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (!data) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile', err);
  }
}

export function loadHistory(): DecisionRecord[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveHistory(history: DecisionRecord[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save history', err);
  }
}

export function loadSession(): SessionStats {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return DEFAULT_SESSION;
    return { ...DEFAULT_SESSION, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SESSION;
  }
}

export function saveSession(session: SessionStats): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save session', err);
  }
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error('Failed to clear storage', err);
  }
}
