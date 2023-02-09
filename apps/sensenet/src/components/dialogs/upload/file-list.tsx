import {
  createStyles,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Theme,
  Tooltip,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import InfoIcon from '@material-ui/icons/Info'
import { clsx } from 'clsx'
import filesize from 'filesize'
import React from 'react'
import { v1 } from 'uuid'
import { useLocalization } from '../../../hooks'
import { FileWithFullPath } from './helper'
import { ProgressBar } from './progress-bar'

type Props = {
  files: FileWithFullPath[]
  removeItem: (file: File) => void
  isUploadInProgress: boolean
  skippedFiles?: FileWithFullPath[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listRoot: {
      padding: theme.spacing(2),
      height: '100%',
    },
    listItem: {
      width: 'unset',
      backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey[600] : theme.palette.grey[300],
      marginBottom: theme.spacing(1),
    },
    listItemText: {
      flexBasis: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
    square: {
      width: '2rem',
      height: '2rem',
      backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey[400] : theme.palette.grey[600],
      margin: theme.spacing(1),
    },
    infoPadding: {
      paddingRight: theme.spacing(12.5),
    },
  }),
)

export const FileList: React.FC<Props> = (props) => {
  const classes = useStyles()
  const localization = useLocalization()

  const isFileSkipped = (file: FileWithFullPath) => {
    return (props.skippedFiles ?? []).some((f) => f === file)
  }

  return (
    <List className={classes.listRoot}>
      {[...props.files].map((file) => (
        <ListItem
          key={v1()}
          className={clsx(classes.listItem, { [classes.infoPadding]: file.progress && file.progress.error })}>
          <div className={classes.square} />
          <ListItemText
            primary={file.fullPath || file.name}
            className={classes.listItemText}
            secondary={filesize(file.size)}
          />
          {file.progress ? (
            <ProgressBar progress={file.progress} />
          ) : isFileSkipped(file) ? (
            localization.uploadProgress.skipped
          ) : null}
          <ListItemSecondaryAction>
            {file.progress && file.progress.error ? (
              <Tooltip title={file.progress.error.message}>
                <IconButton aria-label="error info">
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            ) : null}
            <IconButton
              disabled={props.isUploadInProgress}
              edge="end"
              aria-label="remove"
              onClick={(ev) => {
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
