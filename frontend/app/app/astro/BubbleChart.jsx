import React, { useEffect, useState } from 'react';
import { Vega } from 'react-vega';
import AstroAddressDetails from './AstroAdressDetails'

export const BarChart = () => {
    const [rangeUp, setRangeUp] = useState(5000)
    const [spec, setSpec] = useState()
    const [selectedAdress, setSelectedAdress] = useState()

    const height = 580

    useEffect(() => {
        if (rangeUp === undefined) {
            return
        }
        setSpec({
            "$schema": "https://vega.github.io/schema/vega/v5.json",
            "width": 800,
            "height": height,
            "padding": { "left": 5, "right": 5, "top": 0, "bottom": 0 },
            "autosize": "pad",
            "title": {
                "orient": "top",
                "text": "Top 50 ASTRO sellers after vesting period ended (1st of July)",
                "color": "#E8E8E8"
            },
            "signals": [
                { "name": "cx", "update": "width / 2 - 50" },
                { "name": "cy", "update": "height / 2 + 10" },
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
                    ],
                },
                {
                    "type": "text",
                    "from": { "data": "nodes" },
                    "encode": {
                        "enter": {
                            "align": { "value": "center" },
                            "baseline": { "value": "middle" },
                            "fontSize": { "value": 15 },
                            "fontWeight": { "value": "bold" },
                            "fill": { "value": "white" },
                            "text": { "field": "datum.returnAmount" }
                        },
                        "update": { "x": { "field": "x" }, "y": { "field": "y" } }
                    }
                }
            ],
            "legends": {
                type: "gradient",
                title: "ASTRO Holdings",
                fill: "color",
                direction: "vertical",
                orient: 'left',
                gradientLength: height,
                gradientThickness: 15,
                titleOrient: "left",
                titleAnchor: null,
                titleColor: 'white',
                symbolFillColor: 'white',
                labelColor: 'white'
            }
        })
    }, [rangeUp])

    function handleSignals(...args) {
        console.log(args)
        setSelectedAdress(args[1]['traderAddress']);
    }

    const signalListeners = { clickEvent: handleSignals };

    return <div className="h-full w-full flex p-4 py-8">
        <div className='w-3/5 flex justify-center items-start'>
            <div>
                {(spec) && <Vega
                    spec={spec}
                    actions={false}
                    signalListeners={signalListeners} />}
            </div>
        </div>
        <div className='w-2/5 flex justify-center items-center'>
            <AstroAddressDetails address={selectedAdress} />
        </div>
    </div>
}

export default BarChart;