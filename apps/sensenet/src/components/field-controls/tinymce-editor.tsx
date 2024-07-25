/**
 * @module FieldControls
 */
import { ReactClientFieldSetting, TinymceEditor as SnTinymceEditor } from '@sensenet/controls-react'
import React from 'react'
import { useLocalization } from '../../hooks'

/**
 * Field control that represents a RichText field. Available values will be populated from the FieldSettings.
 */
export const TinymceEditor: React.FC<ReactClientFieldSetting> = (props) => {
  const localization = useLocalization()

  return <SnTinymceEditor {...props} localization={{ richTextEditor: localization.editor }} />
}
