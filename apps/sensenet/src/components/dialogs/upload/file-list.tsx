import React from 'react'
import {
  createStyles,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Theme,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import filesize from 'filesize'

type Props = {
  files: File[]
  removeItem: (file: File) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listRoot: {
      padding: theme.spacing(2),
    },
    listItem: {
      width: 'unset',
      backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey[600] : theme.palette.grey[300],
      marginBottom: theme.spacing(1),
    },
    listItemText: {
      paddingLeft: theme.spacing(2),
    },
    square: {
      width: '2rem',
      height: '2rem',
      backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey[400] : theme.palette.grey[600],
      margin: theme.spacing(1),
    },
  }),
)

export const FileList: React.FC<Props> = props => {
  const classes = useStyles()

  return (
    <List className={classes.listRoot}>
      {[...props.files].map(file => (
        <ListItem key={file.lastModified} className={classes.listItem}>
          <div className={classes.square} />
          <ListItemText primary={file.name} className={classes.listItemText} secondary={filesize(file.size)} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="remove"
              onClick={ev => {
                ev.stopPropagation()
                props.removeItem(file)
              }}>
              <CloseIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}
