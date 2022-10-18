import prisma from "../db"
export { Visibility } from "@prisma/client"
import { Timer, Visibility } from "@prisma/client"

import type { Modify } from "../lib/util"

export type TimerLite = Pick<Timer, "id" | "title" | "endTime" | "createdAt">
export type SerialisedTimer = Modify<
	TimerLite,
	{ endTime: string; createdAt: string }
>
const timerLiteSelect = {
	id: true,
	endTime: true,
	title: true,
	createdAt: true,
}

export async function findById(id: string): Promise<Timer | null> {
	const timer: Timer | null = await prisma.timer.findFirst({
		where: {
			id,
		},
	})

	return timer
}

export async function findByIdSelect(id: string): Promise<TimerLite | null> {
	const timer = await prisma.timer.findFirst({
		where: {
			id,
		},
		select: timerLiteSelect,
	})

	return timer
}

export async function create(timer: Omit<Timer, "id">): Promise<TimerLite> {
	// remove the id so SQL can create one itself
	const newTimer = await prisma.timer.create({
		data: { ...timer, id: undefined, createdAt: undefined },
		select: timerLiteSelect,
	})

	return newTimer
}

export function getAll(): Promise<Timer[]> {
	return prisma.timer.findMany()
}

export async function getAllIds(): Promise<string[]> {
	const ids = await prisma.timer.findMany({
		select: {
			id: true,
		},
	})

	return ids.map((obj) => obj.id)
}

const POST_COUNT = 9
export async function getByEndTime(offsetDate?: Date): Promise<TimerLite[]> {
	const timers = await prisma.timer.findMany({
		take: POST_COUNT,
		orderBy: { endTime: "asc" },
		where: {
			visiblity: Visibility.PUBLIC,
			endTime: {
				gt: offsetDate,
			},
		},
		select: timerLiteSelect,
	})

	return timers
}

export async function getByTimeCreated(
	offsetDate?: Date
): Promise<TimerLite[]> {
	const timers = await prisma.timer.findMany({
		take: POST_COUNT,
		orderBy: { createdAt: "asc" },
		where: {
			visiblity: Visibility.PUBLIC,
			createdAt: {
				gt: offsetDate,
			},
		},
		select: timerLiteSelect,
	})

	return timers
}

export async function getFromUserByEndTime(
	userId: string,
	offsetDate?: Date
): Promise<TimerLite[]> {
	const timers = await prisma.timer.findMany({
		take: POST_COUNT,
		orderBy: { endTime: "asc" },
		where: {
			visiblity: Visibility.PUBLIC,
			endTime: {
				gt: offsetDate,
			},
			userId,
		},
		select: timerLiteSelect,
	})

	return timers
}

export async function getFromUserByTimeCreated(
	userId: string,
	offsetDate?: Date
): Promise<TimerLite[]> {
	const timers = await prisma.timer.findMany({
		take: POST_COUNT,
		orderBy: { createdAt: "asc" },
		where: {
			visiblity: Visibility.PUBLIC,
			createdAt: {
				gt: offsetDate,
			},
			userId,
		},
		select: timerLiteSelect,
	})

	return timers
}
