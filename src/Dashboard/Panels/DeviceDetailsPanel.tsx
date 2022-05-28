import {
    DEFAULT_SPOOFED_DEVICE,
    Device,
    getLastSeenTime,
    INTERVAL_TO_FORMAT,
    isOnline,
    SpoofedDevice,
    TimePeriod,
    useChangeEffect,
    useMobile
} from "../../Utils";
import React, {ReactNode, useEffect, useState} from "react";
import {
    getPeriodNextDatetime,
    getPeriodPreviousDatetime,
    getPeriodStartDatetime,
    Hover,
    PeriodDropdown,
    PeriodSelector,
    SelectableTimePeriod
} from "../Components";
import {Bar, BarChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis} from "recharts";
import {fetchUptimeHistory} from "../../APIRequests";
import {POLL_INTERVAL} from "../../config";
import {NameType, ValueType} from "recharts/types/component/DefaultTooltipContent";
import Loading from "../../Loading/Loading";

function DetailsHeader({title, closePanel}: { title: string, closePanel: () => void }) {
    return (
        <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
        }}>
            <span style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '8px 56px',
                color: 'white',
                fontSize: 20,
                textAlign: 'center',
                width: "100%",
            }}>
                        <b>{title}</b>
                    </span>
            <Hover style={{margin: 8, borderRadius: '50%', zIndex: 1}}>
                        <span className='material-symbols-outlined'
                              onClick={() => closePanel()}
                              style={{
                                  userSelect: "none",
                                  fontSize: 32,
                                  padding: 4,
                              }}>close</span>
            </Hover>
        </div>
    );
}

function DialogBox({children, visible}: { children: ReactNode, visible: boolean }) {
    const isMobile = useMobile();
    const [zIndex, setZIndex] = useState(-1);
    useChangeEffect(() => {
        if (visible) {
            setZIndex(1);
        } else {
            setTimeout(() => {
                setZIndex(-1);
            }, 150);
        }
    }, [visible]);
    return (
        <div style={{
            opacity: visible ? 1 : 0,
            zIndex: zIndex,
            display: 'flex',
            transition: 'opacity 0.15s linear',
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            background: 'rgba(255,255,255,0.5)',
            padding: 16
        }}>
            <div style={{
                transition: 'transform 0.3s ease-out',
                transform: visible ? 'none' : 'translate(0, -50px)',
                display: "flex",
                flexDirection: "column",
                background: '#27293D',
                width: isMobile ? 360 : 500,
                borderRadius: 16,
                color: "white",
                maxHeight: '100%',
            }}>
                {children}
            </div>
        </div>
    );
}

function OnlineRow({device}: { device: Device }) {
    const online = isOnline(device);
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center'
        }}>
            <div style={{
                background: online ? '#00B050' : '#FF6B6B',
                borderRadius: '50%',
                width: 16,
                height: 16,
                margin: '4px 16px'
            }}/>
            <span>{online ? 'Online' : 'Last seen ' + getLastSeenTime(device)}</span>
        </div>
    );
}

function DetailRow({label, value}: { label: string, value: string }) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            margin: '4px 16px'
        }}>
            <span>{label}</span>
            <span>{value}</span>
        </div>
    );
}

function ConditionalDetailRow({label, value}: { label: string, value: string }) {
    return (
        value
            ? <DetailRow label={label} value={value}/>
            : null
    )
}

function OpenPortsDetail({device}: { device: Device }) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
        }}>
            <span style={{
                margin: '0 16px',
                textAlign: "center",
            }}>Open Ports</span>
            {
                device.open_ports.map(open_port => {
                    return <DetailRow key={open_port.port} label={open_port.port.toString()} value={open_port.service}/>
                })
            }
        </div>
    );
}

function ActionButton({label, disable, active, onToggle}: { label: string, disable: boolean, active: boolean, onToggle: () => void }) {
    return (
        <div className="material-symbols-outlined"
             onClick={() => {
                 if (!disable) {
                     onToggle();
                 }
             }}
             style={{
                 background: disable ? '#5b5c78' : active ? 'linear-gradient(180deg, rgba(60,63,94,1) 0%, rgba(0,209,255,1) 100%)' : '#3C3F5E',
                 flexGrow: 1,
                 borderRadius: 12,
                 margin: 8,
                 textAlign: "center",
                 fontSize: 28,
                 userSelect: "none",
                 color: disable ? '#D3D1D8' : 'white',
             }}>
            <Hover disabled={disable} style={{
                padding: 12,
                borderRadius: 12,
            }}>
                {label}
            </Hover>
        </div>
    );
}

