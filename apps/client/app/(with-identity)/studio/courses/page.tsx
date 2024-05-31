import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  Loader,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import Link from 'next/link'
import { IconPlus, IconSortDescending } from '@tabler/icons-react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { CourseSimplifiedWithPublished } from '../../../../entities/course'
import { CourseCard } from '../../../../entities/course'
import { SearchInput } from '../../../../components/search-input'
import { CoursesSort } from '../../../../components'
import { apiUrl } from '../../../../shared/lib'
import classNames from './page.module.css'

export const metadata = {
  title: 'Studio | Mentorium',
}

const getCourses = async (
  searchQuery: string,
  sortBy: string,
  direction: string,
) => {
  const response = await fetch(
    apiUrl(
      `/courses/my?search=${searchQuery}&sortBy=${sortBy}&direction=${direction}`,
    ),
    {
      cache: 'no-store',

      headers: {
        Cookie: cookies().toString(),
        'Content-Type': 'application/json',
      },
    },
  )

  if (!response.ok) {
    const error = await response.json()

    if (response.status === 401) {
      redirect('/login')
    }

    return {
      courses: [],
      total: 0,
      error: {
        message: error.message,
        code: error.statusCode,
      },
    }
  }

  const { data, total } = await response.json()

  return { courses: data, total } as {
    courses: CourseSimplifiedWithPublished[]
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
      <Stack gap="xs" mt="50px">
        <Stack gap="3px">
          <Title className={classNames.title} order={1} size="40px">
            Studio
          </Title>
          <Text c="dark.1">Create, publish your own courses.</Text>
        </Stack>
        <Stack gap="sm" mt="55px">
          <Group justify="space-between" wrap="nowrap">
            <SearchInput />
            <Button
              component={Link}
              h="42px"
              href="/studio/new-course"
              leftSection={<IconPlus size="20px" />}
              size="lg"
              w="300px"
            >
              Create course
            </Button>
          </Group>
          <Group justify="space-between" w="100%">
            <Text c="dimmed">{total} results</Text>
            <Group gap="xs">
              <Text size="sm">Sort by:</Text>
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
                  fromStudio
                  href={`/studio/courses/${course.uid}`}
                  key={course.uid}
                  withAuthor={false}
                />
              ))}
            </Box>
          </Suspense>
        )}
      </Stack>
    </Container>
  )
}

export default Page
