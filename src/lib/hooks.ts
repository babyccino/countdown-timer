import { useEffect } from "react";
import Router from "next/router";

import useSWR from "swr";
import axios from "axios";
import { getCookie } from "cookies-next";

import { User } from "../models";

const fetcher = async (url: string) => {
	return (await axios.get(url)).data;
};

export function useUser({ redirectTo = "", redirectIfFound = false } = {}) {
	const {
		data,
		mutate: mutateUser,
		error,
	} = useSWR("/api/user", fetcher, {
		onErrorRetry(error, key, config, revalidate, { retryCount }) {
			// never retry on 401
			if (error.response.status === 401) return;

			// Only retry up to 10 times.
			if (retryCount >= 10) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), 5000);
		},
		revalidateOnFocus: false,
	});
	const swrUser: User.User = data;

	let cookieUser: User.User;
	useEffect(() => {
		const cookie = getCookie("user");
		if (cookie) {
			cookieUser = JSON.parse(cookie.toString()) as User.User;
		}
	}, []);

	useEffect(() => {
		// if no redirect needed, just return (example: already on /dashboard)
		// if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
		if (!redirectTo || !swrUser) return;

		if (
			// If redirectTo is set, redirect if the user was not found.
			(redirectTo && !redirectIfFound && !swrUser) ||
			// If redirectIfFound is also set, redirect if the user was found
			(redirectIfFound && swrUser)
		) {
			Router.push(redirectTo);
		}
	}, [swrUser, redirectIfFound, redirectTo]);

	return { user: swrUser || cookieUser, mutateUser, error };
}
