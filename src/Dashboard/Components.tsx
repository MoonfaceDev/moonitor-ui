import {INTERVAL_TO_FORMAT, TimePeriod, useChangeEffect, useMobile} from "../Utils";
import Select, {components, GroupBase, StylesConfig} from "react-select";
import React, {CSSProperties, ReactNode, useState} from "react";
import {DropdownIndicatorProps} from "react-select/dist/declarations/src/components/indicators";
import {PolarAngleAxis, RadialBar, RadialBarChart} from "recharts";

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


function PeriodDropdown({period, setPeriod, options, containerStyle, controlStyle, height = 40, arrowSize = 20}: { period: TimePeriod, setPeriod: (period: TimePeriod) => void, options: PeriodDropdownOption[], containerStyle?: CSSProperties | undefined, controlStyle?: CSSProperties | undefined, height?: number | undefined, arrowSize?: number | undefined }) {
    const isMobile = useMobile();
    const styles: StylesConfig<PeriodDropdownOption, false> = {
        container: base => ({
            ...base,
            width: isMobile ? 80 : 120,
            height: height,
            ...containerStyle
        }),
        control: base => ({
            ...base,
            borderRadius: 20,
            border: 'solid 1px #0058cb',
            minHeight: height,
            height: height,
            ...controlStyle,
        }),
        menu: base => ({
            ...base,
            background: '#000000'
        }),
        valueContainer: base => ({
            ...base,
            height: height,
        })
    }

    const DropdownIndicator = (props: DropdownIndicatorProps<PeriodDropdownOption, false, GroupBase<PeriodDropdownOption>>) => {
        return (
            components.DropdownIndicator && (
                <components.DropdownIndicator {...props}>
                    <div className="material-symbols-outlined" style={{
                        width: arrowSize,
                        height: arrowSize,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        expand_more
                    </div>
                </components.DropdownIndicator>
            )
        );
    };

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
                        neutral0: '#27293D',
                        neutral5: '#2684ff',
                        neutral10: '#2684ff',
                        neutral20: '#2684ff',
                        neutral30: '#2684ff',
                        neutral40: '#2684ff',
                        neutral50: '#2684ff',
                        neutral60: '#2684ff',
                        neutral70: '#2684ff',
                        neutral80: '#2684ff',
                        neutral90: '#2684ff',
                        primary25: '#161616',
                        primary50: '#2c2c2c',
                        primary: '#2684ff',
                    }
                })}
                styles={styles}
                components={{IndicatorSeparator: null, DropdownIndicator}}/>
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

function PeriodSelector({period, startDatetime, setPrevious, setNext, style, height = 38, iconFontSize = 28}: { period: SelectableTimePeriod, startDatetime: Date, setPrevious: () => void, setNext: () => void, style?: CSSProperties | undefined, height?: number | undefined, iconFontSize?: number | undefined }) {
    const isMobile = useMobile();
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

function PanelContainer({children, style}: { children: ReactNode, style?: CSSProperties | undefined }) {
    return (
        <div style={{
            position: 'relative',
            flex: '1 0',
            minWidth: 0,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            background: '#27293D',
            color: '#D3D1D8',
            borderRadius: 16,
            margin: 8,
            ...style
        }}>
            {children}
        </div>
    )
}

function ChartTitle({children, style}: { children: ReactNode, style?: CSSProperties | undefined }) {
    const isMobile = useMobile();
    return (
        <span style={{
            fontSize: isMobile ? 20 : 24,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            padding: '0 0 0 32px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            ...style
        }}>{children}</span>
    );
}

function ProgressBar({value, maxValue}: { value: number, maxValue: number }) {
    const chartData = [{value: value}];
    return (
        <RadialBarChart width={48}
                        height={48}
                        cx='50%'
                        cy='50%'
                        innerRadius={21}
                        outerRadius={27}
                        barSize={4}
                        startAngle={90}
                        endAngle={-270}
                        data={chartData}
        >
            <PolarAngleAxis
                type="number"
                domain={[0, maxValue]}
                angleAxisId={0}
                tick={false}
            />
            <RadialBar
                background={{fill: '#3c3f5e'}}
                dataKey='value'
                cornerRadius={24}
                fill='rgb(97, 218, 251)'
                isAnimationActive={false}
            >
            </RadialBar>
            <text
                x="50%"
                y="50%"
                fill="white"
                fontSize={12}
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {Math.min(value / maxValue * 100, 100).toFixed(0) + '%'}
            </text>
        </RadialBarChart>
    )
}

function DialogBox({children, visible}: { children: ReactNode, visible: boolean }) {
    const isMobile = useMobile();
    const [zIndex, setZIndex] = useState(-1);
    useChangeEffect(() => {
        if (visible) {
            setZIndex(1);
        } else {
            setTimeout(() => {
                setZIndex(-1);
            }, 150);
        }
    }, [visible]);
    return (
        <div style={{
            opacity: visible ? 1 : 0,
            zIndex: zIndex,
            display: 'flex',
            transition: 'opacity 0.15s linear',
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            background: 'rgba(255,255,255,0.5)',
            padding: 16
        }}>
            <div style={{
                transition: 'transform 0.3s ease-out',
                transform: visible ? 'none' : 'translate(0, -50px)',
                display: "flex",
                flexDirection: "column",
                background: '#27293D',
                width: isMobile ? 360 : 500,
                borderRadius: 16,
                color: "white",
                maxHeight: '100%',
            }}>
                {children}
            </div>
        </div>
    );
}

function DialogHeader({title, onCancel, onConfirm}: { title: string, onCancel?: () => void, onConfirm?: () => void }) {
    return (
        <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
        }}>
            <span style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '8px 56px',
                color: 'white',
                fontSize: 20,
                textAlign: 'center',
                width: "100%",
            }}>
                        <b>{title}</b>
                    </span>
            {
                onCancel === undefined ? null :
                    <Hover style={{margin: 8, borderRadius: '50%', zIndex: 1}}>
                        <span className='material-symbols-outlined'
                              onClick={() => onCancel()}
                              style={{
                                  userSelect: "none",
                                  fontSize: 32,
                                  padding: 4,
                              }}>close</span>
                    </Hover>
            }
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                {
                    onConfirm === undefined ? null :
                        <Hover style={{margin: 8, borderRadius: '50%', zIndex: 1}}>
                        <span className='material-symbols-outlined'
                              onClick={() => onConfirm()}
                              style={{
                                  userSelect: "none",
                                  fontSize: 32,
                                  padding: 4,
                              }}>done</span>
                        </Hover>
                }
            </div>
        </div>
    );
}

export {
    Hover,
    PeriodDropdown,
    PanelContainer,
    getPeriodStartDatetime,
    getPeriodPreviousDatetime,
    getPeriodNextDatetime,
    PeriodSelector,
    ChartTitle,
    ProgressBar,
    DialogBox,
    DialogHeader
};
export type {SelectableTimePeriod};
