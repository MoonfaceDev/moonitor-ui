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
    device: {
        mac: string,
        name: string,
        type: string
    }
    vendor: string,
    open_ports: number[]
}

export {TimePeriod};
export type {NetworkEntity};
