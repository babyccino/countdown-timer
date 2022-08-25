import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"

import { deleteCookie } from "cookies-next"

import { useUser } from "../lib/hooks"

function User(): JSX.Element {
  const { user, error, mutateUser } = useUser()
  
  const router = useRouter()
  // passing the redirect route to the API call
  const href = `/api/google?redirect=${router.pathname}`
  const logout = () => {
    deleteCookie("token")
    mutateUser({})
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
        <div style={{borderRadius: "50%", boxShadow: "0 0 12px -1px rgba(0,0,0,0.9)"}} className="fixed w-14 h-14 text-center bottom-4 right-4 text-6xl bg-indigo-600 ">
          <Link href="/timer/create">
              <a style={{bottom: "0.6rem"}} className="relative block bottom-2 text-gray-100">+</a>
          </Link>
        </div>
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
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex flex-row justify-between items-center border-b-2 py-2 border-gray-100 md:px-2 md:justify-start md:space-x-10">
          <Link href="/" className="flex justify-start">
            <a>
              <Image src="/logo.webp" height="70px" width="70px"/> 
            </a>
          </Link>
          <div className="flex flex-row flex-1 items-center justify-end lg:w-0">
            <User />
          </div>
        </div>
      </div>
    </div>
  )
}
