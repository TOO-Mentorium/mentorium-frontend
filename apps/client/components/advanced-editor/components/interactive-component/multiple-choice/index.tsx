import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { IconAlertCircle, IconQuestionMark } from '@tabler/icons-react'
import { useState } from 'react'
import type {
  MultipleChoiceComponent,
  MultipleChoiceInteractionState,
  MultipleChoiceAnswer,
} from '../../../types'

interface Props {
  mode: 'view' | 'preview' | 'edit'
  component: MultipleChoiceComponent
  onInteractionStateUpdate?: (
    updatedInteractionState: MultipleChoiceInteractionState,
  ) => void
  onEdit?: (componentToEdit: MultipleChoiceComponent) => void
}

export const MultipleChoice = ({
  mode,
  component,
  onInteractionStateUpdate,
  onEdit,
}: Props) => {
  const { interactionState, state } = component

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    interactionState.selectedAnswers,
  )
  const [completed, setCompleted] = useState(interactionState.completed)

  const [tryAgainShown, setTryAgainShown] = useState(false)
  const [pleaseSelectAnswerShown, setPleaseSelectAnswerShown] = useState(false)

  const handleAnswerChange = (value: boolean, answer: MultipleChoiceAnswer) => {
    if (value) {
      setSelectedAnswers([...selectedAnswers, answer.id])
    }

    if (!value) {
      const updatedAnswers = selectedAnswers.filter((id) => id !== answer.id)

      setSelectedAnswers(updatedAnswers)
    }
  }

  const handleSubmit = () => {
    if (selectedAnswers.length === 0) {
      setCompleted(false)
      setPleaseSelectAnswerShown(true)

      return
    }

    const isCorrect = selectedAnswers.every((id) => {
      const answer = state.answers.get(id)

      return answer?.isCorrect
    })

    setPleaseSelectAnswerShown(false)
    setCompleted(false)

    if (isCorrect) {
      setTryAgainShown(false)
      setCompleted(true)

      onInteractionStateUpdate?.({
        selectedAnswers,
        completed,
      })

      return
    }

    setCompleted(false)
    setTryAgainShown(true)
  }

  const handleReset = () => {
    setSelectedAnswers([])
    setTryAgainShown(false)
    setCompleted(false)
    setPleaseSelectAnswerShown(false)

    onInteractionStateUpdate?.({
      selectedAnswers,
      completed,
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
            <IconQuestionMark />
          </ThemeIcon>
          <Text
            c={state.question ? 'white' : 'dimmed'}
            fw={500}
            m="0"
            size="sm"
          >
            {state.question ? state.question : 'Question placeholder'}
          </Text>
        </Group>
        <Divider w="100%" />
        <Stack gap="xs" w="100%">
          {Array.from(state.answers, ([id, answer]) => (
            <Checkbox
              c={answer.text ? 'white' : 'dimmed'}
              checked={selectedAnswers.includes(answer.id)}
              fz="xs"
              key={id}
              label={answer.text ? answer.text : 'Answer placeholder'}
              onChange={({ target }) => {
                handleAnswerChange(target.checked, answer)
              }}
              styles={{ icon: { marginBottom: 'auto' } }}
              variant="filled"
            />
          ))}
        </Stack>
        {tryAgainShown ? (
          <Alert
            color="red"
            icon={<IconAlertCircle />}
            p="xs"
            title="Incorrect answer! Try again."
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
        {pleaseSelectAnswerShown ? (
          <Alert
            color="yellow"
            icon={<IconAlertCircle />}
            onClose={() => {
              setPleaseSelectAnswerShown(false)
            }}
            p="xs"
            title="Please select an answer."
            w="100%"
          />
        ) : null}
        <Group justify="space-between" w="100%">
          {renderActions()}
          <Button onClick={handleSubmit} size="xs" variant="light">
            Submit
          </Button>
        </Group>
      </Stack>
    </Paper>
  )
}
