import { mergeAttributes, Node } from '@tiptap/core'

export const PanelTitle = Node.create({
  name: 'panelTitle',

  draggable: true,

  priority: 1200,

  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => {
          return {
            class: element.getAttribute('class'),
          }
        },
        renderHTML: (attributes) => {
          if (!attributes.class) {
            return {}
          }
          return {
            class: attributes.class,
          }
        },
      },
      style: {
        renderHTML: (attributes) => {
          if (!attributes.style) {
            return {}
          }
          return {
            style: attributes.style,
          }
        },
      },
    }
  },

  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'h3',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['h3', mergeAttributes((this.options as any).HTMLAttributes, HTMLAttributes), 0]
  },
})
