import {
  ActionIcon,
  Anchor,
  Avatar,
  Button,
  Group,
  Stack,
  Text,
} from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'
import { IconLogout } from '@tabler/icons-react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { User } from '../../entities/user/types'

interface Props {
  children: React.ReactNode
}

const getUser = async () => {
  const response = await fetch('https://mentorium.su/api/api_v1/user/me', {
    method: 'GET',
    headers: {
      Cookie: cookies().toString(),
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
  })

  if (!response.ok) {
    const error = await response.json()

    if (error.statusCode === 401) {
      return null
    }

    redirect('/login')
  }

  const { data: user } = await response.json()

  return user as User
}

const WithIdentityLayout = async ({ children }: Props) => {
  const user = await getUser()

  return (
    <Stack gap="0px" mih="100vh" pos="relative">
      <Group
        align="center"
        bg="dark.7"
        gap="xl"
        justify="space-between"
        p="md"
        pos="sticky"
        style={{ zIndex: 50, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
        top="0px"
      >
        <Group gap="30px">
          <Group>
            <Image alt="Logo" height={20} src="/logo.svg" width={40} />
            <Text fw={500} size="xl">
              Mentorium
            </Text>
          </Group>
          <Group align="center">
            <Anchor component={Link} fw={500} href="/courses">
              Courses
            </Anchor>
            <Anchor component={Link} fw={500} href="/studio/courses">
              Studio
            </Anchor>
          </Group>
        </Group>
        {user ? (
          <Group gap="md">
            <Group gap="xs">
              <Avatar color="blue">{user.username[0]?.toUpperCase()}</Avatar>
              <Text fw={500}>{user.username}</Text>
            </Group>
            <ActionIcon
              color="dark.1"
              component={Link}
              href="/login"
              variant="subtle"
            >
              <IconLogout size="20px" />
            </ActionIcon>
          </Group>
        ) : (
          <Group>
            <Button component={Link} href="/login" variant="light">
              Log in
            </Button>
            <Button component={Link} href="/create-account">
              Create account
            </Button>
          </Group>
        )}
      </Group>
      {children}
    </Stack>
  )
}

export default WithIdentityLayout
