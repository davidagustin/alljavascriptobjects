import ObjectPage from '../components/ObjectPage'

export default function DatePage() {
  return (
    <ObjectPage
      title="Date"
      description="Represents a specific moment in time with comprehensive methods for date/time manipulation"
      overview="The Date constructor creates Date objects representing a single moment in time. Dates are stored as milliseconds since January 1, 1970 UTC (Unix epoch). JavaScript Date objects provide numerous methods for getting and setting date components, formatting dates, and performing date arithmetic."
      syntax={`// ============ CREATING DATES ============
// Current date and time
const now = new Date();                     // Current date and time
console.log(now);                           // e.g., Wed Dec 25 2024 10:30:00 GMT-0500

// Date from various string formats
const date1 = new Date('2024-12-25');                    // ISO date (YYYY-MM-DD)
const date2 = new Date('2024-12-25T10:30:00');           // ISO with time
const date3 = new Date('2024-12-25T10:30:00.500Z');      // ISO with milliseconds + UTC
const date4 = new Date('2024-12-25T10:30:00-05:00');     // ISO with timezone offset
const date5 = new Date('December 25, 2024');             // Long format
const date6 = new Date('Dec 25, 2024');                  // Short format
const date7 = new Date('12/25/2024');                    // MM/DD/YYYY (US format)
const date8 = new Date('25/12/2024');                    // DD/MM/YYYY (often fails)
const date9 = new Date('Wed, 25 Dec 2024 10:30:00 GMT'); // RFC format
const date10 = new Date('2024-12-25 10:30:00');          // Space-separated

// Date from components (year, month[0-11], day, hour, minute, second, millisecond)
const date11 = new Date(2024);                           // Jan 1, 2024, 00:00:00 (local)
const date12 = new Date(2024, 11);                       // Dec 1, 2024, 00:00:00 (month 0-indexed)
const date13 = new Date(2024, 11, 25);                   // Dec 25, 2024, 00:00:00
const date14 = new Date(2024, 11, 25, 10);               // Dec 25, 2024, 10:00:00
const date15 = new Date(2024, 11, 25, 10, 30);           // Dec 25, 2024, 10:30:00
const date16 = new Date(2024, 11, 25, 10, 30, 45);       // Dec 25, 2024, 10:30:45
const date17 = new Date(2024, 11, 25, 10, 30, 45, 500);  // Dec 25, 2024, 10:30:45.500

// Date from timestamp (milliseconds since Unix epoch)
const date18 = new Date(0);                              // Jan 1, 1970, 00:00:00 UTC
const date19 = new Date(1735128600000);                  // Specific timestamp
const date20 = new Date(-86400000);                      // Dec 31, 1969 (negative timestamp)

// Copy constructor
const date21 = new Date(now);                            // Copy of existing date

// Invalid dates
const invalid1 = new Date('invalid string');             // Invalid Date
const invalid2 = new Date('2024-13-01');                 // Invalid month
const invalid3 = new Date('2024-02-30');                 // Invalid day
const invalid4 = new Date(NaN);                          // Invalid Date

console.log(invalid1.toString());                        // 'Invalid Date'
console.log(isNaN(invalid1.getTime()));                  // true
console.log(invalid1 instanceof Date);                   // true (still Date object)

// ============ STATIC METHODS ============

// Date.now() - current timestamp in milliseconds
console.log(Date.now());                                 // e.g., 1735128600000
console.log(typeof Date.now());                          // 'number'

// Date.parse(dateString) - parse date string to timestamp
console.log(Date.parse('2024-12-25'));                   // 1735084800000 (or adjusted for timezone)
console.log(Date.parse('2024-12-25T10:30:00Z'));         // 1735122600000 (UTC)
console.log(Date.parse('Dec 25, 2024'));                 // Timestamp
console.log(Date.parse('12/25/2024'));                   // Timestamp
console.log(Date.parse('invalid'));                      // NaN

// ISO string parsing is most reliable
console.log(Date.parse('2024-12-25T00:00:00.000Z'));     // Guaranteed UTC
console.log(Date.parse('2024-12-25T00:00:00'));          // Local time interpretation

// Date.UTC(year, month[, day[, hour[, minute[, second[, millisecond]]]]]) 
// Creates UTC timestamp from components (month is 0-indexed)
console.log(Date.UTC(2024, 11, 25));                     // UTC timestamp for Dec 25, 2024, 00:00:00
console.log(Date.UTC(2024, 11, 25, 10, 30, 0));          // UTC timestamp for Dec 25, 2024, 10:30:00
console.log(Date.UTC(2024, 11, 25, 10, 30, 45, 500));    // UTC timestamp with milliseconds

// Compare local vs UTC construction
const localDate = new Date(2024, 11, 25, 12, 0, 0);      // Local noon
const utcDate = new Date(Date.UTC(2024, 11, 25, 12, 0, 0)); // UTC noon
console.log(localDate.getTime() !== utcDate.getTime());   // true (different timestamps)

// ============ GETTER METHODS (LOCAL TIME) ============
const testDate = new Date('2024-12-25T10:30:45.500');

// Year methods
console.log(testDate.getFullYear());                      // 2024 (4-digit year)
console.log(testDate.getYear());                          // 124 (DEPRECATED: year - 1900)

// Month methods (0-indexed: 0=January, 11=December)
console.log(testDate.getMonth());                         // 11 (December)

// Day methods
console.log(testDate.getDate());                          // 25 (day of month, 1-31)
console.log(testDate.getDay());                           // 3 (day of week: 0=Sunday, 6=Saturday)

// Time methods
console.log(testDate.getHours());                         // 10 (0-23)
console.log(testDate.getMinutes());                       // 30 (0-59)
console.log(testDate.getSeconds());                       // 45 (0-59)
console.log(testDate.getMilliseconds());                  // 500 (0-999)

// Timestamp methods
console.log(testDate.getTime());                          // Milliseconds since epoch
console.log(testDate.valueOf());                          // Same as getTime()
console.log(+testDate);                                   // Same as getTime() (type coercion)

// Timezone offset
console.log(testDate.getTimezoneOffset());                // Minutes from UTC (e.g., 300 for EST)
// Positive = behind UTC, negative = ahead of UTC

// ============ GETTER METHODS (UTC) ============
// All corresponding UTC methods (no timezone adjustment)

console.log(testDate.getUTCFullYear());                   // 2024
console.log(testDate.getUTCMonth());                      // 11 (December)
console.log(testDate.getUTCDate());                       // 25 (or different if timezone shifted)
console.log(testDate.getUTCDay());                        // Day of week in UTC
console.log(testDate.getUTCHours());                      // Hour in UTC
console.log(testDate.getUTCMinutes());                    // Minute in UTC  
console.log(testDate.getUTCSeconds());                    // 45
console.log(testDate.getUTCMilliseconds());               // 500

// Compare local vs UTC
const date = new Date();
console.log(\`Local: \${date.getHours()}:\${date.getMinutes()}\`);
console.log(\`UTC: \${date.getUTCHours()}:\${date.getUTCMinutes()}\`);

// ============ SETTER METHODS (LOCAL TIME) ============
const mutableDate = new Date('2024-01-01T12:00:00');

// Set year (can also set month and day simultaneously)
console.log(mutableDate.setFullYear(2025));               // Returns new timestamp
console.log(mutableDate.setFullYear(2025, 5));            // Year and month (June)
console.log(mutableDate.setFullYear(2025, 5, 15));        // Year, month, and day

// Set month (0-indexed, can also set day)
console.log(mutableDate.setMonth(8));                     // September
console.log(mutableDate.setMonth(8, 20));                 // September 20th

// Set day of month
console.log(mutableDate.setDate(25));                     // 25th
console.log(mutableDate.setDate(0));                      // Last day of previous month
console.log(mutableDate.setDate(-1));                     // 2nd to last day of previous month
console.log(mutableDate.setDate(35));                     // Overflows to next month

// Set time components
console.log(mutableDate.setHours(18));                    // 6 PM
console.log(mutableDate.setHours(18, 45));                // 6:45 PM
console.log(mutableDate.setHours(18, 45, 30));            // 6:45:30 PM
console.log(mutableDate.setHours(18, 45, 30, 250));       // 6:45:30.250 PM

console.log(mutableDate.setMinutes(15));                  // 15 minutes
console.log(mutableDate.setMinutes(15, 30));              // 15:30
console.log(mutableDate.setMinutes(15, 30, 500));         // 15:30.500

console.log(mutableDate.setSeconds(45));                  // 45 seconds
console.log(mutableDate.setSeconds(45, 250));             // 45.250 seconds

console.log(mutableDate.setMilliseconds(750));            // 750 milliseconds

// Set from timestamp
console.log(mutableDate.setTime(1735128600000));          // Set to specific timestamp
console.log(mutableDate.setTime(Date.now()));             // Set to current time

// ============ SETTER METHODS (UTC) ============
// All corresponding UTC methods (no timezone adjustment)

const utcMutable = new Date();

console.log(utcMutable.setUTCFullYear(2024));             // Set UTC year
console.log(utcMutable.setUTCFullYear(2024, 11, 25));     // Set UTC year, month, day
console.log(utcMutable.setUTCMonth(5));                   // Set UTC month (June)
console.log(utcMutable.setUTCMonth(5, 15));               // Set UTC month and day
console.log(utcMutable.setUTCDate(20));                   // Set UTC day
console.log(utcMutable.setUTCHours(14, 30, 0, 0));        // Set UTC time
console.log(utcMutable.setUTCMinutes(45, 30, 500));       // Set UTC minutes, seconds, ms
console.log(utcMutable.setUTCSeconds(15, 250));           // Set UTC seconds and ms
console.log(utcMutable.setUTCMilliseconds(500));          // Set UTC milliseconds

// ============ CONVERSION AND FORMATTING METHODS ============
const formatDate = new Date('2024-12-25T10:30:45.500');

// Basic string conversions
console.log(formatDate.toString());                       // Full string with timezone
// 'Wed Dec 25 2024 10:30:45 GMT-0500 (Eastern Standard Time)'

console.log(formatDate.toDateString());                   // Date portion only
// 'Wed Dec 25 2024'

console.log(formatDate.toTimeString());                   // Time portion only  
// '10:30:45 GMT-0500 (Eastern Standard Time)'

// ISO string (always UTC)
console.log(formatDate.toISOString());                    // ISO 8601 format
// '2024-12-25T15:30:45.500Z' (converted to UTC)

console.log(formatDate.toJSON());                         // Same as toISOString()
// '2024-12-25T15:30:45.500Z'

// UTC string representations
console.log(formatDate.toUTCString());                    // RFC 7231 format
// 'Wed, 25 Dec 2024 15:30:45 GMT'

console.log(formatDate.toGMTString());                    // DEPRECATED: same as toUTCString()

// Locale-specific formatting (basic)
console.log(formatDate.toLocaleString());                 // Default locale
console.log(formatDate.toLocaleDateString());             // Date only, default locale
console.log(formatDate.toLocaleTimeString());             // Time only, default locale

// Locale-specific with locale parameter
console.log(formatDate.toLocaleString('en-US'));          // '12/25/2024, 10:30:45 AM'
console.log(formatDate.toLocaleString('en-GB'));          // '25/12/2024, 10:30:45'
console.log(formatDate.toLocaleString('de-DE'));          // '25.12.2024, 10:30:45'
console.log(formatDate.toLocaleString('ja-JP'));          // '2024/12/25 10:30:45'
console.log(formatDate.toLocaleString('fr-FR'));          // '25/12/2024 10:30:45'
console.log(formatDate.toLocaleString('ar-SA'));          // Arabic numerals and format

// Date-only formatting
console.log(formatDate.toLocaleDateString('en-US'));      // '12/25/2024'
console.log(formatDate.toLocaleDateString('en-GB'));      // '25/12/2024'
console.log(formatDate.toLocaleDateString('de-DE'));      // '25.12.2024'
console.log(formatDate.toLocaleDateString('ja-JP'));      // '2024/12/25'

// Time-only formatting  
console.log(formatDate.toLocaleTimeString('en-US'));      // '10:30:45 AM'
console.log(formatDate.toLocaleTimeString('en-GB'));      // '10:30:45'
console.log(formatDate.toLocaleTimeString('de-DE'));      // '10:30:45'

// Advanced locale formatting with options
const advancedOptions = {
  weekday: 'long',        // 'narrow', 'short', 'long'
  year: 'numeric',        // 'numeric', '2-digit'  
  month: 'long',          // 'numeric', '2-digit', 'narrow', 'short', 'long'
  day: 'numeric',         // 'numeric', '2-digit'
  hour: '2-digit',        // 'numeric', '2-digit'
  minute: '2-digit',      // 'numeric', '2-digit'
  second: '2-digit',      // 'numeric', '2-digit'
  timeZoneName: 'short',  // 'short', 'long'
  hour12: true            // true/false for 12/24 hour format
};

console.log(formatDate.toLocaleString('en-US', advancedOptions));
// 'Wednesday, December 25, 2024 at 10:30:45 AM EST'

// Specific formatting options
console.log(formatDate.toLocaleString('en-US', {
  month: 'short',
  day: '2-digit', 
  year: 'numeric'
})); // 'Dec 25, 2024'

console.log(formatDate.toLocaleString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
})); // '10:30'

console.log(formatDate.toLocaleString('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric'
})); // 'Wed, Dec 25'

// Era formatting
console.log(formatDate.toLocaleDateString('en-US', {
  era: 'long',
  year: 'numeric'
})); // '2024 Anno Domini'

// Different calendar systems
console.log(formatDate.toLocaleDateString('ar-SA-u-ca-islamic')); // Islamic calendar
console.log(formatDate.toLocaleDateString('ja-JP-u-ca-japanese')); // Japanese calendar

// TimeZone formatting
console.log(formatDate.toLocaleString('en-US', {
  timeZone: 'UTC',
  hour: '2-digit',
  minute: '2-digit'
})); // UTC time

console.log(formatDate.toLocaleString('en-US', {
  timeZone: 'America/Los_Angeles',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short'
})); // Pacific time

// ============ DATE ARITHMETIC AND COMPARISON ============
const date1 = new Date('2024-01-01');
const date2 = new Date('2024-12-31');
const date3 = new Date('2024-01-01');

// Date comparison
console.log(date1 < date2);                               // true
console.log(date1 > date2);                               // false  
console.log(date1 <= date3);                              // true
console.log(date1 >= date3);                              // true
console.log(date1 == date3);                              // false (different objects)
console.log(date1.getTime() === date3.getTime());         // true (same timestamp)

// Date difference (returns milliseconds)
const diffMs = date2 - date1;                             // 31536000000 (milliseconds)
const diffSeconds = diffMs / 1000;                        // Convert to seconds
const diffMinutes = diffMs / (1000 * 60);                 // Convert to minutes
const diffHours = diffMs / (1000 * 60 * 60);              // Convert to hours
const diffDays = diffMs / (1000 * 60 * 60 * 24);          // Convert to days
const diffWeeks = diffDays / 7;                           // Convert to weeks
const diffMonths = diffDays / 30.44;                      // Approximate months
const diffYears = diffDays / 365.25;                      // Approximate years

console.log(\`Difference: \${diffDays} days\`);            // ~365 days

// Date arithmetic helpers
function addMilliseconds(date, ms) {
  return new Date(date.getTime() + ms);
}

function addSeconds(date, seconds) {
  return addMilliseconds(date, seconds * 1000);
}

function addMinutes(date, minutes) {
  return addSeconds(date, minutes * 60);
}

function addHours(date, hours) {
  return addMinutes(date, hours * 60);
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addWeeks(date, weeks) {
  return addDays(date, weeks * 7);
}

function addMonths(date, months) {
  const result = new Date(date);
  const originalDay = result.getDate();
  result.setMonth(result.getMonth() + months);
  
  // Handle month overflow (e.g., Jan 31 + 1 month = Feb 28/29)
  if (result.getDate() !== originalDay) {
    result.setDate(0); // Set to last day of previous month
  }
  return result;
}

function addYears(date, years) {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  
  // Handle leap year edge case (Feb 29 + 1 year)
  if (result.getMonth() !== date.getMonth()) {
    result.setDate(0); // Set to Feb 28
  }
  return result;
}

// Examples of date arithmetic
const baseDate = new Date('2024-01-15T12:00:00');
console.log(addDays(baseDate, 10));                       // Jan 25, 2024
console.log(addMonths(baseDate, 2));                      // Mar 15, 2024
console.log(addYears(baseDate, 1));                       // Jan 15, 2025

// Edge cases
const edgeDate = new Date('2024-01-31T12:00:00');
console.log(addMonths(edgeDate, 1));                      // Feb 29, 2024 (leap year)
console.log(addMonths(edgeDate, 2));                      // Mar 31, 2024

const leapDate = new Date('2024-02-29T12:00:00');
console.log(addYears(leapDate, 1));                       // Feb 28, 2025 (not leap year)

// ============ PRACTICAL DATE UTILITIES ============

// Age calculation (precise)
function calculateAge(birthDate, referenceDate = new Date()) {
  const birth = new Date(birthDate);
  const reference = new Date(referenceDate);
  
  let years = reference.getFullYear() - birth.getFullYear();
  let months = reference.getMonth() - birth.getMonth();
  let days = reference.getDate() - birth.getDate();
  
  // Adjust for negative days
  if (days < 0) {
    months--;
    const prevMonth = new Date(reference.getFullYear(), reference.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months, days };
}

// Business days calculation
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

function isBusinessDay(date) {
  return !isWeekend(date);
}

function addBusinessDays(date, businessDays) {
  const result = new Date(date);
  let count = 0;
  const direction = businessDays < 0 ? -1 : 1;
  const target = Math.abs(businessDays);
  
  while (count < target) {
    result.setDate(result.getDate() + direction);
    if (isBusinessDay(result)) {
      count++;
    }
  }
  
  return result;
}

function getBusinessDaysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    if (isBusinessDay(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

// Week calculations
function getWeekNumber(date) {
  const target = new Date(date);
  const firstJan = new Date(target.getFullYear(), 0, 1);
  
  // Set to nearest Thursday (ISO 8601 week calculation)
  const dayOfWeek = firstJan.getDay();
  const daysToThursday = ((dayOfWeek <= 4) ? 4 - dayOfWeek : 11 - dayOfWeek);
  const firstThursday = new Date(firstJan.getTime() + daysToThursday * 24 * 60 * 60 * 1000);
  
  const targetThursday = new Date(target);
  targetThursday.setDate(target.getDate() + (4 - target.getDay()));
  
  return Math.floor((targetThursday.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
}

function getWeekStart(date, startDay = 1) { // 0 = Sunday, 1 = Monday
  const result = new Date(date);
  const currentDay = result.getDay();
  const diff = (currentDay - startDay + 7) % 7;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getWeekEnd(date, startDay = 1) {
  const result = getWeekStart(date, startDay);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
}

// Month calculations  
function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthEnd(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function getDaysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getQuarter(date) {
  return Math.floor(date.getMonth() / 3) + 1;
}

function getQuarterStart(date) {
  const quarter = getQuarter(date);
  const month = (quarter - 1) * 3;
  return new Date(date.getFullYear(), month, 1);
}

function getQuarterEnd(date) {
  const quarter = getQuarter(date);
  const month = quarter * 3;
  return new Date(date.getFullYear(), month, 0, 23, 59, 59, 999);
}

// Year calculations
function getYearStart(date) {
  return new Date(date.getFullYear(), 0, 1);
}

function getYearEnd(date) {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

// Relative time formatting
function getRelativeTime(date, referenceDate = new Date()) {
  const target = new Date(date);
  const reference = new Date(referenceDate);
  const diffMs = reference.getTime() - target.getTime();
  const isPast = diffMs > 0;
  const absDiff = Math.abs(diffMs);
  
  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);
  
  const suffix = isPast ? 'ago' : 'from now';
  
  if (years > 0) return \`\${years} year\${years > 1 ? 's' : ''} \${suffix}\`;
  if (months > 0) return \`\${months} month\${months > 1 ? 's' : ''} \${suffix}\`;
  if (weeks > 0) return \`\${weeks} week\${weeks > 1 ? 's' : ''} \${suffix}\`;
  if (days > 0) return \`\${days} day\${days > 1 ? 's' : ''} \${suffix}\`;
  if (hours > 0) return \`\${hours} hour\${hours > 1 ? 's' : ''} \${suffix}\`;
  if (minutes > 0) return \`\${minutes} minute\${minutes > 1 ? 's' : ''} \${suffix}\`;
  if (seconds > 5) return \`\${seconds} second\${seconds > 1 ? 's' : ''} \${suffix}\`;
  
  return isPast ? 'just now' : 'in a moment';
}

// Countdown functionality
function countdown(targetDate, referenceDate = new Date()) {
  const target = new Date(targetDate);
  const reference = new Date(referenceDate);
  const diffMs = target.getTime() - reference.getTime();
  
  if (diffMs <= 0) {
    return { expired: true, timeLeft: 0 };
  }
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return {
    expired: false,
    timeLeft: diffMs,
    days,
    hours,
    minutes,
    seconds,
    formatted: \`\${days}d \${hours}h \${minutes}m \${seconds}s\`
  };
}

// Date range generator
function* dateRange(startDate, endDate, step = 1, unit = 'day') {
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    yield new Date(current);
    
    switch (unit) {
      case 'millisecond':
        current.setMilliseconds(current.getMilliseconds() + step);
        break;
      case 'second':
        current.setSeconds(current.getSeconds() + step);
        break;
      case 'minute':
        current.setMinutes(current.getMinutes() + step);
        break;
      case 'hour':
        current.setHours(current.getHours() + step);
        break;
      case 'day':
        current.setDate(current.getDate() + step);
        break;
      case 'week':
        current.setDate(current.getDate() + (step * 7));
        break;
      case 'month':
        current.setMonth(current.getMonth() + step);
        break;
      case 'year':
        current.setFullYear(current.getFullYear() + step);
        break;
      default:
        current.setDate(current.getDate() + step);
    }
  }
}

// Date validation
function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

function isValidDateString(dateString) {
  const date = new Date(dateString);
  return isValidDate(date);
}

function validateDateRange(date, minDate, maxDate) {
  const target = new Date(date);
  const min = minDate ? new Date(minDate) : null;
  const max = maxDate ? new Date(maxDate) : null;
  
  if (!isValidDate(target)) {
    return { valid: false, error: 'Invalid date' };
  }
  
  if (min && target < min) {
    return { valid: false, error: \`Date must be after \${min.toDateString()}\` };
  }
  
  if (max && target > max) {
    return { valid: false, error: \`Date must be before \${max.toDateString()}\` };
  }
  
  return { valid: true, date: target };
}

// Timezone utilities (basic)
function getTimezoneOffset(date = new Date()) {
  return date.getTimezoneOffset(); // Minutes behind UTC
}

function getTimezoneOffsetString(date = new Date()) {
  const offset = date.getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset <= 0 ? '+' : '-';
  return \`\${sign}\${String(hours).padStart(2, '0')}:\${String(minutes).padStart(2, '0')}\`;
}

function convertToTimezone(date, timezone) {
  return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
}

// Holiday calculations (examples)
function getEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month, day);
}

function getThanksgiving(year) {
  // Fourth Thursday in November
  const november = new Date(year, 10, 1); // November 1st
  const firstThursday = 1 + ((4 - november.getDay()) % 7);
  return new Date(year, 10, firstThursday + 21); // Fourth Thursday
}

// Performance and utility functions
function performanceTimer() {
  const start = Date.now();
  return {
    elapsed: () => Date.now() - start,
    stop: () => {
      const elapsed = Date.now() - start;
      console.log(\`Elapsed: \${elapsed}ms\`);
      return elapsed;
    }
  };
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function (...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// ============ PRACTICAL EXAMPLES ============

// Example usage
const today = new Date();
const birthday = new Date('1990-05-15');

console.log('Age:', calculateAge(birthday));               // { years: 34, months: 7, days: 10 }
console.log('Relative time:', getRelativeTime(birthday)); // '34 years ago'
console.log('Business days to add 5:', addBusinessDays(today, 5));
console.log('Week number:', getWeekNumber(today));        // Current week
console.log('Quarter:', getQuarter(today));               // Current quarter (1-4)
console.log('Days in month:', getDaysInMonth(today));     // Days in current month
console.log('Is leap year:', isLeapYear(today.getFullYear())); // true/false
console.log('Countdown to New Year:', countdown('2025-01-01T00:00:00'));

// Date range example
const dates = [...dateRange('2024-01-01', '2024-01-07')];
dates.forEach(date => console.log(date.toDateString()));

// Timezone examples  
console.log('Current timezone offset:', getTimezoneOffsetString());
console.log('UTC time:', today.toISOString());
console.log('Local time:', today.toString());

// Holiday examples
console.log('Easter 2024:', getEaster(2024).toDateString());
console.log('Thanksgiving 2024:', getThanksgiving(2024).toDateString());

// Performance example
const timer = performanceTimer();
// ... some operation ...
timer.stop(); // Logs elapsed time`}
      useCases={[
        "Date and time handling and manipulation",
        "Calendar and scheduling applications", 
        "Age and duration calculations",
        "Timestamp processing and conversion",
        "Date formatting and localization",
        "Business day calculations",
        "Countdown timers and deadlines",
        "Historical data analysis with dates",
        "Event planning and reminders",
        "Time zone conversions and handling",
        "Holiday and special date calculations",
        "Date range generation and iteration", 
        "Performance timing and benchmarking",
        "Date validation and error handling",
        "Relative time display (ago/from now)"
      ]}
    />
  )
}