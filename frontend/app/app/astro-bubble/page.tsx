import "primereact/resources/themes/md-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import ClientSideAstroBubblePage from './ClientSideAstroBubblePage';
import { ITraderSummary, TimeFrame, TraderType } from "@/interfaces/Interfaces";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID : '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? process.env.AWS_SECRET_ACCESS_KEY : '',
  }
})

async function loadData(filename: string) {
  const command = new GetObjectCommand({
    Bucket: 'incioman-data-analysis',
    Key: `astro_trading/20230715/${filename}`,
  });

  try {
    const response = await client.send(command);
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    const str = await response?.Body?.transformToString();
    if (str) return JSON.parse(str)
  } catch (err) {
    console.error(err);
  }
};


export default async function Home() {
  const top_today_buyers: ITraderSummary[] | undefined = await loadData("top_today_buyers.json");
  const top_weekly_buyers: ITraderSummary[] | undefined = await loadData("top_weekly_buyers.json");
  const top_monthly_buyers: ITraderSummary[] | undefined = await loadData("top_monthly_buyers.json");
  const top_today_sellers: ITraderSummary[] | undefined = await loadData("top_today_sellers.json");
  const top_weekly_sellers: ITraderSummary[] | undefined = await loadData("top_weekly_sellers.json");
  const top_monthly_sellers: ITraderSummary[] | undefined = await loadData("top_monthly_sellers.json");

  return (
    <div style={{ background: 'linear-gradient(to bottom, #041339, #37609f)' }}
      className="h-screen">
      <ClientSideAstroBubblePage
        top_today_sellers={top_today_sellers}
        top_today_buyers={top_today_buyers}
        top_weekly_sellers={top_weekly_sellers}
        top_weekly_buyers={top_weekly_buyers}
        top_monthly_sellers={top_monthly_sellers}
        top_monthly_buyers={top_monthly_buyers}
      />
    </div>
  )
}
