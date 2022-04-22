import {NetworkEntity, TimePeriod} from "../Utils";
import Select, {StylesConfig} from "react-select";
import React, {ReactNode, useEffect, useState} from "react";
import {fetchLastScan} from "./APIRequests";

function PeriodDropdown({period, setPeriod}: { period: TimePeriod, setPeriod: (period: TimePeriod) => void }) {
    type Option = { label: string, value: TimePeriod };
    const styles: StylesConfig<Option, false> = {
        container: () => ({
            position: 'absolute',
            right: 32,
            width: 150,
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
            flexBasis: 0,
            flexGrow: 1,
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
    return (
        <span style={{
            fontSize: 24,
            padding: '0 0 0 32px',
        }}>{children}</span>
    );
}

function DeviceCount() {
    const [lastScan, setLastScan] = useState<NetworkEntity[]>([]);
    useEffect(() => {
        fetchLastScan()
            .then(result => {
                setLastScan(result);
            })
    }, []);
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 32,
            padding: '0 0 16px 24px',
            color: '#61dafb',
        }}>
                <span className='material-symbols-outlined' style={{
                    fontSize: 32,
                    margin: 8,
                }}>computer</span>
            <span style={{
                margin: 8,
            }}>{lastScan.length}</span>
        </div>
    );
}

export {PeriodDropdown, ChartContainer, ChartTitle, DeviceCount};