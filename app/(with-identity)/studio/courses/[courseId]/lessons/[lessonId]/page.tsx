import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Box, Button, Group, Stack, Text, Title } from '@mantine/core'
import {
  IconArrowRight,
  IconConfetti,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react'
import NextLink from 'next/link'
import type { Lesson } from '../../../../../../../entities/lesson/types'
import { AdvancedEditor } from '../../../../../../../components/advanced-editor'
import { LessonControlPanel } from '../../../../../../../components'
import { apiUrl } from '../../../../../../../shared/lib'

export const generateMetadata = async ({
  params: { lessonId },
}: {
  params: { lessonId: string }
}) => {
  const lesson = await getLesson(lessonId)

  return {
    title: `[Edit] ${lesson.title} | Mentorium`,
  }
}

const getLesson = async (lessonId: string) => {
  const response = await fetch(apiUrl(`/lessons/${lessonId}`), {
    method: 'GET',
    headers: {
      Cookie: cookies().toString(),
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if ([404, 500].includes(response.status)) {
      redirect('/studio/courses')
    }
  }

  const { data } = await response.json()

  return data as Lesson
}

const getCourseLessons = async (courseId: string) => {
  const response = await fetch(apiUrl(`/courses/preview/${courseId}`), {
    method: 'GET',
    headers: {
      Cookie: cookies().toString(),
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if ([404, 500].includes(response.status)) {
      redirect('/studio/courses')
    }

    return { courseName: '', lessons: [] } as {
      courseName: string
      lessons: { uid: string; title: string }[]
    }
  }

  const { data } = await response.json()

  return { courseName: data.name, lessons: data.lessons } as {
    courseName: string
    lessons: { uid: string; title: string }[]
  }
}

const Page = async ({
  params: { courseId, lessonId },
}: {
  params: { courseId: string; lessonId: string }
}) => {
  const lesson = await getLesson(lessonId)
  const { lessons } = await getCourseLessons(courseId)

  const nextLesson = lessons.findIndex((l) => l.uid === lessonId) + 1
  const prevLesson = lessons.findIndex((l) => l.uid === lessonId) + 1

  return (
    <Stack mb="50px" pos="relative" w="100%">
      <Box bg="dark.6" p="md" w="100%">
        <Group justify="space-between">
          <Title order={4}>{lesson.title}</Title>
          <Text>{lesson.averageTimeToRead} min read</Text>
        </Group>
      </Box>
      <Box mx="auto" w="80%">
        <AdvancedEditor
          editable={false}
          mode="view"
          value={{
            content: lesson.content,
            interactiveComponents: lesson.interactiveComponents,
          }}
        />
        <Group justify="flex-end" pr="15px">
          {nextLesson < lessons.length ? (
            <Button
              component={NextLink}
              href={`/studio/courses/${courseId}/lessons/${lessons[nextLesson]?.uid}`}
              rightSection={<IconArrowRight />}
            >
              Next lesson
            </Button>
          ) : (
            <Button
              component={NextLink}
              href={`/studio/courses/${courseId}/completed`}
              rightSection={<IconConfetti />}
            >
              Finish course
            </Button>
          )}
        </Group>
      </Box>
      <Box bottom="50px" pos="fixed" right="50px" w="fit-content">
        <LessonControlPanel
          courseId={courseId}
          initialLesson={lessons[0] ? lessons[0] : null}
          lessonId={lessonId}
        />
      </Box>
    </Stack>
  )
}

export default Page
