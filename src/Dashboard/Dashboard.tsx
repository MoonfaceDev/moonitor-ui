import React from "react";
import logo from "../Assets/logo.png";
import DeviceTypesPanel from "./Panels/DeviceTypesPanel";
import ConnectedDevicesPanel from "./Panels/ConnectedDevicesPanel";

function Header() {
    return <header style={{height: 100}}>
        <img src={logo} alt='Moonitor' style={{
            position: 'absolute',
            height: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: 20,
            color: 'white',
            fontSize: 32,
        }}/>
    </header>
}

function Dashboard() {
    return (
        <div style={{
            height: '100vh',
            background: '#1E1E26'
        }}>
            <Header/>
            <div style={{
                display: 'flex',
                height: 400,
                padding: 8,
            }}>
                <ConnectedDevicesPanel/>
                <DeviceTypesPanel/>
            </div>
        </div>
    );
}

export default Dashboard;
