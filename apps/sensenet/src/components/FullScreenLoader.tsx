import React, { useEffect } from 'react'
import fullScreenLoader from '../assets/loader-fullscreen.gif'

export interface FullScreenLoaderProps {
  onStartLoading?: () => void
  onFinishLoading?: () => void
}

export const FullScreenLoader: React.FunctionComponent<FullScreenLoaderProps> = props => {
  useEffect(() => {
    props.onStartLoading && props.onStartLoading()
    return () => props.onFinishLoading && props.onFinishLoading()
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <img
        style={{
          maxWidth: '100%',
          margin: 'auto',
          filter: 'drop-shadow(0px 0px 5px white) drop-shadow(0px 0px 3px white) drop-shadow(0px 0px 15px white)',
        }}
        src={fullScreenLoader}
      />
    </div>
  )
}
