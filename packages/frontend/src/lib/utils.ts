import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS class names, resolving conflicts.
 * Used by shadcn/ui components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as a Belarusian ruble price string.
 * Example: formatPrice(1500) → '1 500 BYN'
 */
export function formatPrice(amount: number): string {
  return `${amount.toLocaleString('ru-RU').replace(/\u00A0/g, ' ')} BYN`;
}

const MONTHS_RU = [
  'января', 'февраля', 'марта', 'апреля',
  'мая', 'июня', 'июля', 'августа',
  'сентября', 'октября', 'ноября', 'декабря',
];

/**
 * Format a date as a Russian human-readable string.
 * Example: formatDate('2024-05-15') → '15 мая 2024'
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate();
  const month = MONTHS_RU[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const WEEK = 604800;
const MONTH = 2592000;
const YEAR = 31536000;

/**
 * Return a relative time string in Russian.
 * Example: getRelativeTime(someDate) → '2 дня назад'
 */
export function getRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffSeconds = Math.floor((Date.now() - d.getTime()) / 1000);

  if (diffSeconds < 0) return 'только что';
  if (diffSeconds < MINUTE) return 'только что';
  if (diffSeconds < HOUR) {
    const m = Math.floor(diffSeconds / MINUTE);
    return plural(m, 'минуту', 'минуты', 'минут', 'назад');
  }
  if (diffSeconds < DAY) {
    const h = Math.floor(diffSeconds / HOUR);
    return plural(h, 'час', 'часа', 'часов', 'назад');
  }
  if (diffSeconds < WEEK) {
    const days = Math.floor(diffSeconds / DAY);
    return plural(days, 'день', 'дня', 'дней', 'назад');
  }
  if (diffSeconds < MONTH) {
    const w = Math.floor(diffSeconds / WEEK);
    return plural(w, 'неделю', 'недели', 'недель', 'назад');
  }
  if (diffSeconds < YEAR) {
    const mo = Math.floor(diffSeconds / MONTH);
    return plural(mo, 'месяц', 'месяца', 'месяцев', 'назад');
  }
  const y = Math.floor(diffSeconds / YEAR);
  return plural(y, 'год', 'года', 'лет', 'назад');
}

function plural(
  n: number,
  one: string,
  few: string,
  many: string,
  suffix: string,
): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  let word: string;
  if (mod100 >= 11 && mod100 <= 19) {
    word = many;
  } else if (mod10 === 1) {
    word = one;
  } else if (mod10 >= 2 && mod10 <= 4) {
    word = few;
  } else {
    word = many;
  }
  return `${n} ${word} ${suffix}`;
}
