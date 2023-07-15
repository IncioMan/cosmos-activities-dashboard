import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    TimeScale
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import top_today_sellers from '../../data/top_today_sellers.json'
import top_today_buyers from '../../data/top_today_buyers.json'
import top_weekly_sellers from '../../data/top_weekly_sellers.json'
import top_weekly_buyers from '../../data/top_weekly_buyers.json'
import top_monthly_sellers from '../../data/top_monthly_sellers.json'
import top_monthly_buyers from '../../data/top_monthly_buyers.json'
import { ITraderSummary, TimeFrame } from '../../interfaces/Interfaces'
import { time } from 'console';
ChartJS.register(LinearScale, PointElement, TimeScale, Tooltip, Legend);
ChartJS.defaults.color = '#fff';

type Props = {
    excludeNoHolder: boolean,
    timeFrame: TimeFrame
}

export function AstroScatterChartTraders({ excludeNoHolder, timeFrame }: Props) {
    const [topSellers, setTopSellers] = useState<ITraderSummary[]>([])
    const [topBuyers, setTopBuyers] = useState<ITraderSummary[]>([])

    useEffect(() => {
        var top_sellers: ITraderSummary[] = []
        var top_buyers: ITraderSummary[] = []
        console.log('Updating data...')
        switch (timeFrame) {
            case TimeFrame.Today:
                console.log('Setting today data')
                top_sellers = top_today_sellers
                top_buyers = top_today_buyers
                break
            case TimeFrame.LastWeek:
                console.log('Setting last week data')
                top_sellers = top_weekly_sellers
                top_buyers = top_weekly_buyers
                break
            case TimeFrame.LastMonth:
                console.log('Setting last month data')
                top_sellers = top_monthly_sellers
                top_buyers = top_monthly_buyers
                break
        }
        if (excludeNoHolder) {
            console.log('Excluding no holders from data')
            setTopSellers(top_sellers.filter((s: ITraderSummary) => s.total_astro_holdings && s.total_astro_holdings > 0))
            setTopBuyers(top_buyers.filter((s: ITraderSummary) => s.total_astro_holdings && s.total_astro_holdings > 0))
        }
        else {
            console.log('Including no holders in data')
            setTopSellers(top_sellers)
            setTopBuyers(top_buyers)
        }
    }, [timeFrame, excludeNoHolder])


    const options = {
        responsive: true,
        onClick: function (event: any, chartElements: any) {
            if (chartElements) {
                try {
                    const address = chartElements[0].element.$context.raw.address
                    const newTab = window.open(`https://chainsco.pe/terra2/address/${address}`, '_blank');
                    newTab?.focus();
                } catch {
                    console.error('Couldnt open link', chartElements)
                }
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
                data: topSellers?.map((s: ITraderSummary) => ({
                    x: s.dollar_amount,
                    y: s.total_astro_holdings,
                    r: 10,
                    address: s.traderAddress
                })),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Top buyers',
                data: topBuyers?.map((s: ITraderSummary) => ({
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
