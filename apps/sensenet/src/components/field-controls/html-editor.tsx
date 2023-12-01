/**
 * @module FieldControls
 */

import { useTheme } from '@material-ui/core'
import { ReactClientFieldSetting, HtmlEditor as SnHtmlEditor } from '@sensenet/controls-react'
import React from 'react'

/**
 * Field control that represents a LongText field with Html highlights. Available values will be populated from the FieldSettings.
 */
export const HtmlEditor: React.FC<ReactClientFieldSetting> = (props) => {
  const theme = useTheme()

  return <SnHtmlEditor theme={theme} {...props} />
}
