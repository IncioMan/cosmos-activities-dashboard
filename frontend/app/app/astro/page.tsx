"use client"
import BubbleChartTraders from "./BubbleChartTraders";
import imageFile from './Astroport White Logo_900x360px.png';
import Image from 'next/image';
import { FaGithub, FaTwitter } from 'react-icons/fa';



export default async function Home() {

  return <>
    <div style={{ background: 'linear-gradient(to bottom, #041339, #37609f)' }}
      className="min-h-screen">
      <div className="flex">
        <Image src={imageFile} alt="Description of the image" width={200} />
      </div>
      <div className="h-full flex flex-1 items-start justify-center">
        <BubbleChartTraders width={800} height={580} colorSchema="purplered"
          title="Top 100 ASTRO sellers after vesting period ended (1st of July)"
          rangeUp={5000} dataUrl="./top_sellers.json" />
        {/*<BubbleChartTraders width={800} height={580} colorSchema="yellowgreen"
          title="Top 100 ASTRO buyers after vesting period ended (1st of July)"
          rangeUp={2500} dataUrl="./top_buyers.json" />*/}
      </div>
      <div className="flex justify-center items-end space-x-4">
        <a href="https://github.com/IncioMan" target="_blank">
          <FaGithub style={{ fontSize: '25px' }} color="#ffffff" />
        </a>
        <a href="https://twitter.com/IncioMan" target="_blank">
          <FaTwitter style={{ fontSize: '25px' }} color="#ffffff" />
        </a>
      </div>
    </div>
  </>
}