'use client'
import React, { useRef } from 'react'
import { Bar, getElementAtEvent } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto'
import { CategoryScale } from 'chart.js';
ChartJS.register(CategoryScale);

interface Props {
    chartData: { day: string, amount: number }[],
}

function BarChart({ chartData }: Props) {
    const chartRef = useRef();

    const data = {
        labels: chartData.map(g => g.day),
        datasets: [
            {
                label: 'ATOM',
                data: chartData.map(g => g.amount)
            }
        ]
    }

    const handleClick = (event: any, activeElements: any) => {
        if (activeElements.length > 0) {
            const clickedElementIndex = activeElements[0].index;
            const clickedLabel = data.labels[clickedElementIndex];
            const clickedValue = data.datasets[0].data[clickedElementIndex];

            console.log('Clicked on:', clickedLabel);
            console.log('Value:', clickedValue);
        }
    };

    return (
        <Bar
            ref={chartRef}
            data={data}
            options={{
                events: ['click'],
                onClick: handleClick
            }} />
    )
}

export default BarChart