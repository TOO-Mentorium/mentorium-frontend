'use client'

import { useMemo } from 'react'
import type { Extension } from '@tiptap/core'
import { generateHTML } from '@tiptap/core'
import { createLowlight } from 'lowlight'
import ts from 'highlight.js/lib/languages/typescript'
import js from 'highlight.js/lib/languages/javascript'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import { Link } from '@mantine/tiptap'
import InteractiveComponentExtension from '../advanced-editor/components/interactive-component/extension'

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

export const AdvancedEditorView = ({
  stringifiedJson,
}: {
  stringifiedJson: string
}) => {
  const formattedJson = JSON.parse(stringifiedJson)

  console.log(formattedJson)

  const output = useMemo(() => {
    return generateHTML(formattedJson, extensions as Extension[])
  }, [formattedJson])

  return <div dangerouslySetInnerHTML={{ __html: output }} />
}
