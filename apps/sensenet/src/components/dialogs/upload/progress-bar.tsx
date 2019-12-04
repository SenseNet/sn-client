import React from 'react'
import { darken, lighten, makeStyles } from '@material-ui/core/styles'
import { createStyles, Theme } from '@material-ui/core'

import { UploadProgressInfo } from '@sensenet/client-core'
import clsx from 'clsx'
import { useLocalization, useTheme } from '../../../hooks'

const useStyles = makeStyles((theme: Theme) => {
  const getColor = (color: string) => (theme.palette.type === 'light' ? lighten(color, 0.62) : darken(color, 0.5))

  const backgroundPrimary = getColor(theme.palette.primary.main)
  const backgroundError = getColor(theme.palette.error.main)

  return createStyles({
    root: {
      position: 'relative',
      overflow: 'hidden',
      height: 30,
      backgroundColor: backgroundPrimary,
      flexGrow: 3,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexBasis: 100,
    },
    bar: {
      width: '100%',
      position: 'absolute',
      left: 0,
      bottom: 0,
      top: 0,
      transition: 'transform 0.2s linear',
      transformOrigin: 'left',
      backgroundColor: theme.palette.primary.main,
    },
    value: {
      color: theme.palette.common.white,
      zIndex: 1,
      marginRight: theme.spacing(2),
    },
    error: {
      backgroundColor: backgroundError,
    },
  })
})

type Props = {
  progress: UploadProgressInfo
}

export const ProgressBar = (props: Props) => {
  const classes = useStyles()
  const theme = useTheme()
  const localization = useLocalization().uploadProgress
  const inlineStyle: React.CSSProperties = { transform: '' }

  const getProgress = () => {
    if (props.progress.chunkCount == null || props.progress.uploadedChunks == null) {
      return 0
    }
    return Math.round((props.progress.uploadedChunks / props.progress.chunkCount) * 100)
  }

  const getProgressText = () => {
    if (props.progress.error) {
      return localization.uploadFailed
    }

    if (props.progress.completed) {
      return localization.uploadCompleted
    }

    return `${getProgress()}%`
  }

  let transform = getProgress() - 100
  if (theme.direction === 'rtl') {
    transform = -transform
  }
  inlineStyle.transform = `translateX(${transform}%)`

  return (
    <div
      className={clsx(classes.root, { [classes.error]: props.progress.error })}
      role="progressbar"
      aria-valuenow={getProgress()}>
      <div className={classes.bar} style={inlineStyle} />
      <p className={classes.value}>{getProgressText()}</p>
    </div>
  )
}
