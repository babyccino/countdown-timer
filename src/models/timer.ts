import prisma from "../db"
import { Timer as PrismaTimer } from "@prisma/client"

import type { Modify } from "../lib/util"

// The id will not always be required, ex: when creating a user
// NextJs doesn't like the Date object with the getStaticProps function
export type Timer = Modify<
	PrismaTimer,
	{ id?: string; password?: string; endTime: Date | string }
>
export { Visibility } from "@prisma/client"

export async function findById(id: string): Promise<Timer> {
	const timer = await prisma.timer.findFirst({
		where: {
			id,
		},
	})

	return timer
}

export async function create(timer: Timer): Promise<Timer> {
	// remove the id so SQL can create one itself
	const newTimer = await prisma.timer.create({
		data: { ...timer, id: undefined },
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
