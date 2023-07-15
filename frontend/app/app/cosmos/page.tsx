import { json } from "stream/consumers";
import { Undelegation } from "../../interfaces/Interfaces";
import CosmosBarChart from "../components/CosmosBarChart";
import CosmosDateFocus from "../components/CosmosDateFocus";
import { FaGithub, FaTwitter } from 'react-icons/fa';


async function loadData() {
  try {
    const response = await fetch(
      'https://api.flipsidecrypto.com/api/v2/queries/ad69e563-319b-483e-9ef6-9512900783de/data/latest'
    );
    const jsonData: Undelegation[] = await response.json();
    jsonData.map((u: Undelegation) => {
      u.COMPLETION_TIME = new Date(u.COMPLETION_TIME)
      u.DATE_STR = u.COMPLETION_TIME.toISOString().split("T")[0];
      u.ADDRESS_SHORT = u.TX_FROM.slice(0, 10) + '...' + u.TX_FROM.slice(u.TX_FROM.length - 5, u.TX_FROM.length);
    })

    return jsonData
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function groupData(jsonData: Undelegation[]) {

  const sumAmountByDate: { [date: string]: number } = {};
  for (const undelegation of jsonData) {
    const completionDate = undelegation.DATE_STR
    if (sumAmountByDate[completionDate]) {
      sumAmountByDate[completionDate] += undelegation.AMOUNT;
    } else {
      sumAmountByDate[completionDate] = undelegation.AMOUNT;
    }
  }
  // Convert sumAmountByDate to an array of key-value pairs
  const sortedArray = Object.entries(sumAmountByDate);

  // Sort the array by DATE_STR in lexicographic order
  sortedArray.sort((a, b) => a[0].localeCompare(b[0]));

  const groupObjects = sortedArray.map((i: [string, number]) => {
    return {
      day: i[0],
      amount: i[1]
    }
  })
  return groupObjects
}

export default async function Home() {
  const data: Undelegation[] | undefined = await loadData();
  const currentTime = new Date();
  // 30 days back in time
  currentTime.setDate(currentTime.getDate() - 30);
  //
  const sortedData = data?.filter((u1: Undelegation) => {
    return u1.COMPLETION_TIME >= currentTime
  }).sort((u1: Undelegation, u2: Undelegation) => u2.AMOUNT - u1.AMOUNT);
  const groupedData = sortedData ? groupData(sortedData) : []

  return <>
    <div className="min-h-screen flex flex-col px-4 py-8">
      <div className="h-full flex flex-1 items-center justify-center space-x-4 md:px-12">
        <div className="w-2/3 h-full" style={{ height: "500px" }}>
          <CosmosBarChart chartData={groupedData} />
        </div>
        <div className="w-1/3">
          <CosmosDateFocus sortedData={sortedData} />
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <a href="https://github.com/IncioMan" target="_blank">
          <FaGithub style={{ fontSize: '25px' }} color="#536471" />
        </a>
        <a href="https://twitter.com/IncioMan" target="_blank">
          <FaTwitter style={{ fontSize: '25px' }} color="#536471" />
        </a>
      </div>
    </div>
  </>
}