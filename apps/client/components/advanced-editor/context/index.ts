import { createContext } from 'react'
import type { JSONContent } from '@tiptap/core'
import type { InteractiveComponent } from '../types'

export const AdvancedEditorContext = createContext<{
  mode: 'edit' | 'preview' | 'view'
  constructorOpened: boolean
  componentToEdit: InteractiveComponent | null
  openConstructor: (component?: InteractiveComponent) => void
  closeConstructor: () => void
  content: JSONContent
  interactiveComponents: Record<string, InteractiveComponent>
  setComponentToEdit: (component: InteractiveComponent) => void
  setInteractiveComponents: (
    components: Record<string, InteractiveComponent>,
  ) => void
  addInteractiveComponent: (component: InteractiveComponent) => void
}>({
  mode: 'edit',
  componentToEdit: null,
  constructorOpened: false,
  openConstructor: () => {},
  closeConstructor: () => {},
  setComponentToEdit: () => {},
  content: '{}' as unknown as JSONContent,
  interactiveComponents: {},
  setInteractiveComponents: () => {},
  addInteractiveComponent: () => {},
})
