import { deepMerge, DeepPartial, ObservableValue } from '@sensenet/client-utils'
import React, { createContext, FC, useCallback, useEffect, useState } from 'react'
import { pageRectModel, ViewerState } from '../models/viewer-state'

export const DEFAULT_ZOOM_LEVEL = 3

export const defaultViewerState: ViewerState & {
  updateState: (newState: DeepPartial<ViewerState>) => void
} = {
  activePage: 1,
  showWatermark: false,
  showRedaction: true,
  showShapes: true,
  showThumbnails: false,
  zoomLevel: DEFAULT_ZOOM_LEVEL,
  rotation: undefined,
  showComments: false,
  hasChanges: false,
  isPlacingCommentMarker: false,
  activeShapePlacing: 'none',
  isCreateCommentActive: false,
  pageToGo: new ObservableValue({ page: 1 }),
  updateState: () => {},
  pagesRects: new Array<pageRectModel>(),
  boxPosition: { left: 0, top: 0, bottom: 0, right: 0 },
}
export const ViewerStateContext = createContext(defaultViewerState)

export const ViewerStateProvider: FC<{ options?: Partial<typeof defaultViewerState> }> = (props) => {
  const [state, setState] = useState<typeof defaultViewerState>(deepMerge({ ...defaultViewerState }, props.options))

  useEffect(() => {
    setState(deepMerge({ ...defaultViewerState }, props.options))
  }, [props.options])

  const updateState = useCallback((callback: DeepPartial<typeof defaultViewerState> | Function) => {
    if (callback instanceof Function) {
      setState((previous) => deepMerge(previous, callback(previous)))
    } else {
      setState((previous) => deepMerge(previous, callback))
    }
  }, [])

  return <ViewerStateContext.Provider value={{ ...state, updateState }}>{props.children}</ViewerStateContext.Provider>
}
