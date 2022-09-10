import prisma from "../db"
import { User as PrismaUser } from "@prisma/client"

import type { Optional } from "../lib/util"

// The id will not always be required, ex: when creating a user
// and will not always be returned, ex: from an api request
export type User = Optional<PrismaUser, "id">

export async function findById(id: string): Promise<User | null> {
	const user = await prisma.user.findFirst({
		where: {
			id,
		},
	})

	return user
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
