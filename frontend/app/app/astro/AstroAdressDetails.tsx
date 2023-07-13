"use client"
import React, { useEffect, useState } from 'react'
import { Vega } from 'react-vega'
import data from '../data/sellers_activity.json'
import { Bubble } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { CategoryScale } from 'chart.js';
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";

Chart.register(ArcElement);
ChartJS.register(CategoryScale);

interface Props {
    address: string | undefined,
    tradersInfo: any
}

const allActivities: ITraderActivity[] = data;

function AstroAdressDetails({ address, tradersInfo }: Props) {
    const [traderInfo, setTraderInfo] = useState<ITraderSummary>()
    const [chartData, setChartData] = useState<any>()

    useEffect(() => {
        //setTraderActivity(allActivities.filter((a: ITraderActivity) => a.traderAddress == address))
        setTraderInfo(tradersInfo.filter((a: ITraderSummary) => a.traderAddress == address)[0])
    }, [address])

    useEffect(() => {
        const _data = {
            labels: [
                'ASTRO',
                'xASTRO'
            ],
            datasets: [
                {
                    data: [
                        traderInfo?.ASTRO,
                        traderInfo?.xASTRO
                    ],
                    backgroundColor: [
                        "#336699",
                        "#99CCFF"
                    ],
                    display: true
                }
            ]
        }
        setChartData(_data)
    }, [traderInfo])


    return (
        <div className='flex flex-col h-full justify-start items-center pb-8'>
            <div className='text-white text-md pb-8'>
                <a href={`https://chainsco.pe/terra2/address/${address}`} className='font-medium text-[#e23f94] dark:text-[#d284bf] hover:underline' target="blank">{address}</a>
            </div>
            <div>
                {chartData && <Doughnut
                    data={chartData}
                    options={{
                        plugins: {
                            legend: {
                                display: true,
                                position: "top"
                            },
                            tooltip: {
                                enabled: true
                            }
                        },
                        borderWidth: 1,
                        rotation: -90,
                        circumference: 180,
                        cutout: "60%",
                        maintainAspectRatio: true,
                        responsive: true
                    }}
                />}
            </div>
        </div >
    )
}

export default AstroAdressDetails