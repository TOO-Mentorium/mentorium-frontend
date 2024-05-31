interface InteractiveComponentBase {
  id: string
}

export enum InteractiveComponentType {
  MultipleChoice = 'multipleChoice',
  Task = 'task',
  Code = 'code',
}

export interface MultipleChoiceAnswer {
  id: string
  text: string
  isCorrect: boolean
}

export interface MultipleChoiceInteractionState {
  completed: boolean
  selectedAnswers: string[]
}

export interface MultipleChoiceComponent extends InteractiveComponentBase {
  type: InteractiveComponentType.MultipleChoice
  state: {
    question: string
    answers: Map<string, MultipleChoiceAnswer>
  }
  interactionState: MultipleChoiceInteractionState
}

export interface TaskInteractionState {
  completed: boolean
}

export interface TaskComponent extends InteractiveComponentBase {
  type: InteractiveComponentType.Task
  state: {
    text: string
  }
  interactionState: TaskInteractionState
}

export interface CodeInteractionState {
  errors: string[]
  completed: boolean
}

export interface CodeComponent extends InteractiveComponentBase {
  type: InteractiveComponentType.Code
  state: {
    initialCode: string
    language: string
    tests: string
  }
  interactionState: TaskInteractionState
}

export type InteractiveComponent =
  | MultipleChoiceComponent
  | TaskComponent
  | CodeComponent
