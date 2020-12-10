import { createStyles, makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { useLocalization } from '../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    mainWrapper: {
      display: 'flex',
      justifyContent: 'space-around',
      alignContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    loaderWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'column',
      maxWidth: 500,
      margin: '.5em 0 .6em 0',
    },
    typography: {
      marginTop: '1rem',
      fontWeight: 'bolder',
    },
  })
})

interface DocumentViewerLoadingProps {
  image: string
}

export const DocumentViewerLoading: React.FC<DocumentViewerLoadingProps> = (props) => {
  const classes = useStyles()
  const localization = useLocalization()

  return (
    <div className={classes.mainWrapper}>
      <div className={classes.loaderWrapper}>
        <img src={props.image} alt="Loader" />
        <Typography variant="h5" color="textSecondary" align="center" className={classes.typography}>
          {localization.loadingDocument}
        </Typography>
      </div>
    </div>
  )
}
