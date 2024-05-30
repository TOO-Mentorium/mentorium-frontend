import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  const body = await req.formData()

  console.log(body.get('file'))

  const response = await fetch(
    'https://mentorium.su/api/api_v1/courses/upload',
    {
      method: 'POST',
      body,
      headers: {
        Cookie: cookies().toString(),
      },
    },
  )

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

  console.log(data.Location)

  return NextResponse.json({
    success: true,
    fileUrl: data.Location,
  })
}
