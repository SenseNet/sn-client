import { CircularProgress } from '@material-ui/core'
import React from 'react'

export const FullScreenLoader: React.FunctionComponent = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <CircularProgress />
  </div>
)
