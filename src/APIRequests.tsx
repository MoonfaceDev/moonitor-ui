import {TimePeriod} from "./Common/TimePeriod";
import {Device} from "./Common/Device";
import {SpoofedDevice} from "./Common/SpoofedDevice";

const ORIGIN = '<origin>';

class APIError extends Error {
    constructor(detail: any) {
        console.log(detail);
        if (typeof detail === "string") {
            super(detail);
        } else {
            super(`${detail[0].msg}: ${detail[0].loc[1]}`)
        }
    }
}

function authHeader() {
    const user = JSON.parse(localStorage.getItem('user') as string);
    if (user && user.access_token) {
        return [['Authorization', 'Bearer ' + user.access_token]];
    } else {
        return [];
    }
}

async function fetchUptimeHistory(mac: string, startDatetime: Date, endDatetime: Date, interval: TimePeriod = TimePeriod.Hour): Promise<{ time: Date, uptime: number }[]> {
    const response = await fetch(`${ORIGIN}/api/device/mac/${mac}/uptime?start_timestamp=${startDatetime.getTime() / 1000}&end_timestamp=${endDatetime.getTime() / 1000}&time_interval=${interval}`, {headers: authHeader()});
    const data = await response.json();
    return data.map((item: { time: string, uptime: number }) => ({
        time: new Date(item.time),
        uptime: item.uptime,
    }));
}

async function fetchHistory(startDatetime: Date, endDatetime: Date, interval: TimePeriod = TimePeriod.Hour): Promise<{ time: Date, average: number }[]> {
    const response = await fetch(`${ORIGIN}/api/device/all/history?start_timestamp=${startDatetime.getTime() / 1000}&end_timestamp=${endDatetime.getTime() / 1000}&time_interval=${interval}`, {headers: authHeader()});
    const data = await response.json();
    return data.map((item: { time: string, average: number }) => ({
        time: new Date(item.time),
        average: item.average,
    }));
}

async function fetchDevices(): Promise<Device[]> {
    const response = await fetch(`${ORIGIN}/api/device/all`, {headers: authHeader()});
    const data = await response.json();
    return data.map((device: Device) => ({
        ...device,
        last_online: new Date(device.last_online),
    }));
}

async function fetchSpoofedDevice(): Promise<SpoofedDevice> {
    const response = await fetch(`${ORIGIN}/api/spoof/device`, {headers: authHeader()});
    return await response.json();
}

async function fetchSpoof(spoofedDevice: SpoofedDevice) {
    if (spoofedDevice.mac === '') {
        const response = await fetch(
            `${ORIGIN}/api/spoof/stop`,
            {method: 'post', headers: authHeader()}
        );
        return response.status;
    } else {
        const response = await fetch(
            `${ORIGIN}/api/spoof/start?ip=${spoofedDevice.ip}&mac=${spoofedDevice.mac}&forward=${spoofedDevice.forward}`,
            {method: 'post', headers: authHeader()}
        );
        return response.status;
    }
}

async function fetchCheckToken() {
    const response = await fetch(`${ORIGIN}/api/auth/check_token`, {headers: authHeader()});
    return response.status === 200;
}

async function fetchLogin(email: string, password: string) {
    const data = new URLSearchParams([
        ['username', email],
        ['password', password],
    ]);
    const response = await fetch(
        `${ORIGIN}/api/auth/login`,
        {
            method: 'post',
            body: data,
        }
    );
    if (response.status !== 200) {
        throw new APIError((await response.json()).detail);
    }
    return await response.json();
}

async function fetchRegister(fullName: string, email: string, password: string) {
    const data = new URLSearchParams([
        ['full_name', fullName],
        ['email', email],
        ['password', password],
    ]);
    const response = await fetch(
        `${ORIGIN}/api/auth/register`,
        {
            method: 'post',
            body: data,
        }
    );
    if (response.status !== 200) {
        throw new APIError((await response.json()).detail);
    }
    return await response.json();
}

async function fetchKnownDevicesCount() {
    const response = await fetch(`${ORIGIN}/api/devices_config/count`, {headers: authHeader()});
    const data = await response.json();
    return data.count;
}

async function fetchViewDevicesConfig() {
    const response = await fetch(`${ORIGIN}/api/devices_config/view`, {headers: authHeader()});
    return await response.text();
}

async function fetchUpdateDevicesConfig(data: string) {
    const response = await fetch(
        `${ORIGIN}/api/devices_config/update`,
        {method: 'post', headers: [...authHeader(), ['Content-Type', 'application/json']], body: JSON.stringify({data: data})}
    );
    if (response.status !== 200) {
        const data = await response.text();
        throw Error(data);
    }
    return;
}

async function fetchLastScanDatetime() {
    const response = await fetch(`${ORIGIN}/api/scan_info/last_scan`, {headers: authHeader()});
    const data = await response.json();
    return new Date(data.last_scan);
}

async function fetchScanInterval() {
    const response = await fetch(`${ORIGIN}/api/scan_info/interval`, {headers: authHeader()});
    const data = await response.json();
    return (data.interval * 1000);
}

type Settings = {
    scanSettings: {
        networkSubnet: string,
        scanInterval: number,
        portsToScan: number
    },
    serverSettings: {
        tokenExpiryTime: number,
        gatewayIp: string,
        gatewayMac: string
    }
}

async function fetchSettings(): Promise<Settings> {
    const response = await fetch(`${ORIGIN}/api/settings/all`, {headers: authHeader()});
    const data = await response.json();
    return {
        scanSettings: {
            networkSubnet: data.scan_settings.network_subnet,
            scanInterval: data.scan_settings.scan_interval,
            portsToScan: data.scan_settings.ports_to_scan,
        },
        serverSettings: {
            tokenExpiryTime: data.server_settings.token_expiry_time,
            gatewayIp: data.server_settings.gateway_ip,
            gatewayMac: data.server_settings.gateway_mac,
        }
    };
}

async function fetchUpdateSettings(settings: Settings) {
    const response = await fetch(
        `${ORIGIN}/api/settings/update`,
        {method: 'post', headers: [...authHeader(), ['Content-Type', 'application/json']], body: JSON.stringify({
                scan_settings: {
                    network_subnet: settings.scanSettings.networkSubnet,
                    scan_interval: settings.scanSettings.scanInterval,
                    ports_to_scan: settings.scanSettings.portsToScan,
                },
                server_settings: {
                    token_expiry_time: settings.serverSettings.tokenExpiryTime,
                    gateway_ip: settings.serverSettings.gatewayIp,
                    gateway_mac: settings.serverSettings.gatewayMac,
                }
            })}
    );
    if (response.status !== 200) {
        const data = await response.text();
        throw Error(data);
    }
    return;
}

async function fetchRestartScanService() {
    await fetch(
        `${ORIGIN}/api/settings/restart/scan`,
        {method: 'post', headers: authHeader()}
    );
    return;
}

async function fetchRestartServerService() {
    await fetch(
        `${ORIGIN}/api/settings/restart/server`,
        {method: 'post', headers: authHeader()}
    );
    return;
}

export {
    fetchUptimeHistory,
    fetchHistory,
    fetchDevices,
    fetchSpoofedDevice,
    fetchSpoof,
    fetchCheckToken,
    fetchLogin,
    fetchRegister,
    fetchKnownDevicesCount,
    fetchViewDevicesConfig,
    fetchUpdateDevicesConfig,
    fetchLastScanDatetime,
    fetchScanInterval,
    fetchSettings,
    fetchUpdateSettings,
    fetchRestartScanService,
    fetchRestartServerService,
    APIError
};