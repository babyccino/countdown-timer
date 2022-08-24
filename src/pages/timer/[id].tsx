import Head from 'next/head'
import { GetStaticProps, GetStaticPaths } from 'next'

import { Timer, getAllIds as getAllTimerIds, findById as findTimerById } from "../../models/timer"
import { dateDifference } from '../../lib/date'
import { useEffect, useState } from 'react'

export default function _Timer({ timer }: { timer: Timer }) {
  timer.endTime = (typeof timer.endTime === "string") ? new Date(timer.endTime) : timer.endTime
  
  const [diff, setDiff] = useState(dateDifference(timer.endTime, new Date()))
  
  useEffect(() => {
    console.log(timer)
    
    function reset() {
      setTimeout(() => {
        timer.endTime = (typeof timer.endTime === "string") ? new Date(timer.endTime) : timer.endTime

        setDiff(dateDifference(timer.endTime, new Date()))
        reset();
      }, 1000);
    }

    reset();
  }, []);

  return (
    <>
      <Head>
        <title>{timer.title}</title>
      </Head>
      <article>
        <h1>{timer.title}</h1>
        <div id="days">
          days: { diff.days }
        </div>
        <div id="hours">
          hours: { diff.hours }
        </div>
        <div id="minutes">
          minutes: { diff.minutes }
        </div>
        <div id="seconds">
          seconds: { diff.seconds }
        </div>
      </article>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = await getAllTimerIds()
  const paths = ids.map(id => ({ params: { id: id.toString() } }))
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const timer = await findTimerById(params.id as string)
  if (timer.endTime instanceof Date) {
    timer.endTime = timer.endTime.toISOString()
  }
  return {
    props: {
      timer,
    }
  }
}