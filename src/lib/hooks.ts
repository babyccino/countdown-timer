import { useEffect } from "react"

import useSWR from "swr"
import axios from "axios"
import { getCookie } from "cookies-next"

import { User } from "../models/user"

const fetcher = async (url: string) => (await axios.get(url)).data

export function useUser() {
	const {
		data,
		mutate: mutateUser,
		error,
	} = useSWR("/api/user", fetcher, {
		onErrorRetry(error, key, config, revalidate, { retryCount }) {
			// never retry on 401
			if (error.response.status === 401) return

			console.log(error)

			// Only retry up to 10 times.
			if (retryCount >= 10) return

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), 5000)
		},
		revalidateOnFocus: false,
	})
	const swrUser: User = data

	let cookieUser: User
	useEffect(() => {
		const cookie = getCookie("user")
		if (cookie) {
			cookieUser = JSON.parse(cookie.toString()) as User
		}
	}, [])

	return { user: swrUser || cookieUser, mutateUser, error }
}

export function useAtPageBottom(
	cb: (offset?: number) => void,
	offset: number = 0,
	dependencies: any
): void {
	useEffect(() => {
		const scrollListener = () => {
			if (
				window.scrollY + window.innerHeight + offset + 1 >=
				document.body.scrollHeight
			) {
				cb(document.body.scrollHeight - window.scrollY + window.innerHeight)
			}
		}
		scrollListener()

		window.addEventListener("scroll", scrollListener)
		return () => window.removeEventListener("scroll", scrollListener) // clean up
	}, dependencies)
}
