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
import top_sellers from '../../data/top_weekly_sellers.json'
import top_buyers from '../../data/top_weekly_buyers.json'
import { ITraderSummary } from '../../interfaces/Interfaces'
ChartJS.register(LinearScale, PointElement, TimeScale, Tooltip, Legend);
ChartJS.defaults.color = '#fff';

export function AstroScatterChartTraders() {
    const options = {
        responsive: true,
        onClick: function (event: any, chartElements: any) {
            if (chartElements) {
                const address = chartElements[0].element.$context.raw.address
                const newTab = window.open(`https://chainsco.pe/terra2/address/${address}`, '_blank');
                newTab?.focus();
            }
        },
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    color: 'white',
                    text: 'Volume ($)',
                    display: true
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)',
                    display: true
                }
            },
            y: {
                title: {
                    color: 'white',
                    text: '$ASTRO Holdings',
                    display: true
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)',
                    display: true
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Undelegating ATOM',
                position: 'top' as const
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let addressLabel = 'Address: ';
                        let amountLabel = 'Volume: ';
                        let astroLabel = '$ASTRO Holdings: ';

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
            },
            legend: {
                position: 'top' as const
            },
        }
    }


    const data = {
        datasets: [
            {
                label: 'Top sellers',
                data: top_sellers.filter((s: ITraderSummary) => s.total_astro_holdings && s.total_astro_holdings > 0).map((s: ITraderSummary) => ({
                    x: s.dollar_amount,
                    y: s.total_astro_holdings,
                    r: 10,
                    address: s.traderAddress
                })),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Top buyers',
                data: top_buyers.filter((s: ITraderSummary) => s.total_astro_holdings && s.total_astro_holdings > 0).map((s: ITraderSummary) => ({
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
        {(data) && <Bubble options={options} data={data} />}
    </>
}
