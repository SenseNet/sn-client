import { JSONContent } from '@tiptap/core'
import { generateHTML } from '@tiptap/html'
import { createExtensions } from './extension-list'

export const renderHtml = (model: JSONContent | JSONContent[]) => {
  const extensions = createExtensions()

  return generateHTML(model, extensions as any)
}
