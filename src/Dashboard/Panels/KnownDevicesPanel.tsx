import React, {useState} from "react";
import {PanelContainer, ProgressBar} from "../Components";
import {IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {fetchKnownDevicesCount} from "../../APIRequests";
import {POLL_INTERVAL} from "../../config";
import KnownDevicesEditPanel from "./KnownDevicesEditPanel";
import useMobile from "../../Common/Hooks/Mobile";
import useInterval from "../../Common/Hooks/Interval";

function KnownDevicesPanel({totalDevices}: { totalDevices: number }) {
    const isMobile = useMobile();
    const [knownDevices, setKnownDevices] = useState<number>(0);
    const [editPanelVisible, setEditPanelVisible] = useState(false);
    useInterval(() => {
        fetchKnownDevicesCount()
            .then(result => {
                setKnownDevices(result);
            });
    }, POLL_INTERVAL, []);
    return (
        <PanelContainer>
            <div style={{
                display: 'flex',
                padding: isMobile ? 8 : 16
            }}>
                <KnownDevicesEditPanel visible={editPanelVisible} closePanel={() => setEditPanelVisible(false)}/>
                <ProgressBar value={knownDevices} maxValue={totalDevices}/>
                <div style={{
                    margin: '0 20px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        fontSize: 20
                    }}>Known Devices</div>
                    <div style={{
                        color: '#c6c9ec'
                    }}>{knownDevices} out of {totalDevices}</div>
                </div>
                <IconButton style={{
                    margin: 4
                }} onClick={() => setEditPanelVisible(true)}>
                    <EditIcon/>
                </IconButton>
            </div>
        </PanelContainer>
    );
}

export default KnownDevicesPanel;