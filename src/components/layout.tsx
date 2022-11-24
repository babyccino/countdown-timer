import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { deleteCookie } from "cookies-next"
import React, { useEffect, useState } from "react"

import Loading from "./loading"
import { useUser } from "@/lib/hooks"

const CreateButton = ({ toolTip }: { toolTip: boolean }): JSX.Element => (
	<div
		style={{
			borderRadius: "50%",
			boxShadow: "0 0 12px -1px rgba(0,0,0,0.6)",
		}}
		className="group fixed w-14 h-14 text-center bottom-4 right-4 text-6xl bg-indigo-600 opacity-70 hover:opacity-100 transition-all
				motion-reduce:transition-none motion-reduce:opacity-100"
	>
		{toolTip && (
			<div
				className="transition-all motion-reduce:transition-none invisible group-hover:visible group-focus-within:visible group-active:visible
					opacity-0	group-hover:opacity-100 text-base text-gray-50 absolute bottom-full right-0 -mt-[2px] flex flex-col"
			>
				<div className="rounded-md bg-indigo-600 p-2 cursor-default w-36 shadow-xl">
					Sign in to create your own timer
				</div>
				<div className="ml-2 mb-[1px] inline-block overflow-hidden relative">
					<div className="h-3 w-3 ml-auto mr-5 origin-top-right rotate-45 bg-indigo-600 relative right-0" />
				</div>
			</div>
		)}
		<Link
			href="/timer/create"
			className="relative block bottom-[0.6rem] text-gray-100"
			aria-label="create new timer"
		>
			+
		</Link>
	</div>
)

export default function Layout({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const { user, error, mutateUser } = useUser()
	const [loading, setLoading] = useState(false)

	// passing the redirect route to the API call
	const loginHref = `/api/google?redirect=${router.pathname}`
	const logout = () => {
		deleteCookie("token")
		deleteCookie("user")
		mutateUser(undefined)
		router.replace("/")
	}

	useEffect(() => {
		const handleStart = (url: string) => url !== router.asPath && setLoading(true)
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
					<header
						className="flex flex-row justify-between md:justify-start items-center py-2 px-4 sm:px-6 md:px-8 md:space-x-10 border-b-2
							border-gray-100"
					>
						<Link href="/" className="flex justify-start" aria-label="homepage">
							<Image src="/logo.webp" alt="logo" height={70} width={70} />
						</Link>
						<div className="flex flex-row flex-1 items-center justify-end lg:w-0">
							{user && !error ? (
								<>
									<h2 className="whitespace-nowrap text-base font-medium text-gray-900">
										{user.displayName}
									</h2>
									<a
										href="#"
										className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md
											shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
										onClick={logout}
										role="button"
									>
										Logout
									</a>
								</>
							) : (
								<>
									<a
										href={loginHref}
										className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
									>
										Sign in
									</a>
									<a
										href={loginHref}
										className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md
											shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
									>
										Sign up
									</a>
								</>
							)}
						</div>
					</header>

					{loading && <Loading />}

					<CreateButton toolTip={!user || !!error} />

					<main className={`flex-1 flex flex-col py-2${loading ? " blur" : ""}`}>{children}</main>
				</div>
			</div>
		</>
	)
}
