import { DateTime } from 'luxon';

export const TIMEZONE_IANA: Record<string, string> = {
  IST: 'Asia/Kolkata',
  PST: 'America/Los_Angeles',
  EST: 'America/New_York',
  GMT: 'Etc/GMT',
  UTC: 'Etc/UTC',
  CST: 'America/Chicago',
};

// Fallback offsets for when IANA zones might not work
const TIMEZONE_OFFSETS: Record<string, number> = {
  IST: 5.5,  // UTC+5:30
  PST: -8,   // UTC-8 (standard time)
  EST: -5,   // UTC-5 (standard time)
  GMT: 0,    // UTC+0
  UTC: 0,    // UTC+0
  CST: -6,   // UTC-6 (standard time)
};

/**
 * Get IANA timezone name, fallback to original.
 */
export const getIanaTimeZone = (tz: string): string =>
  TIMEZONE_IANA[tz.toUpperCase()] || tz;

export const supportedTimezones = Object.keys(TIMEZONE_IANA);

/**
 * Convert UTC datetime to local timezone.
 */
export const convertFromUTC = (
  utcDateTime: string | Date,
  timeZone: string
): string => {
  const ianaTimezone = getIanaTimeZone(timeZone);
  
  // Parse the UTC datetime
  const utcDate = typeof utcDateTime === 'string' 
    ? DateTime.fromISO(utcDateTime, { zone: 'utc' })
    : DateTime.fromJSDate(utcDateTime, { zone: 'utc' });
  
  if (!utcDate.isValid) {
    throw new Error(`Invalid UTC datetime: ${utcDateTime}`);
  }
  
  // Try using IANA timezone first
  const localDate = utcDate.setZone(ianaTimezone);
  
  // Check if the conversion worked by comparing timezone offsets
  if (localDate.isValid) {
    // For IST specifically, verify the offset is correct (+5:30 = 330 minutes)
    if (timeZone.toUpperCase() === 'IST') {
      const offsetMinutes = localDate.offset;
      if (offsetMinutes === 330) { // 5.5 hours * 60 minutes
        return localDate.toFormat('yyyy-MM-dd\'T\'HH:mm:ss');
      }
    } else {
      return localDate.toFormat('yyyy-MM-dd\'T\'HH:mm:ss');
    }
  }
  
  // Fallback: use manual offset calculation
  const offset = TIMEZONE_OFFSETS[timeZone.toUpperCase()];
  if (offset !== undefined) {
    const offsetDate = utcDate.plus({ hours: offset });
    return offsetDate.toFormat('yyyy-MM-dd\'T\'HH:mm:ss');
  }
  
  throw new Error(`Unsupported timezone: ${timeZone}`);
};

/**
 * Convert local datetime string in given timezone to UTC Date.
 */
export const convertToUTC = (
  dateTimeString: string,
  timeZone: string
): Date => {
  const ianaTimezone = getIanaTimeZone(timeZone);
  
  // Try using IANA timezone first
  const localDateTime = DateTime.fromISO(dateTimeString, { zone: ianaTimezone });
  
  if (!localDateTime.isValid) {
    throw new Error(`Invalid datetime: ${dateTimeString}`);
  }
  
  // For IST specifically, verify the offset is correct
  if (timeZone.toUpperCase() === 'IST') {
    const offsetMinutes = localDateTime.offset;
    if (offsetMinutes !== 330) { // 5.5 hours * 60 minutes
      // Fallback: treat as UTC and subtract IST offset
      const utcDateTime = DateTime.fromISO(dateTimeString, { zone: 'utc' });
      const adjustedDateTime = utcDateTime.minus({ hours: 5.5 });
      return adjustedDateTime.toJSDate();
    }
  }
  
  // Convert to UTC and return as Date object
  return localDateTime.toUTC().toJSDate();
};

/**
 * Format a class schedule in user's timezone.
 */
