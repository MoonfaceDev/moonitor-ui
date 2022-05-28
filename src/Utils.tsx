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
    Minute = 60,
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
    [TimePeriod.Minute, {hour: '2-digit', minute: '2-digit'}],
]);

type PortInfo = {
    port: number,
    service: string
}

type Device = {
    last_online: Date
    name: string,
    type: string
    ip: string,
    hostname: string,
    mac: string,
    vendor: string,
    open_ports: PortInfo[]
}

type SpoofedDevice = {
    mac: string,
    ip: string,
    forward: boolean
}

const DEFAULT_DEVICE: Device = {
    last_online: new Date(),
    name: '',
    type: '',
    ip: '',
    hostname: '',
    mac: '',
    vendor: '',
    open_ports: []
};

const DEFAULT_SPOOFED_DEVICE: SpoofedDevice = {
    mac: '',
    ip: '',
    forward: false
};

const useChangeEffect = (func: EffectCallback, deps: DependencyList) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) return func();
        didMount.current = true;
    }, deps);
}

function useTimeout(func: () => void, time: number, deps?: DependencyList | undefined) {
    useEffect(() => {
        const intervalID = window.setTimeout(func, time);
        return () => window.clearTimeout(intervalID);
    }, deps);
}

function useInterval(func: () => void, timeInterval: number, deps?: DependencyList | undefined) {
    useEffect(() => {
        func();
        const intervalID = window.setInterval(func, timeInterval);
        return () => window.clearInterval(intervalID);
    }, deps);
}

function getTokenExpirationDelta() {
    const user = localStorage.user;
    const token = JSON.parse(user).access_token;
    const exp = JSON.parse(atob(token.split('.')[1])).exp;
    return exp * 1000 - Date.now();
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
    useTimeout,
    useInterval,
    getTokenExpirationDelta,
    TimePeriod,
    INTERVAL_TO_FORMAT,
    sortDevices,
    isOnline,
    getLastSeenTime,
    DEFAULT_DEVICE,
    DEFAULT_SPOOFED_DEVICE
};
export type {PortInfo, Device, SpoofedDevice};
