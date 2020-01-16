import React, { useEffect } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
    },
    progressbar: {
      backgroundImage: 'linear-gradient(to right, #42B871, #009FB5)',
    },
  }),
)

export interface FullScreenLoaderProps {
  onStartLoading?: () => void
  onFinishLoading?: () => void
}

export const FullScreenLoader: React.FunctionComponent<FullScreenLoaderProps> = ({
  onStartLoading,
  onFinishLoading,
}) => {
  const classes = useStyles()

  useEffect(() => {
    onStartLoading && onStartLoading()
    return () => onFinishLoading && onFinishLoading()
  }, [onFinishLoading, onStartLoading])

  return (
    <div className={classes.root}>
      <LinearProgress className={classes.progressbar} />
    </div>
  )
}
