import {
  Box,
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { RichTextEditor } from '@mantine/tiptap'
import { useContext, useEffect, useState } from 'react'
import {
  IconCode,
  IconListCheck,
  IconPointer,
  IconQuestionMark,
} from '@tabler/icons-react'
import { v4 as uuidv4 } from 'uuid'
import {
  InteractiveComponentType,
  type InteractiveComponent,
} from '../../types'
import { AdvancedEditorContext } from '../../context'
import { MultipleChoiceCostructor } from './muptiple-choice-constructor'
import classNames from './index.module.css'
import { TaskCostructor } from './task-constructor'
import { CodeChallengeConstructor } from './code-challenge-constructor'

const componentTypes = [
  {
    icon: <IconQuestionMark size="20px" />,
    label: 'Multiple choice',
    value: InteractiveComponentType.MultipleChoice,
    description:
      "Test your student's understanding of the material with a multiple-choice question.",
  },
  {
    icon: <IconListCheck size="20px" />,
    label: 'Task',
    value: InteractiveComponentType.Task,
    description:
      'Give the user the opportunity to mark progress during the learning process',
  },
  {
    icon: <IconCode size="20px" />,
    label: 'Code',
    value: InteractiveComponentType.CodeChallenge,
    description: "Test your's student coding skills",
  },
]

const generateComponentTemplate = (
  type: InteractiveComponentType,
): InteractiveComponent => {
  if (type === InteractiveComponentType.Task) {
    return {
      id: '',
      type: InteractiveComponentType.Task,
      state: {
        text: '',
      },
      interactionState: {
        completed: false,
      },
    }
  }

  if (type === InteractiveComponentType.CodeChallenge) {
    return {
      id: '',
      type: InteractiveComponentType.CodeChallenge,
      state: {
        initialCode: '// write template for student code here',
        language: 'typescript',
        tests:
          '// write tests for student code, to check if it works correctly',
      },
      interactionState: {
        completed: false,
        code: '',
        errors: [],
      },
    }
  }

  const answerId = uuidv4()
  const answers = new Map()

  answers.set(answerId, {
    id: answerId,
    text: '',
    isCorrect: false,
  })

  return {
    id: '',
    type: InteractiveComponentType.MultipleChoice,
    state: {
      question: '',
      answers,
    },
    interactionState: {
      completed: false,
      selectedAnswers: [],
    },
  }
}

export const InteractiveComponentConstructor = () => {
  const {
    constructorOpened,
    closeConstructor,
    openConstructor,
    componentToEdit,
    addInteractiveComponent,
  } = useContext(AdvancedEditorContext)

  const [currentComponent, setCurrentComponent] =
    useState<InteractiveComponent | null>(
      componentToEdit ??
        generateComponentTemplate(InteractiveComponentType.MultipleChoice),
    )

  useEffect(() => {
    if (componentToEdit) {
      setCurrentComponent(componentToEdit)
    }
  }, [componentToEdit])

  const reset = () => {
    const baseTemplate = generateComponentTemplate(
      InteractiveComponentType.MultipleChoice,
    )

    setCurrentComponent(baseTemplate)
  }

  const handleUpdate = (updatedComponent: InteractiveComponent) => {
    setCurrentComponent(updatedComponent)
  }

  const handleComplete = () => {
    if (!currentComponent) {
      return
    }

    addInteractiveComponent(currentComponent)

    reset()

    closeConstructor()
  }

  const handleClose = () => {
    reset()

    closeConstructor()
  }

  return (
    <>
      <RichTextEditor.Control
        aria-label="Insert interactive component"
        onClick={() => {
          openConstructor()
        }}
        title="Insert interactive component"
      >
        <IconPointer size="1rem" stroke={1.5} />
      </RichTextEditor.Control>
      <Modal
        onClose={handleClose}
        opened={constructorOpened}
        size="1000px"
        title="Interactive Component Constructor"
      >
        <Stack align="flex-end" w="100%">
          <Group align="flex-start" gap="lg" w="100%" wrap="nowrap">
            <Stack w="400px">
              {componentTypes.map((type) => (
                <Paper
                  className={classNames.interactiveComponentType}
                  h="150px"
                  key={type.label}
                  onClick={() => {
                    const generatedComponent = generateComponentTemplate(
                      type.value,
                    )

                    setCurrentComponent(generatedComponent)
                  }}
                  p="sm"
                  style={{ cursor: 'pointer' }}
                >
                  <Group justify="space-between">
                    <Stack gap="xs">
                      <Group align="center" gap="sm">
                        <ThemeIcon variant="light">{type.icon}</ThemeIcon>
                        <Text fw={500}>{type.label}</Text>
                      </Group>
                      <Text c="dimmed" size="sm">
                        {type.description}
                      </Text>
                    </Stack>
                  </Group>
                  {currentComponent?.type === type.value ? (
                    <Box className={classNames.rightBorder} h="100%" />
                  ) : null}
                </Paper>
              ))}
            </Stack>
            <Stack justify="flex-start" w="100%">
              {currentComponent?.type ===
              InteractiveComponentType.MultipleChoice ? (
                <MultipleChoiceCostructor
                  component={currentComponent}
                  onUpdate={handleUpdate}
                />
              ) : null}
              {currentComponent?.type === InteractiveComponentType.Task ? (
                <TaskCostructor
                  component={currentComponent}
                  onUpdate={handleUpdate}
                />
              ) : null}
              {currentComponent?.type ===
              InteractiveComponentType.CodeChallenge ? (
                <CodeChallengeConstructor
                  component={currentComponent}
                  onUpdate={handleUpdate}
                />
              ) : null}
            </Stack>
          </Group>
          <Button onClick={handleComplete}>Save</Button>
        </Stack>
      </Modal>
    </>
  )
}
