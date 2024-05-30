import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useState } from 'react'
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
import type { InteractiveComponent } from './types'
import { AdvancedEditorContext } from './context'
import InteractiveComponentExtension from './components/interactive-component/extension'
import { AddImage } from './components/add-image'
import { InteractiveComponentConstructor } from './components/interactive-component-constructor'

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

interface Props {
  inConstructor?: boolean
}

export const AdvancedEditor = ({ inConstructor = false, value }: Props) => {
  const [content, setContent] = useState('')
  const [interactiveComponents, setInteractiveComponents] = useState({})
  const [constructorOpened, setConstructorOpened] = useState(false)
  const [componentToEdit, setComponentToEdit] =
    useState<InteractiveComponent | null>(null)

  const editor = useEditor({
    extensions,
    content,
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

  return (
    <AdvancedEditorContext.Provider
      value={{
        inConstructor,
        content,
        interactiveComponents,
        constructorOpened,
        setInteractiveComponents,
        setComponentToEdit,
        componentToEdit,
        openConstructor: handleConstructorOpen,
        closeConstructor: handleConstructorClose,
        addInteractiveComponent: handleInteractiveComponentAdd,
      }}
    >
      <RichTextEditor editor={editor}>
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
        <RichTextEditor.Content />
      </RichTextEditor>
    </AdvancedEditorContext.Provider>
  )
}
