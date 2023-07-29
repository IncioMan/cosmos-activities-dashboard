import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center p-24">

      <div className="mb-32 flex flex-wrap justify-center lg:mb-0  lg:text-left">
        <a
          href="/astro-chart"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <div className='flex items-center space-x-2 pb-2'>
            <Image
              src="/astro-dark.png"
              alt="Vercel Logo"
              width={40}
              height={40}
              priority
            />
            <h2 className={`text-2xl font-semibold`}>
              Astro Chart{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
          </div>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Inspect trading activities with a traditional plot
          </p>
        </a>
        <a
          href="/astro-bubble"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <div className='flex items-center space-x-2 pb-2'>
            <Image
              src="/astro-dark.png"
              alt="Vercel Logo"
              width={40}
              height={40}
              priority
            />
            <h2 className={`text-2xl font-semibold`}>
              Astro Bubbles{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
          </div>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Inspect trading activities with a packed bubble chart
          </p>
        </a>
        <a
          href="/astro-whales"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <div className='flex items-center space-x-2 pb-2'>
            <Image
              src="/astro-dark.png"
              alt="Vercel Logo"
              width={40}
              height={40}
              priority
            />
            <h2 className={`text-2xl font-semibold`}>
              Astro Whales{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
          </div>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Visualize the daily delta amounts accumulated/sold by whales
          </p>
        </a>
      </div>
    </main>
  )
}
