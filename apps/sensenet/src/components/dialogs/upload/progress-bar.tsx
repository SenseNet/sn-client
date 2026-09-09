import { createStyles, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { UploadProgressInfo } from '@sensenet/client-core'
import { clsx } from 'clsx'
import React from 'react'

import { useLocalization } from '../../../hooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 0,
      width: '100%',
    },
    statusRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing(1),
      marginBottom: theme.spacing(0.75),
    },
    status: {
      color: theme.palette.text.secondary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    value: {
      color: theme.palette.text.secondary,
      flexShrink: 0,
      fontVariantNumeric: 'tabular-nums',
    },
    track: {
      height: 6,
      width: '100%',
      overflow: 'hidden',
      borderRadius: 3,
      backgroundColor: theme.palette.action.disabledBackground,
    },
    bar: {
      height: '100%',
      borderRadius: 3,
      backgroundColor: theme.palette.primary.main,
      transition: 'width 200ms ease-out',
    },
    completedBar: {
      backgroundColor: theme.palette.success.main,
    },
    errorBar: {
      backgroundColor: theme.palette.error.main,
    },
    completedStatus: {
      color: theme.palette.success.main,
    },
    errorStatus: {
      color: theme.palette.error.main,
    },
  }),
)

type Props = {
  progress: UploadProgressInfo
}

export const getProgressPercentage = (progress: UploadProgressInfo) => {
  if (progress.completed) {
    return 100
  }

  if (!progress.chunkCount || progress.uploadedChunks == null) {
    return 0
  }

  return Math.max(0, Math.min(100, Math.round((progress.uploadedChunks / progress.chunkCount) * 100)))
}

export const ProgressBar = (props: Props) => {
  const classes = useStyles()
  const localization = useLocalization().uploadProgress
  const progress = getProgressPercentage(props.progress)
  const isError = Boolean(props.progress.error)
  const isCompleted = props.progress.completed

  const statusText = isError
    ? localization.uploadFailed
    : isCompleted
    ? localization.uploadCompleted
    : localization.uploading

  // A terminal state fills the visual track so failure and completion are
  // immediately distinguishable. The numeric value still describes bytes sent.
  const visualProgress = isError ? 100 : progress

  return (
    <div
      className={classes.root}
      role="progressbar"
      aria-label={statusText}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-valuetext={statusText}>
      <div className={classes.statusRow}>
        <Typography
          variant="caption"
          className={clsx(classes.status, {
            [classes.completedStatus]: isCompleted,
            [classes.errorStatus]: isError,
          })}>
          {statusText}
        </Typography>
        <Typography variant="caption" className={classes.value}>
          {isCompleted ? '100%' : isError ? localization.failedStatus : `${progress}%`}
        </Typography>
      </div>
      <div className={classes.track} aria-hidden="true">
        <div
          className={clsx(classes.bar, {
            [classes.completedBar]: isCompleted,
            [classes.errorBar]: isError,
          })}
          style={{ width: `${visualProgress}%` }}
        />
      </div>
    </div>
  )
}
