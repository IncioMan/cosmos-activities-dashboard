import { redirect } from 'next/navigation'
//core
import "primereact/resources/primereact.min.css";

export default function Home() {
  redirect("cosmos")
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      </div>
    </main>
  )
}
