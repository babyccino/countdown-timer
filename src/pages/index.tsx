import Head from "next/head"
import { GetStaticProps } from "next"
import { useRef, useState } from "react"

import axios from "axios"

import { getRecentPublic, TimerLite } from "../models/timer"
import { dateDifference } from "../lib/date"
import { useAtPageBottom } from "../lib/hooks"

import Timer from "../components/timer"

export default function Index({ timers, offset }: {timers: TimerLite[], offset: string}): JSX.Element {
  const [newTimers, setNewTimers] = useState<TimerLite[]>([])
  const loadingTimers = useRef(false);
  const reachedEnd = useRef(false);

  useAtPageBottom(() => {
    if (loadingTimers.current || reachedEnd.current) return

    loadingTimers.current = true
    const newOffset = (newTimers.length === 0) ? offset : (new Date(newTimers.at(-1).endTime)).toISOString()
    axios.get(`/api/timers?offset=${newOffset}`).then(({ data }) => {
      console.log({data})
      
      if (data.timers.length !== 0) {
        setNewTimers((prev: TimerLite[]) => prev.concat(data.timers as TimerLite[]))
      }

      if (data.timers.length < 9) reachedEnd.current = true

      loadingTimers.current = false
    })
  }, 10, [newTimers])

  const mapTimerToComponent = (keyOffset: number = 0) => (({ title, endTime, id }: TimerLite, index: number): JSX.Element => {
    const diff = dateDifference(new Date(endTime))
    const props = {title, diff, id}
    return (
      <div key={index + keyOffset}>
        <Timer {...props} preview />
      </div>
    )
  })

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="w-full md:grid grid-cols-3 gap-6 px-4 md:px-8 pt-6">
        {timers.map(mapTimerToComponent())}
        {newTimers.map(mapTimerToComponent(9))}
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const timers = await getRecentPublic()
  const offset = (timers[timers.length - 1].endTime as Date).toISOString()
  
  return {
    props: {
      timers: timers.map(timer => ({
        ...timer,
        endTime: (timer.endTime as Date).toISOString()
      })),
      offset,
    },
    revalidate: 60,
  }
}
