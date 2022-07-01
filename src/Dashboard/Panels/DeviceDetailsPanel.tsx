import React, {CSSProperties, useContext, useEffect, useState} from "react";
import {Bar, BarChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis} from "recharts";
import {fetchUptimeHistory} from "../../APIRequests";
import {NameType, ValueType} from "recharts/types/component/DefaultTooltipContent";
import Loading from "../../Components/Loading/Loading";
import '../BulletList.css';
import {Device, getLastSeenTime, isOnline} from "../../Common/Device";
import {DEFAULT_SPOOFED_DEVICE, SpoofedDevice} from "../../Common/SpoofedDevice";
import {formatDate, formatInterval, TimePeriod} from "../../Common/TimePeriod";
import useMobile from "../../Common/Hooks/Mobile";
import useEscape from "../../Common/Hooks/Escape";
import Hover from "../../Components/Hover";
import PeriodSelector, {
    getPeriodNextDatetime,
    getPeriodStartDatetime,
    SelectableTimePeriod
} from "../../Components/TimePeriod/PeriodSelector";
import PeriodDropdown from "../../Components/TimePeriod/PeriodDropdown";
import DialogBox from "../../Components/Dialog/DialogBox";
import DialogHeader from "../../Components/Dialog/DialogHeader";
import VisibleContext from "../../Common/Contexts/Visible";
import useDateState from "../../Common/Hooks/DateState";
import useChangeEffect from "../../Common/Hooks/ChangeEffect";

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

const PERIOD_OPTIONS = [
    {label: 'Month', value: TimePeriod.Month},
    {label: 'Week', value: TimePeriod.Week},
    {label: 'Day', value: TimePeriod.Day},
    {label: 'Hour', value: TimePeriod.Hour},
]

const PERIOD_TO_INTERVAL = new Map([
    [TimePeriod.Year, TimePeriod.Month],
    [TimePeriod.Month, TimePeriod.Day],
    [TimePeriod.Week, TimePeriod.Day],
    [TimePeriod.Day, TimePeriod.Hour],
    [TimePeriod.Hour, TimePeriod.Minute],
]);

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
                <div style={{color: '#b3e5fc'}}>uptime: {formatInterval(interval, payload[0].value)}</div>
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
    const visible = useContext(VisibleContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [history, setHistory] = useState<{ time: Date, uptime: number }[]>([]);
    const [period, setPeriod] = useState<SelectableTimePeriod>(TimePeriod.Day);
    const [startDatetime, setStartDatetime] = useDateState(new Date());
    const [endDatetime, setEndDatetime] = useDateState(new Date());
    const [interval, setInterval] = useState<TimePeriod>(TimePeriod.Hour);

    function setPeriodAndInterval(period: TimePeriod) {
        setPeriod(period);
        const interval = PERIOD_TO_INTERVAL.get(period);
        if (interval) {
            setInterval(interval);
        }
        const newStartDatetime = getPeriodStartDatetime(period);
        setStartDatetime(newStartDatetime);
        setEndDatetime(getPeriodNextDatetime(newStartDatetime, period));
    }

    useEffect(() => {
        setPeriodAndInterval(TimePeriod.Day);
    }, [mac]);

    const updateUptimeHistory = () => {
        setLoading(true);
        fetchUptimeHistory(mac, startDatetime, endDatetime, interval)
            .then(result => {
                setHistory(result);
                setLoading(false);
            });
    }

    useChangeEffect(() => {
        if (!visible) {
            return;
        }
        updateUptimeHistory();
    }, [mac, startDatetime, endDatetime, interval, visible]);

    const barClickCallback = (value: Date) => {
        if (interval === TimePeriod.Minute) {
            return;
        }
        const newPeriod = interval;
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
                                        setPeriod={setPeriodAndInterval} options={PERIOD_OPTIONS} height={32}
                                        arrowSize={18}/>
                        <PeriodSelector style={{margin: isMobile ? '0 4px' : '0 8px'}} period={period}
                                        startDatetime={startDatetime} setStartDatetime={setStartDatetime}
                                        endDatetime={endDatetime} setEndDatetime={setEndDatetime}
                                        height={32} iconFontSize={22}/>
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
    setSpoofedDevice: (spoofedDevice: SpoofedDevice) => void
}) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 4,
            // @ts-ignore
            overflowY: 'overlay',
            overflowX: 'hidden',
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