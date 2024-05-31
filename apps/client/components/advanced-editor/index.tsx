'use client'

import { generateHTML, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState } from 'react'
import Image from '@tiptap/extension-image'
import { createLowlight } from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { RichTextEditor, Link } from '@mantine/tiptap'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import { v4 as uuidv4 } from 'uuid'
import ts from 'highlight.js/lib/languages/typescript'
import js from 'highlight.js/lib/languages/javascript'
import type { Editor, Extension, JSONContent } from '@tiptap/core'
import type { InteractiveComponent } from './types'
import { AdvancedEditorContext } from './context'
import InteractiveComponentExtension from './components/interactive-component/extension'
import { AddImage } from './components/add-image'
import { InteractiveComponentConstructor } from './components/interactive-component-constructor'
import classNames from './index.module.css'

const lowlight = createLowlight()

lowlight.register({ js, ts })

const extensions = [
  InteractiveComponentExtension,
  Image,
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
  Highlight,
  Underline,
  Link,
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: 'js',
  }),
]

const replacer = (key: string, value: any) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    }
  }

  return value
}

const reviver = (key: string, value: any) => {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value)
    }
  }
  return value
}

interface Props {
  mode: 'view' | 'preview' | 'edit'
  value?: {
    content: string
    interactiveComponents: string
  }
  onChange?: ({
    content,
    interactiveComponents,
  }: {
    content: string
    interactiveComponents: string
  }) => void
  error?: boolean
  onUpdateProgress: (interactiveComponents: string) => void
  editable?: boolean
}

export const AdvancedEditor = ({
  value,
  mode = 'edit',
  editable = true,
  onChange,
  onUpdateProgress,
  error,
}: Props) => {
  const parsedExtenralContent = JSON.parse(value?.content ?? '{}', reviver)
  const parsedExternalInteractiveComponents =
    JSON.parse(value?.interactiveComponents ?? '{}', reviver) || {}

  const [content, setContent] = useState(parsedExtenralContent)
  const [interactiveComponents, setInteractiveComponents] = useState(
    parsedExternalInteractiveComponents,
  )

  const [constructorOpened, setConstructorOpened] = useState(false)
  const [componentToEdit, setComponentToEdit] =
    useState<InteractiveComponent | null>(null)

  useEffect(() => {
    const stringifiedInteractiveComponents = JSON.stringify(
      interactiveComponents,
      replacer,
    )
    const stringifiedContent = JSON.stringify(content, replacer)

    onChange?.({
      interactiveComponents: stringifiedInteractiveComponents,
      content: stringifiedContent,
    })
  }, [content, interactiveComponents, onChange])

  const handleContentUpdate = ({ editor }: { editor: Editor }) => {
    const contentAsJSON = editor.getJSON()

    setContent(contentAsJSON)
  }

  const editor = useEditor({
    extensions,
    onUpdate: handleContentUpdate,
    content,
    editable: editable ?? true,
    autofocus: true,
  })

  const handleInteractiveComponentAdd = (component: InteractiveComponent) => {
    const generatedId = uuidv4()

    setInteractiveComponents({
      ...interactiveComponents,
      [generatedId]: {
        ...component,
        id: generatedId,
      },
    })

    editor
      ?.chain()
      .focus()
      .insertContent(
        `<interactive-component id="${generatedId}"></interactive-component>`,
      )
      .run()
  }

  const handleConstructorOpen = (component?: InteractiveComponent) => {
    if (component) {
      setComponentToEdit(component)
    }

    setConstructorOpened(true)
  }

  const handleConstructorClose = () => {
    setConstructorOpened(false)

    if (componentToEdit) {
      setComponentToEdit(null)
    }
  }

  const handleComplete = () => {
    const stringifiedInteractiveComponents = JSON.stringify(
      interactiveComponents,
      replacer,
    )

    onUpdateProgress(stringifiedInteractiveComponents)
  }

  return (
    <AdvancedEditorContext.Provider
      value={{
        mode,
        content,
        interactiveComponents,
        constructorOpened,
        setInteractiveComponents,
        setComponentToEdit,
        componentToEdit,
        handleComplete,
        openConstructor: handleConstructorOpen,
        closeConstructor: handleConstructorClose,
        addInteractiveComponent: handleInteractiveComponentAdd,
      }}
    >
      <RichTextEditor
        classNames={{ root: classNames.wrapper }}
        data-editable={editable}
        data-error={error}
        editor={editor}
        mb="5px"
        mt="3px"
      >
        {editable ? (
          <RichTextEditor.Toolbar sticky>
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
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
              <RichTextEditor.H5 />
              <RichTextEditor.H6 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.CodeBlock />

              <InteractiveComponentConstructor />
              <AddImage
                onComplete={(url) =>
                  editor?.chain().focus().setImage({ src: url }).run()
                }
              />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
        ) : null}
        <RichTextEditor.Content bg={editable ? 'dark.7' : 'none'} />
      </RichTextEditor>
    </AdvancedEditorContext.Provider>
  )
}
