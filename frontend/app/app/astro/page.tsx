"use client"
//theme
import "primereact/resources/themes/md-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";

import React, { useState } from "react";
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";//core
import imageFile from '../../public/astro.png';
import Image from 'next/image';
import { AstroScatterChartTraders } from "../components/AstroScatterChartTraders";

export default function Home() {
  const [excludeNoAstroHoldingsAddress, setExcludeNoAstroHoldingsAddress] = useState<boolean>(true)
  const [ingredient, setIngredient] = useState('');

  return (
    <div style={{ background: 'linear-gradient(to bottom, #041339, #37609f)' }}
      className="h-screen">
      {/* HEADER*/}
      <div className="flex flex-row">
        <Image src={imageFile} alt="Description of the image" width={200} />
        <div className="flex-1 text-white flex justify-around items-center p-4">
          <div className="flex align-items-center">
            <Checkbox
              onChange={e => { setExcludeNoAstroHoldingsAddress(e.checked) }}
              checked={excludeNoAstroHoldingsAddress}>
            </Checkbox>
            <label htmlFor="ingredient1" className="ml-2">Cheese</label>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex align-items-center">
              <RadioButton inputId="ingredient1" name="pizza" value="Cheese" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Cheese'} />
              <label htmlFor="ingredient1" className="ml-2">Cheese</label>
            </div>
            <div className="flex align-items-center">
              <RadioButton inputId="ingredient2" name="pizza" value="Mushroom" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Mushroom'} />
              <label htmlFor="ingredient2" className="ml-2">Mushroom</label>
            </div>
            <div className="flex align-items-center">
              <RadioButton inputId="ingredient3" name="pizza" value="Pepper" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Pepper'} />
              <label htmlFor="ingredient3" className="ml-2">Pepper</label>
            </div>
            <div className="flex align-items-center">
              <RadioButton inputId="ingredient4" name="pizza" value="Onion" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Onion'} />
              <label htmlFor="ingredient4" className="ml-2">Onion</label>
            </div>
          </div>
        </div>
      </div>
      {/* BODY */}
      <div className="h-[82%] flex flex-1 items-center justify-center">
        <div className="w-[1000px] h-[80%] flex justify-center items-center">
          <AstroScatterChartTraders />
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
