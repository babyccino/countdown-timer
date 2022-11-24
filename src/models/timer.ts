import prisma from "../db"
export { Visibility } from "@prisma/client"
import { Timer as PrismaTimer, User as PrismaUser, Visibility } from "@prisma/client"

import type { Modify } from "@/lib/util"

export type User = Readonly<Omit<PrismaUser, "email">>
export type Timer = Readonly<
	Pick<PrismaTimer, "id" | "title" | "endTime" | "createdAt"> & {
		user: User
	}
>
export type SerialisedTimer = Modify<Timer, { endTime: string; createdAt: string }>
const timerLiteSelect = {
	id: true,
	endTime: true,
	title: true,
	createdAt: true,
	user: {
		select: {
			id: true,
			displayName: true,
		},
	},
}

export const findById = (id: string): Promise<Timer | null> =>
	prisma.timer.findFirst({
		where: {
			id,
		},
		select: timerLiteSelect,
	})

export const create = (
	timer: Pick<PrismaTimer, "title" | "endTime" | "visiblity" | "password" | "userId">
): Promise<Timer> =>
	// remove the id so SQL can create one itself
	prisma.timer.create({
		data: { ...timer, id: undefined, createdAt: undefined },
		select: timerLiteSelect,
	})

export const getAll = (): Promise<PrismaTimer[]> => prisma.timer.findMany()

export const getAllIds = (): Promise<string[]> =>
	prisma.timer
		.findMany({
			select: {
				id: true,
			},
		})
		.then((ids) => ids.map((obj) => obj.id))

const POST_COUNT = 9
export const getByEndTime = (offsetDate?: Date): Promise<Timer[]> =>
	prisma.timer.findMany({
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

export const getByTimeCreated = (offsetDate?: Date): Promise<Timer[]> =>
	prisma.timer.findMany({
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

export const getFromUserByEndTime = (userId: string, offsetDate?: Date): Promise<Timer[]> =>
	prisma.timer.findMany({
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

export const getFromUserByTimeCreated = (userId: string, offsetDate?: Date): Promise<Timer[]> =>
	prisma.timer.findMany({
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
