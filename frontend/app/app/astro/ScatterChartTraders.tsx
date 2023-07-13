import React from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    TimeScale
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import top_sellers from '../data/top_sellers.json'
import 'chartjs-adapter-moment';
ChartJS.register(LinearScale, PointElement, TimeScale, Tooltip, Legend);

export function ScatterChartTraders() {
    const options = {
        responsive: true,
        scales: {
            x: {
                type: "time", // Specify the scale type as 'time'
                time: {
                    tooltipFormat: "YYYY-MM-DD", // Format for tooltips
                    displayFormats: {
                        day: "YYYY-MM-DD", // Format for x-axis labels
                    },
                }
            },
        },
    }

    const data = {
        datasets: [
            {
                label: 'Red dataset',
                data: top_sellers.map((s: ITraderSummary) => ({
                    x: s.last_trade_date,
                    y: s.total_return_amount,
                    r: 10,
                })),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return <>
        {(data) && <Bubble options={options} data={data} />
        }</>
}
