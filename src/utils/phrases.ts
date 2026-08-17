import { DecisionType } from '../types';

export const RECLAIMED_PHRASES: string[] = [
  "Your future self is high-fiving you!",
  "That's [Time] you just bought back for your freedom.",
  "Discipline is choosing what you want most over what you want now.",
  "Wealth is the items you don't buy.",
  "Great catch! Your bank account thanks you.",
  "One step closer to financial independence.",
  "That's not just money; that's your life energy saved.",
  "You traded zero hours of your life for this today.",
  "True luxury is waking up and owning your entire day.",
  "The cost of a thing is the amount of life exchanged for it.",
  "A moment of impulse avoided = hours of freedom gained.",
  "You chose personal sovereignty over temporary clutter.",
  "Every hour saved is an hour you own for life.",
  "Your future free time just expanded.",
  "Saying no to this is saying yes to your financial peace.",
  "Peace of mind is the highest dividend.",
  "Life energy preserved. That's real power.",
  "You just bought back precious personal time.",
  "Mindful boundary respected. Well done!",
  "That's pure freedom banked in your life wallet."
];

export const CONSCIOUS_PHRASES: string[] = [
  "Enjoy it! You earned this with your hard work.",
  "Conscious spending is healthy spending.",
  "Life is about balance. Enjoy your purchase!",
  "Intentional purchases bring the most joy.",
  "No guilt here—this was a planned choice.",
  "You exchanged your time with intention and clear eyes.",
  "Invested in what genuinely matters to your life.",
  "Valued choice. Make the absolute most of it!",
  "Money is a tool to enrich your life. Enjoy!",
  "Hard work converted into meaningful value."
];

/**
 * Returns a random psychological quote formatted with the time if applicable
 */
export function getRandomPhrase(type: DecisionType, formattedTime: string): string {
  const list = type === 'not_worth_it' ? RECLAIMED_PHRASES : CONSCIOUS_PHRASES;
  const randomIndex = Math.floor(Math.random() * list.length);
  const rawPhrase = list[randomIndex];

  return rawPhrase.replace('[Time]', formattedTime);
}
