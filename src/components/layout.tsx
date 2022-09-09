import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'


import Header from './header'
import Loading from './loading'

export default function Layout({ children }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => (url !== router.asPath) && setLoading(true)
    const handleComplete = (url: string) => setLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  })
  return (
    <>
      <Head>
        <meta name="description" content="Create an online timer you can share with your friends!" />
      </Head>
      <div className='min-h-screen flex justify-center'>
        <div className="min-h-screen w-full lg:max-w-7xl flex flex-col">
          <Header />

          { loading && <Loading /> }

          <main className={`flex flex-1 ${loading ? "blur" : ""}`}>{children}</main>
        </div>
      </div>
    </>
  )
}