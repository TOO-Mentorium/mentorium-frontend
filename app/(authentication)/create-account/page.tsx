'use client'

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
import { IconArrowRight, IconExclamationMark } from '@tabler/icons-react'
import Link from 'next/link'
import { notifications } from '@mantine/notifications'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { bffUrl } from '../../../shared/lib'

const Page = () => {
  const router = useRouter()

  const [submitting, setSubmitting] = useState(false)

  const form = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      username: '',
      password: '',
    },
    validate: {
      email: (value) => {
        if (!z.string().min(1).safeParse(value).success) {
          return 'Email is required'
        }

        if (!z.string().email().safeParse(value).success) {
          return 'Email is invalid'
        }

        return null
      },
      firstName: (value) => {
        if (!z.string().min(1).safeParse(value).success) {
          return 'First Name is required'
        }

        return null
      },
      lastName: (value) => {
        if (!z.string().min(1).safeParse(value).success) {
          return 'Last Name is required'
        }

        return null
      },
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
    email: string
    firstName: string
    lastName: string
    username: string
    password: string
  }) => {
    setSubmitting(true)

    const res = await fetch(bffUrl('/auth/register'), {
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
      router.push('/login')

      notifications.show({
        title: 'Account created',
        message: 'You can now login to your account.',
        color: 'blue',
        autoClose: 5000,
      })
    }

    if (!data.success && data.error?.code === 400) {
      notifications.show({
        title: 'User already exists',
        message: 'Please, try to login instead.',
        color: 'red',
        autoClose: 5000,
        icon: <IconExclamationMark size="20px" />,
      })
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
        <form onSubmit={form.onSubmit(handleSubmit)} style={{ width: '100%' }}>
          <Stack gap="sm">
            <Group wrap="nowrap">
              <TextInput
                key={form.key('firstName')}
                label="First Name"
                placeholder="Enter First Name"
                w="100%"
                {...form.getInputProps('firstName')}
              />
              <TextInput
                key={form.key('lastName')}
                label="Last Name"
                placeholder="Enter Last Name"
                w="100%"
                {...form.getInputProps('lastName')}
              />
            </Group>
            <TextInput
              key={form.key('username')}
              label="Username"
              placeholder="Enter Username"
              {...form.getInputProps('username')}
            />
            <TextInput
              key={form.key('email')}
              label="Email"
              placeholder="Enter Email"
              {...form.getInputProps('email')}
            />
            <PasswordInput
              key={form.key('password')}
              label="Password"
              placeholder="Enter Password"
              type="password"
              {...form.getInputProps('password')}
            />
            <Button loading={submitting} mt="md" type="submit" w="100%">
              Start Learning
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  )
}

export default Page
