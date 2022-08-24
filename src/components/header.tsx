import { useEffect } from "react"
import { deleteCookie } from "cookies-next"
import { useRouter } from "next/router"

import { useUser } from "../lib/hooks"
import Link from "next/link"

function User(): JSX.Element {
  const { user, error } = useUser()
  useEffect(() => {
    console.log("header: ", { user, error })
  }, [user, error])
  
  const router = useRouter()
  // passing the redirect route to the API call
  const href = `/api/google?redirect=${router.pathname}`
  const logout = () => {
    deleteCookie("token")
    router.replace("/")
  }
  
  if (user && !error) {
    return (
      <>
        <div className="whitespace-nowrap text-base font-medium text-gray-900">{user.displayName}</div>
        <a
          href="#"
          className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          onClick={logout}
        >Logout</a>
      </>
    )
  } else {
    return (
      <>
        <a href={href} className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"> Sign in </a>
        <a href={href} className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"> Sign up </a>
      </>
    )
  }
}

export default function Header(): JSX.Element {
  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/">
              <a>
                Logo
              </a>
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <User />
          </div>
        </div>
      </div>
    </div>
  )
}
