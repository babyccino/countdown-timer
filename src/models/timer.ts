import prisma from "../db"
export { Visibility } from "@prisma/client"
import { Timer, User, Visibility } from "@prisma/client"

import type { Modify } from "../lib/util"

export type TimerLite = Pick<
	Timer,
	"id" | "title" | "endTime" | "createdAt"
> & { user?: User }
export type SerialisedTimer = Modify<
	TimerLite,
	{ endTime: string; createdAt: string }
>
const timerLiteSelect: Record<keyof TimerLite, boolean> = {
	id: true,
	endTime: true,
	title: true,
	createdAt: true,
	user: false,
}

export function findById(id: string): Promise<TimerLite | null> {
	return prisma.timer.findFirst({
		where: {
			id,
		},
		select: { ...timerLiteSelect, user: true },
	})
}

export function create(
	timer: Pick<Timer, "title" | "endTime" | "visiblity" | "password" | "userId">
): Promise<TimerLite> {
	// remove the id so SQL can create one itself
	return prisma.timer.create({
		data: { ...timer, id: undefined, createdAt: undefined },
		select: timerLiteSelect,
	})
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
export function getByEndTime(offsetDate?: Date): Promise<TimerLite[]> {
	return prisma.timer.findMany({
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
}

export function getByTimeCreated(offsetDate?: Date): Promise<TimerLite[]> {
	return prisma.timer.findMany({
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
}

export function getFromUserByEndTime(
	userId: string,
	offsetDate?: Date
): Promise<TimerLite[]> {
	return prisma.timer.findMany({
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
}

export function getFromUserByTimeCreated(
	userId: string,
	offsetDate?: Date
): Promise<TimerLite[]> {
	return prisma.timer.findMany({
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
}
