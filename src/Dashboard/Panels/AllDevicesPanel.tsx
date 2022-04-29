import React, {useEffect, useState} from "react";
import {fetchDevices, fetchSpoof, fetchSpoofedDevice} from "../../APIRequests";
import {getLastSeenTime, isOnline, NetworkEntity, SpoofedDevice, useInterval, useMobile} from "../../Utils";
import DeviceDetailsPanel from "./DeviceDetailsPanel";
import Loading from "../../Loading/Loading";
import {POLL_INTERVAL, TYPE_TO_ICON} from "../../config";
import {Hover} from "../Components";

function DeviceView({device, spoofedDevice, setSpoofedDevice}: {
    device: { entity: NetworkEntity, last_online: Date },
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
                        {TYPE_TO_ICON.get(device.entity.device.type)}
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
                        <span style={{fontSize: 16}}><b>{device.entity.device.name}</b></span>
                        <span>{device.entity.ip}</span>
                        <span style={{marginTop: 4}}>{online ? 'Online' : 'Last seen ' + getLastSeenTime(device)}</span>
                    </div>
                </Hover>
            </div>
        </>
    );
}

function AllDevicesPanel() {
    const isMobile = useMobile();
    const [devices, setDevices] = useState<{ entity: NetworkEntity, last_online: Date }[]>([]);
    const [spoofedDevice, setSpoofedDevice] = useState<SpoofedDevice>({mac: '', ip: '', forward: false});
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

    useInterval(() => {
        fetchDevices()
            .then(result => {
                const sortedResult = result.sort((entity1, entity2) => {
                    return entity2.last_online.getTime() - entity1.last_online.getTime();
                });
                setDevices(sortedResult);
            });
    }, POLL_INTERVAL, []);
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
                    devices.map(device => <DeviceView key={device.entity.device.mac} device={device}
                                                      spoofedDevice={spoofedDevice}
                                                      setSpoofedDevice={setSpoofedDeviceAndSend}/>)
                }
            </div>
        </>
    );
}

export default AllDevicesPanel;