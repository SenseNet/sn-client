import { generateHTML } from '@tiptap/html'
import { createExtensions } from './extension-list'

export const renderHtml = (model: object) => {
  const extensions = createExtensions()

  return generateHTML(model, extensions as any)
}
