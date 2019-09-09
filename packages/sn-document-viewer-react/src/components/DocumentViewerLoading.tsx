import Typography from '@material-ui/core/Typography'
import React from 'react'
import { useLocalization } from '../hooks'
import { LayoutAppBar } from './LayoutAppBar'

interface DocumentViewerLoadingProps {
  image: string
}

export const DocumentViewerLoading: React.FC<DocumentViewerLoadingProps> = props => {
  const localization = useLocalization()

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}>
      <LayoutAppBar style={{ position: 'fixed', top: 0 }}>
        <span />
      </LayoutAppBar>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'column',
          maxWidth: 500,
          margin: '.5em 0 .6em 0',
        }}>
        <img src={props.image} />
        <Typography variant="h5" color="textSecondary" align="center" style={{ fontWeight: 'bolder' }}>
          {localization.loadingDocument}
        </Typography>
      </div>
    </div>
  )
}
