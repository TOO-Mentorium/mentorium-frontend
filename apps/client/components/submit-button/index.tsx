'use client'

import type { ButtonProps } from '@mantine/core'
import { Button } from '@mantine/core'
import { useFormStatus } from 'react-dom'

interface Props extends ButtonProps {
  children: React.ReactNode
}

export const SubmitButton = ({ children, ...props }: Props) => {
  const { pending } = useFormStatus()

  return (
    <Button {...props} loading={pending} type="submit">
      {children}
    </Button>
  )
}
