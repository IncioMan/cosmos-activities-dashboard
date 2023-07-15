import "primereact/resources/themes/md-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import ClientSideAstroBubblePage from './ClientSideAstroBubblePage';

import top_today_sellers from '../../data/top_today_sellers.json';
import top_today_buyers from '../../data/top_today_buyers.json';
import top_weekly_sellers from '../../data/top_weekly_sellers.json';
import top_weekly_buyers from '../../data/top_weekly_buyers.json';
import top_monthly_sellers from '../../data/top_monthly_sellers.json';
import top_monthly_buyers from '../../data/top_monthly_buyers.json';

export default function Home() {

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
