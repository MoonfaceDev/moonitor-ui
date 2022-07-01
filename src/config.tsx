import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SpeakerIcon from '@mui/icons-material/Speaker';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import RouterIcon from '@mui/icons-material/Router';
import TabletIcon from '@mui/icons-material/Tablet';
import PrintIcon from '@mui/icons-material/Print';
import LockIcon from '@mui/icons-material/Lock';
import React, {ReactNode} from "react";
import {SvgIconProps} from "@mui/material";

const getPollInterval = () => {
    try {
        return 1000 * parseInt(localStorage.getItem('syncDataInterval') || '60');
    } catch (e) {
        return 1000 * 60;
    }
}

const TYPES = new Map<string, { icon: (props: SvgIconProps) => ReactNode, color: string, hoverColor: string }>([
    ['Unknown', {icon: (props) => <QuestionMarkIcon {...props}/>, color: '#B388FF', hoverColor: '#805acb'}],
    ['PC', {icon: (props) => <DesktopWindowsIcon {...props}/>, color: '#FFC107', hoverColor: '#c79100'}],
    ['Phone', {icon: (props) => <PhoneAndroidIcon {...props}/>, color: '#03A9F4', hoverColor: '#007ac1'}],
    ['TV Adapter', {icon: (props) => <SettingsInputComponentIcon {...props}/>, color: '#4CAF50', hoverColor: '#087f23'}],
    ['TV', {icon: (props) => <LiveTvIcon {...props}/>, color: '#f44336', hoverColor: '#ba000d'}],
    ['Music', {icon: (props) => <SpeakerIcon {...props}/>, color: '#18FFFF', hoverColor: '#00cbcc'}],
    ['Game console', {icon: (props) => <SportsEsportsIcon {...props}/>, color: '#E91E63', hoverColor: '#b0003a'}],
    ['Router', {icon: (props) => <RouterIcon {...props}/>, color: '#009688', hoverColor: '#00675b'}],
    ['Tablet', {icon: (props) => <TabletIcon {...props}/>, color: '#ff9e80', hoverColor: '#c96f53'}],
    ['Printer', {icon: (props) => <PrintIcon {...props}/>, color: '#5c6bc0', hoverColor: '#26418f'}],
    ['Security', {icon: (props) => <LockIcon {...props}/>, color: '#6a069c', hoverColor: '#37006d'}],
]);

export {getPollInterval, TYPES};