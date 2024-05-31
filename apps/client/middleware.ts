import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import parseSetCookie from 'set-cookie-parser'
import type { CookieListItem } from 'next/dist/compiled/@edge-runtime/cookies'

const protectedRoutes = ['/studio/*', '/profile']
const publicRoutes = ['/login', '/create-account', '/courses']

export default async (req: NextRequest) => {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  const accessToken = cookies().get('Authentication')?.value
  const refreshToken = cookies().get('Refresh')?.value

  if (!accessToken || !refreshToken) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    if (isPublicRoute) {
      return NextResponse.next()
    }
  }

  // if (!accessToken && refreshToken) {
  //   const response = await fetch('https://mentorium.su/api/api_v1/auth/refresh', {
  //     method: 'POST',
  //     headers: {
  //       Cookie: cookies().toString(),
  //       'Content-Type': 'application/json',
  //     },
  //   })

  //   if (!response.ok) {
  //     return NextResponse.redirect(new URL('/login', req.nextUrl))
  //   }

  //   const cookie = parseSetCookie(response.headers.getSetCookie())

  //   cookies().set(cookie[0] as CookieListItem)
  //   cookies().set(cookie[1] as CookieListItem)
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
