import { Repository } from '@sensenet/client-core'
import { Editor } from 'tinymce'
import { AccordionPlugin, RepoFilePlugin } from './'

export type PluginRegistrationProps = {
  editor: Editor
  repository?: Repository
}

export const RegisterPlugins = ({ ...props }: PluginRegistrationProps) => {
  AccordionPlugin({ ...props }) /*this is my custom component*/
  RepoFilePlugin({ ...props })
}

export default RegisterPlugins
