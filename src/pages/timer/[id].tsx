import Head from "next/head"

import type { SerialisedTimer } from "../../models/timer"
import { deSerialiseTimer } from "../../lib/serialise"
import { dateDifference } from "../../lib/date"
import Timer from "../../components/timer"

export default function TimerPage({
	serialisedTimer,
}: {
	serialisedTimer: SerialisedTimer
}) {
	const timer = deSerialiseTimer(serialisedTimer)
	const diff = dateDifference(timer.endTime)
	if (timer.id === undefined) throw new Error("Timer data missing id")
	return (
		<>
			<Head>
				<title>{`Countdown timer | ${timer.title}`}</title>
			</Head>
			<Timer diff={diff} title={timer.title} id={timer.id} preview={false} />
		</>
	)
}

// static props

import { GetStaticProps, GetStaticPaths } from "next"

import {
	getAllIds as getAllTimerIds,
	findByIdSelect as findTimerById,
} from "../../models/timer"
import { serialiseTimer } from "../../lib/serialise"

export const getStaticPaths: GetStaticPaths = async () => {
	const ids = await getAllTimerIds()
	const paths = ids.map((id) => ({ params: { id } }))

	return {
		paths,
		fallback: "blocking",
	}
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	console.log(`[Next.js] running getStaticProps on path /timer/${params?.id}`)
	if (params === undefined || params.id === "undefined")
		return { notFound: true }

	const timer = await findTimerById(params.id as string)
	if (!timer) {
		console.log(`[Next.js] path ${params.id} not found`)
		return { notFound: true }
	}

	return {
		props: {
			serialisedTimer: serialiseTimer(timer),
		},
	}
}
