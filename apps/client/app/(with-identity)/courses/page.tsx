import {
  Box,
  Container,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { Suspense } from 'react'
import type { CourseSimplified } from '../../../entities/course'
import { CourseCard } from '../../../entities/course/ui/course-card'
import { CoursesSort } from '../../../components'
import { SearchInput } from '../../../components/search-input'
import classNames from './page.module.css'
import { apiUrl } from '../../../shared/lib'

export const metadata = {
  title: 'Courses | Mentorium',
}

const getCourses = async (
  searchQuery: string,
  sortBy: string,
  direction: string,
) => {
  const response = await fetch(
    apiUrl(`/courses?page=1&limit=20&search=${searchQuery}&sortBy=${sortBy}&sortDirection=${direction}`),
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  if (!response.ok) {
    const error = await response.json()

    return {
      courses: [],
      total: 0,
      error: { message: error.message, code: error.statusCode },
    }
  }

  const { data, total } = await response.json()

  console.log(data, response.url)

  return { courses: data, total } as {
    courses: CourseSimplified[]
    total: number
  }
}

const Page = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string
    sortBy?: string
    direction?: string
  }
}) => {
  const query = searchParams?.query || ''
  const sortBy = searchParams?.sortBy || 'popularity'
  const direction = searchParams?.direction || 'DESC'

  const { courses, total } = await getCourses(query, sortBy, direction)

  return (
    <Container pb="xl" size="xl" w="100%">
      <Stack align="flex-start" gap="xs" mt="50px" w="100%">
        <Stack gap="3px">
          <Title className={classNames.title} order={1} size="40px">
            Courses
          </Title>
          <Text c="dark.1">
            Search, filter, and browse our catalog of courses.
          </Text>
        </Stack>
        <Stack gap="sm" mt="55px" w="100%">
          <Stack gap="sm">
            <SearchInput />
            <Group justify="space-between">
              <Text c="dimmed">{total} results</Text>
              <Group gap="xs">
                <Text c="dimmed" size="sm">
                  Sort by:
                </Text>
                <CoursesSort />
              </Group>
            </Group>
          </Stack>
          {courses.length === 0 ? (
            <Group justify="center" mt="120px">
              <Text c="dimmed" size="md">
                You have no courses yet
              </Text>
            </Group>
          ) : (
            <Suspense fallback={<Loader />} key={query + sortBy + direction}>
              <Box className={classNames.coursesWrapper}>
                {courses.map((course) => (
                  <CourseCard
                    course={course}
                    href={`/courses/${course.slug}`}
                    key={course.uid}
                  />
                ))}
              </Box>
            </Suspense>
          )}
        </Stack>
      </Stack>
    </Container>
  )
}

export default Page
