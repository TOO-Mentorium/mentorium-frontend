'use client'

import { Group, Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconEdit, IconExclamationMark, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NextLink from 'next/link'
import type { LessonSimplified } from '../../entities/lesson/types'

export const LessonControlPanel = ({
  courseId,
  lessonId,
  initialLesson,
}: {
  courseId: string
  lessonId: string
  initialLesson: LessonSimplified | null
}) => {
  const router = useRouter()

  const [deleting, setDeleting] = useState(false)

  const handleDeleteClick = async () => {
    setDeleting(true)

    const response = await fetch(
      `https://localhost:3000/api/lessons?uid=${lessonId}&courseUid=${courseId}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const data = (await response.json()) as {
      success: boolean
      error?: {
        message: string
        code: number
      }
    }

    if (!data.success) {
      notifications.show({
        title: 'Server error',
        message:
          'An unexpected error occurred while creating the course. Please try again later.',
        color: 'red',
        autoClose: 5000,
        icon: <IconExclamationMark size="20px" />,
      })
    }

    if (data.success) {
      if (!initialLesson) {
        router.push(`/studio/courses/${courseId}`)

        return
      }

      router.push(`/studio/courses/${courseId}/lessons/${initialLesson.uid}`)
    }

    setDeleting(false)
  }

  return (
    <Group justify="flex-end">
      <Button
        component={NextLink}
        href={`/studio/courses/${courseId}/edit-lesson/${lessonId}`}
        leftSection={<IconEdit />}
        size="md"
        style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)' }}
      >
        Edit
      </Button>
      <Button
        color="red.8"
        leftSection={<IconTrash />}
        loading={deleting}
        onClick={handleDeleteClick}
        size="md"
        style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)' }}
      >
        Delete
      </Button>
    </Group>
  )
}
