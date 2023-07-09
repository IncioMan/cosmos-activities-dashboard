"use client"
import BubbleChart from "./BubbleChart";
import TestChart from "./TestChart";

export default async function Home() {

  return <>
    <div style={{ background: 'linear-gradient(to bottom, #041339, #37609f)' }} className="min-h-screen">
      <div className="h-full flex flex-1 items-center justify-center">
        <BubbleChart />
      </div>
    </div>
  </>
}