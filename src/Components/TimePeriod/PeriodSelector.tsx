import {formatDate, TimePeriod} from "../../Common/TimePeriod";
import React, {CSSProperties, useCallback} from "react";
import useMobile from "../../Common/Hooks/Mobile";
import Hover from "../Hover";

type SelectableTimePeriod =
    | typeof TimePeriod.Year
    | typeof TimePeriod.Month
    | typeof TimePeriod.Week
    | typeof TimePeriod.Day
    | typeof TimePeriod.Hour;

function getPeriodStartDatetime(timePeriod: SelectableTimePeriod) {
    const now = new Date();
    switch (timePeriod) {
        case TimePeriod.Year:
            return new Date(now.getFullYear(), 0, 1);
        case TimePeriod.Month:
            return new Date(now.getFullYear(), now.getMonth(), 1);
        case TimePeriod.Week:
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return new Date(today.setDate(today.getDate() - today.getDay()));
        case TimePeriod.Day:
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        case TimePeriod.Hour:
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
    }
    return now;
}

function addPeriods(datetime: Date, count: number, timePeriod: SelectableTimePeriod) {
    const datetimeClone = new Date(datetime.getTime());
    switch (timePeriod) {
        case TimePeriod.Year:
            return new Date(datetimeClone.setFullYear(datetimeClone.getFullYear() + count));
        case TimePeriod.Month:
            return new Date(datetimeClone.setMonth(datetimeClone.getMonth() + count));
        case TimePeriod.Week:
            return new Date(datetimeClone.setDate(datetimeClone.getDate() + 7 * count));
        case TimePeriod.Day:
            return new Date(datetimeClone.setDate(datetimeClone.getDate() + count));
        case TimePeriod.Hour:
            return new Date(datetimeClone.setHours(datetimeClone.getHours() + count));
    }
    return datetime;
}

function getPeriodPreviousDatetime(datetime: Date, timePeriod: SelectableTimePeriod) {
    return addPeriods(datetime, -1, timePeriod);
}

function getPeriodNextDatetime(datetime: Date, timePeriod: SelectableTimePeriod) {
    return addPeriods(datetime, 1, timePeriod);
}

function PeriodSelector({period, startDatetime, setStartDatetime, endDatetime, setEndDatetime, style, height = 38, iconFontSize = 28}: { period: SelectableTimePeriod, startDatetime: Date, setStartDatetime: (value: Date) => void, endDatetime: Date, setEndDatetime: (value: Date) => void, style?: CSSProperties | undefined, height?: number | undefined, iconFontSize?: number | undefined }) {
    const isMobile = useMobile();

    const setPrevious = useCallback(() => {
        setStartDatetime(getPeriodPreviousDatetime(startDatetime, period));
        setEndDatetime(getPeriodPreviousDatetime(endDatetime, period));
    }, [startDatetime, endDatetime, period]);

    const setNext = useCallback(() => {
        setStartDatetime(getPeriodNextDatetime(startDatetime, period));
        setEndDatetime(getPeriodNextDatetime(endDatetime, period));
    }, [startDatetime, endDatetime, period]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            border: 'solid 1px #676a8a',
            borderRadius: 20,
            height: height,
            color: '#676a8a',
            ...style
        }}>
            <Hover style={{borderRadius: '50%'}}>
                        <span className='material-symbols-outlined'
                              onClick={() => setPrevious()}
                              style={{
                                  userSelect: "none",
                                  fontSize: iconFontSize,
                                  padding: 4,
                              }}>chevron_left</span>
            </Hover>
            <div style={{width: isMobile ? 60 : 100, textAlign: 'center'}}>
                {formatDate(period, startDatetime)}
            </div>
            <Hover style={{borderRadius: '50%'}}>
                        <span className='material-symbols-outlined'
                              onClick={() => setNext()}
                              style={{
                                  userSelect: "none",
                                  fontSize: iconFontSize,
                                  padding: 4,
                              }}>chevron_right</span>
            </Hover>
        </div>
    );
}

export default PeriodSelector;
export {getPeriodPreviousDatetime, getPeriodNextDatetime, getPeriodStartDatetime};
export type {SelectableTimePeriod};