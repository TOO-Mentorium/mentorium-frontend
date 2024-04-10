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
        <Group
          align="flex-start"
          align="center"
          justify="space-between"
          w="100%"
        >
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
