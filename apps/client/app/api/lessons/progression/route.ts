import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { apiUrl } from '../../../../shared/lib'

export const POST = async (req: NextRequest) => {
  const body = await req.json()

  const response = await fetch(apiUrl('/lessons/progression'), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Cookie: cookies().toString(),
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()

    if (error.statusCode === 401) {
      return NextResponse.redirect('/login')
    }

    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        code: error.statusCode,
      },
    })
  }

  return NextResponse.json({
    success: true,
  })
}
