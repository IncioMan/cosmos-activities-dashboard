"use client"
import React, { useEffect, useState } from 'react'

interface Props {
    address: string | undefined
}

function AstroAdressDetails({ address }: Props) {

    return (
        <div className='flex flex-col h-full justify-start items-center'>
            <div className='text-white text-md'>
                <a href={`https://chainsco.pe/terra2/address/${address}`} className='font-medium text-blue-600 dark:text-blue-500 hover:underline' target="blank">{address}</a>
            </div>
        </div >
    )
}

export default AstroAdressDetails