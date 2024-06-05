import { Paragraph } from '@tiptap/extension-paragraph'

export const ParagraphExtend = Paragraph.extend({
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

  parseHTML() {
    return [{ tag: 'p' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', HTMLAttributes, 0]
  },
})
