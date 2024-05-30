import { Container, Group, Stack, Text } from '@mantine/core'
import Image from 'next/image'

interface Props {
  children: React.ReactNode
}

const AuthenticationLayout = ({ children }: Props) => {
  return (
    <Stack>
      <Group p="md">
        <Group>
          <Image alt="Logo" height={20} src="/logo.svg" width={40} />
          <Text fw={500} size="xl">
            Mentorium
          </Text>
        </Group>
      </Group>
      <Container pt="100px" size="xl">
        {children}
      </Container>
    </Stack>
  )
}

export default AuthenticationLayout
