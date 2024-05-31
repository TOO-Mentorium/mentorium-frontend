interface InteractiveComponentBase {
  id: string
}

export enum InteractiveComponentType {
  MultipleChoice = 'multipleChoice',
  Task = 'task',
  CodeChallenge = 'codeChallenge',
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

export interface CodeChallengeInteractionState {
  errors: string[]
  code: string
  completed: boolean
}

export interface CodeChallengeComponent extends InteractiveComponentBase {
  type: InteractiveComponentType.CodeChallenge
  state: {
    initialCode: string
    language: string
    tests: string
  }
  interactionState: CodeChallengeInteractionState
}

export type InteractiveComponent =
  | MultipleChoiceComponent
  | TaskComponent
  | CodeChallengeComponent
