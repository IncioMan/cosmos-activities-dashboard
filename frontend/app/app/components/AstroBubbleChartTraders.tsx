import React, { useEffect, useState } from 'react';
import { Vega } from 'react-vega';
import top_today_sellers from '../../data/top_today_sellers.json'
import top_today_buyers from '../../data/top_today_buyers.json'
import top_weekly_sellers from '../../data/top_weekly_sellers.json'
import top_weekly_buyers from '../../data/top_weekly_buyers.json'
import top_monthly_sellers from '../../data/top_monthly_sellers.json'
import top_monthly_buyers from '../../data/top_monthly_buyers.json'
import { ITraderSummary, TimeFrame, TraderType } from '@/interfaces/Interfaces';

interface props {
    rangeUp: number,
    width: number,
    height: number,
    timeFrame: TimeFrame,
    excludeNoHolder: boolean,
    colorSchema: string,
    title: string,
    traderType: TraderType
    setAddress: (address: string) => void
}

export const AstroBubbleChartTraders = ({ rangeUp, title, width, height, timeFrame, excludeNoHolder, traderType, colorSchema, setAddress }: props) => {
    const [traderData, setTraderData] = useState<ITraderSummary[]>([])
    const [spec, setSpec] = useState()

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
            top_sellers = top_sellers.filter((s: ITraderSummary) => s.total_astro_holdings && s.total_astro_holdings > 10)
            top_buyers = top_buyers.filter((s: ITraderSummary) => s.total_astro_holdings && s.total_astro_holdings > 10)
        }
        else {
            console.log('Including no holders in data')
        }

        switch (traderType) {
            case TraderType.Buyers:
                setTraderData(top_buyers)
                break
            case TraderType.Sellers:
                setTraderData(top_sellers)
                break
        }
    }, [timeFrame, excludeNoHolder, traderType])

    useEffect(() => {
        if (rangeUp === undefined) {
            return
        }
        console.log(traderData)
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
                    "values": traderData
                }
            ],
            "scales": [
                {
                    "name": "size",
                    "domain": { "data": "table", "field": "dollar_amount" },
                    "range": [500, rangeUp]
                },
                {
                    "name": "color",
                    "type": "sequential",
                    "domain": { "data": "table", "field": "total_astro_holdings" },
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
                            "fill": { "scale": "color", "field": "total_astro_holdings" },
                            "xfocus": { "signal": "cx" },
                            "yfocus": { "signal": "cy" }
                        },
                        "update": {
                            "size": { "signal": "pow(datum.dollar_amount,1.2)", "scale": "size" },
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
                            "text": { "field": "datum.total_return_dollar_amount_label" }
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
    }, [rangeUp, traderData])

    function handleSignals(...args: any) {
        console.log(args)
        setAddress(args[1]['traderAddress']);
    }

    const signalListeners = { clickEvent: handleSignals };

    return <div className="h-full w-full flex p-4 py-8">
        <div className='w-4/7 flex justify-center items-start'>
            <div>
                {(spec) && <Vega
                    spec={spec}
                    actions={false}
                    signalListeners={signalListeners} />}
            </div>
        </div>
    </div>
}

export default AstroBubbleChartTraders;