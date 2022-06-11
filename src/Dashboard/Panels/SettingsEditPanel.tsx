import DialogBox from "../../Components/Dialog/DialogBox";
import React, {useCallback, useEffect, useState} from "react";
import DialogHeader from "../../Components/Dialog/DialogHeader";
import {
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import TimelapseIcon from '@mui/icons-material/Timelapse';
import WifiIcon from '@mui/icons-material/Wifi';
import SearchIcon from '@mui/icons-material/Search';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import Loading from "../../Components/Loading/Loading";
import {
    fetchRestartScanService,
    fetchRestartServerService,
    fetchSettings,
    fetchUpdateSettings
} from "../../APIRequests";
import useEscape from "../../Common/Hooks/Escape";
import {useSnackbar} from "notistack";

const SCAN_INTERVAL_OPTIONS: [string, number][] = [
    ['Minute', 60],
    ['2 Minutes', 120],
    ['5 Minutes', 300],
    ['10 Minutes', 600],
    ['30 Minutes', 1800],
    ['Hour', 3600]
];

const PORTS_TO_SCAN = [50, 100, 200, 500];

const TOKEN_EXPIRY_TIME_OPTIONS: [string, number][] = [
    ['10 Minutes', 10],
    ['30 Minutes', 30],
    ['Hour', 60],
    ['Day', 1440],
    ['30 Days', 43200],
];

const SYNC_DATA_INTERVAL_OPTIONS: [string, number][] = [
    ['10 Seconds', 10],
    ['30 Seconds', 30],
    ['Minute', 60],
    ['5 Minutes', 300],
    ['10 Minutes', 600],
    ['Never', 0],
];

function SettingsEditPanel({visible, closePanel}: { visible: boolean, closePanel: () => void }) {
    const [loading, setLoading] = useState<boolean>(false);
    const {enqueueSnackbar} = useSnackbar();

    const [networkSubnet, setNetworkSubnet] = useState<string>('');
    const [scanInterval, setScanInterval] = useState<number>(0);
    const [portsToScan, setPortsToScan] = useState<number>(0);

    const [tokenExpiryTime, setTokenExpiryTime] = useState<number>(0);
    const [gatewayIp, setGatewayIp] = useState<string>('');
    const [gatewayMac, setGatewayMac] = useState<string>('');

    const [syncDataInterval, setSyncDataInterval] = useState<number>(0);

    useEffect(() => {
        if (!visible) {
            return;
        }
        setLoading(true);

        fetchSettings()
            .then(result => {
                setNetworkSubnet(result.scanSettings.networkSubnet);
                setScanInterval(result.scanSettings.scanInterval);
                setPortsToScan(result.scanSettings.portsToScan);
                setTokenExpiryTime(result.serverSettings.tokenExpiryTime);
                setGatewayIp(result.serverSettings.gatewayIp);
                setGatewayMac(result.serverSettings.gatewayMac);
                try {
                    setSyncDataInterval(parseInt(localStorage.getItem('syncDataInterval') || '60'));
                } catch (e) {
                    setSyncDataInterval(60);
                }
                setLoading(false);
            })
            .catch(reason => {
                enqueueSnackbar(reason.toString(), {variant: 'error'});
                closePanel();
                setLoading(false);
            });
    }, [visible]);

    useEscape(() => closePanel(), visible);

    const saveSettings = useCallback(() => {
        setLoading(true);
        localStorage.setItem('syncDataInterval', syncDataInterval.toString());
        fetchUpdateSettings({
            scanSettings: {networkSubnet, scanInterval, portsToScan},
            serverSettings: {tokenExpiryTime, gatewayIp, gatewayMac}
        })
            .then(() => {
                setLoading(false);
                enqueueSnackbar('Successfully saved settings', {variant: 'success'});
                closePanel();
            })
            .catch(reason => {
                setLoading(false);
                enqueueSnackbar(reason.toString(), {variant: 'error'});
            });
    }, [networkSubnet, scanInterval, portsToScan, tokenExpiryTime, gatewayIp, gatewayMac, syncDataInterval]);

    const restartScanService = useCallback(() => {
        setLoading(true);
        fetchRestartScanService()
            .then(() => {
                setLoading(false);
                enqueueSnackbar('Sent restart request', {variant: 'info'});
            });
    }, []);

    const restartServerService = useCallback(() => {
        setLoading(true);
        fetchRestartServerService()
            .then(() => {
                enqueueSnackbar('Sent restart request', {variant: 'info'});
            });
    }, []);

    return (
        <>
            <Loading visible={loading}/>
            <DialogBox visible={visible}>
                <DialogHeader title='Settings' onCancel={closePanel} onConfirm={saveSettings}/>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 4,
                    marginBottom: 8,
                    // @ts-ignore
                    overflowY: 'overlay',
                    overflowX: 'hidden',
                    '*::-webkit-scrollbar': {
                        width: '0.4em'
                    },
                    '*::-webkit-scrollbar-track': {
                        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
                    },
                    '*::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,.1)',
                        outline: '1px solid slategrey'
                    }
                }}>
                    <List
                        subheader={
                            <ListSubheader>Scan Settings</ListSubheader>
                        }
                        sx={{
                            padding: '0',
                        }}
                    >
                        <ListItem>
                            <ListItemIcon>
                                <WifiIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Network Subnet"/>
                            <TextField
                                variant='standard'
                                value={networkSubnet}
                                onChange={(event) => setNetworkSubnet(event.target.value)}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <TimelapseIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Scan Interval"/>
                            <Select
                                variant='standard'
                                value={scanInterval}
                                onChange={(event) => setScanInterval(parseInt(event.target.value.toString()))}
                            >
                                {
                                    SCAN_INTERVAL_OPTIONS.map(([label, value]) => <MenuItem
                                        value={value}>{label}</MenuItem>)
                                }
                            </Select>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <SearchIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Ports To Scan"/>
                            <Select
                                variant='standard'
                                value={portsToScan}
                                onChange={(event) => setPortsToScan(parseInt(event.target.value.toString()))}
                            >
                                {
                                    PORTS_TO_SCAN.map(value => <MenuItem value={value}>{value}</MenuItem>)
                                }
                            </Select>
                        </ListItem>
                        <ListItem>
                            <Button variant='contained' onClick={restartScanService}>Restart Service</Button>
                        </ListItem>
                    </List>

                    <List
                        subheader={
                            <ListSubheader>Server Settings</ListSubheader>
                        }
                        sx={{
                            padding: '0',
                        }}
                    >
                        <ListItem>
                            <ListItemIcon>
                                <VpnKeyIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Token Expiry Time"/>
                            <Select
                                variant='standard'
                                value={tokenExpiryTime}
                                onChange={(event) => setTokenExpiryTime(parseInt(event.target.value.toString()))}
                            >
                                {
                                    TOKEN_EXPIRY_TIME_OPTIONS.map(([label, value]) => <MenuItem
                                        value={value}>{label}</MenuItem>)
                                }
                            </Select>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                            </ListItemIcon>
                            <ListItemText primary="Gateway IP"/>
                            <TextField
                                variant='standard'
                                value={gatewayIp}
                                onChange={(event) => setGatewayIp(event.target.value)}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                            </ListItemIcon>
                            <ListItemText primary="Gateway MAC"/>
                            <TextField
                                variant='standard'
                                value={gatewayMac}
                                onChange={(event) => setGatewayMac(event.target.value)}
                            />
                        </ListItem>
                        <ListItem>
                            <Button variant='contained' onClick={restartServerService}>Restart Service</Button>
                        </ListItem>
                    </List>

                    <List
                        subheader={
                            <ListSubheader>Website Settings</ListSubheader>
                        }
                        sx={{
                            padding: '0',
                        }}
                    >
                        <ListItem>
                            <ListItemIcon>
                                <CloudSyncIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Sync Data Interval"/>
                            <Select
                                variant='standard'
                                value={syncDataInterval}
                                onChange={(event) => setSyncDataInterval(parseInt(event.target.value.toString()))}
                            >
                                {
                                    SYNC_DATA_INTERVAL_OPTIONS.map(([label, value]) => <MenuItem
                                        value={value}>{label}</MenuItem>)
                                }
                            </Select>
                        </ListItem>
                    </List>
                </div>
            </DialogBox>
        </>
    )
}

export default SettingsEditPanel;