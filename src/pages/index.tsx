import Head from "next/head"
import Link from "next/link"

export default function Index() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Link href="/timer/create">
        <a>Create</a>
      </Link>
    </>
  )
}
