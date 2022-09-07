import Head from "next/head";

export default function NotFound(): JSX.Element {
  return (
    <>
      <Head>
        <title>404 | Page not found</title>
      </Head>
      <div className="w-full h-full flex flex-col justify-center items-center gap-6">
        <h1 className="text-9xl">404</h1>
        <h2 className="text-5xl">Page was not found</h2>
      </div>
    </>
  )
}