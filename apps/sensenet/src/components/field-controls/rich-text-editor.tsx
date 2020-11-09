/**
 * @module FieldControls
 */
import { ReactClientFieldSetting, RichTextEditor as SnRichTextEditor } from '@sensenet/controls-react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    richTextEditor: {
      width: '100%',
      '& .ql-toolbar': {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.common.white : '#1e1e1e',
        borderColor: theme.palette.type === 'light' ? 'rgb(204, 204, 204)' : '#1e1e1e',
      },
      '& .ql-fill': {
        fill: theme.palette.type === 'light' ? '#444' : 'white',
      },
      '& .ql-stroke': {
        stroke: theme.palette.type === 'light' ? '#444' : 'white',
      },
      '& .ql-picker-label': {
        color: theme.palette.type === 'light' ? '#444' : 'white',
      },
      '& .ql-container': {
        minHeight: '124px',
      },
    },
  })
})

/**
 * Field control that represents a LongText field. Available values will be populated from the FieldSettings.
 */
export const RichTextEditor: React.FC<ReactClientFieldSetting> = (props) => {
  const classes = useStyles()

  return <SnRichTextEditor {...props} classes={classes} />
}
