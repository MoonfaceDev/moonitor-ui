type SpoofedDevice = {
    mac: string,
    ip: string,
    forward: boolean
}

const DEFAULT_SPOOFED_DEVICE: SpoofedDevice = {
    mac: '',
    ip: '',
    forward: false
};

export {DEFAULT_SPOOFED_DEVICE};
export type {SpoofedDevice};