export type TimeFormat = '12' | '24';

type FormatTimeResult = {
  hours: string;
  minutes: string;
  seconds: string;
  ampm: string;
  timeString: string;
};

/**
 * Utility functions for date and time operations
 */

/**
 * Format a date according to the specified format
 */
export function formatDate(
  date: Date,
  format: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  return date.toLocaleDateString(format, options);
}

/**
 * Format a time according to the specified format
 */
export function formatTime(
  date: Date,
  timeFormat: TimeFormat = '12',
  showSeconds: boolean = false
): FormatTimeResult {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  let ampm = '';

  if (timeFormat === '12') {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
  }

  const formattedHours = hours.toString().padStart(2, '0');
  const timeString = showSeconds 
    ? `${formattedHours}:${minutes}:${seconds}${ampm ? ` ${ampm}` : ''}`
    : `${formattedHours}:${minutes}${ampm ? ` ${ampm}` : ''}`;

  return {
    hours: formattedHours,
    minutes,
    seconds,
    ampm,
    timeString
  };
}

/**
 * Get the day of the week
 */
export function getDayOfWeek(
  date: Date,
  format: 'long' | 'short' | 'narrow' = 'long'
): string {
  return date.toLocaleDateString('en-US', { weekday: format });
}

/**
 * Get the month name
 */
export function getMonthName(
  date: Date,
  format: 'long' | 'short' | 'narrow' = 'long'
): string {
  return date.toLocaleDateString('en-US', { month: format });
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get the difference in days between two dates
 */
export function getDaysDiff(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get the start of the day (00:00:00)
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get the end of the day (23:59:59.999)
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Check if a date is yesterday
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}

/**
 * Check if a date is tomorrow
 */
export function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(date, tomorrow);
}

/**
 * Format a duration in milliseconds to a human-readable string
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Check if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get the timezone offset in hours
 */
export function getTimezoneOffset(): number {
  return new Date().getTimezoneOffset() / -60;
}

/**
 * Convert a date to a Unix timestamp (seconds since epoch)
 */
export function toUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

/**
 * Convert a Unix timestamp to a Date object
 */
export function fromUnixTimestamp(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

/**
 * Format a date as an ISO 8601 string
 */
export function toISOString(date: Date): string {
  return date.toISOString();
}

/**
 * Parse an ISO 8601 string to a Date object
 */
export function fromISOString(isoString: string): Date {
  return new Date(isoString);
}

/**
 * Format a date as a relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date, baseDate: Date = new Date()): string {
  const diff = baseDate.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years === 1 ? '' : 's'} ago`;
  if (months > 0) return `${months} month${months === 1 ? '' : 's'} ago`;
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  return 'just now';
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date, now: Date = new Date()): boolean {
  return date < now;
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date, now: Date = new Date()): boolean {
  return date > now;
}

/**
 * Get the start of the week
 */
export function startOfWeek(date: Date, firstDayOfWeek: number = 0): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day < firstDayOfWeek ? 7 : 0) + day - firstDayOfWeek;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get the end of the week
 */
export function endOfWeek(date: Date, firstDayOfWeek: number = 0): Date {
  const result = startOfWeek(date, firstDayOfWeek);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get the start of the month
 */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Get the end of the month
 */
export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}
