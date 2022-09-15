import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { deleteCookie } from "cookies-next"
import React, { useEffect, useState } from "react"

import Loading from "./loading"
import { useUser } from "../lib/hooks"

function CreateButton(): JSX.Element {
	return (
		<div
			style={{
				borderRadius: "50%",
				boxShadow: "0 0 12px -1px rgba(0,0,0,0.9)",
			}}
			className="fixed w-14 h-14 text-center bottom-4 right-4 text-6xl bg-indigo-600 "
		>
			<Link href="/timer/create">
				<a
					style={{ bottom: "0.6rem" }}
					className="relative block bottom-2 text-gray-100"
				>
					+
				</a>
			</Link>
		</div>
	)
}

export default function Layout({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const { user, error, mutateUser } = useUser()
	const [loading, setLoading] = useState(false)

	// passing the redirect route to the API call
	const href = `/api/google?redirect=${router.pathname}`
	const logout = () => {
		deleteCookie("token")
		deleteCookie("user")
		mutateUser(undefined)
		router.replace("/")
	}

	useEffect(() => {
		const handleStart = (url: string) =>
			url !== router.asPath && setLoading(true)
		const handleComplete = (url: string) => setLoading(false)

		router.events.on("routeChangeStart", handleStart)
		router.events.on("routeChangeComplete", handleComplete)
		router.events.on("routeChangeError", handleComplete)
		return () => {
			router.events.off("routeChangeStart", handleStart)
			router.events.off("routeChangeComplete", handleComplete)
			router.events.off("routeChangeError", handleComplete)
		}
	}, [router])

	return (
		<>
			<Head>
				<meta
					name="description"
					content="Create an online countdown timer you can share with your friends!"
				/>
			</Head>
			<div className="min-h-screen flex justify-center">
				<div className="min-h-screen w-full lg:max-w-7xl flex flex-col">
					<div className="flex flex-row justify-between md:justify-start items-center py-2 px-4 sm:px-6 md:px-8 md:space-x-10 border-b-2 border-gray-100">
						<Link href="/" className="flex justify-start">
							<a>
								<Image src="/logo.webp" alt="logo" height="70px" width="70px" />
							</a>
						</Link>
						<div className="flex flex-row flex-1 items-center justify-end lg:w-0">
							{user && !error ? (
								<>
									<div className="whitespace-nowrap text-base font-medium text-gray-900">
										{user.displayName}
									</div>
									<a
										href="#"
										className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
										onClick={logout}
									>
										Logout
									</a>
								</>
							) : (
								<>
									<a
										href={href}
										className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
									>
										{" "}
										Sign in{" "}
									</a>
									<a
										href={href}
										className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
									>
										{" "}
										Sign up{" "}
									</a>
								</>
							)}
						</div>
					</div>

					{loading && <Loading />}

					{user && !error && <CreateButton />}

					<main className={`flex flex-1 ${loading ? "blur" : ""}`}>
						{children}
					</main>
				</div>
			</div>
		</>
	)
}
