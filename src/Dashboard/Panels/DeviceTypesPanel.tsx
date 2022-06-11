import {Cell, Label, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps} from "recharts";
import {NameType, ValueType} from "recharts/types/component/DefaultTooltipContent";
import React, {useState} from "react";
import {TYPES} from "../../config";
import {Device} from "../../Common/Device";
import useMobile from "../../Common/Hooks/Mobile";
import PanelContainer from "../../Components/Panel/PanelContainer";
import ChartTitle from "../../Components/Panel/ChartTitle";

function countEntitiesOfType(onlineDevices: Device[], type: string) {
    let count = 0;
    onlineDevices.forEach(device => {
        if (device.type === type) {
            count++;
        }
    });
    return count;
}

function getTypeSet(onlineDevices: Device[]) {
    const types = new Set<string>();
    onlineDevices.forEach(device => types.add(device.type));
    return types;
}

function getTypeCount(onlineDevices: Device[]) {
    const types = getTypeSet(onlineDevices);
    let data: { type: string, count: number }[] = [];
    types.forEach(type => data.push({type: type, count: countEntitiesOfType(onlineDevices, type)}));
    return data;
}

function formatData(onlineDevices: Device[]) {
    const data = getTypeCount(onlineDevices);
    const sortedData = data.sort((item1, item2) => item2.count - item1.count);
    const firstOtherIndex = sortedData.findIndex(entry => entry.count < 0.01 * onlineDevices.length);
    if (firstOtherIndex !== -1) {
        const otherCount = sortedData.filter((entry, index) => index >= firstOtherIndex).reduce((a, b) => a + b.count, 0);
        sortedData.splice(firstOtherIndex, onlineDevices.length - firstOtherIndex);
        sortedData.push({type: 'Other', count: otherCount});
    }
    return sortedData;
}

function DeviceTypesChart({onlineDevices}: { onlineDevices: Device[] }) {
    const isMobile = useMobile();
    const [focusedType, setFocusedType] = useState<string>('');

    function CustomTooltip({payload}: TooltipProps<ValueType, NameType>) {
        return (
            <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid white',
                color: 'white',
                padding: 8,
                borderRadius: 8
            }}>
                {payload && payload[0] && typeof (payload[0].value) === "number" ?
                    <label>{`${payload[0].name}: ${(payload[0].value / onlineDevices.length * 100).toFixed(0)}%`}</label>
                    : null}
            </div>
        );
    }

    const formattedData = formatData(onlineDevices);
    const cells = formattedData.map((entry, index) =>
        <Cell key={`cell-${index}`}
              fill={entry.type === focusedType ? TYPES.get(entry.type)?.hoverColor : TYPES.get(entry.type)?.color}
              onMouseEnter={() => {
                  setFocusedType(entry.type)
              }}
              onMouseOut={() => {
                  setFocusedType('');
              }}
        />
    );
    return (
        <ResponsiveContainer width='100%' height='100%'>
            <PieChart margin={{top: 0, right: isMobile ? 20 : 144, left: 32, bottom: 0}}>
                <Legend layout='vertical' verticalAlign='middle' align='left' iconType='circle'
                        formatter={(value) => `${value} - ${formattedData.find(entry => entry.type === value)?.count}`}/>
                <Pie data={formattedData}
                     dataKey="count"
                     nameKey="type"
                     stroke='transparent'
                     cornerRadius={5}
                     innerRadius={isMobile ? 60 : 100}
                     outerRadius={isMobile ? 70 : 110}
                     paddingAngle={2.5}
                     startAngle={90}
                     endAngle={-270}
                     isAnimationActive={false}>
                    <Label fill='#ffffff' value={onlineDevices.length} position="center" fontSize={isMobile ? 20 : 28}
                           style={{transform: 'translateY(-16px)'}}/>
                    <Label fill='#ffffff' value='Devices' position="center" fontSize={isMobile ? 14 : 20}
                           style={{transform: 'translateY(16px)'}}/>
                    {cells}
                </Pie>
                <Tooltip animationDuration={100} content={<CustomTooltip/>}/>
            </PieChart>
        </ResponsiveContainer>
    );
}

function DeviceTypesPanel({onlineDevices}: { onlineDevices: Device[] }) {
    return (
        <PanelContainer style={{padding: '16px 0'}}>
            <ChartTitle>Device Types</ChartTitle>
            <DeviceTypesChart onlineDevices={onlineDevices}/>
        </PanelContainer>
    );
}

export default DeviceTypesPanel;