import { ActionIcon, Button, Modal, Stack, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { RichTextEditor } from '@mantine/tiptap'
import { IconImageInPicture } from '@tabler/icons-react'
import type { FormEvent } from 'react'
import { useState } from 'react'

interface Props {
  onComplete: (url: string) => void
}

export const AddImage = ({ onComplete }: Props) => {
  const [imageUrl, setImageUrl] = useState('')
  const [opened, { open, close }] = useDisclosure()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    onComplete(imageUrl)

    close()
  }

  return (
    <>
      <RichTextEditor.Control
        aria-label="Insert interactive component"
        onClick={() => {
          open()
        }}
        title="Insert interactive component"
      >
        <IconImageInPicture size="1rem" stroke={1.5} />
      </RichTextEditor.Control>
      <Modal onClose={close} opened={opened} title="Add Image" zIndex={100000}>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Image URL"
              onChange={({ target }) => {
                setImageUrl(target.value)
              }}
              placeholder="Enter Image URL"
            />
            <Button type="submit">Add</Button>
          </Stack>
        </form>
      </Modal>
    </>
  )
}
