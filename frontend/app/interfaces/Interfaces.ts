export interface ITraderActivity {
    date: string,
    traderAddress: string,
    returnAmount: number
}

export interface ITraderSummary {
    xASTRO: number | undefined,
    SAYVE: number | undefined,
    ORNE: number | undefined,
    ASTRO: number | undefined,
    ampLUNA: number | undefined,
    ROAR: number | undefined,
    boneLuna: number | undefined,
    traderAddress: string,
    dollar_amount: number | undefined,
    total_astro_holdings: number | undefined,
    total_return_dollar_amount_label: string | undefined
}

export interface Undelegation {
    AMOUNT: number,
    TX_FROM: string,
    COMPLETION_TIME: Date
    DATE_STR: string
    ADDRESS_SHORT?: string
}

export enum TimeFrame {
    Today,
    LastWeek,
    LastMonth
}

export enum TraderType {
    Buyers,
    Sellers
}