/**
 * @module FieldControls
 */
import { ReactClientFieldSetting, RichTextEditor as SnRichTextEditor } from '@sensenet/controls-react'
import React from 'react'
import { useLocalization } from '../../hooks'

/**
 * Field control that represents a RichText field. Available values will be populated from the FieldSettings.
 */
export const RichTextEditor: React.FC<ReactClientFieldSetting> = (props) => {
  const localization = useLocalization()

  return <SnRichTextEditor {...props} localization={{ richTextEditor: localization.editor }} />
}
