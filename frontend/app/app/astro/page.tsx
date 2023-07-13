"use client"
import BubbleChartTraders from "./BubbleChartTraders";
import AstroAddressDetails from './AstroAdressDetails'
import imageFile from './Astroport White Logo_900x360px.png';
import Image from 'next/image';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { useState } from "react";
import top_buyers from '../data/top_buyers.json'
import top_sellers from '../data/top_sellers.json'
import { ScatterChartTraders } from "./ScatterChartTraders";



export default async function Home() {

  const [address, setMyAdress] = useState<string | undefined>()

  const selectAddress = (address: string) => {
    console.log(address)
    setMyAdress(address)
  }

  return <>
    <div style={{ background: 'linear-gradient(to bottom, #041339, #37609f)' }}
      className="min-h-screen">
      <div className="flex">
        <Image src={imageFile} alt="Description of the image" width={200} />
      </div>
      <div className="h-full flex flex-1 items-start justify-center">
        <div className="w-[1600px] h-[900px]">
          <ScatterChartTraders />
        </div>
        {/*
          <BubbleChartTraders
            width={800}
            height={580}
            colorSchema="purplered"
            title="Top 100 ASTRO sellers after vesting period ended (1st of July)"
            rangeUp={5000}
            data={top_sellers}
            setAddress={selectAddress} />
          <BubbleChartTraders 
            width={800} height={580} 
            colorSchema="yellowgreen"
            title="Top 100 ASTRO buyers after vesting period ended (1st of July)"
            rangeUp={2500} 
            data={top_buyers} />*/
        }
        <div className='w-full flex justify-center items-center'>
          <AstroAddressDetails
            tradersInfo={top_sellers}
            address={address}
          />
        </div>
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