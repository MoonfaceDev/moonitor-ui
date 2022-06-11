import moment from "moment";

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

const ONLINE_THRESHOLD = 10 * 60 * 1000;

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

function sortDevices(devices: Device[]) {
    return devices.sort((entity1, entity2) => {
        return entity2.last_online.getTime() - entity1.last_online.getTime();
    });
}

export {DEFAULT_DEVICE, isOnline, getLastSeenTime, sortDevices};
export type {PortInfo, Device};