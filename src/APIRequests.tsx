import {NetworkEntity, SpoofedDevice, TimePeriod} from "./Utils";

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
        return [[ 'Authorization', 'Bearer ' + user.access_token ]];
    } else {
        return [];
    }
}

async function fetchHistory(period: TimePeriod = TimePeriod.Day, interval: TimePeriod = TimePeriod.Hour): Promise<{ time: Date, average: number }[]> {
    const response = await fetch(`https://moonlan.sytes.net/history?time_period=${period}&time_interval=${interval}`, {headers: authHeader()});
    const data = await response.json();
    return data['devices'].map((item: { time: string, average: number }) => ({
        time: new Date(item.time),
        average: item.average,
    }));
}

async function fetchLastScan(): Promise<NetworkEntity[]> {
    const response = await fetch(`https://moonlan.sytes.net/last`, {headers: authHeader()});
    const data = await response.json();
    return data['entities'];
}

async function fetchDevices(): Promise<{ entity: NetworkEntity, last_online: Date }[]> {
    const response = await fetch(`https://moonlan.sytes.net/devices`, {headers: authHeader()});
    const data = await response.json();
    return data.map((device: { entity: NetworkEntity, last_online: string }) => ({
        entity: device.entity,
        last_online: new Date(device.last_online),
    }));
}

async function fetchSpoofedDevice(): Promise<SpoofedDevice> {
    const response = await fetch(`https://moonlan.sytes.net/spoofed_device`, {headers: authHeader()});
    return await response.json();
}

async function fetchSpoof(spoofedDevice: SpoofedDevice) {
    if (spoofedDevice.mac === '') {
        const response = await fetch(
            `https://moonlan.sytes.net/spoof/stop`,
            {method: 'post', headers: authHeader()}
        );
        return response.status;
    } else {
        const response = await fetch(
            `https://moonlan.sytes.net/spoof/start?ip=${spoofedDevice.ip}&mac=${spoofedDevice.mac}&forward=${spoofedDevice.forward}`,
            {method: 'post', headers: authHeader()}
        );
        return response.status;
    }
}

async function fetchCheckToken() {
    const response = await fetch(`https://moonlan.sytes.net/check_token`, {headers: authHeader()});
    return response.status === 200;
}

async function fetchLogin(email: string, password: string) {
    const data = new URLSearchParams([
        ['email', email],
        ['password', password],
    ]);
    const response = await fetch(
        `https://moonlan.sytes.net/login/token`,
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
        `https://moonlan.sytes.net/register/token`,
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

export {fetchHistory, fetchLastScan, fetchDevices, fetchSpoofedDevice, fetchSpoof, fetchCheckToken, fetchLogin, fetchRegister, APIError};