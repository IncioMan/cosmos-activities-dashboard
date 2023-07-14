import React, { useEffect, useState } from 'react';
import { Vega } from 'react-vega';

interface props {
    rangeUp: number,
    width: number,
    height: number,
    data: any,
    colorSchema: string,
    title: string,
    setAddress: (address: string) => void
}

export const BubbleChartTraders = ({ rangeUp, title, width, height, data, colorSchema, setAddress }: props) => {
    const [spec, setSpec] = useState()

    useEffect(() => {
        if (rangeUp === undefined) {
            return
        }
        setSpec({
            "$schema": "https://vega.github.io/schema/vega/v5.json",
            "width": width,
            "height": height,
            "padding": { "left": 0, "right": 0, "top": 0, "bottom": 0 },
            "autosize": "pad",
            "title": {
                "orient": "top",
                "text": title,
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
                    "values": data
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
                    "range": { "interpolate": "rgb", "scheme": colorSchema }
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
                            "fontSize": { "value": 10 },
                            "fontWeight": { "value": "bold" },
                            "fill": { "value": "black" },
                            "text": { "field": "datum.total_return_amount_label" }
                        },
                        "update": {
                            "x": { "field": "x" },
                            "y": { "field": "y" }
                        }
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

    function handleSignals(...args: any) {
        console.log(args)
        setAddress(args[1]['traderAddress']);
    }

    const signalListeners = { clickEvent: handleSignals };

    return <div className="h-full w-full flex p-4 py-8">
        <div className='flex justify-center items-start'>
            <div>
                {(spec) && <Vega
                    spec={spec}
                    actions={false}
                    signalListeners={signalListeners} />}
            </div>
        </div>
    </div>
}

export default BubbleChartTraders;