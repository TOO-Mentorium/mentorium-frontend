import { Container, Group, NavLink, Stack, Title } from '@mantine/core'
import NextLink from 'next/link'
import { redirect } from 'next/navigation'
import { CreateLesson } from '../../../../../../../features/create-lesson'
import { BackButton } from '../../../../../../../components'
import classNames from './page.module.css'

export const metadata = {
  title: 'New Lesson | Mentorium',
}

const Page = ({ params: { courseId } }: { params: { courseId: string } }) => {
  return (
    <Container mb="50px" size="xl" w="100%">
      <Stack align="flex-start" mt="55px" w="100%">
        <Group>
          <BackButton />
          <Title order={4}>New lesson</Title>
        </Group>
        <CreateLesson courseId={courseId} />
      </Stack>
    </Container>
  )
}

export default Page
