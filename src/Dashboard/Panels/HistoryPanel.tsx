import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React, {useState} from "react";
import {TimePeriod, useInterval} from "../../Utils";
import {ChartContainer, ChartTitle, DeviceCount, PeriodDropdown} from "../Components";
import {fetchHistory} from "../../APIRequests";
import {POLL_INTERVAL} from "../../config";

function formatDate(interval: TimePeriod, date: Date) {
    return date.toLocaleString('en-GB', INTERVAL_TO_FORMAT.get(interval));
}

function formatData(interval: TimePeriod, data: { time: Date, average: number }[]) {
    return data.map(item => ({time: formatDate(interval, item.time), average: item.average.toFixed(1)}))
}

const INTERVAL_TO_FORMAT = new Map<TimePeriod, Intl.DateTimeFormatOptions>([
    [TimePeriod.Year, {year: 'numeric'}],
    [TimePeriod.Month, {month: 'short', year: 'numeric'}],
    [TimePeriod.Week, {day: 'numeric', month: 'short'}],
    [TimePeriod.Day, {day: 'numeric', month: 'short'}],
    [TimePeriod.FourHours, {hour: '2-digit', minute: '2-digit'}],
    [TimePeriod.Hour, {hour: '2-digit', minute: '2-digit'}],
    [TimePeriod.TwentyMinutes, {hour: '2-digit', minute: '2-digit'}],
    [TimePeriod.FiveMinutes, {hour: '2-digit', minute: '2-digit'}],
]);

function HistoryChart({interval, data}: { interval: TimePeriod, data: { time: Date, average: number }[] }) {
    const formattedData = formatData(interval, data);
    return (
        <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={formattedData} margin={{top: 10, right: 60, left: 0, bottom: 0}}>
                <defs>
                    <linearGradient id='fillColor' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#00D1FF' stopOpacity={0.3}/>
                        <stop offset='95%' stopColor='#00D1FF' stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey='time' fontSize={12}/>
                <YAxis fontSize={12}/>
                <Tooltip animationDuration={100} contentStyle={{background: 'rgba(0, 0, 0, 0.7)'}}
                         labelStyle={{color: 'white'}} itemStyle={{color: '#b3e5fc'}}/>
                <Area type='monotone' name='average' dataKey='average' stroke='#8884d8' fillOpacity={1}
                      fill='url(#fillColor)'/>
            </AreaChart>
        </ResponsiveContainer>
    );
}

const PERIOD_TO_INTERVAL = new Map([
    [TimePeriod.Year, TimePeriod.Month],
    [TimePeriod.Month, TimePeriod.Day],
    [TimePeriod.Week, TimePeriod.Day],
    [TimePeriod.Day, TimePeriod.Hour],
    [TimePeriod.FourHours, TimePeriod.TwentyMinutes],
    [TimePeriod.Hour, TimePeriod.FiveMinutes],
]);

function HistoryPanel() {
    const [history, setHistory] = useState<{ time: Date, average: number }[]>([]);
    const [period, setPeriod] = useState<TimePeriod>(TimePeriod.Day);
    const [interval, setInterval] = useState<TimePeriod>(TimePeriod.Hour);

    function setPeriodAndInterval(period: TimePeriod) {
        setPeriod(period);
        const interval = PERIOD_TO_INTERVAL.get(period);
        if (interval) {
            setInterval(interval);
        }
    }

    useInterval(() => {
        fetchHistory(period, interval)
            .then(result => {
                setHistory(result);
            });
    }, POLL_INTERVAL, [period, interval]);
    return (
        <ChartContainer>
            <PeriodDropdown period={period} setPeriod={setPeriodAndInterval}/>
            <ChartTitle>Connected Devices</ChartTitle>
            <DeviceCount/>
            <HistoryChart interval={interval} data={history}/>
        </ChartContainer>
    );
}

export default HistoryPanel;
