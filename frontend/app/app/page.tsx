import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center p-24">

      <div className="mb-32 flex flex-wrap justify-center lg:mb-0  lg:text-left">
        <a
          href="/astro"
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
              Astro{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
          </div>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Inspect daily, weekly and monthly trading activities for the $ASTRO token
          </p>
        </a>
        <a
          href="/cosmos"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <div className='flex items-center space-x-2 pb-2'>
            <Image
              src="/cosmos-atom-logo.png"
              alt="Vercel Logo"
              className="dark:invert"
              width={40}
              height={40}
              priority
            />
            <h2 className={`text-2xl font-semibold`}>
              Cosmos{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
          </div>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Keep an eye on the undelegation of the $ATOM token
          </p>
        </a>

      </div>
    </main>
  )
}
