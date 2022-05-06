import {
    DEFAULT_SPOOFED_DEVICE,
    Device,
    getLastSeenTime,
    isOnline,
    SpoofedDevice,
    useChangeEffect,
    useMobile
} from "../../Utils";
import React, {ReactNode, useEffect, useState} from "react";
import {Hover} from "../Components";

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
                device.entity.open_ports.map(open_port => {
                    return <DetailRow key={open_port[0]} label={open_port[0].toString()} value={open_port[1]}/>
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
    const selfMac = device.entity.mac;
    const selfIP = device.entity.ip;
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

function DetailsContent({device, spoofedDevice, setSpoofedDevice}: {
    device: Device,
    spoofedDevice: SpoofedDevice,
    setSpoofedDevice: (spoofedDevice: SpoofedDevice) => void,
}) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 4
        }}>
            <OnlineRow device={device}/>
            <hr style={{
                flexGrow: 1,
                margin: 16
            }}/>
            <ConditionalDetailRow label='IP Address' value={device.entity.ip}/>
            <ConditionalDetailRow label='Hostname' value={device.entity.hostname}/>
            <ConditionalDetailRow label='MAC Address' value={device.entity.mac}/>
            <ConditionalDetailRow label='MAC Vendor' value={device.entity.vendor}/>
            {
                device.entity.open_ports.length > 0 ?
                    <>
                        <hr style={{
                            flexGrow: 1,
                            margin: 16
                        }}/>
                        <OpenPortsDetail device={device}/>
                    </>
                    : null
            }
            <hr style={{
                flexGrow: 1,
                margin: 16
            }}/>
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
            <DetailsHeader title={device.entity.name} closePanel={closePanel}/>
            <DetailsContent device={device} spoofedDevice={spoofedDevice} setSpoofedDevice={setSpoofedDevice}/>
        </DialogBox>
    );
}

export default DeviceDetailsPanel;