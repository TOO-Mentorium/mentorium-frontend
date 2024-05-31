import { Container, Stack, Title } from '@mantine/core'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { CreateCourse } from '../../../../features/create-course'
import classNames from './page.module.css'

export const metadata = {
  title: 'New Course | Mentorium',
}

const Page = () => {
  return (
    <Container size="xl" w="100%">
      <Stack gap="xl" mt="50px">
        <Title className={classNames.title}>New Course</Title>
        <CreateCourse />
      </Stack>
    </Container>
  )
}

export default Page
