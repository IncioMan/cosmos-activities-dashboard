import "primereact/resources/themes/md-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import ClientSideAstroChartPage from './ClientSideAstroChartPage';
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ITraderSummary } from "@/interfaces/Interfaces";

const client = new S3Client({
  region: 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID : '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? process.env.AWS_SECRET_ACCESS_KEY : '',
  }
})

const getDateFormatted = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const dateString = `${year}${month}${day}`;
  return dateString
}

async function loadData(filename: string, returnDate = false) {
  for (let i = 0; i < 30; i++) {
    const currentDate = new Date();

    currentDate.setDate(currentDate.getDate() - i);
    const dateString = getDateFormatted(currentDate)

    console.log(`Trying s3 folder astro_trading/${dateString}...`)
    const command = new GetObjectCommand({
      Bucket: 'incioman-data-analysis',
      Key: `astro_trading/${dateString}/${filename}`,
    });

    try {
      const response = await client.send(command);
      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      const str = await response?.Body?.transformToString();
      if (str && !returnDate) return JSON.parse(str)
      else return dateString
    } catch (err) {
      console.error(err);
    }
  }
};

export default async function Home() {
  const top_today_buyers: ITraderSummary[] | undefined = await loadData("top_today_buyers.json");
  const top_weekly_buyers: ITraderSummary[] | undefined = await loadData("top_weekly_buyers.json");
  const top_monthly_buyers: ITraderSummary[] | undefined = await loadData("top_monthly_buyers.json");
  const top_today_sellers: ITraderSummary[] | undefined = await loadData("top_today_sellers.json");
  const top_weekly_sellers: ITraderSummary[] | undefined = await loadData("top_weekly_sellers.json");
  const top_monthly_sellers: ITraderSummary[] | undefined = await loadData("top_monthly_sellers.json");

  const lastUpdateDate = await loadData("top_today_buyers.json", true);
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
