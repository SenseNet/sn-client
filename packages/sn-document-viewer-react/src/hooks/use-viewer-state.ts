import { useContext } from 'react'
import { ViewerStateContext } from '../context/viewer-state'

export const useViewerState = () => useContext(ViewerStateContext)
