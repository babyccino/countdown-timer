import prisma from "../db"
import { Timer as PrismaTimer } from "@prisma/client"

import type { Modify } from "../lib/util"

// The id will not always be required, ex: when creating a user
// NextJs doesn't like the Date object with the getStaticProps function
export type Timer = Modify<PrismaTimer, { id?: string; endTime: Date | string }>

export const findById = async (id: string): Promise<Timer> => {
	const timer = await prisma.timer.findFirst({
		where: {
			id,
		},
	})

	return timer
}

export const create = async (timer: Timer): Promise<Timer> => {
	// remove the id so SQL can create one itself
	const newTimer = await prisma.timer.create({
		data: { ...timer, id: undefined },
	})

	return newTimer
}

export const getAll = async (): Promise<Timer[]> => {
	const timers = await prisma.timer.findMany()
	return timers
}

export const getAllIds = async (): Promise<string[]> => {
	const ids = await prisma.timer.findMany({
		select: {
			id: true,
		},
	})

	return ids.map((obj) => obj.id)
}
