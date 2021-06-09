import { Image } from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/react'

export const SensenetImage = Image.extend({
  // defaultOptions: {
  //   ...Image.options,
  //   sizes: ['inline', 'block', 'left', 'right'],
  // },
  // addAttributes() {
  //   return {
  //     ...this.parent?.(),
  //     display: {
  //       default: 'inline',
  //       parseHTML: (element) => {
  //         return {
  //           display: element.getAttribute('data-display'),
  //         }
  //       },
  //       renderHTML: (attributes) => {
  //         return {
  //           'data-display': attributes.display,
  //         }
  //       },
  //     },
  //   }
  // },
  renderHTML({ HTMLAttributes }) {
    const { style } = HTMLAttributes
    return ['figure', { style }, ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]]
  },
})
