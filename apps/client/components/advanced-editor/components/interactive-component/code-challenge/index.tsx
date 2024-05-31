import {
  Alert,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import {
  IconAlertCircle,
  IconCode,
  IconExclamationMark,
} from '@tabler/icons-react'
import { useState } from 'react'
import { Editor } from '@monaco-editor/react'
import { notifications } from '@mantine/notifications'
import type {
  CodeChallengeComponent,
  CodeChallengeInteractionState,
} from '../../../types'
import { bffUrl } from '../../../../../shared/lib'

interface Props {
  mode: 'view' | 'preview' | 'edit'
  component: CodeChallengeComponent
  onInteractionStateUpdate?: (
    updatedInteractionState: CodeChallengeInteractionState,
  ) => void
  onEdit?: (componentToEdit: CodeChallengeComponent) => void
}

export const CodeChallenge = ({
  mode,
  component,
  onInteractionStateUpdate,
  onEdit,
}: Props) => {
  const { interactionState, state } = component

  const [code, setCode] = useState<string>('')
  const [completed, setCompleted] = useState(interactionState.completed)
  const [submitting, setSubmitting] = useState(false)

  const [errors, setErrors] = useState([])

  const handleCodeChange = (value: string) => {
    setCode(value)

    onInteractionStateUpdate?.({
      ...interactionState,
      code: value,
    })
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    const response = await fetch(bffUrl('/test-code-challenge'), {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ code: code + state.tests, languageId: 93 }),
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
          'An unexpected error occurred while creating the course. Please try again later.',
        color: 'red',
        autoClose: 5000,
        icon: <IconExclamationMark size="20px" />,
      })
    }

    console.log(data)

    setSubmitting(false)
  }

  const handleReset = () => {
    setCode(state.initialCode)
    setErrors([])
    setCompleted(false)

    onInteractionStateUpdate?.({
      errors: [],
      code: state.initialCode,
      completed: false,
    })
  }

  const handleEdit = () => {
    onEdit?.(component)
  }

  const renderActions = () => {
    if (mode === 'view') {
      return null
    }

    if (mode === 'preview') {
      return (
        <Group>
          <Button onClick={handleReset} size="xs" variant="default">
            Reset
          </Button>
          <Button onClick={handleEdit} size="xs" variant="outline">
            Edit
          </Button>
        </Group>
      )
    }

    return (
      <Group>
        <Button onClick={handleReset} size="xs" variant="default">
          Reset
        </Button>
      </Group>
    )
  }

  return (
    <Paper bg="dark.6">
      <Stack align="flex-end" gap="sm" p="sm">
        <Group align="center" gap="sm" w="100%" wrap="nowrap">
          <ThemeIcon size="sm" variant="light">
            <IconCode />
          </ThemeIcon>
          <Text fw={500} m="0" size="sm">
            Code Challenge
          </Text>
        </Group>
        <Divider w="100%" />
        <Editor
          defaultValue={state.initialCode}
          height="200px"
          language="javascript"
          onChange={(value) => {
            handleCodeChange(value ?? '')
          }}
          theme="vs-dark"
          value={code ? code : state.initialCode}
        />
        {errors.length > 0 ? (
          <Alert
            color="red"
            icon={<IconAlertCircle />}
            p="xs"
            title={errors.map((error) => error)}
            w="100%"
          />
        ) : null}
        {completed ? (
          <Alert
            color="green.6"
            icon={<IconAlertCircle />}
            p="xs"
            title="Correct answer!"
            w="100%"
          />
        ) : null}

        <Group justify="space-between" w="100%">
          {renderActions()}
          {mode === 'view' && interactionState.completed ? (
            <Text c="green.6" fz="xs" m="0">
              Completed
            </Text>
          ) : (
            <Button
              loading={submitting}
              onClick={() => handleSubmit()}
              size="xs"
              variant="light"
            >
              Submit
            </Button>
          )}
        </Group>
      </Stack>
    </Paper>
  )
}
