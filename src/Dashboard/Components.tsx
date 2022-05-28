import {INTERVAL_TO_FORMAT, TimePeriod, useMobile} from "../Utils";
import Select, {StylesConfig} from "react-select";
import React, {CSSProperties, ReactNode, useState} from "react";

function Hover({children, style, disabled}: { children: ReactNode, style?: CSSProperties | undefined, disabled?: boolean }) {
    const [buttonHover, setButtonHover] = useState(false);
    const [buttonActive, setButtonActive] = useState(false);

    function getBackground() {
        if (disabled) {
            return '';
        }
        if (buttonActive) {
            return 'rgba(255, 255 ,255, 0.2)';
        }
        if (buttonHover) {
            return 'rgba(255, 255 ,255, 0.1)';
        }
        return '';
    }

    return (
        <div onMouseEnter={() => setButtonHover(true)}
             onMouseLeave={() => setButtonHover(false)}
             onMouseDown={() => {
                 function handleMouseUp() {
                     setButtonActive(false);
                     document.removeEventListener('mouseup', handleMouseUp);
                 }

                 setButtonActive(true);
                 document.addEventListener('mouseup', handleMouseUp);
             }}
             style={{
                 ...style,
                 background: getBackground(),
                 transition: 'background 0.1s linear'
             }}>{children}</div>
    );
}

type PeriodDropdownOption = { label: string, value: TimePeriod };


function PeriodDropdown({period, setPeriod, options, containerStyle, controlStyle}: { period: TimePeriod, setPeriod: (period: TimePeriod) => void, options: PeriodDropdownOption[], containerStyle?: CSSProperties | undefined, controlStyle?: CSSProperties | undefined }) {
    const isMobile = useMobile();
    const styles: StylesConfig<PeriodDropdownOption, false> = {
        container: base => ({
            ...base,
            width: isMobile ? 100 : 150,
            ...containerStyle
        }),
        control: base => ({
            ...base,
            ...controlStyle
        })
    }

    return (
        <Select menuPlacement="auto"
                menuPosition="fixed"
                isSearchable={false}
                onChange={(option: PeriodDropdownOption | null) => {
                    if (option) {
                        setPeriod(option.value);
                    }
                }}
                value={options.find(option => option.value === period)}
                options={options}
                theme={theme => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        neutral0: 'black',
                        neutral80: 'white',
                        primary25: '#003987',
                        primary50: '#0058cb',
                    }
                })}
                styles={styles}/>
    );
}

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

function formatDate(interval: TimePeriod, date: Date) {
    return date.toLocaleString('en-GB', INTERVAL_TO_FORMAT.get(interval));
}

function PeriodSelector({period, startDatetime, setPrevious, setNext}: { period: SelectableTimePeriod, startDatetime: Date, setPrevious: () => void, setNext: () => void }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
        }}>
            <Hover style={{borderRadius: '50%'}}>
                        <span className='material-symbols-outlined'
                              onClick={() => setPrevious()}
                              style={{
                                  userSelect: "none",
                                  fontSize: 28,
                                  padding: 4,
                              }}>chevron_left</span>
            </Hover>
            <div style={{width: 100, textAlign: 'center'}}>
                {formatDate(period, startDatetime)}
            </div>
            <Hover style={{borderRadius: '50%'}}>
                        <span className='material-symbols-outlined'
                              onClick={() => setNext()}
                              style={{
                                  userSelect: "none",
                                  fontSize: 28,
                                  padding: 4,
                              }}>chevron_right</span>
            </Hover>
        </div>
    );
}

function ChartContainer({children}: { children: ReactNode }) {
    return (
        <div style={{
            position: "relative",
            flex: '1',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            background: '#27293D',
            color: '#D3D1D8',
            borderRadius: 16,
            margin: 8,
            padding: '16px 0',
        }}>
            {children}
        </div>
    )
}

function ChartTitle({children}: { children: ReactNode }) {
    const isMobile = useMobile();
    return (
        <span style={{
            fontSize: isMobile ? 20 : 24,
            padding: '0 0 0 32px',
        }}>{children}</span>
    );
}

function DeviceCount({onlineCount}: { onlineCount: Number }) {
    const isMobile = useMobile();
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: isMobile ? 24 : 32,
            padding: '0 0 16px 24px',
            color: '#61dafb',
        }}>
                <span className='material-symbols-outlined' style={{
                    fontSize: isMobile ? 24 : 32,
                    margin: 8,
                }}>computer</span>
            <span style={{
                margin: 8,
            }}>{onlineCount.toString()}</span>
        </div>
    );
}

export {Hover, PeriodDropdown, ChartContainer, getPeriodStartDatetime, getPeriodPreviousDatetime, getPeriodNextDatetime, PeriodSelector, ChartTitle, DeviceCount};
export type { SelectableTimePeriod };
