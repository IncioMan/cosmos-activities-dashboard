"use client"
import BubbleChart from "./BubbleChart";
import TestChart from "./TestChart";
import imageFile from './Astroport White Logo_900x360px.png';
import Image from 'next/image';

export default async function Home() {

  return <>
    <div style={{ background: 'linear-gradient(to bottom, #041339, #37609f)' }} className="min-h-screen">
      <Image src={imageFile} alt="Description of the image" width={200} />
      <div className="h-full flex flex-1 items-start justify-center">
        <BubbleChart />
      </div>
    </div>
  </>
}