function ActionsRow({device, spoofedDevice, setSpoofedDevice}: {
    device: Device,
    spoofedDevice: SpoofedDevice,
    setSpoofedDevice: (spoofedDevice: SpoofedDevice) => void,
}) {
    const selfMac = device.mac;
    const selfIP = device.ip;
    const isSelf = spoofedDevice.mac === selfMac;
    const disable = !isSelf && spoofedDevice.mac !== '';

    function getSpoofedDeviceToSet(forward: boolean) {
        if (isSelf) {
            return DEFAULT_SPOOFED_DEVICE;
        } else {
            return {mac: selfMac, ip: selfIP, forward: forward}
        }
    }

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            padding: 8,
        }}>
            <ActionButton label='wifi_off' disable={disable} active={isSelf && !spoofedDevice.forward}
                          onToggle={() => setSpoofedDevice(getSpoofedDeviceToSet(false))}/>
            <ActionButton label='travel_explore' disable={disable} active={isSelf && spoofedDevice.forward}
                          onToggle={() => setSpoofedDevice(getSpoofedDeviceToSet(true))}/>
        </div>
    );
}

const FORMAT_UNITS = new Map<TimePeriod, { value: TimePeriod, label: string }[]>([
    [TimePeriod.Month, [{value: TimePeriod.Day, label: 'days'}, {value: TimePeriod.Hour, label: 'hr'}]],
    [TimePeriod.Week, [{value: TimePeriod.Day, label: 'days'}, {value: TimePeriod.Hour, label: 'hr'}]],
    [TimePeriod.Day, [{value: TimePeriod.Hour, label: 'hr'}, {value: TimePeriod.Minute, label: 'min'}]],
    [TimePeriod.Hour, [{value: TimePeriod.Minute, label: 'min'}]],
    [TimePeriod.Minute, [{value: TimePeriod.Minute, label: 'min'}]],
]);

const PERIOD_OPTIONS = [
    {label: 'Month', value: TimePeriod.Month},
    {label: 'Week', value: TimePeriod.Week},
    {label: 'Day', value: TimePeriod.Day},
    {label: 'Hour', value: TimePeriod.Hour},
]

function formatUptime(scalePeriod: TimePeriod, timeInterval: number) {
    if (!FORMAT_UNITS.has(scalePeriod)) {
        throw Error('Unsupported time period');
    }
    const units = FORMAT_UNITS.get(scalePeriod);
    const sizeUnitStrings: string[] = [];
    units?.forEach(unit => {
        if (timeInterval > unit.value) {
            const unitSize = (timeInterval / unit.value) | 0;
            sizeUnitStrings.push(`${unitSize} ${unit.label}`);
            timeInterval -= unitSize * unit.value;
        }
    });
    if (sizeUnitStrings.length === 0) {
        return `0${units?.[units?.length - 1].label}`;
    }
    return sizeUnitStrings.join(', ');
}

function formatDate(interval: TimePeriod, date: Date) {
    return date.toLocaleString('en-GB', INTERVAL_TO_FORMAT.get(interval));
}

function formatData(interval: TimePeriod, data: { time: Date, uptime: number }[]) {
    return data.map(item => ({
        time: formatDate(interval, item.time),
        uptime: item.uptime
    }));
}

function UptimeHistoryChart({interval, data}: { interval: TimePeriod, data: { time: Date, uptime: number }[] }) {
    const formattedData = formatData(interval, data);

    function CustomTooltip({payload, label}: TooltipProps<ValueType, NameType>) {
        if (!payload || !payload[0] || typeof (payload[0].value) !== "number") {
            return null;
        }
        if (interval === TimePeriod.Minute) {
            return null;
        }
        return (
            <div style={{background: 'rgba(0, 0, 0, 0.7)', border: '1px solid white', color: 'white', padding: 8}}>
                <div>{label}</div>
                <div style={{color: '#b3e5fc'}}>uptime: {formatUptime(interval, payload[0].value)}</div>
            </div>
        );
    }

    return (
        <ResponsiveContainer width='100%' height={100}>
            <BarChart data={formattedData} margin={{top: 20, right: 30, left: 30, bottom: -10}}>
                <defs>
                    <linearGradient id='fillColor' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#00D1FF' stopOpacity={0.3}/>
                        <stop offset='95%' stopColor='#00D1FF' stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey='time' fontSize={12} interval='preserveStart'/>
                <Tooltip animationDuration={100} contentStyle={{background: 'rgba(0, 0, 0, 0.7)'}}
                         labelStyle={{color: 'white'}} itemStyle={{color: '#b3e5fc'}} content={<CustomTooltip/>}/>
                <Bar name='Uptime' dataKey='uptime' stroke='#8884d8' fillOpacity={1}
                     fill='url(#fillColor)'/>
            </BarChart>
        </ResponsiveContainer>
    );
}

