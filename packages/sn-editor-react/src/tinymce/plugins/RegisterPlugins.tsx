import { Editor } from 'tinymce'
import { AccordionPlugin } from './'

export type PluginRegistrationProps = {
  editor: Editor
}

export const RegisterPlugins = ({ ...props }: PluginRegistrationProps) => {
  AccordionPlugin({ ...props }) /*this is my custom component*/
}

export default RegisterPlugins
