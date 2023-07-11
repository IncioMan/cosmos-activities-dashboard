"use client"
import React, { useEffect, useState } from 'react'
import { Vega } from 'react-vega'
import data from '../data/sellers_activity.json'
import { Bubble } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { CategoryScale } from 'chart.js';
ChartJS.register(CategoryScale);

interface Props {
    address: string | undefined
}

const allActivities: ITraderActivity[] = data;

function AstroAdressDetails({ address }: Props) {
    const [traderActivity, setTraderActivity] = useState<ITraderActivity[]>()
    const [data, setData] = useState<any>()

    useEffect(() => {
        setTraderActivity(allActivities.filter((a: ITraderActivity) => a.traderAddress == address))
    }, [address])

    useEffect(() => {
        if (traderActivity === undefined) {
            return
        }
        console.log('HEREEEE', traderActivity)
        const data = {
            datasets: [
                {
                    label: address,
                    data: traderActivity?.map((t: ITraderActivity) => ({
                        x: t.date,
                        y: t.returnAmount,
                        r: t.returnAmount,
                    })),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }],
        }
        setData(data)
    }, [traderActivity])

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };


    return (
        <div className='flex flex-col h-full justify-start items-center pb-8'>
            <div className='text-white text-md pb-8'>
                <a href={`https://chainsco.pe/terra2/address/${address}`} className='font-medium text-[#e23f94] dark:text-[#d284bf] hover:underline' target="blank">{address}</a>
            </div>
            {(address && data) && <Bubble options={options} data={data} />}
        </div >
    )
}

export default AstroAdressDetails