import { useContext } from 'react'
import { ViewerSettingsContext } from '../context/viewer-settings'

export const useViewerSettings = () => useContext(ViewerSettingsContext)
