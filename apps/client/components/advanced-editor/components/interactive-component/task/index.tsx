import {
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { IconListCheck } from '@tabler/icons-react'
import { useState } from 'react'
import type { TaskComponent, TaskInteractionState } from '../../../types'

interface Props {
  component: TaskComponent
  onInteractionStateUpdate?: (
    updatedInteractionState: TaskInteractionState,
  ) => void
  onEdit?: (componentToEdit: TaskComponent) => void
}

export const Task = ({
  component,
  onInteractionStateUpdate,
  onEdit,
}: Props) => {
  const { interactionState, state } = component

  const [completed, setCompleted] = useState(interactionState.completed)

  const handleSubmit = () => {
    if (completed) {
      return
    }

    setCompleted(true)

    onInteractionStateUpdate?.({
      completed,
    })
  }

  const handleReset = () => {
    setCompleted(false)

    onInteractionStateUpdate?.({
      completed,
    })
  }

  const handleEdit = () => {
    onEdit?.(component)
  }

  return (
    <Paper bg="dark.6">
      <Stack align="flex-end" gap="sm" p="sm">
        <Group align="center" gap="sm" w="100%" wrap="nowrap">
          <ThemeIcon size="sm" variant="light">
            <IconListCheck size="16px" />
          </ThemeIcon>
          <Text fw={500} m="0" size="sm">
            Task
          </Text>
        </Group>
        <Divider w="100%" />
        <Stack gap="xs" w="100%">
          <Checkbox
            c={state.text ? 'white' : 'dimmed'}
            checked={completed}
            fz="xs"
            label={
              state.text ? (
                <Text
                  c={completed ? 'dimmed' : 'white'}
                  inherit
                  td={completed ? 'line-through' : 'none'}
                >
                  {state.text}
                </Text>
              ) : (
                'Task placeholder'
              )
            }
            onChange={() => {
              handleSubmit()
            }}
            styles={{ icon: { marginBottom: 'auto' } }}
            variant="filled"
          />
        </Stack>
        <Group justify="flex-start" w="100%">
          {!onInteractionStateUpdate ? (
            <Button onClick={handleReset} size="xs" variant="default">
              Reset
            </Button>
          ) : null}
          {onEdit ? (
            <Button onClick={handleEdit} size="xs" variant="outline">
              Edit
            </Button>
          ) : null}
        </Group>
      </Stack>
    </Paper>
  )
}
