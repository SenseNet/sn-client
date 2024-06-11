import { mergeAttributes, Node } from '@tiptap/core'

export const PanelHeading = Node.create({
  name: 'panelHeading', // It's recommended to give your nodes a unique name

  parseHTML() {
    return [
      {
        tag: 'div.panel-heading',
      },
    ]
  },

  group: 'panel',

  content: 'panelTitle',

  draggable: true,

  priority: 1100,

  addAttributes() {
    return {
      class: {
        default: 'panel-heading',
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes((this.options as any).HTMLAttributes, HTMLAttributes), 0]
  },
})
