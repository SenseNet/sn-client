import React from 'react'
import { DocumentViewerProps } from '../components/document-viewer'

export const defaultViewerProps: DocumentViewerProps = {
  documentIdOrPath: '',
  renderAppBar: () => null,
}

export const ViewerSettingsContext = React.createContext<DocumentViewerProps>(defaultViewerProps)
