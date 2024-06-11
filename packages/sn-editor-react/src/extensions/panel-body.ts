import { mergeAttributes, Node } from '@tiptap/core'

export const PanelBody = Node.create({
  name: 'panelBody', // It's recommended to give your nodes a unique name

  parseHTML() {
    return [
      {
        tag: 'div.panel-body',
      },
    ]
  },

  group: 'panel',

  content: 'inline*',

  draggable: true,

  priority: 1100,

  addAttributes() {
    return {
      class: {
        default: 'panel-body',
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes((this.options as any).HTMLAttributes, HTMLAttributes), 0]
  },
})
