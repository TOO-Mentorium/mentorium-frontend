import {
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'

export const metadata = {
  title: 'Login | Mentorium',
}

const Page = () => {
  const onSubmit = async (formData: FormData) => {
    'use server'

    const rawFormData = {
      username: formData.get('email'),
      password: formData.get('password'),
    }

    const response = await fetch('http://localhost:3001/api_v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(rawFormData),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log(rawFormData)

    const data = await response.json()

    console.log(data)
  }

  return (
    <Paper bg="dark.7" p="lg" w="450px">
      <Stack align="center">
        <Group justify="space-between" w="100%">
          <Title order={3}>Login</Title>
          <Button
            component={Link}
            href="/create-account"
            rightSection={<IconArrowRight size="16px" />}
            size="xs"
            variant="light"
          >
            Create account
          </Button>
        </Group>
        <Divider orientation="horizontal" w="100%" />
        <form action={onSubmit} style={{ width: '100%' }}>
          <Stack gap="sm">
            <TextInput label="Email" name="email" placeholder="Enter Email" />
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Enter Password"
              type="password"
            />
            <Button mt="md" type="submit" w="100%">
              Back to Learning
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  )
}

export default Page
