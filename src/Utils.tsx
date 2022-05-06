import {useMediaQuery} from "react-responsive";
import moment from "moment";
import {DependencyList, EffectCallback, useEffect, useRef} from "react";

function useMobile() {
    return useMediaQuery({query: `(max-width: 760px)`});
}

enum TimePeriod {
    Year = 365 * 24 * 60 * 60,
    Month = 30 * 24 * 60 * 60,
    Week = 7 * 24 * 60 * 60,
    Day = 24 * 60 * 60,
    FourHours = 4 * 60 * 60,
    Hour = 60 * 60,
    TwentyMinutes = 20 * 60,
    FiveMinutes = 5 * 60,
}

type NetworkEntity = {
    ip: string,
    mac: string,
    hostname: string,
    name: string,
    type: string
    vendor: string,
    open_ports: [number, string][]
}

type Device = {
    entity: NetworkEntity,
    last_online: Date
}

type SpoofedDevice = {
    mac: string,
    ip: string,
    forward: boolean
}

const DEFAULT_DEVICE: Device = {
    entity: {ip: '', mac: '', hostname: '', name: '', type: '', vendor: '', open_ports: []},
    last_online: new Date()
};
const DEFAULT_SPOOFED_DEVICE: SpoofedDevice = {mac: '', ip: '', forward: false};

const useChangeEffect = (func: EffectCallback, deps: DependencyList) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
}

function useInterval(func: () => void, timeInterval: number, deps?: DependencyList | undefined) {
    useEffect(() => {
        func();
        const intervalID = window.setInterval(func, timeInterval);
        return () => window.clearInterval(intervalID);
    }, deps);
}

const ONLINE_THRESHOLD = 10 * 60 * 1000;

function sortDevices(devices: Device[]) {
    return devices.sort((entity1, entity2) => {
        return entity2.last_online.getTime() - entity1.last_online.getTime();
    });
}

function isOnline(device: Device) {
    return Date.now() - device.last_online.getTime() < ONLINE_THRESHOLD;
}

function getLastSeenTime(device: Device) {
    return moment(device.last_online).calendar({
        sameDay: '[today at] HH:mm',
        lastDay: '[yesterday at] HH:mm',
        lastWeek: 'ddd HH:mm',
        sameElse: 'DD/MM/YYYY'
    });
}

export {
    useMobile,
    useChangeEffect,
    useInterval,
    TimePeriod,
    sortDevices,
    isOnline,
    getLastSeenTime,
    DEFAULT_DEVICE,
    DEFAULT_SPOOFED_DEVICE
};
export type {NetworkEntity, Device, SpoofedDevice};
