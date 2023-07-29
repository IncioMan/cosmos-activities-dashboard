import "primereact/resources/themes/md-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import ClientSideAstroWhalesDailyPage from './ClientSideAstroWhalesDailyPage';
import { S3Client } from "@aws-sdk/client-s3";
import { AstroWhaleDaily } from "@/interfaces/Interfaces";
import { loadData } from "@/utils/Utils";

export const dynamic = 'force-dynamic'
export const revalidate = 3600

const client = new S3Client({
  region: 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID : '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? process.env.AWS_SECRET_ACCESS_KEY : '',
  }
})


export default async function Home() {
  const data: AstroWhaleDaily[] = await loadData(client,
    'astro_trades/data/whales_daily_delta/', ".json",
    true);


  return (
    <div style={{ background: 'linear-gradient(to bottom, #041339, #37609f)' }}
      className="h-screen">
      <ClientSideAstroWhalesDailyPage
        data={data}
      />
    </div>
  )
}
