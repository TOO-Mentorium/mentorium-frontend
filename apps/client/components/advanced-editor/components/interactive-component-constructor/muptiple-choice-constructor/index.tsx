import {
  ActionIcon,
  Button,
  Checkbox,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { IconPlus, IconX } from '@tabler/icons-react'
import { v4 as uuidv4 } from 'uuid'
import { MultipleChoice } from '../../interactive-component/multiple-choice'
import type { MultipleChoiceComponent } from '../../../types'

interface Props {
  component: MultipleChoiceComponent
  onUpdate: (updatedComponent: MultipleChoiceComponent) => void
}

export const MultipleChoiceCostructor = ({ component, onUpdate }: Props) => {
  const { state } = component

  const handleQuestionChange = (value: string) => {
    onUpdate({
      ...component,
      state: {
        ...state,
        question: value,
      },
    })
  }

  const handleAnswerAdd = () => {
    const generatedId = uuidv4()

    const newAnswer = {
      id: generatedId,
      text: '',
      isCorrect: false,
    }

    const updatedAnswers = new Map(state.answers).set(generatedId, newAnswer)

    onUpdate({
      ...component,
      state: {
        ...state,
        answers: updatedAnswers,
      },
    })
  }

  const handleAnswerTextChange = (value: string, id: string) => {
    const updatedAnswer = state.answers.get(id)

    if (!updatedAnswer) {
      return
    }

    const updatedAnswers = new Map(state.answers).set(id, {
      ...updatedAnswer,
      text: value,
    })

    onUpdate({
      ...component,
      state: {
        ...state,
        answers: updatedAnswers,
      },
    })
  }

  const handleAnswerCorrectChange = (value: boolean, id: string) => {
    const updatedAnswer = state.answers.get(id)

    if (!updatedAnswer) {
      return
    }

    const updatedAnswers = new Map(state.answers).set(id, {
      ...updatedAnswer,
      isCorrect: value,
    })

    onUpdate({
      ...component,
      state: {
        ...state,
        answers: updatedAnswers,
      },
    })
  }

  const handleAnswerRemove = (id: string) => {
    const updatedAnswers = new Map(state.answers)

    updatedAnswers.delete(id)

    onUpdate({
      ...component,
      state: {
        ...state,
        answers: updatedAnswers,
      },
    })
  }

  return (
    <Stack justify="flex-start">
      <Stack gap="5px">
        <Text fw={500} size="sm">
          Question
        </Text>
        <TextInput
          onChange={({ target }) => {
            handleQuestionChange(target.value)
          }}
          placeholder="Enter question"
          value={state.question}
        />
      </Stack>
      <Stack gap="5px">
        <Text fw={500} size="sm">
          Answers
        </Text>
        <Stack gap="sm">
          {Array.from(state.answers, ([_, answer], i) => (
            <Group align="center" gap="xs" key={answer.id} wrap="nowrap">
              <Checkbox
                onChange={({ target }) => {
                  handleAnswerCorrectChange(target.checked, answer.id)
                }}
                size="lg"
              />
              <TextInput
                onChange={({ target }) => {
                  handleAnswerTextChange(target.value, answer.id)
                }}
                placeholder="Enter answer"
                size="xs"
                value={answer.text}
                w="100%"
              />
              <ActionIcon
                color="dark.1"
                disabled={i === 0}
                h="30px"
                miw="30px"
                onClick={() => {
                  handleAnswerRemove(answer.id)
                }}
                size="md"
                variant="light"
              >
                <IconX size="18px" />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
        <Button
          disabled={state.answers.size >= 5}
          leftSection={<IconPlus size="14px" />}
          mt="sm"
          onClick={handleAnswerAdd}
          size="xs"
          styles={{ section: { marginRight: '5px' } }}
          variant="light"
        >
          Add Answer
        </Button>
      </Stack>
      <Divider />
      <MultipleChoice component={component} />
    </Stack>
  )
}
