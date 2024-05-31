import {
  Box,
  Button,
  Divider,
  Grid,
  GridCol,
  Group,
  NavLink,
  Paper,
  Stack,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import type { ReactNode } from 'react'
import { IconPlus } from '@tabler/icons-react'
import NextLink from 'next/link'
import classNames from './layout.module.css'
import { apiUrl } from '../../../../../../../shared/lib'

const getCourseLessons = async (courseId: string) => {
  const response = await fetch(
    apiUrl(`/courses/preview/${courseId}`),
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
    <Grid gutter={0} w="100%">
      <GridCol span={3}>
        <Paper
          bg="dark.7"
          h="100vh"
          mah="calc(100vh - 70px)"
          pos="sticky"
          radius="none"
          style={{ overflowY: 'auto' }}
          top="70px"
          w="100%"
        >
          <Stack gap="0" p={0}>
            <Box p="sm">
              <Group>
                <Title order={3}>{courseName}</Title>
              </Group>
            </Box>
            <Divider w="100%" />
            <Stack gap="0">
              {lessons.map(({ uid, title }, i) => (
                <UnstyledButton
                  className={classNames.lessonLink}
                  component={NextLink}
                  data-active={lessonId === uid}
                  href={`/studio/courses/${courseId}/lessons/${uid}`}
                  key={uid}
                  variant="light"
                >
                  {title}
                </UnstyledButton>
              ))}
            </Stack>
          </Stack>
        </Paper>
      </GridCol>
      <GridCol p="0" span="auto">
        {children}
      </GridCol>
    </Grid>
  )
}

export default LessonsLayout
