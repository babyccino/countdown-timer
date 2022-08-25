import Header from './header'

export default function Layout({ children }) {
  return (
    <>
      <div className='min-h-screen flex justify-center'>
        <div className="min-h-screen w-full lg:max-w-7xl flex flex-col">
          <Header />
          <main className='flex flex-1'>{children}</main>
        </div>
      </div>
    </>
  )
}