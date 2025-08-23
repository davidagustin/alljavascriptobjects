import ObjectPage from '../components/ObjectPage'

export default function TemporalPage() {
  return (
    <ObjectPage
      title="Temporal"
      description="Modern date and time API for JavaScript replacing the legacy Date object"
      overview="Temporal is a Stage 3 proposal that provides a modern, comprehensive API for working with dates and times in JavaScript. It addresses the many shortcomings of the Date object with immutable objects, clear timezone handling, precise arithmetic, and support for multiple calendar systems. Temporal includes types for plain dates, times, date-times, durations, time zones, and more, all designed to be predictable, performant, and internationalization-friendly."
      syntax={`// === TEMPORAL BASICS ===
// Note: Temporal is a Stage 3 proposal, requires polyfill currently
// import { Temporal } from '@js-temporal/polyfill';

// === PLAINDATE - DATE WITHOUT TIME ===
// Creating PlainDate instances
const today = Temporal.Now.plainDateISO();
console.log(today.toString()); // 2024-03-15 (current date)

const specificDate = Temporal.PlainDate.from('2024-07-04');
console.log(specificDate.toString()); // 2024-07-04

const dateFromComponents = new Temporal.PlainDate(2024, 12, 25);
console.log(dateFromComponents.toString()); // 2024-12-25

// PlainDate properties and methods
console.log(specificDate.year);      // 2024
console.log(specificDate.month);     // 7
console.log(specificDate.day);       // 4
console.log(specificDate.dayOfWeek); // 4 (Thursday, 1=Monday)
console.log(specificDate.dayOfYear); // 186
console.log(specificDate.weekOfYear); // 27
console.log(specificDate.daysInMonth); // 31
console.log(specificDate.daysInYear);  // 366 (leap year)
console.log(specificDate.inLeapYear); // true

// Date arithmetic
const nextWeek = today.add({ days: 7 });
const lastMonth = today.subtract({ months: 1 });
const nextYear = today.with({ year: today.year + 1 });

console.log('Next week:', nextWeek.toString());
console.log('Last month:', lastMonth.toString());
console.log('Next year:', nextYear.toString());

// Comparing dates
const date1 = Temporal.PlainDate.from('2024-03-15');
const date2 = Temporal.PlainDate.from('2024-03-20');

console.log(date1.equals(date2)); // false
console.log(Temporal.PlainDate.compare(date1, date2)); // -1 (date1 < date2)

// Date formatting
console.log(today.toLocaleString('en-US')); // 3/15/2024
console.log(today.toLocaleString('de-DE')); // 15.3.2024

// === PLAINTIME - TIME WITHOUT DATE ===
const now = Temporal.Now.plainTimeISO();
console.log(now.toString()); // 14:30:45.123456789

const specificTime = Temporal.PlainTime.from('14:30:45');
const timeFromComponents = new Temporal.PlainTime(14, 30, 45, 500, 0, 0);

console.log(specificTime.hour);        // 14
console.log(specificTime.minute);      // 30
console.log(specificTime.second);      // 45
console.log(specificTime.millisecond); // 0
console.log(specificTime.microsecond); // 0
console.log(specificTime.nanosecond);  // 0

// Time arithmetic
const laterTime = specificTime.add({ hours: 2, minutes: 30 });
const earlierTime = specificTime.subtract({ minutes: 15 });

console.log('Later time:', laterTime.toString()); // 17:00:45
console.log('Earlier time:', earlierTime.toString()); // 14:15:45

// === PLAINDATETIME - DATE AND TIME WITHOUT TIMEZONE ===
const currentDateTime = Temporal.Now.plainDateTimeISO();
console.log(currentDateTime.toString()); // 2024-03-15T14:30:45.123456789

const specificDateTime = Temporal.PlainDateTime.from('2024-07-04T16:30:00');
const dateTimeFromComponents = new Temporal.PlainDateTime(2024, 7, 4, 16, 30, 0);

// Combining date and time
const combinedDateTime = specificDate.toPlainDateTime(specificTime);
console.log(combinedDateTime.toString()); // 2024-07-04T14:30:45

// DateTime arithmetic and manipulation
const futureDateTime = specificDateTime.add({ 
  days: 10, 
  hours: 3, 
  minutes: 45 
});

const pastDateTime = specificDateTime.subtract({ 
  months: 2, 
  weeks: 1 
});

// Extracting components
console.log('Date part:', specificDateTime.toPlainDate());
console.log('Time part:', specificDateTime.toPlainTime());

// === DURATION - TIME SPANS ===
const duration1 = Temporal.Duration.from('P1Y2M3DT4H5M6S');
console.log(duration1.toString()); // P1Y2M3DT4H5M6S

const duration2 = new Temporal.Duration(1, 2, 0, 3, 4, 5, 6);
console.log(duration2.years);   // 1
console.log(duration2.months);  // 2
console.log(duration2.days);    // 3
console.log(duration2.hours);   // 4
console.log(duration2.minutes); // 5
console.log(duration2.seconds); // 6

// Duration arithmetic
const totalDuration = duration1.add(duration2);
const difference = duration1.subtract(duration2);

console.log('Total:', totalDuration.toString());
console.log('Difference:', difference.toString());

// Duration in different units
const daysDuration = Temporal.Duration.from({ days: 30 });
console.log('30 days in hours:', daysDuration.total({ unit: 'hours' })); // 720

// === TIMEZONE HANDLING ===
// Getting current time in different timezones
const nowUTC = Temporal.Now.zonedDateTimeISO('UTC');
const nowTokyo = Temporal.Now.zonedDateTimeISO('Asia/Tokyo');
const nowNewYork = Temporal.Now.zonedDateTimeISO('America/New_York');

console.log('UTC:', nowUTC.toString());
console.log('Tokyo:', nowTokyo.toString());
console.log('New York:', nowNewYork.toString());

// Converting between timezones
const utcDateTime = Temporal.PlainDateTime.from('2024-07-04T12:00:00');
const utcZoned = utcDateTime.toZonedDateTime('UTC');
const tokyoZoned = utcZoned.withTimeZone('Asia/Tokyo');
const newYorkZoned = utcZoned.withTimeZone('America/New_York');

console.log('Original UTC:', utcZoned.toString());
console.log('In Tokyo:', tokyoZoned.toString());
console.log('In New York:', newYorkZoned.toString());

// === PRACTICAL DATE/TIME OPERATIONS ===

// Meeting scheduler
class MeetingScheduler {
  static findCommonMeetingTime(participants, duration) {
    const meetings = [];
    const startTime = Temporal.PlainTime.from('09:00');
    const endTime = Temporal.PlainTime.from('17:00');
    
    // Find available slots for each participant
    participants.forEach(participant => {
      const timeZone = participant.timeZone;
      const localStart = startTime.toZonedDateTime({
        timeZone,
        plainDate: Temporal.Now.plainDateISO()
      });
      
      meetings.push({
        participant: participant.name,
        timeZone,
        localStart: localStart.toPlainTime(),
        localEnd: endTime
      });
    });
    
    return meetings;
  }
  
  static scheduleRecurringMeeting(startDateTime, frequency, count) {
    const meetings = [];
    let current = startDateTime;
    
    for (let i = 0; i < count; i++) {
      meetings.push(current);
      
      switch (frequency) {
        case 'daily':
          current = current.add({ days: 1 });
          break;
        case 'weekly':
          current = current.add({ weeks: 1 });
          break;
        case 'monthly':
          current = current.add({ months: 1 });
          break;
      }
    }
    
    return meetings;
  }
}

// Age calculator
class AgeCalculator {
  static calculateAge(birthDate, referenceDate = Temporal.Now.plainDateISO()) {
    const birth = Temporal.PlainDate.from(birthDate);
    const reference = Temporal.PlainDate.from(referenceDate);
    
    if (Temporal.PlainDate.compare(birth, reference) > 0) {
      throw new Error('Birth date cannot be in the future');
    }
    
    // Calculate years, months, days
    let years = reference.year - birth.year;
    let months = reference.month - birth.month;
    let days = reference.day - birth.day;
    
    // Adjust for negative days
    if (days < 0) {
      months--;
      const prevMonth = reference.subtract({ months: 1 });
      days += prevMonth.daysInMonth;
    }
    
    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }
    
    const totalDays = reference.since(birth).total({ unit: 'days' });
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    
    return {
      years,
      months,
      days,
      totalDays: Math.floor(totalDays),
      totalHours: Math.floor(totalHours),
      totalMinutes: Math.floor(totalMinutes),
      nextBirthday: this.getNextBirthday(birth, reference)
    };
  }
  
  static getNextBirthday(birthDate, referenceDate) {
    const birth = Temporal.PlainDate.from(birthDate);
    const reference = Temporal.PlainDate.from(referenceDate);
    
    let nextBirthday = birth.with({ year: reference.year });
    
    // If birthday already passed this year, get next year's birthday
    if (Temporal.PlainDate.compare(nextBirthday, reference) <= 0) {
      nextBirthday = nextBirthday.with({ year: reference.year + 1 });
    }
    
    const daysUntil = nextBirthday.since(reference).total({ unit: 'days' });
    
    return {
      date: nextBirthday,
      daysUntil: Math.floor(daysUntil)
    };
  }
}

// Business day calculator
class BusinessDayCalculator {
  static holidays = [
    '2024-01-01', // New Year's Day
    '2024-07-04', // Independence Day
    '2024-12-25', // Christmas Day
  ];
  
  static isWeekend(date) {
    const plainDate = Temporal.PlainDate.from(date);
    const dayOfWeek = plainDate.dayOfWeek;
    return dayOfWeek === 6 || dayOfWeek === 7; // Saturday or Sunday
  }
  
  static isHoliday(date) {
    const dateString = Temporal.PlainDate.from(date).toString();
    return this.holidays.includes(dateString);
  }
  
  static isBusinessDay(date) {
    return !this.isWeekend(date) && !this.isHoliday(date);
  }
  
  static addBusinessDays(startDate, businessDays) {
    let current = Temporal.PlainDate.from(startDate);
    let remaining = businessDays;
    
    while (remaining > 0) {
      current = current.add({ days: 1 });
      if (this.isBusinessDay(current)) {
        remaining--;
      }
    }
    
    return current;
  }
  
  static countBusinessDays(startDate, endDate) {
    const start = Temporal.PlainDate.from(startDate);
    const end = Temporal.PlainDate.from(endDate);
    
    let count = 0;
    let current = start;
    
    while (Temporal.PlainDate.compare(current, end) < 0) {
      if (this.isBusinessDay(current)) {
        count++;
      }
      current = current.add({ days: 1 });
    }
    
    return count;
  }
}

// Travel time zone helper
class TravelTimeZoneHelper {
  static planTrip(departure, arrival, departureTimeZone, arrivalTimeZone) {
    const dep = Temporal.PlainDateTime.from(departure);
    const arr = Temporal.PlainDateTime.from(arrival);
    
    const departureZoned = dep.toZonedDateTime(departureTimeZone);
    const arrivalZoned = arr.toZonedDateTime(arrivalTimeZone);
    
    const flightDuration = arrivalZoned.since(departureZoned);
    
    // Convert to local times
    const departureLocal = departureZoned.toPlainDateTime();
    const arrivalLocal = arrivalZoned.withTimeZone(arrivalTimeZone).toPlainDateTime();
    
    return {
      departure: {
        local: departureLocal.toString(),
        utc: departureZoned.withTimeZone('UTC').toString(),
        timeZone: departureTimeZone
      },
      arrival: {
        local: arrivalLocal.toString(),
        utc: arrivalZoned.withTimeZone('UTC').toString(),
        timeZone: arrivalTimeZone
      },
      flightDuration: flightDuration.toString(),
      timeZoneDifference: this.getTimeZoneDifference(departureTimeZone, arrivalTimeZone)
    };
  }
  
  static getTimeZoneDifference(tz1, tz2) {
    const now = Temporal.Now.plainDateTimeISO();
    const time1 = now.toZonedDateTime(tz1);
    const time2 = now.toZonedDateTime(tz2);
    
    const diff = time2.since(time1);
    return diff.total({ unit: 'hours' });
  }
  
  static suggestCallTimes(timeZone1, timeZone2, preferredHours = [9, 10, 11, 14, 15, 16]) {
    const suggestions = [];
    const today = Temporal.Now.plainDateISO();
    
    for (const hour of preferredHours) {
      const time1 = today.toPlainDateTime(new Temporal.PlainTime(hour, 0));
      const zoned1 = time1.toZonedDateTime(timeZone1);
      const zoned2 = zoned1.withTimeZone(timeZone2);
      
      suggestions.push({
        [\`\${timeZone1}\`]: zoned1.toPlainTime().toString(),
        [\`\${timeZone2}\`]: zoned2.toPlainTime().toString(),
        suitable: this.isSuitableCallTime(zoned1.toPlainTime()) && 
                 this.isSuitableCallTime(zoned2.toPlainTime())
      });
    }
    
    return suggestions.filter(s => s.suitable);
  }
  
  static isSuitableCallTime(time) {
    const hour = time.hour;
    return hour >= 8 && hour <= 18; // 8 AM to 6 PM
  }
}

// Event countdown
class EventCountdown {
  constructor(eventDate, eventName) {
    this.eventDate = Temporal.PlainDateTime.from(eventDate);
    this.eventName = eventName;
  }
  
  getCountdown(referenceDate = Temporal.Now.plainDateTimeISO()) {
    const reference = Temporal.PlainDateTime.from(referenceDate);
    
    if (Temporal.PlainDateTime.compare(this.eventDate, reference) <= 0) {
      return {
        expired: true,
        message: \`\${this.eventName} has already occurred\`
      };
    }
    
    const duration = this.eventDate.since(reference);
    
    return {
      expired: false,
      eventName: this.eventName,
      eventDate: this.eventDate.toString(),
      timeRemaining: {
        total: duration.toString(),
        days: duration.total({ unit: 'days' }),
        hours: duration.total({ unit: 'hours' }),
        minutes: duration.total({ unit: 'minutes' }),
        seconds: duration.total({ unit: 'seconds' })
      },
      formatted: this.formatCountdown(duration)
    };
  }
  
  formatCountdown(duration) {
    const days = Math.floor(duration.total({ unit: 'days' }));
    const hours = duration.hours;
    const minutes = duration.minutes;
    const seconds = duration.seconds;
    
    if (days > 0) {
      return \`\${days} days, \${hours} hours, \${minutes} minutes\`;
    } else if (hours > 0) {
      return \`\${hours} hours, \${minutes} minutes, \${seconds} seconds\`;
    } else if (minutes > 0) {
      return \`\${minutes} minutes, \${seconds} seconds\`;
    } else {
      return \`\${seconds} seconds\`;
    }
  }
}

// === USAGE EXAMPLES ===

// Age calculation
const age = AgeCalculator.calculateAge('1990-05-15');
console.log(\`Age: \${age.years} years, \${age.months} months, \${age.days} days\`);
console.log(\`Next birthday in \${age.nextBirthday.daysUntil} days\`);

// Business days
const businessDaysLater = BusinessDayCalculator.addBusinessDays('2024-03-15', 10);
console.log('10 business days from now:', businessDaysLater.toString());

const businessDayCount = BusinessDayCalculator.countBusinessDays('2024-03-01', '2024-03-31');
console.log('Business days in March 2024:', businessDayCount);

// Meeting scheduling
const participants = [
  { name: 'Alice', timeZone: 'America/New_York' },
  { name: 'Bob', timeZone: 'Europe/London' },
  { name: 'Charlie', timeZone: 'Asia/Tokyo' }
];

const meetings = MeetingScheduler.scheduleRecurringMeeting(
  Temporal.PlainDateTime.from('2024-03-20T14:00:00'),
  'weekly',
  4
);

console.log('Weekly meetings:', meetings.map(m => m.toString()));

// Travel planning
const trip = TravelTimeZoneHelper.planTrip(
  '2024-07-04T08:00:00',
  '2024-07-04T16:30:00',
  'America/New_York',
  'Europe/Paris'
);

console.log('Trip details:', trip);

// Event countdown
const countdown = new EventCountdown('2024-12-25T00:00:00', 'Christmas 2024');
const timeLeft = countdown.getCountdown();
console.log('Christmas countdown:', timeLeft.formatted);

// Time zone call suggestions
const callTimes = TravelTimeZoneHelper.suggestCallTimes(
  'America/Los_Angeles',
  'Asia/Singapore'
);

console.log('Good call times:', callTimes);`}
      useCases={[
        "Modern date and time handling",
        "Timezone-aware applications",
        "Calendar and scheduling systems",
        "Age and duration calculations",
        "Business day calculations",
        "International applications",
        "Travel and booking systems",
        "Event planning and countdowns",
        "Time-based data analysis",
        "Cross-timezone coordination"
      ]}
      browserSupport="Temporal is a Stage 3 proposal and not yet available in browsers. Use the polyfill @js-temporal/polyfill for current support. Expected to be standardized in a future ECMAScript version."
    />
  )
}
