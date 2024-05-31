import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { apiUrl } from '../../../../shared/lib'

export const POST = async (req: NextRequest) => {
  const body = await req.formData()

  const response = await fetch(apiUrl('/courses/upload'), {
    method: 'POST',
    body,
    headers: {
      Cookie: cookies().toString(),
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

  const { data } = await response.json()

  return NextResponse.json({
    success: true,
    fileUrl: data.Location,
  })
}
