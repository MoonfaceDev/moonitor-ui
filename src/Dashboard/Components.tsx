import {TimePeriod, useMobile} from "../Utils";
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

function PeriodDropdown({period, setPeriod}: { period: TimePeriod, setPeriod: (period: TimePeriod) => void }) {
    const isMobile = useMobile();
    type Option = { label: string, value: TimePeriod };
    const styles: StylesConfig<Option, false> = {
        container: () => ({
            position: 'absolute',
            right: 32,
            width: isMobile ? 100 : 150,
        }),
    }
    const options = [
        {label: 'Year', value: TimePeriod.Year},
        {label: 'Month', value: TimePeriod.Month},
        {label: 'Week', value: TimePeriod.Week},
        {label: 'Day', value: TimePeriod.Day},
        {label: '4 Hours', value: TimePeriod.FourHours},
        {label: 'Hour', value: TimePeriod.Hour},
    ]

    return (
        <Select menuPlacement="auto"
                onChange={(option: Option | null) => {
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

export {Hover, PeriodDropdown, ChartContainer, ChartTitle, DeviceCount};