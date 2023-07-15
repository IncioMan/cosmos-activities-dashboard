"use client"
//theme
import "primereact/resources/themes/md-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";

import React, { useEffect, useState } from "react";
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";//core
import imageFile from '../../public/astro.png';
import Image from 'next/image';
import { AstroScatterChartTraders } from "../components/AstroScatterChartTraders";
import { TimeFrame } from "@/interfaces/Interfaces";
import { time } from "console";

export default function Home() {
  const [excludeNoAstroHoldingsAddress, setExcludeNoAstroHoldingsAddress] = useState<boolean>(true)
  const [timeframe, setTimeframe] = useState<TimeFrame>(TimeFrame.Today);

  useEffect(() => {
    console.log(timeframe)
  }, [timeframe])

  return (
    <div style={{ background: 'linear-gradient(to bottom, #041339, #37609f)' }}
      className="h-screen">
      {/* HEADER*/}
      <div className="flex flex-row">
        <Image src={imageFile} alt="Description of the image" width={200} />
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
        </div>
      </div>
      {/* BODY */}
      <div className="h-[82%] flex flex-1 items-center justify-center">
        <div className="w-[1000px] h-[80%] flex justify-center items-center">
          <AstroScatterChartTraders
            excludeNoHolder={excludeNoAstroHoldingsAddress}
            timeFrame={timeframe}
          />
        </div>
      </div>
      {/* FOOTER */}
      <div className="flex justify-center items-end space-x-4">
        <a href="https://github.com/IncioMan" target="_blank">
          <FaGithub style={{ fontSize: '25px' }} color="#ffffff" />
        </a>
        <a href="https://twitter.com/IncioMan" target="_blank">
          <FaTwitter style={{ fontSize: '25px' }} color="#ffffff" />
        </a>
      </div>
    </div>
  )
}
