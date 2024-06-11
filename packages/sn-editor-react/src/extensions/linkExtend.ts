import { Link } from '@tiptap/extension-link'

export const LinkExtend = Link.extend({
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

  content: 'block',
})
