import React, { useEffect, useState } from 'react';
import { Vega } from 'react-vega';
import barchart from './barchart.json';

export const BarChart = () => {
    const [rangeUp, setRangeUp] = useState(5000)
    const [spec, setSpec] = useState()

    useEffect(() => {
        if (rangeUp === undefined) {
            return
        }
        setSpec({
            "$schema": "https://vega.github.io/schema/vega/v5.json",
            "width": 1000,
            "height": 800,
            "padding": { "left": 5, "right": 5, "top": 20, "bottom": 0 },
            "autosize": "none",
            "signals": [
                { "name": "cx", "update": "width / 2" },
                { "name": "cy", "update": "height / 2" },
                {
                    "name": "gravityX",
                    "value": 0.2,
                },
                {
                    "name": "gravityY",
                    "value": 0.1,
                }
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
                    "range": { "interpolate": "rgb", "scheme": "blues" }
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
                            "stroke": { "value": "white" },
                            "strokeWidth": { "value": 1 },
                            "tooltip": { "signal": "datum" }
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

            ]
        })
    }, [rangeUp])

    return (
        <>
            {(spec) && <Vega spec={spec} actions={false} />}
            <button onClick={() => { setRangeUp(rangeUp + 1000) }}>Zoom In</button>
            <button onClick={() => { setRangeUp(5000) }}>Reset</button>
        </>
    )
}

export default BarChart;