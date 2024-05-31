import { Container, Group, NavLink, Stack, Title } from '@mantine/core'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { BackButton } from '../../../../../components'
import type { Course } from '../../../../../entities/course'
import { EditCourse } from '../../../../../features/edit-course'
import { apiUrl } from '../../../../../shared/lib'

export const metadata = {
  title: 'Edit Course | Mentorium',
}

const getCourse = async (courseId: string) => {
  const response = await fetch(apiUrl(`/courses/preview/${courseId}`), {
    method: 'GET',
    headers: {
      Cookie: cookies().toString(),
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()

    if ([404, 500].includes(response.status)) {
      redirect('/studio/courses')
    }
  }

  const { data } = await response.json()

  return data as Course
}

const Page = async ({
  params: { courseId },
}: {
  params: { courseId: string }
}) => {
  const course = await getCourse(courseId)

  return (
    <Container mb="50px" size="xl" w="100%">
      <Stack align="flex-start" mt="55px" w="100%">
        <Group>
          <BackButton />
          <Title order={4}>Edit course</Title>
        </Group>
        <EditCourse course={course} />
      </Stack>
    </Container>
  )
}

export default Page
