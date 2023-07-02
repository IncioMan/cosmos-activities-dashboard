"use client"
import React from 'react'
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
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto'
import { CategoryScale } from 'chart.js';
ChartJS.register(CategoryScale);


interface Props {
    sortedData: Undelegation[] | undefined
    date: string | undefined
}

function DateFocus({ sortedData, date }: Props) {

    const filteredData = sortedData?.filter((a: Undelegation) => a.DATE_STR === date)
    const sum = filteredData?.map(a => a.AMOUNT).reduce((total, amount) => total + amount)

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
            }
        }
    }

    return (
        <div className='p-2'>
            <div className='p-8'>
                <Doughnut
                    data={data}
                    options={options}
                />
            </div>
            <Table>
                {
                    <TableCaption>Total undelegating ATOM: {sum}</TableCaption>
                }
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
                                <TableCell>{a.TX_FROM}</TableCell>
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