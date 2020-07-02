import { Quill } from 'react-quill'
import QuillOEmbedModule from './QuillOEmbedModule'

export const quillRegister = () => {
  Quill.register('modules/oembed', QuillOEmbedModule)
}
