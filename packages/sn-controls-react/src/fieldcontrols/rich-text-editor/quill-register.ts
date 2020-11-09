import { Quill } from 'react-quill'
import QuillOEmbedModule from './quill-oembed-module'

export const quillRegister = () => {
  Quill.register('modules/oembed', QuillOEmbedModule)
}
