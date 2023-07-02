import { json } from "stream/consumers";
import { Undelegation } from "../models/Undelegation";
import BarChart from "../components/BarChart";
import DateFocus from "../components/DateFocus";


async function loadData() {
  try {
    const response = await fetch(
      'https://api.flipsidecrypto.com/api/v2/queries/ad69e563-319b-483e-9ef6-9512900783de/data/latest'
    );
    const jsonData: Undelegation[] = await response.json();
    jsonData.map((u: Undelegation) => {
      u.COMPLETION_TIME = new Date(u.COMPLETION_TIME)
      u.DATE_STR = u.COMPLETION_TIME.toISOString().split("T")[0];
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
  const sortedData = data?.filter((u1: Undelegation) => {
    if (u1.COMPLETION_TIME.getMonth() == 6) {
      console.log(u1.COMPLETION_TIME, currentTime, u1.COMPLETION_TIME >= currentTime)
    }
    return u1.COMPLETION_TIME >= currentTime
  }).sort((u1: Undelegation, u2: Undelegation) => u2.AMOUNT - u1.AMOUNT);
  const groupedData = sortedData ? groupData(sortedData) : []

  return <main className="flex min-h-screen flex-col items-center justify-between p-2 md:p-24">
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full">
        <BarChart chartData={groupedData} />
      </div>
      <div className="">
        <DateFocus sortedData={sortedData} date={'2023-07-03'} />
      </div>
    </div>
  </main>
}