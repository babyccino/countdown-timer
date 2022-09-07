import Head from 'next/head'
import Header from './header'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta name="description" content="Create an online timer you can share with your friends!" />
      </Head>
      <div className='min-h-screen flex justify-center'>
        <div className="min-h-screen w-full lg:max-w-7xl flex flex-col">
          <Header />
          <main className='flex flex-1'>{children}</main>
        </div>
      </div>
    </>
  )
}