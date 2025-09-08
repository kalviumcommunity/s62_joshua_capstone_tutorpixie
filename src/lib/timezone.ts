import { DateTime } from 'luxon';

export const COMMON_TIMEZONES = {
  EASTERN: 'America/New_York',
  CENTRAL: 'America/Chicago',
  MOUNTAIN: 'America/Denver',
  PACIFIC: 'America/Los_Angeles',
  ALASKA: 'America/Anchorage',
  HAWAII: 'Pacific/Honolulu',
  LONDON: 'Europe/London',
  PARIS: 'Europe/Paris',
  BERLIN: 'Europe/Berlin',
  ROME: 'Europe/Rome',
  MADRID: 'Europe/Madrid',
  STOCKHOLM: 'Europe/Stockholm',
  MOSCOW: 'Europe/Moscow',
  TOKYO: 'Asia/Tokyo',
  SHANGHAI: 'Asia/Shanghai',
  HONG_KONG: 'Asia/Hong_Kong',
  SINGAPORE: 'Asia/Singapore',
  MUMBAI: 'Asia/Kolkata',
  DUBAI: 'Asia/Dubai',
  SYDNEY: 'Australia/Sydney',
  MELBOURNE: 'Australia/Melbourne',
  PERTH: 'Australia/Perth',
  UTC: 'UTC',
};

export const supportedTimezones: string[] = Object.values(COMMON_TIMEZONES);

/**
 * Convert local time to UTC
 * @param localTime - Time in local timezone (string, DateTime, or Date)
 * @param localTimeZone - IANA timezone identifier (e.g., 'Australia/Melbourne')
 * @returns Date object representing the equivalent UTC time
 */
export const convertToUTC = (localDateTime: string, timezone: string): Date => {
  // Parse with explicit input timezone
  const dt = DateTime.fromISO(localDateTime, { zone: timezone });

  console.log("Input DateTime (with TZ):", dt.toString());

  // Convert to UTC and return JS Date
  const dtUtc = dt.toUTC();

  console.log("Converted to UTC:", dtUtc.toString());

  return dtUtc.toJSDate();
};

/**
 * Convert UTC time to local time
 * @param utcTime - UTC time (string, DateTime, or Date)
 * @param targetTimeZone - IANA timezone identifier (e.g., 'Australia/Melbourne')
 * @returns Date object representing the equivalent local time (NOTE: JS Date is always UTC internally)
 */
export function convertFromUTC(utcTime: string, targetTimeZone: string): Date {
  const localDateTime = DateTime.fromISO(utcTime, { zone: 'utc' }).setZone(targetTimeZone)
  // return localDateTime.toFormat("yyyy-MM-dd'T'HH:mm:ss");
  return localDateTime.toJSDate();
}

/**
 * Format a class schedule given UTC start, duration, and user timezone.
 */
export const formatClassSchedule = (
  utcDateTime: string,
  durationHours: number,
  userTimezone: string
): { time: string; date: string; endTime: string } => {
  const localStartTime = convertFromUTC(utcDateTime, userTimezone);
  const start = DateTime.fromJSDate(localStartTime, { zone: userTimezone });

  const localEndTime = start.plus({ hours: durationHours });

  return {
    time: `${start.toFormat('h:mm a')} - ${localEndTime.toFormat('h:mm a')}`,
    date: start.toFormat('ccc d LLL'),
    endTime: localEndTime.toFormat('h:mm a'),
  };
};

/**
 * Get the next occurrence of a repeating class.
 * Returns UTC `Date` object.
 */
export const getNextRepeatingClassDate = (
  dayOfWeek: number, // 0 = Sunday
  time: string,      // HH:mm
  userTimezone: string
): Date => {

  const now = DateTime.now().setZone(userTimezone);

  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error(`Invalid time format: ${time}`);
  }

  const todayAtTime = now.set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });

  const currentDay = now.weekday % 7;
  let daysUntil = (dayOfWeek - currentDay + 7) % 7;

  if (daysUntil === 0 && now > todayAtTime) {
    daysUntil = 7;
  }

  const targetLocal = todayAtTime.plus({ days: daysUntil });

  return targetLocal.toUTC().toJSDate();
};

/**
 * Format any UTC datetime for display in user's timezone.
 */
export const formatDateTimeForDisplay = (
  utcDateTime: string | Date,
  userTimezone: string
): { time: string; date: string; fullDateTime: string } => {
  const localDate = convertFromUTC(utcDateTime, userTimezone);
  const dt = DateTime.fromJSDate(localDate, { zone: userTimezone });

  return {
    time: dt.toFormat('h:mm a'),
    date: dt.toFormat('ccc d LLL yyyy'),
    fullDateTime: `${dt.toFormat('ccc d LLL yyyy')} ${dt.toFormat('h:mm a')}`,
  };
};

/**
 * Get ordinal suffix for day number.
 */
export const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

// Test 1: Convert Melbourne time to UTC
const utcResult = convertToUTC("2025-07-08T12:45:00", "Australia/Melbourne");
console.log(utcResult.toISOString()); // Should show the UTC time

// Test 2: Convert UTC to Melbourne time (as string)
const melbourneString = convertFromUTC("2025-07-08T02:45:00.000Z", "Australia/Melbourne");
console.log(melbourneString); // Should show Melbourne time