import {formatDate, TimePeriod} from "../../Common/TimePeriod";
import React, {CSSProperties, useCallback} from "react";
import useMobile from "../../Common/Hooks/Mobile";
import {IconButton} from "@mui/material";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";

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

function PeriodSelector({period, startDatetime, setStartDatetime, endDatetime, setEndDatetime, style, height = 40, iconFontSize = 28}: { period: SelectableTimePeriod, startDatetime: Date, setStartDatetime: (value: Date) => void, endDatetime: Date, setEndDatetime: (value: Date) => void, style?: CSSProperties | undefined, height?: number | undefined, iconFontSize?: number | undefined }) {
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
            <IconButton onClick={setPrevious}
                        sx={{color: '#676a8a', fontSize: iconFontSize, width: height, height: height}}>
                <ChevronLeft/>
            </IconButton>
            <div style={{width: isMobile ? 60 : 100, textAlign: 'center'}}>
                {formatDate(period, startDatetime)}
            </div>
            <IconButton onClick={setNext}
                        sx={{color: '#676a8a', fontSize: iconFontSize, width: height, height: height}}>
                <ChevronRight/>
            </IconButton>
        </div>
    );
}

export default PeriodSelector;
export {getPeriodPreviousDatetime, getPeriodNextDatetime, getPeriodStartDatetime};
export type {SelectableTimePeriod};