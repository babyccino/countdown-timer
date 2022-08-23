import Header from './header'

export default function Layout({ children }) {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex flex-1'>{children}</main>
    </div>
  )
}