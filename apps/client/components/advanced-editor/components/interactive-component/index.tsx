import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import React, { useContext } from 'react'
import { AdvancedEditorContext } from '../../context'
import type {
  CodeChallengeInteractionState,
  MultipleChoiceInteractionState,
  TaskInteractionState,
  InteractiveComponent as TInteractiveComponent,
} from '../../types'
import { InteractiveComponentType } from '../../types'
import { MultipleChoice } from './multiple-choice'
import { Task } from './task'
import { CodeChallenge } from './code-challenge'

type Props = NodeViewProps

const InteractiveComponent = (props: Props) => {
  const {
    interactiveComponents,
    setInteractiveComponents,
    mode,
    handleComplete,
    openConstructor,
  } = useContext(AdvancedEditorContext)

  const component = interactiveComponents[props.node.attrs.id as string]

  const handleEdit = (componentToEdit: TInteractiveComponent) => {
    openConstructor(componentToEdit)
  }

  if (component?.type === InteractiveComponentType.MultipleChoice) {
    const handleInteractionStateUpdate = (
      updatedInteractionState: MultipleChoiceInteractionState,
    ) => {
      setInteractiveComponents({
        ...interactiveComponents,
        [component.id]: {
          ...component,
          interactionState: updatedInteractionState,
        },
      })

      if (updatedInteractionState.completed) {
        handleComplete({
          ...component,
          interactionState: updatedInteractionState,
        })
      }
    }

    return (
      <NodeViewWrapper>
        <MultipleChoice
          component={component}
          mode={mode}
          onEdit={handleEdit}
          onInteractionStateUpdate={handleInteractionStateUpdate}
        />
      </NodeViewWrapper>
    )
  }

  if (component?.type === InteractiveComponentType.Task) {
    const handleInteractionStateUpdate = (
      updatedInteractionState: TaskInteractionState,
    ) => {
      setInteractiveComponents({
        ...interactiveComponents,
        [component.id]: {
          ...component,
          interactionState: updatedInteractionState,
        },
      })

      if (updatedInteractionState.completed) {
        handleComplete({
          ...component,
          interactionState: updatedInteractionState,
        })
      }
    }

    return (
      <NodeViewWrapper>
        <Task
          component={component}
          mode={mode}
          onEdit={handleEdit}
          onInteractionStateUpdate={handleInteractionStateUpdate}
        />
      </NodeViewWrapper>
    )
  }

  if (component?.type === InteractiveComponentType.CodeChallenge) {
    const handleInteractionStateUpdate = (
      updatedInteractionState: CodeChallengeInteractionState,
    ) => {
      setInteractiveComponents({
        ...interactiveComponents,
        [component.id]: {
          ...component,
          interactionState: updatedInteractionState,
        },
      })

      if (updatedInteractionState.completed) {
        handleComplete({
          ...component,
          interactionState: updatedInteractionState,
        })
      }
    }

    return (
      <NodeViewWrapper>
        <CodeChallenge
          component={component}
          mode={mode}
          onEdit={handleEdit}
          onInteractionStateUpdate={handleInteractionStateUpdate}
        />
      </NodeViewWrapper>
    )
  }
}

export default InteractiveComponent
