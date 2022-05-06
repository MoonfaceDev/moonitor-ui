import React, {useEffect, useState} from "react";
import {fetchSpoof, fetchSpoofedDevice} from "../../APIRequests";
import {
    DEFAULT_SPOOFED_DEVICE,
    Device,
    getLastSeenTime,
    isOnline,
    sortDevices,
    SpoofedDevice,
    useMobile
} from "../../Utils";
import DeviceDetailsPanel from "./DeviceDetailsPanel";
import Loading from "../../Loading/Loading";
import {TYPE_TO_ICON} from "../../config";
import {Hover} from "../Components";

function DeviceView({device, spoofedDevice, setSpoofedDevice}: {
    device: Device,
    spoofedDevice: SpoofedDevice,
    setSpoofedDevice: (spoofedDevice: SpoofedDevice) => void
}) {
    const [detailsVisible, setDetailsVisible] = useState(false);
    const online = isOnline(device);
    return (
        <>
            <DeviceDetailsPanel device={device} spoofedDevice={spoofedDevice} setSpoofedDevice={setSpoofedDevice}
                                visible={detailsVisible}
                                closePanel={() => setDetailsVisible(false)}/>
            <div onClick={() => setDetailsVisible(true)}
                 style={{
                     display: 'flex',
                     background: '#27293D',
                     color: '#D3D1D8',
                     borderRadius: 16,
                     margin: 8,
                     userSelect: "none",
                 }}>
                <Hover style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexGrow: 1,
                    padding: 8,
                    borderRadius: 16,
                }}>
                    <div className='material-symbols-outlined' style={{
                        position: 'relative',
                        background: '#3C3F5E',
                        borderRadius: '50%',
                        margin: 8,
                        padding: 12,
                        fontSize: 40,
                    }}>
                        {TYPE_TO_ICON.get(device.entity.type)}
                        {
                            online ?
                                <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    bottom: 0,
                                    background: '#00B050',
                                    borderRadius: '50%',
                                    width: 16,
                                    height: 16
                                }}/>
                                : null
                        }
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: 8,
                        flexGrow: 1,
                        fontSize: 14,
                    }}>
                        <span style={{fontSize: 16}}><b>{device.entity.name}</b></span>
                        <span>{device.entity.ip}</span>
                        <span style={{marginTop: 4}}>{online ? 'Online' : 'Last seen ' + getLastSeenTime(device)}</span>
                    </div>
                </Hover>
            </div>
        </>
    );
}

function AllDevicesPanel({devices}: { devices: Device[] }) {
    const isMobile = useMobile();
    const [spoofedDevice, setSpoofedDevice] = useState<SpoofedDevice>(DEFAULT_SPOOFED_DEVICE);
    const [loadingVisible, setLoadingVisible] = useState(false);

    function setSpoofedDeviceAndSend(spoofedDevice: SpoofedDevice) {
        setLoadingVisible(true);
        fetchSpoof(spoofedDevice)
            .then(status => {
                setLoadingVisible(false);
                if (status === 200) {
                    setSpoofedDevice(spoofedDevice);
                } else {
                    alert('Spoofing has failed');
                }
            });
    }

    const sortedDevices = sortDevices(devices);

    useEffect(() => {
        fetchSpoofedDevice()
            .then(result => {
                setSpoofedDevice(result);
            })
    }, []);
    return (
        <>
            <Loading visible={loadingVisible}/>
            <div id='grid' style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr 1fr',
                gridTemplateRows: 'auto',
                position: "relative",
                margin: 8,
                padding: '16px 0',
            }}>
                {
                    sortedDevices.map(device => <DeviceView key={device.entity.mac} device={device}
                                                            spoofedDevice={spoofedDevice}
                                                            setSpoofedDevice={setSpoofedDeviceAndSend}/>)
                }
            </div>
        </>
    );
}

export default AllDevicesPanel;