export const formatClassSchedule = (
  utcDateTime: string | Date,
  durationHours: number,
  userTimezone: string
): { time: string; date: string; endTime: string } => {
  const ianaTimezone = getIanaTimeZone(userTimezone);
  
  // Parse UTC datetime
  const utcDate = typeof utcDateTime === 'string' 
    ? DateTime.fromISO(utcDateTime, { zone: 'utc' })
    : DateTime.fromJSDate(utcDateTime, { zone: 'utc' });
  
  if (!utcDate.isValid) {
    throw new Error(`Invalid UTC datetime: ${utcDateTime}`);
  }
  
  // Convert to user's timezone
  let localStartTime = utcDate.setZone(ianaTimezone);
  
  // Fallback for IST if timezone conversion didn't work properly
  if (userTimezone.toUpperCase() === 'IST' && localStartTime.offset !== 330) {
    localStartTime = utcDate.plus({ hours: 5.5 });
  }
  
  const localEndTime = localStartTime.plus({ hours: durationHours });
  
  // Format times in 12-hour format with AM/PM (matching original)
  const startTime = localStartTime.toFormat('h:mm a');
  const endTime = localEndTime.toFormat('h:mm a');
  
  // Format date to match original format: "Mon 6 Jul"
  const date = localStartTime.toFormat('ccc d LLL');
  
  return {
    time: `${startTime} - ${endTime}`,
    date,
    endTime
  };
};

/**
 * Get next occurrence of repeating class (return Date object like original).
 */
export const getNextRepeatingClassDate = (
  dayOfWeek: number, // 0 = Sunday
  time: string,      // HH:mm
  userTimezone: string
): Date => {
  const ianaTimezone = getIanaTimeZone(userTimezone);
  
  // Get current time in user's timezone
  const now = DateTime.now().setZone(ianaTimezone);
  
  // Parse the time string
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error(`Invalid time format: ${time}`);
  }
  
  // Create a datetime for today at the specified time
  const todayAtTime = now.set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
  
  // Calculate days until the target day of week
  const currentDayOfWeek = now.weekday % 7; // Convert Luxon's Monday=1 to Sunday=0
  let daysUntilTarget = (dayOfWeek - currentDayOfWeek + 7) % 7;
  
  // If it's the same day but the time has passed, move to next week
  if (daysUntilTarget === 0 && now > todayAtTime) {
    daysUntilTarget = 7;
  }
  
  // Create the target datetime in user's timezone
  const targetDateTime = todayAtTime.plus({ days: daysUntilTarget });
  
  // Convert to UTC using our convertToUTC function to ensure proper timezone handling
  const localDateTimeString = targetDateTime.toFormat('yyyy-MM-dd\'T\'HH:mm:ss');
  return convertToUTC(localDateTimeString, userTimezone);
};

/**
 * Format a UTC datetime for display in a user's timezone.
 */
export const formatDateTimeForDisplay = (
  utcDateTime: string | Date,
  userTimezone: string
): { time: string; date: string; fullDateTime: string } => {
  const ianaTimezone = getIanaTimeZone(userTimezone);
  
  // Parse UTC datetime
  const utcDate = typeof utcDateTime === 'string' 
    ? DateTime.fromISO(utcDateTime, { zone: 'utc' })
    : DateTime.fromJSDate(utcDateTime, { zone: 'utc' });
  
  if (!utcDate.isValid) {
    throw new Error(`Invalid UTC datetime: ${utcDateTime}`);
  }
  
  // Convert to user's timezone
  let localDate = utcDate.setZone(ianaTimezone);
  
  // Fallback for IST if timezone conversion didn't work properly
  if (userTimezone.toUpperCase() === 'IST' && localDate.offset !== 330) {
    localDate = utcDate.plus({ hours: 5.5 });
  }
  
  // Format time in 12-hour format with AM/PM (matching original)
  const time = localDate.toFormat('h:mm a');
  
  // Format date to match original format: "Mon 6 Jul 2025"
  const date = localDate.toFormat('ccc d LLL yyyy');
  
  return {
    time,
    date,
    fullDateTime: `${date} ${time}`,
  };
};

/**
 * Get the ordinal suffix for a day number.
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