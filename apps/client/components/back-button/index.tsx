'use client'

import { ActionIcon, Button } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

export const BackButton = () => {
  const route = useRouter()

  return (
    <ActionIcon
      onClick={() => {
        route.back()
      }}
      size="md"
      variant="light"
    >
      <IconArrowLeft size="20px" />
    </ActionIcon>
  )
}
