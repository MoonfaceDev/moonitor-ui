import React, {CSSProperties, useEffect, useState} from "react";
import {
    DialogBox,
    DialogHeader,
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
import '../BulletList.css';
import {Device, getLastSeenTime, isOnline} from "../../Common/Device";
import {DEFAULT_SPOOFED_DEVICE, SpoofedDevice} from "../../Common/SpoofedDevice";
import {formatDate, TimePeriod} from "../../Common/TimePeriod";
import useMobile from "../../Common/Hooks/Mobile";
import useChangeEffect from "../../Common/Hooks/ChangeEffect";
import useEscape from "../../Common/Hooks/Escape";

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
        <div className="bullet-item"
             style={{
                 display: "flex",
                 justifyContent: "space-between",
             }}>
            <span>{label}</span>
            <span style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: '1 0 0',
                textAlign: 'end',
                marginLeft: 10
            }} title={value}>{value}</span>
        </div>
    );
}

function ConditionalDetailRow({label, value}: { label: string, value: string }) {
    return (
        value
            ? <DetailRow label={label} value={value}/>
            : null
    );
}

function TitleRow({title, icon, iconBackgroundColor, iconColor, style}: { title: string, icon: string, iconBackgroundColor: string, iconColor: string, style?: CSSProperties | undefined }) {
    return (
        <div style={{
            marginLeft: 16,
            fontSize: 20,
            display: 'flex',
            ...style
        }}>
            <div className='material-symbols-outlined' style={{
                background: iconBackgroundColor,
                borderRadius: 5,
                color: iconColor,
                marginRight: 10,
                padding: 5
            }}>
                {icon}
            </div>
            <span style={{
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
            }}>{title}</span>
        </div>
    );
}

function OpenPortsDetail({device}: { device: Device }) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
        }}>
            <TitleRow title="Open Ports" icon="list" iconBackgroundColor="#144C39" iconColor="#0FA470"/>
            <ul className="bullet-list">
                {
                    device.open_ports.map(open_port => {
                        return <DetailRow key={open_port.port} label={open_port.port.toString()}
                                          value={open_port.service}/>
                    })
                }
            </ul>
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

function formatData(interval: TimePeriod, data: { time: Date, uptime: number }[]) {
    return data.map(item => ({
        time: formatDate(interval, item.time),
        uptime: item.uptime
    }));
}

function UptimeHistoryChart({interval, data, barClickCallback}: { interval: TimePeriod, data: { time: Date, uptime: number }[], barClickCallback: (value: Date) => void }) {
    const formattedData = formatData(interval, data);

    function CustomTooltip({payload, label}: TooltipProps<ValueType, NameType>) {
        if (!payload || !payload[0] || typeof (payload[0].value) !== "number") {
            return null;
        }
        if (interval === TimePeriod.Minute) {
            return null;
        }
        return (
            <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid white',
                color: 'white',
                padding: 8,
                borderRadius: 8
            }}>
                <div>{label}</div>
                <div style={{color: '#b3e5fc'}}>uptime: {formatUptime(interval, payload[0].value)}</div>
            </div>
        );
    }

    const onBarClick = (bar: any) => {
        if (bar === null) {
            return;
        }
        barClickCallback(data[bar.activeTooltipIndex].time);
    }

    return (
        <ResponsiveContainer width='100%' height={100}>
            <BarChart data={formattedData} margin={{top: 20, right: 30, left: 30, bottom: -10}} onClick={onBarClick}>
                <defs>
                    <linearGradient id='fillColor' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#00D1FF' stopOpacity={0.3}/>
                        <stop offset='95%' stopColor='#00D1FF' stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey='time' fontSize={12} interval='preserveStart'/>
                <Tooltip animationDuration={100} labelStyle={{color: 'white'}} itemStyle={{color: '#b3e5fc'}}
                         content={<CustomTooltip/>}/>
                <Bar name='Uptime' dataKey='uptime' stroke='#8884d8' fillOpacity={1}
                     fill='url(#fillColor)'/>
            </BarChart>
        </ResponsiveContainer>
    );
}

function UptimeHistory({mac}: { mac: string }) {
    const isMobile = useMobile();
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

    useEffect(() => {
        setPeriodAndInterval(TimePeriod.Day);
    }, [mac]);

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

    const barClickCallback = (value: Date) => {
        if (interval === TimePeriod.Minute) {
            return;
        }
        const units = FORMAT_UNITS.get(period);
        if (!units || !units[0]) {
            return;
        }
        const newPeriod = units[0].value;
        setPeriodAndInterval(newPeriod);
        setStartDatetime(value);
        setEndDatetime(getPeriodNextDatetime(value, newPeriod));
    }

    return (
        <>
            <Loading visible={loading}/>
            <div style={{
                display: "flex",
                flexDirection: "column",
            }}>
                <div style={{
                    display: 'flex',
                }}>
                    <TitleRow title="Uptime" icon="timeline" iconBackgroundColor="#464028" iconColor="#FFF383"
                              style={{flex: 1}}/>
                    <div style={{display: 'flex', paddingRight: 8}}>
                        <PeriodDropdown containerStyle={{margin: isMobile ? '0 4px' : '0 8px'}} period={period}
                                        setPeriod={setPeriodAndInterval} options={PERIOD_OPTIONS} height={34}
                                        arrowSize={18}/>
                        <PeriodSelector style={{margin: isMobile ? '0 4px' : '0 8px'}} period={period}
                                        startDatetime={startDatetime}
                                        setPrevious={setPrevious}
                                        setNext={setNext} height={32} iconFontSize={22}/>
                    </div>
                </div>
                <UptimeHistoryChart interval={interval} data={history} barClickCallback={barClickCallback}/>
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
            // @ts-ignore
            overflowY: 'overlay',
            overflowX: 'hidden',
            '*::-webkit-scrollbar': {
                width: '0.4em'
            },
            '*::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
            },
            '*::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,.1)',
                outline: '1px solid slategrey'
            }
        }}>
            <OnlineRow device={device}/>
            <Divider/>
            <TitleRow title="Network Details" icon="wifi" iconColor="#D32B61" iconBackgroundColor="#582936"/>
            <ul className="bullet-list">
                <ConditionalDetailRow label='IP Address' value={device.ip}/>
                <ConditionalDetailRow label='Hostname' value={device.hostname}/>
                <ConditionalDetailRow label='MAC Address' value={device.mac}/>
                <ConditionalDetailRow label='MAC Vendor' value={device.vendor}/>
            </ul>
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
    useEscape(() => closePanel(), visible);
    return (
        <DialogBox visible={visible}>
            <DialogHeader title={device.name} onCancel={closePanel}/>
            <DetailsContent device={device} spoofedDevice={spoofedDevice} setSpoofedDevice={setSpoofedDevice}/>
        </DialogBox>
    );
}

export default DeviceDetailsPanel;