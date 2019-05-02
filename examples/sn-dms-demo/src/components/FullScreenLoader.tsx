import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'

// tslint:disable-next-line:variable-name
export const FullScreenLoader: React.StatelessComponent = () => (
  <div>
    <div
      className="overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(238,238,238,.8)',
        filter: 'blur(5px)',
        backdropFilter: 'blur(5px)',
      }}
    />
    <div
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <CircularProgress size={50} />
    </div>
  </div>
)
