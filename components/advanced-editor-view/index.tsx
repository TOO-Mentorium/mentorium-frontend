'use client'

import { notifications } from '@mantine/notifications'
import { IconExclamationMark } from '@tabler/icons-react'
import { bffUrl } from '../../shared/lib'
import { AdvancedEditor } from '../advanced-editor'

export const AdvancedEditorView = ({
  content,
  lessonId,
  interactiveComponents,
}: {
  content: string
  interactiveComponents: string
  lessonId: string
}) => {
  console.log(interactiveComponents)

  const handleUpdateProgress = async (updatedInteractiveComponents: string) => {
    const response = await fetch(bffUrl('/lessons/progression'), {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        lessonUid: lessonId,
        interactiveComponents: updatedInteractiveComponents,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = (await response.json()) as {
      success: boolean
      error?: {
        message: string
        code: number
      }
    }

    if (!data.success) {
      notifications.show({
        title: 'Server error',
        message:
          'An unexpected error occurred while editing lesson. Please try again later.',
        color: 'red',
        autoClose: 5000,
        icon: <IconExclamationMark size="20px" />,
      })
    }

    if (data.success) {
      notifications.show({
        title: 'Congratulations!',
        message: 'Task completed. Your progress has been saved.',
        color: 'blue',
        autoClose: 5000,
      })
    }
  }

  return (
    <AdvancedEditor
      editable={false}
      mode="view"
      onUpdateProgress={handleUpdateProgress}
      value={{
        content,
        interactiveComponents,
      }}
    />
  )
}
