import Editor from '@monaco-editor/react'

export const CodeEditor = () => {
  return (
    <Editor
      defaultLanguage="javascript"
      defaultValue="// Начните писать свой код здесь"
      height="90vh"
    />
  )
}
