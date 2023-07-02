"use client"
import React, { useEffect, useState } from 'react'
import { Undelegation } from '../models/Undelegation'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto'
import { Colors } from 'chart.js';
ChartJS.register(Colors);
import { CategoryScale } from 'chart.js';
ChartJS.register(CategoryScale);


interface Props {
    sortedData: Undelegation[] | undefined
}

function DateFocus({ sortedData }: Props) {

    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
    const [filteredData, setFilteredData] = useState<Undelegation[] | undefined>([])

    useEffect(() => {
        setFilteredData(sortedData?.filter((a: Undelegation) => a.DATE_STR === date))
    }, [date, sortedData])


    const data = {
        labels: filteredData?.map(a => a.TX_FROM),
        datasets: [{
            label: 'ATOM',
            data: filteredData?.map(a => a.AMOUNT),
            hoverOffset: 4
        }]
    };

    const options = {
        plugins: {
            legend: {
                position: 'right'
            },
            colors: {
                enabled: false
            }
        },
        layout: {
            padding: {
                bottom: 5
            }
        }
    }

    return (
        <div className='p-2 flex flex-col'>
            <div className='w-full flex items-center justify-center'>
                <Select onValueChange={(e) => setDate(e)} defaultValue={date}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a date" />
                    </SelectTrigger>
                    <SelectContent>
                        {[...new Set(sortedData?.map(a => a.DATE_STR))].sort((a, b) => a.localeCompare(b)).map(s => <SelectItem value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className='px-8'>
                <Doughnut
                    data={data}
                    options={options}
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead className="text-right">ATOM</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filteredData?.map((a: Undelegation) => {
                            return <TableRow>
                                <TableCell>{a.DATE_STR}</TableCell>
                                <TableCell>{a.ADDRESS_SHORT}</TableCell>
                                <TableCell className="text-right">{a.AMOUNT}</TableCell>
                            </TableRow>
                        })
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default DateFocus