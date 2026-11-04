import { Repository } from '@sensenet/client-core'
import { Editor } from 'tinymce'
import { AccordionPlugin, RepoFilePlugin } from './'

export type PluginRegistrationProps = {
  editor: Editor
  repository?: Repository
  path?: string
}

export const RegisterPlugins = ({ ...props }: PluginRegistrationProps) => {
  AccordionPlugin({ ...props })
  RepoFilePlugin({ ...props })
}

export default RegisterPlugins
