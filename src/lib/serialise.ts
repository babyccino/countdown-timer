import { SerialisedTimer, TimerLite } from "../models/timer"

export const serialiseTimer = (timer: TimerLite): SerialisedTimer => ({
	...timer,
	endTime: timer.endTime.toISOString(),
	createdAt: timer.createdAt.toISOString(),
})
export const deSerialiseTimer = (timer: SerialisedTimer): TimerLite => ({
	...timer,
	endTime: new Date(timer.endTime),
	createdAt: new Date(timer.createdAt),
})
