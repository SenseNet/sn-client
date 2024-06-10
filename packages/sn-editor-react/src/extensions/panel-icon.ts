import { Mark, mergeAttributes } from '@tiptap/core'

export const PanelIcon = Mark.create({
  name: 'panelIcon',

  draggable: true,

  priority: 1200,

  addAttributes() {
    return {
      href: {
        default: null,
      },
      target: {
        default: (this.options as any).HTMLAttributes?.target,
      },
      rel: {
        default: (this.options as any).HTMLAttributes?.rel,
      },
      class: {
        default: (this.options as any).HTMLAttributes?.class,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'a.collapsed',
        getAttrs: (dom) => {
          const href = (dom as HTMLElement).getAttribute('href')

          return { href }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['a', mergeAttributes((this.options as any).HTMLAttributes, HTMLAttributes), ['i', { class: 'svg' }]]
  },
})
