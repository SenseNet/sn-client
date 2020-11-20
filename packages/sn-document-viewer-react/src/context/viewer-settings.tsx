import React from 'react'
import { DocumentViewerProps } from '../components/DocumentViewer'

export const defaultViewerProps: DocumentViewerProps = {
  documentIdOrPath: '',
  renderAppBar: () => null,
}

export const ViewerSettingsContext = React.createContext<DocumentViewerProps>(defaultViewerProps)
