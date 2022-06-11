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

const INTERVAL_TO_DATE_FORMAT = new Map<TimePeriod, Intl.DateTimeFormatOptions>([
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
    return date.toLocaleString('en-GB', INTERVAL_TO_DATE_FORMAT.get(interval));
}

const MAX_INTERVAL_TO_INTERVAL_FORMAT = new Map<TimePeriod, { value: TimePeriod, label: string }[]>([
    [TimePeriod.Month, [{value: TimePeriod.Day, label: 'days'}, {value: TimePeriod.Hour, label: 'hr'}]],
    [TimePeriod.Week, [{value: TimePeriod.Day, label: 'days'}, {value: TimePeriod.Hour, label: 'hr'}]],
    [TimePeriod.Day, [{value: TimePeriod.Hour, label: 'hr'}, {value: TimePeriod.Minute, label: 'min'}]],
    [TimePeriod.Hour, [{value: TimePeriod.Minute, label: 'min'}]],
    [TimePeriod.Minute, [{value: TimePeriod.Minute, label: 'min'}]],
]);

function formatInterval(maxInterval: TimePeriod, interval: number) {
    if (!MAX_INTERVAL_TO_INTERVAL_FORMAT.has(maxInterval)) {
        throw Error('Unsupported time period');
    }
    const units = MAX_INTERVAL_TO_INTERVAL_FORMAT.get(maxInterval);
    const sizeUnitStrings: string[] = [];
    units?.forEach(unit => {
        if (interval > unit.value) {
            const unitSize = (interval / unit.value) | 0;
            sizeUnitStrings.push(`${unitSize} ${unit.label}`);
            interval -= unitSize * unit.value;
        }
    });
    if (sizeUnitStrings.length === 0) {
        return `0${units?.[units?.length - 1].label}`;
    }
    return sizeUnitStrings.join(', ');
}

export {TimePeriod, formatDate, formatInterval};