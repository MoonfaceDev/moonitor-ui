import {NetworkEntity, useInterval, useMobile} from "../../Utils";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps} from "recharts";
import {NameType, ValueType} from "recharts/types/component/DefaultTooltipContent";
import React, {useEffect, useState} from "react";
import {fetchLastScan} from "../../APIRequests";
import {ChartContainer, ChartTitle} from "../Components";
import {POLL_INTERVAL} from "../../config";

const COLORS = [
    '#B388FF',
    '#FFC107',
    '#03A9F4',
    '#f44336',
    '#4CAF50',
    '#18FFFF',
    '#E91E63',
    '#009688',
    '#ff9e80',
    '#5c6bc0',
];

function countEntitiesOfType(lastScan: NetworkEntity[], type: string) {
    let count = 0;
    lastScan.forEach(entity => {
        if (entity.device.type === type) {
            count++;
        }
    });
    return count;
}

function getTypeSet(lastScan: NetworkEntity[]) {
    const types = new Set<string>();
    lastScan.forEach(entity => types.add(entity.device.type));
    return types;
}

function getTypeCount(lastScan: NetworkEntity[]) {
    const types = getTypeSet(lastScan);
    let data: { type: string, count: number }[] = [];
    types.forEach(type => data.push({type: type, count: countEntitiesOfType(lastScan, type)}));
    return data;
}

function formatData(lastScan: NetworkEntity[]) {
    const data = getTypeCount(lastScan);
    return data.sort((item1, item2) => item2.count - item1.count);
}

function DeviceTypesChart({lastScan}: { lastScan: NetworkEntity[] }) {
    const isMobile = useMobile();
    function CustomTooltip({payload}: TooltipProps<ValueType, NameType>) {
        return (
            <div className="custom-tooltip"
                 style={{background: 'rgba(0, 0, 0, 0.7)', border: '1px solid white', color: 'white', padding: 8}}>
                {payload && payload[0] && typeof (payload[0].value) === "number" ?
                    <label>{`${payload[0].name}: ${(payload[0].value / lastScan.length * 100).toFixed(0)}%`}</label>
                    : null}
            </div>
        );
    }

    const formattedData = formatData(lastScan);
    const cells = formattedData.map((entry, index) => <Cell key={`cell-${index}`}
                                                            fill={COLORS[index % COLORS.length]}/>);
    return (
        <ResponsiveContainer width='100%' height='100%'>
            <PieChart margin={{top: 0, right: isMobile ? 20 : 144, left: 32, bottom: 0}}>
                <Legend layout='vertical' verticalAlign='middle' align='left'/>
                <Pie data={formattedData}
                     dataKey="count"
                     nameKey="type"
                     cx="50%"
                     cy="50%"
                     innerRadius={isMobile ? 50 : 80}
                     outerRadius={isMobile ? 70 : 110}
                     color="#000000"
                     fill="#8884d8"
                     startAngle={90}
                     endAngle={-270}
                     label
                     isAnimationActive={false}>
                    {cells}
                </Pie>
                <Tooltip animationDuration={100} content={<CustomTooltip/>}/>
            </PieChart>
        </ResponsiveContainer>
    );
}

function DeviceTypesPanel() {
    const [lastScan, setLastScan] = useState<NetworkEntity[]>([]);
    useInterval(() => {
        fetchLastScan()
            .then(result => {
                setLastScan(result);
            });
    }, POLL_INTERVAL, []);
    return (
        <ChartContainer>
            <ChartTitle>Device Types</ChartTitle>
            <DeviceTypesChart lastScan={lastScan}/>
        </ChartContainer>
    );
}

export default DeviceTypesPanel;