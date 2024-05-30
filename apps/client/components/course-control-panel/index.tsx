'use client'

import { Group, Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  IconExclamationMark,
  IconShare2,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { revalidateTag } from 'next/cache'
import NextLink from 'next/link'
import type { Course } from '../../entities/course'
import { bffUrl } from '../../shared/lib'

export const CourseControlPanel = ({ course }: { course: Course }) => {
  const router = useRouter()

  const [publishing, setPublishing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteClick = async () => {
    setDeleting(true)

    const response = await fetch(
      bffUrl(`/courses?uid=${course.uid}`),
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
      router.push(`/studio/courses`)
    }

    setDeleting(false)
  }

  const handlePublishClick = async () => {
    setPublishing(true)

    const response = await fetch(bffUrl(`/courses`), {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({
        name: course.name,
        slug: course.slug,
        imageUrl: course.imageUrl,
        description: course.description,
        whatWillLearn: course.whatWillLearn,
        prerequisites: course.prerequisites,
        isPublished: true,
        uid: course.uid,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = (await response.json()) as {
      
      success: boolean
      error?: {
        message: string
        code: number
      }
    }

    if (!data.success) {


console.log(data)
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
      notifications.show({
        title: 'Course published',
        message: 'The course has been successfully published.',
        color: 'blue',
        autoClose: 5000,
        icon: <IconShare2 size="20px" />,
      })
    }

    setPublishing(false)
  }

  return (
    <Group gap="sm">
      <Button
        disabled={course.lessons.length === 0}
        gradient={{
          from: 'red.6',
          to: 'indigo.6',
        }}
        leftSection={<IconShare2 size="23px" />}
        loading={publishing}
        onClick={handlePublishClick}
        size="md"
        style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)' }}
        variant="gradient"
      >
        Publish
      </Button>
      <Button
        component={NextLink}
        href={`/studio/edit-course/${course.uid}`}
        leftSection={<IconEdit />}
        size="md"
        style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)' }}
      >
        Edit
      </Button>
      <Button
        color="red.8"
        leftSection={<IconTrash size="23px" />}
        loading={deleting}
        onClick={() => handleDeleteClick()}
        size="md"
        style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)' }}
      >
        Delete
      </Button>
    </Group>
  )
}
