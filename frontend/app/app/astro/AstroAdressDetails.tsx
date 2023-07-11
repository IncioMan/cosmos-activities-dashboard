"use client"
import React, { useEffect, useState } from 'react'
import { Vega } from 'react-vega'
import data from '../data/sellers_activity.json'

interface Props {
    address: string | undefined
}

const allActivities: ITraderActivity[] = data;

function AstroAdressDetails({ address }: Props) {
    const [traderActivity, setTraderActivity] = useState<ITraderActivity[]>()
    const [spec, setSpec] = useState({})

    useEffect(() => {
        setTraderActivity(allActivities.filter((a: ITraderActivity) => a.traderAddress == address))
    }, [address])

    useEffect(() => {
        console.log(traderActivity)
        const spec = {
            "$schema": "https://vega.github.io/schema/vega/v5.json",
            "description": "A basic line chart example.",
            "width": 300,
            "height": 150,
            "padding": 5,

            "data": [
                {
                    "name": "table",
                    "values": traderActivity
                }
            ],

            "scales": [
                {
                    "name": "x",
                    "type": "point",
                    "range": "width",
                    "domain": { "data": "table", "field": "date" }
                },
                {
                    "name": "y",
                    "type": "linear",
                    "range": "height",
                    "nice": true,
                    "zero": true,
                    "domain": { "data": "table", "field": "returnAmount" }
                }
            ],

            "axes": [
                { "orient": "bottom", "scale": "x", "labelColor": "white" },
                { "orient": "left", "scale": "y", "labelColor": "white" }
            ],


            "marks": [
                {
                    "name": "marks",
                    "type": "symbol",
                    "from": { "data": "table" },
                    "encode": {
                        "update": {
                            "x": { "scale": "x", "field": "date" },
                            "y": { "scale": "y", "field": "returnAmount" },
                            "size": { "value": 40 },
                            "shape": { "value": "circle" },
                            "strokeWidth": { "value": 2 },
                            "stroke": { "value": "#d284bf" },
                            "fill": { "value": "#d284bf" }
                        }
                    }
                }
            ]
        }
        setSpec(spec)
    }, [traderActivity])



    return (
        <div className='flex flex-col h-full justify-start items-center pb-8'>
            <div className='text-white text-md pb-8'>
                <a href={`https://chainsco.pe/terra2/address/${address}`} className='font-medium text-[#e23f94] dark:text-[#d284bf] hover:underline' target="blank">{address}</a>
            </div>
            {(address && spec) && <Vega
                spec={spec}
                actions={false} />}
        </div >
    )
}

export default AstroAdressDetails