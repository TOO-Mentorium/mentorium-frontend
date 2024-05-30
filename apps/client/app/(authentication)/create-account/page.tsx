import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'

export const metadata = {
  title: 'Create Account | Mentorium',
}

const Page = () => {
  const onSubmit = async (formData: FormData) => {
    'use server'

    const rawFormData = {
      email: formData.get('email'),
      password: formData.get('password'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      username: formData.get('username'),
    }

    const response = await fetch(
      'https://mentorium.su/api/api_v1/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(rawFormData),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      console.log(await response.json())
    }

    const data = await response.json()
  }

  return (
    <Paper bg="dark.7" p="lg" shadow="xs" w="450px">
      <Stack align="center">
        <Group align="flex-start" justify="space-between" w="100%">
          <Title order={3}>Create Account</Title>
          <Button
            component={Link}
            href="/login"
            rightSection={<IconArrowRight size="16px" />}
            size="xs"
            variant="light"
          >
            Login
          </Button>
        </Group>
        <Divider orientation="horizontal" w="100%" />
        <form action={onSubmit} style={{ width: '100%' }}>
          <Stack gap="sm">
            <Group wrap="nowrap">
              <TextInput
                label="First Name"
                name="firstName"
                placeholder="Enter First Name"
                w="100%"
              />
              <TextInput
                label="Last Name"
                name="lastName"
                placeholder="Enter Last Name"
                w="100%"
              />
            </Group>
            <TextInput
              label="Username"
              name="username"
              placeholder="Enter Username"
            />
            <TextInput label="Email" name="email" placeholder="Enter Email" />
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Enter Password"
              type="password"
            />
            <PasswordInput
              label="Repeat Password"
              name="repeatPassword"
              placeholder="Repeat Password"
              type="password"
            />
            <Button mt="md" type="submit" w="100%">
              Start Learning
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  )
}

export default Page
