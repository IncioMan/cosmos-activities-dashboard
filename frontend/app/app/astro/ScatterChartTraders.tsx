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
import top_sellers from '../data/top_monthly_sellers.json'
import top_buyers from '../data/top_monthly_buyers.json'
import 'chartjs-adapter-moment';
ChartJS.register(LinearScale, PointElement, TimeScale, Tooltip, Legend);

export function ScatterChartTraders() {
    const options = {
        responsive: true,
        onClick: function (event: any, chartElements: any) {
            if (chartElements) {
                const address = chartElements[0].element.$context.raw.address
                const newTab = window.open(`https://chainsco.pe/terra2/address/${address}`, '_blank');
                newTab?.focus();
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let addressLabel = 'Address: ';
                        let amountLabel = 'Amount: ';
                        let astroLabel = 'ASTRO Holdings: ';

                        if (context.raw.address !== null) {
                            addressLabel += context.raw.address;
                        }

                        if (context.raw.x !== null) {
                            amountLabel += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.raw.x);
                        }

                        if (context.raw.y !== null) {
                            astroLabel += context.raw.y;
                        }

                        return [addressLabel, amountLabel, astroLabel];
                    }
                }
            }
        }
    }

    const data = {
        datasets: [
            {
                label: 'Top sellers',
                data: top_sellers.map((s: ITraderSummary) => ({
                    x: s.dollar_amount,
                    y: s.total_astro_holdings,
                    r: 10,
                    address: s.traderAddress
                })),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Top buyers',
                data: top_buyers.map((s: ITraderSummary) => ({
                    x: s.dollar_amount,
                    y: s.total_astro_holdings,
                    r: 10,
                    address: s.traderAddress
                })),
                backgroundColor: 'green'
            },
        ],
    };

    return <>
        {(data) && <Bubble options={options} data={data} />
        }</>
}
