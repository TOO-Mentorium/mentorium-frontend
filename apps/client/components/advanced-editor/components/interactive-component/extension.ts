import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import InteractiveComponent from '.'

const InteractiveComponentExtension = Node.create({
  name: 'interactiveComponent',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      id: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'interactive-component',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['interactive-component', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(InteractiveComponent)
  },
})

export default InteractiveComponentExtension
