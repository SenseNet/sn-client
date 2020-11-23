import { ReactClientFieldSetting, AllowedChildTypes as SnAllowedChildTypes } from '@sensenet/controls-react'
import { createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

const ITEM_HEIGHT = 48

const useStyles = makeStyles(() =>
  createStyles({
    inputContainer: {
      padding: '4px 0',
    },
    input: {
      margin: 0,
    },
    button: {
      padding: '0 0 0 10px',
    },
    listContainer: {
      maxHeight: ITEM_HEIGHT * 5,
    },
    list: {
      padding: 0,
      marginTop: '9px',
      height: '80px',
      overflowY: 'scroll',
    },
    listItem: {
      paddingLeft: 0,
    },
  }),
)

export const AllowedChildTypes: React.FC<ReactClientFieldSetting> = (props) => {
  const classes = useStyles()
  return <SnAllowedChildTypes {...props} classes={classes} />
}
