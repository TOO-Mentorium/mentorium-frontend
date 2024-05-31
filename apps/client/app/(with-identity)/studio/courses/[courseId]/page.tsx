import {
  Box,
  Button,
  Grid,
  GridCol,
  Group,
  Image,
  NavLink,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core'
import NextImage from 'next/image'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import dayjs from 'dayjs'
import {
  IconArrowRight,
  IconBook,
  IconCalendar,
  IconEdit,
  IconPlus,
  IconShare2,
} from '@tabler/icons-react'
import NextLink from 'next/link'
import type { Course } from '../../../../../entities/course'
import { SimpleEditorView } from '../../../../../components/simple-editor-view'
import { CourseControlPanel } from '../../../../../components'
import { apiUrl } from '../../../../../shared/lib'
import classNames from './page.module.css'

export const generateMetadata = async ({
  params: { courseId },
}: {
  params: { courseId: string }
}) => {
  const course = await getCourse(courseId)

  return {
    title: `${course.name} | Mentorium`,
  }
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
    if ([404, 500].includes(response.status)) {
      redirect('/studio/courses')
    }
  }

  const { data: course } = await response.json()

  return course as Course
}

const Page = async ({
  params: { courseId },
}: {
  params: { courseId: string }
}) => {
  const course = await getCourse(courseId)

  return (
    <Stack pos="relative">
      <Stack bg="dark.6" gap="xs" p="50px" w="100%">
        <Group justify="space-between" wrap="nowrap">
          <Stack gap="3px">
            <Title className={classNames.title} order={1} size="40px">
              {course.name}
            </Title>
            <Text c="dark.1" maw="600px">
              {course.description}
            </Text>
          </Stack>
          <Image
            alt={course.name}
            component={NextImage}
            height={300}
            src={course.imageUrl}
            width={400}
          />
        </Group>
      </Stack>
      <Grid p="25px 50px">
        <GridCol span={8}>
          <Stack gap="40px">
            <Stack>
              <Title order={2}>Details</Title>
              <Stack gap="sm">
                <Group gap="xs">
                  <ThemeIcon size="lg" variant="light">
                    <IconBook />
                  </ThemeIcon>
                  <Text>{course.lessons.length} lessons</Text>
                </Group>
                <Group gap="xs">
                  <ThemeIcon size="lg" variant="light">
                    <IconCalendar />
                  </ThemeIcon>
                  <Text>
                    Updated at {dayjs(course.updatedDate).format('MMM D, YYYY')}
                  </Text>
                </Group>
              </Stack>
            </Stack>
            <Stack gap="xs">
              <Title order={2}>What you'll learn</Title>
              <SimpleEditorView stringifiedJson={course.whatWillLearn} />
            </Stack>
            <Stack gap="xs">
              <Title order={2}>Prerequisites</Title>
              <SimpleEditorView stringifiedJson={course.prerequisites} />
            </Stack>
          </Stack>
        </GridCol>
        <GridCol span={4}>
          <Stack w="100%">
            <Title order={2}>Lessons</Title>
            <Paper bg="dark.7" radius="sm" shadow="xs" w="450px">
              <Stack gap="0px">
                {course.lessons.length ? (
                  <>
                    {course.lessons.map((lesson) => (
                      <Box
                        className={classNames.lesson}
                        component={NextLink}
                        href={`/studio/courses/${courseId}/lessons/${lesson.uid}`}
                        key={lesson.uid}
                        style={{ textDecoration: 'none' }}
                        w="100%"
                      >
                        <Group justify="space-between" w="100%">
                          <Text fw={600} key={lesson.uid}>
                            {lesson.title}
                          </Text>
                          <ThemeIcon size="md" variant="light">
                            <IconArrowRight size="18px" />
                          </ThemeIcon>
                        </Group>
                      </Box>
                    ))}
                  </>
                ) : (
                  <Stack align="center" h={100} justify="center">
                    <Text c="dark.1" p="md">
                      No lessons yet
                    </Text>
                  </Stack>
                )}
                <Button
                  component={NextLink}
                  href={`/studio/courses/${courseId}/new-lesson`}
                  leftSection={<IconPlus />}
                  radius="0px 0px 5px 5px"
                  size="md"
                  variant="light"
                >
                  Create lesson
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </GridCol>
      </Grid>
      <Box bottom="50px" pos="fixed" right="50px" style={{ zIndex: 1000 }}>
        <CourseControlPanel course={course} />
      </Box>
    </Stack>
  )
}

export default Page
