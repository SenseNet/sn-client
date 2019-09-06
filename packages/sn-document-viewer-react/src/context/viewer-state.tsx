import React, { useEffect, useState } from 'react'
import { deepMerge } from '@sensenet/client-utils'
import { ViewerState } from '../models/viewer-state'

export const defaultViewerState: ViewerState = {
  activePages: [1],
  zoomMode: 'fit',
  customZoomLevel: 3,
  showWatermark: false,
  showRedaction: true,
  showShapes: true,
  showThumbnails: false,
  fitRelativeZoomLevel: 0,
  showComments: false,
}
export const ViewerStateContext = React.createContext(defaultViewerState)

export const ViewerStateProvider: React.FC<{ options?: Partial<ViewerState> }> = props => {
  const [state, setState] = useState(deepMerge({ ...defaultViewerState }, props.options))

  useEffect(() => {
    setState(deepMerge({ ...defaultViewerState }, props.options))
  }, [props.options])

  return <ViewerStateContext.Provider value={state}>{props.children}</ViewerStateContext.Provider>
}
