import { Button, Modal, Stack, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { NewLesson } from '../types'

interface Props {
  onCreate: (newLesson: NewLesson) => void
}

export const CreateLesson = ({ onCreate }: Props) => {
  const [name, setName] = useState<string>('')
  const [opened, { open, close }] = useDisclosure()

  const handleCreateLesson = (e: FormEvent) => {
    e.preventDefault()

    const newLesson = {
      id: uuidv4(),
      name,
      content: '',
      interactiveContent: '',
    }

    onCreate(newLesson)

    close()
  }

  return (
    <>
      <Button leftSection={<IconPlus size="16px" />} onClick={open}>
        New Lesson
      </Button>
      <Modal onClose={close} opened={opened} title="Create New Lesson">
        <form onSubmit={handleCreateLesson}>
          <Stack>
            <TextInput
              label="Lesson Title"
              onChange={(event) => {
                setName(event.currentTarget.value)
              }}
              placeholder="Enter lesson title"
              w="100%"
            />
            <Button type="submit">Create New</Button>
          </Stack>
        </form>
      </Modal>
    </>
  )
}
