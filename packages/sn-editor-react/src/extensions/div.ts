import { mergeAttributes, Node } from '@tiptap/core'

export const DivNode = Node.create({
  name: 'div',

  priority: 1100,

  draggable: true,

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

  parseHTML() {
    return [
      {
        tag: 'div',
      },
    ]
  },

  group: 'block',

  content: 'block*',

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes((this.options as any).HTMLAttributes, HTMLAttributes), 0]
  },
})
