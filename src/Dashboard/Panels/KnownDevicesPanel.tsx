import React, {useEffect, useState} from "react";
import {IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {fetchKnownDevicesCount} from "../../APIRequests";
import KnownDevicesEditPanel from "./KnownDevicesEditPanel";
import useMobile from "../../Common/Hooks/Mobile";
import PanelContainer from "../../Components/Panel/PanelContainer";
import ProgressBar from "../../Components/ProgressBar";

function KnownDevicesPanel({totalDevices}: { totalDevices: number }) {
    const isMobile = useMobile();
    const [knownDevices, setKnownDevices] = useState<number>(0);
    const [editPanelVisible, setEditPanelVisible] = useState(false);
    useEffect(() => {
        fetchKnownDevicesCount()
            .then(result => {
                setKnownDevices(result);
            });
    }, []);
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
                    }}>Known Devices
                    </div>
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