import {NetworkEntity, TimePeriod} from "../Utils";

async function fetchHistory(period: TimePeriod = TimePeriod.Day, interval: TimePeriod = TimePeriod.Hour): Promise<{ time: Date, average: number }[]> {
    const response = await fetch(`https://moonlan.sytes.net/connected_devices?time_period=${period}&time_interval=${interval}`);
    const data = await response.json();
    return data['devices'].map((item: { time: string, average: number }) => ({
        time: new Date(item.time),
        average: item.average
    }));
}

async function fetchLastScan(): Promise<NetworkEntity[]> {
    const response = await fetch(`https://moonlan.sytes.net/last`);
    const data = await response.json();
    return data['entities'];
}

export {fetchHistory, fetchLastScan};