import prisma from "../db"
import type { User } from "@prisma/client"
export type { User } from "@prisma/client"

export function findById(id: string): Promise<User | null> {
	return prisma.user.findFirst({
		where: {
			id,
		},
	})
}

export async function getAllIds(): Promise<string[]> {
	const ids = await prisma.user.findMany({
		select: {
			id: true,
		},
	})

	return ids.map(({ id }) => id)
}

export function findByEmail(email: string): Promise<User | null> {
	return prisma.user.findFirst({
		where: {
			email,
		},
	})
}

export function findByEmailOrCreate(user: User): Promise<User> {
	return prisma.user.upsert({
		where: {
			email: user.email,
		},
		update: {},
		create: {
			...user,
			id: undefined,
		},
	})
}
