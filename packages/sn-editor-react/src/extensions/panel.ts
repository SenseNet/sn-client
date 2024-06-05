import { mergeAttributes, Node } from '@tiptap/core'

export const Panel = Node.create({
  name: 'panel', // It's recommended to give your nodes a unique name

  parseHTML() {
    return [
      {
        tag: 'div.panel',
      },
    ]
  },

  group: 'block',

  content: '(panelHeading | panelCollapse)*', // Define the content of the node

  draggable: true,

  addAttributes() {
    return {
      class: {
        default: 'panel',
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes((this.options as any).HTMLAttributes, HTMLAttributes), 0]
  },
})
