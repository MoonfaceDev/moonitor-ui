import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React, {useEffect, useState} from "react";
import {INTERVAL_TO_FORMAT, TimePeriod, useChangeEffect, useMobile} from "../../Utils";
import {
    ChartContainer,
    ChartTitle,
    getPeriodNextDatetime,
    getPeriodPreviousDatetime,
    getPeriodStartDatetime,
    PeriodDropdown,
    PeriodSelector,
    SelectableTimePeriod,
} from "../Components";
import {fetchHistory} from "../../APIRequests";
import {POLL_INTERVAL} from "../../config";

function formatDate(interval: TimePeriod, date: Date) {
    return date.toLocaleString('en-GB', INTERVAL_TO_FORMAT.get(interval));
}

function formatData(interval: TimePeriod, data: { time: Date, average: number }[]) {
    return data.map(item => ({time: formatDate(interval, item.time), average: item.average.toFixed(1)}))
}

function HistoryChart({interval, data}: { interval: TimePeriod, data: { time: Date, average: number }[] }) {
    const formattedData = formatData(interval, data);
    return (
        <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={formattedData} margin={{top: 10, right: 50, left: 0, bottom: 10}}>
                <defs>
                    <linearGradient id='fillColor' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#00D1FF' stopOpacity={0.15}/>
                        <stop offset='95%' stopColor='#00D1FF' stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey='time' fontSize={16} padding={{left: 20, right: 20}} tickMargin={10}
                       interval='preserveStart'/>
                <YAxis fontSize={16} padding={{top: 10, bottom: 10}} tickMargin={10}/>
                <Tooltip animationDuration={100} contentStyle={{
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: '1px solid white',
                    color: 'white',
                    padding: 8,
                    borderRadius: 8
                }}
                         labelStyle={{color: 'white'}} itemStyle={{color: '#b3e5fc'}}/>
                <Area type='monotone' name='average' dataKey='average' stroke='rgb(97, 218, 251)' strokeWidth={3}
                      fillOpacity={1}
                      fill='url(#fillColor)'/>
            </AreaChart>
        </ResponsiveContainer>
    );
}

const PERIOD_OPTIONS = [
    {label: 'Month', value: TimePeriod.Month},
    {label: 'Week', value: TimePeriod.Week},
    {label: 'Day', value: TimePeriod.Day},
    {label: 'Hour', value: TimePeriod.Hour},
]

const PERIOD_TO_INTERVAL = new Map([
    [TimePeriod.Year, TimePeriod.Month],
    [TimePeriod.Month, TimePeriod.Day],
    [TimePeriod.Week, TimePeriod.Day],
    [TimePeriod.Day, TimePeriod.Hour],
    [TimePeriod.Hour, TimePeriod.FiveMinutes],
]);

function HistoryPanel() {
    const isMobile = useMobile();
    const [history, setHistory] = useState<{ time: Date, average: number }[]>([]);
    const [period, setPeriod] = useState<SelectableTimePeriod>(TimePeriod.Day);
    const [startDatetime, setStartDatetime] = useState<Date>(new Date());
    const [endDatetime, setEndDatetime] = useState<Date>(new Date());
    const [interval, setInterval] = useState<TimePeriod>(TimePeriod.Hour);

    function setPrevious() {
        setStartDatetime(getPeriodPreviousDatetime(startDatetime, period));
        setEndDatetime(getPeriodPreviousDatetime(endDatetime, period));
    }

    function setNext() {
        setStartDatetime(getPeriodNextDatetime(startDatetime, period));
        setEndDatetime(getPeriodNextDatetime(endDatetime, period));
    }

    function setPeriodAndInterval(period: TimePeriod) {
        setPeriod(period);
        const interval = PERIOD_TO_INTERVAL.get(period);
        if (interval) {
            setInterval(interval);
        }
        const newStartDatetime = getPeriodStartDatetime(period);
        setStartDatetime(newStartDatetime);
        setEndDatetime(getPeriodNextDatetime(newStartDatetime, period));
    }

    const updateHistory = () => {
        fetchHistory(startDatetime, endDatetime, interval)
            .then(result => {
                setHistory(result);
            });
    }

    useEffect(() => {
        setPeriodAndInterval(TimePeriod.Day);
    }, []);

    useChangeEffect(() => {
        updateHistory();
        const intervalID = window.setTimeout(() => {
            updateHistory();
        }, POLL_INTERVAL);
        return () => window.clearTimeout(intervalID);
    }, [startDatetime, endDatetime, interval]);

    return (
        <ChartContainer>
            <div style={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <ChartTitle style={{flex: 1}}>Device History</ChartTitle>
                <div style={{display: 'flex', justifyContent: 'flex-end', paddingRight: 8}}>
                    <PeriodDropdown containerStyle={{margin: isMobile ? '0 4px' : '0 8px'}} period={period}
                                    setPeriod={setPeriodAndInterval} options={PERIOD_OPTIONS}/>
                    <PeriodSelector style={{margin: isMobile ? '0 4px' : '0 8px'}} period={period}
                                    startDatetime={startDatetime} setPrevious={setPrevious}
                                    setNext={setNext}/>
                </div>
            </div>
            <HistoryChart interval={interval} data={history}/>
        </ChartContainer>
    );
}

export default HistoryPanel;
