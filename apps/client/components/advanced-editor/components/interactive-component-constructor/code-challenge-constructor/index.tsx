import { Box, Divider, InputWrapper, Paper, Stack } from '@mantine/core'
import { Editor } from '@monaco-editor/react'
import type { CodeChallengeComponent } from '../../../types'
import { CodeChallenge } from '../../interactive-component/code-challenge'

interface Props {
  component: CodeChallengeComponent
  onUpdate: (updatedComponent: CodeChallengeComponent) => void
}

export const CodeChallengeConstructor = ({ component, onUpdate }: Props) => {
  const { state } = component

  const handleCodeTemplateChange = (value: string) => {
    onUpdate({
      ...component,
      state: {
        ...state,
        initialCode: value,
      },
    })
  }

  const handleTestsChange = (value: string) => {
    onUpdate({
      ...component,
      state: {
        ...state,
        tests: value,
      },
    })
  }

  return (
    <Stack
      justify="flex-start"
      style={{ overflowY: 'scroll', maxHeight: '70vh' }}
    >
      <InputWrapper label="Code template">
        <Box mt="3px">
          <Editor
            defaultLanguage="javascript"
            height="200px"
            onChange={(value) => {
              handleCodeTemplateChange(value ?? '')
            }}
            theme="vs-dark"
            value={state.initialCode}
          />
        </Box>
      </InputWrapper>
      <InputWrapper label="Tests">
        <Box mt="3px">
          <Editor
            defaultLanguage="javascript"
            height="200px"
            onChange={(value) => {
              handleTestsChange(value ?? '')
            }}
            theme="vs-dark"
            value={state.tests}
          />
        </Box>
      </InputWrapper>
      <Divider />
      <Paper p="sm">
        <CodeChallenge component={component} mode="edit" />
      </Paper>
    </Stack>
  )
}
