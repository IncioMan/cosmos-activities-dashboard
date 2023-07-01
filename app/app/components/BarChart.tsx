'use client'
import React from 'react'
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto'
import { CategoryScale } from 'chart.js';
ChartJS.register(CategoryScale);

interface Props {
    chartData: { day: string, amount: number }[],
}

function BarChart({ chartData }: Props) {
    return (
        <Bar data={{
            labels: chartData.map(g => g.day),
            datasets: [
                {
                    label: 'ATOM Amount undelegated',
                    data: chartData.map(g => g.amount)
                }
            ]
        }} options={{}} />
    )
}

export default BarChart