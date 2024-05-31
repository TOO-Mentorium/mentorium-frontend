'use client'

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
import { IconArrowRight, IconExclamationMark } from '@tabler/icons-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from '@mantine/form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { notifications } from '@mantine/notifications'
import { bffUrl } from '../../../shared/lib'

const Page = () => {
  const router = useRouter()

  const [submitting, setSubmitting] = useState(false)

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },

    validate: {
      username: (value) => {
        if (!z.string().min(1).safeParse(value).success) {
          return 'Username is required'
        }

        if (!z.string().min(3).safeParse(value).success) {
          return 'Username must be at least 3 characters long'
        }

        return null
      },
      password: (value) => {
        if (!z.string().min(1).safeParse(value).success) {
          return 'Password is required'
        }

        if (!z.string().min(6).safeParse(value).success) {
          return 'Password must be at least 6 characters long'
        }

        return null
      },
    },
  })

  const handleSubmit = async (values: {
    username: string
    password: string
  }) => {
    setSubmitting(true)

    const res = await fetch(bffUrl('/auth'), {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = (await res.json()) as {
      success: boolean
      error?: {
        message: string
        code: number
      }
    }

    setSubmitting(false)

    if (data.success) {
      router.push('/courses')
    }

    if (!data.success && data.error?.code === 401) {
      form.setFieldError('username', 'Invalid username or password')
      form.setFieldError('password', 'Invalid username or password')
    }

    if (!data.success && data.error?.code === 500) {
      notifications.show({
        title: 'Server error',
        message: 'An unexpected error occurred. Please try again later.',
        color: 'red',
        autoClose: 5000,
        icon: <IconExclamationMark size="20px" />,
      })
    }
  }

  return (
    <Paper bg="dark.7" p="lg" shadow="xs" w="450px">
      <Stack align="center">
        <Group justify="space-between" w="100%">
          <Title order={3}>Log in</Title>
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
        <form onSubmit={form.onSubmit(handleSubmit)} style={{ width: '100%' }}>
          <Stack gap="sm">
            <TextInput
              key={form.key('username')}
              label="Username"
              placeholder="Enter Username"
              {...form.getInputProps('username')}
            />
            <PasswordInput
              key={form.key('password')}
              label="Password"
              placeholder="Enter Password"
              type="password"
              {...form.getInputProps('password')}
            />
            <Button fullWidth loading={submitting} mt="md" type="submit">
              Continue Learning
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  )
}

export default Page
