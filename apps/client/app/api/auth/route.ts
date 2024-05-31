import type { CookieListItem } from 'next/dist/compiled/@edge-runtime/cookies'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import parseSetCookie from 'set-cookie-parser'
import { apiUrl } from '../../../shared/lib'

export const POST = async (req: NextRequest) => {
  const body = await req.json()

  const response = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()

    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        code: error.statusCode,
      },
    })
  }

  const cookie = parseSetCookie(response.headers.getSetCookie())

  cookies().set(cookie[0] as CookieListItem)
  cookies().set(cookie[1] as CookieListItem)

  return NextResponse.json({
    success: true,
  })
}
