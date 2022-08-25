import Head from "next/head";
import DumbTimer from "../../components/dumbTimer";
import { dateDifference } from "../../lib/date";

export default function Test() {
  return (
    <>
      <Head>
        <title>Title timer</title>
      </Head>
      <DumbTimer
        diff={dateDifference(new Date("2023-01-01T20:43:21Z"), new Date("2022-08-31"))}
        title="This is a this is a This is a this is a This is a this is a This is a this is a This is a this is a This is a this is a This is a this is a This is a this is a very long title"
      />
    </>
  )
}
