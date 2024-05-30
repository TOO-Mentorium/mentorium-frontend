import { Divider, Group, Stack, Text, TextInput } from '@mantine/core'
import { Task } from '../../interactive-component/task'
import type { TaskComponent } from '../../../types'

interface Props {
  component: TaskComponent
  onUpdate: (updatedComponent: TaskComponent) => void
}

export const TaskCostructor = ({ component, onUpdate }: Props) => {
  const { state } = component

  const handleTaskTextChange = (value: string) => {
    onUpdate({
      ...component,
      state: {
        ...state,
        text: value,
      },
    })
  }

  return (
    <Stack justify="flex-start">
      <Stack gap="5px">
        <Text fw={500} size="sm">
          Task
        </Text>
        <Stack gap="sm">
          <Group align="center" gap="xs" wrap="nowrap">
            <TextInput
              onChange={({ target }) => {
                handleTaskTextChange(target.value)
              }}
              placeholder="Enter task"
              value={state.text}
              w="100%"
            />
          </Group>
        </Stack>
      </Stack>
      <Divider />
      <Task component={component} />
    </Stack>
  )
}
