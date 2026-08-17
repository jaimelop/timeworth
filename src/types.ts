export type IncomeFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface UserProfile {
  netIncome: number;
  frequency: IncomeFrequency;
  weeklyHours: number;
  currency: string;
  showMoneyInStats: boolean;
  isSetupComplete: boolean;
  createdAt: number;
}

export type DecisionType = 'worth_it' | 'not_worth_it';

export interface DecisionRecord {
  id: string;
  title: string;
  cost: number;
  isSubscription: boolean;
  annualCost: number;
  hoursCost: number;
  formattedTime: string;
  decision: DecisionType;
  feedbackPhrase: string;
  timestamp: number;
}

export interface SessionStats {
  savedHours: number;
  savedMoney: number;
  spentHours: number;
  spentMoney: number;
  count: number;
  sessionStartTime: number;
}

export interface ToastMessage {
  id: string;
  type: DecisionType;
  title: string;
  phrase: string;
  timeFormatted: string;
  amountFormatted: string;
}
