import React from 'react'
import { defaultViewerState, ViewerStateContext } from '../../src/context/viewer-state'

type Props = typeof defaultViewerState & { children: React.ReactNode }

export const ViewerStateContextWrapper = (props: Props) => {
  return <ViewerStateContext.Provider value={{ ...props }}>{props.children}</ViewerStateContext.Provider>
}

ViewerStateContextWrapper.defaultProps = defaultViewerState