function UptimeHistory({mac}: { mac: string }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [history, setHistory] = useState<{ time: Date, uptime: number }[]>([]);
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

    useEffect(() => {
        setPeriodAndInterval(TimePeriod.Day);
    }, [mac]);

    function setPeriodAndInterval(period: TimePeriod) {
        setPeriod(period);
        const units = FORMAT_UNITS.get(period);
        if (units && units[0]) {
            setInterval(units[0].value);
        }
        const newStartDatetime = getPeriodStartDatetime(period);
        setStartDatetime(newStartDatetime);
        setEndDatetime(getPeriodNextDatetime(newStartDatetime, period));
    }

    const updateUptimeHistory = (blocking: boolean) => {
        if (blocking) {
            setLoading(true);
        }
        fetchUptimeHistory(mac, startDatetime, endDatetime, interval)
            .then(result => {
                setHistory(result);
                setLoading(false);
            });
    }

    useChangeEffect(() => {
        updateUptimeHistory(true);
        const intervalID = window.setTimeout(() => {
            updateUptimeHistory(false);
        }, POLL_INTERVAL);
        return () => window.clearTimeout(intervalID);
    }, [mac, startDatetime, endDatetime, interval]);
    return (
        <>
            <Loading visible={loading}/>
            <div style={{
                display: "flex",
                flexDirection: "column",
            }}>
            <span style={{
                margin: '0 16px',
                textAlign: "center",
            }}>Uptime</span>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 30px',
                }}>
                    <PeriodDropdown period={period} setPeriod={setPeriodAndInterval} options={PERIOD_OPTIONS}/>
                    <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
                        <PeriodSelector period={period} startDatetime={startDatetime} setPrevious={setPrevious}
                                        setNext={setNext}/>
                    </div>
                </div>
                <UptimeHistoryChart interval={interval} data={history}/>
            </div>
        </>
    );
}

function Divider() {
    return (
        <hr style={{
            flexGrow: 1,
            margin: 16
        }}/>
    );
}

function DetailsContent({device, spoofedDevice, setSpoofedDevice}: {
    device: Device,
    spoofedDevice: SpoofedDevice,
    setSpoofedDevice: (spoofedDevice: SpoofedDevice) => void,
}) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 4,
            overflowY: 'auto'
        }}>
            <OnlineRow device={device}/>
            <Divider/>
            <span style={{
                margin: '0 16px',
                textAlign: "center",
            }}>Network Details</span>
            <ConditionalDetailRow label='IP Address' value={device.ip}/>
            <ConditionalDetailRow label='Hostname' value={device.hostname}/>
            <ConditionalDetailRow label='MAC Address' value={device.mac}/>
            <ConditionalDetailRow label='MAC Vendor' value={device.vendor}/>
            {
                device.open_ports.length > 0 ?
                    <>
                        <Divider/>
                        <OpenPortsDetail device={device}/>
                    </>
                    : null
            }
            {
                device.mac.length > 0 ?
                    <>
                        <Divider/>
                        <UptimeHistory mac={device.mac}/>
                    </>
                    : null
            }
            <Divider/>
            <ActionsRow device={device} spoofedDevice={spoofedDevice} setSpoofedDevice={setSpoofedDevice}/>
        </div>
    );
}

function DeviceDetailsPanel({device, spoofedDevice, setSpoofedDevice, visible, closePanel}: {
    device: Device,
    spoofedDevice: SpoofedDevice,
    setSpoofedDevice: (spoofedDevice: SpoofedDevice) => void,
    visible: boolean,
    closePanel: () => void
}) {
    useEffect(() => {
        const close = (event: { keyCode: number; }) => {
            if (event.keyCode === 27) {
                closePanel();
            }
        }
        if (visible) {
            window.addEventListener('keydown', close);
        } else {
            window.removeEventListener('keydown', close);
        }
        return () => window.removeEventListener('keydown', close);
    }, [visible]);
    return (
        <DialogBox visible={visible}>
            <DetailsHeader title={device.name} closePanel={closePanel}/>
            <DetailsContent device={device} spoofedDevice={spoofedDevice} setSpoofedDevice={setSpoofedDevice}/>
        </DialogBox>
    );
}

export default DeviceDetailsPanel;