import React, {useEffect, useState} from "react";
import {fetchSpoof, fetchSpoofedDevice} from "../../APIRequests";
import DeviceDetailsPanel from "./DeviceDetailsPanel";
import Loading from "../../Components/Loading/Loading";
import {TYPES} from "../../config";
import {DEFAULT_DEVICE, Device, getLastSeenTime, isOnline, sortDevices} from "../../Common/Device";
import {DEFAULT_SPOOFED_DEVICE, SpoofedDevice} from "../../Common/SpoofedDevice";
import useMobile from "../../Common/Hooks/Mobile";
import Hover from "../../Components/Hover";

function DeviceView({device, spoofedDevice, openDetails}: {
    device: Device,
    spoofedDevice: SpoofedDevice,
    openDetails: () => void
}) {
    const online = isOnline(device);
    return (
        <>
            <div onClick={openDetails}
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
                        {TYPES.get(device.type)?.icon}
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
                        <span style={{fontSize: 16}}><b>{device.name}</b></span>
                        <span>{device.ip}</span>
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
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Device>(DEFAULT_DEVICE);

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
            <DeviceDetailsPanel device={selectedDevice} spoofedDevice={spoofedDevice}
                                setSpoofedDevice={setSpoofedDeviceAndSend}
                                visible={detailsVisible}
                                closePanel={() => setDetailsVisible(false)}/>
            <div id='grid' style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr 1fr',
                gridTemplateRows: 'auto',
                position: "relative",
            }}>
                {
                    sortedDevices.map(device => <DeviceView key={device.mac} device={device}
                                                            spoofedDevice={spoofedDevice}
                                                            openDetails={() => {
                                                                setSelectedDevice(device);
                                                                setDetailsVisible(true);
                                                            }}/>)
                }
            </div>
        </>
    );
}

export default AllDevicesPanel;