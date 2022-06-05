import React, {useState} from "react";
import logo from "../Assets/logo.png";
import DeviceTypesPanel from "./Panels/DeviceTypesPanel";
import HistoryPanel from "./Panels/HistoryPanel";
import {useMediaQuery} from 'react-responsive';
import AllDevicesPanel from "./Panels/AllDevicesPanel";
import {Device, getTokenExpirationDelta, isOnline, useInterval, useTimeout} from "../Utils";
import {fetchDevices} from "../APIRequests";
import {POLL_INTERVAL} from "../config";
import {useNavigate} from "react-router-dom";
import SearchPanel from "./Panels/SearchPanel";
import KnownDevicesPanel from "./Panels/KnownDevicesPanel";
import ScanSettingsPanel from "./Panels/ScanSettingsPanel";

function Header() {
    return <div style={{minHeight: 100}}>
        <img src={logo} alt='Moonitor' style={{
            position: 'absolute',
            height: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: 20,
            color: 'white',
            fontSize: 32,
        }}/>
    </div>
}

function Dashboard() {
    const isMobile = useMediaQuery({query: `(max-width: 760px)`});
    const [devices, setDevices] = useState<Device[]>([]);
    const [query, setQuery] = useState<string>('');
    const onlineDevices = devices.filter((device) => isOnline(device));
    const navigate = useNavigate();
    useInterval(() => {
        fetchDevices()
            .then(result => {
                setDevices(result);
            });
    }, POLL_INTERVAL, []);
    useTimeout(() => {
        console.warn('Token expired');
        navigate('/login');
    }, getTokenExpirationDelta());
    return (
        <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: '100vh',
            background: '#1E1E26',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            padding: isMobile ? 0 : '0 300px',
            overflow: 'overlay'
        }}>
            <Header/>
            <div style={{
                display: 'flex',
                height: isMobile ? 600 : 400,
                flexDirection: isMobile ? 'column' : 'row',
            }}>
                <HistoryPanel/>
                <DeviceTypesPanel onlineDevices={onlineDevices}/>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                minHeight: isMobile ? 240 : 96,
            }}>
                <SearchPanel query={query} setQuery={setQuery}/>
                <KnownDevicesPanel totalDevices={devices.length}/>
                <ScanSettingsPanel/>
            </div>
            <AllDevicesPanel devices={devices.filter(device => new RegExp(query, 'i').test(device.name))}/>
        </div>
    );
}

export default Dashboard;
