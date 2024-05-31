import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Box, Button, Group, Stack, Text, Title } from '@mantine/core'
import { IconArrowRight, IconConfetti } from '@tabler/icons-react'
import NextLink from 'next/link'
import { AdvancedEditor } from '../../../../../../components/advanced-editor'
import type { Lesson } from '../../../../../../entities/lesson/types'
import { apiUrl } from '../../../../../../shared/lib'
import { AdvancedEditorView } from '../../../../../../components/advanced-editor-view'

export const generateMetadata = async ({
  params: { lessonId },
}: {
  params: { lessonId: string }
}) => {
  const lesson = await getLesson(lessonId)

  return {
    title: `${lesson.title} | Mentorium`,
  }
}

const getUserProgress = async (lessonId: string) => {
  const response = await fetch(apiUrl(`/lessons/${lessonId}/progression`), {
    method: 'GET',
    headers: {
      Cookie: cookies().toString(),
      'Content-Type': 'application/json',
    },
  })

  const { data } = await response.json()

  if (!response.ok) {
    if ([500].includes(response.status)) {
      redirect('/courses')
    }

    return { state: 'not-started' }
  }

  return {
    state: 'started',
    interactiveComponents: data.interactiveComponents as string,
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
      redirect('/courses')
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
      redirect('/courses')
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
  const userProgress = await getUserProgress(lessonId)

  const nextLesson = lessons.findIndex((l) => l.uid === lessonId) + 1

  return (
    <Stack mb="50px" pos="relative" w="100%">
      <Box bg="dark.6" p="md" w="100%">
        <Group justify="space-between">
          <Title order={4}>{lesson.title}</Title>
          <Text>{lesson.averageTimeToRead} min read</Text>
        </Group>
      </Box>
      <Box mx="auto" w="80%">
        <AdvancedEditorView
          content={lesson.content}
          interactiveComponents={
            userProgress.state === 'started'
              ? userProgress.interactiveComponents!
              : lesson.interactiveComponents
          }
          lessonId={lessonId}
        />
        <Group justify="flex-end" mt="20px">
          {nextLesson < lessons.length ? (
            <Button
              component={NextLink}
              href={`/courses/${courseId}/lessons/${lessons[nextLesson]?.uid}`}
              rightSection={<IconArrowRight />}
              size="md"
            >
              Next lesson
            </Button>
          ) : (
            <Button
              component={NextLink}
              href={`/courses/${courseId}/completed`}
              rightSection={<IconConfetti />}
              size="md"
            >
              Finish course
            </Button>
          )}
        </Group>
      </Box>
    </Stack>
  )
}

export default Page
