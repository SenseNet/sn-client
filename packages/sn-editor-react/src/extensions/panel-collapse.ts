import { Node } from '@tiptap/core'

export const PanelColapse = Node.create({
  name: 'panelCollapse', // It's recommended to give your nodes a unique name

  parseHTML() {
    return [
      {
        tag: 'div.panel-collapse',
      },
    ]
  },

  group: 'panel',

  content: 'panelBody',

  draggable: true,

  priority: 1100,

  addAttributes() {
    return {
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

  renderHTML({ HTMLAttributes }) {
    HTMLAttributes.class = 'panel-collapse collapse'
    return ['div', HTMLAttributes, 0]
  },
})
