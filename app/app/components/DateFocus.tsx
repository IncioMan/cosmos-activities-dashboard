import React from 'react'
import { Undelegation } from '../models/Undelegation'

interface Props {
    sortedData: Undelegation[] | undefined
    date: string | undefined
}

function DateFocus({ sortedData, date }: Props) {
    return (
        <ul>
            {sortedData?.filter((a: Undelegation) => a.DATE_STR === date).map((a: Undelegation) => <li>{a.AMOUNT}, {a.DATE_STR}, {a.TX_FROM}</li>)}
        </ul>
    )
}

export default DateFocus