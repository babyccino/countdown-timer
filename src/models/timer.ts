import prisma from "../db"
import { Timer as PrismaTimer, Visibility } from "@prisma/client"

import type { Modify } from "../lib/util"

// The id will not always be required, ex: when creating a user
// NextJs doesn't like the Date object with the getStaticProps function
export type Timer = Modify<
	PrismaTimer,
	{
		id?: string
		password?: string
		endTime: Date | string
		createdAt?: Date | string
	}
>
export type TimerLite = Pick<Timer, "id" | "title" | "endTime">
export { Visibility } from "@prisma/client"

export async function findById(id: string): Promise<Timer> {
	const timer = await prisma.timer.findFirst({
		where: {
			id,
		},
	})

	return timer
}

export async function findByIdSelect(id: string): Promise<TimerLite> {
	const timer = await prisma.timer.findFirst({
		where: {
			id,
		},
		select: {
			id: true,
			endTime: true,
			title: true,
		},
	})

	return timer
}

export async function create(timer: Timer): Promise<TimerLite> {
	// remove the id so SQL can create one itself
	const newTimer = await prisma.timer.create({
		data: { ...timer, id: undefined, createdAt: undefined },
		select: {
			id: true,
			endTime: true,
			title: true,
		},
	})

	return newTimer
}

export async function getAll(): Promise<Timer[]> {
	const timers = await prisma.timer.findMany()
	return timers
}

export async function getAllIds(): Promise<string[]> {
	const ids = await prisma.timer.findMany({
		select: {
			id: true,
		},
	})

	return ids.map((obj) => obj.id)
}

const RECENT_POST_COUNT = 9
export async function getRecentPublic(offsetDate?: Date): Promise<TimerLite[]> {
	const timers = await prisma.timer.findMany({
		take: RECENT_POST_COUNT,
		orderBy: { endTime: "asc" },
		where: {
			visiblity: Visibility.PUBLIC,
			endTime: {
				gt: offsetDate,
			},
		},
		select: {
			id: true,
			title: true,
			endTime: true,
		},
	})

	return timers
}
