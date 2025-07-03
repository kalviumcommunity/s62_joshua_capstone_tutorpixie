// /utils/timezone.ts

// Common timezone mappings with their UTC offsets (in minutes)
const TIMEZONE_OFFSETS: Record<string, number> = {
  'IST': 330,      // India Standard Time (UTC+5:30)
  'GMT': 0,        // Greenwich Mean Time (UTC+0)
  'UTC': 0,        // Coordinated Universal Time (UTC+0)
  'PST': -480,     // Pacific Standard Time (UTC-8)
//   'PDT': -420,     // Pacific Daylight Time (UTC-7)
  'EST': -300,     // Eastern Standard Time (UTC-5)
//   'EDT': -240,     // Eastern Daylight Time (UTC-4)
  'CST': -360,     // Central Standard Time (UTC-6)
//   'CDT': -300,     // Central Daylight Time (UTC-5)
//   'MST': -420,     // Mountain Standard Time (UTC-7)
//   'MDT': -360,     // Mountain Daylight Time (UTC-6)
//   'JST': 540,      // Japan Standard Time (UTC+9)
//   'AEST': 600,     // Australian Eastern Standard Time (UTC+10)
//   'AEDT': 660,     // Australian Eastern Daylight Time (UTC+11)
//   'CET': 60,       // Central European Time (UTC+1)
//   'CEST': 120,     // Central European Summer Time (UTC+2)
//   'BST': 60,       // British Summer Time (UTC+1)
};

const TIMEZONE_IANA: Record<string, string> = {
  IST: 'Asia/Kolkata',
  PST: 'America/Los_Angeles',
  EST: 'America/New_York',
  GMT: 'Etc/GMT',
  UTC: 'Etc/UTC'
};

export const getIanaTimeZone = (tz: string) => TIMEZONE_IANA[tz] || 'UTC';

export const supportedTimezones = Object.keys(TIMEZONE_OFFSETS);

/**
 * Converts a local date/time to UTC for database storage
 * @param localDateTime - The local date/time string or Date object
 * @param timezone - The user's timezone (e.g., 'IST', 'PST', etc.)
 * @returns UTC Date object
 */
export const convertToUTC = (localDateTime: string | Date, timezone: string): Date => {
  let date: Date;
  
  if (typeof localDateTime === 'string') {
    date = new Date(localDateTime);
  } else {
    date = new Date(localDateTime);
  }

  // If timezone is not in our predefined list, try to use browser's Intl API
  if (!TIMEZONE_OFFSETS.hasOwnProperty(timezone)) {
    console.warn(`Timezone ${timezone} not found in predefined list. Using browser's timezone detection.`);
    return date; // Return as-is if we can't handle the timezone
  }

  const offsetMinutes = TIMEZONE_OFFSETS[timezone];
  
  // Convert to UTC by subtracting the timezone offset
  const utcDate = new Date(date.getTime() - (offsetMinutes * 60 * 1000));
  
  return utcDate;
};

export const convertFromUTC = (utcDateTime: string | Date, timezone: string): Date => {
  let utcDate: Date;
  
  if (typeof utcDateTime === 'string') {
    utcDate = new Date(utcDateTime);
  } else {
    utcDate = new Date(utcDateTime);
  }

  // If timezone is not in our predefined list, return UTC date
  if (!TIMEZONE_OFFSETS.hasOwnProperty(timezone)) {
    console.warn(`Timezone ${timezone} not found in predefined list. Using UTC.`);
    return utcDate;
  }

  const offsetMinutes = TIMEZONE_OFFSETS[timezone];
  
  // Convert from UTC by adding the timezone offset
  const localDate = new Date(utcDate.getTime() + (offsetMinutes * 60 * 1000));
  
  return localDate;
};

/**
 * Formats a date/time for display in user's timezone
 * @param utcDateTime - The UTC date/time from database
 * @param userTimezone - The user's timezone
 * @param options - Formatting options
 * @returns Formatted date and time strings
 */
