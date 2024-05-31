import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { apiUrl } from '../../../../shared/lib'

export const POST = async (req: NextRequest) => {
  const body = await req.json()

  const response = await fetch(apiUrl('/auth/register'), {
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

  return NextResponse.json({
    success: true,
  })
}
