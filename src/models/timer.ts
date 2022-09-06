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
export { Visibility } from "@prisma/client"
export type TimerLite = Pick<Timer, "id" | "title" | "endTime">

export async function findById(id: string): Promise<Timer> {
	const timer = await prisma.timer.findFirst({
		where: {
			id,
		},
	})

	return timer
}

export async function findByIdSelect(
	id: string
): Promise<{ title: string; endTime: Date | string }> {
	const timer = await prisma.timer.findFirst({
		where: {
			id,
		},
		select: {
			endTime: true,
			title: true,
		},
	})

	return timer
}

export async function create(timer: Timer): Promise<Timer> {
	// remove the id so SQL can create one itself
	const newTimer = await prisma.timer.create({
		data: { ...timer, id: undefined, createdAt: undefined },
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