export const formatDateTimeForDisplay = (
  utcDateTime: string | Date,
  userTimezone: string,
  options?: {
    includeSeconds?: boolean;
    use24Hour?: boolean;
    includeDayName?: boolean;
  }
): { time: string; date: string; fullDateTime: string } => {
  const localDate = convertFromUTC(utcDateTime, userTimezone);
  
  const defaultOptions = {
    includeSeconds: false,
    use24Hour: false,
    includeDayName: true,
    ...options
  };

  // Format time
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    ...(defaultOptions.includeSeconds && { second: '2-digit' }),
    hour12: !defaultOptions.use24Hour,
  };
  
  const formattedTime = localDate.toLocaleTimeString('en-US', timeOptions);

  // Format date
  const dateOptions: Intl.DateTimeFormatOptions = {
    ...(defaultOptions.includeDayName && { weekday: 'short' }),
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  
  const formattedDate = localDate.toLocaleDateString('en-US', dateOptions);

  // Full date time
  const fullDateTime = `${formattedDate} ${formattedTime}`;

  return {
    time: formattedTime,
    date: formattedDate,
    fullDateTime
  };
};

/**
 * Enhanced formatting specifically for class schedules
 * @param utcDateTime - UTC datetime from database
 * @param duration - Duration in hours
 * @param userTimezone - User's timezone
 * @returns Formatted class schedule information
 */
export const formatClassSchedule = (
  utcDateTime: string | Date,
  duration: number,
  userTimezone: string
): { time: string; date: string; endTime: string; } => {
  const localStartDate = convertFromUTC(utcDateTime, userTimezone);
  const localEndDate = new Date(localStartDate.getTime() + (duration * 60 * 60 * 1000));

  // Format start time
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  };
  
  const startTime = localStartDate.toLocaleTimeString('en-US', timeOptions);
  const endTime = localEndDate.toLocaleTimeString('en-US', timeOptions);
  
  // Format date with ordinal suffix
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  };
  
  const formattedDate = localStartDate.toLocaleDateString('en-US', dateOptions);
  
  // Convert "Mon, Dec 25" to "Mon 25th Dec" format
  const parts = formattedDate.split(', ');
  let finalDate = formattedDate;
  
  if (parts.length === 2) {
    const [dayName, monthDay] = parts;
    const [month, day] = monthDay.split(' ');
    
    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    const dayNum = parseInt(day);
    finalDate = `${dayName} ${dayNum}${getOrdinalSuffix(dayNum)} ${month}`;
  }

  return {
    time: `${startTime} - ${endTime}`,
    date: finalDate,
    endTime
  };
};

/**
 * Calculate the next occurrence of a repeating class
 * @param dayOfWeek - Day of week (0 = Sunday, 1 = Monday, etc.)
 * @param time - Time in HH:MM format
 * @param userTimezone - User's timezone
 * @returns Next occurrence as UTC date
 */
export const getNextRepeatingClassDate = (
  dayOfWeek: number,
  time: string,
  userTimezone: string
): Date => {
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  
  // Calculate days to add to get to the next occurrence
  let daysToAdd = 7; // Default to next week
  for (let i = 1; i <= 7; i++) {
    const checkDay = (currentDayOfWeek + i) % 7;
    if (checkDay === dayOfWeek) {
      daysToAdd = i;
      break;
    }
  }
  
  const nextClassDate = new Date(today);
  nextClassDate.setDate(today.getDate() + daysToAdd);
  
  // Set the time
  const [hours, minutes] = time.split(':').map(Number);
  nextClassDate.setHours(hours, minutes, 0, 0);
  
  // Convert to UTC
  return convertToUTC(nextClassDate, userTimezone);
};

/**
 * Convert between two different timezones
 * @param dateTime - Date/time in source timezone
 * @param sourceTimezone - Source timezone
 * @param targetTimezone - Target timezone
 * @returns Date object in target timezone
 */
export const convertBetweenTimezones = (
  dateTime: string | Date,
  sourceTimezone: string,
  targetTimezone: string
): Date => {
  // First convert to UTC, then to target timezone
  const utcDate = convertToUTC(dateTime, sourceTimezone);
  return convertFromUTC(utcDate, targetTimezone);
};