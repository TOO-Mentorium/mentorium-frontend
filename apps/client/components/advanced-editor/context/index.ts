import { createContext } from 'react'
import type { InteractiveComponent } from '../types'

export const AdvancedEditorContext = createContext<{
  constructorOpened: boolean
  componentToEdit: InteractiveComponent | null
  openConstructor: (component?: InteractiveComponent) => void
  closeConstructor: () => void
  inConstructor: boolean
  content: string
  interactiveComponents: Record<string, InteractiveComponent>
  setComponentToEdit: (component: InteractiveComponent) => void
  setInteractiveComponents: (
    components: Record<string, InteractiveComponent>,
  ) => void
  addInteractiveComponent: (component: InteractiveComponent) => void
}>({
  componentToEdit: null,
  constructorOpened: false,
  openConstructor: () => {},
  closeConstructor: () => {},
  setComponentToEdit: () => {},
  inConstructor: true,
  content: '',
  interactiveComponents: {},
  setInteractiveComponents: () => {},
  addInteractiveComponent: () => {},
})
