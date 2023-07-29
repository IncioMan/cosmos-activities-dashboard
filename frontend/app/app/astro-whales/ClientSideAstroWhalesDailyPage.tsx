"use client"
import "primereact/resources/themes/md-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { FaGithub, FaTwitter } from 'react-icons/fa';
import { AstroWhaleDaily } from "@/interfaces/Interfaces";
import AstroBarCharWhalesDaily from "../components/AstroBarCharWhalesDaily";
import Image from "next/image";

import imageFile from '../../public/astro.png';
import { Button } from "primereact/button";

interface Props {
    data: AstroWhaleDaily[];
}

export default function Home({
    data
}: Props) {

    return (
        <div style={{ background: 'linear-gradient(to bottom, #041339, #37609f)' }}
            className="h-screen">
            {/* HEADER*/}
            <div className="flex flex-row">
                <Image src={imageFile} alt="Description of the image" width={200} />
                <div className="flex-1 text-white text-sm flex justify-end items-center p-4 pr-20">
                    <Button
                        style={{ color: 'white' }}
                        icon="pi pi-info-circle"
                        rounded text
                        tooltip={`Are whales overall accumulating or selling? This graph shows the daily delta amount traded (sold/bought) by the top 1% of ASTRO holders, hence whales.`}
                        tooltipOptions={{
                            position: 'bottom',
                            mouseTrack: false,
                            mouseTrackTop: 15
                        }}
                    />
                </div>
            </div>
            {/* BODY */}
            <div className="h-[80%] flex flex-1 items-center justify-center">
                <div className="w-[1200px] h-[90%] flex justify-center items-center">
                    <AstroBarCharWhalesDaily data={data} />
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
