import { mergeAttributes, Node } from '@tiptap/core'

export const PanelLink = Node.create({
  name: 'panelLink',

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

  content: 'inline',

  parseHTML() {
    return [
      {
        tag: 'a.collapsed',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    HTMLAttributes.class = 'panel-link'
    return ['a', mergeAttributes((this.options as any).HTMLAttributes, HTMLAttributes), 0]
  },
})
