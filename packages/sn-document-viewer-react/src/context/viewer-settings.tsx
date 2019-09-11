import React from 'react'
import { DocumentViewerProps } from '../components/DocumentViewer'

export const defaultViewerProps: DocumentViewerProps = {
  documentIdOrPath: '',
}

export const ViewerSettingsContext = React.createContext<DocumentViewerProps>(defaultViewerProps)
