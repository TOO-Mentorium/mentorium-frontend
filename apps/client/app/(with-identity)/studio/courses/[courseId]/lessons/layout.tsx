import {
  Box,
  Button,
  Divider,
  Grid,
  GridCol,
  NavLink,
  Paper,
  Stack,
  Title,
} from '@mantine/core'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import type { ReactNode } from 'react'
import { IconPlus } from '@tabler/icons-react'
import NextLink from 'next/link'
import classNames from './layout.module.css'

const getCourseLessons = async (courseId: string) => {
  const response = await fetch(
    `https://mentorium.su/api/api_v1/courses/preview/${courseId}`,
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

const LessonsLayout = async ({
  children,
  params: { courseId, lessonId },
}: {
  children: ReactNode
  params: { courseId: string; lessonId: string }
}) => {
  const { courseName, lessons } = await getCourseLessons(courseId)

  return (
    <Grid w="100%">
      {lessonId ? (
        <GridCol span={3}>
          <Paper
            bg="dark.7"
            h="100vh"
            pos="sticky"
            radius="none"
            top="0px"
            w="100%"
          >
            <Stack gap="0" p={0}>
              <Box p="sm">
                <Title order={4}>{courseName}</Title>
              </Box>
              <Divider w="100%" />
              <Stack gap="xs">
                {lessons.map(({ uid, title }, i) => (
                  <NavLink
                    active={uid === lessonId}
                    className={classNames.sectionLink}
                    component={NextLink}
                    fw={600}
                    fz="16px"
                    href={`/studio/courses/${courseId}/lessons/${uid}`}
                    key={uid}
                    label={`${i + 1}. ${title}`}
                    variant="light"
                  />
                ))}
                <Box p="xs">
                  <Button
                    component={NextLink}
                    fullWidth
                    href={`/studio/courses/${courseId}/lessons/new-lesson`}
                    leftSection={<IconPlus />}
                    size="md"
                    variant="light"
                  >
                    Create lesson
                  </Button>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </GridCol>
      ) : null}
      <GridCol span="auto">
        <Box mx="auto" w="80%">
          {children}
        </Box>
      </GridCol>
    </Grid>
  )
}

export default LessonsLayout
