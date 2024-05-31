import { Container, Group, NavLink, Stack, Title } from '@mantine/core'
import NextLink from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { CreateLesson } from '../../../../../../../features/create-lesson'
import { BackButton } from '../../../../../../../components'
import { EditLesson } from '../../../../../../../features/edit-lesson'
import type { Lesson } from '../../../../../../../entities/lesson/types'
import classNames from './page.module.css'
import { apiUrl } from '../../../../../../../shared/lib'

export const metadata = {
  title: 'Edit Lesson | Mentorium',
}

const getLesson = async (lessonId: string) => {
  const response = await fetch(
    apiUrl(`/lessons/${lessonId}`),
    {
      method: 'GET',
      headers: {
        Cookie: cookies().toString(),
        'Content-Type': 'application/json',
      },
    },
  )

  if (!response.ok) {
    if ([404, 500].includes(response.status)) {
      redirect('/studio/courses')
    }
  }

  const { data } = await response.json()

  return data as Lesson
}

const Page = async ({
  params: { courseId, lessonId },
}: {
  params: { courseId: string; lessonId: string }
}) => {
  const lesson = await getLesson(lessonId)

  return (
    <Container mb="50px" size="xl" w="100%">
      <Stack align="flex-start" mt="55px" w="100%">
        <Group>
          <BackButton />
          <Title order={4}>Edit lesson</Title>
        </Group>
        <EditLesson courseId={courseId} lesson={lesson} />
      </Stack>
    </Container>
  )
}

export default Page
