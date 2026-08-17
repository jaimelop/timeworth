import { IncomeFrequency } from '../types';

/**
 * Calculates annual net income based on pay frequency
 */
export function calculateAnnualNetIncome(
  income: number,
  frequency: IncomeFrequency,
  weeklyHours: number = 40
): number {
  if (!income || income <= 0) return 0;
  switch (frequency) {
    case 'hourly':
      return income * (52 * Math.max(1, weeklyHours));
    case 'daily':
      return income * 260; // 5 days/week × 52 weeks
    case 'weekly':
      return income * 52;
    case 'monthly':
      return income * 12;
    case 'yearly':
      return income;
    default:
      return income;
  }
}

/**
 * Calculates hourly net take-home rate
 * Formula: Annual Net Income / (52 weeks × Weekly Hours)
 */
export function calculateHourlyRate(
  income: number,
  frequency: IncomeFrequency,
  weeklyHours: number
): number {
  if (!income || income <= 0) return 0;
  if (frequency === 'hourly') {
    return income;
  }
  if (!weeklyHours || weeklyHours <= 0) return 0;
  
  if (frequency === 'daily') {
    const dailyHours = Math.max(1, weeklyHours / 5);
    return income / dailyHours;
  }

  const annualNet = calculateAnnualNetIncome(income, frequency, weeklyHours);
  const totalAnnualHours = 52 * weeklyHours;
  return annualNet / totalAnnualHours;
}

/**
 * Converts a decimal hours number into a clean formatted string e.g. "4h 20m" or "45m" or "2d 4h 15m"
 */
export function formatHoursMinutes(totalHours: number): string {
  if (isNaN(totalHours) || totalHours <= 0) {
    return '0m';
  }

  const totalMinutes = Math.round(totalHours * 60);
  if (totalMinutes === 0) {
    return '< 1m';
  }

  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

/**
 * Detailed expanded time representation e.g. "4 hours, 20 minutes"
 */
export function formatTimeDetailed(totalHours: number): string {
  if (isNaN(totalHours) || totalHours <= 0) {
    return '0 minutes';
  }

  const totalMinutes = Math.round(totalHours * 60);
  if (totalMinutes < 1) {
    return 'less than a minute';
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }

  return parts.join(', ');
}

/**
 * Format currency with chosen symbol and standard decimals
 */
export function formatCurrency(amount: number, symbol = '$', showDecimals = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${symbol}0.00`;
  }

  const hasDecimals = amount % 1 !== 0;
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: showDecimals || hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });

  return `${symbol}${formatted}`;
}

/**
 * Computes comparative equivalents for life-energy context
 */
export interface WorkEquivalents {
  workDays: number;
  workWeeks: number;
  percentOfDay: number;
  percentOfWeek: number;
  description: string;
}

export function getWorkEquivalents(hours: number, weeklyHours: number = 40): WorkEquivalents {
  const dailyHours = Math.max(1, weeklyHours / 5); // typical 5-day week
  const workDays = hours / dailyHours;
  const workWeeks = hours / weeklyHours;
  const percentOfDay = Math.min(100, Math.round((hours / dailyHours) * 100));
  const percentOfWeek = Math.min(100, Math.round((hours / weeklyHours) * 100));

  let description = '';
  if (hours < 0.5) {
    description = 'Roughly a coffee break or quick walk';
  } else if (hours <= 2) {
    description = `About ${Math.round(hours * 60)} minutes of focused labor`;
  } else if (workDays < 1) {
    description = `${percentOfDay}% of your standard daily shift`;
  } else if (workDays >= 1 && workDays < 2) {
    description = `Over an entire full work day (${workDays.toFixed(1)} days)`;
  } else if (workWeeks < 1) {
    description = `${workDays.toFixed(1)} full work days of your life`;
  } else {
    description = `${workWeeks.toFixed(1)} entire work weeks (${workDays.toFixed(0)} full days)`;
  }

  return {
    workDays,
    workWeeks,
    percentOfDay,
    percentOfWeek,
    description,
  };
}
