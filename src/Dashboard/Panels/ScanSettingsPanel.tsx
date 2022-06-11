import React, {useEffect, useState} from "react";
import {IconButton} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import {fetchLastScanDatetime, fetchScanInterval} from "../../APIRequests";
import {getPollInterval} from "../../config";
import useMobile from "../../Common/Hooks/Mobile";
import useInterval from "../../Common/Hooks/Interval";
import ProgressBar from "../../Components/ProgressBar";
import PanelContainer from "../../Components/Panel/PanelContainer";
import SettingsEditPanel from "./SettingsEditPanel";

function ScanSettingsPanel() {
    const isMobile = useMobile();
    const [lastScan, setLastScan] = useState<Date>(new Date());
    const [scanInterval, setScanInterval] = useState<number>(0);
    const [now, setNow] = useState<Date>(new Date());
    const [editPanelVisible, setEditPanelVisible] = useState(false);
    useInterval(() => {
        fetchLastScanDatetime()
            .then(result => {
                setLastScan(result);
            });
    }, getPollInterval(), []);
    useEffect(() => {
        fetchScanInterval()
            .then(result => {
                setScanInterval(result);
            });
    }, []);
    useInterval(() => {
        setNow(new Date());
    }, 1000, []);
    const timeSinceLastScan = now.getTime() - lastScan.getTime();
    const nextScan = new Date(lastScan.getTime() + scanInterval);
    return (
        <PanelContainer>
            <div style={{
                display: 'flex',
                padding: isMobile ? 8 : 16
            }}>
                <SettingsEditPanel visible={editPanelVisible} closePanel={() => setEditPanelVisible(false)}/>
                <ProgressBar value={timeSinceLastScan} maxValue={scanInterval}/>
                <div style={{
                    margin: '0 20px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        fontSize: 20
                    }}>Next scan
                    </div>
                    <div style={{
                        color: '#c6c9ec'
                    }}>
                        {
                            nextScan.getTime() > now.getTime()
                                ? `Next scan occurs in ${nextScan.toLocaleString('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}`
                                : `Waiting for scan results`
                        }
                    </div>
                </div>
                <IconButton style={{
                    margin: 4
                }} onClick={() => setEditPanelVisible(true)}>
                    <SettingsIcon/>
                </IconButton>
            </div>
        </PanelContainer>
    );
}

export default ScanSettingsPanel;