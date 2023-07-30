"use client"
import "primereact/resources/themes/md-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import React, { useEffect, useState } from "react";
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import imageFile from '../../public/astro.png';
import Image from 'next/image';
import { AstroScatterChartTraders } from "../components/AstroScatterChartTraders";
import { ITraderSummary, TimeFrame, TraderType } from "@/interfaces/Interfaces";
import AstroBubbleChartTraders from "../components/AstroBubbleChartTraders";

type Props = {
    top_today_sellers: ITraderSummary[]
    top_today_buyers: ITraderSummary[]
    top_weekly_sellers: ITraderSummary[]
    top_weekly_buyers: ITraderSummary[]
    top_monthly_sellers: ITraderSummary[]
    top_monthly_buyers: ITraderSummary[]
    lastUpdateDate: string
}

export default function Home({
    top_today_sellers,
    top_today_buyers,
    top_weekly_sellers,
    top_weekly_buyers,
    top_monthly_sellers,
    top_monthly_buyers,
    lastUpdateDate
}: Props) {
    const [excludeNoAstroHoldingsAddress, setExcludeNoAstroHoldingsAddress] = useState<boolean>(true)
    const [timeframe, setTimeframe] = useState<TimeFrame>(TimeFrame.Today);

    useEffect(() => {
        console.log(timeframe)
    }, [timeframe])

    const addressSelected = (address: string) => {
        try {
            const newTab = window.open(`https://chainsco.pe/terra2/address/${address}`, '_blank');
            newTab?.focus();
        } catch {
            console.error('Couldnt open link', address)
        }
    }

    return (
        <div style={{ background: 'linear-gradient(to bottom, #041339, #37609f)' }}
            className="h-screen">
            {/* HEADER*/}
            <div className="h-[20%] flex flex-col md:flex-row md:h-[10%]">
                <div className="flex justify-center items-center">
                    <Image src={imageFile} alt="Description of the image" width={200} />
                </div>
                <div className="flex-1 text-white text-sm flex justify-around items-center p-4">
                    <div className="flex align-items-center">
                        <Checkbox
                            onChange={e => { setExcludeNoAstroHoldingsAddress(e.checked === undefined ? false : e.checked) }}
                            checked={excludeNoAstroHoldingsAddress}>
                        </Checkbox>
                        <label htmlFor="ingredient1" className="ml-2">Exclude traders with no ASTRO holdings (possible arbitrage bots)</label>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton inputId="today" name="timeframe" value={TimeFrame.Today} onChange={(e) => setTimeframe(e.value)} checked={timeframe === TimeFrame.Today} />
                            <label htmlFor="today" className="ml-2">Today</label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton inputId="last_week" name="timeframe" value={TimeFrame.LastWeek} onChange={(e) => setTimeframe(e.value)} checked={timeframe === TimeFrame.LastWeek} />
                            <label htmlFor="last_week" className="ml-2">Last Week</label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton inputId="last_month" name="timeframe" value={TimeFrame.LastMonth} onChange={(e) => setTimeframe(e.value)} checked={timeframe === TimeFrame.LastMonth} />
                            <label htmlFor="last_month" className="ml-2">Last Month</label>
                        </div>
                    </div>
                    <Button
                        style={{ color: 'white' }}
                        icon="pi pi-info-circle"
                        rounded text
                        tooltip={`This graph shows the top 50 traders for the $ASTRO token in the selected timeframe along with their $ASTRO holdings. The data has been last updated on the ${lastUpdateDate}`}
                        tooltipOptions={{
                            position: 'bottom',
                            mouseTrack: false,
                            mouseTrackTop: 15
                        }}
                    />
                </div>
            </div>
            {/* BODY */}
            <div className="h-[70%] md:h-[80%] flex flex-1 items-center justify-center">
                <div className="w-full md:w-[80%] h-[80%] flex flex-col md:flex-row justify-center items-center overflow-scroll md:overflow-hidden pt-[35%] md:pt-0">
                    <AstroBubbleChartTraders
                        width={500}
                        height={500}
                        colorSchema="purplered"
                        title="Top 50 ASTRO sellers"
                        rangeUp={5000}
                        excludeNoHolder={excludeNoAstroHoldingsAddress}
                        timeFrame={timeframe}
                        traderType={TraderType.Sellers}
                        setAddress={addressSelected}
                        top_today_sellers={top_today_sellers}
                        top_today_buyers={top_today_buyers}
                        top_weekly_sellers={top_weekly_sellers}
                        top_weekly_buyers={top_weekly_buyers}
                        top_monthly_sellers={top_monthly_sellers}
                        top_monthly_buyers={top_monthly_buyers} />
                    <AstroBubbleChartTraders
                        width={500}
                        height={500}
                        colorSchema="yellowgreen"
                        title="Top 50 ASTRO buyers"
                        rangeUp={5000}
                        excludeNoHolder={excludeNoAstroHoldingsAddress}
                        timeFrame={timeframe}
                        traderType={TraderType.Buyers}
                        setAddress={addressSelected}
                        top_today_sellers={top_today_sellers}
                        top_today_buyers={top_today_buyers}
                        top_weekly_sellers={top_weekly_sellers}
                        top_weekly_buyers={top_weekly_buyers}
                        top_monthly_sellers={top_monthly_sellers}
                        top_monthly_buyers={top_monthly_buyers} />
                </div>
            </div>
            {/* FOOTER */}
            <div className="flex justify-center items-center space-x-4 h-[10%] md:h-[10%]">
                <div className="flex space-x-2">
                    <a href="https://github.com/IncioMan" target="_blank">
                        <FaGithub style={{ fontSize: '25px' }} color="#ffffff" />
                    </a>
                    <a href="https://twitter.com/IncioMan" target="_blank">
                        <FaTwitter style={{ fontSize: '25px' }} color="#ffffff" />
                    </a>
                </div>
            </div>
        </div>
    )
}
