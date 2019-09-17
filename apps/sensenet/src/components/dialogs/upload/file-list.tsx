import React from 'react'
import {
  createStyles,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Theme,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import filesize from 'filesize'
import { FileWithFullPath } from './helper'

type Props = {
  files: FileWithFullPath[]
  removeItem: (file: File) => void
  isUploadInProgress: boolean
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
    progress: {
      flexGrow: 3,
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
          <ListItemText
            primary={file.fullPath || file.name}
            className={classes.listItemText}
            secondary={filesize(file.size)}
          />
          {file.progress && file.progress.chunkCount != null && file.progress.uploadedChunks != null ? (
            <LinearProgress
              variant="determinate"
              className={classes.progress}
              value={(file.progress.uploadedChunks / file.progress.chunkCount) * 100}
            />
          ) : null}
          <ListItemSecondaryAction>
            <IconButton
              disabled={props.isUploadInProgress}
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
