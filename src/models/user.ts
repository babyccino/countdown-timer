import prisma from "../db"
import { User as PrismaUser } from "@prisma/client"
export type User = PrismaUser

export async function findById(id: string): Promise<User | null> {
	const user = await prisma.user.findFirst({
		where: {
			id,
		},
	})

	return user
}

export async function getAllIds(): Promise<string[]> {
	const ids = await prisma.user.findMany({
		select: {
			id: true,
		},
	})

	return ids.map(({ id }) => id)
}

export async function findByEmail(email: string): Promise<User | null> {
	const user = await prisma.user.findFirst({
		where: {
			email,
		},
	})

	return user
}

export async function findByEmailOrCreate(user: User): Promise<User> {
	const newUser = await prisma.user.upsert({
		where: {
			email: user.email,
		},
		update: {},
		create: {
			...user,
			id: undefined,
		},
	})

	return newUser
}
