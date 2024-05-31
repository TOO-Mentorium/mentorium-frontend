import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import { RichTextEditor, Link } from '@mantine/tiptap'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import type { Editor } from '@tiptap/core'
import classNames from './index.module.css'

interface Props {
  value: string
  error: boolean
  onChange: (content: string) => void
}

const extensions = [
  Placeholder.configure({ placeholder: "Let's start" }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Underline,
  Link,
]

export const SimpleTextEditor = ({ value, onChange, error }: Props) => {
  const handleContentUpdate = ({ editor }: { editor: Editor }) => {
    const contentAsJSON = editor.getJSON()
    const stringifiedContent = JSON.stringify(contentAsJSON)

    onChange(stringifiedContent)
  }

  const editor = useEditor({
    extensions,
    onUpdate: handleContentUpdate,
    content: JSON.parse(value),
    autofocus: true,
  })

  return (
    <RichTextEditor
      classNames={{ root: classNames.wrapper }}
      data-error={error}
      editor={editor}
      mb="5px"
      mt="3px"
    >
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>
      <RichTextEditor.Content />
    </RichTextEditor>
  )
}
