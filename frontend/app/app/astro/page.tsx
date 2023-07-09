"use client"
import BarChart from "./BarChart";

export default async function Home() {

  return <>
    <div className="min-h-screen flex flex-col p-4">
      <div className="h-full flex flex-1 items-center justify-center space-x-4 md:px-24">
        <BarChart />
      </div>
    </div>
  </>
}