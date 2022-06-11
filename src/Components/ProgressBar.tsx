import {PolarAngleAxis, RadialBar, RadialBarChart} from "recharts";
import React from "react";

function ProgressBar({value, maxValue}: { value: number, maxValue: number }) {
    const chartData = [{value: value}];
    return (
        <RadialBarChart width={48}
                        height={48}
                        cx='50%'
                        cy='50%'
                        innerRadius={21}
                        outerRadius={27}
                        barSize={4}
                        startAngle={90}
                        endAngle={-270}
                        data={chartData}
        >
            <PolarAngleAxis
                type="number"
                domain={[0, maxValue]}
                angleAxisId={0}
                tick={false}
            />
            <RadialBar
                background={{fill: '#3c3f5e'}}
                dataKey='value'
                cornerRadius={24}
                fill='rgb(97, 218, 251)'
                isAnimationActive={false}
            >
            </RadialBar>
            <text
                x="50%"
                y="50%"
                fill="white"
                fontSize={12}
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {Math.min(value / maxValue * 100, 100).toFixed(0) + '%'}
            </text>
        </RadialBarChart>
    )
}

export default ProgressBar;