import React from 'react'
import { DocumentViewerProps } from '../components/DocumentViewer'

export const defaultViewerProps: DocumentViewerProps = {
  documentIdOrPath: '',
  hostName: '',
}

export const ViewerSettingsContext = React.createContext<DocumentViewerProps>(defaultViewerProps)
