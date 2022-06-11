enum TimePeriod {
    Year = 365 * 24 * 60 * 60,
    Month = 30 * 24 * 60 * 60,
    Week = 7 * 24 * 60 * 60,
    Day = 24 * 60 * 60,
    FourHours = 4 * 60 * 60,
    Hour = 60 * 60,
    TwentyMinutes = 20 * 60,
    FiveMinutes = 5 * 60,
    Minute = 60,
}

const INTERVAL_TO_FORMAT = new Map<TimePeriod, Intl.DateTimeFormatOptions>([
    [TimePeriod.Year, {year: 'numeric'}],
    [TimePeriod.Month, {month: 'short', year: '2-digit'}],
    [TimePeriod.Week, {day: 'numeric', month: 'short'}],
    [TimePeriod.Day, {day: 'numeric', month: 'short'}],
    [TimePeriod.FourHours, {hour: '2-digit', minute: '2-digit'}],
    [TimePeriod.Hour, {hour: '2-digit', minute: '2-digit'}],
    [TimePeriod.TwentyMinutes, {hour: '2-digit', minute: '2-digit'}],
    [TimePeriod.FiveMinutes, {hour: '2-digit', minute: '2-digit'}],
    [TimePeriod.Minute, {hour: '2-digit', minute: '2-digit'}],
]);

function formatDate(interval: TimePeriod, date: Date) {
    return date.toLocaleString('en-GB', INTERVAL_TO_FORMAT.get(interval));
}

export {TimePeriod, INTERVAL_TO_FORMAT, formatDate};