import { Image } from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/react'

export const SensenetImage = Image.extend({
  renderHTML({ HTMLAttributes }) {
    const { style } = HTMLAttributes
    return ['figure', { style }, ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]]
  },
})
