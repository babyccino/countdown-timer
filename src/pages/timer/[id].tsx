import Head from 'next/head'
import { GetStaticProps, GetStaticPaths } from 'next'

import { getAllIds as getAllTimerIds, findByIdSelect as findTimerById, TimerLite } from "../../models/timer"
import { dateDifference } from '../../lib/date'
import Timer from '../../components/timer'

export default function TimerPage({ timer }: { timer: TimerLite }) {
  timer.endTime = (typeof timer.endTime === "string") ? new Date(timer.endTime) : timer.endTime

  const title = `Countdown timer | ${timer.title}` 

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Timer diff={dateDifference(timer.endTime)} title={timer.title} id={timer.id} preview={false}/>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = await getAllTimerIds()
  const paths = ids.map(id => ({ params: { id } }))

  return {
    paths,
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  console.log(`[Next.js] running getStaticProps on path ${params.id}`)
  if (params.id === "undefined") return { notFound: true }

  const timer = await findTimerById(params.id as string)
  if (!timer) {
    console.log(`[Next.js] path ${params.id} not found`)
    return { notFound: true }
  }
  if (timer.endTime instanceof Date) {
    timer.endTime = timer.endTime.toISOString()
  }
  
  return {
    props: {
      timer,
    },
  }
}