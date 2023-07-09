import React, { useEffect, useState } from 'react';
import { Vega } from 'react-vega';
import AstroAddressDetails from './AstroAdressDetails'

export const BarChart = () => {
    const [rangeUp, setRangeUp] = useState(5000)
    const [spec, setSpec] = useState()
    const [selectedAdress, setSelectedAdress] = useState()

    useEffect(() => {
        if (rangeUp === undefined) {
            return
        }
        setSpec({
            "$schema": "https://vega.github.io/schema/vega/v5.json",
            "width": 1000,
            "height": 600,
            "padding": { "left": 5, "right": 5, "top": 20, "bottom": 0 },
            "autosize": "none",
            "signals": [
                { "name": "cx", "update": "width / 2" },
                { "name": "cy", "update": "height / 2" },
                {
                    "name": "gravityX",
                    "value": 0.1,
                },
                {
                    "name": "gravityY",
                    "value": 0.1,
                },
                {
                    name: 'clickEvent',
                    on: [
                        { events: 'click', update: 'datum' }
                    ],
                },
            ],
            "data": [
                {
                    "name": "table",
                    "url": "./top_sellers.json"
                }
            ],
            "scales": [
                {
                    "name": "size",
                    "domain": { "data": "table", "field": "returnAmount" },
                    "range": [500, rangeUp]
                },
                {
                    "name": "color",
                    "type": "sequential",
                    "domain": { "data": "table", "field": "Total_astro" },
                    "range": { "interpolate": "rgb", "scheme": "purplered" }
                }
            ],
            "marks": [
                {
                    "name": "nodes",
                    "type": "symbol",
                    "from": { "data": "table" },
                    "encode": {
                        "enter": {
                            "fill": { "scale": "color", "field": "Total_astro" },
                            "xfocus": { "signal": "cx" },
                            "yfocus": { "signal": "cy" }
                        },
                        "update": {
                            "size": { "signal": "pow(datum.returnAmount,1.2)", "scale": "size" },
                            "stroke": { "value": "#37609f" },
                            "strokeWidth": { "value": 1 }
                        }
                    },
                    "transform": [
                        {
                            "type": "force",
                            "iterations": 100,
                            "static": false,
                            "forces": [
                                {
                                    "force": "collide",
                                    "iterations": 2,
                                    "radius": { "expr": "sqrt(datum.size) / 2" }
                                },
                                { "force": "center", "x": { "signal": "cx" }, "y": { "signal": "cy" } },
                                { "force": "x", "x": "xfocus", "strength": { "signal": "gravityX" } },
                                { "force": "y", "y": "yfocus", "strength": { "signal": "gravityY" } }
                            ]
                        }
                    ]
                },
            ],
        })
    }, [rangeUp])

    function handleSignals(...args) {
        setSelectedAdress(args[1]['traderAddress']);
    }

    const signalListeners = { clickEvent: handleSignals };

    return <div className="min-h-screen w-full flex p-4">
        <div className='w-2/3 flex justify-center items-center'>
            <div>
                {(spec) && <Vega
                    spec={spec}
                    actions={false}
                    signalListeners={signalListeners} />}
            </div>
        </div>
        <div className='w-1/3 justify-center items-center'>
            <AstroAddressDetails address={selectedAdress} />
        </div>
    </div>
}

export default BarChart;