import "primereact/resources/themes/md-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import ClientSideAstroChartPage from './ClientSideAstroChartPage';
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ITraderSummary } from "@/interfaces/Interfaces";
import { loadData } from "@/utils/Utils";

const client = new S3Client({
  region: 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID : '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? process.env.AWS_SECRET_ACCESS_KEY : '',
  }
})


export default async function Home() {
  const top_today_buyers: ITraderSummary[] | undefined = await loadData(client, 'astro_trades/data/summary_for_webapp/', "top_today_buyers.json");
  const top_weekly_buyers: ITraderSummary[] | undefined = await loadData(client, 'astro_trades/data/summary_for_webapp/', "top_weekly_buyers.json");
  const top_monthly_buyers: ITraderSummary[] | undefined = await loadData(client, 'astro_trades/data/summary_for_webapp/', "top_monthly_buyers.json");
  const top_today_sellers: ITraderSummary[] | undefined = await loadData(client, 'astro_trades/data/summary_for_webapp/', "top_today_sellers.json");
  const top_weekly_sellers: ITraderSummary[] | undefined = await loadData(client, 'astro_trades/data/summary_for_webapp/', "top_weekly_sellers.json");
  const top_monthly_sellers: ITraderSummary[] | undefined = await loadData(client, 'astro_trades/data/summary_for_webapp/', "top_monthly_sellers.json");

  const lastUpdateDate = await loadData(client, 'astro_trades/data/summary_for_webapp/', "top_today_buyers.json", false, true);
  const year = lastUpdateDate.substring(0, 4);
  const month = lastUpdateDate.substring(4, 6);
  const day = lastUpdateDate.substring(6, 8);
  const formatteLastUpdateDate = `${year}-${month}-${day}`;

  return (
    <div style={{ background: 'linear-gradient(to bottom, #041339, #37609f)' }}
      className="h-screen">
      <ClientSideAstroChartPage
        top_today_sellers={top_today_sellers ? top_today_sellers : []}
        top_today_buyers={top_today_buyers ? top_today_buyers : []}
        top_weekly_sellers={top_weekly_sellers ? top_weekly_sellers : []}
        top_weekly_buyers={top_weekly_buyers ? top_weekly_buyers : []}
        top_monthly_sellers={top_monthly_sellers ? top_monthly_sellers : []}
        top_monthly_buyers={top_monthly_buyers ? top_monthly_buyers : []}
        lastUpdateDate={formatteLastUpdateDate}
      />
    </div>
  )
}
