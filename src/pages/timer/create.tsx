import Head from "next/head"
import { useRouter } from "next/router"
import { FormEventHandler, useState } from "react"

import axios from "axios"

import { getCurrentDateInHtmlFormat } from "@/lib/date"
import Loading from "@/components/loading"

function Error(): JSX.Element {
	return (
		<>
			<div className="error fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-l text-red-900 bg-red-100 p-2 border rounded border-red-900">
				There was a server error creating a new post
				<br />
				Try reloading the page and trying again
			</div>
			<style jsx={true}>{`
				.error {
					animation: appearDisappear 5s ease 0s 1 forwards;
				}

				@keyframes appearDisappear {
					0% {
						z-index: 100;
						opacity: 0;
					}
					10% {
						opacity: 1;
					}
					90% {
						opacity: 1;
					}
					99% {
						z-index: 100;
						opacity: 0;
					}
					100% {
						z-index: -10;
						opacity: 0;
					}
				}
			`}</style>
		</>
	)
}

export default function Create() {
	// Todo: add pw
	// const [visibility, setVisibility] = useState("Public")
	const [postError, setPostError] = useState(false)
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		setPostError(false)
		setLoading(true)

		try {
			event.preventDefault()

			const form = event.currentTarget
			const formElements = form.elements as typeof form.elements & {
				title: HTMLInputElement
				endDate: HTMLInputElement
				visibility: HTMLInputElement
				password?: HTMLInputElement
			}

			const data = {
				title: formElements.title.value,
				endDate: formElements.endDate.value,
				visibility: formElements.visibility.value,
				password: formElements.password?.value,
			}

			const res = await axios.post("/api/timers", data)
			const returnData = res.data
			console.log("returnData: ", returnData)

			router.push(returnData.redirect)
		} catch (error) {
			setPostError(true)
			console.error(error)
		}

		setLoading(false)
	}

	return (
		<>
			<Head>
				<title>Create a timer</title>
			</Head>
			{loading && <Loading />}
			<div
				className={
					"flex-1 md:grid md:grid-cols-3 md:gap-6 py-3 md:px-4 min-h-full min-w-full " +
					(loading ? "blur" : "")
				}
			>
				<div className="md:col-span-1 p-4">
					<div className="px-4 sm:px-0">
						<h3 className="text-lg font-medium leading-6 text-gray-900">
							Create a countdown timer
						</h3>
						<p className="mt-1 text-sm text-gray-600">
							Create a countdown timer you can share with your friends!
						</p>
					</div>
				</div>
				<div className="mt-8 mx-2 md:mt-0 md:col-span-2 border-t-2 md:border-t-0 md:border-l-2 border-gray-100">
					<form
						onSubmit={handleSubmit}
						className="md:pl-6 flex flex-col justify-between"
					>
						<div className="px-2 py-4 bg-white">
							<div className="grid grid-cols-6 gap-6">
								<div className="col-span-6 sm:col-span-4">
									<label
										htmlFor="title"
										className="block text-sm font-medium text-gray-700"
									>
										Title
									</label>
									<input
										type="text"
										id="title"
										name="title"
										required
										minLength={1}
										maxLength={100}
										title="Titles must be alphanumeric and between 1 and 100 characters long"
										className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border shadow-sm border-gray-300 rounded-md p-2"
									/>
								</div>

								<div className="col-span-6 sm:col-span-4">
									<label
										htmlFor="endDate"
										className="block text-sm font-medium text-gray-700"
									>
										Date
									</label>
									<input
										type="datetime-local"
										name="endDate"
										id="endDate"
										min={getCurrentDateInHtmlFormat()}
										required
										className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border shadow-sm border-gray-300 rounded-md p-2"
									/>
								</div>

								<div className="col-span-6 sm:col-span-3">
									<label
										htmlFor="visibility"
										className="block text-sm font-medium text-gray-700"
									>
										Visibility
									</label>
									<select
										// Todo: add pw
										// onChange={(e) => setVisibility(e.target.value)}
										id="visibility"
										name="visibility"
										className="mt-1 block w-full py-2 px-3 border-gray-300 bg-white rounded-md border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
									>
										<option>Public</option>
										<option>Hidden</option>
										{/*
											// Todo: add pw
											<option>Protected</option>
										*/}
									</select>
								</div>

								{/* { 
                  // Todo: add pw
                  visibility === "Protected"
                    &&
                  <div className="col-span-6 sm:col-span-3">
                    <label 
                      htmlFor="password" 
                      className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="text"
                      name="password"
                      id="password"
                      required
                      autoComplete="new-password"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border shadow-sm border-gray-300 rounded-md p-2"
                    />
                  </div>
                } */}
							</div>
						</div>
						<div className="px-2 py-3 text-right sm:px-6">
							<button
								type="submit"
								className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Save
							</button>
						</div>
					</form>
				</div>
			</div>
			{postError && <Error />}
		</>
	)
}
