import React, { useEffect, useState } from 'react';
import { Vega } from 'react-vega';
import { AstroWhaleDaily } from '@/interfaces/Interfaces';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCMore from 'highcharts/highcharts-more';
HCMore(Highcharts);

interface props {
    data: AstroWhaleDaily[]
}

export const AstroBarCharWhalesDaily = ({
    data
}: props) => {
    const options: Highcharts.Options = {
        chart: {
            type: 'column',
            width: 900,
            height: 500,
            backgroundColor: 'transparent'
        },
        title: {
            text: 'Astro Whales Daily Delta',
            style: {
                color: '#ffffff', // Set the text color to white
            },
        },
        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%Y-%m-%d}',
                style: {
                    color: '#ffffff', // Set the text color to white
                },
                rotation: 30,
                align: 'center'
            },
        },
        yAxis: {
            title: {
                text: 'Astro Amount',
                style: {
                    color: '#ffffff', // Set the text color to white
                },
            },
            labels: {
                style: {
                    color: '#ffffff', // Set the text color to white
                },
            },
        },
        legend: {
            enabled: false, // Hide the legend
        },
        series: [
            {
                type: 'column', // Add the type property as 'column'
                name: 'Astro Amount',
                data: data.map((item) => [new Date(item.date).getTime(), item.astro_amount]), // Convert date string to timestamp
                color: '#81e9ff'
            },
        ],
    };



    return <div className="h-full w-full flex p-4 py-8 justify-center items-center">
        <div className='w-4/7 flex justify-center items-start'>
            <div>
                <HighchartsReact highcharts={Highcharts} options={options} />;
            </div>
        </div>
    </div>
}

export default AstroBarCharWhalesDaily;