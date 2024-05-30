import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  const body = await req.json()

  const response = await fetch('https://mentorium.su/api/api_v1/lessons', {
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

  const { data } = await response.json()

  return NextResponse.json({
    success: true,
    lesson: data,
  })
}

export const PUT = async (req: NextRequest) => {
  const body = await req.json()

  const response = await fetch('https://mentorium.su/api/api_v1/lessons', {
    method: 'PUT',
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

  const { data } = await response.json()

  return NextResponse.json({
    success: true,
    lesson: data,
  })
}

export const DELETE = async (req: NextRequest) => {
  const uid = new URL(req.url).searchParams.get('uid')
  const courseUid = new URL(req.url).searchParams.get('courseUid')

  const response = await fetch(
    `https://mentorium.su/api/api_v1/lessons?uid=${uid}&courseUid=${courseUid}`,
    {
      method: 'DELETE',
      headers: {
        Cookie: cookies().toString(),
        'Content-Type': 'application/json',
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

  return NextResponse.json({
    success: true,
  })
}
