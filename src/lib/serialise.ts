import { SerialisedTimer, Timer } from "@/models/timer"

export const serialiseTimer = (timer: Timer): SerialisedTimer => ({
	...timer,
	endTime: timer.endTime.toISOString(),
	createdAt: timer.createdAt.toISOString(),
})
export const deSerialiseTimer = (timer: SerialisedTimer): Timer => ({
	...timer,
	endTime: new Date(timer.endTime),
	createdAt: new Date(timer.createdAt),
})
