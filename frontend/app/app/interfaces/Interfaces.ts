interface ITraderActivity {
    date: string,
    traderAddress: string,
    returnAmount: number
}

interface ITraderSummary {
    xASTRO: number | undefined,
    SAYVE: number | undefined,
    ORNE: number | undefined,
    ASTRO: number | undefined,
    ampLUNA: number | undefined,
    ROAR: number | undefined,
    boneLuna: number | undefined,
    traderAddress: string,
    last_trade_date: string | undefined,
    total_return_amount: number | undefined,
    Total_astro: number | undefined,
    total_return_amount_label: string | undefined
}