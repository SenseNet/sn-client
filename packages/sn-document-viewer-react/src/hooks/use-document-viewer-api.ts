import { useContext } from 'react'
import { DocumentViewerApiSettingsContext } from '../context/api-settings'

export const useDocumentViewerApi = () => useContext(DocumentViewerApiSettingsContext)
