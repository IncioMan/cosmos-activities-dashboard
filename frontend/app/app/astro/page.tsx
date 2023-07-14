"use client"
import BubbleChartTraders from "./BubbleChartTraders";
import AstroAddressDetails from './AstroAdressDetails'
import imageFile from './Astroport White Logo_900x360px.png';
import Image from 'next/image';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { useState } from "react";
import top_monthly_sellers from '../data/top_monthly_sellers.json'
import top_weekly_sellers from '../data/top_weekly_sellers.json'
import top_today_sellers from '../data/top_today_sellers.json'
import top_monthly_buyers from '../data/top_monthly_buyers.json'
import top_weekly_buyers from '../data/top_weekly_buyers.json'
import top_today_buyers from '../data/top_today_buyers.json'
import { ScatterChartTraders } from "./ScatterChartTraders";
import { RadioButton } from "primereact/radiobutton";



export default async function Home() {

  const [ingredient, setIngredient] = useState('');

  const selectAddress = (address: string) => {
    console.log(address)
    const newTab = window.open(`https://chainsco.pe/terra2/address/${address}`, '_blank');
    newTab?.focus();
  }

  return <>
    <div style={{ background: 'linear-gradient(to bottom, #041339, #37609f)' }}
      className="h-screen">
      <div className="flex">
        <Image src={imageFile} alt="Description of the image" width={200} />
      </div>
      <div className="h-[82%] flex flex-1 items-start justify-center">
        <div className="w-[1000px] h-[90%] flex justify-center items-center">
          <ScatterChartTraders />
        </div>
        {/*
        <BubbleChartTraders
          width={800}
          height={580}
          colorSchema="purplered"
          title="Top 20 ASTRO sellers today"
          rangeUp={5000}
          data={top_today_sellers}
          setAddress={selectAddress} />
          <BubbleChartTraders 
            width={800} height={580} 
            colorSchema="yellowgreen"
            title="Top 100 ASTRO buyers after vesting period ended (1st of July)"
            rangeUp={2500} 
            data={top_buyers} />
            <div className='w-full flex justify-center items-center'>
          <AstroAddressDetails
            tradersInfo={top_sellers}
            address={address}
          />
        </div>*/
        }

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